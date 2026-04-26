import { NextResponse } from "next/server";
import { isDatabaseConfigured } from "@/lib/db";
import {
  getAvailableDatesInRange,
  getFreeSlotsForDate,
} from "@/lib/appointments-queries";
import { parseYmd } from "@/lib/availability";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { error: "Booking is not configured. Set DATABASE_URL." },
      { status: 503 }
    );
  }

  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");

  if (date) {
    const p = parseYmd(date);
    if (!p) {
      return NextResponse.json({ error: "Invalid date" }, { status: 400 });
    }
    const slots = await getFreeSlotsForDate(p, new Date());
    return NextResponse.json({ slots, timeZone: "America/New_York" });
  }

  const from = searchParams.get("from");
  const to = searchParams.get("to");
  if (!from || !to) {
    return NextResponse.json(
      { error: "Query `from` and `to` (YYYY-MM-DD), or `date` for slot list." },
      { status: 400 }
    );
  }
  if (!parseYmd(from) || !parseYmd(to)) {
    return NextResponse.json(
      { error: "from and to must be YYYY-MM-DD" },
      { status: 400 }
    );
  }
  const availableDates = await getAvailableDatesInRange(from, to, new Date());
  return NextResponse.json({ availableDates, timeZone: "America/New_York" });
}
