-- =============================================================
-- LEGENDIARIO — Schema Supabase
-- Rodar no SQL Editor do Supabase (projeto novo)
-- =============================================================

-- Autores do conteúdo (10 personas Legendiárias com número de registro)
CREATE TABLE IF NOT EXISTS public.autores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,               -- caleb-montenegro
  nome TEXT NOT NULL,                      -- Caleb Montenegro
  numero_registro TEXT UNIQUE NOT NULL,    -- formato XX.XXX (ex: 71.100)
  instagram TEXT,                          -- @caleb.montenegro
  arquetipo TEXT,                          -- Veterano, Líder, Profeta...
  cor_hex TEXT,                            -- #FF4D14 — cor de identidade visual
  bio_curta TEXT,                          -- 1-2 frases
  persona TEXT,                            -- descrição de voz/tom
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_autores_slug ON public.autores(slug);
CREATE INDEX idx_autores_numero ON public.autores(numero_registro);

-- Usuários do app (espelha auth.users com dados extras)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  nome TEXT,
  telefone TEXT,                           -- E.164: +5511999999999
  whatsapp_enabled BOOLEAN DEFAULT true,
  whatsapp_hour INT DEFAULT 7,             -- Hora local de envio (0-23)
  profissao TEXT,                          -- médico, nutricionista, etc.
  estado TEXT,                             -- UF: SP, RJ, MG...
  cidade TEXT,
  genero TEXT,
  data_nascimento DATE,
  subscription_start DATE,                 -- Quando iniciou os 365 dias
  hotmart_id TEXT,                         -- ID da transação Hotmart
  hotmart_plan TEXT,                       -- anual | vitalicio
  perfil_completo BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Conteúdo: 365 provocações
-- Referencia autor pelo slug (FK) — dados do autor ficam normalizados em autores
CREATE TABLE IF NOT EXISTS public.provocacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dia_ano TEXT UNIQUE NOT NULL,            -- formato MM-DD (ex: "01-15")
  mes INT NOT NULL,                        -- 1-12
  dia INT NOT NULL,                        -- 1-31
  autor_slug TEXT REFERENCES public.autores(slug) ON DELETE SET NULL,
  autor_dia TEXT NOT NULL,                 -- denormalizado: nome do autor (perf)
  autor_numero TEXT,                       -- denormalizado: numero_registro (perf)
  citacao TEXT,                            -- trecho bíblico
  autor_citacao TEXT,                      -- referência bíblica (ex: "Josué 14:12")
  pergunta TEXT NOT NULL,                  -- pergunta provocadora
  texto TEXT NOT NULL,                     -- conteúdo principal
  aspas_autor TEXT,                        -- citação final do autor fictício
  instagram TEXT,                          -- @ do autor (denormalizado)
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_provocacoes_mes_dia ON public.provocacoes(mes, dia);
CREATE INDEX idx_provocacoes_autor ON public.provocacoes(autor_slug);

-- Leituras do usuário (quais dias ele leu)
CREATE TABLE IF NOT EXISTS public.user_reads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  day_id TEXT NOT NULL,                    -- formato MM-DD
  read_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, day_id)
);
CREATE INDEX idx_user_reads_user ON public.user_reads(user_id);

-- Desbloqueios com crédito (dias perdidos recuperados)
CREATE TABLE IF NOT EXISTS public.user_unlocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  day_id TEXT NOT NULL,
  unlocked_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, day_id)
);

-- Ações/compromissos do usuário
CREATE TABLE IF NOT EXISTS public.user_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  day_id TEXT NOT NULL,
  title TEXT NOT NULL,
  descricao TEXT,
  status TEXT DEFAULT 'pending',           -- pending | done
  reminder_date DATE,                       -- lembrete opcional
  created_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);
CREATE INDEX idx_user_actions_user ON public.user_actions(user_id);

-- Eventos (tracking completo do usuário)
CREATE TABLE IF NOT EXISTS public.user_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,                      -- login, read, share, unlock, action_done, ...
  data_json JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_user_events_user_type ON public.user_events(user_id, type);
CREATE INDEX idx_user_events_created ON public.user_events(created_at);

-- Logs WhatsApp (enviados, erros)
CREATE TABLE IF NOT EXISTS public.whatsapp_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  telefone TEXT,
  template TEXT,
  status TEXT,                             -- sent | delivered | read | failed
  error_code TEXT,
  error_message TEXT,
  meta_message_id TEXT,
  payload_json JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_whatsapp_user ON public.whatsapp_logs(user_id);

-- Ranking cache (recalculado periodicamente)
CREATE TABLE IF NOT EXISTS public.ranking_cache (
  user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  posicao_global INT,
  total_global INT,
  percentil NUMERIC,
  streak INT,
  reads_total INT,
  shares INT,
  actions_done INT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Trigger: auto-update updated_at em users
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = now();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
   FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_autores_updated_at BEFORE UPDATE ON public.autores
   FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
