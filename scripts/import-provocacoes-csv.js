/**
 * LEGENDIARIO — Importar CSV de provocações para Supabase
 * Uso: node scripts/import-provocacoes-csv.js ./data/provocacoes.csv
 * CSV deve ter cabeçalho: dia_ano,mes,dia,autor_dia,citacao,autor_citacao,pergunta,texto,aspas_autor,instagram
 */
require('dotenv').config();
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const file = process.argv[2];
if (!file) { console.error('Uso: node scripts/import-provocacoes-csv.js <caminho.csv>'); process.exit(1); }

function parseCSV(text) {
  const lines = text.split(/\r?\n/).filter(Boolean);
  const headers = lines[0].split(',').map(h => h.trim());
  return lines.slice(1).map(line => {
    // Parser simples — usa papaparse em produção se houver vírgulas dentro de aspas
    const cols = line.match(/("([^"]|"")*"|[^,]*)(,|$)/g).map(c => c.replace(/,$/, '').replace(/^"|"$/g, '').replace(/""/g, '"'));
    const row = {};
    headers.forEach((h, i) => row[h] = cols[i] || null);
    return row;
  });
}

(async () => {
  const text = fs.readFileSync(file, 'utf-8');
  const rows = parseCSV(text);
  console.log(`Carregando ${rows.length} provocações...`);
  const { data, error } = await supabase.from('provocacoes').upsert(rows, { onConflict: 'dia_ano' });
  if (error) { console.error('Erro:', error); process.exit(1); }
  console.log(`✅ ${rows.length} registros importados.`);
})();
