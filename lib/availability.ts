import { addDays, isBefore } from "date-fns";
import { toDate, formatInTimeZone } from "date-fns-tz";

/** IANA time zone for working hours and slot boundaries */
export const BUSINESS_TZ = "America/New_York";
const SLOT_MINUTES = 30;
const DAY_START_MIN = 9 * 60; // 09:00
const DAY_END_MIN = 17 * 60; // 17:00 (last slot starts 16:30)

function isWeekdayYmd(ymd: string): boolean {
  const d = toDate(`${ymd}T12:00:00.000`, { timeZone: BUSINESS_TZ });
  const isoDow = parseInt(formatInTimeZone(d, BUSINESS_TZ, "i"), 10);
  return isoDow >= 1 && isoDow <= 5;
}

/** Wall-clock slot starts as UTC `Date` for a calendar day `YYYY-MM-DD` in `BUSINESS_TZ`. */
export function slotInstantsForDay(ymd: string): Date[] {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(ymd) || !isWeekdayYmd(ymd)) {
    return [];
  }
  const out: Date[] = [];
  for (let m = DAY_START_MIN; m + SLOT_MINUTES <= DAY_END_MIN; m += SLOT_MINUTES) {
    const h = Math.floor(m / 60);
    const min = m % 60;
    const wall = `${ymd}T${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}:00.000`;
    out.push(toDate(wall, { timeZone: BUSINESS_TZ }));
  }
  return out;
}

function ymdInTz(d: Date): string {
  return formatInTimeZone(d, BUSINESS_TZ, "yyyy-MM-dd");
}

/** Earliest local calendar day to offer (today in business TZ, start of day as boundary). */
export function minBookableYmd(fromUtc: Date = new Date()): string {
  return ymdInTz(fromUtc);
}

export function parseYmd(s: string): string | null {
  if (typeof s !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
  return s;
}

function addCalendarDaysYmd(ymd: string, n: number): string {
  const anchor = toDate(`${ymd}T12:00:00.000`, { timeZone: BUSINESS_TZ });
  return formatInTimeZone(addDays(anchor, n), BUSINESS_TZ, "yyyy-MM-dd");
}

/**
 * Inclusive `fromYmd` / `toYmd` (calendar days in BUSINESS_TZ).
 * Skips days before `minBookableYmd(now)` and non–weekday days.
 */
export function dayRangeToCheck(
  fromYmd: string,
  toYmd: string,
  now: Date = new Date()
): string[] {
  if (toYmd < fromYmd) return [];
  const minY = minBookableYmd(now);
  let current = fromYmd >= minY ? fromYmd : minY;
  if (current > toYmd) return [];
  const out: string[] = [];
  let guard = 0;
  while (current <= toYmd && guard++ < 400) {
    if (isWeekdayYmd(current)) out.push(current);
    if (current === toYmd) break;
    current = addCalendarDaysYmd(current, 1);
  }
  return out;
}

/**
 * If `start` is the first instant of a valid slot and `end` = start + 30m, and `start` is not in the past
 * in BUSINESS_TZ (buffer: must be strictly after `now` UTC for that instant), return true.
 */
export function isValidSlotWindow(start: Date, end: Date, now: Date = new Date()): boolean {
  if (isBefore(end, start) || end.getTime() - start.getTime() !== SLOT_MINUTES * 60 * 1000) {
    return false;
  }
  const ymd = formatInTimeZone(start, BUSINESS_TZ, "yyyy-MM-dd");
  const slots = slotInstantsForDay(ymd);
  const match = slots.some(
    (s) => s.getTime() === start.getTime()
  );
  if (!match) return false;
  return !isBefore(start, now);
}
