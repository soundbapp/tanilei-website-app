import { addDays, addMonths } from "date-fns";
import { formatInTimeZone, toDate } from "date-fns-tz";
import { BUSINESS_TZ, parseYmd } from "./availability";

/** First day Tani is open again as of this work: exactly one month from 2026-10-10. */
export const INITIAL_UNAVAILABLE_UNTIL = "2026-11-10";

export type DayOverrideStatus = "open" | "closed";

export type CalendarState = {
  unavailableUntil: string;
  overrides: Record<string, DayOverrideStatus>;
};

export function emptyCalendarState(): CalendarState {
  return {
    unavailableUntil: INITIAL_UNAVAILABLE_UNTIL,
    overrides: {},
  };
}

export function ymdInBusinessTz(d: Date): string {
  return formatInTimeZone(d, BUSINESS_TZ, "yyyy-MM-dd");
}

/** Calendar day exactly one month after `from` in the business time zone. */
export function oneMonthFromYmd(fromYmd: string): string {
  const parsed = parseYmd(fromYmd);
  if (!parsed) {
    throw new Error("Invalid date");
  }
  const anchor = toDate(`${parsed}T12:00:00.000`, { timeZone: BUSINESS_TZ });
  return formatInTimeZone(addMonths(anchor, 1), BUSINESS_TZ, "yyyy-MM-dd");
}

export function isWeekdayYmd(ymd: string): boolean {
  if (!parseYmd(ymd)) return false;
  const d = toDate(`${ymd}T12:00:00.000`, { timeZone: BUSINESS_TZ });
  const isoDow = parseInt(formatInTimeZone(d, BUSINESS_TZ, "i"), 10);
  return isoDow >= 1 && isoDow <= 5;
}

/**
 * Whether guests may book this calendar day.
 * `unavailableUntil` is the first open day (exclusive of the booked-out stretch).
 * Overrides: `open` punches a hole in the booked-out stretch; `closed` blocks an otherwise-open day.
 */
export function isYmdOpenForBooking(
  ymd: string,
  state: CalendarState,
  now: Date = new Date()
): boolean {
  if (!parseYmd(ymd) || !isWeekdayYmd(ymd)) return false;
  const today = ymdInBusinessTz(now);
  if (ymd < today) return false;

  const override = state.overrides[ymd];
  if (override === "closed") return false;
  if (override === "open") return true;

  if (state.unavailableUntil && ymd < state.unavailableUntil) return false;
  return true;
}

export function classifyYmd(
  ymd: string,
  state: CalendarState,
  now: Date = new Date()
): "past" | "weekend" | "booked" | "available" {
  if (!parseYmd(ymd)) return "past";
  const today = ymdInBusinessTz(now);
  if (ymd < today) return "past";
  if (!isWeekdayYmd(ymd)) return "weekend";
  return isYmdOpenForBooking(ymd, state, now) ? "available" : "booked";
}

export function nextAvailableYmd(
  state: CalendarState,
  now: Date = new Date(),
  horizonDays = 240
): string | null {
  let current = ymdInBusinessTz(now);
  for (let i = 0; i < horizonDays; i++) {
    if (isYmdOpenForBooking(current, state, now)) return current;
    const anchor = toDate(`${current}T12:00:00.000`, { timeZone: BUSINESS_TZ });
    current = formatInTimeZone(addDays(anchor, 1), BUSINESS_TZ, "yyyy-MM-dd");
  }
  return null;
}

/** Inclusive YYYY-MM-DD walk in the business calendar. */
export function eachYmdInclusive(fromYmd: string, toYmd: string): string[] {
  const from = parseYmd(fromYmd);
  const to = parseYmd(toYmd);
  if (!from || !to || to < from) return [];
  const out: string[] = [];
  let current = from;
  let guard = 0;
  while (current <= to && guard++ < 400) {
    out.push(current);
    if (current === to) break;
    const anchor = toDate(`${current}T12:00:00.000`, { timeZone: BUSINESS_TZ });
    current = formatInTimeZone(addDays(anchor, 1), BUSINESS_TZ, "yyyy-MM-dd");
  }
  return out;
}

export function formatLongYmd(ymd: string): string {
  const parsed = parseYmd(ymd);
  if (!parsed) return ymd;
  const d = toDate(`${parsed}T12:00:00.000`, { timeZone: BUSINESS_TZ });
  return formatInTimeZone(d, BUSINESS_TZ, "EEEE, MMMM d, yyyy");
}
