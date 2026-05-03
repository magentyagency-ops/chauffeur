import PublicHeader from "@/components/public-driver/PublicHeader";
import PublicFooter from "@/components/public-driver/PublicFooter";
import StickyMobileCTA from "@/components/public-driver/StickyMobileCTA";
import { mockPublicDriver } from "@/lib/mockPublicDriver";

export default function PublicDriverLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  // In a real app, we would fetch the driver based on params.slug here
  // For now, we use the mock data
  const driver = mockPublicDriver;

  return (
    <div className="min-h-screen bg-background bg-grid font-sans text-foreground scroll-smooth selection:bg-primary/30">
      <PublicHeader driver={driver} />
      
      <div className="flex flex-col min-h-screen pt-16 md:pt-20">
        <div className="flex-1">
          {children}
        </div>
      </div>

      <PublicFooter driver={driver} />
      <StickyMobileCTA driver={driver} />
    </div>
  );
}
