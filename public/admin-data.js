// ========== LEGENDIARIO ADMIN — MOCK DATA ==========
// Todos os dados aqui são fictícios. Substituir por fetch de backend quando a base real encher.

const ADMIN_API_KEY_EXPECTED = 'legendiario-admin-brasa-2026';
let DEMO_MODE = true;
let ADMIN_KEY = localStorage.getItem('lgd_admin_key') || '';

// ---------- 10 autores fictícios (fonte: brand v0.1) ----------
let AUTORES = [
  {slug:'caleb.montenegro', nome:'Caleb Montenegro', arquetipo:'Veterano', instagram:'@caleb.montenegro', bio:'Veterano de guerra espiritual, 25 anos de estrada. Fala pouco, corta fundo.', cor:'#4B5320', ativo:true, provs:38, reg:'001'},
  {slug:'josue.caetano', nome:'Josué Caetano', arquetipo:'Líder', instagram:'@josue.caetano', bio:'Líder de batalhão cristão. Comanda pela frente, nunca de trás.', cor:'#333D26', ativo:true, provs:37, reg:'002'},
  {slug:'davi.valverde', nome:'Davi Valverde', arquetipo:'Adorador-Guerreiro', instagram:'@davi.valverde', bio:'Adora com espada na mão. Canta, corta e não se desculpa.', cor:'#8B0000', ativo:true, provs:37, reg:'003'},
  {slug:'elias.dovale', nome:'Elias do Vale', arquetipo:'Profeta de Fogo', instagram:'@elias.dovale', bio:'Profeta radical. Não tem meio termo. Não tem refresco.', cor:'#D4A017', ativo:true, provs:37, reg:'004'},
  {slug:'gideao.sampaio', nome:'Gideão Sampaio', arquetipo:'Estrategista', instagram:'@gideao.sampaio', bio:'Venceu com 300 quando o mundo viu 32 mil. Estratégia > volume.', cor:'#6B5D4F', ativo:true, provs:37, reg:'005'},
  {slug:'neemias.barros', nome:'Neemias Barros', arquetipo:'Reconstrutor', instagram:'@neemias.barros', bio:'Constrói muro com uma mão e espada na outra.', cor:'#5C4033', ativo:true, provs:37, reg:'006'},
  {slug:'samuelqueiroga', nome:'Samuel Queiroga', arquetipo:'Mentor', instagram:'@samuelqueiroga', bio:'Unge reis. Quebra reis. Sabe a hora de cada coisa.', cor:'#2D4A2B', ativo:true, provs:37, reg:'007'},
  {slug:'benjamim.paiva', nome:'Benjamim Paiva', arquetipo:'Intensidade Bruta', instagram:'@benjamim.paiva', bio:'Não é fofo. Não é macio. É lobo.', cor:'#8B7E66', ativo:true, provs:37, reg:'008'},
  {slug:'ezequielferraz', nome:'Ezequiel Ferraz', arquetipo:'Visão Profética', instagram:'@ezequielferraz', bio:'Vê antes de ver. Ossos secos viram exército.', cor:'#4B5320', ativo:true, provs:37, reg:'009'},
  {slug:'jonataspellegrino', nome:'Jônatas Pellegrino', arquetipo:'Fidelidade Radical', instagram:'@jonataspellegrino', bio:'Lealdade até as últimas. Arco nas costas, irmão à frente.', cor:'#8B0000', ativo:true, provs:37, reg:'010'}
];

