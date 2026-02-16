"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import type { Service } from "@/lib/services";

interface Props {
  service: Service;
  onClose: () => void;
}

export default function ServiceDetailModal({ service, onClose }: Props) {
  useEffect(() => {
    document.body.classList.add("modal-open");
    return () => document.body.classList.remove("modal-open");
  }, []);

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[100] flex items-end justify-center"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60"
        />

        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-lg bg-background-card rounded-t-2xl max-h-[85vh] overflow-y-auto border-t border-border"
        >
          <div className="p-5 pb-8">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-background-alt flex items-center justify-center text-foreground-muted hover:text-foreground transition-colors"
            >
              ✕
            </button>

            <div className="text-4xl mb-1">{service.icon}</div>

            <h2 className="font-heading text-xl font-bold mb-1 text-foreground pr-10 tracking-wide">
              {service.name}
            </h2>

            <div className="h-40 rounded-lg border border-border flex items-center justify-center my-3"
              style={{ background: "linear-gradient(135deg, #1f1a15 0%, #1f1f1f 100%)" }}
            >
              <span className="text-foreground-subtle text-sm font-bold">
                {service.icon} Photo
              </span>
            </div>

            <p className="text-foreground-muted text-sm leading-relaxed mb-4">
              {service.description}
            </p>

            <div className="mb-4">
              <h3 className="text-xs font-bold text-foreground mb-2">
                What You&apos;ll Experience
              </h3>
              <ul className="space-y-1">
                {service.details.map((detail, i) => (
                  <li
                    key={i}
                    className="text-xs text-foreground-muted flex items-start gap-2"
                  >
                    <span className="text-accent mt-0.5">•</span>
                    {detail}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-5">
              {service.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-block border border-accent/30 text-accent px-2.5 py-1 rounded-full text-[11px] bg-transparent"
                >
                  {tag}
                </span>
              ))}
            </div>

            <Link
              href={`/booking?preselect=${service.id}`}
              onClick={onClose}
              className="block w-full bg-accent-red text-white text-center font-semibold py-3.5 rounded-[4px] hover:bg-accent-red-hover transition-all text-sm tracking-wide"
            >
              Book with This Experience →
            </Link>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
