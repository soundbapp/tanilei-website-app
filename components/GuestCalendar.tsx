"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { endOfMonth, format, startOfMonth } from "date-fns";
import { formatInTimeZone, toDate } from "date-fns-tz";

const NY = "America/New_York";

export type GuestCalendarMeta = {
  availableDates: string[];
  bookedDates: string[];
  nextAvailableDate: string | null;
  nextAvailableLabel: string | null;
  unavailableUntil: string | null;
  canConfirmBooking: boolean;
};

type Props = {
  selected?: Date;
  onSelect?: (day: Date | undefined) => void;
  interactive?: boolean;
  onMeta?: (meta: GuestCalendarMeta) => void;
  months?: number;
};

function todayYmd(): string {
  return formatInTimeZone(new Date(), NY, "yyyy-MM-dd");
}

function ymdOf(d: Date): string {
  return formatInTimeZone(d, NY, "yyyy-MM-dd");
}

function datesFromYmds(ymds: string[]): Date[] {
  return ymds.map((ymd) => toDate(`${ymd}T12:00:00.000`, { timeZone: NY }));
}

export default function GuestCalendar({
  selected,
  onSelect,
  interactive = true,
  onMeta,
  months,
}: Props) {
  const [month, setMonth] = useState(() => new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [availableSet, setAvailableSet] = useState<Set<string>>(new Set());
  const [bookedSet, setBookedSet] = useState<Set<string>>(new Set());
  const [nextAvailableDate, setNextAvailableDate] = useState<string | null>(null);
  const [nextAvailableLabel, setNextAvailableLabel] = useState<string | null>(null);
  const [wide, setWide] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 900px)");
    const apply = () => setWide(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const monthCount = months ?? (wide ? 2 : 1);

  const load = useCallback(
    async (m: Date, count: number) => {
      setLoading(true);
      setError(null);
      const from = format(startOfMonth(m), "yyyy-MM-dd");
      const end = new Date(m.getFullYear(), m.getMonth() + count, 0);
      const to = format(endOfMonth(end), "yyyy-MM-dd");
      try {
        const res = await fetch(
          `/api/appointments/availability?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`
        );
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Could not load calendar.");
          setAvailableSet(new Set());
          setBookedSet(new Set());
          return;
        }
        const available = new Set<string>(data.availableDates || []);
        const booked = new Set<string>(data.bookedDates || []);
        setAvailableSet(available);
        setBookedSet(booked);
        setNextAvailableDate(data.nextAvailableDate || null);
        setNextAvailableLabel(data.nextAvailableLabel || null);
        onMeta?.({
          availableDates: data.availableDates || [],
          bookedDates: data.bookedDates || [],
          nextAvailableDate: data.nextAvailableDate || null,
          nextAvailableLabel: data.nextAvailableLabel || null,
          unavailableUntil: data.unavailableUntil || null,
          canConfirmBooking: Boolean(data.canConfirmBooking),
        });
      } catch {
        setError("Could not load calendar.");
        setAvailableSet(new Set());
        setBookedSet(new Set());
      } finally {
        setLoading(false);
      }
    },
    [onMeta]
  );

  useEffect(() => {
    load(month, monthCount);
  }, [month, monthCount, load]);

  const bookedDates = useMemo(() => datesFromYmds([...bookedSet]), [bookedSet]);
  const openDates = useMemo(() => datesFromYmds([...availableSet]), [availableSet]);

  const disabled = useCallback(
    (d: Date) => {
      const ymd = ymdOf(d);
      if (ymd < todayYmd()) return true;
      if (!interactive) return true;
      if (loading) return true;
      return !availableSet.has(ymd);
    },
    [availableSet, interactive, loading]
  );

  const goToNextOpen = () => {
    if (!nextAvailableDate) return;
    const d = toDate(`${nextAvailableDate}T12:00:00.000`, { timeZone: NY });
    setMonth(d);
    if (interactive) onSelect?.(d);
  };

  return (
    <div className="w-full">
      {(nextAvailableLabel || loading) && (
        <div className="mb-5 border border-[rgba(201,169,154,0.45)] bg-white/80 px-4 py-3 text-center">
          <p className="text-[1.05rem] text-[var(--text)]">
            Tani&apos;s calendar
          </p>
          <p className="mt-2 text-[1.1rem] font-normal leading-[1.7] text-[var(--text)]">
            {loading
              ? "Loading availability…"
              : nextAvailableDate && nextAvailableDate > todayYmd()
                ? `Tani is booked until ${nextAvailableLabel}. She is not available until ${format(
                    toDate(`${nextAvailableDate}T12:00:00.000`, { timeZone: NY }),
                    "MMMM"
                  )}.`
                : nextAvailableLabel
                  ? `Next opening: ${nextAvailableLabel}.`
                  : "No openings are on the calendar right now."}
          </p>
          {nextAvailableDate && nextAvailableDate > todayYmd() && (
            <button
              type="button"
              onClick={goToNextOpen}
              className="mt-3 border border-[var(--rose-gold)] bg-transparent px-4 py-2 text-[1.05rem] text-[var(--dark)] transition-colors hover:bg-[var(--rose-gold)] hover:text-white"
            >
              Show {format(toDate(`${nextAvailableDate}T12:00:00.000`, { timeZone: NY }), "MMMM")}
            </button>
          )}
        </div>
      )}

      {error && (
        <p className="mb-3 text-center text-[1.15rem] text-red-600" role="alert">
          {error}
        </p>
      )}

      <div className="flex justify-center tani-calendar [&_.rdp-root]:!font-sans [&_.rdp-day_button]:!rounded-none [&_.rdp-day]:!text-[1.15rem] [&_.rdp-weekday]:!text-[1.05rem] [&_.rdp-weekday]:!text-[var(--text-light)] [&_.rdp-selected]:!bg-[var(--dark)] [&_.rdp-selected]:!text-white [&_.rdp-today]:!font-semibold">
        <DayPicker
          mode="single"
          month={month}
          onMonthChange={setMonth}
          selected={interactive ? selected : undefined}
          onSelect={interactive ? onSelect : undefined}
          disabled={disabled}
          numberOfMonths={monthCount}
          showOutsideDays={false}
          modifiers={{ booked: bookedDates, open: openDates }}
          modifiersClassNames={{
            booked: "tani-day-booked",
            open: "tani-day-open",
          }}
          className="!p-0"
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-[1.05rem] text-[var(--text-light)]">
        <span className="inline-flex items-center gap-2">
          <span className="inline-block h-3 w-3 border border-[var(--rose-gold)] bg-[#f3e2da]" />
          Booked
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="inline-block h-3 w-3 border border-[var(--dark)] bg-white" />
          Open
        </span>
        <span>Any day, including weekends · 9am–5pm Eastern</span>
      </div>
    </div>
  );
}
