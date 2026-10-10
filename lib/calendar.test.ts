import assert from "node:assert/strict";
import test from "node:test";
import {
  INITIAL_UNAVAILABLE_UNTIL,
  classifyYmd,
  emptyCalendarState,
  isYmdOpenForBooking,
  isWeekdayYmd,
  nextAvailableYmd,
  oneMonthFromYmd,
} from "./calendar";

test("one month from 2026-10-10 is 2026-11-10", () => {
  assert.equal(oneMonthFromYmd("2026-10-10"), "2026-11-10");
  assert.equal(INITIAL_UNAVAILABLE_UNTIL, "2026-11-10");
});

test("weekdays vs weekend", () => {
  assert.equal(isWeekdayYmd("2026-10-10"), false); // Saturday
  assert.equal(isWeekdayYmd("2026-11-10"), true); // Tuesday
});

test("default calendar is booked until November 10", () => {
  const state = emptyCalendarState();
  const now = new Date("2026-10-10T15:00:00.000Z");
  assert.equal(isYmdOpenForBooking("2026-10-12", state, now), false); // Monday in Oct
  assert.equal(isYmdOpenForBooking("2026-11-09", state, now), false);
  assert.equal(isYmdOpenForBooking("2026-11-10", state, now), true);
  assert.equal(classifyYmd("2026-10-12", state, now), "booked");
  assert.equal(classifyYmd("2026-11-10", state, now), "available");
  assert.equal(nextAvailableYmd(state, now), "2026-11-10");
});

test("open override punches a hole in the booked stretch", () => {
  const state = emptyCalendarState();
  state.overrides["2026-10-16"] = "open"; // Friday
  const now = new Date("2026-10-10T15:00:00.000Z");
  assert.equal(isYmdOpenForBooking("2026-10-16", state, now), true);
  assert.equal(nextAvailableYmd(state, now), "2026-10-16");
});

test("closed override blocks an otherwise open day", () => {
  const state = emptyCalendarState();
  state.overrides["2026-11-10"] = "closed";
  const now = new Date("2026-10-10T15:00:00.000Z");
  assert.equal(isYmdOpenForBooking("2026-11-10", state, now), false);
  assert.equal(nextAvailableYmd(state, now), "2026-11-11");
});
