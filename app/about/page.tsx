import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "About — Tani/Lei",
  description: "Tani Abdu, celebrity-trained stylist in Dallas.",
};

export default function AboutPage() {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-[var(--cream)]">
      <SiteNav />
      <main className="flex flex-1 flex-col px-6 pb-10 pt-24 md:flex-row md:items-center md:gap-16 md:px-12 md:pt-28">
        <div className="relative mx-auto mb-10 h-[280px] w-full max-w-sm md:mb-0 md:h-[420px] md:w-[42%] md:max-w-none">
          <Image
            src="/images/tani_headshot.png"
            alt="Tani Abdu"
            fill
            className="object-cover object-[center_20%]"
            sizes="(max-width: 768px) 90vw, 42vw"
          />
        </div>
        <div className="mx-auto max-w-lg md:mx-0">
          <p className="mb-3 text-[1.05rem] text-[var(--text)]">
            About
          </p>
          <h1 className="font-serif mb-4 text-[clamp(1.8rem,4vw,2.8rem)] font-normal text-[var(--dark)]">
            Tani Abdu
          </h1>
          <p className="font-serif mb-4 text-[1.45rem] font-normal italic leading-[1.8] text-[var(--text)]">
            Celebrity-trained. Dallas chair.
          </p>
          <p className="text-[1.1rem] font-normal leading-[1.85] text-[var(--text)]">
            Tani built her craft alongside industry icons — including years as
            assistant to Aaron Grenia at IGK — then brought that standard here.
            Hair, color, wigs, and the consultation that makes the visit yours.
          </p>
          <Link
            href="/appointments"
            className="mt-8 inline-flex min-h-12 items-center border border-[var(--dark)] bg-[var(--dark)] px-8 py-3 text-[1.1rem] text-white no-underline hover:bg-transparent hover:text-[var(--dark)]"
          >
            Book a consultation
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
