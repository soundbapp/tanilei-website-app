import type { Metadata } from "next";
import Link from "next/link";
import AppointmentsBooking from "@/components/AppointmentsBooking";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import ConsultationNotes from "@/components/ConsultationNotes";

export const metadata: Metadata = {
  title: "Book — Tani/Lei",
  description:
    "Book a consultation with Tani. Service, photos, and hair bio required before your visit.",
};

export default function AppointmentsPage() {
  return (
    <>
      <SiteNav />
      <main>
        <section className="relative overflow-hidden px-5 pb-16 pt-28 text-center md:px-12 md:pt-32">
          <div className="relative z-[1] mx-auto max-w-4xl">
            <p className="mb-3 text-[1.05rem] uppercase tracking-[0.14em] text-[var(--rose-deep)]">
              Book
            </p>
            <h1 className="font-serif mb-4 text-[clamp(1.8rem,4.5vw,3rem)] font-light leading-tight text-[var(--dark)]">
              Consultation
            </h1>
            <div className="section-line mx-auto h-px w-[50px] bg-[var(--rose-gold)]" />
            <p className="mx-auto mt-6 max-w-lg text-[1.25rem] font-light leading-[1.8] text-[var(--text-light)]">
              Pick a day. After you book, we email a form for your service,
              before photo, desired look, and hair bio.{" "}
              <Link
                href="/"
                className="text-[var(--rose-deep)] no-underline hover:underline"
              >
                Home
              </Link>
            </p>
            <div className="mx-auto mt-10 max-w-xl text-left">
              <ConsultationNotes />
            </div>
            <div className="mt-12 text-left">
              <AppointmentsBooking />
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
