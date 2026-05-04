import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { mockPublicDriver } from "@/lib/mockPublicDriver";
import MobileAppUI from "@/components/public-driver/MobileAppUI";

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
    id: dbProfile.id,
    user_id: dbProfile.user_id,
    slug: dbProfile.public_slug,
    publicName: dbProfile.full_name,
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
