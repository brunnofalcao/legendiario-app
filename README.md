# LEGENDIARIO — White Label Boilerplate

Este é o esqueleto oficial do produto **LEGENDIARIO** baseado na arquitetura do Diariamente. Siga o manual técnico (`Manual_Tecnico_WhiteLabel.docx`) e o checklist (`Checklist_Implantacao.xlsx`) lado a lado com este README.

---

## 1. Visão geral

**LEGENDIARIO** é um app de provocações diárias em formato de livro digital. Usuário recebe uma provocação por dia durante 365 dias. Mecânica de engajamento por streaks, créditos, desbloqueios e conquistas. Envio diário via WhatsApp Business API.

**Arquitetura:**
- Frontend: SPA em HTML/CSS/JS vanilla (single-file: `index.html`)
- Backend: Node.js + Express em Railway
- Banco: Supabase (PostgreSQL + Auth + RLS)
- Pagamento: Hotmart (webhook)
- Mensageria: WhatsApp Business API (Meta Cloud v22.0+)
- PWA: Service Worker + manifest + proxy separado para lojas (Apple/Android)

---

## 2. Stack e custos mensais estimados

| Serviço | Função | Custo/mês (USD) |
|---|---|---|
| Railway | Backend + PWA proxy (2 services) | $5–$20 |
| Supabase | DB + Auth + Storage | $0 (Free até 500MB) → $25 (Pro) |
| Cloudinary | Imagens e backgrounds mensais | $0 (Free até 25GB) |
| WhatsApp Business | Mensagens (via Meta) | ~$0,005–$0,08 por template |
| Hotmart | Checkout + afiliados | 9,9% por venda (sem mensalidade) |
| Domínio | `.com` ou `.club` | $10–$20/ano |
| Apple Developer | Publicação iOS | $99/ano |
| Google Play Developer | Publicação Android | $25 (único) |

**Total operacional mínimo:** ~$30–$60/mês até 1.000 usuários ativos.

---

## 3. Estrutura de arquivos

```
LEGENDIARIO/
├── public/
│   ├── index.html              # App principal (SPA) — construir a partir do template
│   ├── admin.html              # Dashboard administrativo
│   ├── manifest.json           # PWA manifest
│   ├── sw.js                   # Service Worker
│   ├── privacidade.html        # Política de privacidade
│   ├── 404.html
│   ├── obrigado-aprovado.html  # Pós-compra Hotmart
│   ├── obrigado-aguardando-analise.html
│   ├── obrigado-aguardando-pagamento.html
│   ├── .well-known/
│   │   └── assetlinks.json     # Android TWA
│   └── icons/                  # Ícones PWA (192, 512, maskable)
├── server.js                   # Backend Express
├── package.json
├── .env.example                # Variáveis de ambiente
├── railway/
│   ├── Procfile
│   └── railway.json
├── sql/
│   ├── 01_schema.sql           # Tabelas Supabase
│   ├── 02_rls_policies.sql     # Row Level Security
│   └── 03_seed_provocacoes.sql # Seed de exemplo (10 dias fictícios)
├── whatsapp_templates/
│   └── templates_meta_submit.json   # 9 templates UTILITY prontos
├── email_templates/
│   ├── boas_vindas.html
│   ├── ativacao.html
│   └── perfil_completo.html
├── scripts/
│   ├── submit-whatsapp-templates.js
│   ├── generate-icons.js
│   └── import-provocacoes-csv.js
└── README.md                   # Este arquivo
```

---

## 4. Quickstart (15 passos)

1. Clonar este boilerplate pra um repositório privado no GitHub do licenciado
2. Criar conta Supabase e um novo projeto
3. Rodar `sql/01_schema.sql` e `sql/02_rls_policies.sql` no SQL Editor do Supabase
4. Criar conta Cloudinary e subir logos/backgrounds da marca
5. Criar conta Railway e conectar ao repositório GitHub
6. Preencher `.env` com as credenciais (Supabase, Cloudinary, WhatsApp, Hotmart)
7. Substituir todos os placeholders `LEGENDIARIO`, `legendiario.com`, `#FF4D14`, `#0A0A0A` nos HTMLs e no CSS
8. Criar conta WhatsApp Business (Meta Business Suite) e solicitar WABA
9. Submeter os 9 templates UTILITY de `whatsapp_templates/`
10. Criar produto no Hotmart e configurar webhook apontando pra `https://legendiario.com/webhook/hotmart`
11. Carregar o CSV das 365 provocações (formato abaixo) no admin
12. Testar fluxo completo: compra → email → login → app → WhatsApp diário
13. Configurar domínio customizado no Railway e apontar DNS
14. Gerar ícones PWA (`node scripts/generate-icons.js`) e subir screenshots da loja
15. Publicar nas lojas (Apple/Android) via PWA Builder — seguir `Guia_Publicacao.docx`

