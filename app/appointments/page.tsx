import type { Metadata } from "next";
import Link from "next/link";
import AppointmentsBooking from "@/components/AppointmentsBooking";
import Nav from "@/components/Nav";

export const metadata: Metadata = {
  title: "Book an appointment — Tani/Lei",
  description:
    "Schedule a beauty visit with Tani. Choose a time that works for you — we'll confirm by email.",
};

export default function AppointmentsPage() {
  return (
    <>
      <Nav />
      <main>
        <section className="relative overflow-hidden px-5 pb-20 pt-28 text-center md:px-12 md:pt-32">
          <div
            className="absolute inset-0 h-full opacity-[0.32]"
            style={{
              background: `linear-gradient(135deg, #e8d0cc 0%, #d4c4d4 20%, #c8b8d0 40%, #e0c8c0 60%, #d0bcc8 100%)`,
              backgroundSize: "400% 400%",
            }}
            aria-hidden
          />
          <div className="relative z-[1] mx-auto max-w-4xl">
            <p className="mb-3 text-[0.52rem] uppercase tracking-[0.38em] text-[var(--rose-deep)]">
              Schedule
            </p>
            <h1 className="font-serif mb-4 text-[clamp(1.8rem,4.5vw,3rem)] font-light leading-tight text-[var(--dark)]">
              Appointments
            </h1>
            <div className="section-line mx-auto h-px w-[50px] bg-[var(--rose-gold)]" />
            <p className="mx-auto mt-6 max-w-lg text-[0.72rem] font-light leading-[2] text-[var(--text-light)]">
              Pick a day and time below. We&apos;ll email you a confirmation.{" "}
              <Link
                href="/"
                className="text-[var(--rose-deep)] no-underline hover:underline"
              >
                Back to the site
              </Link>
            </p>
            <div className="mt-12 text-left">
              <AppointmentsBooking />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
