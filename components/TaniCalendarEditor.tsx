"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { format } from "date-fns";
import { formatInTimeZone, toDate } from "date-fns-tz";
import {
  classifyYmd,
  eachYmdInclusive,
  type CalendarState,
  type DayOverrideStatus,
} from "@/lib/calendar";

const NY = "America/New_York";

function ymdOf(d: Date): string {
  return formatInTimeZone(d, NY, "yyyy-MM-dd");
}

function todayYmd(): string {
  return formatInTimeZone(new Date(), NY, "yyyy-MM-dd");
}

export default function TaniCalendarEditor() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [unavailableUntil, setUnavailableUntil] = useState("2026-11-10");
  const [overrides, setOverrides] = useState<Record<string, DayOverrideStatus>>({});
  const [nextLabel, setNextLabel] = useState<string | null>(null);
  const [month, setMonth] = useState(() => new Date());

  const state: CalendarState = useMemo(
    () => ({ unavailableUntil, overrides }),
    [unavailableUntil, overrides]
  );

  const applyPayload = (data: {
    unavailableUntil?: string;
    overrides?: Record<string, DayOverrideStatus>;
    nextAvailableLabel?: string | null;
  }) => {
    if (data.unavailableUntil) setUnavailableUntil(data.unavailableUntil);
    setOverrides(data.overrides || {});
    setNextLabel(data.nextAvailableLabel || null);
  };

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/calendar");
      if (res.status === 401) {
        router.replace("/tani/login");
        return;
      }
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not load your calendar.");
        return;
      }
      applyPayload(data);
    } catch {
      setError("Could not load your calendar.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    load();
  }, [load]);

  const savePatch = async (patch: Record<string, unknown>) => {
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/calendar", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (res.status === 401) {
        router.replace("/tani/login");
        return;
      }
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not save.");
        return;
      }
      applyPayload(data);
      setMessage("Calendar saved. Guests will see this immediately.");
    } catch {
      setError("Could not save.");
    } finally {
      setSaving(false);
    }
  };

  const onDayClick = (day: Date) => {
    const ymd = ymdOf(day);
    if (ymd < todayYmd()) return;
    const kind = classifyYmd(ymd, state, new Date());
    if (kind === "available") {
      if (ymd < unavailableUntil) {
        void savePatch({ clearOverrides: [ymd] });
      } else {
        void savePatch({ setOverrides: [{ day: ymd, status: "closed" }] });
      }
      return;
    }
    if (ymd < unavailableUntil) {
      void savePatch({ setOverrides: [{ day: ymd, status: "open" }] });
    } else {
      void savePatch({ clearOverrides: [ymd] });
    }
  };

  const fromYmd = format(new Date(month.getFullYear(), month.getMonth(), 1), "yyyy-MM-dd");
  const toYmd = format(new Date(month.getFullYear(), month.getMonth() + 2, 0), "yyyy-MM-dd");
  const bookedDates: Date[] = [];
  const openDates: Date[] = [];
  for (const ymd of eachYmdInclusive(fromYmd, toYmd)) {
    const kind = classifyYmd(ymd, state, new Date());
    const asDate = toDate(`${ymd}T12:00:00.000`, { timeZone: NY });
    if (kind === "booked") bookedDates.push(asDate);
    if (kind === "available") openDates.push(asDate);
  }

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/tani/login");
  };

  return (
    <div className="mx-auto w-full max-w-3xl text-left">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[1.25rem] text-[var(--text-light)]">
          Signed in as Tani
        </p>
        <button
          type="button"
          onClick={() => void logout()}
          className="text-[1.05rem] uppercase tracking-[0.18em] text-[var(--text-light)] hover:text-[var(--rose-deep)]"
        >
          Log out
        </button>
      </div>

      {error && (
        <p className="mb-4 text-[1.15rem] text-red-600" role="alert">
          {error}
        </p>
      )}
      {message && (
        <p className="mb-4 text-[1.15rem] text-[var(--rose-deep)]" role="status">
          {message}
        </p>
      )}

      <label className="mb-6 block">
        <span className="mb-2 block text-[1.05rem] uppercase tracking-[0.14em] text-[var(--rose-deep)]">
          Booked until (first open day)
        </span>
        <input
          type="date"
          value={unavailableUntil}
          disabled={loading || saving}
          onChange={(e) => {
            const value = e.target.value;
            setUnavailableUntil(value);
            void savePatch({ unavailableUntil: value });
          }}
          className="min-h-[48px] border border-[rgba(201,169,154,0.45)] bg-white px-3 py-2 text-[1.2rem] text-[var(--text)]"
        />
        <span className="mt-2 block text-[1.25rem] leading-[1.7] text-[var(--text-light)]">
          Guests cannot choose days before this date, unless you open one on the
          calendar below. Currently next opening:{" "}
          {nextLabel || (loading ? "…" : "none on the calendar")}.
        </span>
      </label>

      <p className="mb-3 text-[1.25rem] leading-[1.7] text-[var(--text-light)]">
        Click any day, including Saturday or Sunday, to open or close it. Rose =
        booked. Outlined = open for guests.
      </p>

      <div className="tani-calendar flex justify-center [&_.rdp-root]:!font-sans [&_.rdp-day_button]:!rounded-none">
        <DayPicker
          mode="single"
          month={month}
          onMonthChange={setMonth}
          onDayClick={onDayClick}
          numberOfMonths={2}
          showOutsideDays={false}
          modifiers={{ booked: bookedDates, open: openDates }}
          modifiersClassNames={{
            booked: "tani-day-booked",
            open: "tani-day-open",
          }}
          disabled={(d) => ymdOf(d) < todayYmd()}
        />
      </div>
      {saving && (
        <p className="mt-3 text-center text-[1.15rem] text-[var(--text-light)]">
          Saving…
        </p>
      )}
    </div>
  );
}
