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
      .eq("user_id", user.id);

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

    const { error } = await supabase
      .from("driver_profiles")
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id);

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
