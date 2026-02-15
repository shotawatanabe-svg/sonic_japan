"use client";

import { motion } from "framer-motion";

export default function About() {
  return (
    <section className="border-t border-border-light bg-background">
      <div className="max-w-lg mx-auto px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded mb-3 tracking-wider uppercase">
            About
          </span>
          <h2 className="font-heading text-2xl font-bold mb-3 text-foreground">
            What is Tate (Sword Fighting)?
          </h2>
          <p className="text-foreground-muted text-sm leading-relaxed mb-4">
            Tate is the traditional Japanese art of staged sword combat. It embodies the
            samurai spirit — discipline, aesthetics, and respect — through powerful yet
            graceful choreographed movements. SHIDENRYU brings this authentic art form
            directly to you as world-class entertainment.
          </p>
          <p className="text-foreground-muted text-sm leading-relaxed">
            A professional performer visits your hotel room. No need to go out — enjoy a
            genuine cultural experience in the comfort of your own space.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
