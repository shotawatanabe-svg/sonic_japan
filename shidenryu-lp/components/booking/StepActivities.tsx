"use client";

import { useState } from "react";
import type { Service } from "@/lib/services";
import ServiceDetailModal from "@/components/ServiceDetailModal";

interface Props {
  services: Service[];
  selected: string[];
  onSelect: (newSelected: string[]) => void;
}

export default function StepActivities({ services, selected, onSelect }: Props) {
  const [detailService, setDetailService] = useState<Service | null>(null);

  const hasFamilySelected = selected.some(
    (id) => services.find((s) => s.id === id)?.category === "family"
  );
  const souvenirIds = services.filter((s) => s.category === "souvenir").map((s) => s.id);
  const selectedSouvenirId = selected.find((id) => souvenirIds.includes(id));

  const handleSelect = (id: string) => {
    const service = services.find((s) => s.id === id);
    if (!service) return;
    const category = service.category;

    if (selected.includes(id)) {
      onSelect(selected.filter((s) => s !== id));
      return;
    }

    if (category === "family") {
      onSelect([id]);
      return;
    }

    let next = hasFamilySelected
      ? selected.filter((s) => services.find((sv) => sv.id === s)?.category !== "family")
      : [...selected];

    if (category === "souvenir" && selectedSouvenirId) {
      next = next.filter((s) => !souvenirIds.includes(s));
    }

    if (next.length >= 3) return;

    next.push(id);
    onSelect(next);
  };

  const isComplete = hasFamilySelected || selected.length === 3;

  const regularServices = services.filter((s) => s.category === "regular");
  const souvenirServices = services.filter((s) => s.category === "souvenir");
  const familyServices = services.filter((s) => s.category === "family");

  const renderCard = (service: Service) => {
    const isSelected = selected.includes(service.id);
    const isSouvenir = service.category === "souvenir";
    const canSwap = isSouvenir && !!selectedSouvenirId && !isSelected;
    const isDisabled =
      !isSelected &&
      !canSwap &&
      (hasFamilySelected || (isComplete && !canSwap));

    return (
      <div key={service.id} className="relative">
        <button
          onClick={() => handleSelect(service.id)}
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
            {service.name}
          </div>
          <div className="text-[8px] text-foreground-muted mt-0.5">
            {service.duration}
          </div>
          {canSwap && (
            <div className="text-[8px] text-blue-500 font-bold mt-0.5">Swap</div>
          )}
          {isDisabled && hasFamilySelected && (
            <div className="text-[8px] text-error mt-0.5">Family Plan uses all 3</div>
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

  const counterMessage = () => {
    if (hasFamilySelected) return "Family Plan selected (3/3)";
    const souvenirNote = selectedSouvenirId ? " (includes 1 souvenir)" : "";
    return `${selected.length}/3 selected${souvenirNote}`;
  };

  return (
    <div>
      {/* Regular experiences */}
      <div className="grid grid-cols-3 gap-2">
        {regularServices.map(renderCard)}
      </div>

      {/* Souvenir section */}
      {souvenirServices.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-bold text-accent mb-0.5">
            Souvenir Craft — Take Home a Handmade Memory
          </p>
          <p className="text-[10px] text-foreground-muted mb-1.5">
            Choose up to 1 souvenir craft
          </p>
          <div className="grid grid-cols-3 gap-2">
            {souvenirServices.map(renderCard)}
          </div>
        </div>
      )}

      {/* Family Plan section */}
      {familyServices.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-bold text-amber-500 mb-0.5">
            ★ Family Plan — Special Package
          </p>
          <p className="text-[10px] text-foreground-muted mb-1.5">
            All ages welcome · No participant limit · Counts as all 3 experiences
          </p>
          {familyServices.map((service) => {
            const isSelected = selected.includes(service.id);
            const isDisabled = !isSelected && !hasFamilySelected && selected.length > 0;

            return (
              <div key={service.id} className="relative">
                <button
                  onClick={() => handleSelect(service.id)}
                  className={`relative w-full border-2 rounded-lg p-3 text-center transition-all ${
                    isSelected
                      ? "border-primary bg-primary-light"
                      : isDisabled
                      ? "border-gray-100 bg-gray-50 opacity-60 cursor-pointer"
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
                    {service.duration} · All ages OK · No participant limit
                  </div>
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
      )}

      <p className="text-center text-sm text-foreground-subtle mt-3">
        {counterMessage()}
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
