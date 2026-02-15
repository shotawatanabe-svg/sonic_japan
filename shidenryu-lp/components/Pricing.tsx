"use client";

import { motion } from "framer-motion";

export default function Pricing() {
  return (
    <section className="border-t border-border-light bg-background">
      <div className="max-w-lg mx-auto px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block bg-blue-800 text-white text-[10px] font-bold px-2 py-0.5 rounded mb-3 tracking-wider uppercase">
            Pricing
          </span>
          <h2 className="font-heading text-2xl font-bold mb-2 text-foreground">
            Pricing
          </h2>

          {/* Price */}
          <div className="text-3xl font-bold text-primary my-2">
            ¥40,000{" "}
            <span className="text-sm text-foreground-muted font-normal">
              / session (tax included)
            </span>
          </div>
          <p className="text-foreground-muted text-sm mb-6">
            Up to 4 guests per session. Fixed price regardless of group size.
          </p>

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
                "Photo session & certificate of completion",
              ].map((item) => (
                <li
                  key={item}
                  className="text-sm text-foreground-muted flex items-start gap-2"
                >
                  <span className="text-success">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Payment Note */}
          <div className="bg-background-alt border border-border rounded-lg p-4">
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
                  className="px-2 py-1 border border-border rounded text-[10px] font-bold text-foreground-muted bg-white"
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
