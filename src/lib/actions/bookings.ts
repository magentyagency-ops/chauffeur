"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { sendPushNotification } from "./notifications";

// ─── Types ──────────────────────────────────────────────────────────────
export type CreateBookingInput = {
  driverSlug: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  pickupAddress: string;
  destinationAddress: string;
  bookingType: "now" | "later";
  scheduledAt?: string;
  notes?: string;
};

export type BookingResult = {
  success: boolean;
  error?: string;
  errorCode?: "DRIVER_NOT_FOUND" | "VALIDATION_ERROR" | "DRIVER_UNAVAILABLE" | "NETWORK_ERROR";
  booking?: any;
};

// ─── Allowed status transitions ─────────────────────────────────────────
const ALLOWED_TRANSITIONS: Record<string, string[]> = {
  pending: ["accepted", "refused", "cancelled"],
  accepted: ["completed", "cancelled"],
};

// ─── createBooking ──────────────────────────────────────────────────────
export async function createBooking(input: CreateBookingInput): Promise<BookingResult> {
  try {
    const supabase = await createClient();

    // Validate required fields and enforce strict length limits (Security: Payload Size / DoS prevention)
    if (!input.clientName?.trim() || input.clientName.length > 100) return { success: false, error: "Nom invalide (max 100 char).", errorCode: "VALIDATION_ERROR" };
    if (!input.clientPhone?.trim() || input.clientPhone.length > 20) return { success: false, error: "Téléphone invalide.", errorCode: "VALIDATION_ERROR" };
    if (!input.pickupAddress?.trim() || input.pickupAddress.length > 255) return { success: false, error: "L'adresse de départ est trop longue.", errorCode: "VALIDATION_ERROR" };
    if (!input.destinationAddress?.trim() || input.destinationAddress.length > 255) return { success: false, error: "L'adresse d'arrivée est trop longue.", errorCode: "VALIDATION_ERROR" };
    if (input.clientEmail && (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.clientEmail) || input.clientEmail.length > 150)) {
      return { success: false, error: "Email invalide.", errorCode: "VALIDATION_ERROR" };
    }

    if (input.bookingType === "later") {
      if (!input.scheduledAt) return { success: false, error: "La date est requise pour une réservation programmée.", errorCode: "VALIDATION_ERROR" };
      if (new Date(input.scheduledAt) < new Date()) return { success: false, error: "La date ne peut pas être dans le passé.", errorCode: "VALIDATION_ERROR" };
    }

    // Find driver by slug
    const { data: driver, error: driverErr } = await supabase
      .from("driver_profiles")
      .select("id, full_name, public_slug, is_available")
      .eq("public_slug", input.driverSlug)
      .single();

    if (driverErr || !driver) {
      return { success: false, error: "Chauffeur introuvable.", errorCode: "DRIVER_NOT_FOUND" };
    }

    // If booking type is "now", check availability
    if (input.bookingType === "now" && !driver.is_available) {
      return { success: false, error: "Ce chauffeur n'est plus disponible pour une course immédiate. Vous pouvez réserver pour plus tard.", errorCode: "DRIVER_UNAVAILABLE" };
    }

    // Execute the secure RPC function to bypass RLS for creating clients and bookings
    const { data: result, error: rpcError } = await supabase.rpc("submit_booking", {
      p_driver_id: driver.id,
      p_client_name: input.clientName.trim(),
      p_client_phone: input.clientPhone.trim(),
      p_client_email: input.clientEmail?.trim() || null,
      p_pickup_address: input.pickupAddress.trim(),
      p_destination_address: input.destinationAddress.trim(),
      p_booking_type: input.bookingType,
      p_scheduled_at: input.bookingType === "later" ? input.scheduledAt : new Date().toISOString(),
      p_notes: input.notes?.trim() || null,
    });

    if (rpcError) {
      console.error("RPC Error:", rpcError);
      return { success: false, error: "Erreur lors de la création de la réservation.", errorCode: "NETWORK_ERROR" };
    }

    // Trigger Push Notification for the driver (Async)
    if (result?.booking_id) {
      console.log("Triggering push notification for driver:", driver.id, "Booking:", result.booking_id);
      sendPushNotification(driver.id, {
        title: "Nouvelle demande de course !",
        body: `${input.clientName} demande : ${input.pickupAddress.split(',')[0]} → ${input.destinationAddress.split(',')[0]}`,
        url: `/dashboard`
      }).catch(err => console.error("Push notification trigger error:", err));
    } else {
      console.log("No booking_id returned from RPC, skipping push. Result:", result);
    }

    // Return immediately to make the client UI ultra-fast.
    // Dashboard handles updates via Realtime/Polling.
    return { success: true, booking: { id: result.booking_id } };
  } catch (e) {
    console.error("createBooking error:", e);
    return { success: false, error: "Une erreur est survenue.", errorCode: "NETWORK_ERROR" };
  }
}

