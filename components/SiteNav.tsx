"use client";

import { useState } from "react";
import Link from "next/link";

const links = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/appointments", label: "Book" },
];

export default function SiteNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="absolute left-0 right-0 top-0 z-[200] flex h-[68px] items-center justify-between border-b border-[rgba(201,169,154,0.35)] bg-[rgba(250,246,243,0.94)] px-6 backdrop-blur-[14px] md:px-10">
      <Link
        href="/"
        className="font-script text-[1.65rem] text-[var(--dark)] no-underline"
        onClick={() => setOpen(false)}
      >
        Tani/Lei
      </Link>
      <nav className="hidden items-center gap-8 md:flex">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={
              l.href === "/appointments"
                ? "border border-[var(--dark)] bg-[var(--dark)] px-4 py-2 text-[0.58rem] uppercase tracking-[0.22em] text-white no-underline transition-colors hover:bg-[var(--rose-deep)] hover:border-[var(--rose-deep)]"
                : "text-[0.58rem] uppercase tracking-[0.22em] text-[var(--dark)] no-underline transition-colors hover:text-[var(--rose-deep)]"
            }
          >
            {l.label}
          </Link>
        ))}
      </nav>
      <button
        type="button"
        className="flex flex-col gap-1.5 border-none bg-transparent p-2 md:hidden"
        aria-label="Menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="block h-[1.5px] w-[22px] bg-[var(--dark)]" />
        <span className="block h-[1.5px] w-[22px] bg-[var(--dark)]" />
        <span className="block h-[1.5px] w-[22px] bg-[var(--dark)]" />
      </button>
      {open && (
        <div className="absolute inset-x-0 top-[68px] flex flex-col bg-[var(--cream)] md:hidden">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="border-b border-[rgba(201,169,154,0.2)] py-4 text-center text-[0.62rem] uppercase tracking-[0.24em] text-[var(--text-light)] no-underline"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
