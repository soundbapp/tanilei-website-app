import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="flex flex-col items-center justify-between gap-1 bg-transparent px-5 py-2.5 text-center md:flex-row md:px-10 md:text-left">
      <p className="text-[0.7rem] font-normal tracking-normal text-[var(--text-light)]">
        © 2026 Tani/Lei · Dallas
      </p>
      <p className="text-[0.7rem] font-normal tracking-normal text-[var(--text-light)]">
        <a href="tel:2025108945" className="text-[var(--text)] no-underline">
          202-510-8945
        </a>
        {" · "}
        <a
          href="mailto:hello@tanilei.com"
          className="text-[var(--text)] no-underline"
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
