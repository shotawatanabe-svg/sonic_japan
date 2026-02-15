"use client";

import { useState, useMemo } from "react";

interface Props {
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
}

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function Calendar({ selectedDate, onSelectDate }: Props) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth()); // 0-indexed

  const daysInMonth = useMemo(() => {
    return new Date(viewYear, viewMonth + 1, 0).getDate();
  }, [viewYear, viewMonth]);

  const firstDayOfWeek = useMemo(() => {
    return new Date(viewYear, viewMonth, 1).getDay();
  }, [viewYear, viewMonth]);

  const monthLabel = useMemo(() => {
    const date = new Date(viewYear, viewMonth);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long" });
  }, [viewYear, viewMonth]);

  const isDisabled = (day: number) => {
    const date = new Date(viewYear, viewMonth, day);
    const todayStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    // Disable past dates and dates more than 90 days in the future
    const maxDate = new Date(todayStart);
    maxDate.setDate(maxDate.getDate() + 90);
    return date < todayStart || date > maxDate;
  };

  const formatDate = (day: number) => {
    const m = String(viewMonth + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    return `${viewYear}-${m}-${d}`;
  };

  const isSelected = (day: number) => {
    return selectedDate === formatDate(day);
  };

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  // Disable prev button if viewing current month
  const canGoPrev =
    viewYear > today.getFullYear() ||
    (viewYear === today.getFullYear() && viewMonth > today.getMonth());

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

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-px px-1 pb-2">
        {/* Empty cells for offset */}
        {Array.from({ length: firstDayOfWeek }, (_, i) => (
          <div key={`empty-${i}`} className="py-2.5" />
        ))}

        {/* Day cells */}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const disabled = isDisabled(day);
          const selected = isSelected(day);

          return (
            <button
              key={day}
              onClick={() => {
                if (!disabled) onSelectDate(formatDate(day));
              }}
              disabled={disabled}
              className={`text-center py-2.5 text-xs rounded-md transition-all ${
                selected
                  ? "bg-primary text-white font-bold"
                  : disabled
                  ? "text-gray-300 line-through cursor-default"
                  : "text-foreground hover:bg-red-50 cursor-pointer"
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>

      <p className="text-[10px] text-foreground-subtle text-center pb-2">
        Gray = unavailable / Red = selected
      </p>
    </div>
  );
}
