import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-foreground flex items-center justify-center">
              <span className="text-background text-base font-semibold leading-none mt-px">P</span>
            </div>
            <span className="text-2xl font-semibold tracking-tight text-foreground">
              Privé<span className="font-normal text-muted">chauffeur</span>
            </span>
          </Link>
        </div>

        {children}
      </div>
    </div>
  );
}
