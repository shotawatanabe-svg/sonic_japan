"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative bg-background">
      <div className="max-w-lg mx-auto px-4 pt-4 pb-8">
        {/* Hero Image Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative h-52 sm:h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center mb-6 overflow-hidden"
        >
          <div className="text-center text-gray-400">
            <span className="text-4xl block mb-2">⚔️</span>
            <span className="text-sm font-bold">Samurai Performance Photo / Video</span>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-heading text-3xl sm:text-4xl font-bold leading-tight mb-3 text-foreground"
        >
          Step Into the
          <br />
          World of Samurai.
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-foreground-muted text-sm leading-relaxed mb-4"
        >
          Authentic Japanese cultural experiences delivered to your hotel room.
          <br />
          Professional performers come to you.
        </motion.p>

        {/* Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap gap-2 mb-6"
        >
          {["90 min", "¥40,000", "Beginner OK", "16:00–24:00"].map((badge) => (
            <span
              key={badge}
              className="inline-block bg-background-alt border border-border px-3 py-1 rounded-full text-xs text-foreground-muted"
            >
              {badge}
            </span>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Link
            href="/booking"
            className="block w-full bg-primary text-white text-center font-bold py-4 rounded-lg hover:opacity-85 transition-opacity text-base"
          >
            Book Your Experience ▼
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
