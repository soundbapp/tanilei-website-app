import Image from "next/image";
import Link from "next/link";

export default function About() {
  return (
    <section id="about">
      <div className="about-wrap mx-auto grid max-w-[1200px] grid-cols-1 gap-10 px-5 py-14 md:grid-cols-2 md:gap-20 md:px-12 md:py-[100px] lg:gap-20">
        {/* Container: position relative, fixed height, NO overflow hidden so card can overlap */}
        <div className="about-visual relative h-[340px] md:h-[400px] lg:h-[560px]">
          <Image
            src="/images/tani_headshot.png"
            alt="Tani Abdu"
            fill
            className="about-img left-0 top-0 z-[1] h-full w-[75%] rounded-sm object-cover object-[center_20%] shadow-[0_24px_60px_rgba(42,31,26,0.15)]"
            sizes="(max-width: 768px) 75vw, 50vw"
          />
          <div className="about-card absolute bottom-0 right-0 z-[2] w-[55%] border-l-4 border-[var(--rose-gold)] bg-[var(--dark)] p-5 md:p-7">
            <p className="about-card-label mb-2 text-[0.48rem] uppercase tracking-[0.32em] text-[var(--rose-gold)]">
              Lead Stylist & Founder
            </p>
            <p className="font-script about-card-name mb-1 text-2xl text-white md:text-[1.9rem]">
              Tani Abdu
            </p>
            <p className="about-card-title text-[0.48rem] uppercase tracking-[0.2em] text-[var(--rose-light)] opacity-65">
              Celebrity-Trained · Dallas, TX
            </p>
          </div>
        </div>
        <div className="about-content">
          <p className="section-eyebrow mb-4 text-[0.52rem] uppercase tracking-[0.38em] text-[var(--rose-deep)] md:text-left">
            The Artisan Behind the Brand
          </p>
          <h2 className="font-serif section-title mb-4 text-left text-[clamp(1.9rem,7.5vw,2.8rem)] font-light leading-tight text-[var(--dark)] md:text-left">
            Born from the <em className="text-[var(--rose-deep)]">Highest Levels</em>
          </h2>
          <div className="section-line mb-6 md:mb-7 md:mx-0" style={{ width: 50, height: 1, background: "var(--rose-gold)" }} />
          <p className="font-serif mb-5 text-base font-light italic leading-[2] text-[var(--text-light)] md:text-[1.1rem]">
            &ldquo;Beauty is not a service. It is an experience you carry with you long after you leave the chair.&rdquo;
          </p>
          <p className="mb-9 text-[0.72rem] font-light leading-[2] text-[var(--text-light)]">
            Tani Abdu built her craft alongside industry icons — including years as assistant to Aaron Grenier at IGK — before bringing that level of excellence to Dallas. With expertise across hair, nails, lashes, brows, and skin, she&apos;s not a stylist. She&apos;s your beauty partner.
          </p>
          <div className="cred-row mb-9 flex flex-wrap gap-6 md:gap-8">
            <div className="cred min-w-[75px] border-t border-[var(--rose-gold)] pt-3">
              <p className="font-serif cred-num mb-1 text-[1.8rem] font-light text-[var(--dark)]">IGK</p>
              <p className="cred-label text-[0.48rem] uppercase tracking-[0.15em] leading-[1.6] text-[var(--text-light)]">
                Trained Under
                <br />
                Aaron Grenier
              </p>
            </div>
            <div className="cred min-w-[75px] border-t border-[var(--rose-gold)] pt-3">
              <p className="font-serif cred-num mb-1 text-[1.8rem] font-light text-[var(--dark)]">10+</p>
              <p className="cred-label text-[0.48rem] uppercase tracking-[0.15em] leading-[1.6] text-[var(--text-light)]">
                Years of
                <br />
                Experience
              </p>
            </div>
            <div className="cred min-w-[75px] border-t border-[var(--rose-gold)] pt-3">
              <p className="font-serif cred-num mb-1 text-[1.8rem] font-light text-[var(--dark)]">5★</p>
              <p className="cred-label text-[0.48rem] uppercase tracking-[0.15em] leading-[1.6] text-[var(--text-light)]">
                Client
                <br />
                Retention
              </p>
            </div>
          </div>
          <Link href="#book" className="btn-primary inline-flex min-h-12 items-center justify-center border border-[var(--dark)] bg-[var(--dark)] px-9 py-4 text-[0.58rem] uppercase tracking-[0.2em] text-white no-underline transition-all hover:bg-transparent hover:text-[var(--dark)]">
            Meet Tani
          </Link>
        </div>
      </div>
    </section>
  );
}
