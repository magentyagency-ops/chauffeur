import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { mockPublicDriver } from "@/lib/mockPublicDriver";
import DriverHero from "@/components/public-driver/DriverHero";
import AvailabilityCard from "@/components/public-driver/AvailabilityCard";
import FixedRoutesSection from "@/components/public-driver/FixedRoutesSection";
import BookingForm from "@/components/public-driver/BookingForm";
import ReviewsSection from "@/components/public-driver/ReviewsSection";
import LoyaltyBanner from "@/components/public-driver/LoyaltyBanner";
import BookingCTA from "@/components/public-driver/BookingCTA";

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

  return (
    <main className="max-w-xl mx-auto px-4 sm:px-6 pb-32 pt-8 space-y-10">
      
      {/* Centered Hero & Marketing */}
      <div className="space-y-6">
        <DriverHero driver={driver} />
        <LoyaltyBanner />
        <AvailabilityCard availability={driver.availability} />
      </div>

      <FixedRoutesSection routes={driver.fixedRoutes} />

      <ReviewsSection reviews={driver.reviews} rating={driver.rating} reviewCount={driver.reviewCount} />

      {/* Booking Form Modal (Hidden by default) */}
      <BookingForm availability={driver.availability} driverSlug={slug} />

      {/* Floating CTAs */}
      <BookingCTA />

    </main>
  );
}