// ---------- 32 usuários fictícios (nicho masculino cristão/disciplina) ----------
let USERS = [
  {id:1, nome:'Pastor Márcio Toledo', email:'marcio.toledo@ipvida.com', prof:'Pastor', cidade:'Goiânia', uf:'GO', fe:'Evangélico', idade:42, genero:'M', streak:87, recorde:94, lidos:142, shares:38, acoes:96, whatsapp:true, status:'Ativo', ult:'2026-04-21'},
  {id:2, nome:'Cel. Ricardo Aragão', email:'cel.aragao@forcas.mil.br', prof:'Militar', cidade:'Brasília', uf:'DF', fe:'Evangélico', idade:48, genero:'M', streak:74, recorde:74, lidos:128, shares:22, acoes:81, whatsapp:true, status:'Ativo', ult:'2026-04-21'},
  {id:3, nome:'Cap. Henrique Vasconcellos', email:'hvasconcellos@pmce.pm.br', prof:'Policial', cidade:'Fortaleza', uf:'CE', fe:'Católico', idade:39, genero:'M', streak:62, recorde:68, lidos:115, shares:19, acoes:74, whatsapp:true, status:'Ativo', ult:'2026-04-21'},
  {id:4, nome:'Dr. Paulo Muzy', email:'muzy@musculacao.com', prof:'Médico', cidade:'São Paulo', uf:'SP', fe:'Cristão', idade:45, genero:'M', streak:58, recorde:61, lidos:108, shares:44, acoes:69, whatsapp:true, status:'Ativo', ult:'2026-04-21'},
  {id:5, nome:'Rafael Canal', email:'rafa@gfhaus.com.br', prof:'Empresário', cidade:'Curitiba', uf:'PR', fe:'Evangélico', idade:36, genero:'M', streak:51, recorde:55, lidos:94, shares:27, acoes:58, whatsapp:true, status:'Ativo', ult:'2026-04-20'},
  {id:6, nome:'Diácono Fernando Viana', email:'fviana@ibab.org.br', prof:'Pastor', cidade:'Recife', uf:'PE', fe:'Evangélico', idade:51, genero:'M', streak:47, recorde:52, lidos:89, shares:15, acoes:51, whatsapp:true, status:'Ativo', ult:'2026-04-21'},
  {id:7, nome:'Lucas Montoro', email:'lmontoro@crossfit.com.br', prof:'Atleta', cidade:'Belo Horizonte', uf:'MG', fe:'Católico', idade:33, genero:'M', streak:44, recorde:49, lidos:84, shares:31, acoes:47, whatsapp:true, status:'Ativo', ult:'2026-04-21'},
  {id:8, nome:'Thiago Brandão', email:'tbrandao@vale.com', prof:'Executivo', cidade:'Vitória', uf:'ES', fe:'Evangélico', idade:41, genero:'M', streak:41, recorde:45, lidos:81, shares:13, acoes:42, whatsapp:false, status:'Ativo', ult:'2026-04-21'},
  {id:9, nome:'Dr. Márcio Tannure', email:'tannure@sportsmed.com', prof:'Médico', cidade:'Rio de Janeiro', uf:'RJ', fe:'Cristão', idade:47, genero:'M', streak:38, recorde:44, lidos:76, shares:21, acoes:39, whatsapp:true, status:'Ativo', ult:'2026-04-20'},
  {id:10, nome:'Sgt. Gilberto Nunes', email:'gnunes@bope.rj.gov.br', prof:'Policial', cidade:'Rio de Janeiro', uf:'RJ', fe:'Evangélico', idade:43, genero:'M', streak:35, recorde:38, lidos:71, shares:9, acoes:34, whatsapp:true, status:'Ativo', ult:'2026-04-21'},
  {id:11, nome:'Pedro Capobianco', email:'pcapo@advocacia.adv.br', prof:'Advogado', cidade:'São Paulo', uf:'SP', fe:'Católico', idade:38, genero:'M', streak:33, recorde:36, lidos:68, shares:17, acoes:32, whatsapp:true, status:'Ativo', ult:'2026-04-21'},
  {id:12, nome:'Eduardo Braga', email:'ebraga@stihl.com.br', prof:'Executivo', cidade:'São Leopoldo', uf:'RS', fe:'Evangélico', idade:44, genero:'M', streak:29, recorde:34, lidos:62, shares:11, acoes:29, whatsapp:true, status:'Ativo', ult:'2026-04-20'},
  {id:13, nome:'Prof. Caio Lavor', email:'caio@historiabr.com', prof:'Professor', cidade:'Salvador', uf:'BA', fe:'Católico', idade:35, genero:'M', streak:28, recorde:31, lidos:59, shares:24, acoes:28, whatsapp:false, status:'Ativo', ult:'2026-04-21'},
  {id:14, nome:'Sandro Massoni', email:'smassoni@treinamento.com', prof:'Educador Físico', cidade:'Campinas', uf:'SP', fe:'Evangélico', idade:37, genero:'M', streak:26, recorde:29, lidos:56, shares:19, acoes:25, whatsapp:true, status:'Ativo', ult:'2026-04-21'},
  {id:15, nome:'Presb. Roberto Yamada', email:'ryamada@presbiteriana.org', prof:'Pastor', cidade:'São Paulo', uf:'SP', fe:'Evangélico', idade:55, genero:'M', streak:24, recorde:27, lidos:52, shares:8, acoes:23, whatsapp:true, status:'Ativo', ult:'2026-04-20'},
  {id:16, nome:'Bruno Colombari', email:'bruno@construtor.com', prof:'Empresário', cidade:'Joinville', uf:'SC', fe:'Evangélico', idade:40, genero:'M', streak:21, recorde:26, lidos:48, shares:14, acoes:21, whatsapp:true, status:'Ativo', ult:'2026-04-21'},
  {id:17, nome:'Igor Penteado', email:'ipenteado@engenharia.com', prof:'Engenheiro', cidade:'Uberlândia', uf:'MG', fe:'Católico', idade:34, genero:'M', streak:19, recorde:23, lidos:44, shares:10, acoes:18, whatsapp:false, status:'Ativo', ult:'2026-04-21'},
  {id:18, nome:'Felipe Cartaxo', email:'fcartaxo@saude.com', prof:'Fisioterapeuta', cidade:'João Pessoa', uf:'PB', fe:'Evangélico', idade:32, genero:'M', streak:17, recorde:20, lidos:39, shares:6, acoes:16, whatsapp:true, status:'Ativo', ult:'2026-04-20'},
  {id:19, nome:'Cabo Hélio Brito', email:'hbrito@marinha.mil.br', prof:'Militar', cidade:'Belém', uf:'PA', fe:'Evangélico', idade:31, genero:'M', streak:15, recorde:18, lidos:35, shares:11, acoes:14, whatsapp:true, status:'Ativo', ult:'2026-04-21'},
  {id:20, nome:'Vinicius Rossi', email:'vrossi@digitalmkt.br', prof:'Empresário', cidade:'Porto Alegre', uf:'RS', fe:'Cristão', idade:29, genero:'M', streak:13, recorde:15, lidos:31, shares:18, acoes:12, whatsapp:true, status:'Ativo', ult:'2026-04-20'},
  {id:21, nome:'André Quadros', email:'aquadros@agro.br', prof:'Empresário', cidade:'Cuiabá', uf:'MT', fe:'Evangélico', idade:46, genero:'M', streak:11, recorde:14, lidos:27, shares:7, acoes:10, whatsapp:true, status:'Ativo', ult:'2026-04-21'},
  {id:22, nome:'Jean Pallotta', email:'jpallotta@imoveis.com', prof:'Corretor', cidade:'Florianópolis', uf:'SC', fe:'Católico', idade:38, genero:'M', streak:9, recorde:12, lidos:23, shares:4, acoes:8, whatsapp:false, status:'Ativo', ult:'2026-04-20'},
  {id:23, nome:'Wesley Cardoso', email:'wcardoso@pessoal.com', prof:'Coach', cidade:'Natal', uf:'RN', fe:'Evangélico', idade:35, genero:'M', streak:7, recorde:9, lidos:19, shares:5, acoes:6, whatsapp:true, status:'Ativo', ult:'2026-04-21'},
  {id:24, nome:'Marcelo Quincas', email:'mquincas@terapia.com', prof:'Psicólogo', cidade:'Maceió', uf:'AL', fe:'Cristão', idade:41, genero:'M', streak:5, recorde:7, lidos:15, shares:2, acoes:4, whatsapp:true, status:'Ativo', ult:'2026-04-21'},
  {id:25, nome:'Frei Gustavo Tirone', email:'gtirone@mosteiro.org', prof:'Sacerdote', cidade:'Ouro Preto', uf:'MG', fe:'Católico', idade:52, genero:'M', streak:3, recorde:5, lidos:11, shares:1, acoes:2, whatsapp:false, status:'Ativo', ult:'2026-04-20'},
  {id:26, nome:'Leandro Visoli', email:'lvisoli@gmail.com', prof:'Empresário', cidade:'Londrina', uf:'PR', fe:'Evangélico', idade:43, genero:'M', streak:0, recorde:18, lidos:32, shares:5, acoes:11, whatsapp:true, status:'Inativo', ult:'2026-04-08'},
  {id:27, nome:'Maj. Paulo Esteves', email:'pesteves@eb.mil.br', prof:'Militar', cidade:'Campo Grande', uf:'MS', fe:'Evangélico', idade:49, genero:'M', streak:0, recorde:22, lidos:44, shares:8, acoes:17, whatsapp:true, status:'Inativo', ult:'2026-04-05'},
  {id:28, nome:'Carlos Bernini', email:'cbernini@industria.com', prof:'Empresário', cidade:'São Bernardo', uf:'SP', fe:'Evangélico', idade:47, genero:'M', streak:0, recorde:15, lidos:27, shares:3, acoes:9, whatsapp:false, status:'Inativo', ult:'2026-04-02'},
  {id:29, nome:'Ricardo Camargos', email:'rcamargos@yahoo.com', prof:'Executivo', cidade:'Betim', uf:'MG', fe:'Católico', idade:40, genero:'M', streak:0, recorde:11, lidos:19, shares:2, acoes:5, whatsapp:true, status:'Inativo', ult:'2026-03-28'},
  {id:30, nome:'Ten. Thales Pimentel', email:'tpimentel@cbm.sp.gov.br', prof:'Bombeiro', cidade:'São Paulo', uf:'SP', fe:'Evangélico', idade:36, genero:'M', streak:0, recorde:9, lidos:14, shares:4, acoes:3, whatsapp:false, status:'Cancelado', ult:'2026-03-15'},
  {id:31, nome:'Jorge Guerra', email:'jguerra@email.com', prof:'Executivo', cidade:'Guarulhos', uf:'SP', fe:'Evangélico', idade:42, genero:'M', streak:0, recorde:0, lidos:0, shares:0, acoes:0, whatsapp:false, status:'Pendente', ult:'N/A'},
  {id:32, nome:'Olavo Cristelli', email:'ocristelli@consult.com', prof:'Consultor', cidade:'Barueri', uf:'SP', fe:'Cristão', idade:44, genero:'M', streak:0, recorde:0, lidos:0, shares:0, acoes:0, whatsapp:false, status:'Pendente', ult:'N/A'}
];