// ─── getBookingStatus (Public) ──────────────────────────────────────────
export async function getBookingStatus(bookingId: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("bookings")
      .select("status, driver_eta_minutes")
      .eq("id", bookingId)
      .single();
    
    if (error || !data) return null;
    return { status: data.status, eta: data.driver_eta_minutes };
  } catch {
    return null;
  }
}

// ─── updateBookingStatus ────────────────────────────────────────────────
export async function updateBookingStatus(input: {
  bookingId: string;
  newStatus: string;
  reason?: string;
  estimatedPrice?: number;
  finalPrice?: number;
  etaMinutes?: number;
}) {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Non authentifié." };

    // Get driver profile
    const { data: profile } = await supabase
      .from("driver_profiles")
      .select("id")
      .eq("id", user.id)
      .single();

    if (!profile) return { success: false, error: "Profil chauffeur introuvable." };

    // Get booking and verify ownership
    const { data: booking, error: bookingErr } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", input.bookingId)
      .eq("driver_id", profile.id)
      .single();

    if (bookingErr || !booking) return { success: false, error: "Réservation introuvable." };

    // Check allowed transition
    const allowed = ALLOWED_TRANSITIONS[booking.status] || [];
    if (!allowed.includes(input.newStatus)) {
      return { success: false, error: `Transition de ${booking.status} à ${input.newStatus} non autorisée.` };
    }

    // Update booking
    const updateData: any = {
      status: input.newStatus,
      updated_at: new Date().toISOString(),
    };
    if (input.estimatedPrice !== undefined) updateData.estimated_price = input.estimatedPrice;
    if (input.finalPrice !== undefined) updateData.final_price = input.finalPrice;
    if (input.etaMinutes !== undefined) updateData.driver_eta_minutes = input.etaMinutes;

    const { data: updated, error: updateErr } = await supabase
      .from("bookings")
      .update(updateData)
      .eq("id", input.bookingId)
      .select("*")
      .single();

    if (updateErr) return { success: false, error: "Erreur lors de la mise à jour." };

    // Create booking event
    await supabase.from("booking_events").insert({
      booking_id: input.bookingId,
      driver_id: profile.id,
      event_type: `status_${input.newStatus}`,
      previous_status: booking.status,
      new_status: input.newStatus,
      message: input.reason || `Statut changé de ${booking.status} à ${input.newStatus}.`,
    });

    // Create notification
    const notifTitles: Record<string, string> = {
      accepted: "Réservation acceptée",
      refused: "Réservation refusée",
      completed: "Course terminée",
      cancelled: "Réservation annulée",
    };
    await supabase.from("notifications").insert({
      driver_id: profile.id,
      booking_id: input.bookingId,
      type: `booking_${input.newStatus}`,
      title: notifTitles[input.newStatus] || "Mise à jour",
      message: `${booking.client_name} — ${notifTitles[input.newStatus] || input.newStatus}.`,
    });

    revalidatePath("/dashboard", "layout");
    return { success: true, booking: updated };
  } catch (e) {
    console.error("updateBookingStatus error:", e);
    return { success: false, error: "Une erreur est survenue." };
  }
}

