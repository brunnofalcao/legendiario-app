// ========== LEGENDIARIO ADMIN — VIEWS ==========
// Cada função renderView_X retorna o HTML da aba X.

const VIEWS = {};

// Helper: gerar barra de chart
function bars(values, cssClass='', labels=null){
  const max = Math.max(...values);
  const b = values.map((v,i) => {
    const h = Math.max(4, (v/max)*100);
    const l = labels ? labels[i] : '';
    return `<div class="bar" style="height:${h}%" title="${l||v}"></div>`;
  }).join('');
  return `<div class="chart ${cssClass}">${b}</div>`;
}

function initial2(name){
  const p = name.split(/\s+/).filter(Boolean);
  return ((p[0]?.[0]||'')+(p[p.length-1]?.[0]||'')).toUpperCase();
}

function esc(s){ return String(s||'').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

// ========== 1. VISÃO GERAL ==========
VIEWS.visao = () => {
  const ativos = USERS.filter(u => u.status==='Ativo').length;
  const total = USERS.length;
  const totalLidos = USERS.reduce((s,u) => s+u.lidos, 0);
  const streakMedio = Math.round(USERS.filter(u => u.streak>0).reduce((s,u) => s+u.streak, 0)/USERS.filter(u => u.streak>0).length);
  return `
  <div class="h1">Visão Geral do Desempenho</div>
  <div class="subtitle">Métricas-chave do ecossistema Legendiario</div>

  <div class="kpi-grid c6">
    <div class="kpi c-green"><div class="label">Usuários Ativos <span class="info">?</span></div><div class="value">${ativos}</div><div class="trend">↑ +12%</div></div>
    <div class="kpi"><div class="label">MRR Real <span class="info">?</span></div><div class="value">R$ 4.972</div><div class="trend">↑ +18%</div></div>
    <div class="kpi c-red"><div class="label">Taxa de Churn <span class="info">?</span></div><div class="value">5.8%</div><div class="trend down">↓ -1.1%</div></div>
    <div class="kpi c-gold"><div class="label">Streak Médio <span class="info">?</span></div><div class="value">${streakMedio} dias</div><div class="trend">↑ +4</div></div>
    <div class="kpi c-tan"><div class="label">Total Usuários <span class="info">?</span></div><div class="value">${total}</div><div class="trend">↑ +9</div></div>
    <div class="kpi c-olive"><div class="label">Total Leituras <span class="info">?</span></div><div class="value">${totalLidos.toLocaleString('pt-BR')}</div><div class="trend">↑ +847</div></div>
  </div>

  <div class="grid-2">
    <div class="panel">
      <h3>Novos Usuários — últimos 30 dias</h3>
      ${bars([1,2,1,3,2,4,3,5,4,6,5,7,4,8,6,9,7,8,5,10,7,9,6,11,8,12,9,14,11,13])}
    </div>
    <div class="panel">
      <h3>Receita Mensal (MRR)</h3>
      ${bars([1200,1680,1910,2240,2580,2890,3120,3510,3780,4100,4380,4650,4820,4972],'gold',['abr','mai','jun','jul','ago','set','out','nov','dez','jan','fev','mar','abr','atual'])}
    </div>
  </div>`;
};

// ========== 2. ENGAJAMENTO ==========
VIEWS.engaj = () => {
  const mediaLidos = Math.round(USERS.reduce((s,u) => s+u.lidos, 0)/USERS.length);
  const streakMedio = Math.round(USERS.filter(u => u.streak>0).reduce((s,u) => s+u.streak, 0)/USERS.filter(u => u.streak>0).length);
  const totalAcoes = USERS.reduce((s,u) => s+u.acoes, 0);
  return `
  <div class="h1">Engajamento &amp; Ritmo</div>
  <div class="subtitle">Métricas de uso, ranking completo e conquistas da base</div>

  <div class="subtabs">
    <button class="subtab active" data-sub="engaj-visao">Visão Geral</button>
    <button class="subtab" data-sub="engaj-ranking">Ranking</button>
    <button class="subtab" data-sub="engaj-conquistas">Conquistas</button>
  </div>

  <div class="sub-view" data-sub-id="engaj-visao">
    <div class="kpi-grid c4">
      <div class="kpi"><div class="label">Média Dias Lidos</div><div class="value">${mediaLidos}</div><div class="trend">↑ +8</div></div>
      <div class="kpi c-olive"><div class="label">Streak Médio Ativo</div><div class="value">${streakMedio} dias</div><div class="trend">↑ +3</div></div>
      <div class="kpi c-green"><div class="label">Ações Registradas (CTA)</div><div class="value">${totalAcoes}</div><div class="trend">↑ +22%</div></div>
      <div class="kpi c-gold"><div class="label">Taxa Conclusão Diária</div><div class="value">81%</div><div class="trend">↑ +5%</div></div>
    </div>
    <div class="grid-2">
      <div class="panel"><h3>Streaks Ativos — distribuição</h3>${bars([12,8,5,3,2,1,1,0],'camo',['7d','14d','21d','30d','45d','60d','90d','120+'])}</div>
      <div class="panel"><h3>Ações Registradas por Semana</h3>${bars([84,98,112,126,141,155,168,182])}</div>
    </div>
    <div class="panel"><h3>Taxa de Conclusão Diária — últimas 4 semanas</h3>${bars([72,74,78,81,79,82,85,81,78,83,86,81,77,81,83,81,79,84,86,82,81,83,87,84,80,82,85,81],'gold')}</div>
  </div>

  <div class="sub-view" data-sub-id="engaj-ranking" style="display:none">
    <div class="filter-row">
      <button class="pill-btn active" data-rank="streak">Ofensiva</button>
      <button class="pill-btn" data-rank="shares">Shares</button>
      <button class="pill-btn" data-rank="acoes">Ações</button>
      <select><option>Geral</option><option>Pastores</option><option>Militares</option><option>Executivos</option><option>Atletas</option></select>
      <span style="margin-left:auto" class="txt-dim">${RANKING.length} usuários</span>
    </div>
    <div class="panel" style="padding:0">
      <table>
        <thead><tr><th style="width:40px">#</th><th>Usuário</th><th>Estado</th><th>Profissão</th><th>Streak</th><th>Recorde</th><th>Shares</th><th>Ações</th><th>Percentil</th></tr></thead>
        <tbody>
        ${RANKING.map((u,i) => {
          const medal = i===0?'🥇':i===1?'🥈':i===2?'🥉':'';
          const pct = i<3?'Top 10%':i<6?'Top 25%':i<9?'Top 50%':'50%+';
          const pillCls = i<3?'brand':i<6?'ok':i<9?'warn':'dim';
          return `<tr>
            <td><b>${medal||(i+1)}</b></td>
            <td><div class="u-cell"><div class="avatar" style="background:${AUTORES[i%10].cor}">${initial2(u.nome)}</div><div><div><b>${esc(u.nome)}</b></div><div class="sub">${esc(u.email)}</div></div></div></td>
            <td>${u.uf}</td><td>${esc(u.prof)}</td>
            <td><span class="streak-n">${u.streak} dias</span></td>
            <td class="txt-dim">${u.recorde} dias</td>
            <td>${u.shares}</td><td>${u.acoes}</td>
            <td><span class="pill ${pillCls}">${pct}</span></td>
          </tr>`;
        }).join('')}
        </tbody>
      </table>
    </div>
  </div>

  <div class="sub-view" data-sub-id="engaj-conquistas" style="display:none">
    <div class="subtabs four" style="margin-bottom:14px">
      <button class="subtab active" data-conq="ofensivas">⚔ Ofensivas</button>
      <button class="subtab" data-conq="shares">↗ Shares</button>
      <button class="subtab" data-conq="acoes">◎ Ações</button>
      <button class="subtab" data-conq="ciclos">⟳ Ciclos</button>
    </div>
    <div class="txt-dim mb-12">Base ativa: <b>${USERS.filter(u=>u.status==='Ativo').length} usuários</b></div>
    <div id="conq-grid" class="ach-grid">${renderConquistas('ofensivas')}</div>
  </div>`;
};

function renderConquistas(key) {
  return CONQUISTAS[key].map(c => {
    const active = c.count>0;
    return `<div class="ach ${active?'active':'locked'}">
      <div class="name">${esc(c.name)}</div>
      <div class="hashtag">${esc(c.hashtag)} • ${c.dias} dias</div>
      <div class="count">${c.count}</div>
      <div class="pct">${c.base}% da base</div>
      <div class="bar"><span style="width:${Math.min(100,c.base)}%"></span></div>
    </div>`;
  }).join('');
}

// ========== 3. CONTEÚDO — Livro Vivo ==========
VIEWS.conteudo = () => {
  return `
  <div class="h1">Conteúdo — Livro Vivo</div>
  <div class="subtitle">Edite provocações diárias em tempo real. Mudanças entram na fila de publicação do próximo ciclo.</div>

  <div class="row mb-12" style="gap:14px">
    <div class="field" style="max-width:240px">
      <label>Selecione o mês</label>
      <select id="livro-mes" onchange="onLivroMesChange()">
        <option value="">— Escolha um mês —</option>
        ${MESES.map((m,i) => `<option value="${i+1}">${m}</option>`).join('')}
      </select>
    </div>
    <div style="margin-left:auto" class="row">
      <span class="pill brand">366 / 366 provocações cadastradas</span>
      <button class="btn sm"><span>⤓</span> Exportar mês</button>
    </div>
  </div>

  <div class="livro-grid">
    <div class="livro-list" id="livro-list">
      <div class="no-data" style="padding:20px">Selecione um mês acima</div>
    </div>
    <div class="livro-editor" id="livro-editor">
      <div class="empty">← Selecione um mês e um dia para editar a provocação</div>
    </div>
  </div>`;
};

// ========== 4. AUTORES ==========
VIEWS.autores = () => {
  return `
  <div class="h1">Autores</div>
  <div class="subtitle">Gerencie os autores que assinam as provocações diárias. Os 10 autores legendários são canônicos — edite com critério.</div>

  <div class="panel" style="padding:0">
    <div class="between" style="padding:16px 18px;border-bottom:1px solid var(--border)">
      <h3 style="margin:0">Autores Cadastrados <span class="txt-dim" style="font-weight:500;font-size:12px">(${AUTORES.length})</span></h3>
      <button class="btn primary sm" onclick="openAutorModal()">+ Novo Autor</button>
    </div>
    <table>
      <thead><tr><th>Autor</th><th>Arquétipo</th><th>Instagram</th><th>Provs</th><th>Status</th><th class="ta-right">Ações</th></tr></thead>
      <tbody>
      ${AUTORES.map(a => `<tr>
        <td><div class="u-cell"><div class="avatar" style="background:${a.cor}">${initial2(a.nome)}</div><div><div><b>${esc(a.nome)}</b></div><div class="sub">Reg. ${a.reg} · ${esc(a.bio.slice(0,54))}…</div></div></div></td>
        <td class="txt-dim">${esc(a.arquetipo)}</td>
        <td class="txt-dim">${esc(a.instagram)}</td>
        <td><b>${a.provs}</b></td>
        <td><span class="pill ${a.ativo?'ok':'dim'}">${a.ativo?'Ativo':'Inativo'}</span></td>
        <td class="ta-right">
          <button class="action-ico" onclick="openAutorModal('${a.slug}')" title="Editar">✎</button>
          <button class="action-ico" onclick="toggleAutor('${a.slug}')" title="${a.ativo?'Desativar':'Ativar'}">${a.ativo?'◉':'○'}</button>
          <button class="action-ico danger" onclick="deleteAutor('${a.slug}')" title="Excluir">🗑</button>
        </td>
      </tr>`).join('')}
      </tbody>
    </table>
  </div>`;
};

// ========== 5. USUÁRIOS ==========
VIEWS.users = () => {
  const ativos = USERS.filter(u => u.status==='Ativo').length;
  const inativos = USERS.filter(u => u.status==='Inativo').length;
  const cancelados = USERS.filter(u => u.status==='Cancelado').length;
  const pendentes = USERS.filter(u => u.status==='Pendente').length;
  return `
  <div class="h1">Gestão de Usuários</div>
  <div class="subtitle">Base completa de assinantes do Legendiario</div>

  <div class="kpi-grid c4">
    <div class="kpi"><div class="label">Total</div><div class="value">${USERS.length}</div><div class="trend">↑ +9</div></div>
    <div class="kpi c-green"><div class="label">Ativos</div><div class="value">${ativos}</div><div class="trend">↑ +18%</div></div>
    <div class="kpi c-gold"><div class="label">Pendentes / Inativos</div><div class="value">${pendentes + inativos}</div><div class="trend">↑ ${inativos}</div></div>
    <div class="kpi c-red"><div class="label">Cancelados</div><div class="value">${cancelados}</div><div class="trend down">↓ -2</div></div>
  </div>

  <div class="panel" style="padding:0">
    <div class="between" style="padding:14px 18px;border-bottom:1px solid var(--border)">
      <h3 style="margin:0">Todos os Usuários <span class="txt-dim" style="font-weight:500;font-size:12px">(${USERS.length})</span></h3>
      <button class="btn primary sm" onclick="openUserModal()">+ Criar Usuário</button>
    </div>
    <div class="filter-row" style="padding:12px 18px;margin:0;border-bottom:1px solid var(--border)">
      <button class="pill-btn active" data-filter="todos">Todos</button>
      <button class="pill-btn" data-filter="Ativo">Ativos</button>
      <button class="pill-btn" data-filter="Pendente">Pendentes</button>
      <button class="pill-btn" data-filter="Inativo">Inativos</button>
      <button class="pill-btn" data-filter="Cancelado">Cancelados</button>
      <input type="text" id="user-search" placeholder="Buscar nome ou email..." style="margin-left:auto">
    </div>
    <div id="user-tbl">
      ${renderUsersTable(USERS)}
    </div>
  </div>`;
};

function renderUsersTable(list) {
  if (!list.length) return '<div class="no-data">Nenhum usuário encontrado.</div>';
  return `<table>
    <thead><tr><th>Usuário</th><th>Status</th><th>WA</th><th>Streak</th><th>Dias Lidos</th><th>Último Acesso</th><th class="ta-right">Ações</th></tr></thead>
    <tbody>
    ${list.map(u => {
      const st = u.status==='Ativo'?'ok': u.status==='Pendente'?'warn': u.status==='Cancelado'?'danger':'dim';
      const wa = u.whatsapp ? '<span style="color:#25D366">●</span>' : '<span class="txt-mute">—</span>';
      return `<tr>
        <td><div class="u-cell"><div class="avatar">${initial2(u.nome)}</div><div><div><b>${esc(u.nome)}</b></div><div class="sub">${esc(u.email)} · ${esc(u.prof)} / ${u.uf}</div></div></div></td>
        <td><span class="pill ${st}">${u.status}</span></td>
        <td>${wa}</td>
        <td><span class="streak-n">${u.streak}</span></td>
        <td><b>${u.lidos}</b></td>
        <td class="txt-dim">${u.ult}</td>
        <td class="ta-right">
          ${u.status==='Pendente' ? '<button class="btn xs primary">Reenviar</button> <button class="btn xs ghost">Copiar link</button>' : '<button class="action-ico" title="Ver detalhes">👁</button> <button class="action-ico" title="Enviar WA">⌬</button> <button class="action-ico danger" title="Desativar">✕</button>'}
        </td>
      </tr>`;
    }).join('')}
    </tbody>
  </table>`;
}

// ========== 6. WHATSAPP ==========
VIEWS.whatsapp = () => {
  return `
  <div class="h1">WhatsApp — Meta API</div>
  <div class="subtitle">Monitoramento de envios diários via WhatsApp Business</div>

  <div class="panel" style="background:rgba(139,0,0,.1);border-color:#5a1f1f">
    <div class="between">
      <div style="font-size:12px">
        <b style="color:#ff9b9b">⚠ 3 alertas ativos</b>
        <div class="txt-dim" style="margin-top:4px">Template pendente de aprovação pela Meta · Phone ID ainda não configurado · WABA ID aguardando validação</div>
      </div>
      <button class="btn danger sm">Resolver pendências</button>
    </div>
  </div>

  <div class="panel">
    <h3>Ações Rápidas</h3>
    <div class="row" style="gap:10px">
      <input type="text" id="wa-test-phone" placeholder="Telefone para teste (ex: 5561981382900)" style="max-width:360px">
      <button class="btn sm primary">Enviar Teste</button>
      <button class="btn sm gold">Enviar para Todos</button>
    </div>
  </div>

  <div class="grid-2">
    <div class="panel">
      <h3>Envios Diários — últimos 14 dias</h3>
      ${bars(WA_SEND_14D,'camo')}
    </div>
    <div class="panel">
      <h3>Configuração</h3>
      <div class="health-card">
        <div><b>Phone ID:</b> — (pendente)</div>
        <div><b>Template:</b> — (aguardando aprovação Meta)</div>
        <div><b>Token:</b> ●●●●●●● <span class="pill warn" style="margin-left:6px">Aguardando validação</span></div>
        <div><b>WABA ID:</b> — (pendente)</div>
        <div><b>CRON:</b> Ativo — verifica a cada 60s</div>
        <div style="margin-top:10px">O envio automático ocorre no horário configurado de cada usuário (padrão 07:30 Brasília). Apenas usuários com <b>whatsapp_enabled=true</b> e telefone preenchido recebem.</div>
      </div>
    </div>
  </div>

  <div class="panel">
    <h3>Logs de Envio — Hoje <span class="pill dim">pendente de configuração</span></h3>
    <div class="no-data">Nenhum log disponível até a configuração ficar verde.</div>
  </div>`;
};

// ========== 7. DEMOGRAFIA ==========
VIEWS.demo = () => {
  const d = agregarDemografia();
  const totTop = (obj) => Object.entries(obj).sort((a,b) => b[1]-a[1]);

  const profList = totTop(d.porProf);
  const estList = totTop(d.porEstado);
  const idadeList = totTop(d.porIdade);
  const feList = totTop(d.porFe);

  const barRow = (label, n, max, color='var(--brand)') => {
    const pct = Math.round((n/max)*100);
    return `<div style="margin-bottom:10px"><div class="between" style="margin-bottom:4px"><span>${esc(label)}</span><span class="txt-dim"><b>${n}</b> (${Math.round((n/d.total)*100)}%)</span></div><div style="height:7px;background:var(--border);border-radius:4px;overflow:hidden"><div style="height:100%;width:${pct}%;background:${color};border-radius:4px"></div></div></div>`;
  };

  const maxProf = Math.max(...profList.map(e => e[1]));
  const maxEst = Math.max(...estList.map(e => e[1]));
  const maxIdade = Math.max(...idadeList.map(e => e[1]));
  const maxFe = Math.max(...feList.map(e => e[1]));

  return `
  <div class="h1">Demografia</div>
  <div class="subtitle">Perfil demográfico da base — ${d.total} usuários analisados</div>

  <div class="grid-2">
    <div class="panel">
      <h3>Gênero</h3>
      ${barRow('Masculino', d.porGenero.M||0, d.total)}
      ${barRow('Feminino', d.porGenero.F||0, d.total, 'var(--camo-tan)')}
      <div class="txt-mute" style="font-size:11px;margin-top:8px">Legendiario é inicialmente masculino-focado; expansão feminina planejada pra 2027.</div>
    </div>
    <div class="panel">
      <h3>Faixa Etária</h3>
      ${idadeList.map(([k,v]) => barRow(k, v, maxIdade,'var(--camo-olive)')).join('')}
    </div>
  </div>

  <div class="grid-2">
    <div class="panel">
      <h3>Estado</h3>
      ${estList.map(([k,v]) => barRow(k, v, maxEst,'var(--gold)')).join('')}
    </div>
    <div class="panel">
      <h3>Profissão</h3>
      ${profList.map(([k,v]) => barRow(k, v, maxProf)).join('')}
    </div>
  </div>

  <div class="panel">
    <h3>Orientação de Fé</h3>
    <div class="grid-3">
      ${feList.map(([k,v]) => `<div class="kpi c-olive"><div class="label">${esc(k)}</div><div class="value">${v}</div><div class="trend">${Math.round((v/d.total)*100)}% da base</div></div>`).join('')}
    </div>
  </div>`;
};

// ========== 8. FINANCEIRO (Ticket and go) ==========
VIEWS.financeiro = () => {
  const mrr = TRANSACOES.filter(t => t.status==='Aprovada').length * 350;
  return `
  <div class="h1">Financeiro</div>
  <div class="subtitle">Receita, assinaturas e churn — integração com <b style="color:var(--brand)">Ticket and go</b></div>

  <div class="kpi-grid c4">
    <div class="kpi c-green"><div class="label">MRR Real <span class="info">?</span></div><div class="value">R$ 4.972</div><div class="trend">↑ +18%</div></div>
    <div class="kpi"><div class="label">Novas Assinaturas (mês) <span class="info">?</span></div><div class="value">9</div><div class="trend">↑ +3</div></div>
    <div class="kpi c-red"><div class="label">Churn Rate <span class="info">?</span></div><div class="value">5.8%</div><div class="trend down">↓ -1.1%</div></div>
    <div class="kpi c-gold"><div class="label">LTV Estimado <span class="info">?</span></div><div class="value">R$ 84.120</div><div class="trend">↑ +12%</div></div>
  </div>

  <div class="grid-2">
    <div class="panel">
      <h3>MRR — Receita Atual <span class="tag">saudável</span></h3>
      ${bars([1200,1680,1910,2240,2580,2890,3120,3510,3780,4100,4380,4650,4820,4972],'gold')}
    </div>
    <div class="panel">
      <h3>Churn Rate — últimos 14 meses</h3>
      ${bars([9.2,8.8,8.4,8.1,7.7,7.4,7.1,6.8,6.5,6.3,6.1,6.0,5.9,5.8])}
    </div>
  </div>

  <div class="panel" style="padding:0">
    <h3 style="padding:18px 18px 10px">Últimas Transações — <span class="pill brand">Ticket and go</span></h3>
    <table>
      <thead><tr><th>Data</th><th>Usuário</th><th>Tipo</th><th>Valor</th><th>Status</th></tr></thead>
      <tbody>
      ${TRANSACOES.map(t => {
        const st = t.status==='Aprovada'?'ok': t.status==='Estornada'?'danger':'warn';
        return `<tr><td class="txt-dim">${t.data}</td><td><b>${esc(t.user)}</b></td><td>${esc(t.tipo)}</td><td><b>${t.valor}</b></td><td><span class="pill ${st}">${t.status}</span></td></tr>`;
      }).join('')}
      </tbody>
    </table>
  </div>`;
};

// ========== 9. MODELO HOOKED ==========
VIEWS.hooked = () => {
  return `
  <div class="h1">Modelo Hooked</div>
  <div class="subtitle">Análise dos 4 vetores do framework de Nir Eyal aplicado ao Legendiario</div>

  <div class="grid-2">
    <div class="panel">
      <h3>⏰ Trigger — Gatilho</h3>
      <div class="txt-dim" style="line-height:1.7">
        <div><b style="color:var(--text)">Externo:</b> notificação WhatsApp 07:30 local</div>
        <div><b style="color:var(--text)">Interno:</b> disciplina matinal, identidade de guerreiro, necessidade de confronto</div>
        <div style="margin-top:10px"><b style="color:var(--text)">Taxa de abertura:</b> <span class="streak-n">81%</span> (meta: 75%+)</div>
      </div>
    </div>
    <div class="panel">
      <h3>⚡ Action — Ação</h3>
      <div class="txt-dim" style="line-height:1.7">
        <div><b style="color:var(--text)">Ação-âncora:</b> ler 1 provocação de ~90s</div>
        <div><b style="color:var(--text)">Fricção:</b> mínima — 1 clique abre o app</div>
        <div style="margin-top:10px"><b style="color:var(--text)">Taxa de conclusão:</b> <span class="streak-n">81%</span></div>
      </div>
    </div>
    <div class="panel">
      <h3>🎁 Reward — Recompensa Variável</h3>
      <div class="txt-dim" style="line-height:1.7">
        <div><b style="color:var(--text)">Da caça:</b> nova provocação imprevisível, versículo, autor</div>
        <div><b style="color:var(--text)">Da tribo:</b> ranking, conquistas desbloqueáveis</div>
        <div><b style="color:var(--text)">Interna:</b> sensação de ofensiva mantida, identidade reforçada</div>
      </div>
    </div>
    <div class="panel">
      <h3>💎 Investment — Investimento</h3>
      <div class="txt-dim" style="line-height:1.7">
        <div><b style="color:var(--text)">Dados:</b> ações registradas, lembretes, compartilhamentos</div>
        <div><b style="color:var(--text)">Social:</b> identidade pública de "legendário"</div>
        <div style="margin-top:10px"><b style="color:var(--text)">Ações/usuário ativo (avg):</b> <span class="streak-n">24</span></div>
      </div>
    </div>
  </div>

  <div class="panel">
    <h3>Hook Density Score</h3>
    <div class="kpi-grid c4">
      <div class="kpi c-green"><div class="label">Trigger Strength</div><div class="value">8.4/10</div></div>
      <div class="kpi c-green"><div class="label">Action Fluidity</div><div class="value">9.1/10</div></div>
      <div class="kpi c-gold"><div class="label">Reward Variability</div><div class="value">7.8/10</div></div>
      <div class="kpi"><div class="label">Investment Depth</div><div class="value">6.9/10</div></div>
    </div>
    <div class="health-card mt-12">
      <b>Leitura estratégica:</b> Trigger e Action já estão fortes — a disciplina diária do nicho e a fricção mínima funcionam. <b>Reward</b> pode crescer com conteúdo sazonal (semana santa, datas militares, dias civis cristãos) e <b>Investment</b> escala quando o usuário personaliza ações, cria diários próprios e convida amigos (viral coefficient atual: 0.23 — meta: 0.6+).
    </div>
  </div>`;
};

// ========== 10. INVESTIDOR ==========
VIEWS.investidor = () => {
  return `
  <div class="h1">Visão do Investidor</div>
  <div class="subtitle">Métricas de tração, retenção e eficiência de capital — unit economics completo</div>

  <div class="kpi-grid c6">
    <div class="kpi c-green"><div class="label">LTV / CAC <span class="info">?</span></div><div class="value">6.8x</div><div class="trend">↑ +0.9</div></div>
    <div class="kpi"><div class="label">Retenção (M12) <span class="info">?</span></div><div class="value">67%</div><div class="trend">↑ +4%</div></div>
    <div class="kpi c-gold"><div class="label">Stickiness (DAU/MAU) <span class="info">?</span></div><div class="value">64%</div><div class="trend">↑ +3%</div></div>
    <div class="kpi c-olive"><div class="label">Payback Period <span class="info">?</span></div><div class="value">4.2 meses</div><div class="trend">↑ -1.1m</div></div>
    <div class="kpi c-tan"><div class="label">MRR <span class="info">?</span></div><div class="value">R$ 4.972</div><div class="trend">↑ +18%</div></div>
    <div class="kpi"><div class="label">LTV Estimado <span class="info">?</span></div><div class="value">R$ 84.120</div><div class="trend">↑ +12%</div></div>
  </div>

  <div class="grid-2">
    <div class="panel">
      <h3>Crescimento de Receita (MRR) <span class="tag">saúde: excelente</span></h3>
      ${bars([1200,1680,1910,2240,2580,2890,3120,3510,3780,4100,4380,4650,4820,4972],'gold')}
      <div class="txt-dim" style="font-size:12px;margin-top:10px">CMGR (Compound Monthly Growth Rate): <b style="color:var(--brand)">+14.2%</b></div>
    </div>
    <div class="panel">
      <h3>Engajamento Diário — Stickiness (DAU/MAU)</h3>
      ${bars([48,52,55,58,59,61,60,62,61,63,62,64,63,64],'camo')}
      <div class="health-card mt-12">
        Nossa taxa de <b>Stickiness (DAU/MAU) de 64%</b> é comparável a redes sociais de alto impacto. Apps de educação ficam em ~25%. Apps devocionais médios ficam em ~30-35%. O nicho "homens cristãos em disciplina" tem retenção acima da média porque o hábito diário reforça identidade.
      </div>
    </div>
  </div>

  <div class="panel">
    <h3>Tese de Investimento — Resumo Executivo</h3>
    <div class="health-card">
      <b>Mercado:</b> 42M de evangélicos masculinos no Brasil, 85M de cristãos totais. Público underserved por apps devocionais voltados à performance e disciplina.<br><br>
      <b>Diferenciação:</b> Legendiario combina conteúdo masculino-cristão-militar com mecânicas de retenção (streak, conquistas, ranking) — categoria nova. Concorrentes (YouVersion, ACF) não têm mecânica de produto, só texto.<br><br>
      <b>Unit economics:</b> LTV/CAC de 6.8x, payback em 4.2 meses, retenção M12 de 67% — mostram que o modelo escala.<br><br>
      <b>Moat:</b> IP de 10 autores fictícios ancorados no ecossistema <i>Los Legendarios</i>, contratos de exclusividade com Science Play, base proprietária.<br><br>
      <b>Próximos marcos:</b> 1.000 assinantes ativos (Q3 2026) · R$ 50k MRR (Q4 2026) · abertura Feminino (2027).
    </div>
  </div>`;
};

// ----- expose -----
window.VIEWS = VIEWS;
window.renderConquistas = renderConquistas;
window.renderUsersTable = renderUsersTable;
