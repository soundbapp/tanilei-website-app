"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Booking() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = email.trim();
    if (!value) return;
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: value }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="book" className="booking relative overflow-hidden px-5 py-20 text-center md:px-12 md:py-[100px] md:pb-[120px]">
      <div className="booking-holo holo absolute inset-0 h-full opacity-[0.38]" />
      <div className="booking-inner relative z-[1] mx-auto max-w-[680px]">
        <p className="section-eyebrow mb-4 text-[0.52rem] uppercase tracking-[0.38em] text-[var(--rose-deep)]">
          Begin Your Journey
        </p>
        <h2 className="font-serif section-title mb-4 text-[clamp(2.2rem,5vw,4.2rem)] font-light leading-tight text-[var(--dark)]">
          Reserve Your <em className="text-[var(--rose-deep)]">Experience</em>
        </h2>
        <div className="section-line mx-auto mt-4 h-px w-[50px] bg-[var(--rose-gold)]" />
        <p className="booking-sub mx-auto mb-4 mt-7 max-w-[440px] text-[0.72rem] font-light leading-[2] text-[var(--text-light)]">
          Join the Tani/Lei family. Enter your email to receive early access, priority booking, and your complimentary beauty consultation.{" "}
          <Link
            href="/appointments"
            className="whitespace-nowrap text-[var(--rose-deep)] no-underline hover:underline"
          >
            Schedule a visit
          </Link>{" "}
          with the calendar.
        </p>
        {submitted ? (
          <p className="text-[var(--rose-deep)] font-medium">
            Thank you! We&apos;ll be in touch soon.
          </p>
        ) : (
          <>
            {error && (
              <p className="mb-3 text-[0.68rem] text-red-600" role="alert">
                {error}
              </p>
            )}
            <form onSubmit={handleSubmit} className="booking-form mx-auto mb-4 flex max-w-[440px] flex-col gap-2 border border-[rgba(201,169,154,0.45)] md:flex-row md:border">
              {mounted ? (
                <input
                  type="email"
                  className="booking-input min-h-[52px] flex-1 border-0 bg-white px-4 py-4 font-sans text-[0.68rem] text-[var(--text)] outline-none placeholder:opacity-55 placeholder:text-[var(--text-light)] md:border-0"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              ) : (
                <div className="booking-input min-h-[52px] flex-1 border-0 bg-white px-4 py-4 md:border-0" aria-hidden />
              )}
              <button
                type="submit"
                disabled={loading}
                className="booking-btn min-h-[52px] whitespace-nowrap border-0 bg-[var(--dark)] px-5 py-4 font-sans text-[0.5rem] uppercase tracking-[0.18em] text-white transition-colors cursor-pointer hover:bg-[var(--rose-deep)] disabled:opacity-70 disabled:cursor-not-allowed md:py-4"
              >
                {loading ? "Sending…" : "Request Access"}
              </button>
            </form>
          </>
        )}
        <p className="booking-note text-[0.5rem] tracking-[0.12em] text-[var(--text-light)]">
          Call us · <a href="tel:2025108945" className="text-[var(--rose-deep)] no-underline">202-510-8945</a> ·{" "}
          <a href="mailto:hello@tanilei.com" className="text-[var(--rose-deep)] no-underline">
            hello@tanilei.com
          </a>
        </p>
      </div>
    </section>
  );
}
