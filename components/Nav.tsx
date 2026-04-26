"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

export default function Nav() {
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const stickyCTARef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const hamburger = hamburgerRef.current;
    const mobileMenu = mobileMenuRef.current;
    if (!hamburger || !mobileMenu) return;

    const onHamburgerClick = () => {
      hamburger.classList.toggle("open");
      mobileMenu.classList.toggle("open");
      document.body.style.overflow = mobileMenu.classList.contains("open")
        ? "hidden"
        : "";
    };

    hamburger.addEventListener("click", onHamburgerClick);

    const closeMenu = () => {
      hamburger.classList.remove("open");
      mobileMenu.classList.remove("open");
      document.body.style.overflow = "";
    };

    const links = document.querySelectorAll(".mobile-link, .mobile-menu-cta");
    links.forEach((el) => el.addEventListener("click", closeMenu));

    return () => {
      hamburger.removeEventListener("click", onHamburgerClick);
      links.forEach((el) => el.removeEventListener("click", closeMenu));
    };
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const stickyCTA = stickyCTARef.current;
    const bookSection = document.getElementById("book");
    if (!bookSection || !stickyCTA) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          stickyCTA.style.opacity = e.isIntersecting ? "0" : "1";
          stickyCTA.style.pointerEvents = e.isIntersecting ? "none" : "auto";
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(bookSection);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <nav className="fixed left-0 right-0 top-0 z-[200] flex h-[68px] items-center justify-between border-b border-[rgba(201,169,154,0.2)] bg-[rgba(250,246,243,0.93)] px-6 py-0 backdrop-blur-[14px] md:px-12">
        <Link href="/" className="font-script text-2xl text-[var(--dark)] no-underline">
          Tani/Lei
        </Link>
        <ul className="hidden list-none items-center gap-9 md:flex">
          <li>
            <Link href="/#services" className="text-[0.58rem] uppercase tracking-[0.22em] text-[var(--text-light)] no-underline transition-colors hover:text-[var(--rose-deep)]">
              Services
            </Link>
          </li>
          <li>
            <Link href="/#about" className="text-[0.58rem] uppercase tracking-[0.22em] text-[var(--text-light)] no-underline transition-colors hover:text-[var(--rose-deep)]">
              About
            </Link>
          </li>
          <li>
            <Link href="/#experience" className="text-[0.58rem] uppercase tracking-[0.22em] text-[var(--text-light)] no-underline transition-colors hover:text-[var(--rose-deep)]">
              Experience
            </Link>
          </li>
          <li>
            <Link href="/#app" className="text-[0.58rem] uppercase tracking-[0.22em] text-[var(--text-light)] no-underline transition-colors hover:text-[var(--rose-deep)]">
              The App
            </Link>
          </li>
          <li>
            <Link href="/appointments" className="border border-[var(--rose-gold)] px-5 py-2 text-[0.58rem] uppercase tracking-[0.22em] text-[var(--dark)] no-underline transition-all hover:bg-[var(--rose-gold)] hover:text-white">
              Book Now
            </Link>
          </li>
        </ul>
        <button
          ref={hamburgerRef}
          type="button"
          className="z-[201] flex flex-col gap-1.5 border-none bg-transparent p-2 md:hidden"
          aria-label="Menu"
        >
          <span className="block h-[1.5px] w-[22px] bg-[var(--dark)] transition-all [transform-origin:center]" />
          <span className="block h-[1.5px] w-[22px] bg-[var(--dark)] transition-all [transform-origin:center]" />
          <span className="block h-[1.5px] w-[22px] bg-[var(--dark)] transition-all [transform-origin:center]" />
        </button>
      </nav>

      <div
        ref={mobileMenuRef}
        className="mobile-menu fixed inset-0 z-[199] flex flex-col items-center justify-center bg-[var(--cream)]"
      >
        <Link href="/#services" className="mobile-link w-full border-b border-[rgba(201,169,154,0.15)] py-5 text-center text-[0.7rem] uppercase tracking-[0.3em] text-[var(--text-light)] no-underline">
          Services
        </Link>
        <Link href="/#about" className="mobile-link w-full border-b border-[rgba(201,169,154,0.15)] py-5 text-center text-[0.7rem] uppercase tracking-[0.3em] text-[var(--text-light)] no-underline">
          About
        </Link>
        <Link href="/#experience" className="mobile-link w-full border-b border-[rgba(201,169,154,0.15)] py-5 text-center text-[0.7rem] uppercase tracking-[0.3em] text-[var(--text-light)] no-underline">
          Experience
        </Link>
        <Link href="/#app" className="mobile-link w-full border-b border-[rgba(201,169,154,0.15)] py-5 text-center text-[0.7rem] uppercase tracking-[0.3em] text-[var(--text-light)] no-underline">
          The App
        </Link>
        <Link href="/appointments" className="mobile-menu-cta mt-8 bg-[var(--dark)] px-12 py-4 text-white no-underline">
          Book My Experience
        </Link>
      </div>

      <div
        ref={stickyCTARef}
        className="mobile-sticky-cta fixed bottom-0 left-0 right-0 z-[150] bg-[var(--dark)] transition-opacity"
      >
        <Link
          href="/appointments"
          className="block w-full py-[18px] text-center text-[0.62rem] uppercase tracking-[0.22em] text-white no-underline"
        >
          Book My Experience
        </Link>
      </div>
    </>
  );
}
