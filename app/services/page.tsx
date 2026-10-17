import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import ConsultationNotes from "@/components/ConsultationNotes";
import { SERVICE_MENU } from "@/lib/consultation";

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
          <p className="mb-3 text-[1.05rem] text-[var(--text)]">
            Services
          </p>
          <h1 className="font-serif mb-8 text-[clamp(1.8rem,4vw,2.8rem)] font-normal text-[var(--dark)]">
            The chair
          </h1>
          <ul className="list-none space-y-3">
            {SERVICE_MENU.map((item) => (
              <li
                key={item.name}
                className="flex items-baseline justify-between gap-4 border-b border-[rgba(201,169,154,0.35)] pb-3 text-[1.1rem] font-normal leading-snug text-[var(--text)]"
              >
                <span>{item.name}</span>
                <span className="w-[11.5rem] shrink-0 text-right text-[1.05rem] text-[var(--text)]">
                  {item.price}
                </span>
              </li>
            ))}
          </ul>
          <Link
            href="/appointments"
            className="mt-8 inline-flex min-h-12 items-center border border-[var(--dark)] bg-[var(--dark)] px-8 py-3 text-[1.1rem] text-white no-underline hover:bg-transparent hover:text-[var(--dark)]"
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
