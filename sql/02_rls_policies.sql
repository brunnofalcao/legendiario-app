-- =============================================================
-- LEGENDIARIO — Row Level Security (RLS)
-- Aplicar DEPOIS de 01_schema.sql
-- =============================================================

-- ============ CONTEÚDO PÚBLICO ============
-- Provocações: leitura livre pra qualquer user autenticado ou anônimo
ALTER TABLE public.provocacoes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Provocacoes públicas (leitura)" ON public.provocacoes
  FOR SELECT USING (true);

-- Autores: leitura livre (necessário pro app exibir bio/cor/instagram)
ALTER TABLE public.autores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Autores públicos (leitura)" ON public.autores
  FOR SELECT USING (true);

-- Ranking: leitura pública
ALTER TABLE public.ranking_cache ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Ranking leitura pública" ON public.ranking_cache
  FOR SELECT USING (true);

-- ============ USERS ============
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- SELECT: user vê só o próprio
CREATE POLICY "Users leem próprio perfil" ON public.users
  FOR SELECT USING (auth.uid() = id);

-- INSERT: user pode criar o próprio registro (ao confirmar magic link)
CREATE POLICY "Users inserem próprio perfil" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- UPDATE: user atualiza só o próprio
CREATE POLICY "Users atualizam próprio perfil" ON public.users
  FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- ============ USER READS ============
ALTER TABLE public.user_reads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reads SELECT próprio" ON public.user_reads
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Reads INSERT próprio" ON public.user_reads
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Reads DELETE próprio" ON public.user_reads
  FOR DELETE USING (auth.uid() = user_id);

-- ============ USER UNLOCKS ============
ALTER TABLE public.user_unlocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Unlocks SELECT próprio" ON public.user_unlocks
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Unlocks INSERT próprio" ON public.user_unlocks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============ USER ACTIONS ============
ALTER TABLE public.user_actions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Actions SELECT próprio" ON public.user_actions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Actions INSERT próprio" ON public.user_actions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Actions UPDATE próprio" ON public.user_actions
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Actions DELETE próprio" ON public.user_actions
  FOR DELETE USING (auth.uid() = user_id);

-- ============ USER EVENTS (tracking) ============
ALTER TABLE public.user_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Events SELECT próprio" ON public.user_events
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Events INSERT próprio" ON public.user_events
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============ WHATSAPP LOGS ============
-- Sem policy pública — acesso só via SERVICE_ROLE_KEY no backend
ALTER TABLE public.whatsapp_logs ENABLE ROW LEVEL SECURITY;

-- ============ TRIGGER: auto-criar row em public.users quando Auth cria usuário ============
-- Isso dispara ao Brunno clicar no magic link e confirmar email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, created_at)
  VALUES (NEW.id, NEW.email, NEW.created_at)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
