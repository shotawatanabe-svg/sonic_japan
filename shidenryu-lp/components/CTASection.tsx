"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function CTASection() {
  return (
    <section className="border-t border-border-light bg-background-alt">
      <div className="max-w-lg mx-auto px-4 py-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-heading text-2xl font-bold mb-2 text-foreground">
            Book Your Experience
          </h2>
          <p className="text-foreground-muted text-sm mb-6">
            Select your date, time, and 3 favorite experiences to submit your
            request.
          </p>
          <Link
            href="/booking"
            className="inline-block w-full bg-primary text-white text-center font-bold py-4 rounded-lg hover:opacity-85 transition-opacity text-base animate-pulse"
          >
            ▼ Go to Booking Form
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
