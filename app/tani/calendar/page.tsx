import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import TaniCalendarEditor from "@/components/TaniCalendarEditor";

export const metadata: Metadata = {
  title: "My calendar — Tani/Lei",
  robots: { index: false, follow: false },
};

export default function TaniCalendarPage() {
  return (
    <>
      <Nav />
      <main>
        <section className="relative overflow-hidden px-5 pb-20 pt-28 text-center md:px-12 md:pt-32">
          <div className="relative z-[1] mx-auto max-w-4xl">
            <p className="mb-3 text-[1.05rem] uppercase tracking-[0.14em] text-[var(--text)]">
              Staff
            </p>
            <h1 className="font-serif mb-4 text-[clamp(1.8rem,4.5vw,3rem)] font-normal text-[var(--dark)]">
              Your calendar
            </h1>
            <div className="section-line mx-auto h-px w-[50px] bg-[var(--rose-gold)]" />
            <p className="mx-auto mt-6 mb-10 max-w-lg text-[1.25rem] font-normal leading-[2] text-[var(--text-light)]">
              Guests see this on the Book Now page.{" "}
              <Link href="/appointments" className="text-[var(--text)] no-underline hover:underline">
                View public calendar
              </Link>
            </p>
            <TaniCalendarEditor />
          </div>
        </section>
      </main>
    </>
  );
}
