"use client";

import { motion } from "framer-motion";

export default function Pricing() {
  return (
    <section className="border-t border-border bg-background">
      <div className="max-w-lg mx-auto px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block text-accent text-[10px] font-bold tracking-[0.15em] uppercase mb-3">
            Pricing
          </span>
          <h2 className="font-heading text-2xl font-bold mb-2 text-foreground tracking-wide">
            Pricing
          </h2>

          {/* Price */}
          <div className="text-3xl font-bold text-accent my-2">
            ¥40,000{" "}
            <span className="text-sm text-foreground-muted font-normal">
              / session (tax included)
            </span>
          </div>
          <p className="text-foreground-subtle text-xs mb-1">
            ¥10,000 per person for 4 guests
          </p>
          <p className="text-foreground-muted text-sm mb-2">
            Up to 4 guests can participate per session.
          </p>
          <p className="text-foreground-muted text-sm mb-2">
            Larger groups are welcome — extra guests can watch and enjoy!
          </p>
          <p className="text-foreground-muted text-sm mb-4">
            Fixed price regardless of group size.
          </p>

          {/* Key info */}
          <div className="grid grid-cols-2 gap-2 mb-6">
            <div className="bg-background-card border border-border rounded-lg p-3 text-center">
              <p className="text-lg font-bold text-accent">70–90 min</p>
              <p className="text-[10px] text-foreground-muted">Approx. duration</p>
            </div>
            <div className="bg-background-card border border-border rounded-lg p-3 text-center">
              <p className="text-lg font-bold text-accent">Max 4</p>
              <p className="text-[10px] text-foreground-muted">Participants</p>
            </div>
            <div className="bg-background-card border border-border rounded-lg p-3 text-center">
              <p className="text-lg font-bold text-accent">Age 6+</p>
              <p className="text-[10px] text-foreground-muted">Required age</p>
            </div>
            <div className="bg-background-card border border-border rounded-lg p-3 text-center">
              <p className="text-lg font-bold text-accent">3 picks</p>
              <p className="text-[10px] text-foreground-muted">Choose 3 experiences</p>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6 text-xs text-amber-800">
            <strong>★ Family Plan (Special)</strong>: All ages welcome, no participant limit.
            Counts as 3 experience slots.
          </div>

          {/* Included */}
          <div className="mb-6">
            <h3 className="text-sm font-bold text-foreground mb-2">
              What&apos;s Included
            </h3>
            <ul className="space-y-1.5">
              {[
                "Professional instructor guidance",
                "All equipment & costumes provided",
                "Your choice of 3 experiences",
                "Approx. 70–90 minutes total (incl. 10–20 min buffer)",
              ].map((item) => (
                <li
                  key={item}
                  className="text-sm text-foreground-muted flex items-start gap-2"
                >
                  <span className="text-accent">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Payment Note */}
          <div className="bg-background-card border border-border rounded-lg p-4">
            <h3 className="text-xs font-bold text-foreground mb-1.5">
              💳 Payment — On-site, Day of Experience
            </h3>
            <p className="text-[11px] text-foreground-muted mb-3">
              Payment is collected at the start of your session in your room.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {[
                "Cash",
                "VISA",
                "Mastercard",
                "AMEX",
                "JCB",
                "Apple Pay",
                "Google Pay",
              ].map((method) => (
                <span
                  key={method}
                  className="px-2 py-1 border border-border rounded text-[10px] font-bold text-foreground-muted bg-background-alt"
                >
                  {method}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
