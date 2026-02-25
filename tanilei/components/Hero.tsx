import Image from 'next/image'

export default function Hero() {
  return (
    <section style={s.hero}>
      {/* Left — content */}
      <div style={s.heroLeft}>
        <p style={s.eyebrow}>Dallas, Texas · Est. 2024</p>
        <h1 style={s.script}>Tani/Lei</h1>
        <p style={s.serif}>The Beauty Experience</p>
        <p style={s.desc}>
          Where every visit is a ritual. Full-service luxury beauty — hair, nails, lashes, brows —
          curated for you by a celebrity-trained stylist who knows what extraordinary looks like.
        </p>
        <div style={s.actions}>
          <a href="#book" className="btn-primary">Book Your Experience</a>
          <a href="#services" className="btn-ghost">Explore Services</a>
        </div>
      </div>

      {/* Right — image */}
      <div style={s.heroRight}>
        <Image
          src="/images/hero_hair.png"
          alt="Luxury hair styling"
          fill
          style={{ objectFit: 'cover', objectPosition: 'center top', zIndex: 0 }}
          priority
        />
        <div style={s.overlay} />
        <div className="holo" style={s.badge}>
          <span style={s.badgeScript}>Tani</span>
          <span style={s.badgeText}>Celebrity<br />Trained</span>
        </div>
      </div>

      <style>{`
        .hero-section { min-height: 100vh; display: grid; grid-template-columns: 1fr 1fr; }
        @keyframes fade-up { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fade-in  { from { opacity: 0; } to { opacity: 1; } }
        .hero-eyebrow { animation: fade-up 1s 0.3s both; }
        .hero-script  { animation: fade-up 1s 0.5s both; }
        .hero-serif   { animation: fade-up 1s 0.7s both; }
        .hero-desc    { animation: fade-up 1s 0.9s both; }
        .hero-actions { animation: fade-up 1s 1.1s both; }
        .hero-badge   { animation: fade-in 1s 1.4s both; }
        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .hero-left-col { padding: 96px 24px 80px !important; justify-content: flex-end !important; min-height: 100svh; z-index: 3; }
          .hero-right-col { position: absolute !important; inset: 0 !important; z-index: 0 !important; }
          .hero-overlay-col { background: linear-gradient(to top, var(--cream) 35%, rgba(250,246,243,0.6) 60%, transparent 100%) !important; }
          .hero-badge-col { display: none !important; }
        }
        @media (max-width: 600px) {
          .hero-left-col { padding: 88px 20px 80px !important; }
          .hero-actions-col { flex-direction: column !important; align-items: stretch !important; }
        }
      `}</style>
    </section>
  )
}

const s: Record<string, React.CSSProperties> = {
  hero: {
    minHeight: '100vh',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    position: 'relative',
    overflow: 'hidden',
  },
  heroLeft: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '100px 60px 80px',
    position: 'relative',
    zIndex: 3,
  },
  eyebrow: {
    fontSize: '0.58rem',
    letterSpacing: '0.32em',
    textTransform: 'uppercase',
    color: 'var(--rose-deep)',
    marginBottom: '24px',
    animation: 'fade-up 1s 0.3s both',
  },
  script: {
    fontFamily: "'Great Vibes', cursive",
    fontSize: 'clamp(4.5rem, 8vw, 8rem)',
    lineHeight: '0.9',
    color: 'var(--dark)',
    marginBottom: '18px',
    animation: 'fade-up 1s 0.5s both',
  },
  serif: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 'clamp(0.85rem, 1.8vw, 1.35rem)',
    fontWeight: 300,
    letterSpacing: '0.38em',
    textTransform: 'uppercase',
    color: 'var(--rose-deep)',
    marginBottom: '32px',
    animation: 'fade-up 1s 0.7s both',
  },
  desc: {
    fontSize: '0.78rem',
    fontWeight: 300,
    lineHeight: '2',
    color: 'var(--text-light)',
    maxWidth: '380px',
    marginBottom: '44px',
    animation: 'fade-up 1s 0.9s both',
  },
  actions: {
    display: 'flex',
    gap: '20px',
    alignItems: 'center',
    flexWrap: 'wrap',
    animation: 'fade-up 1s 1.1s both',
  },
  heroRight: {
    position: 'relative',
    overflow: 'hidden',
  },
  overlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to right, var(--cream) 0%, rgba(250,246,243,0.5) 50%, transparent 100%)',
    zIndex: 1,
    pointerEvents: 'none',
  },
  badge: {
    position: 'absolute',
    top: '120px',
    right: '36px',
    zIndex: 2,
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    border: '1px solid rgba(201,169,154,0.6)',
    animation: 'fade-in 1s 1.4s both',
  },
  badgeScript: {
    fontFamily: "'Great Vibes', cursive",
    fontSize: '1rem',
    color: 'var(--rose-deep)',
  },
  badgeText: {
    fontSize: '0.42rem',
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color: 'var(--text-light)',
    lineHeight: '1.8',
  },
}