// ─── getDriverBookings ──────────────────────────────────────────────────
export async function getDriverBookings(filters?: {
  status?: string;
  search?: string;
  dateRange?: "today" | "week" | "all";
}) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Non authentifié.", bookings: [] };

    const { data: profile } = await supabase
      .from("driver_profiles")
      .select("id")
      .eq("id", user.id)
      .single();

    if (!profile) return { success: false, error: "Profil introuvable.", bookings: [] };

    let query = supabase
      .from("bookings")
      .select("*, clients(full_name, phone, email, tag)")
      .eq("driver_id", profile.id)
      .order("created_at", { ascending: false });

    // Status filter
    if (filters?.status && filters.status !== "all") {
      query = query.eq("status", filters.status);
    }

    // Date range
    if (filters?.dateRange === "today") {
      const start = new Date(); start.setHours(0, 0, 0, 0);
      query = query.gte("created_at", start.toISOString());
    } else if (filters?.dateRange === "week") {
      const start = new Date(); start.setDate(start.getDate() - 7);
      query = query.gte("created_at", start.toISOString());
    }

    // Search
    if (filters?.search?.trim()) {
      const s = filters.search.trim();
      query = query.or(`client_name.ilike.%${s}%,pickup_address.ilike.%${s}%,destination_address.ilike.%${s}%,client_phone.ilike.%${s}%`);
    }

    const { data, error } = await query.limit(50);
    return { success: true, bookings: data || [], driverId: profile.id };
  } catch (e) {
    console.error("getDriverBookings error:", e);
    return { success: false, error: "Erreur.", bookings: [] };
  }
}

// ─── getBookingDetail ───────────────────────────────────────────────────
export async function getBookingDetail(bookingId: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Non authentifié." };

    const { data: profile } = await supabase
      .from("driver_profiles")
      .select("id")
      .eq("id", user.id)
      .single();

    if (!profile) return { success: false, error: "Profil introuvable." };

    const { data: booking, error } = await supabase
      .from("bookings")
      .select("*, clients(full_name, phone, email, tag, total_bookings, notes)")
      .eq("id", bookingId)
      .eq("driver_id", profile.id)
      .single();

    if (error || !booking) return { success: false, error: "Réservation introuvable." };

    const { data: events } = await supabase
      .from("booking_events")
      .select("*")
      .eq("booking_id", bookingId)
      .order("created_at", { ascending: true });

    return { success: true, booking, events: events || [] };
  } catch (e) {
    console.error("getBookingDetail error:", e);
    return { success: false, error: "Erreur." };
  }
}

// ─── getDashboardStats ──────────────────────────────────────────────────
export async function getDashboardStats() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile } = await supabase
      .from("driver_profiles")
      .select("id")
      .eq("id", user.id)
      .single();

    if (!profile) return null;

    const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);

    const [todayBookings, acceptedBookings, totalClients, revenueData] = await Promise.all([
      supabase.from("bookings").select("id", { count: "exact", head: true }).eq("driver_id", profile.id).gte("created_at", todayStart.toISOString()),
      supabase.from("bookings").select("id", { count: "exact", head: true }).eq("driver_id", profile.id).eq("status", "accepted"),
      supabase.from("clients").select("id", { count: "exact", head: true }).eq("driver_id", profile.id),
      supabase.from("bookings").select("estimated_price, final_price").eq("driver_id", profile.id).in("status", ["accepted", "completed"]),
    ]);

    const revenue = (revenueData.data || []).reduce((sum: number, b: any) => sum + (b.final_price || b.estimated_price || 0), 0);

    return {
      today_requests: todayBookings.count || 0,
      confirmed_bookings: acceptedBookings.count || 0,
      private_clients: totalClients.count || 0,
      estimated_revenue: Math.round(revenue),
    };
  } catch (e) {
    console.error("getDashboardStats error:", e);
    return null;
  }
}

// ─── updateInternalNote ─────────────────────────────────────────────────
export async function updateInternalNote(bookingId: string, note: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false };

    const { data: profile } = await supabase.from("driver_profiles").select("id").eq("id", user.id).single();
    if (!profile) return { success: false };

    await supabase
      .from("bookings")
      .update({ internal_driver_note: note, updated_at: new Date().toISOString() })
      .eq("id", bookingId)
      .eq("driver_id", profile.id);

    return { success: true };
  } catch {
    return { success: false };
  }
}
