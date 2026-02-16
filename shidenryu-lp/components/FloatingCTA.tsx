"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function FloatingCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const heroCTA = document.getElementById("hero-cta");
    if (!heroCTA) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(heroCTA);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden transition-transform duration-300"
      style={{
        transform: visible ? "translateY(0)" : "translateY(100%)",
        padding: "12px 16px",
        paddingBottom: "calc(12px + env(safe-area-inset-bottom))",
        background: "rgba(21,21,21,0.95)",
        backdropFilter: "blur(12px)",
        borderTop: "1px solid var(--color-border)",
      }}
    >
      <Link
        href="/booking"
        className="block w-full bg-accent-red text-white text-center font-semibold py-3.5 rounded-[4px] text-base tracking-wide transition-all hover:bg-accent-red-hover"
      >
        Book Your Experience →
      </Link>
    </div>
  );
}
