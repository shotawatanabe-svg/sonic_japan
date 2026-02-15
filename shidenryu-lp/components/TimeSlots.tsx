"use client";

import { TIME_SLOTS } from "@/lib/booking-types";

interface Props {
  selectedDate: string | null;
  selectedSlot: string | null;
  onSelectSlot: (slot: string) => void;
}

export default function TimeSlots({
  selectedDate,
  selectedSlot,
  onSelectSlot,
}: Props) {
  // Format date for display
  const dateDisplay = selectedDate
    ? new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", {
        weekday: "short",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <div>
      <p className="text-xs text-foreground-subtle mb-3">
        Availability for {dateDisplay}
      </p>
      <div className="grid grid-cols-2 gap-2">
        {TIME_SLOTS.map((slot) => {
          const isSelected = selectedSlot === slot.value;

          return (
            <button
              key={slot.value}
              onClick={() => onSelectSlot(slot.value)}
              className={`py-3.5 px-2 border rounded-lg text-center transition-all ${
                isSelected
                  ? "bg-primary text-white border-primary font-semibold"
                  : "border-border text-foreground hover:border-primary"
              }`}
            >
              <span className="text-sm font-semibold block">{slot.label}</span>
              {isSelected && (
                <span className="text-[10px] block mt-0.5">● Selected</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
