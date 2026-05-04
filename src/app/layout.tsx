import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "PrivéChauffeur — Votre clientèle privée, sans intermédiaire",
  description:
    "Créez votre page de réservation, gérez vos clients et recevez des demandes directes — en quelques minutes. La plateforme pour chauffeurs privés indépendants.",
  keywords: [
    "chauffeur privé",
    "réservation directe",
    "VTC indépendant",
    "plateforme chauffeur",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
