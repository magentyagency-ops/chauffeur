import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vroom — Votre clientèle privée, sans intermédiaire",
  description:
    "Créez votre page de réservation, gérez vos clients et recevez des demandes directes — en quelques minutes. La plateforme pour chauffeurs privés indépendants.",
  keywords: [
    "chauffeur privé",
    "réservation directe",
    "VTC indépendant",
    "plateforme chauffeur",
  ],
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Chauffeur",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

import SplashScreen from "@/components/SplashScreen";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable}`}>
      <body>
        <SplashScreen />
        {children}
      </body>
    </html>
  );
}
