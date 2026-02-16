"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { Service } from "@/lib/services";
import ServiceDetailModal from "./ServiceDetailModal";

interface Props {
  services: Service[];
}

export default function ServiceGrid({ services: initialServices }: Props) {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [selectedService, setSelectedService] = useState<number | null>(null);

  // サーバーから渡されたデータが空の場合、クライアントサイドでAPIから取得
  useEffect(() => {
    if (initialServices.length > 0) {
      setServices(initialServices);
      return;
    }
    fetch("/api/services")
      .then((res) => res.json())
      .then((data) => {
        if (data.services && data.services.length > 0) {
          setServices(data.services);
        }
      })
      .catch(() => {});
  }, [initialServices]);

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

        <div className="grid grid-cols-1 gap-3">
          {services.map((service, index) => (
            <motion.button
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              onClick={() => setSelectedService(index)}
              className="border-2 border-border rounded-xl p-4 text-left cursor-pointer transition-all hover:border-primary hover:bg-primary-light group flex items-start gap-3"
            >
              <div className="text-3xl shrink-0">{service.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-foreground leading-tight">
                  {service.name}
                </div>
                {service.nameJa && (
                  <div className="text-[10px] text-foreground-subtle mt-0.5">
                    {service.nameJa}
                  </div>
                )}
                <p className="text-xs text-foreground-muted mt-1 leading-relaxed line-clamp-2">
                  {service.description}
                </p>
                {service.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {service.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="inline-block bg-background-alt border border-border px-1.5 py-0.5 rounded text-[9px] text-foreground-subtle"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="text-[10px] text-primary shrink-0 opacity-70 group-hover:opacity-100 mt-1">
                Details ▶
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
