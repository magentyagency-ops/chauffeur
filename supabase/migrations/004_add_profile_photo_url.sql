-- Ajout de la colonne profile_photo_url dans driver_profiles
ALTER TABLE public.driver_profiles ADD COLUMN IF NOT EXISTS profile_photo_url TEXT;
