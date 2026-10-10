import { NextResponse } from "next/server";
import {
  getAvailableDatesInRange,
  getFreeSlotsForDate,
} from "@/lib/appointments-queries";
import { parseYmd } from "@/lib/availability";
import {
  classifyYmd,
  eachYmdInclusive,
  formatLongYmd,
  nextAvailableYmd,
} from "@/lib/calendar";
import { getCalendarState } from "@/lib/calendar-store";
import { isDatabaseConfigured } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const now = new Date();
  const calendar = await getCalendarState();
  const nextOpen = nextAvailableYmd(calendar, now);
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");

  if (date) {
    const p = parseYmd(date);
    if (!p) {
      return NextResponse.json({ error: "Invalid date" }, { status: 400 });
    }
    const slots = await getFreeSlotsForDate(p, now, calendar);
    return NextResponse.json({
      slots,
      timeZone: "America/New_York",
      unavailableUntil: calendar.unavailableUntil,
      nextAvailableDate: nextOpen,
      nextAvailableLabel: nextOpen ? formatLongYmd(nextOpen) : null,
      canConfirmBooking: isDatabaseConfigured(),
    });
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
  const availableDates = await getAvailableDatesInRange(from, to, now, calendar);
  const availableSet = new Set(availableDates);
  const bookedDates: string[] = [];
  for (const ymd of eachYmdInclusive(from, to)) {
    const kind = classifyYmd(ymd, calendar, now);
    if (kind === "booked") bookedDates.push(ymd);
    else if (kind === "available" && !availableSet.has(ymd)) bookedDates.push(ymd);
  }

  return NextResponse.json({
    availableDates,
    bookedDates,
    unavailableUntil: calendar.unavailableUntil,
    nextAvailableDate: nextOpen,
    nextAvailableLabel: nextOpen ? formatLongYmd(nextOpen) : null,
    timeZone: "America/New_York",
    canConfirmBooking: isDatabaseConfigured(),
  });
}
