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

    // Validation
    const errors: string[] = [];

    if (!date || typeof date !== "string") {
      errors.push("Date is required");
    }

    if (!timeSlot || !VALID_TIME_SLOTS.includes(timeSlot)) {
      errors.push(
        "Time slot must be one of: " + VALID_TIME_SLOTS.join(", ")
      );
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
        { success: false, message: errors.join(". ") },
        { status: 400 }
      );
    }

    // Generate a booking ID
    const bookingId = `BK-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    // TODO: Send email notifications (Resend / Nodemailer)
    // - Admin notification email
    // - Guest auto-reply email

    // TODO: Save to database (optional)

    // Log the booking for now
    console.log("📩 New Booking Request:", {
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
      message: "Booking request received successfully",
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid request body" },
      { status: 400 }
    );
  }
}
