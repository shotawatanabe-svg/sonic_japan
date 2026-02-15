"use client";

import { motion } from "framer-motion";

const infoCards = [
  {
    icon: "🌙",
    title: "Daily 16:00–24:00",
    description: "Evening slots are the most popular",
  },
  {
    icon: "👥",
    title: "1–4 Guests per Session",
    description: "Duration: approx. 90 minutes",
  },
  {
    icon: "🏨",
    title: "Delivered to Your Room",
    description: "No need to leave your hotel",
  },
  {
    icon: "🎒",
    title: "Nothing to Bring",
    description: "Just wear comfortable clothing",
  },
];

export default function Info() {
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
            Info
          </span>
        </motion.div>

        <div className="flex flex-col gap-2">
          {infoCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="flex items-center gap-3 p-3 border border-border rounded-lg"
            >
              <div className="text-3xl shrink-0">{card.icon}</div>
              <div>
                <h3 className="text-xs font-bold text-foreground">
                  {card.title}
                </h3>
                <p className="text-[11px] text-foreground-muted">
                  {card.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