// ---------- WhatsApp (envios últimos 14 dias) ----------
const WA_SEND_14D = [14,18,22,25,28,27,24,29,32,30,28,31,33,34];

// ---------- Conquistas ----------
const CONQUISTAS = {
  ofensivas: [
    {name:'Primeiro Passo', hashtag:'#Começou', dias:7, count:22, base:71},
    {name:'Hábito', hashtag:'#21Dias', dias:21, count:11, base:35},
    {name:'Consistente', hashtag:'#30Dias', dias:30, count:7, base:23},
    {name:'Dedicação', hashtag:'#Dedicado', dias:60, count:3, base:10},
    {name:'Constância', hashtag:'#Constante', dias:90, count:0, base:0},
    {name:'Imparável', hashtag:'#Imparável', dias:120, count:0, base:0},
    {name:'Disciplina', hashtag:'#Disciplina', dias:240, count:0, base:0},
    {name:'Mestre', hashtag:'#Legendario365', dias:365, count:0, base:0}
  ],
  shares:[
    {name:'Primeiro Disparo', hashtag:'#PrimeiroShare', dias:1, count:24, base:77},
    {name:'Multiplicador', hashtag:'#Multiplica10', dias:10, count:12, base:39},
    {name:'Propagador', hashtag:'#Propagador', dias:50, count:4, base:13},
    {name:'Evangelista', hashtag:'#Evangelista', dias:100, count:1, base:3}
  ],
  acoes:[
    {name:'Fez Acontecer', hashtag:'#PrimeiraAção', dias:1, count:26, base:84},
    {name:'Executor', hashtag:'#Executor25', dias:25, count:10, base:32},
    {name:'Comandante', hashtag:'#Comanda100', dias:100, count:2, base:6},
    {name:'Lenda Viva', hashtag:'#LendaViva', dias:365, count:0, base:0}
  ],
  ciclos:[
    {name:'Ciclo 1', hashtag:'#CicloTrinta1', dias:30, count:7, base:23},
    {name:'Ciclo 2', hashtag:'#CicloTrinta2', dias:60, count:3, base:10},
    {name:'Ciclo 4', hashtag:'#CicloTrinta4', dias:120, count:0, base:0},
    {name:'Ciclo 12 (Legendário)', hashtag:'#CicloLegendário', dias:365, count:0, base:0}
  ]
};

