-- =============================================================
-- LEGENDIARIO — Seed inicial
-- PARTE A: 10 autores fictícios com número de registro
-- PARTE B: 10 provocações amostrais (dias 1-10) rotacionando autores
-- =============================================================

-- =============================================================
-- PARTE A — SEED DOS 10 AUTORES FICTÍCIOS
-- =============================================================

INSERT INTO public.autores (slug, nome, numero_registro, instagram, arquetipo, cor_hex, bio_curta, persona) VALUES
('caleb-montenegro','Caleb Montenegro','71.100','@caleb.montenegro','Veterano','#FF4D14',
 'Guerreiro que tomou a montanha aos 85 anos. Não foi tímido na juventude e não vai ser na velhice.',
 'Homem 50s, voz grave, veterano espiritual. Fala em imperativo. Rejeita desculpas. Direto e severo quando é pra confrontar, pai quando é pra acolher.'),

('josue-caetano','Josué Caetano','71.204','@josue.caetano','Líder','#0A0A0A',
 'Atravessou o Jordão porque confiou antes de ver a água abrir. Líder não pede licença pra obedecer.',
 'Homem 40s, líder nato. Linguagem de comando militar. Fala curto, decide rápido, executa sem olhar pra trás.'),

('davi-valverde','Davi Valverde','71.337','@davi.valverde','Adorador-Guerreiro','#4B5320',
 'Da pedra ao trono. A mesma mão que toca harpa corta cabeça de gigante.',
 'Homem 30s, ministra e luta. Mistura oração com força. Poesia cru, espada na outra mão.'),

('elias-dovale','Elias do Vale','71.418','@elias.dovale','Profeta de Fogo','#D4A017',
 'Falou ao rei e não tremeu. Trouxe fogo do céu e fugiu da rainha. Profeta é humano, mas o recado é divino.',
 'Homem 40s, profético, confrontador. Linguagem apocalíptica. Não pede licença pra dizer o que ninguém quer ouvir.'),

('gideao-sampaio','Gideão Sampaio','71.525','@gideao.sampaio','Estrategista','#6B5D4F',
 'Reduziu o exército de 32 mil a 300 e venceu com trombeta. Deus gosta de vitória sem crédito humano.',
 'Homem 30s, mente fria, fé quente. Planeja enquanto outros reclamam. Fala técnica com peso espiritual.'),

('neemias-barros','Neemias Barros','71.612','@neemias.barros','Reconstrutor','#8B7E66',
 'Largou o palácio pra reconstruir muro em ruínas. Com a espada numa mão e a colher de pedreiro na outra.',
 'Homem 50s, pragmático, visionário. Fala de obra, projeto, reconstrução. Não faz drama, faz.'),

('samuel-queiroga','Samuel Queiroga','70.089','@samuelqueiroga','Mentor','#2D4A2B',
 'Ungiu reis e rejeitou reis. Juiz que ouve antes de falar e fala antes de calar quando o povo teima.',
 'Homem 60s, sábio, paciente. Voz suave mas firme. Ensina através de pergunta e silêncio.'),

('benjamim-paiva','Benjamim Paiva','72.183','@benjamim.paiva','Intensidade Bruta','#8B0000',
 'Tribo pequena, mordida de leão. Não precisa ser muito pra ser forte. Precisa ser inteiro.',
 'Homem 20s, intensidade jovem, zero filtro. Fala como rua, pensa como guerreiro.'),

('ezequiel-ferraz','Ezequiel Ferraz','71.749','@ezequielferraz','Visão Profética','#333D26',
 'Viu ossos secos ganharem carne. Profeta que olha pro impossível e diz: profetiza aí.',
 'Homem 40s, visionário, simbólico. Linguagem metafórica, visões, contraste vivo/morto.'),

('jonatas-pellegrino','Jônatas Pellegrino','71.866','@jonataspellegrino','Fidelidade Radical','#5C4033',
 'Escolheu Davi contra o próprio pai. Aliança é contrato de sangue, não de conveniência.',
 'Homem 30s, leal até o osso, emocionalmente maduro. Fala de amizade, pacto, irmandade sem melosidade.');


-- =============================================================
-- PARTE B — 10 PROVOCAÇÕES AMOSTRAIS (dias 01-01 a 01-10)
-- Tom: devocional cristão, guerreiro, confronto, fé, posicionamento
-- =============================================================

