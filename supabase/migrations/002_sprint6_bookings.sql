-- ============================================================
-- SPRINT 6 — Tables: clients, bookings, booking_events, notifications
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1. CLIENTS
CREATE TABLE IF NOT EXISTS public.clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id uuid NOT NULL REFERENCES public.driver_profiles(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  phone text NOT NULL,
  email text,
  tag text NOT NULL DEFAULT 'Nouveau' CHECK (tag IN ('Nouveau', 'Régulier', 'VIP')),
  notes text,
  total_bookings integer NOT NULL DEFAULT 0,
  last_booking_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(driver_id, phone)
);

-- 2. BOOKINGS
CREATE TABLE IF NOT EXISTS public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id uuid NOT NULL REFERENCES public.driver_profiles(id) ON DELETE CASCADE,
  client_id uuid REFERENCES public.clients(id) ON DELETE SET NULL,
  client_name text NOT NULL,
  client_phone text NOT NULL,
  client_email text,
  pickup_address text NOT NULL,
  destination_address text NOT NULL,
  booking_type text NOT NULL CHECK (booking_type IN ('now', 'later')),
  scheduled_at timestamptz,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'refused', 'completed', 'cancelled')),
  estimated_price numeric,
  final_price numeric,
  notes text,
  internal_driver_note text,
  source text NOT NULL DEFAULT 'public_page',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 3. BOOKING_EVENTS
CREATE TABLE IF NOT EXISTS public.booking_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  driver_id uuid NOT NULL REFERENCES public.driver_profiles(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  previous_status text,
  new_status text,
  message text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 4. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id uuid NOT NULL REFERENCES public.driver_profiles(id) ON DELETE CASCADE,
  booking_id uuid REFERENCES public.bookings(id) ON DELETE CASCADE,
  type text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_clients_driver ON public.clients(driver_id);
CREATE INDEX IF NOT EXISTS idx_bookings_driver ON public.bookings(driver_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(driver_id, status);
CREATE INDEX IF NOT EXISTS idx_bookings_client ON public.bookings(client_id);
CREATE INDEX IF NOT EXISTS idx_booking_events_booking ON public.booking_events(booking_id);
CREATE INDEX IF NOT EXISTS idx_notifications_driver ON public.notifications(driver_id, read);

-- ============================================================
-- RLS POLICIES
-- ============================================================

-- CLIENTS
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Drivers see own clients" ON public.clients;
CREATE POLICY "Drivers see own clients" ON public.clients
  FOR SELECT USING (driver_id IN (SELECT id FROM public.driver_profiles WHERE user_id = auth.uid()));
DROP POLICY IF EXISTS "Drivers update own clients" ON public.clients;
CREATE POLICY "Drivers update own clients" ON public.clients
  FOR UPDATE USING (driver_id IN (SELECT id FROM public.driver_profiles WHERE user_id = auth.uid()));
DROP POLICY IF EXISTS "Service role inserts clients" ON public.clients;
CREATE POLICY "Service role inserts clients" ON public.clients
  FOR INSERT WITH CHECK (true);

-- BOOKINGS
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Drivers see own bookings" ON public.bookings;
CREATE POLICY "Drivers see own bookings" ON public.bookings
  FOR SELECT USING (driver_id IN (SELECT id FROM public.driver_profiles WHERE user_id = auth.uid()));
DROP POLICY IF EXISTS "Drivers update own bookings" ON public.bookings;
CREATE POLICY "Drivers update own bookings" ON public.bookings
  FOR UPDATE USING (driver_id IN (SELECT id FROM public.driver_profiles WHERE user_id = auth.uid()));
DROP POLICY IF EXISTS "Public inserts bookings" ON public.bookings;
CREATE POLICY "Public inserts bookings" ON public.bookings
  FOR INSERT WITH CHECK (true);

-- BOOKING_EVENTS
ALTER TABLE public.booking_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Drivers see own booking events" ON public.booking_events;
CREATE POLICY "Drivers see own booking events" ON public.booking_events
  FOR SELECT USING (driver_id IN (SELECT id FROM public.driver_profiles WHERE user_id = auth.uid()));
DROP POLICY IF EXISTS "Insert booking events" ON public.booking_events;
CREATE POLICY "Insert booking events" ON public.booking_events
  FOR INSERT WITH CHECK (true);

-- NOTIFICATIONS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Drivers see own notifications" ON public.notifications;
CREATE POLICY "Drivers see own notifications" ON public.notifications
  FOR SELECT USING (driver_id IN (SELECT id FROM public.driver_profiles WHERE user_id = auth.uid()));
DROP POLICY IF EXISTS "Drivers update own notifications" ON public.notifications;
CREATE POLICY "Drivers update own notifications" ON public.notifications
  FOR UPDATE USING (driver_id IN (SELECT id FROM public.driver_profiles WHERE user_id = auth.uid()));
DROP POLICY IF EXISTS "Insert notifications" ON public.notifications;
CREATE POLICY "Insert notifications" ON public.notifications
  FOR INSERT WITH CHECK (true);
