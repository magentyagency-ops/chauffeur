"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 sm:px-10 ${
        scrolled
          ? "bg-background/85 backdrop-blur-xl border-b border-surface-border h-16"
          : "bg-transparent h-20"
      }`}
    >
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-full bg-foreground flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
            <span className="display text-background text-base font-medium italic -mt-0.5">P</span>
          </div>
          <span className="text-lg font-bold text-foreground tracking-tight">
            Privé<span className="opacity-60 font-medium">chauffeur</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-10">
          {["Fonctionnalités", "Comment ça marche", "Tarifs"].map((label) => (
            <a
              key={label}
              href={`#${label.toLowerCase().replace(/ /g, "-")}`}
              className="text-sm font-medium text-text-muted hover:text-foreground transition-colors"
            >
              {label}
            </a>
          ))}
        </div>

        {/* Auth CTAs */}
        <div className="flex items-center gap-3">
          <Link
            href="/auth/login"
            className="hidden sm:block text-sm font-medium text-text-muted hover:text-foreground px-4 py-2 transition-colors"
          >
            Connexion
          </Link>
          <Link
            href="/auth/register"
            className="btn-black !text-sm !py-2.5 !px-5"
          >
            Commencer
          </Link>
        </div>
      </div>
    </nav>
  );
}
