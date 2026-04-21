// ========== LEGENDIARIO ADMIN — CORE (login, nav, modal, CRUD) ==========

// ---- Toast ----
function toast(msg, kind='ok'){
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = kind;
  t.classList.add('on');
  clearTimeout(t._tm);
  t._tm = setTimeout(() => t.classList.remove('on'), 2600);
}

// ---- Login ----
function doLogin(){
  const k = document.getElementById('admin-key-input').value.trim();
  if (!k) { document.getElementById('login-err').textContent = 'Digite a chave.'; return; }
  if (k !== ADMIN_API_KEY_EXPECTED) { document.getElementById('login-err').textContent = 'Chave inválida.'; return; }
  ADMIN_KEY = k;
  if (document.getElementById('remember-key').checked) localStorage.setItem('lgd_admin_key', k);
  showApp();
}

function doLogout(){
  localStorage.removeItem('lgd_admin_key');
  ADMIN_KEY = '';
  document.getElementById('login-gate').style.display = 'flex';
  document.getElementById('topbar').style.display = 'none';
  document.getElementById('shell').style.display = 'none';
}

function showApp(){
  document.getElementById('login-gate').style.display = 'none';
  document.getElementById('topbar').style.display = 'flex';
  document.getElementById('shell').style.display = 'grid';
  renderTab('visao');
}

function toggleDemo(){
  DEMO_MODE = !DEMO_MODE;
  document.getElementById('demo-tag').textContent = DEMO_MODE ? 'MODO DEMO — dados fictícios' : 'MODO PRODUÇÃO — dados reais';
  document.getElementById('demo-tag').style.background = DEMO_MODE ? 'var(--gold)' : 'var(--ok)';
  document.getElementById('demo-toggle').textContent = DEMO_MODE ? 'Alternar para dados reais' : 'Alternar para modo demo';
  toast(DEMO_MODE ? 'Modo demo ativado — dados fictícios.' : 'Modo produção ativado — ainda sem dados reais na base.', DEMO_MODE?'ok':'err');
}

// ---- Navigation ----
function renderTab(tabId){
  document.querySelectorAll('.nav-item').forEach(b => b.classList.toggle('active', b.dataset.tab === tabId));
  const titles = {visao:'Visão Geral',engaj:'Engajamento',conteudo:'Conteúdo',autores:'Autores',users:'Usuários',whatsapp:'WhatsApp',demo:'Demografia',financeiro:'Financeiro',hooked:'Modelo Hooked',investidor:'Investidor'};
  document.getElementById('page-title').textContent = titles[tabId] || '';
  const root = document.getElementById('tabs-root');
  const renderFn = VIEWS[tabId];
  root.innerHTML = `<div class="tab-view active">${renderFn ? renderFn() : '<div class="no-data">Tela em construção.</div>'}</div>`;
  wireTabEvents(tabId);
}

