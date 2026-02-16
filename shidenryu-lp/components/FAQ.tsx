"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqItems = [
  {
    question: "Do I need any experience?",
    answer:
      "Not at all! Our programs are designed for complete beginners. Our instructors will guide you every step of the way.",
  },
  {
    question: "Is it safe?",
    answer:
      "Absolutely. We use practice swords and training equipment. Safety is our top priority.",
  },
  {
    question: "Can children participate?",
    answer:
      "Yes! Children aged 6 and above can participate with a guardian present.",
  },
  {
    question: "How is the booking confirmed?",
    answer:
      "After submitting your request, our team will check availability and send a confirmation email within 24 hours.",
  },
  {
    question: "What payment methods are accepted?",
    answer:
      "Payment is on-site on the day. We accept cash, credit cards (VISA/Master/AMEX/JCB), Apple Pay, and Google Pay.",
  },
  {
    question: "What is the cancellation policy?",
    answer:
      "Free cancellation up to 24 hours before your scheduled session.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

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
            FAQ
          </span>
          <h2 className="font-heading text-2xl font-bold mb-4 text-foreground tracking-wide">
            Frequently Asked Questions
          </h2>
        </motion.div>

        <div className="divide-y divide-border">
          {faqItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="py-3"
            >
              <button
                onClick={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
                className="w-full text-left flex items-center justify-between gap-2"
              >
                <span className="text-sm font-bold text-foreground">
                  <span className="text-accent">Q:</span> {item.question}
                </span>
                <motion.span
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-accent text-sm shrink-0"
                >
                  ▼
                </motion.span>
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <p className="text-xs text-foreground-muted mt-2 leading-relaxed">
                      A: {item.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
