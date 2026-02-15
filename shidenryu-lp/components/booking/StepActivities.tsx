"use client";

import type { Service } from "@/lib/services";

interface Props {
  services: Service[];
  selected: string[];
  onToggle: (id: string) => void;
}

export default function StepActivities({ services, selected, onToggle }: Props) {
  const canSelectMore = selected.length < 3;

  return (
    <div>
      <div className="grid grid-cols-3 gap-2">
        {services.map((service) => {
          const isSelected = selected.includes(service.id);
          const isDisabled = !isSelected && !canSelectMore;

          return (
            <button
              key={service.id}
              onClick={() => !isDisabled && onToggle(service.id)}
              disabled={isDisabled}
              className={`relative border-2 rounded-lg p-2.5 text-center transition-all ${
                isSelected
                  ? "border-primary bg-primary-light"
                  : isDisabled
                  ? "border-gray-100 bg-gray-50 opacity-50 cursor-default"
                  : "border-border hover:border-primary cursor-pointer"
              }`}
            >
              {isSelected && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-primary text-white text-[9px] font-bold flex items-center justify-center">
                  ✓
                </span>
              )}
              <div className="text-2xl">{service.icon}</div>
              <div className="text-[9px] font-semibold text-foreground leading-tight mt-1">
                {service.name.split("(")[0].trim()}
              </div>
            </button>
          );
        })}
      </div>

      <p className="text-center text-sm text-foreground-subtle mt-3">
        <strong className="text-primary">{selected.length}</strong> / 3 selected
      </p>

      <div className="text-center mt-3 p-3 bg-background-alt rounded-lg">
        <p className="text-xs text-foreground-muted">Price (fixed)</p>
        <p className="text-2xl font-bold text-primary">¥40,000</p>
        <p className="text-[11px] text-foreground-subtle">
          Tax included · Pay on-site
        </p>
      </div>
    </div>
  );
}
