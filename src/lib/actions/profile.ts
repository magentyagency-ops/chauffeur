"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateDriverAvailability(isAvailable: boolean) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Non authentifié" };

    const { error } = await supabase
      .from("driver_profiles")
      .update({ is_available: isAvailable, updated_at: new Date().toISOString() })
      .eq("id", user.id);

    if (error) {
      console.error("Error updating availability:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/dashboard");
    revalidatePath("/chauffeur/[slug]"); // Revalidate public pages
    return { success: true };
  } catch (e) {
    console.error("updateDriverAvailability error:", e);
    return { success: false, error: "Une erreur est survenue" };
  }
}

export async function updateDriverProfile(data: {
  full_name?: string;
  phone?: string;
  whatsapp?: string;
  city?: string;
  bio?: string;
  public_slug?: string;
  vehicle_model?: string;
  profile_photo_url?: string;
}) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Non authentifié" };

    const updatePayload: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };
    if (data.full_name !== undefined) updatePayload.full_name = data.full_name;
    if (data.phone !== undefined) updatePayload.phone = data.phone;
    if (data.whatsapp !== undefined) updatePayload.whatsapp = data.whatsapp;
    if (data.city !== undefined) updatePayload.city = data.city;
    if (data.bio !== undefined) updatePayload.bio = data.bio;
    if (data.public_slug !== undefined) updatePayload.public_slug = data.public_slug;
    if (data.vehicle_model !== undefined) updatePayload.vehicle_model = data.vehicle_model;
    if (data.profile_photo_url !== undefined) updatePayload.avatar_url = data.profile_photo_url;

    const { error } = await supabase
      .from("driver_profiles")
      .update(updatePayload)
      .eq("id", user.id);

    if (error) {
      console.error("Error updating profile:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/dashboard/profile");
    revalidatePath("/", "layout");
    if (data.public_slug) {
      revalidatePath(`/chauffeur/${data.public_slug}`);
      revalidatePath(`/chauffeur/${data.public_slug}`, "layout");
    }
    return { success: true };
  } catch (e) {
    console.error("updateDriverProfile error:", e);
    return { success: false, error: "Une erreur est survenue" };
  }
}
