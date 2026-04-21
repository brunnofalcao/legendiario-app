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
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// =============================================
// ENDPOINTS DE CONTEÚDO
// =============================================

// GET /api/provocacoes/full — retorna TODAS as provocações (Supabase source of truth)
app.get('/api/provocacoes/full', async (req, res) => {
  const { data, error } = await supabase
    .from('provocacoes')
    .select('*')
    .order('mes', { ascending: true })
    .order('dia', { ascending: true });
  if (error) return res.status(500).json({ error: error.message });
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
// START
// =============================================

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`[${process.env.NODE_ENV}] LEGENDIARIO server on :${PORT}`);
});
