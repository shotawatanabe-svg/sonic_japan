// ─── Types ───

export type SlotStatus = "available" | "booked" | "closed";

export type DaySlots = { [time: string]: SlotStatus };

/** { "2026-03-01": { "16:00": "available", ... }, ... } */
export type MonthData = { [date: string]: DaySlots };

export type AvailabilityResponse = {
  month: string;
  days: MonthData;
};

// ─── Constants ───

/** Full slot keys used in booking (e.g. "16:00-17:30") */
export const SLOT_KEYS = [
  "16:00-17:30",
  "18:00-19:30",
  "20:00-21:30",
  "22:00-23:30",
] as const;

/** Short keys returned by GAS (e.g. "16:00") */
export const GAS_SLOT_KEYS = [
  "16:00",
  "18:00",
  "20:00",
  "22:00",
] as const;

/** Map GAS short key → full slot key */
const GAS_TO_FULL: Record<string, string> = {
  "16:00": "16:00-17:30",
  "18:00": "18:00-19:30",
  "20:00": "20:00-21:30",
  "22:00": "22:00-23:30",
};

/**
 * Normalize DaySlots from GAS format ("16:00") to full format ("16:00-17:30").
 * Supports both formats transparently.
 */
function normalizeDaySlots(raw: DaySlots): DaySlots {
  const result: DaySlots = {};
  for (const [key, value] of Object.entries(raw)) {
    const fullKey = GAS_TO_FULL[key] ?? key;
    result[fullKey] = value;
  }
  return result;
}

/**
 * Normalize all days in MonthData.
 */
function normalizeMonthData(days: MonthData): MonthData {
  const result: MonthData = {};
  for (const [date, slots] of Object.entries(days)) {
    result[date] = normalizeDaySlots(slots);
  }
  return result;
}

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
    const data: AvailabilityResponse = await res.json();
    return {
      month: data.month,
      days: normalizeMonthData(data.days || {}),
    };
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
 * - "available": all slots open (or no data)
 * - "partial":   some slots booked/closed, but at least one available
 * - "full":      all 4 slots booked/closed
 */
export function getDayStatus(
  daySlots: DaySlots | undefined
): "available" | "partial" | "full" {
  if (!daySlots) return "available"; // No data → assume available (fallback)

  const bookedCount = SLOT_KEYS.filter((key) => {
    const s = daySlots[key];
    return s === "booked" || s === "closed";
  }).length;

  if (bookedCount === 0) return "available";
  if (bookedCount >= SLOT_KEYS.length) return "full";
  return "partial";
}
