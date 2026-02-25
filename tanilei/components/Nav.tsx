'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [showSticky, setShowSticky] = useState(true)

  const closeMenu = () => {
    setMenuOpen(false)
    document.body.style.overflow = ''
  }

  const toggleMenu = () => {
    const next = !menuOpen
    setMenuOpen(next)
    document.body.style.overflow = next ? 'hidden' : ''
  }

  useEffect(() => {
    const bookSection = document.getElementById('book')
    if (!bookSection) return
    const observer = new IntersectionObserver(
      ([entry]) => setShowSticky(!entry.isIntersecting),
      { threshold: 0.2 }
    )
    observer.observe(bookSection)
    return () => observer.disconnect()
  }, [])

  const links = [
    { href: '#services', label: 'Services' },
    { href: '#about',    label: 'About' },
    { href: '#experience', label: 'Experience' },
    { href: '#app',      label: 'The App' },
  ]

  return (
    <>
      <nav style={styles.nav}>
        <Link href="#" style={styles.logo}>Tani/Lei</Link>

        {/* Desktop links */}
        <ul style={styles.navLinks}>
          {links.map(l => (
            <li key={l.href}>
              <a href={l.href} style={styles.navLink}>{l.label}</a>
            </li>
          ))}
          <li>
            <a href="#book" style={styles.navCta}>Book Now</a>
          </li>
        </ul>

        {/* Hamburger */}
        <button
          className={`hamburger${menuOpen ? ' open' : ''}`}
          onClick={toggleMenu}
          aria-label="Menu"
          style={styles.hamburger}
        >
          <span style={styles.bar} />
          <span style={styles.bar} />
          <span style={styles.bar} />
        </button>
      </nav>

      {/* Mobile full-screen menu */}
      <div className={`mobile-menu${menuOpen ? ' open' : ''}`}>
        {links.map(l => (
          <a key={l.href} href={l.href} className="mobile-link" onClick={closeMenu}>
            {l.label}
          </a>
        ))}
        <a href="#book" className="mobile-menu-cta" onClick={closeMenu}>
          Book My Experience
        </a>
      </div>

      {/* Mobile sticky CTA */}
      <div
        className="mobile-sticky-cta"
        style={{ opacity: showSticky ? 1 : 0, pointerEvents: showSticky ? 'auto' : 'none' }}
      >
        <a href="#book">✦ &nbsp; Book Your Experience</a>
      </div>

      <style>{`
        nav { position: fixed; top: 0; left: 0; right: 0; z-index: 200; padding: 0 48px; height: 68px; display: flex; justify-content: space-between; align-items: center; background: rgba(250,246,243,0.93); backdrop-filter: blur(14px); border-bottom: 1px solid rgba(201,169,154,0.2); }
        .nav-links-desktop { display: flex; gap: 36px; list-style: none; align-items: center; }
        .nav-link-item { font-size: 0.58rem; letter-spacing: 0.22em; text-transform: uppercase; color: var(--text-light); text-decoration: none; transition: color 0.3s; }
        .nav-link-item:hover { color: var(--rose-deep); }
        .nav-cta-item { border: 1px solid var(--rose-gold); padding: 9px 22px; color: var(--dark); transition: all 0.3s; font-size: 0.58rem; letter-spacing: 0.22em; text-transform: uppercase; text-decoration: none; }
        .nav-cta-item:hover { background: var(--rose-gold); color: white; }
        .hamburger { display: none; flex-direction: column; gap: 5px; cursor: pointer; padding: 8px; background: none; border: none; z-index: 201; }
        .hamburger span { display: block; width: 22px; height: 1.5px; background: var(--dark); transition: all 0.3s; transform-origin: center; }
        .hamburger.open span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
        .hamburger.open span:nth-child(2) { opacity: 0; }
        .hamburger.open span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }
        .mobile-menu { display: none; position: fixed; inset: 0; background: var(--cream); z-index: 199; flex-direction: column; align-items: center; justify-content: center; }
        .mobile-menu.open { display: flex; }
        .mobile-menu a { font-size: 0.7rem; letter-spacing: 0.3em; text-transform: uppercase; color: var(--text-light); text-decoration: none; padding: 20px 0; width: 100%; text-align: center; border-bottom: 1px solid rgba(201,169,154,0.15); transition: color 0.3s; }
        .mobile-menu a:hover { color: var(--rose-deep); }
        .mobile-menu-cta { margin-top: 32px; background: var(--dark); color: white !important; padding: 16px 48px !important; border: none !important; width: auto !important; }
        .mobile-sticky-cta { display: none; position: fixed; bottom: 0; left: 0; right: 0; z-index: 150; background: var(--dark); transition: opacity 0.3s; }
        .mobile-sticky-cta a { display: block; width: 100%; text-align: center; font-size: 0.62rem; letter-spacing: 0.22em; text-transform: uppercase; color: white; text-decoration: none; padding: 18px; }
        @media (max-width: 900px) {
          nav { padding: 0 20px; }
          .nav-links-desktop { display: none; }
          .hamburger { display: flex; }
          .mobile-sticky-cta { display: block; }
        }
      `}</style>
    </>
  )
}

const styles: Record<string, React.CSSProperties> = {
  nav: {},
  logo: {
    fontFamily: "'Great Vibes', cursive",
    fontSize: '2rem',
    color: 'var(--dark)',
    textDecoration: 'none',
    zIndex: 201,
    position: 'relative',
  },
  navLinks: {
    display: 'flex',
    gap: '36px',
    listStyle: 'none',
    alignItems: 'center',
  },
  navLink: {
    fontSize: '0.58rem',
    letterSpacing: '0.22em',
    textTransform: 'uppercase',
    color: 'var(--text-light)',
    textDecoration: 'none',
  },
  navCta: {
    border: '1px solid var(--rose-gold)',
    padding: '9px 22px',
    color: 'var(--dark)',
    fontSize: '0.58rem',
    letterSpacing: '0.22em',
    textTransform: 'uppercase',
    textDecoration: 'none',
  },
  hamburger: {
    display: 'none',
    flexDirection: 'column',
    gap: '5px',
    cursor: 'pointer',
    padding: '8px',
    background: 'none',
    border: 'none',
    zIndex: 201,
  },
  bar: {
    display: 'block',
    width: '22px',
    height: '1.5px',
    background: 'var(--dark)',
  },
}
