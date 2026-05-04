"use client";

export type DriverProfile = {
  fullName: string;
  phone: string;
  whatsapp: string;
  city: string;
  bio: string;
  publicSlug: string;
};

const DEFAULT_PROFILE: DriverProfile = {
  fullName: "Chauffeur Privé",
  phone: "",
  whatsapp: "",
  city: "",
  bio: "Bienvenue sur votre profil. Personnalisez votre description ici.",
  publicSlug: "chauffeur-" + Math.random().toString(36).substring(7),
};

const STORAGE_KEY_PREFIX = "privechauffeur_driver_profile_";
const PHOTO_KEY_PREFIX = "privechauffeur_profile_photo_";

export function getPersistedProfile(userId: string = "default"): DriverProfile {
  if (typeof window === 'undefined') return DEFAULT_PROFILE;
  const saved = localStorage.getItem(STORAGE_KEY_PREFIX + userId);
  if (!saved) return DEFAULT_PROFILE;
  try {
    return JSON.parse(saved);
  } catch (e) {
    return DEFAULT_PROFILE;
  }
}

export function savePersistedProfile(profile: DriverProfile, userId: string = "default") {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY_PREFIX + userId, JSON.stringify(profile));
}

export function getPersistedPhoto(userId: string = "default"): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(PHOTO_KEY_PREFIX + userId);
}

export function savePersistedPhoto(photo: string, userId: string = "default") {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PHOTO_KEY_PREFIX + userId, photo);
  } catch (e) {
    console.error("Quota exceeded for photo storage", e);
    alert("La photo est trop lourde pour être enregistrée localement.");
  }
}
