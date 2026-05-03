// ─── Mock Availability Data ─────────────────────────────────────────────

export type AvailabilityStatus = "available" | "unavailable" | "expired";
export type AvailabilityMode = "timed" | "manual";

export interface DriverAvailability {
  id: string;
  driver_id: string;
  is_available: boolean;
  available_until: string | null; // ISO string or null if manual
  current_zone: string;
  client_message: string;
  availability_mode: AvailabilityMode;
  last_enabled_at: string | null;
  last_disabled_at: string | null;
  updated_at: string;
  created_at: string;
}

export interface AvailabilityStats {
  time_available_today: string; // e.g. "2h45"
  requests_during_availability: number;
  last_activation: string; // e.g. "Aujourd'hui à 09:15"
}

export interface ScheduledSlot {
  id: string;
  day: string;
  start: string;
  end: string;
  zone: string;
  active: boolean;
}

// Current availability state (simulates DB row)
export const mockAvailability: DriverAvailability = {
  id: "avail-1",
  driver_id: "driver-123",
  is_available: false,
  available_until: null,
  current_zone: "",
  client_message: "",
  availability_mode: "timed",
  last_enabled_at: "2024-06-03T09:15:00Z",
  last_disabled_at: "2024-06-03T11:30:00Z",
  updated_at: "2024-06-03T11:30:00Z",
  created_at: "2024-01-15T08:00:00Z",
};

export const mockAvailabilityStats: AvailabilityStats = {
  time_available_today: "2h45",
  requests_during_availability: 3,
  last_activation: "Aujourd'hui à 09:15",
};

export const mockScheduledSlots: ScheduledSlot[] = [
  { id: "ss1", day: "Lundi", start: "08:00", end: "12:00", zone: "Paris Centre", active: true },
  { id: "ss2", day: "Lundi", start: "14:00", end: "18:00", zone: "La Défense", active: true },
  { id: "ss3", day: "Mercredi", start: "09:00", end: "17:00", zone: "Paris Centre", active: false },
  { id: "ss4", day: "Vendredi", start: "06:00", end: "10:00", zone: "Aéroport CDG", active: true },
];

// ─── Helpers ────────────────────────────────────────────────────────────

const STORAGE_KEY = "prive_chauffeur_availability";

export function getPersistedAvailability(): DriverAvailability {
  if (typeof window === "undefined") return mockAvailability;
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return mockAvailability;
  try {
    return JSON.parse(saved);
  } catch (e) {
    return mockAvailability;
  }
}

export function savePersistedAvailability(avail: DriverAvailability) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(avail));
}

export function isAvailabilityActive(avail: DriverAvailability): boolean {
  if (!avail.is_available) return false;
  if (avail.availability_mode === "manual") return true;
  if (!avail.available_until) return false;
  return new Date(avail.available_until).getTime() > Date.now();
}

export function getTimeRemaining(until: string | null): { minutes: number; label: string } | null {
  if (!until) return null;
  const diff = new Date(until).getTime() - Date.now();
  if (diff <= 0) return null;
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return { minutes: mins, label: `${mins} min` };
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return { minutes: mins, label: m > 0 ? `${h}h${String(m).padStart(2, "0")}` : `${h}h` };
}

export function generateClientMessage(zone: string, until: string | null, mode: AvailabilityMode): string {
  if (mode === "manual") return `Disponible maintenant sur ${zone}.`;
  if (!until) return `Disponible maintenant sur ${zone}.`;
  const time = new Date(until).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  return `Disponible maintenant sur ${zone} jusqu'à ${time}.`;
}

export function getAvailableUntilFromDuration(duration: string): string | null {
  const now = new Date();
  switch (duration) {
    case "30m": return new Date(now.getTime() + 30 * 60000).toISOString();
    case "1h": return new Date(now.getTime() + 60 * 60000).toISOString();
    case "2h": return new Date(now.getTime() + 120 * 60000).toISOString();
    case "4h": return new Date(now.getTime() + 240 * 60000).toISOString();
    case "day": return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59).toISOString();
    case "manual": return null;
    default: return new Date(now.getTime() + 60 * 60000).toISOString();
  }
}

export const DURATION_OPTIONS = [
  { value: "30m", label: "30 min" },
  { value: "1h", label: "1 heure" },
  { value: "2h", label: "2 heures" },
  { value: "4h", label: "4 heures" },
  { value: "day", label: "Toute la journée" },
  { value: "manual", label: "Jusqu'à désactivation" },
] as const;

export const QUICK_ZONES = [
  "Ma ville principale",
  "Centre-ville",
  "Autour de la gare",
  "Zone aéroport",
] as const;