function wireTabEvents(tabId){
  if (tabId === 'engaj') {
    document.querySelectorAll('[data-sub]').forEach(b => {
      b.onclick = () => {
        const id = b.dataset.sub;
        b.parentNode.querySelectorAll('.subtab').forEach(x => x.classList.toggle('active', x===b));
        document.querySelectorAll('.sub-view').forEach(x => x.style.display = (x.dataset.subId===id?'block':'none'));
      };
    });
    document.querySelectorAll('[data-conq]').forEach(b => {
      b.onclick = () => {
        b.parentNode.querySelectorAll('.subtab').forEach(x => x.classList.toggle('active', x===b));
        document.getElementById('conq-grid').innerHTML = renderConquistas(b.dataset.conq);
      };
    });
  }
  if (tabId === 'users') {
    document.querySelectorAll('[data-filter]').forEach(b => {
      b.onclick = () => {
        b.parentNode.querySelectorAll('.pill-btn').forEach(x => x.classList.toggle('active', x===b));
        const f = b.dataset.filter;
        const list = f==='todos' ? USERS : USERS.filter(u => u.status===f);
        document.getElementById('user-tbl').innerHTML = renderUsersTable(list);
      };
    });
    const srch = document.getElementById('user-search');
    if (srch) srch.oninput = () => {
      const q = srch.value.toLowerCase();
      const list = !q ? USERS : USERS.filter(u => u.nome.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
      document.getElementById('user-tbl').innerHTML = renderUsersTable(list);
    };
  }
}

// ---- Modal ----
function openModal(html){
  document.getElementById('modal-inner').innerHTML = `<button class="modal-close" onclick="closeModal()">✕</button>${html}`;
  document.getElementById('modal-bg').classList.add('on');
}
function closeModal(){ document.getElementById('modal-bg').classList.remove('on'); }
document.getElementById('modal-bg').addEventListener('click', e => { if (e.target.id === 'modal-bg') closeModal(); });

// ---- Autor CRUD ----
function openAutorModal(slug=null){
  const a = slug ? AUTORES.find(x => x.slug===slug) : {slug:'', nome:'', arquetipo:'', instagram:'', bio:'', cor:'#FF4D14', ativo:true, provs:0, reg:String(AUTORES.length+1).padStart(3,'0')};
  const isEdit = !!slug;
  openModal(`
    <h3>${isEdit?'Editar':'Novo'} Autor</h3>
    <div class="sub">${isEdit?'Atualize os dados do autor cadastrado.':'Cadastre um novo autor. Recomendado só para ampliações estratégicas — os 10 autores legendários são canônicos.'}</div>
    <div class="form-row">
      <div class="field"><label>Nome completo</label><input id="a-nome" value="${esc(a.nome)}" placeholder="Ex: Caleb Montenegro"></div>
      <div class="field"><label>Slug (URL)</label><input id="a-slug" value="${esc(a.slug)}" ${isEdit?'readonly':''} placeholder="caleb.montenegro"></div>
    </div>
    <div class="form-row">
      <div class="field"><label>Arquétipo</label><input id="a-arq" value="${esc(a.arquetipo)}" placeholder="Ex: Veterano"></div>
      <div class="field"><label>Instagram</label><input id="a-ig" value="${esc(a.instagram)}" placeholder="@handle"></div>
    </div>
    <div class="form-row">
      <div class="field"><label>Cor (hex)</label><input id="a-cor" value="${esc(a.cor)}" placeholder="#FF4D14"></div>
      <div class="field"><label>Nº de Registro</label><input id="a-reg" value="${esc(a.reg)}" placeholder="001"></div>
    </div>
    <div class="field"><label>Bio curta</label><textarea id="a-bio" placeholder="Frase-assinatura curta. Tom militar-cristão.">${esc(a.bio)}</textarea></div>
    <div class="row mt-12" style="justify-content:flex-end;gap:8px">
      ${isEdit ? `<button class="btn ghost" onclick="deleteAutor('${a.slug}')" style="margin-right:auto;color:#ff7b7b">🗑 Excluir</button>`:''}
      <button class="btn" onclick="closeModal()">Cancelar</button>
      <button class="btn primary" onclick="saveAutor('${a.slug||''}')">${isEdit?'Salvar':'Criar Autor'}</button>
    </div>
  `);
}

function saveAutor(slug){
  const obj = {
    nome: document.getElementById('a-nome').value.trim(),
    slug: document.getElementById('a-slug').value.trim().toLowerCase().replace(/\s+/g,'.'),
    arquetipo: document.getElementById('a-arq').value.trim(),
    instagram: document.getElementById('a-ig').value.trim(),
    cor: document.getElementById('a-cor').value.trim() || '#FF4D14',
    reg: document.getElementById('a-reg').value.trim(),
    bio: document.getElementById('a-bio').value.trim(),
    ativo: true, provs: 0
  };
  if (!obj.nome || !obj.slug) { toast('Nome e slug obrigatórios.', 'err'); return; }
  if (slug) {
    const i = AUTORES.findIndex(x => x.slug===slug);
    AUTORES[i] = { ...AUTORES[i], ...obj, slug: AUTORES[i].slug };
    toast('Autor atualizado.');
  } else {
    if (AUTORES.some(x => x.slug===obj.slug)) { toast('Slug já existe.', 'err'); return; }
    AUTORES.push(obj);
    toast('Autor criado.');
  }
  closeModal();
  renderTab('autores');
}

function toggleAutor(slug){
  const a = AUTORES.find(x => x.slug===slug);
  a.ativo = !a.ativo;
  toast(a.ativo ? 'Autor ativado.' : 'Autor desativado.');
  renderTab('autores');
}

function deleteAutor(slug){
  if (!confirm('Excluir este autor? As provocações assinadas por ele ficarão órfãs até reatribuição.')) return;
  AUTORES = AUTORES.filter(a => a.slug !== slug);
  toast('Autor excluído.', 'err');
  closeModal();
  renderTab('autores');
}

// ---- User CRUD ----
function openUserModal(){
  openModal(`
    <h3>Criar Usuário</h3>
    <div class="sub">Cria conta direto no sistema (bypassa magic link). Use para testes, VIPs ou importação manual.</div>
    <div class="form-row">
      <div class="field"><label>Nome</label><input id="u-nome" placeholder="Ex: Pastor Márcio"></div>
      <div class="field"><label>Email</label><input id="u-email" type="email" placeholder="email@dominio.com"></div>
    </div>
    <div class="form-row">
      <div class="field"><label>Profissão</label><input id="u-prof" placeholder="Pastor / Militar / Médico..."></div>
      <div class="field"><label>UF</label><input id="u-uf" placeholder="SP" maxlength="2" style="text-transform:uppercase"></div>
    </div>
    <div class="form-row">
      <div class="field"><label>WhatsApp (DDI+DDD+nº)</label><input id="u-wa" placeholder="5561981382900"></div>
      <div class="field"><label>Senha inicial (6+ chars)</label><input id="u-senha" type="text" placeholder="senha-provisoria"></div>
    </div>
    <div class="row mt-12" style="justify-content:flex-end;gap:8px">
      <button class="btn" onclick="closeModal()">Cancelar</button>
      <button class="btn primary" onclick="saveUser()">Criar Usuário</button>
    </div>
  `);
}

function saveUser(){
  const nome = document.getElementById('u-nome').value.trim();
  const email = document.getElementById('u-email').value.trim();
  const prof = document.getElementById('u-prof').value.trim() || '—';
  const uf = document.getElementById('u-uf').value.trim().toUpperCase() || '—';
  const senha = document.getElementById('u-senha').value.trim();
  if (!nome || !email || senha.length < 6) { toast('Nome, email e senha (6+) obrigatórios.', 'err'); return; }
  const nova = {
    id: Math.max(...USERS.map(u=>u.id))+1,
    nome, email, prof, uf,
    cidade:'—', fe:'—', idade:35, genero:'M',
    streak:0, recorde:0, lidos:0, shares:0, acoes:0,
    whatsapp:!!document.getElementById('u-wa').value.trim(),
    status:'Ativo', ult: new Date().toISOString().slice(0,10)
  };
  USERS.unshift(nova);
  toast('Usuário criado — senha enviada por email.');
  closeModal();
  renderTab('users');
}

// ---- Livro Vivo (Conteúdo) ----
function onLivroMesChange(){
  const mes = parseInt(document.getElementById('livro-mes').value);
  if (!mes) { document.getElementById('livro-list').innerHTML = '<div class="no-data" style="padding:20px">Selecione um mês acima</div>'; return; }
  const diasNoMes = new Date(2026, mes, 0).getDate();
  const hoje = new Date();
  const mmDia = String(mes).padStart(2,'0');
  let html = '';
  for (let d=1; d<=diasNoMes; d++){
    const dd = String(d).padStart(2,'0');
    const chave = `${mmDia}-${dd}`;
    const temSample = PROVS_SAMPLE[chave];
    const isHoje = hoje.getMonth()+1 === mes && hoje.getDate() === d;
    html += `<div class="day" data-dia="${chave}" onclick="onLivroDiaClick('${chave}')">
      <span>Dia ${d}</span>
      <span style="font-size:10px">${isHoje?'<b style="color:var(--brand)">HOJE</b>':temSample?'✓':'•'}</span>
    </div>`;
  }
  document.getElementById('livro-list').innerHTML = html;
}

function onLivroDiaClick(chave){
  document.querySelectorAll('.livro-list .day').forEach(d => d.classList.toggle('active', d.dataset.dia===chave));
  const p = PROVS_SAMPLE[chave];
  if (!p) {
    // gerar placeholder realista
    const autor = AUTORES[(parseInt(chave.split('-')[1]) - 1) % 10];
    document.getElementById('livro-editor').innerHTML = `
      <div class="between">
        <h3 style="margin:0;font-size:16px">${chave} — <span class="txt-dim" style="font-weight:500">rascunho placeholder</span></h3>
        <span class="pill warn">Rascunho</span>
      </div>
      <div class="form-row"><div class="field"><label>Autor</label><select>${AUTORES.map(a=>`<option ${a.slug===autor.slug?'selected':''}>${esc(a.nome)}</option>`).join('')}</select></div><div class="field"><label>Versículo ref.</label><input placeholder="Ex: Js 1.9"></div></div>
      <div class="field"><label>Verso completo</label><textarea placeholder="Texto do versículo completo..."></textarea></div>
      <div class="field"><label>Pergunta provocadora</label><input placeholder="A pergunta que abre a provocação"></div>
      <div class="field"><label>Texto desenvolvido</label><textarea placeholder="O desenvolvimento da provocação — 400-600 caracteres. Tom militar-cristão-masculino." style="min-height:140px"></textarea></div>
      <div class="row" style="justify-content:flex-end;gap:8px"><button class="btn ghost">Descartar</button><button class="btn primary" onclick="toast('Rascunho salvo.')">Salvar rascunho</button><button class="btn gold" onclick="toast('Publicado na fila do próximo ciclo.')">Publicar</button></div>`;
    return;
  }
  document.getElementById('livro-editor').innerHTML = `
    <div class="between">
      <h3 style="margin:0;font-size:16px">${chave} — ${esc(p.autor_slug)}</h3>
      <span class="pill ok">Publicado</span>
    </div>
    <div class="form-row">
      <div class="field"><label>Autor</label><select>${AUTORES.map(a=>`<option ${a.slug===p.autor_slug?'selected':''}>${esc(a.nome)}</option>`).join('')}</select></div>
      <div class="field"><label>Versículo ref.</label><input value="${esc(p.versiculo)}"></div>
    </div>
    <div class="field"><label>Verso completo</label><textarea>${esc(p.verso)}</textarea></div>
    <div class="field"><label>Pergunta provocadora</label><input value="${esc(p.pergunta)}"></div>
    <div class="field"><label>Texto desenvolvido</label><textarea style="min-height:140px">${esc(p.texto)}</textarea></div>
    <div class="field"><label>Assinatura</label><input value="${esc(p.assinatura)}"></div>
    <div class="row" style="justify-content:flex-end;gap:8px">
      <button class="btn ghost" onclick="toast('Alterações descartadas.','err')">Descartar</button>
      <button class="btn primary" onclick="toast('Provocação atualizada.')">Salvar</button>
    </div>`;
}

// ---- Sidebar nav wire ----
document.querySelectorAll('.nav-item').forEach(b => {
  b.onclick = () => renderTab(b.dataset.tab);
});

// ---- Boot ----
(function init(){
  if (ADMIN_KEY && ADMIN_KEY === ADMIN_API_KEY_EXPECTED) showApp();
  else document.getElementById('admin-key-input').focus();
})();
