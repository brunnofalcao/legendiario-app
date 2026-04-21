/**
 * LEGENDIARIO — Backend Express
 * TEMPLATE DE ESQUELETO. Implementar cada endpoint conforme Manual Técnico seção 6.
 *
 * Principais responsabilidades:
 *  1. Servir arquivos estáticos de ./public
 *  2. Proxy autenticado para Supabase (endpoints /api/*)
 *  3. CRON diário de WhatsApp (roda a cada 60s, checa whatsapp_hour do user)
 *  4. Webhook Hotmart (compra → cria user → dispara email de ativação)
 *  5. Endpoints admin protegidos por ADMIN_KEY
 */

require('dotenv').config();
const express = require('express');
const compression = require('compression');
const cors = require('cors');
const helmet = require('helmet');
const cron = require('node-cron');
const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');

const app = express();
app.use(helmet({ contentSecurityPolicy: false }));
app.use(compression());
app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(express.static('public'));

// --- Supabase (service role: só no backend) ---
let supabase = null;
try {
  if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    console.log('[supabase] Cliente criado com sucesso');
  } else {
    console.warn('[supabase] URL/SERVICE_ROLE_KEY ausentes — endpoints DB vão falhar');
  }
} catch (e) {
  console.error('[supabase] Erro criando cliente:', e.message);
}

// =============================================
// HEALTH CHECK
// =============================================

app.get('/api/health', async (req, res) => {
  const health = {
    ok: true,
    service: 'LEGENDIARIO',
    version: '0.1.0',
    env: process.env.NODE_ENV || 'unknown',
    timestamp: new Date().toISOString(),
    uptime_seconds: Math.round(process.uptime()),
    checks: {
      supabase_configured: !!(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY),
      whatsapp_configured: !!(process.env.WA_TOKEN && process.env.WA_PHONE_NUMBER_ID),
      cloudinary_configured: !!process.env.CLOUDINARY_CLOUD_NAME,
      admin_key_set: !!process.env.ADMIN_KEY,
    }
  };

  // Tenta ping no Supabase se configurado
  if (supabase) {
    try {
      const { error } = await supabase.from('autores').select('id', { count: 'exact', head: true });
      health.checks.supabase_db_reachable = !error;
      if (error) health.checks.supabase_error = error.message;
    } catch (e) {
      health.checks.supabase_db_reachable = false;
      health.checks.supabase_error = e.message;
    }
  }

  res.json(health);
});

// =============================================
// ENDPOINTS DE CONTEÚDO
// =============================================

