import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import ConsultationNotes from "@/components/ConsultationNotes";
import { SERVICE_OPTIONS } from "@/lib/consultation";

export const metadata: Metadata = {
  title: "Services — Tani/Lei",
  description: "Hair, color, wigs, and consultations with Tani in Dallas.",
};

export default function ServicesPage() {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-[var(--cream)]">
      <SiteNav />
      <main className="flex flex-1 flex-col px-6 pb-10 pt-24 md:flex-row md:items-start md:gap-16 md:px-12 md:pt-28">
        <div className="md:w-[42%]">
          <p className="mb-3 text-[0.8rem] uppercase tracking-[0.22em] text-[var(--rose-deep)]">
            Services
          </p>
          <h1 className="font-serif mb-8 text-[clamp(1.8rem,4vw,2.8rem)] font-light text-[var(--dark)]">
            The chair
          </h1>
          <ul className="list-none space-y-3">
            {SERVICE_OPTIONS.filter((s) => s !== "Other").map((name) => (
              <li
                key={name}
                className="border-b border-[rgba(201,169,154,0.35)] pb-3 text-[1rem] uppercase tracking-[0.12em] text-[var(--text)]"
              >
                {name}
              </li>
            ))}
          </ul>
          <Link
            href="/appointments"
            className="mt-8 inline-flex min-h-12 items-center border border-[var(--dark)] bg-[var(--dark)] px-8 py-3 text-[0.85rem] uppercase tracking-[0.16em] text-white no-underline hover:bg-transparent hover:text-[var(--dark)]"
          >
            Book now
          </Link>
        </div>
        <div className="mt-12 max-w-md md:mt-10 md:w-[50%]">
          <ConsultationNotes />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
