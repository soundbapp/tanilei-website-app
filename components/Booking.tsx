"use client";

import { useState, useEffect } from "react";

export default function Booking() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) setSubmitted(true);
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
        <p className="booking-sub mx-auto mb-11 mt-7 max-w-[440px] text-[0.72rem] font-light leading-[2] text-[var(--text-light)]">
          Join the Tani/Lei family. Enter your email to receive early access, priority booking, and your complimentary beauty consultation.
        </p>
        {submitted ? (
          <p className="text-[var(--rose-deep)] font-medium">
            Thank you! We&apos;ll be in touch soon.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="booking-form mx-auto mb-4 flex max-w-[440px] flex-col gap-2 border border-[rgba(201,169,154,0.45)] md:flex-row md:border">
            {mounted ? (
              <input
                type="email"
                className="booking-input min-h-[52px] flex-1 border-0 bg-white px-4 py-4 font-sans text-[0.68rem] text-[var(--text)] outline-none placeholder:opacity-55 placeholder:text-[var(--text-light)] md:border-0"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            ) : (
              <div className="booking-input min-h-[52px] flex-1 border-0 bg-white px-4 py-4 md:border-0" aria-hidden />
            )}
            <button
              type="submit"
              className="booking-btn min-h-[52px] whitespace-nowrap border-0 bg-[var(--dark)] px-5 py-4 font-sans text-[0.5rem] uppercase tracking-[0.18em] text-white transition-colors cursor-pointer hover:bg-[var(--rose-deep)] md:py-4"
            >
              Request Access
            </button>
          </form>
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
