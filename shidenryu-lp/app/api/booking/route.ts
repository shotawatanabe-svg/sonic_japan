import { NextResponse } from "next/server";

const VALID_TIME_SLOTS = [
  "16:00-17:30",
  "18:00-19:30",
  "20:00-21:30",
  "22:00-23:30",
];

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      date,
      timeSlot,
      activities,
      guestName,
      email,
      numberOfGuests,
      roomNumber,
      agreedToTerms,
    } = body;

    // ─── Validation ───
    const errors: string[] = [];

    if (!date || typeof date !== "string") {
      errors.push("Date is required");
    }
    if (!timeSlot || !VALID_TIME_SLOTS.includes(timeSlot)) {
      errors.push("Invalid time slot");
    }
    if (!Array.isArray(activities) || activities.length !== 3) {
      errors.push("Exactly 3 activities must be selected");
    }
    if (!guestName || typeof guestName !== "string" || !guestName.trim()) {
      errors.push("Guest name is required");
    }
    if (
      !email ||
      typeof email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      errors.push("Valid email is required");
    }
    if (
      !numberOfGuests ||
      typeof numberOfGuests !== "number" ||
      numberOfGuests < 1 ||
      numberOfGuests > 4
    ) {
      errors.push("Number of guests must be between 1 and 4");
    }
    if (!roomNumber || typeof roomNumber !== "string" || !roomNumber.trim()) {
      errors.push("Room number is required");
    }
    if (agreedToTerms !== true) {
      errors.push("You must agree to the terms and conditions");
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { success: false, error: "validation_error", message: errors.join(". ") },
        { status: 400 }
      );
    }

    // ─── Forward to GAS WebApp ───
    const gasUrl = process.env.GAS_WEBAPP_URL;
    const gasApiKey = process.env.GAS_API_KEY;

    if (!gasUrl) {
      // GAS not configured → local fallback (generate ID, log only)
      const bookingId = `BK-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

      console.log("📩 New Booking (local fallback — GAS not configured):", {
        bookingId,
        date,
        timeSlot,
        activities,
        guestName,
        email,
        numberOfGuests,
        roomNumber,
        specialRequests: body.specialRequests,
      });

      return NextResponse.json({
        success: true,
        bookingId,
        message: "Booking request received (local mode)",
      });
    }

    // GAS is configured → send to Google Apps Script
    try {
      const gasRes = await fetch(gasUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "createBooking",
          apiKey: gasApiKey,
          data: {
            date,
            timeSlot,
            activities,
            guestName,
            email,
            numberOfGuests,
            roomNumber,
            specialRequests: body.specialRequests || "",
          },
        }),
      });

      const result = await gasRes.json();

      if (!result.success) {
        // GAS returned an error (e.g. slot_taken)
        const status = result.error === "slot_taken" ? 409 : 500;
        return NextResponse.json(result, { status });
      }

      return NextResponse.json(result);
    } catch (err) {
      console.error("GAS booking request failed:", err);
      return NextResponse.json(
        {
          success: false,
          error: "server_error",
          message: "Failed to process booking. Please try again.",
        },
        { status: 500 }
      );
    }
  } catch {
    return NextResponse.json(
      { success: false, error: "parse_error", message: "Invalid request body" },
      { status: 400 }
    );
  }
}
