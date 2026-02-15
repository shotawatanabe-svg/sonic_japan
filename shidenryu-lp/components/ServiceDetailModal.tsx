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
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50"
        />

        {/* Bottom Sheet */}
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-lg bg-white rounded-t-2xl max-h-[85vh] overflow-y-auto"
        >
          <div className="p-5 pb-8">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
            >
              ✕
            </button>

            {/* Icon */}
            <div className="text-4xl mb-1">{service.icon}</div>

            {/* Title */}
            <h2 className="font-heading text-xl font-bold mb-1 text-foreground pr-10">
              {service.name}
            </h2>

            {/* Image Placeholder */}
            <div className="h-40 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center my-3">
              <span className="text-gray-400 text-sm font-bold">
                {service.icon} Photo
              </span>
            </div>

            {/* Description */}
            <p className="text-foreground-muted text-sm leading-relaxed mb-4">
              {service.description}
            </p>

            {/* Details List */}
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
                    <span className="text-primary mt-0.5">•</span>
                    {detail}
                  </li>
                ))}
              </ul>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-5">
              {service.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-block bg-background-alt border border-border px-2.5 py-1 rounded-full text-[11px] text-foreground-muted"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* CTA Button */}
            <Link
              href={`/booking?preselect=${service.id}`}
              onClick={onClose}
              className="block w-full bg-primary text-white text-center font-bold py-3.5 rounded-lg hover:opacity-85 transition-opacity text-sm"
            >
              Book with This Experience ▼
            </Link>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
