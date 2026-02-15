"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { services } from "@/lib/services";
import ServiceDetailModal from "./ServiceDetailModal";

export default function ServiceGrid() {
  const [selectedService, setSelectedService] = useState<number | null>(null);

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
            Experiences
          </span>
          <h2 className="font-heading text-2xl font-bold mb-1 text-foreground">
            Choose 3 of 9 Experiences
          </h2>
          <p className="text-foreground-muted text-xs mb-4">
            Tap to see details — pick your 3 favorites when booking
          </p>
        </motion.div>

        <div className="grid grid-cols-3 gap-2">
          {services.map((service, index) => (
            <motion.button
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              onClick={() => setSelectedService(index)}
              className="border-2 border-border rounded-xl p-3 text-center cursor-pointer transition-all hover:border-primary hover:bg-primary-light group"
            >
              <div className="text-3xl mb-1">{service.icon}</div>
              <div className="text-[10px] font-semibold text-foreground leading-tight">
                {service.name}
              </div>
              <div className="text-[9px] text-primary mt-1 opacity-70 group-hover:opacity-100">
                ▶ Details
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedService !== null && (
        <ServiceDetailModal
          service={services[selectedService]}
          onClose={() => setSelectedService(null)}
        />
      )}
    </section>
  );
}
