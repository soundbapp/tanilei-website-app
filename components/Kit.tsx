import Image from "next/image";
import Link from "next/link";

const kitFeatures = [
  "Personalized to your hair type, texture, and beauty goals — curated by Tani herself after your consultation.",
  "Premium products, not mass-market shelves. Every item selected because it belongs in your routine.",
  "Smart tracking via the Tani/Lei app — know when you're running low before you run out.",
  "Monthly delivery with seasonal refreshes as your needs evolve.",
];

export default function Kit() {
  return (
    <section id="kit" className="section-wrap kit bg-[var(--rose-pale)] px-5 py-14 md:px-12 md:py-[100px]">
      <div className="kit-inner mx-auto grid max-w-[1100px] grid-cols-1 gap-10 md:grid-cols-2 md:gap-20">
        <div className="kit-content">
          <p className="section-eyebrow mb-4 text-[0.52rem] uppercase tracking-[0.38em] text-[var(--rose-deep)] md:text-left">
            The Tani/Lei Kit
          </p>
          <h2 className="font-serif section-title mb-4 text-left text-[clamp(1.9rem,7.5vw,2.8rem)] font-light leading-tight text-[var(--dark)] md:text-left">
            Your Beauty,
            <br />
            <em className="text-[var(--rose-deep)]">Delivered Monthly</em>
          </h2>
          <div className="section-line mb-7 h-px w-[50px] bg-[var(--rose-gold)] md:mx-0" />
          <ul className="kit-features mb-11 list-none">
            {kitFeatures.map((text, i) => (
              <li
                key={i}
                className="flex gap-3 border-b border-[rgba(201,169,154,0.28)] py-4 text-[0.7rem] font-light leading-[1.8] text-[var(--text-light)] [&::before]:mt-1.5 [&::before]:shrink-0 [&::before]:content-['◆'] [&::before]:text-[var(--rose-gold)] [&::before]:text-[0.38rem]"
              >
                {text}
              </li>
            ))}
          </ul>
          <Link href="/appointments" className="btn-primary inline-flex min-h-12 items-center justify-center border border-[var(--dark)] bg-[var(--dark)] px-9 py-4 text-[0.58rem] uppercase tracking-[0.2em] text-white no-underline transition-all hover:bg-transparent hover:text-[var(--dark)]">
            Get Your Kit
          </Link>
        </div>
        <div className="kit-visual relative flex h-[260px] items-center justify-center md:h-[320px] lg:h-[480px]">
          <Image
            src="/images/kit_mockup.png"
            alt="Tani/Lei beauty kit"
            width={400}
            height={400}
            className="kit-img h-full w-full object-contain drop-shadow-[0_20px_50px_rgba(42,31,26,0.13)]"
          />
        </div>
      </div>
    </section>
  );
}
