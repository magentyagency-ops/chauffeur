import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { mockPublicDriver } from "@/lib/mockPublicDriver";
import MobileAppUI from "@/components/public-driver/MobileAppUI";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: dbProfile } = await supabase
    .from("driver_profiles")
    .select("full_name, profile_photo_url, city")
    .eq("public_slug", slug)
    .single();

  if (!dbProfile) return { title: "Chauffeur introuvable" };

  const name = dbProfile.full_name;
  const photo = dbProfile.profile_photo_url || "/favicon.ico";

  return {
    title: `${name} — Votre Chauffeur Privé à ${dbProfile.city}`,
    description: `Réservez votre trajet avec ${name}, chauffeur privé professionnel à ${dbProfile.city}.`,
    icons: {
      icon: photo,
      apple: photo,
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: name,
    },
  };
}

export const dynamic = "force-dynamic";

export default async function PublicDriverPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // Fetch real driver profile from Supabase
  const supabase = await createClient();
  const { data: dbProfile } = await supabase
    .from("driver_profiles")
    .select("*")
    .eq("public_slug", slug)
    .single();

  if (!dbProfile) {
    notFound();
  }

  // Build the driver object from real DB data, with mock fallbacks for non-DB fields
  const driver = {
    ...mockPublicDriver,
    // Override with real data from DB
    slug: dbProfile.public_slug,
    publicName: dbProfile.full_name,
    isAvailable: dbProfile.is_available ?? false,
    firstName: dbProfile.full_name?.split(" ")[0] || "Chauffeur",
    city: dbProfile.city || mockPublicDriver.city,
    shortDescription: dbProfile.bio || `Chauffeur privé à ${dbProfile.city || "votre service"}. Réservez votre course en toute simplicité.`,
    phone: dbProfile.phone || mockPublicDriver.phone,
    whatsapp: dbProfile.whatsapp || dbProfile.phone || mockPublicDriver.whatsapp,
    profilePhotoUrl: dbProfile.profile_photo_url || null,
    vehicle: {
      ...mockPublicDriver.vehicle,
      model: dbProfile.vehicle_model || mockPublicDriver.vehicle.model,
    },
  };
  return <MobileAppUI driver={driver} />;
}
