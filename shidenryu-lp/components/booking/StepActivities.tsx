"use client";

import { useState, useMemo } from "react";
import type { Service } from "@/lib/services";
import ServiceDetailModal from "@/components/ServiceDetailModal";

interface Props {
  services: Service[];
  selected: string[];
  onToggle: (id: string) => void;
}

function usedSlots(services: Service[], selected: string[]): number {
  return selected.reduce((sum, id) => {
    const s = services.find((sv) => sv.id === id);
    return sum + (s?.slotsRequired ?? 1);
  }, 0);
}

export default function StepActivities({ services, selected, onToggle }: Props) {
  const [detailService, setDetailService] = useState<Service | null>(null);

  const slots = usedSlots(services, selected);
  const hasFamilySelected = selected.some(
    (id) => services.find((s) => s.id === id)?.category === "family"
  );
  const souvenirCount = selected.filter(
    (id) => services.find((s) => s.id === id)?.category === "souvenir"
  ).length;

  const disabledReasons = useMemo(() => {
    const reasons: Record<string, string> = {};
    for (const service of services) {
      const isSelected = selected.includes(service.id);
      if (isSelected) continue;

      if (hasFamilySelected) {
        reasons[service.id] = "Family Plan uses all 3 slots";
        continue;
      }
      if (service.category === "family" && slots > 0) {
        reasons[service.id] = "Deselect others first";
        continue;
      }
      const needed = service.slotsRequired ?? 1;
      if (slots + needed > 3) {
        reasons[service.id] = "No slots remaining";
        continue;
      }
      if (service.category === "souvenir" && souvenirCount >= 1) {
        reasons[service.id] = "Max 1 souvenir craft";
        continue;
      }
    }
    return reasons;
  }, [services, selected, slots, hasFamilySelected, souvenirCount]);

  const standardServices = services.filter((s) => s.category === "standard");
  const souvenirServices = services.filter((s) => s.category === "souvenir");
  const familyServices = services.filter((s) => s.category === "family");

  const renderCard = (service: Service) => {
    const isSelected = selected.includes(service.id);
    const reason = disabledReasons[service.id];
    const isDisabled = !isSelected && !!reason;

    return (
      <div key={service.id} className="relative">
        <button
          onClick={() => !isDisabled && onToggle(service.id)}
          disabled={isDisabled}
          className={`relative w-full border-2 rounded-lg p-2.5 text-center transition-all ${
            isSelected
              ? "border-primary bg-primary-light"
              : isDisabled
              ? "border-gray-100 bg-gray-50 opacity-50 cursor-default"
              : "border-border hover:border-primary cursor-pointer"
          }`}
        >
          {isSelected && (
            <span className="absolute top-1 left-1 w-4 h-4 rounded-full bg-primary text-white text-[9px] font-bold flex items-center justify-center">
              ✓
            </span>
          )}
          <div className="text-2xl mt-1">{service.icon}</div>
          <div className="text-[9px] font-semibold text-foreground leading-tight mt-1">
            {service.name.split("(")[0].trim()}
          </div>
          {isDisabled && reason && (
            <div className="text-[8px] text-error mt-0.5">{reason}</div>
          )}
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setDetailService(service);
          }}
          className="absolute top-1 right-1 w-5 h-5 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600 text-[10px] font-bold flex items-center justify-center transition-colors z-10"
          aria-label={`Details about ${service.name}`}
        >
          ℹ
        </button>
      </div>
    );
  };

  return (
    <div>
      {/* Standard experiences */}
      <div className="grid grid-cols-3 gap-2">
        {standardServices.map(renderCard)}
      </div>

      {/* Souvenir section */}
      {souvenirServices.length > 0 && (
        <div className="mt-4">
          <p className="text-[10px] font-bold text-pink-400 mb-1.5 tracking-wider uppercase">
            🎁 Souvenir Craft (choose max 1)
          </p>
          <div className="grid grid-cols-3 gap-2">
            {souvenirServices.map(renderCard)}
          </div>
        </div>
      )}

      {/* Family Plan section */}
      {familyServices.length > 0 && (
        <div className="mt-4">
          <p className="text-[10px] font-bold text-amber-500 mb-1.5 tracking-wider uppercase">
            ★ Family Plan (= 3 experience slots)
          </p>
          <div className="grid grid-cols-1 gap-2">
            {familyServices.map((service) => {
              const isSelected = selected.includes(service.id);
              const reason = disabledReasons[service.id];
              const isDisabled = !isSelected && !!reason;

              return (
                <div key={service.id} className="relative">
                  <button
                    onClick={() => !isDisabled && onToggle(service.id)}
                    disabled={isDisabled}
                    className={`relative w-full border-2 rounded-lg p-3 text-center transition-all ${
                      isSelected
                        ? "border-primary bg-primary-light"
                        : isDisabled
                        ? "border-gray-100 bg-gray-50 opacity-50 cursor-default"
                        : "border-amber-400/40 hover:border-amber-500 cursor-pointer"
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute top-2 left-2 w-5 h-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">
                        ✓
                      </span>
                    )}
                    <div className="text-3xl mb-1">{service.icon}</div>
                    <div className="text-xs font-semibold text-foreground">{service.name}</div>
                    <div className="text-[10px] text-foreground-muted mt-0.5">
                      Photo + Calligraphy + Art Board · All ages OK · No participant limit
                    </div>
                    {isDisabled && reason && (
                      <div className="text-[9px] text-error mt-1">{reason}</div>
                    )}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDetailService(service);
                    }}
                    className="absolute top-2 right-2 w-5 h-5 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600 text-[10px] font-bold flex items-center justify-center transition-colors z-10"
                    aria-label={`Details about ${service.name}`}
                  >
                    ℹ
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <p className="text-center text-sm text-foreground-subtle mt-3">
        <strong className="text-primary">{slots}</strong> / 3 slots used
      </p>

      <div className="text-center mt-3 p-3 bg-background-alt rounded-lg">
        <p className="text-xs text-foreground-muted">Price (fixed)</p>
        <p className="text-2xl font-bold text-primary">¥40,000</p>
        <p className="text-[11px] text-foreground-subtle">
          Tax included · Pay on-site
        </p>
      </div>

      {detailService && (
        <ServiceDetailModal
          service={detailService}
          onClose={() => setDetailService(null)}
        />
      )}
    </div>
  );
}
