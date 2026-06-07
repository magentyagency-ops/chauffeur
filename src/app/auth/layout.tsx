import Link from "next/link";
import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10 flex justify-center">
          <Link href="/" className="relative w-36 h-12 flex items-center justify-center">
            <Image src="/logonoir.png" alt="Vroom Logo" fill className="object-contain" priority />
          </Link>
        </div>

        {children}
      </div>
    </div>
  );
}