// ---------- Transações (Ticket and go) ----------
const TRANSACOES = [
  {data:'2026-04-21', user:'Pastor Márcio Toledo', tipo:'Assinatura anual', valor:'R$ 497,00', status:'Aprovada'},
  {data:'2026-04-21', user:'Rafael Canal', tipo:'Renovação anual', valor:'R$ 497,00', status:'Aprovada'},
  {data:'2026-04-20', user:'Cap. Henrique Vasconcellos', tipo:'Assinatura anual', valor:'R$ 497,00', status:'Aprovada'},
  {data:'2026-04-20', user:'Lucas Montoro', tipo:'Assinatura mensal', valor:'R$ 49,90', status:'Aprovada'},
  {data:'2026-04-19', user:'Thiago Brandão', tipo:'Assinatura anual', valor:'R$ 497,00', status:'Aprovada'},
  {data:'2026-04-19', user:'Sgt. Gilberto Nunes', tipo:'Assinatura mensal', valor:'R$ 49,90', status:'Aprovada'},
  {data:'2026-04-18', user:'Pedro Capobianco', tipo:'Renovação anual', valor:'R$ 497,00', status:'Aprovada'},
  {data:'2026-04-18', user:'Cel. Ricardo Aragão', tipo:'Assinatura anual', valor:'R$ 497,00', status:'Aprovada'},
  {data:'2026-04-17', user:'Jean Pallotta', tipo:'Assinatura mensal', valor:'R$ 49,90', status:'Estornada'},
  {data:'2026-04-17', user:'Wesley Cardoso', tipo:'Assinatura anual', valor:'R$ 497,00', status:'Aprovada'}
];

