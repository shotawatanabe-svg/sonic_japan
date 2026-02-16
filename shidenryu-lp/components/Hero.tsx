"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
  const ctaRef = useRef<HTMLDivElement>(null);

  return (
    <section
      className="relative flex flex-col justify-center items-center text-center px-6"
      style={{
        minHeight: "100svh",
        backgroundImage: `
          linear-gradient(180deg, rgba(21,21,21,0.4) 0%, rgba(21,21,21,0.85) 100%),
          url('/images/FV_image.png')
        `,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Label above headline */}
      <motion.span
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-accent text-xs font-bold tracking-[0.2em] uppercase mb-6"
      >
        Authentic Japanese Culture Experience
      </motion.span>

      {/* Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="font-heading text-5xl sm:text-6xl font-bold leading-[1.1] mb-5 text-foreground tracking-wide"
      >
        Learn the <span className="text-accent">Art</span>.
        <br />
        From the <span className="text-accent">Artists</span>.
      </motion.h1>

      {/* Subtext */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="text-foreground-muted text-base sm:text-lg mb-6 max-w-md"
      >
        Professional masters of Japanese culture, in the comfort of your hotel room.
      </motion.p>

      {/* Badges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="flex flex-wrap justify-center gap-2 mb-8"
      >
        {["90 min", "¥40,000", "Beginner OK", "16:00–24:00"].map((badge) => (
          <span
            key={badge}
            className="inline-block border border-border px-3 py-1.5 rounded text-xs text-foreground"
            style={{ background: "rgba(255,255,255,0.08)" }}
          >
            {badge}
          </span>
        ))}
      </motion.div>

      {/* CTA Button */}
      <motion.div
        ref={ctaRef}
        id="hero-cta"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <Link
          href="/booking"
          className="inline-block w-full sm:w-auto bg-accent-red text-white text-center font-semibold py-4 px-12 rounded-[4px] text-base tracking-wide transition-all hover:bg-accent-red-hover hover:-translate-y-0.5"
        >
          Book Your Experience →
        </Link>
      </motion.div>
    </section>
  );
}
