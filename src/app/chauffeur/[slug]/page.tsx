import { mockPublicDriver } from "@/lib/mockPublicDriver";
import DriverHero from "@/components/public-driver/DriverHero";
import AvailabilityCard from "@/components/public-driver/AvailabilityCard";
import FixedRoutesSection from "@/components/public-driver/FixedRoutesSection";
import BookingForm from "@/components/public-driver/BookingForm";
import ReviewsSection from "@/components/public-driver/ReviewsSection";
import LoyaltyBanner from "@/components/public-driver/LoyaltyBanner";
import BookingCTA from "@/components/public-driver/BookingCTA";

// Hidden for now — will be re-added later:
// import ServicesSection from "@/components/public-driver/ServicesSection";
// import VehicleSection from "@/components/public-driver/VehicleSection";
// import TrustSection from "@/components/public-driver/TrustSection";
// import FAQSection from "@/components/public-driver/FAQSection";
// import ServiceAreaSection from "@/components/public-driver/ServiceAreaSection";

export default async function PublicDriverPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const driver = mockPublicDriver;

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
