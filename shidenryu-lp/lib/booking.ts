// ─── Types ───

export type BookingRequest = {
  date: string;           // "2026-03-07"
  timeSlot: string;       // "20:00-21:30"
  activities: string[];   // ["tate", "costume", "tea"]
  guestName: string;
  email: string;
  numberOfGuests: number; // 1–4
  roomNumber: string;
  specialRequests?: string;
  agreedToTerms: boolean;
};

export type BookingResponse = {
  success: boolean;
  bookingId?: string;
  error?: string;
  message?: string;
};

// ─── Client-side submit ───

/**
 * Submit a booking request to /api/booking.
 * Handles timeout (15s) and structured error responses.
 */
export async function submitBooking(
  data: BookingRequest
): Promise<BookingResponse> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetch("/api/booking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    const json = await res.json().catch(() => ({
      success: false,
      error: "parse_error",
      message: "Failed to parse response.",
    }));

    if (!res.ok) {
      return {
        success: false,
        error: json.error ?? "server_error",
        message:
          json.message ??
          `Request failed (${res.status}). Please try again.`,
      };
    }

    return json;
  } catch (err) {
    clearTimeout(timeout);

    if (err instanceof DOMException && err.name === "AbortError") {
      return {
        success: false,
        error: "timeout",
        message: "Request timed out. Please try again.",
      };
    }

    return {
      success: false,
      error: "network_error",
      message: "A network error occurred. Please check your connection.",
    };
  }
}
