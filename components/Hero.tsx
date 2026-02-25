import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="hero relative grid min-h-screen grid-cols-1 overflow-hidden md:grid-cols-2">
      <div className="hero-left relative z-[3] flex flex-col justify-end px-5 pb-20 pt-24 md:justify-center md:px-12 md:pb-20 md:pt-[100px] md:pt-24">
        <p className="hero-eyebrow mb-6 text-[0.58rem] uppercase tracking-[0.32em] text-[var(--rose-deep)] animate-fade-up" style={{ animationDelay: "0.3s" }}>
          Dallas, Texas · Est. 2024
        </p>
        <h1 className="font-script mb-4 line-height-[0.9] text-[var(--dark)] animate-fade-up text-[clamp(3.4rem,17vw,5rem)] md:text-[clamp(4.5rem,8vw,8rem)]" style={{ animationDelay: "0.5s" }}>
          Tani/Lei
        </h1>
        <p className="font-serif mb-8 text-[clamp(0.85rem,1.8vw,1.35rem)] font-light uppercase tracking-[0.38em] text-[var(--rose-deep)] animate-fade-up" style={{ animationDelay: "0.7s" }}>
          The Beauty Experience
        </p>
        <p className="mb-11 max-w-[380px] text-[0.78rem] font-light leading-[2] text-[var(--text-light)] animate-fade-up" style={{ animationDelay: "0.9s" }}>
          Where every visit is a ritual. Full-service luxury beauty — hair, nails, lashes, brows — curated for you by a celebrity-trained stylist who knows what extraordinary looks like.
        </p>
        <div className="flex flex-wrap items-center gap-5 animate-fade-up" style={{ animationDelay: "1.1s" }}>
          <Link href="#book" className="btn-primary inline-flex min-h-12 items-center justify-center whitespace-nowrap border border-[var(--dark)] bg-[var(--dark)] px-9 py-4 text-[0.58rem] uppercase tracking-[0.2em] text-white no-underline transition-all hover:bg-transparent hover:text-[var(--dark)]">
            Book Your Experience
          </Link>
          <Link href="#services" className="btn-ghost flex min-h-12 items-center gap-2 text-[0.58rem] uppercase tracking-[0.2em] text-[var(--text-light)] no-underline transition-colors hover:text-[var(--rose-deep)] [&::after]:content-['→'] [&::after]:text-base [&::after]:transition-transform hover:[&::after]:translate-x-1">
            Explore Services
          </Link>
        </div>
      </div>
      <div className="hero-right absolute inset-0 z-0 min-h-[100vh] overflow-hidden bg-[var(--cream)] md:relative md:min-h-0">
        <Image
          src="/images/hero_hair.png"
          alt="Luxury hair styling"
          fill
          className="object-cover object-[70%_50%]"
          style={{ objectPosition: "70% 50%" }}
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute inset-0 z-[1] pointer-events-none bg-gradient-to-r from-[var(--cream)] via-[rgba(250,246,243,0.5)] to-transparent" />
      </div>
    </section>
  );
}
