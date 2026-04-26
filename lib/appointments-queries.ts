import { getDb, isDatabaseConfigured } from "./db";
import {
  dayRangeToCheck,
  parseYmd,
  slotInstantsForDay,
  BUSINESS_TZ,
} from "./availability";
import { toDate } from "date-fns-tz";

type Row = { starts_at: string };

export async function fetchBookedStartsBetween(
  startUtc: Date,
  endExclusiveUtc: Date
): Promise<Set<number>> {
  if (!isDatabaseConfigured()) {
    return new Set();
  }
  const sql = getDb();
  const rows = await sql`
    SELECT starts_at
    FROM appointments
    WHERE starts_at >= ${startUtc.toISOString()}::timestamptz
      AND starts_at < ${endExclusiveUtc.toISOString()}::timestamptz
  `;
  const s = new Set<number>();
  for (const r of rows as unknown as Row[]) {
    s.add(new Date(r.starts_at).getTime());
  }
  return s;
}

export async function getAvailableDatesInRange(
  fromYmd: string,
  toYmd: string,
  now: Date
): Promise<string[]> {
  const days = dayRangeToCheck(fromYmd, toYmd, now);
  if (days.length === 0) return [];
  if (!isDatabaseConfigured()) {
    return [];
  }
  const first = toDate(`${days[0]!}T00:00:00.000`, { timeZone: BUSINESS_TZ });
  const lastY = days[days.length - 1]!;
  const afterLast = toDate(`${lastY}T23:59:59.999`, { timeZone: BUSINESS_TZ });
  const endBoundary = new Date(afterLast.getTime() + 1);
  const booked = await fetchBookedStartsBetween(first, endBoundary);
  const available: string[] = [];
  for (const ymd of days) {
    const slots = slotInstantsForDay(ymd);
    const hasFree = slots.some((s) => {
      if (booked.has(s.getTime())) return false;
      return !isBeforeLocalSlot(s, now);
    });
    if (hasFree) available.push(ymd);
  }
  return available;
}

function isBeforeLocalSlot(slotStart: Date, now: Date): boolean {
  return slotStart.getTime() <= now.getTime();
}

export type SlotOption = { start: string; end: string; label: string };

export async function getFreeSlotsForDate(
  ymd: string,
  now: Date
): Promise<SlotOption[]> {
  const p = parseYmd(ymd);
  if (!p) return [];
  const instants = slotInstantsForDay(p);
  if (instants.length === 0) return [];
  if (!isDatabaseConfigured()) {
    return [];
  }
  const dayStart = toDate(`${p}T00:00:00.000`, { timeZone: BUSINESS_TZ });
  const dayEnd = toDate(`${p}T23:59:59.999`, { timeZone: BUSINESS_TZ });
  const endEx = new Date(dayEnd.getTime() + 1);
  const booked = await fetchBookedStartsBetween(dayStart, endEx);
  const out: SlotOption[] = [];
  for (const start of instants) {
    if (booked.has(start.getTime())) continue;
    if (isBeforeLocalSlot(start, now)) continue;
    const end = new Date(start.getTime() + 30 * 60 * 1000);
    out.push({
      start: start.toISOString(),
      end: end.toISOString(),
      label: formatLabel(start),
    });
  }
  return out;
}

function formatLabel(d: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: BUSINESS_TZ,
    hour: "numeric",
    minute: "2-digit",
  }).format(d);
}

export { isValidSlotWindow, parseYmd, minBookableYmd } from "./availability";
