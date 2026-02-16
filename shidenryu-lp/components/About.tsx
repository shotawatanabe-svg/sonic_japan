"use client";

import { motion } from "framer-motion";

export default function About() {
  return (
    <section className="border-t border-border bg-background-alt">
      <div className="max-w-lg mx-auto px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block text-accent text-[10px] font-bold tracking-[0.15em] uppercase mb-3">
            About
          </span>
          <h2 className="font-heading text-2xl font-bold mb-3 text-foreground tracking-wide">
            Who Is Sonic Japan?
          </h2>
          <p className="text-foreground-muted text-sm leading-relaxed mb-4">
            Sonic Japan is a collective of professional performers rooted in decades of
            Japanese traditional arts — sword fighting, dance, tea ceremony, and more.
            Our masters have performed on stage, film, and television, carrying forward
            centuries of living culture.
          </p>
          <p className="text-foreground-muted text-sm leading-relaxed">
            Now, they bring that artistry directly to you. No need to go out — a genuine
            cultural experience comes to the comfort of your hotel room, guided by the
            very people who have dedicated their lives to these traditions.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
