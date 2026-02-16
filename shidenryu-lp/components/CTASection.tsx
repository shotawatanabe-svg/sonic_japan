"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function CTASection() {
  return (
    <section className="border-t border-border bg-background">
      <div className="max-w-lg mx-auto px-4 py-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-heading text-2xl font-bold mb-2 text-foreground tracking-wide">
            Book Your Experience
          </h2>
          <p className="text-foreground-muted text-sm mb-6">
            Select your date, time, and 3 favorite experiences to submit your
            request.
          </p>
          <Link
            href="/booking"
            className="inline-block w-full bg-accent-red text-white text-center font-semibold py-4 rounded-[4px] text-base tracking-wide transition-all hover:bg-accent-red-hover hover:-translate-y-0.5"
          >
            Go to Booking Form →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