// GET /api/autores — lista dos 10 autores fictícios
app.get('/api/autores', async (req, res) => {
  if (!supabase) return res.status(503).json({ error: 'database not configured' });
  const { data, error } = await supabase
    .from('autores')
    .select('slug, nome, numero_registro, instagram, arquetipo, cor_hex, bio_curta')
    .eq('ativo', true)
    .order('numero_registro', { ascending: true });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// GET /api/provocacoes/full — retorna TODAS as provocações (source of truth)
app.get('/api/provocacoes/full', async (req, res) => {
  if (!supabase) return res.status(503).json({ error: 'database not configured' });
  const { data, error } = await supabase
    .from('provocacoes')
    .select('*')
    .order('mes', { ascending: true })
    .order('dia', { ascending: true });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// GET /api/provocacao/:dia_ano — retorna uma provocação específica (ex: /api/provocacao/01-15)
app.get('/api/provocacao/:dia_ano', async (req, res) => {
  if (!supabase) return res.status(503).json({ error: 'database not configured' });
  const { dia_ano } = req.params;
  if (!/^\d{2}-\d{2}$/.test(dia_ano)) {
    return res.status(400).json({ error: 'formato inválido, esperado MM-DD (ex: 01-15)' });
  }
  const { data, error } = await supabase
    .from('provocacoes')
    .select('*')
    .eq('dia_ano', dia_ano)
    .single();
  if (error) return res.status(404).json({ error: 'provocação não encontrada', dia_ano });
  res.json(data);
});

// GET /api/provocacao/hoje — atalho para a provocação do dia corrente (timezone BR)
app.get('/api/hoje', async (req, res) => {
  if (!supabase) return res.status(503).json({ error: 'database not configured' });
  const now = new Date(Date.now() - 3 * 60 * 60 * 1000); // America/Sao_Paulo = UTC-3
  const mm = String(now.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(now.getUTCDate()).padStart(2, '0');
  const dia_ano = `${mm}-${dd}`;
  const { data, error } = await supabase
    .from('provocacoes')
    .select('*')
    .eq('dia_ano', dia_ano)
    .single();
  if (error) return res.status(404).json({ error: 'provocação de hoje não encontrada', dia_ano });
  res.json(data);
});

// =============================================
// ENDPOINTS DE USUÁRIO
// =============================================

// POST /api/reads — marca dia como lido
// POST /api/unlocks — gasta crédito e desbloqueia dia perdido
// GET  /api/state   — retorna estado completo do usuário (streak, credits, reads, unlocks, actions)
// POST /api/actions — cria ação
// PATCH /api/actions/:id/toggle — done/pending
// PATCH /api/actions/:id/reminder — define reminder_date

// =============================================
// ENDPOINTS ADMIN (protegido por ADMIN_KEY)
// =============================================

function requireAdmin(req, res, next) {
  if (req.headers['x-admin-key'] !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: 'unauthorized' });
  }
  next();
}

// GET /api/admin/stats — contagens rápidas pro dashboard executivo
app.get('/api/admin/stats', requireAdmin, async (req, res) => {
  if (!supabase) return res.status(503).json({ error: 'db not configured' });
  try {
    const [u, p, r, a] = await Promise.all([
      supabase.from('users').select('*', { count: 'exact', head: true }),
      supabase.from('provocacoes').select('*', { count: 'exact', head: true }),
      supabase.from('user_reads').select('*', { count: 'exact', head: true }),
      supabase.from('user_actions').select('*', { count: 'exact', head: true }),
    ]);
    res.json({
      users: u.count || 0,
      provocacoes: p.count || 0,
      reads: r.count || 0,
      actions: a.count || 0,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/admin/users — lista usuários com contagem de leituras
app.get('/api/admin/users', requireAdmin, async (req, res) => {
  if (!supabase) return res.status(503).json({ error: 'db not configured' });
  const { data: users, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });

  // Agregar reads por user
  const { data: reads } = await supabase.from('user_reads').select('user_id');
  const readsCount = {};
  (reads || []).forEach(r => { readsCount[r.user_id] = (readsCount[r.user_id] || 0) + 1; });
  const enriched = users.map(u => ({ ...u, reads_count: readsCount[u.id] || 0 }));
  res.json(enriched);
});

// POST /api/admin/create-user — cria user via Supabase Admin API (sem precisar confirmar email)
app.post('/api/admin/create-user', requireAdmin, async (req, res) => {
  if (!supabase) return res.status(503).json({ error: 'db not configured' });
  const { email, password, nome } = req.body || {};
  if (!email || !password || password.length < 6) {
    return res.status(400).json({ error: 'email + senha (6+ chars) obrigatórios' });
  }
  try {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // pula confirmação
      user_metadata: { nome }
    });
    if (error) return res.status(400).json({ error: error.message });
    // Trigger do schema já cria public.users — mas garantir:
    await supabase.from('users').upsert({
      id: data.user.id,
      email: data.user.email,
      nome: nome || null,
      perfil_completo: false,
    }, { onConflict: 'id' });
    res.json({ ok: true, user_id: data.user.id, email });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// PATCH /api/admin/provocacao/:id — editar uma provocação
app.patch('/api/admin/provocacao/:id', requireAdmin, async (req, res) => {
  if (!supabase) return res.status(503).json({ error: 'db not configured' });
  const { id } = req.params;
  const allowedFields = ['autor_slug', 'autor_dia', 'autor_numero', 'citacao', 'autor_citacao', 'pergunta', 'texto', 'aspas_autor', 'instagram'];
  const patch = {};
  for (const f of allowedFields) if (f in req.body) patch[f] = req.body[f];
  patch.updated_at = new Date().toISOString();
  const { data, error } = await supabase.from('provocacoes').update(patch).eq('id', id).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// DELETE /api/admin/provocacao/:id
app.delete('/api/admin/provocacao/:id', requireAdmin, async (req, res) => {
  if (!supabase) return res.status(503).json({ error: 'db not configured' });
  const { error } = await supabase.from('provocacoes').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

// GET /api/admin/demographics — agregados simples
app.get('/api/admin/demographics', requireAdmin, async (req, res) => {
  if (!supabase) return res.status(503).json({ error: 'db not configured' });
  const { data: users } = await supabase.from('users').select('estado, profissao, whatsapp_hour, genero');
  const groupBy = (field, fmt) => {
    const counts = {};
    (users || []).forEach(u => {
      const k = u[field];
      if (k != null && k !== '') counts[k] = (counts[k] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([key, count]) => ({ key, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);
  };
  res.json({
    estado: groupBy('estado'),
    profissao: groupBy('profissao'),
    whatsapp_hour: groupBy('whatsapp_hour'),
    genero: groupBy('genero'),
  });
});

// GET /api/admin/whatsapp-status — checar config + logs recentes
app.get('/api/admin/whatsapp-status', requireAdmin, async (req, res) => {
  const token = (process.env.WA_TOKEN || '').trim();
  const status = {
    token_configured: !!(token && !token.includes('PENDENTE') && !token.includes('REUSAR')),
    phone_configured: !!(process.env.WA_PHONE_NUMBER_ID && !String(process.env.WA_PHONE_NUMBER_ID).includes('PENDENTE') && !String(process.env.WA_PHONE_NUMBER_ID).includes('REUSAR')),
    waba_configured: !!(process.env.WA_WABA_ID && !String(process.env.WA_WABA_ID).includes('PENDENTE') && !String(process.env.WA_WABA_ID).includes('REUSAR')),
    api_version: process.env.WA_API_VERSION || 'v22.0',
  };
  if (supabase) {
    const { data } = await supabase
      .from('whatsapp_logs')
      .select('created_at, telefone, template, status, error_message')
      .order('created_at', { ascending: false })
      .limit(20);
    status.recent_logs = data || [];
  }
  res.json(status);
});

// POST /api/admin/whatsapp-test — enviar template pra um número
app.post('/api/admin/whatsapp-test', requireAdmin, async (req, res) => {
  const { phone, template } = req.body || {};
  if (!phone || !template) return res.status(400).json({ error: 'phone + template obrigatórios' });
  try {
    const r = await sendTemplate(phone, template, ['Teste']);
    if (supabase) {
      await supabase.from('whatsapp_logs').insert({
        telefone: phone,
        template,
        status: 'sent',
        meta_message_id: r.data?.messages?.[0]?.id || null,
      });
    }
    res.json({ ok: true, meta: r.data });
  } catch (e) {
    const errMsg = e.response?.data?.error?.message || e.message;
    if (supabase) {
      await supabase.from('whatsapp_logs').insert({
        telefone: phone,
        template,
        status: 'failed',
        error_message: errMsg,
      });
    }
    res.status(400).json({ error: errMsg });
  }
});

// =============================================
// WEBHOOK HOTMART (compra aprovada)
// =============================================

app.post('/webhook/hotmart', async (req, res) => {
  // Validar secret, ler transação, criar usuário, enviar email de ativação
  // Ver manual técnico seção 8 — Integração Hotmart
  res.sendStatus(200);
});

// =============================================
// CRON DIÁRIO WHATSAPP
// =============================================

cron.schedule('* * * * *', async () => {
  // A cada 60s:
  // 1. Busca usuários com whatsapp_enabled=true e whatsapp_hour=horaAtual
  // 2. Para cada um, chama sendTemplate() com util_ritmo_dia7/21/conquistas conforme estado
  // 3. Grava em whatsapp_logs (sucesso ou erro 131049, etc.)
});

async function sendTemplate(to, templateName, params) {
  const url = `https://graph.facebook.com/${process.env.WA_API_VERSION}/${process.env.WA_PHONE_NUMBER_ID}/messages`;
  return axios.post(url, {
    messaging_product: 'whatsapp',
    to,
    type: 'template',
    template: {
      name: templateName,
      language: { code: 'pt_BR' },
      components: [{
        type: 'body',
        parameters: params.map(p => ({ type: 'text', text: p }))
      }]
    }
  }, {
    headers: { Authorization: `Bearer ${process.env.WA_TOKEN}` }
  });
}

// =============================================
// SPA FALLBACK (404 → index.html, pro PWA não quebrar em refresh)
// =============================================

app.get('*', (req, res) => {
  // Só retorna index.html pra rotas não-API. Rotas /api/* não caem aqui (caíram antes).
  if (req.path.startsWith('/api/') || req.path.startsWith('/webhook/')) {
    return res.status(404).json({ error: 'endpoint não implementado', path: req.path });
  }
  res.sendFile('index.html', { root: 'public' });
});

// =============================================
// START
// =============================================

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`[${process.env.NODE_ENV || 'dev'}] LEGENDIARIO server on :${PORT}`);
  console.log(`  health: /api/health`);
  console.log(`  autores: /api/autores`);
  console.log(`  hoje: /api/hoje`);
  console.log(`  provocacao: /api/provocacao/:dia_ano`);
});
