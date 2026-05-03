import { mockPublicDriver } from "@/lib/mockPublicDriver";
import DriverHero from "@/components/public-driver/DriverHero";
import AvailabilityCard from "@/components/public-driver/AvailabilityCard";
import ServicesSection from "@/components/public-driver/ServicesSection";
import FixedRoutesSection from "@/components/public-driver/FixedRoutesSection";
import VehicleSection from "@/components/public-driver/VehicleSection";
import TrustSection from "@/components/public-driver/TrustSection";
import BookingForm from "@/components/public-driver/BookingForm";
import ReviewsSection from "@/components/public-driver/ReviewsSection";
import FAQSection from "@/components/public-driver/FAQSection";
import ServiceAreaSection from "@/components/public-driver/ServiceAreaSection";

export default async function PublicDriverPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // Simulate fetching driver from DB based on slug
  const driver = mockPublicDriver;

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 pb-24 md:pb-12 space-y-16 md:space-y-24">
      
      {/* Top Section: Hero + Booking Form Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-8">
        <div className="lg:col-span-7 xl:col-span-8 space-y-10">
          <DriverHero driver={driver} />
          <AvailabilityCard availability={driver.availability} firstName={driver.firstName} />
        </div>
        
        {/* Booking Form */}
        <div className="lg:col-span-5 xl:col-span-4" id="booking-form">
          <div className="sticky top-28">
            <BookingForm availability={driver.availability} driverSlug={slug} />
          </div>
        </div>
      </div>

      <TrustSection />

      <FixedRoutesSection routes={driver.fixedRoutes} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <ServicesSection services={driver.services} />
        <ServiceAreaSection areas={driver.serviceAreas} city={driver.city} />
      </div>

      <VehicleSection vehicle={driver.vehicle} />
      
      <ReviewsSection reviews={driver.reviews} rating={driver.rating} reviewCount={driver.reviewCount} />

      <FAQSection />

    </main>
  );
}
