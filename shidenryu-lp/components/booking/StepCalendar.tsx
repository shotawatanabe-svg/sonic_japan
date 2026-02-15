"use client";

import { useState, useMemo, useEffect } from "react";
import {
  fetchAvailability,
  getDayStatus,
  SLOT_KEYS,
  type MonthData,
  type DaySlots,
} from "@/lib/availability";

interface Props {
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
}

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function StepCalendar({ selectedDate, onSelectDate }: Props) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [data, setData] = useState<MonthData>({});
  const [loading, setLoading] = useState(true);

  const monthKey = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}`;

  useEffect(() => {
    setLoading(true);
    fetchAvailability(monthKey)
      .then((res) => setData(res.days || {}))
      .finally(() => setLoading(false));
  }, [monthKey]);

  const daysInMonth = useMemo(
    () => new Date(viewYear, viewMonth + 1, 0).getDate(),
    [viewYear, viewMonth]
  );
  const firstDayOfWeek = useMemo(
    () => new Date(viewYear, viewMonth, 1).getDay(),
    [viewYear, viewMonth]
  );
  const monthLabel = useMemo(() => {
    const d = new Date(viewYear, viewMonth);
    return d.toLocaleDateString("en-US", { year: "numeric", month: "long" });
  }, [viewYear, viewMonth]);

  const canGoPrev =
    viewYear > today.getFullYear() ||
    (viewYear === today.getFullYear() && viewMonth > today.getMonth());

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear((y) => y - 1); setViewMonth(11); }
    else { setViewMonth((m) => m - 1); }
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear((y) => y + 1); setViewMonth(0); }
    else { setViewMonth((m) => m + 1); }
  };

  const formatDate = (day: number) => {
    const m = String(viewMonth + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    return `${viewYear}-${m}-${d}`;
  };

  const isPast = (day: number) => {
    const d = new Date(viewYear, viewMonth, day);
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return d < todayStart;
  };

  const renderSlotDots = (daySlots: DaySlots | undefined) => (
    <div className="flex justify-center gap-0.5 mt-0.5">
      {SLOT_KEYS.map((key) => {
        const status = daySlots?.[key];
        const isAvail = !status || status === "available";
        return (
          <span
            key={key}
            className={`inline-block w-1.5 h-1.5 rounded-full ${
              isAvail ? "bg-green-500" : "bg-gray-300"
            }`}
          />
        );
      })}
    </div>
  );

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-background-alt px-3 py-2.5 flex items-center justify-between">
        <button
          onClick={prevMonth}
          disabled={!canGoPrev}
          className={`text-xs px-2 py-1 rounded transition-colors ${
            canGoPrev
              ? "text-foreground-muted hover:bg-gray-200"
              : "text-gray-300 cursor-default"
          }`}
        >
          ◀ Prev
        </button>
        <span className="text-sm font-bold text-foreground">{monthLabel}</span>
        <button
          onClick={nextMonth}
          className="text-xs text-foreground-muted px-2 py-1 rounded hover:bg-gray-200 transition-colors"
        >
          Next ▶
        </button>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 gap-px px-1 pt-1">
        {DAY_LABELS.map((d) => (
          <div
            key={d}
            className="text-center py-1.5 text-[10px] font-bold text-foreground-subtle"
          >
            {d}
          </div>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-7 gap-px px-1 pb-2">
            {Array.from({ length: firstDayOfWeek }, (_, i) => (
              <div key={`e-${i}`} className="py-2" />
            ))}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1;
              const dateStr = formatDate(day);
              const past = isPast(day);
              const daySlots = data[dateStr];
              const dayStatus = getDayStatus(daySlots);
              const isFull = dayStatus === "full";
              const disabled = past || isFull;
              const selected = selectedDate === dateStr;

              return (
                <button
                  key={day}
                  onClick={() => !disabled && onSelectDate(dateStr)}
                  disabled={disabled}
                  className={`text-center py-1.5 text-xs rounded-md transition-all ${
                    selected
                      ? "bg-primary text-white font-bold"
                      : disabled
                      ? "text-gray-300 cursor-default"
                      : "text-foreground hover:bg-red-50 cursor-pointer"
                  } ${past ? "line-through" : ""}`}
                >
                  <span>{day}</span>
                  {!past && !selected && renderSlotDots(daySlots)}
                  {!past && isFull && (
                    <span className="block text-[8px] text-gray-400 leading-none">
                      Full
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-center gap-4 pb-2">
            <span className="flex items-center gap-1 text-[10px] text-foreground-subtle">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
              Available
            </span>
            <span className="flex items-center gap-1 text-[10px] text-foreground-subtle">
              <span className="w-2 h-2 rounded-full bg-gray-300 inline-block" />
              Booked / Closed
            </span>
          </div>
        </>
      )}
    </div>
  );
}
