import Link from "next/link";

export default function Footer() {
  return (
    <>
      <footer className="grid grid-cols-1 gap-8 bg-[var(--dark)] px-5 py-12 md:grid-cols-2 md:px-12 md:py-12 lg:grid-cols-3 lg:gap-10 lg:py-[60px] lg:px-[60px]">
      <div className="footer-brand">
        <span className="font-script footer-logo mb-3 block text-2xl text-white md:text-[2.2rem]">
          Tani/Lei
        </span>
        <p className="text-[1.15rem] leading-[2.1] tracking-[0.12em] text-white">
          The Beauty Experience
          <br />
          Dallas, Texas
          <br />
          <br />
          Celebrity-trained luxury beauty
          <br />
          for the woman who deserves extraordinary.
        </p>
      </div>
      <div>
        <p className="footer-col-title mb-5 text-[1.05rem] uppercase tracking-[0.14em] text-[var(--rose-gold)]">
          Services
        </p>
        <ul className="footer-links flex flex-col gap-2.5 list-none">
          <li><Link href="#" className="text-[1.15rem] font-normal text-white no-underline transition-colors hover:text-[var(--rose-light)]">Hair Styling & Treatment</Link></li>
          <li><Link href="#" className="text-[1.15rem] font-normal text-white no-underline transition-colors hover:text-[var(--rose-light)]">Nails</Link></li>
          <li><Link href="#" className="text-[1.15rem] font-normal text-white no-underline transition-colors hover:text-[var(--rose-light)]">Lash Extensions</Link></li>
          <li><Link href="#" className="text-[1.15rem] font-normal text-white no-underline transition-colors hover:text-[var(--rose-light)]">Brow Design</Link></li>
          <li><Link href="#" className="text-[1.15rem] font-normal text-white no-underline transition-colors hover:text-[var(--rose-light)]">Virtual Consultations</Link></li>
          <li><Link href="#" className="text-[1.15rem] font-normal text-white no-underline transition-colors hover:text-[var(--rose-light)]">Beauty Kits</Link></li>
        </ul>
      </div>
      <div className="footer-contact">
        <p className="footer-col-title mb-5 text-[1.05rem] uppercase tracking-[0.14em] text-[var(--rose-gold)]">
          Connect
        </p>
        <p className="text-[1.15rem] font-normal leading-[2.2] text-white">
          <a href="https://tanilei.com" className="text-white no-underline">tanilei.com</a>
          <br />
          <a href="mailto:hello@tanilei.com" className="text-white no-underline">hello@tanilei.com</a>
          <br />
          202-510-8945
          <br />
          Dallas, TX
        </p>
      </div>
      </footer>
      <div className="footer-bottom flex flex-col items-center justify-between gap-1.5 bg-[#1a100d] px-5 py-4 md:flex-row md:px-12 md:py-[18px]">
        <p className="text-[1rem] uppercase tracking-[0.15em] text-white">
          © 2026 Tani/Lei · All Rights Reserved
        </p>
        <p className="text-[1rem] uppercase tracking-[0.15em] text-white">
          Dallas, TX ·{" "}
          <Link href="/tani" className="text-white no-underline hover:underline">
            Staff
          </Link>
        </p>
      </div>
    </>
  );
}