INSERT INTO public.provocacoes (dia_ano, mes, dia, autor_slug, autor_dia, autor_numero, citacao, autor_citacao, pergunta, texto, aspas_autor, instagram) VALUES

('01-01', 1, 1, 'caleb-montenegro', 'Caleb Montenegro', '71.100',
 'Dai-me, pois, agora este monte.', 'Josué 14:12',
 'Que monte você está pedindo a Deus esse ano — ou ainda quer o mesmo vale de conforto?',
 'Caleb tinha 85 anos quando pediu o monte. Não o vale, não a planície, não o que já estava limpo. O monte. O lugar com gigantes. Você tem 30, 40, 50 anos e está pedindo a Deus o quê? Que as coisas melhorem? Que o ano seja leve? Caleb pediu terreno de guerra. Ele sabia que ali tinha inimigo. E foi. A maioria dos crentes morre espiritualmente pedindo vale. Deus está entregando monte pra quem tem coragem de tomar. 2026 é o quê pra você: outro ano de sobrevivência ou o ano do monte?',
 'O monte é pra quem tem coragem de subir, não pra quem fica pedindo descida.',
 '@caleb.montenegro'),

('01-02', 1, 2, 'josue-caetano', 'Josué Caetano', '71.204',
 'Esforça-te e tem bom ânimo.', 'Josué 1:6',
 'Quantas decisões você está segurando só por medo de errar — e que preço você já pagou pela indecisão?',
 'Josué ouviu isso quatro vezes em um único capítulo. Não é à toa. Líder vive entre a vontade de avançar e o medo de errar. Deus não disse "pensa bem", disse "vai". Você está aí há quanto tempo esperando clareza perfeita pra começar? Clareza não vem sentado. Vem no caminho. Atravessa o Jordão primeiro, as águas se abrem depois. Quem espera condição ideal, morre na margem.',
 'Clareza não vem sentado. Vem no caminho.',
 '@josue.caetano'),

('01-03', 1, 3, 'davi-valverde', 'Davi Valverde', '71.337',
 'Assim cingiu Davi a sua espada sobre as suas vestes.', '1 Samuel 17:39',
 'O que em você é harpa e o que é espada — e qual dos dois você anda negligenciando?',
 'Davi tocava harpa no palácio e cortava cabeça no vale. Não eram dois homens. Era o mesmo. Você quer ser só sensível ou só duro? Isso não é caráter, é fraqueza disfarçada. O guerreiro que só sabe matar é bruto. O adorador que só sabe chorar é covarde. Legendário carrega harpa e espada na mesma mochila. Ora forte, trabalha forte, ama forte, enfrenta forte. Ponto.',
 'Harpa e espada na mesma mão — ou você nem é guerreiro nem é adorador.',
 '@davi.valverde'),

('01-04', 1, 4, 'elias-dovale', 'Elias do Vale', '71.418',
 'Ainda deixei em Israel sete mil.', '1 Reis 19:18',
 'Em que ponto você se acha único guerreiro na batalha — e que orgulho disfarçado tem nisso?',
 'Elias achou que era o último. Deus disse: tem sete mil que você não viu. A autopiedade do guerreiro é armadilha sutil. "Só eu luto, só eu vejo, só eu me importo." Mentira. Tem mais gente no front, você só não enxerga porque está trancado dentro da sua caverna de exaustão. Sai. Come. Dorme. Volta. A guerra continua com ou sem você — e você não é o centro dela.',
 'Autopiedade de guerreiro é orgulho disfarçado de cansaço.',
 '@elias.dovale'),

('01-05', 1, 5, 'gideao-sampaio', 'Gideão Sampaio', '71.525',
 'O povo que contigo está é demais.', 'Juízes 7:2',
 'Que "ajuda" você está mantendo perto só porque tem medo de lutar com exército menor?',
 'Gideão tinha 32 mil homens. Deus reduziu pra 300. Não porque fossem mais fortes — porque eram os certos. Você anda lotado de gente, de ideia, de plano, de compromisso, e nada avança. Pode ser que Deus queira cortar. Cortar agenda, cortar sócio, cortar amizade, cortar produto. A vitória com 32 mil vira mérito humano. A vitória com 300 vira testemunho. Quem você precisa soltar pra Deus fazer o impossível?',
 'Exército grande rouba o crédito da vitória de Deus.',
 '@gideao.sampaio'),

