import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import PreVisitForm from "@/components/PreVisitForm";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Pre-visit form — TaniLei",
  description: "Help us prepare for your TaniLei experience.",
  robots: { index: false, follow: false },
};

function PreVisitFallback() {
  return (
    <p className="text-center text-[1.25rem] text-[var(--text-light)]">Loading…</p>
  );
}

export default function PreVisitPage() {
  return (
    <>
      <SiteNav />
      <main>
        <section className="relative overflow-hidden px-5 pb-20 pt-28 md:px-12 md:pt-32">
          <div
            className="absolute inset-0 h-full opacity-[0.32]"
            style={{
              background: `linear-gradient(135deg, #e8d0cc 0%, #d4c4d4 20%, #c8b8d0 40%, #e0c8c0 60%, #d0bcc8 100%)`,
              backgroundSize: "400% 400%",
            }}
            aria-hidden
          />
          <div className="relative z-[1] mx-auto max-w-3xl text-center">
            <p className="mb-3 text-[1.05rem] text-[var(--text)]">
              Before you arrive
            </p>
            <h1 className="font-serif mb-4 text-[clamp(1.6rem,3.5vw,2.4rem)] font-normal leading-tight text-[var(--dark)]">
              Pre-visit <em className="text-[var(--text)]">form</em>
            </h1>
            <div className="section-line mx-auto h-px w-[50px] bg-[var(--rose-gold)]" />
            <p className="mx-auto mt-6 max-w-lg text-[1.25rem] font-normal leading-[1.8] text-[var(--text-light)]">
              Private link from your booking confirmation.{" "}
              <Link
                href="/"
                className="text-[var(--text)] no-underline hover:underline"
              >
                Home
              </Link>
            </p>
            <div className="mt-10 text-left">
              <Suspense fallback={<PreVisitFallback />}>
                <PreVisitForm />
              </Suspense>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
