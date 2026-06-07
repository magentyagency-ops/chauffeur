-- ============================================
-- PrivéChauffeur — Supabase Database Setup
-- Run this in the Supabase SQL Editor
-- ============================================

-- 1. Create driver_profiles table
CREATE TABLE IF NOT EXISTS public.driver_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  city TEXT NOT NULL,
  vehicle_model TEXT NOT NULL,
  public_slug TEXT NOT NULL UNIQUE,
  is_available BOOLEAN DEFAULT false,
  bio TEXT,
  whatsapp TEXT,
  avatar_url TEXT,
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  subscription_status TEXT,
  stripe_price_id TEXT,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable Row Level Security
ALTER TABLE public.driver_profiles ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies
-- Users can read their own profile
CREATE POLICY "Users can view own profile"
  ON public.driver_profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.driver_profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile"
  ON public.driver_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Public can view profiles (for public chauffeur pages)
CREATE POLICY "Public can view driver profiles"
  ON public.driver_profiles
  FOR SELECT
  USING (true);

-- 4. Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_driver_profiles_updated_at
  BEFORE UPDATE ON public.driver_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 5. Index on public_slug for fast lookups
CREATE INDEX IF NOT EXISTS idx_driver_profiles_public_slug
  ON public.driver_profiles(public_slug);
