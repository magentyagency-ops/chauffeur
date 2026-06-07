-- ============================================
-- SPRINT 6 — Fix RLS Policies for drivers
-- Run this in Supabase SQL Editor
-- ============================================

-- CLIENTS
DROP POLICY IF EXISTS "Drivers see own clients" ON public.clients;
CREATE POLICY "Drivers see own clients" ON public.clients
  FOR SELECT USING (driver_id = auth.uid());

DROP POLICY IF EXISTS "Drivers update own clients" ON public.clients;
CREATE POLICY "Drivers update own clients" ON public.clients
  FOR UPDATE USING (driver_id = auth.uid());

-- BOOKINGS
DROP POLICY IF EXISTS "Drivers see own bookings" ON public.bookings;
CREATE POLICY "Drivers see own bookings" ON public.bookings
  FOR SELECT USING (driver_id = auth.uid());

DROP POLICY IF EXISTS "Drivers update own bookings" ON public.bookings;
CREATE POLICY "Drivers update own bookings" ON public.bookings
  FOR UPDATE USING (driver_id = auth.uid());

-- BOOKING_EVENTS
DROP POLICY IF EXISTS "Drivers see own booking events" ON public.booking_events;
CREATE POLICY "Drivers see own booking events" ON public.booking_events
  FOR SELECT USING (driver_id = auth.uid());

-- NOTIFICATIONS
DROP POLICY IF EXISTS "Drivers see own notifications" ON public.notifications;
CREATE POLICY "Drivers see own notifications" ON public.notifications
  FOR SELECT USING (driver_id = auth.uid());

DROP POLICY IF EXISTS "Drivers update own notifications" ON public.notifications;
CREATE POLICY "Drivers update own notifications" ON public.notifications
  FOR UPDATE USING (driver_id = auth.uid());
