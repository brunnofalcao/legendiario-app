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

// GET  /api/admin/users
// GET  /api/admin/demographics
// GET  /api/admin/financial
// GET  /api/admin/hooked       (retenção por coorte)
// GET  /api/admin/investor     (dashboards macro)
// POST /api/admin/provocacoes  (editar conteúdo)
// POST /api/admin/whatsapp/test
// POST /api/admin/whatsapp/send (broadcast)

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
