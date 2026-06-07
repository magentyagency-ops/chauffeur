-- ============================================
-- SPRINT 6 — Secure RLS for bookings
-- Run this in Supabase SQL Editor
-- ============================================

-- Drop the insecure public policy
DROP POLICY IF EXISTS "Public can read bookings" ON public.bookings;

-- Re-create the secure policy for drivers to read their own bookings
DROP POLICY IF EXISTS "Drivers see own bookings" ON public.bookings;
CREATE POLICY "Drivers see own bookings" ON public.bookings
  FOR SELECT USING (driver_id = auth.uid());
