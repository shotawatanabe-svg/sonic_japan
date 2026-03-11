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

  const regularServices = services.filter((s) => s.category === "regular");
  const souvenirServices = services.filter((s) => s.category === "souvenir");
  const familyServices = services.filter((s) => s.category === "family");

  const getGlobalIndex = (service: Service) =>
    services.findIndex((s) => s.id === service.id);

  const renderCard = (service: Service, index: number) => (
    <motion.button
      key={service.id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      onClick={() => setSelectedService(getGlobalIndex(service))}
      className="bg-background-card border border-border rounded-xl p-3 text-center cursor-pointer transition-all hover:border-accent hover:-translate-y-0.5 group"
    >
      <div className="text-3xl mb-1">{service.icon}</div>
      <div className="text-[10px] font-semibold text-foreground leading-tight">
        {service.name}
      </div>
      <div className="text-[9px] text-foreground-muted mt-0.5">
        {service.duration}
      </div>
      <div className="text-[9px] text-accent mt-1 opacity-70 group-hover:opacity-100">
        ▶ Details
      </div>
    </motion.button>
  );

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
            Experiences
          </span>
          <h2 className="font-heading text-2xl font-bold mb-1 text-foreground tracking-wide">
            Choose 3 Experiences
          </h2>
          <p className="text-foreground-muted text-xs mb-6">
            Tap to see details — pick your 3 favorites when booking
          </p>
        </motion.div>

        {/* Regular experiences */}
        <div className="grid grid-cols-3 gap-2">
          {regularServices.map((s, i) => renderCard(s, i))}
        </div>

        {/* Souvenir section */}
        {souvenirServices.length > 0 && (
          <div className="mt-6">
            <p className="text-xs font-bold text-accent mb-0.5">
              Souvenir Craft — Take Home a Handmade Memory
            </p>
            <p className="text-[10px] text-foreground-muted mb-2">
              Choose up to 1 souvenir craft
            </p>
            <div className="grid grid-cols-3 gap-2">
              {souvenirServices.map((s, i) => renderCard(s, i))}
            </div>
          </div>
        )}

        {/* Family Plan section */}
        {familyServices.length > 0 && (
          <div className="mt-6">
            <p className="text-xs font-bold text-amber-500 mb-0.5">
              ★ Family Plan — Special Package
            </p>
            <p className="text-[10px] text-foreground-muted mb-2">
              All ages welcome · No participant limit · Counts as all 3 experiences
            </p>
            {familyServices.map((service, i) => (
              <motion.button
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                onClick={() => setSelectedService(getGlobalIndex(service))}
                className="w-full bg-background-card border border-amber-500/40 rounded-xl p-4 text-center cursor-pointer transition-all hover:border-amber-500 hover:-translate-y-0.5 group"
              >
                <div className="text-3xl mb-1">{service.icon}</div>
                <div className="text-sm font-semibold text-foreground">
                  {service.name}
                </div>
                <div className="text-[10px] text-foreground-muted mt-0.5">
                  {service.duration}
                </div>
                <div className="text-[9px] text-accent mt-1 opacity-70 group-hover:opacity-100">
                  ▶ Details
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>

      {selectedService !== null && (
        <ServiceDetailModal
          service={services[selectedService]}
          onClose={() => setSelectedService(null)}
        />
      )}
    </section>
  );
}
