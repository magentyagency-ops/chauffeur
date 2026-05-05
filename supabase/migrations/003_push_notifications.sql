-- Table pour stocker les abonnements Web Push des chauffeurs
CREATE TABLE IF NOT EXISTS public.push_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID NOT NULL REFERENCES public.driver_profiles(id) ON DELETE CASCADE,
  subscription_json JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS pour les abonnements
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Les chauffeurs peuvent gérer leurs propres abonnements
CREATE POLICY "Drivers can manage their own push subscriptions"
  ON public.push_subscriptions
  FOR ALL
  USING (auth.uid() = driver_id);
