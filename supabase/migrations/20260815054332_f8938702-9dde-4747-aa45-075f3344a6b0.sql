CREATE TABLE public.worries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.worries TO authenticated;
GRANT ALL ON public.worries TO service_role;
ALTER TABLE public.worries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "worries own" ON public.worries FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.body_checkins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  zone TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.body_checkins TO authenticated;
GRANT ALL ON public.body_checkins TO service_role;
ALTER TABLE public.body_checkins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "body_checkins own" ON public.body_checkins FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.dump_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.dump_events TO authenticated;
GRANT ALL ON public.dump_events TO service_role;
ALTER TABLE public.dump_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "dump_events own" ON public.dump_events FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.moments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  caption TEXT NOT NULL,
  mood_tag TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.moments TO authenticated;
GRANT ALL ON public.moments TO service_role;
ALTER TABLE public.moments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "moments own" ON public.moments FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);