---

## 5. Branding — o que customizar

Busque e substitua estes placeholders em TODOS os arquivos do projeto:

| Placeholder | Significado | Exemplo |
|---|---|---|
| `LEGENDIARIO` | Nome da marca | Rotina, Presente, Momentum |
| `legendiario` | Versão lowercase/url-friendly | rotina, presente, momentum |
| `legendiario.com` | Domínio principal | rotina.app |
| `app.legendiario.com` | Subdomínio do app | app.rotina.app |
| `#FF4D14` | Cor principal (HEX) | #14B8A6 (teal do Diariamente) |
| `#0A0A0A` | Cor de destaque | #F59E0B (gold) |
| `https://res.cloudinary.com/legendiario/image/upload/v1/logo/legendiario-mark.png` | URL da logo no Cloudinary | https://res.cloudinary.com/... |
| `Caleb Montenegro` | Autor padrão do conteúdo | Ex: "Autor 1" |
| `Josué Caetano` | Segundo autor (opcional) | Ex: "Autora 2" |
| `Legendiário` | Nome exibido no WhatsApp | LEGENDIARIO |
| `365 dias de confronto, fé e posicionamento` | Slogan da marca | "Seu livro de provocações diárias" |
| `@legendiario` | @ do Instagram | @nomemarca |
| `[COR_AUTOR_1]` | Cor do nome do autor 1 | #14B8A6 |
| `[COR_AUTOR_2]` | Cor do nome do autor 2 | #F59E0B |

---

## 6. Formato do CSV de provocações

365 linhas, UTF-8, separador vírgula, cabeçalho obrigatório:

```csv
dia_ano,mes,dia,autor_dia,citacao,autor_citacao,pergunta,texto,aspas_autor,instagram
01-01,1,1,Caleb Montenegro,"Frase-âncora do dia","Pessoa que disse","Pergunta provocadora do dia?","Texto principal em 1-3 parágrafos","Autor citado na aspas final","@perfil"
01-02,1,2,Josué Caetano,...
```

Campos obrigatórios: `dia_ano`, `mes`, `dia`, `autor_dia`, `pergunta`, `texto`. Demais são opcionais.

---

## 7. O que já está resolvido (não reinvente)

- **WhatsApp:** Templates UTILITY passam pelo filtro Meta. Templates MARKETING só entregam APÓS primeira interação do usuário (regra 131049 do Meta). O fluxo de ativação já considera isso.
- **PWA:** Proxy em repo separado pra publicação nas lojas (Apple rejeita PWA sem Service Worker forte + orientation:portrait + manifest completo). Score PWA Builder de 31/45 atingível.
- **Streaks:** Ciclos de 30 dias, com rewards em 7/21/30. Lifetime achievements (7/21/30/60/90/120/240/365). Tudo no `server.js`.
- **Unlocks:** Dias perdidos ficam bloqueados mas podem ser desbloqueados com créditos (ganhos via streak).
- **Ranking:** Posição absoluta só até Top 10. Depois usa percentil (Top 5/10/25/50%). Filtro por Estado/Profissão só habilita com pool ≥30.

---

## 8. Suporte

- Manual técnico completo: `Manual_Tecnico_WhiteLabel.docx`
- Checklist operacional: `Checklist_Implantacao.xlsx`
- Modelo comercial (contrato, pricing): `Modelo_Comercial_WhiteLabel.docx`

Licença de uso: consulte `LICENSE.md` no pacote comercial. Este boilerplate é distribuído sob licença de uso definida por contrato específico entre Brunno Falcão / Science Play e Legendiário (Science Play).