// ---------- Provocações amostrais (Livro Vivo) ----------
const PROVS_SAMPLE = {
  '04-19': {autor_slug:'caleb.montenegro', versiculo:'Tiago 1.22', verso:'Sede cumpridores da palavra, e não somente ouvintes, enganando-vos com falsos discursos.', pergunta:'Quantas vezes hoje você ouviu o que tinha que fazer — e não fez?', texto:'Cristianismo morno começa no dia em que a Palavra vira entretenimento. Versículo virou playlist. Prédica virou podcast. E a vida continua igual. Ouvir sem fazer é autoengano. Não é timidez, é hipocrisia travestida de reflexão.', assinatura:'Caleb Montenegro • Reg. 001'},
  '04-20': {autor_slug:'josue.caetano', versiculo:'Dt 31.6', verso:'Sede fortes e corajosos; não temais, nem vos espanteis diante deles.', pergunta:'Qual medo você tá servindo hoje como se fosse rei?', texto:'Medo não é sentimento, é autoridade que você entregou. Toda vez que você evita uma conversa difícil, empurra uma decisão, disfarça uma fraqueza — você coroa o medo. Josué recebeu mandamento militar: forte e corajoso. Não é sugestão. É ordem.', assinatura:'Josué Caetano • Reg. 002'},
  '04-21': {autor_slug:'davi.valverde', versiculo:'1Sm 17.45', verso:'Tu vens a mim com espada, lança e escudo; porém eu venho a ti em nome do Senhor dos Exércitos.', pergunta:'Você tá tentando vencer hoje no seu recurso ou no nome Dele?', texto:'Davi não subestimou Golias. Ele só nomeou o verdadeiro dono da luta. Quando você tenta vencer no teu recurso — teu carisma, teu networking, teu dinheiro — você entra numa guerra que não é sua. Em nome Dele. O resto é ruído.', assinatura:'Davi Valverde • Reg. 003'},
  '04-22': {autor_slug:'elias.dovale', versiculo:'1Rs 18.21', verso:'Até quando coxeareis entre dois pensamentos? Se o Senhor é Deus, segui-o; se Baal, segui-o.', pergunta:'Em qual área da tua vida você tá coxeando entre dois pensamentos?', texto:'Meio termo é luxo que Elias não permitia. Você não pode servir dois senhores e esperar inteireza. Onde você tá pisando em ovos? Escolhe. Hoje. O céu não responde comitês.', assinatura:'Elias do Vale • Reg. 004'}
};

// ---------- Ranking (usuários ordenados por streak) ----------
const RANKING = USERS.filter(u => u.streak > 0).sort((a,b) => b.streak - a.streak).slice(0,12);

// ---------- MESES ----------
const MESES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

// ---------- Agregados Demografia ----------
function agregarDemografia() {
  const base = USERS.filter(u => u.status === 'Ativo' || u.status === 'Inativo');
  const porGenero = {}, porIdade = {}, porEstado = {}, porProf = {}, porFe = {};
  base.forEach(u => {
    porGenero[u.genero] = (porGenero[u.genero]||0)+1;
    const faixa = u.idade<30?'18-29':u.idade<40?'30-39':u.idade<50?'40-49':'50+';
    porIdade[faixa] = (porIdade[faixa]||0)+1;
    porEstado[u.uf] = (porEstado[u.uf]||0)+1;
    porProf[u.prof] = (porProf[u.prof]||0)+1;
    porFe[u.fe] = (porFe[u.fe]||0)+1;
  });
  return {porGenero, porIdade, porEstado, porProf, porFe, total:base.length};
}
