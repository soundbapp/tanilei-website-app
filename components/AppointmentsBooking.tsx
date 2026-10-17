"use client";

import { useState, useCallback } from "react";
import { formatInTimeZone } from "date-fns-tz";
import Link from "next/link";
import GuestCalendar, { type GuestCalendarMeta } from "@/components/GuestCalendar";
import { SERVICE_MENU, serviceLabel } from "@/lib/consultation";

const NY = "America/New_York";

type Slot = { start: string; end: string; label: string };

export default function AppointmentsBooking() {
  const [meta, setMeta] = useState<GuestCalendarMeta | null>(null);
  const [selected, setSelected] = useState<Date | undefined>(undefined);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [requestedService, setRequestedService] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onMeta = useCallback((next: GuestCalendarMeta) => {
    setMeta(next);
  }, []);

  const onSelectDay = useCallback((day: Date | undefined) => {
    setSelected(day);
    setSelectedSlot(null);
    setSlots([]);
    setError(null);
    if (!day) return;
    const ymd = formatInTimeZone(day, NY, "yyyy-MM-dd");
    setLoadingSlots(true);
    fetch(`/api/appointments/availability?date=${encodeURIComponent(ymd)}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Could not load times.");
          setSlots([]);
          return;
        }
        setSlots(data.slots || []);
      })
      .catch(() => {
        setError("Could not load times.");
        setSlots([]);
      })
      .finally(() => setLoadingSlots(false));
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) return;
    if (!requestedService) {
      setError("Please choose the service you need.");
      return;
    }
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
          requestedService,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 409) {
        setError(data.error || "That time was just taken. Please choose another.");
        if (selected) onSelectDay(selected);
        return;
      }
      if (res.status === 503) {
        setError(
          data.error ||
            "Online hold isn’t configured yet. Call or email to keep this time."
        );
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

  if (done) {
    return (
      <div className="mx-auto max-w-md text-center">
        <p className="text-[1.15rem] font-medium text-[var(--text)]">
          You&apos;re booked. We sent a confirmation to your email.
        </p>
        <p className="mt-4 text-[1.25rem] text-[var(--text-light)]">
          Times are shown in Eastern (New York) time. Check your email for the
          consultation form — before photo, desired look, and hair bio.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block text-[1.1rem] text-[var(--text-light)] no-underline hover:text-[var(--rose-deep)]"
        >
          ← Home
        </Link>
      </div>
    );
  }

  const bookingReady = meta?.canConfirmBooking !== false;

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-10 md:flex-row md:items-start md:gap-12">
      <div className="flex flex-1 flex-col items-center">
        <GuestCalendar
          selected={selected}
          onSelect={onSelectDay}
          interactive
          onMeta={onMeta}
        />
      </div>

      <div className="min-h-[200px] flex-1">
        {error && (
          <p className="mb-3 text-[1.15rem] text-red-600" role="alert">
            {error}
          </p>
        )}
        {!bookingReady && (
          <p className="mb-4 text-[1.15rem] leading-[1.8] text-[var(--text-light)]">
            The calendar is live so you can see Tani&apos;s openings. To hold a
            time, call{" "}
            <a href="tel:2025108945" className="text-[var(--text)]">
              202-510-8945
            </a>{" "}
            or email{" "}
            <a href="mailto:hello@tanilei.com" className="text-[var(--text)]">
              hello@tanilei.com
            </a>
            .
          </p>
        )}
        {!selected ? (
          <p className="text-[1.25rem] leading-[1.8] text-[var(--text-light)]">
            Open days are outlined. Rose days are already booked. Select an open
            day to see times.
          </p>
        ) : loadingSlots ? (
          <p className="text-[1.2rem] text-[var(--text-light)]">Loading times…</p>
        ) : slots.length === 0 ? (
          <p className="text-[1.2rem] text-[var(--text-light)]">
            No open times on this day. Please choose another date.
          </p>
        ) : (
          <>
            <p className="mb-3 text-[1.05rem] text-[var(--text)]">
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
                      ? "border border-[var(--dark)] bg-[var(--dark)] px-3 py-2 text-[1.15rem] text-white"
                      : "border border-[rgba(201,169,154,0.5)] bg-white px-3 py-2 text-[1.15rem] text-[var(--text)] transition-colors hover:border-[var(--rose-deep)]"
                  }
                >
                  {s.label}
                </button>
              ))}
            </div>
            {selectedSlot && (
              <form onSubmit={onSubmit} className="space-y-3">
                <p className="text-[1.05rem] text-[var(--text)]">
                  Your details
                </p>
                <select
                  required
                  className="w-full min-h-[48px] border border-[rgba(201,169,154,0.45)] bg-white px-3 py-2 text-[1.15rem] text-[var(--text)] outline-none"
                  value={requestedService}
                  onChange={(e) => setRequestedService(e.target.value)}
                  disabled={submitting}
                >
                  <option value="">Service you need</option>
                  {SERVICE_MENU.map((item) => (
                    <option key={item.name} value={item.name}>
                      {serviceLabel(item)}
                    </option>
                  ))}
                  <option value="Other">Other</option>
                </select>
                <input
                  required
                  className="w-full min-h-[48px] border border-[rgba(201,169,154,0.45)] bg-white px-3 py-2 text-[1.15rem] text-[var(--text)] outline-none placeholder:text-[var(--text-light)]"
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={submitting}
                />
                <input
                  required
                  type="email"
                  className="w-full min-h-[48px] border border-[rgba(201,169,154,0.45)] bg-white px-3 py-2 text-[1.15rem] text-[var(--text)] outline-none placeholder:text-[var(--text-light)]"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={submitting}
                />
                <input
                  className="w-full min-h-[48px] border border-[rgba(201,169,154,0.45)] bg-white px-3 py-2 text-[1.15rem] text-[var(--text)] outline-none placeholder:text-[var(--text-light)]"
                  placeholder="Phone (optional)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={submitting}
                />
                <textarea
                  className="min-h-[80px] w-full resize-y border border-[rgba(201,169,154,0.45)] bg-white px-3 py-2 text-[1.15rem] text-[var(--text)] outline-none placeholder:text-[var(--text-light)]"
                  placeholder="Notes (optional)"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  disabled={submitting}
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full min-h-[48px] border-0 bg-[var(--dark)] px-4 py-3 text-[1.05rem] font-medium text-white transition-colors hover:bg-[var(--rose-deep)] disabled:cursor-not-allowed disabled:opacity-70"
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
