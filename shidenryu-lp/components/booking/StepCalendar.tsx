"use client";

import { useState, useMemo, useEffect } from "react";
import {
  fetchAvailability,
  getDayStatus,
  type MonthData,
} from "@/lib/availability";

interface Props {
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
  onConfirm: () => void;
}

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function StepCalendar({ selectedDate, onSelectDate, onConfirm }: Props) {
  const today = new Date();

  // 戻った時に選択済み日付の月を表示する
  const initialYear = selectedDate
    ? parseInt(selectedDate.slice(0, 4), 10)
    : today.getFullYear();
  const initialMonth = selectedDate
    ? parseInt(selectedDate.slice(5, 7), 10) - 1
    : today.getMonth();

  const [viewYear, setViewYear] = useState(initialYear);
  const [viewMonth, setViewMonth] = useState(initialMonth);
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

  return (
    <div>
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
                const isPartial = dayStatus === "partial";
                const isAvailable = dayStatus === "available";
                const disabled = past || isFull;
                const selected = selectedDate === dateStr;

                return (
                  <button
                    key={day}
                    onClick={() => !disabled && onSelectDate(dateStr)}
                    disabled={disabled}
                    className={`text-center py-1.5 text-xs rounded-md transition-all ${
                      selected
                        ? "bg-primary text-white font-bold ring-2 ring-primary ring-offset-1"
                        : past
                        ? "text-gray-300 cursor-default line-through"
                        : isFull
                        ? "text-gray-300 bg-gray-50 cursor-default"
                        : isPartial
                        ? "text-amber-500 hover:bg-amber-50 cursor-pointer font-semibold"
                        : "text-foreground hover:bg-green-50 cursor-pointer"
                    }`}
                  >
                    <span>{day}</span>
                    {/* 全枠空き → ○ */}
                    {!past && !selected && isAvailable && (
                      <span className="block text-[9px] text-green-500 leading-none mt-0.5">
                        ○
                      </span>
                    )}
                    {/* 一部埋まり → ▲ */}
                    {!past && !selected && isPartial && (
                      <span className="block text-[9px] text-amber-500 leading-none mt-0.5">
                        ▲
                      </span>
                    )}
                    {/* 全埋まり → Full */}
                    {!past && !selected && isFull && (
                      <span className="block text-[8px] text-gray-400 leading-none mt-0.5">
                        Full
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-3 pb-2.5 flex-wrap">
              <span className="flex items-center gap-1 text-[10px] text-green-600">
                <span className="text-[10px]">○</span>
                Available
              </span>
              <span className="flex items-center gap-1 text-[10px] text-amber-500">
                <span className="text-[10px]">▲</span>
                Some Booked
              </span>
              <span className="flex items-center gap-1 text-[10px] text-gray-400">
                <span className="text-[8px]">Full</span>
                Unavailable
              </span>
            </div>
          </>
        )}
      </div>

      {/* 確定ボタン */}
      <button
        onClick={onConfirm}
        disabled={!selectedDate}
        className={`w-full font-bold py-3.5 rounded-lg text-sm mt-4 transition-opacity ${
          selectedDate
            ? "bg-primary text-white hover:opacity-85"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        {selectedDate
          ? `Confirm: ${new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", { weekday: "short", month: "long", day: "numeric" })} →`
          : "Select a date"}
      </button>
    </div>
  );
}