('01-06', 1, 6, 'neemias-barros', 'Neemias Barros', '71.612',
 'E pus guarda contra eles de dia e de noite.', 'Neemias 4:9',
 'Onde na sua vida você está orando e não está guardando — ou guardando e não está orando?',
 'Neemias orava. Neemias também colocava guarda. Não era uma coisa OU outra. Era as duas. Tem crente que só ora e não executa. Tem executor que só executa e não ora. Os dois são burros, em lados opostos. A obra se levanta com oração E espada. Com fé E muro. Com submissão E firmeza. Se você só reza pelo seu casamento mas não guarda teu coração, o muro cai. Se você só disciplina teu corpo mas não ora, cai também. As duas coisas. Sempre as duas.',
 'Oração sem guarda é ingenuidade. Guarda sem oração é arrogância.',
 '@neemias.barros'),

('01-07', 1, 7, 'samuel-queiroga', 'Samuel Queiroga', '70.089',
 'Fala, Senhor, que o teu servo ouve.', '1 Samuel 3:9',
 'Quando foi a última vez que você ouviu Deus — não leu sobre Ele, não falou com Ele, ouviu?',
 'Samuel era um menino e aprendeu a ouvir. Você é adulto, tem Bíblia, tem acesso a mil podcasts, e não ouve. Escuta não é ruído de fora, é silêncio de dentro. Você não ouve Deus porque tem a boca cheia de pedidos, a cabeça cheia de scroll, a agenda cheia de tarefa. Cala. Escuta. Dez minutos. Sem Bíblia, sem música, sem celular. Só cala e diz: fala, Senhor. Você vai ouvir coisas que evitou por anos.',
 'Quem não cala não ouve. E quem não ouve, não muda.',
 '@samuelqueiroga'),

('01-08', 1, 8, 'benjamim-paiva', 'Benjamim Paiva', '72.183',
 'E os filhos de Benjamim eram homens valentes.', 'Juízes 20:16',
 'Você anda medindo força pelo tamanho ou pela inteireza — e quando foi que começou a se achar pequeno?',
 'Tribo de Benjamim era pequena. Mas os caras acertavam um fio de cabelo com funda, de costas, de longe. Tamanho não decide nada. Inteireza decide tudo. Você tem um negócio pequeno, uma família pequena, um ministério pequeno, uma influência pequena — e tá ótimo. O problema não é o tamanho. É a falta de treino. De pontaria. De prática. Quer crescer? Foca no que tem e treina o dobro. Benjamim pequeno dava medo no exército grande. Faz igual.',
 'Tamanho não vence guerra. Pontaria vence.',
 '@benjamim.paiva'),

('01-09', 1, 9, 'ezequiel-ferraz', 'Ezequiel Ferraz', '71.749',
 'Porventura, viverão estes ossos?', 'Ezequiel 37:3',
 'Que área da sua vida você já enterrou — e que Deus ainda está esperando você profetizar sobre ela?',
 'Deus mostrou ossos secos a Ezequiel e fez uma pergunta irritante: viverão? Ezequiel não respondeu sim nem não. Disse: "Senhor, tu o sabes." Inteligente. Tem coisa na sua vida que parece osso seco: o casamento, a saúde, a fé, o sonho, o filho, a missão. Você já enterrou. Deus pergunta: vai viver? Não responde com otimismo barato nem com derrota covarde. Responde com obediência: Senhor, tu sabes — e profetiza em cima. O que você enterrou pode ainda andar.',
 'O que parece morto pode só estar esperando voz.',
 '@ezequielferraz'),

('01-10', 1, 10, 'jonatas-pellegrino', 'Jônatas Pellegrino', '71.866',
 'Entrou em aliança com Davi.', '1 Samuel 18:3',
 'Quem é o teu Davi — e o que você já abriu mão, de verdade, pra manter essa aliança?',
 'Jônatas era filho do rei. Por sangue, herdeiro. Escolheu Davi — o rapaz que ia tomar o trono dele — e fez pacto. Tirou o próprio manto e deu. Tirou a espada, deu. Tirou o arco, deu. Amizade de verdade tira coisa. Não é quem curte seu post. É quem renuncia trono por você. E você, tem alguém assim? Você É alguém assim? Pacto custa. Relação rasa é gostosa. Aliança é sangue. Com quem você sangra?',
 'Curtir post não é aliança. Aliança custa trono.',
 '@jonataspellegrino');
