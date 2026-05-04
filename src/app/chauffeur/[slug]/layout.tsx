import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function PublicDriverLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Fetch real driver name from Supabase
  const supabase = await createClient();
  const { data: dbProfile } = await supabase
    .from("driver_profiles")
    .select("full_name, public_slug")
    .eq("public_slug", slug)
    .single();

  if (!dbProfile) {
    notFound();
  }

  const driverName = dbProfile.full_name || "Chauffeur";

  return (
    <div className="bg-black min-h-screen">
      <style dangerouslySetInnerHTML={{ __html: `body { background-color: black !important; }` }} />
      {children}
    </div>
  );
}
