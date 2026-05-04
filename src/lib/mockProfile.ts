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
  fullName: "Jean Dupont",
  phone: "06 12 34 56 78",
  whatsapp: "33612345678",
  city: "Paris",
  bio: "Chauffeur privé avec 10 ans d'expérience. Ponctualité et discrétion assurées.",
  publicSlug: "jean-dupont",
};

const STORAGE_KEY = "privechauffeur_driver_profile";

export function getPersistedProfile(): DriverProfile {
  if (typeof window === 'undefined') return DEFAULT_PROFILE;
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return DEFAULT_PROFILE;
  try {
    return JSON.parse(saved);
  } catch (e) {
    return DEFAULT_PROFILE;
  }
}

export function savePersistedProfile(profile: DriverProfile) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

export function getPersistedPhoto(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem("privechauffeur_profile_photo");
}

export function savePersistedPhoto(photo: string) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem("privechauffeur_profile_photo", photo);
  } catch (e) {
    console.error("Quota exceeded for photo storage", e);
    alert("La photo est trop lourde pour être enregistrée. Veuillez utiliser une image plus petite (max 1Mo).");
  }
}
