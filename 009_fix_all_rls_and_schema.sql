-- ============================================
-- SPRINT 6 — Fix RLS and Schema Bugs
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. Ensure driver_eta_minutes column exists
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS driver_eta_minutes INTEGER;

-- 2. Allow public to READ bookings (so the client app can poll the status!)
-- Anyone who knows the UUID of the booking can read it.
DROP POLICY IF EXISTS "Public can read bookings" ON public.bookings;
CREATE POLICY "Public can read bookings" ON public.bookings
  FOR SELECT USING (true);

-- 3. Allow drivers to INSERT booking events
DROP POLICY IF EXISTS "Drivers can insert booking events" ON public.booking_events;
CREATE POLICY "Drivers can insert booking events" ON public.booking_events
  FOR INSERT WITH CHECK (driver_id = auth.uid());

-- 4. Allow drivers to INSERT notifications
DROP POLICY IF EXISTS "Drivers can insert notifications" ON public.notifications;
CREATE POLICY "Drivers can insert notifications" ON public.notifications
  FOR INSERT WITH CHECK (driver_id = auth.uid());
