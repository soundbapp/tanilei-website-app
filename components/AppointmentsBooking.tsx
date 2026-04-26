"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import Link from "next/link";

const NY = "America/New_York";

type Slot = { start: string; end: string; label: string };

function todayYmd(): string {
  return formatInTimeZone(new Date(), NY, "yyyy-MM-dd");
}

export default function AppointmentsBooking() {
  const [configError, setConfigError] = useState(false);
  const [month, setMonth] = useState(() => new Date());
  const [availableSet, setAvailableSet] = useState<Set<string>>(new Set());
  const [loadingMonth, setLoadingMonth] = useState(true);
  const [selected, setSelected] = useState<Date | undefined>(undefined);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMonth = useCallback(async (m: Date) => {
    setLoadingMonth(true);
    setError(null);
    const from = format(startOfMonth(m), "yyyy-MM-dd");
    const to = format(endOfMonth(m), "yyyy-MM-dd");
    try {
      const res = await fetch(
        `/api/appointments/availability?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`
      );
      if (res.status === 503) {
        setConfigError(true);
        setAvailableSet(new Set());
        return;
      }
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not load calendar.");
        setAvailableSet(new Set());
        return;
      }
      setConfigError(false);
      setAvailableSet(new Set(data.availableDates as string[]));
    } catch {
      setError("Could not load calendar.");
      setAvailableSet(new Set());
    } finally {
      setLoadingMonth(false);
    }
  }, []);

  useEffect(() => {
    loadMonth(month);
  }, [month, loadMonth]);

  const disabledDays = useCallback(
    (d: Date) => {
      const ymd = formatInTimeZone(d, NY, "yyyy-MM-dd");
      if (ymd < todayYmd()) return true;
      if (loadingMonth) return true;
      if (availableSet.size === 0) return true;
      return !availableSet.has(ymd);
    },
    [availableSet, loadingMonth]
  );

  useEffect(() => {
    if (!selected) {
      setSlots([]);
      setSelectedSlot(null);
      return;
    }
    const ymd = formatInTimeZone(selected, NY, "yyyy-MM-dd");
    let cancelled = false;
    (async () => {
      setLoadingSlots(true);
      setSelectedSlot(null);
      setError(null);
      try {
        const res = await fetch(
          `/api/appointments/availability?date=${encodeURIComponent(ymd)}`
        );
        const data = await res.json();
        if (cancelled) return;
        if (res.status === 503) {
          setConfigError(true);
          setSlots([]);
          return;
        }
        if (!res.ok) {
          setError(data.error || "Could not load times.");
          setSlots([]);
          return;
        }
        setSlots(data.slots || []);
      } catch {
        if (!cancelled) setError("Could not load times.");
      } finally {
        if (!cancelled) setLoadingSlots(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [selected]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startsAt: selectedSlot.start,
          endsAt: selectedSlot.end,
          customerName: name.trim(),
          customerEmail: email.trim(),
          phone: phone.trim(),
          notes: notes.trim(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 409) {
        setError(
          data.error || "That time was just taken. Please choose another."
        );
        if (selected) {
          const ymd = formatInTimeZone(selected, NY, "yyyy-MM-dd");
          const r = await fetch(
            `/api/appointments/availability?date=${encodeURIComponent(ymd)}`
          );
          if (r.ok) {
            const d = await r.json();
            setSlots(d.slots || []);
          }
        }
        loadMonth(month);
        return;
      }
      if (!res.ok) {
        setError(data.error || "Could not book. Please try again.");
        return;
      }
      setDone(true);
    } catch {
      setError("Could not book. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const monthCaption = useMemo(
    () => format(month, "MMMM yyyy"),
    [month]
  );

  if (configError) {
    return (
      <div className="mx-auto max-w-lg text-center text-[0.8rem] leading-[1.8] text-[var(--text)]">
        <p className="mb-4 text-[var(--rose-deep)]">
          Online booking is not available right now. Please call or email us
          to schedule.
        </p>
        <p>
          <a
            href="tel:2025108945"
            className="text-[var(--rose-deep)] no-underline"
          >
            202-510-8945
          </a>
          {" · "}
          <a
            href="mailto:hello@tanilei.com"
            className="text-[var(--rose-deep)] no-underline"
          >
            hello@tanilei.com
          </a>
        </p>
        <p className="mt-6">
          <Link
            href="/"
            className="text-[0.58rem] uppercase tracking-[0.2em] text-[var(--text-light)] no-underline hover:text-[var(--rose-deep)]"
          >
            ← Home
          </Link>
        </p>
      </div>
    );
  }

  if (done) {
    return (
      <div className="mx-auto max-w-md text-center">
        <p className="text-[0.9rem] font-medium text-[var(--rose-deep)]">
          You&apos;re booked. We sent a confirmation to your email.
        </p>
        <p className="mt-4 text-[0.72rem] text-[var(--text-light)]">
          Times are shown in Eastern (New York) time.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block text-[0.58rem] uppercase tracking-[0.2em] text-[var(--text-light)] no-underline hover:text-[var(--rose-deep)]"
        >
          ← Home
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-10 md:flex-row md:items-start md:gap-12">
      <div className="flex flex-1 flex-col items-center">
        <p className="mb-2 text-center text-[0.5rem] uppercase tracking-[0.24em] text-[var(--text-light)]">
          {loadingMonth ? "Loading…" : monthCaption}
        </p>
        <div className="rdp-override [&_.rdp-root]:!font-sans [&_.rdp-day_button]:!rounded-none [&_.rdp-day]:!text-[0.7rem] [&_.rdp-weekday]:!text-[0.5rem] [&_.rdp-weekday]:!text-[var(--text-light)] [&_.rdp-selected]:!bg-[var(--dark)] [&_.rdp-selected]:!text-white [&_.rdp-today]:!font-semibold">
          <DayPicker
            mode="single"
            month={month}
            onMonthChange={setMonth}
            selected={selected}
            onSelect={setSelected}
            disabled={disabledDays}
            showOutsideDays
            className="!p-0"
          />
        </div>
        <p className="mt-3 text-center text-[0.5rem] tracking-wide text-[var(--text-light)]">
          Mon–Fri, 9am–5pm Eastern · 30 min visits
        </p>
      </div>

      <div className="min-h-[200px] flex-1">
        {error && (
          <p className="mb-3 text-[0.68rem] text-red-600" role="alert">
            {error}
          </p>
        )}
        {!selected ? (
          <p className="text-[0.72rem] leading-[1.8] text-[var(--text-light)]">
            Select a day to see open times.
          </p>
        ) : loadingSlots ? (
          <p className="text-[0.7rem] text-[var(--text-light)]">Loading times…</p>
        ) : slots.length === 0 ? (
          <p className="text-[0.7rem] text-[var(--text-light)]">
            No open times on this day. Please choose another date.
          </p>
        ) : (
          <>
            <p className="mb-3 text-[0.52rem] uppercase tracking-[0.2em] text-[var(--rose-deep)]">
              Choose a time
            </p>
            <div className="mb-6 flex max-h-[200px] flex-wrap gap-2 overflow-y-auto">
              {slots.map((s) => (
                <button
                  key={s.start}
                  type="button"
                  onClick={() => setSelectedSlot(s)}
                  className={
                    selectedSlot?.start === s.start
                      ? "border border-[var(--dark)] bg-[var(--dark)] px-3 py-2 text-[0.65rem] text-white"
                      : "border border-[rgba(201,169,154,0.5)] bg-white px-3 py-2 text-[0.65rem] text-[var(--text)] transition-colors hover:border-[var(--rose-deep)]"
                  }
                >
                  {s.label}
                </button>
              ))}
            </div>
            {selectedSlot && (
              <form onSubmit={onSubmit} className="space-y-3">
                <p className="text-[0.52rem] uppercase tracking-[0.2em] text-[var(--rose-deep)]">
                  Your details
                </p>
                <input
                  required
                  className="w-full min-h-[48px] border border-[rgba(201,169,154,0.45)] bg-white px-3 py-2 text-[0.68rem] text-[var(--text)] outline-none placeholder:text-[var(--text-light)]"
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={submitting}
                />
                <input
                  required
                  type="email"
                  className="w-full min-h-[48px] border border-[rgba(201,169,154,0.45)] bg-white px-3 py-2 text-[0.68rem] text-[var(--text)] outline-none placeholder:text-[var(--text-light)]"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={submitting}
                />
                <input
                  className="w-full min-h-[48px] border border-[rgba(201,169,154,0.45)] bg-white px-3 py-2 text-[0.68rem] text-[var(--text)] outline-none placeholder:text-[var(--text-light)]"
                  placeholder="Phone (optional)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={submitting}
                />
                <textarea
                  className="min-h-[80px] w-full resize-y border border-[rgba(201,169,154,0.45)] bg-white px-3 py-2 text-[0.68rem] text-[var(--text)] outline-none placeholder:text-[var(--text-light)]"
                  placeholder="Notes (optional)"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  disabled={submitting}
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full min-h-[48px] border-0 bg-[var(--dark)] px-4 py-3 text-[0.5rem] font-medium uppercase tracking-[0.18em] text-white transition-colors hover:bg-[var(--rose-deep)] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {submitting ? "Booking…" : "Confirm appointment"}
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}
