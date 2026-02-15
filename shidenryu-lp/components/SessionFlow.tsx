"use client";

import { motion } from "framer-motion";

const steps = [
  {
    time: "0:00",
    title: "Welcome & Preparation",
    description:
      "Instructor arrives at your room. Change into costume, safety briefing, and etiquette introduction.",
  },
  {
    time: "0:15",
    title: "Experience ① (~20 min)",
    description:
      "Your first chosen activity. The instructor guides you step by step.",
  },
  {
    time: "0:35",
    title: "Experience ② (~20 min)",
    description: "Second activity. From basics to practice.",
  },
  {
    time: "0:55",
    title: "Experience ③ (~20 min)",
    description:
      "Third activity. Apply everything you've learned so far.",
  },
  {
    time: "1:15",
    title: "Photo Session & Wrap-up",
    description:
      "Strike a pose for memorable photos. Receive your certificate of completion.",
  },
  {
    time: "1:30",
    title: "Session Complete",
    description: "Thank you for your experience!",
    isLast: true,
  },
];

export default function SessionFlow() {
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
            Session Flow
          </span>
          <h2 className="font-heading text-2xl font-bold mb-6 text-foreground">
            Your 90-Minute Journey
          </h2>
        </motion.div>

        <div className="space-y-0">
          {steps.map((step, index) => (
            <motion.div
              key={step.time}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className={`flex gap-3 py-3 ${
                !step.isLast ? "border-b border-border-light" : ""
              }`}
            >
              <div
                className={`min-w-[40px] h-7 rounded-full ${
                  step.isLast ? "bg-gray-500" : "bg-primary"
                } text-white text-[10px] font-bold flex items-center justify-center shrink-0`}
              >
                {step.time}
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  {step.title}
                </h3>
                <p className="text-xs text-foreground-muted leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
