/**
 * LEGENDIARIO — Submissão de templates WhatsApp ao Meta
 * Uso: node scripts/submit-whatsapp-templates.js
 * Pré-requisitos: .env com WA_TOKEN e WA_WABA_ID preenchidos
 */

require('dotenv').config();
const fs = require('fs');
const axios = require('axios');

const WABA_ID = process.env.WA_WABA_ID;
const TOKEN = process.env.WA_TOKEN;
const API = process.env.WA_API_VERSION || 'v22.0';

if (!WABA_ID || !TOKEN) {
  console.error('❌ WA_WABA_ID e WA_TOKEN devem estar no .env');
  process.exit(1);
}

const templates = JSON.parse(
  fs.readFileSync('./whatsapp_templates/templates_meta_submit.json', 'utf-8')
).templates;

(async () => {
  for (const tpl of templates) {
    try {
      const res = await axios.post(
        `https://graph.facebook.com/${API}/${WABA_ID}/message_templates`,
        tpl,
        { headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' } }
      );
      console.log(`✅ ${tpl.name}: enviado (id ${res.data.id})`);
    } catch (err) {
      console.error(`❌ ${tpl.name}:`, err.response?.data?.error?.message || err.message);
    }
    await new Promise(r => setTimeout(r, 800)); // rate-limit cautela
  }
  console.log('\nSubmissão concluída. Acompanhe aprovação no Meta Business Suite.');
})();
