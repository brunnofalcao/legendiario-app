-- =============================================================
-- LEGENDIARIO — Row Level Security (RLS)
-- Aplicar DEPOIS de 01_schema.sql
-- =============================================================

-- Habilitar RLS em todas as tabelas de usuário
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_reads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_unlocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_events ENABLE ROW LEVEL SECURITY;

-- Conteúdo público (leitura livre, escrita só admin)
ALTER TABLE public.provocacoes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Provocacoes públicas (leitura)" ON public.provocacoes
  FOR SELECT USING (true);

-- users: cada usuário vê apenas seu próprio registro
CREATE POLICY "Users leem próprio perfil" ON public.users
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users atualizam próprio perfil" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- user_reads: isolado por usuário
CREATE POLICY "Reads próprios" ON public.user_reads
  FOR ALL USING (auth.uid() = user_id);

-- user_unlocks: isolado por usuário
CREATE POLICY "Unlocks próprios" ON public.user_unlocks
  FOR ALL USING (auth.uid() = user_id);

-- user_actions: isolado por usuário
CREATE POLICY "Actions próprias" ON public.user_actions
  FOR ALL USING (auth.uid() = user_id);

-- user_events: inserção livre, leitura só do próprio
CREATE POLICY "Events leitura própria" ON public.user_events
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Events inserção livre" ON public.user_events
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- whatsapp_logs: só admin via service_role
ALTER TABLE public.whatsapp_logs ENABLE ROW LEVEL SECURITY;
-- (sem policy pública — acesso só via SERVICE_ROLE_KEY no backend)

-- ranking_cache: leitura pública (sem emails), escrita só service_role
ALTER TABLE public.ranking_cache ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Ranking leitura pública" ON public.ranking_cache
  FOR SELECT USING (true);
