-- ============================================
-- SPRINT 6 — Add driver_eta_minutes to bookings
-- Run this in Supabase SQL Editor
-- ============================================

ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS driver_eta_minutes INTEGER;
