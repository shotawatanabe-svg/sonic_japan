"use client";

import { useEffect, useState } from "react";
import { fetchDaySlots, SLOT_KEYS, type DaySlots } from "@/lib/availability";
import { TIME_SLOTS } from "@/lib/booking-types";

interface Props {
  selectedDate: string | null;
  selectedSlot: string | null;
  onSelectSlot: (slot: string) => void;
}

export default function StepTimeSlots({
  selectedDate,
  selectedSlot,
  onSelectSlot,
}: Props) {
  const [daySlots, setDaySlots] = useState<DaySlots>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!selectedDate) return;
    setLoading(true);
    fetchDaySlots(selectedDate)
      .then(setDaySlots)
      .finally(() => setLoading(false));
  }, [selectedDate]);

  const dateDisplay = selectedDate
    ? new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", {
        weekday: "short",
        month: "long",
        day: "numeric",
      })
    : "";

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <p className="text-xs text-foreground-subtle mb-3">
        Availability for <strong>{dateDisplay}</strong>
      </p>
      <div className="grid grid-cols-2 gap-2">
        {TIME_SLOTS.map((slot) => {
          const slotKey = SLOT_KEYS.find((k) => k === slot.value);
          const status = slotKey ? daySlots[slotKey] : undefined;
          // If no data (GAS not connected), treat as available
          const isAvailable = !status || status === "available";
          const isBooked = status === "booked";
          const isClosed = status === "closed";
          const isDisabled = isBooked || isClosed;
          const isSelected = selectedSlot === slot.value;

          return (
            <button
              key={slot.value}
              onClick={() => !isDisabled && onSelectSlot(slot.value)}
              disabled={isDisabled}
              className={`py-3.5 px-2 border rounded-lg text-center transition-all ${
                isSelected
                  ? "bg-primary text-white border-primary font-semibold"
                  : isDisabled
                  ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                  : "border-border text-foreground hover:border-primary"
              }`}
            >
              <span
                className={`text-sm font-semibold block ${
                  isDisabled && !isSelected ? "text-gray-400" : ""
                }`}
              >
                {slot.label}
              </span>
              <span
                className={`text-[10px] block mt-0.5 ${
                  isSelected
                    ? "text-white/80"
                    : isBooked
                    ? "text-gray-400"
                    : isClosed
                    ? "text-gray-400"
                    : "text-green-600"
                }`}
              >
                {isSelected
                  ? "● Selected"
                  : isBooked
                  ? "✕ Booked"
                  : isClosed
                  ? "✕ Closed"
                  : isAvailable
                  ? "◎ Available"
                  : "◎ Available"}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
