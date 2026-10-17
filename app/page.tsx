import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Tani/Lei — Dallas hair",
  description:
    "Luxury hair consultations in Dallas. Book Tani for color, cut, wigs, and the look you want.",
};

export default function Home() {
  return (
    <div className="relative flex min-h-[100dvh] flex-col overflow-hidden bg-[var(--cream)]">
      <SiteNav />
      <main className="relative flex min-h-[100dvh] flex-1 flex-col pb-12 md:flex-row">
        <div className="relative z-[2] flex flex-1 flex-col justify-end px-6 pb-10 pt-24 md:justify-center md:px-12 md:pb-16 md:pt-20">
          <p className="mb-4 text-[0.85rem] uppercase tracking-[0.22em] text-[var(--rose-deep)]">
            Dallas · Hair
          </p>
          <h1 className="font-script mb-3 text-[clamp(3.4rem,14vw,6.5rem)] leading-[0.9] text-[var(--dark)]">
            Tani/Lei
          </h1>
          <p className="font-serif mb-8 max-w-md text-[clamp(1.2rem,2.4vw,1.65rem)] font-light italic leading-snug text-[var(--text)]">
            Consult. Color. The look you came for.
          </p>
          <Link
            href="/appointments"
            className="inline-flex min-h-12 w-fit items-center border border-[var(--dark)] bg-[var(--dark)] px-9 py-4 text-[0.85rem] uppercase tracking-[0.16em] text-white no-underline transition-all hover:bg-transparent hover:text-[var(--dark)]"
          >
            Book now
          </Link>
        </div>
        <div className="absolute inset-0 z-0 md:relative md:w-[52%] md:min-h-0">
          <Image
            src="/images/hero_hair.png"
            alt="Hair by Tani"
            fill
            className="object-cover object-[70%_40%]"
            priority
            sizes="(max-width: 768px) 100vw, 52vw"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[var(--cream)] via-[rgba(250,246,243,0.55)] to-transparent md:via-[rgba(250,246,243,0.2)]" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--cream)] md:hidden" />
        </div>
      </main>
      <div className="absolute inset-x-0 bottom-0 z-[3]">
        <SiteFooter />
      </div>
    </div>
  );
}
