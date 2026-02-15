import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const month = searchParams.get("month");

  // Validate month format: YYYY-MM
  if (!month || !/^\d{4}-\d{2}$/.test(month)) {
    return NextResponse.json(
      { error: "Invalid month format. Expected YYYY-MM." },
      { status: 400 }
    );
  }

  const gasUrl = process.env.GAS_WEBAPP_URL;

  // If GAS is not configured, return empty data (all slots treated as available)
  if (!gasUrl) {
    console.warn("GAS_WEBAPP_URL not configured — returning fallback availability");
    return NextResponse.json({ month, days: {} });
  }

  try {
    const url = `${gasUrl}?action=getAvailability&month=${month}`;
    const res = await fetch(url, {
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!res.ok) {
      throw new Error(`GAS returned ${res.status}`);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Failed to fetch availability from GAS:", err);
    // Fallback: return empty → client treats all as available
    return NextResponse.json({ month, days: {} });
  }
}
