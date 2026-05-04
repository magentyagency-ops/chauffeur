import { mockPublicDriver } from "@/lib/mockPublicDriver";
import Link from "next/link";

export default async function PublicDriverLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const driver = mockPublicDriver;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <nav className="sticky top-0 z-50 bg-surface/90 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto h-14 flex items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-foreground flex items-center justify-center">
              <span className="text-background text-sm font-semibold leading-none mt-px">P</span>
            </div>
            <span className="text-[15px] font-semibold tracking-tight">
              {driver.publicName || driver.firstName}
            </span>
          </div>
          <a href="#booking-form" className="btn-primary !py-2 !px-5 !text-[13px]">
            Réserver
          </a>
        </div>
      </nav>

      <div className="flex flex-col min-h-screen">
        <div className="flex-1">{children}</div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6 text-center">
        <p className="text-[13px] text-muted">
          Propulsé par{" "}
          <Link href="/" className="text-foreground font-medium hover:underline">PrivéChauffeur</Link>
        </p>
      </footer>
    </div>
  );
}
