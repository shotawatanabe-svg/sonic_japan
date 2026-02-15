// ─── Types ───

export type SlotStatus = "available" | "booked" | "closed";

export type DaySlots = { [time: string]: SlotStatus };

/** { "2026-03-01": { "16:00-17:30": "available", ... }, ... } */
export type MonthData = { [date: string]: DaySlots };

export type AvailabilityResponse = {
  month: string;
  days: MonthData;
};

// ─── Constants ───

export const SLOT_KEYS = [
  "16:00-17:30",
  "18:00-19:30",
  "20:00-21:30",
  "22:00-23:30",
] as const;

// ─── Client-side fetch ───

/**
 * Fetch availability for a given month (YYYY-MM).
 * Falls back to empty data on error → UI treats missing slots as available.
 */
export async function fetchAvailability(
  month: string
): Promise<AvailabilityResponse> {
  try {
    const res = await fetch(`/api/availability?month=${month}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch {
    return { month, days: {} };
  }
}

/**
 * Fetch slot status for a specific date.
 * Returns an object like { "16:00-17:30": "available", "18:00-19:30": "booked", … }
 */
export async function fetchDaySlots(date: string): Promise<DaySlots> {
  const month = date.slice(0, 7); // "2026-03-07" → "2026-03"
  const data = await fetchAvailability(month);
  return data.days[date] ?? {};
}

// ─── Helpers ───

/**
 * Determine the display status for a calendar day.
 * Returns "available" if at least one slot is open, "full" if all booked/closed.
 */
export function getDayStatus(
  daySlots: DaySlots | undefined
): "available" | "full" {
  if (!daySlots) return "available"; // No data → assume available (fallback)
  const statuses = Object.values(daySlots);
  if (statuses.length === 0) return "available";
  return statuses.some((s) => s === "available") ? "available" : "full";
}
