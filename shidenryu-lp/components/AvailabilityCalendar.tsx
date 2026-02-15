"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  fetchAvailability,
  getDayStatus,
  type MonthData,
} from "@/lib/availability";

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function AvailabilityCalendar() {
  const router = useRouter();
  const today = new Date();

  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth()); // 0-indexed
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

  const handleDayClick = (day: number) => {
    const dateStr = formatDate(day);
    router.push(`/booking?date=${dateStr}`);
  };

  return (
    <section className="border-t border-border-light bg-background">
      <div className="max-w-lg mx-auto px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block bg-orange-700 text-white text-[10px] font-bold px-2 py-0.5 rounded mb-3 tracking-wider uppercase">
            Availability
          </span>
          <h2 className="font-heading text-2xl font-bold mb-1 text-foreground">
            Check Availability
          </h2>
          <p className="text-foreground-muted text-xs mb-4">
            Tap an available date to start booking
          </p>
        </motion.div>

        <div className="border border-border rounded-lg overflow-hidden">
          {/* Month navigation */}
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

          {/* Day headers */}
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

          {/* Loading overlay */}
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent" />
            </div>
          ) : (
            <>
              {/* Day grid */}
              <div className="grid grid-cols-7 gap-px px-1 pb-2">
                {Array.from({ length: firstDayOfWeek }, (_, i) => (
                  <div key={`e-${i}`} className="py-2.5" />
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

                  return (
                    <button
                      key={day}
                      onClick={() => !disabled && handleDayClick(day)}
                      disabled={disabled}
                      className={`text-center py-1.5 text-xs rounded-md transition-all ${
                        past
                          ? "text-gray-300 cursor-default line-through"
                          : isFull
                          ? "text-gray-300 bg-gray-50 cursor-default"
                          : isPartial
                          ? "text-amber-500 hover:bg-amber-50 cursor-pointer font-semibold"
                          : "text-foreground hover:bg-green-50 cursor-pointer"
                      }`}
                    >
                      <span>{day}</span>
                      {!past && isAvailable && (
                        <span className="block text-[9px] text-green-500 leading-none mt-0.5">
                          ○
                        </span>
                      )}
                      {!past && isPartial && (
                        <span className="block text-[9px] text-amber-500 leading-none mt-0.5">
                          ▲
                        </span>
                      )}
                      {!past && isFull && (
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
      </div>
    </section>
  );
}
