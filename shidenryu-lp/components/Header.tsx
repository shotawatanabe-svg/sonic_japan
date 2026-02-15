"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-shadow duration-300 bg-white ${
        scrolled ? "shadow-md" : "border-b border-border"
      }`}
    >
      <div className="max-w-lg mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/" className="font-heading text-xl font-bold tracking-wider text-foreground">
          SHIDENRYU
        </Link>
        <Link
          href="/booking"
          className="bg-primary text-white text-xs font-bold px-4 py-2 rounded transition-opacity hover:opacity-85"
        >
          Book Now
        </Link>
      </div>
    </header>
  );
}
