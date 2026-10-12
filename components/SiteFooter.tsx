import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="flex flex-col items-center justify-between gap-1.5 bg-transparent px-5 py-4 text-center md:flex-row md:px-10 md:text-left">
      <p className="text-[0.42rem] uppercase tracking-[0.16em] text-[var(--text-light)]">
        © 2026 Tani/Lei · Dallas
      </p>
      <p className="text-[0.42rem] uppercase tracking-[0.16em] text-[var(--text-light)]">
        <a href="tel:2025108945" className="text-[var(--rose-deep)] no-underline">
          202-510-8945
        </a>
        {" · "}
        <a
          href="mailto:hello@tanilei.com"
          className="text-[var(--rose-deep)] no-underline"
        >
          hello@tanilei.com
        </a>
        {" · "}
        <Link href="/classic" className="text-[var(--text-light)] no-underline">
          Full site
        </Link>
      </p>
    </footer>
  );
}
