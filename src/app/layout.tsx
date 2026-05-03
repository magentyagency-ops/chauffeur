import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "PrivéChauffeur — Développez votre clientèle privée sans dépendre des plateformes",
  description:
    "Créez votre page de réservation, fidélisez vos clients et recevez des demandes directes en quelques minutes. La plateforme SaaS pour chauffeurs privés indépendants.",
  keywords: [
    "chauffeur privé",
    "réservation directe",
    "VTC indépendant",
    "plateforme chauffeur",
    "CRM chauffeur",
    "centrale de réservation",
  ],
  openGraph: {
    title: "PrivéChauffeur — Votre mini centrale de réservation privée",
    description:
      "Développez votre clientèle privée sans dépendre des plateformes. Zéro commission.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
