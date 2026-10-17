import assert from "node:assert/strict";
import test from "node:test";
import {
  INITIAL_UNAVAILABLE_UNTIL,
  classifyYmd,
  emptyCalendarState,
  isYmdOpenForBooking,
  nextAvailableYmd,
  oneMonthFromYmd,
} from "./calendar";

test("one month from 2026-10-10 is 2026-11-10", () => {
  assert.equal(oneMonthFromYmd("2026-10-10"), "2026-11-10");
});

test("default calendar first open day is December 17, 2026", () => {
  assert.equal(INITIAL_UNAVAILABLE_UNTIL, "2026-12-17");
  const state = emptyCalendarState();
  const now = new Date("2026-10-10T15:00:00.000Z");
  assert.equal(isYmdOpenForBooking("2026-10-12", state, now), false);
  assert.equal(isYmdOpenForBooking("2026-11-10", state, now), false);
  assert.equal(isYmdOpenForBooking("2026-12-16", state, now), false);
  assert.equal(isYmdOpenForBooking("2026-12-17", state, now), true);
  assert.equal(classifyYmd("2026-10-12", state, now), "booked");
  assert.equal(classifyYmd("2026-12-16", state, now), "booked");
  assert.equal(classifyYmd("2026-12-17", state, now), "available");
  assert.equal(nextAvailableYmd(state, now), "2026-12-17");
});

test("Saturdays and Sundays are working days after the booked-until date", () => {
  const state = emptyCalendarState();
  const now = new Date("2026-10-10T15:00:00.000Z");
  assert.equal(classifyYmd("2026-10-10", state, now), "booked");
  assert.equal(classifyYmd("2026-10-11", state, now), "booked");
  assert.equal(isYmdOpenForBooking("2026-12-19", state, now), true); // Saturday
  assert.equal(isYmdOpenForBooking("2026-12-20", state, now), true); // Sunday
  assert.equal(classifyYmd("2026-12-19", state, now), "available");
  assert.equal(classifyYmd("2026-12-20", state, now), "available");
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
  state.overrides["2026-12-17"] = "closed";
  const now = new Date("2026-10-10T15:00:00.000Z");
  assert.equal(isYmdOpenForBooking("2026-12-17", state, now), false);
  assert.equal(nextAvailableYmd(state, now), "2026-12-18");
});

test("Tani can close a weekend day", () => {
  const state = emptyCalendarState();
  state.overrides["2026-12-19"] = "closed";
  const now = new Date("2026-10-10T15:00:00.000Z");
  assert.equal(isYmdOpenForBooking("2026-12-19", state, now), false);
  assert.equal(isYmdOpenForBooking("2026-12-20", state, now), true);
});
