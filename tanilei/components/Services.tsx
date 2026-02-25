const services = [
  { num: '01', icon: '✦', name: 'Hair Styling & Treatment', desc: 'Celebrity-level cuts, color, and styling — plus transformative rejuvenation treatments that restore health and luminosity to every strand.' },
  { num: '02', icon: '◈', name: 'Nails', desc: 'Precision nail artistry — from classic manicures and pedicures to sculptural nail art that becomes your signature.' },
  { num: '03', icon: '◇', name: 'Lash Extensions', desc: 'Volume, lift, and drama — expertly applied lashes that frame your eyes and let you wake up ready.' },
  { num: '04', icon: '⊹', name: 'Brow Design', desc: 'Architectural precision. Your brows shaped and defined to complement your unique bone structure and aesthetic.' },
  { num: '05', icon: '◉', name: 'Virtual Consultations', desc: "Can't come in? Tani meets you where you are. Book a private virtual session for personalized guidance and your curated care plan." },
  { num: '06', icon: '✧', name: 'Curated Beauty Kits', desc: 'Your personalized product ritual, delivered. Tani selects everything based on your beauty profile — right to your door, monthly.' },
]

// Cards 2 and 5 (index 1, 4) use dark background
const darkCards = [1, 4]

export default function Services() {
  return (
    <section className="section-wrap" id="services" style={{ background: 'var(--cream)' }}>
      <div className="section-header">
        <p className="section-eyebrow">What We Offer</p>
        <h2 className="section-title">Beauty, <em>Fully Realized</em></h2>
        <div className="section-line" />
      </div>

      <div style={s.grid}>
        {services.map((svc, i) => (
          <div
            key={svc.num}
            style={{
              ...s.card,
              background: darkCards.includes(i) ? 'var(--dark)' : 'var(--rose-pale)',
            }}
            className="service-card"
          >
            <div className="svc-holo holo" style={s.holoOverlay} />
            <p style={{ ...s.num, color: darkCards.includes(i) ? 'rgba(201,169,154,0.5)' : 'var(--rose-gold)' }}>{svc.num}</p>
            <div style={s.icon}>{svc.icon}</div>
            <h3 style={{ ...s.name, color: darkCards.includes(i) ? 'var(--rose-light)' : 'var(--dark)' }}>{svc.name}</h3>
            <p style={{ ...s.desc, color: darkCards.includes(i) ? 'rgba(232,213,204,0.65)' : 'var(--text-light)' }}>{svc.desc}</p>
          </div>
        ))}
      </div>

      <style>{`
        .service-card { position: relative; overflow: hidden; transition: transform 0.4s; cursor: default; }
        .service-card:hover { transform: translateY(-4px); }
        .service-card:hover .svc-holo { opacity: 0.15 !important; }
        .svc-holo { position: absolute; inset: 0; height: 100%; opacity: 0; transition: opacity 0.4s; }
        @media (max-width: 900px) { .services-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 600px) { .services-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  )
}

const s: Record<string, React.CSSProperties> = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '2px',
    maxWidth: '1100px',
    margin: '0 auto',
  },
  card: {
    padding: '52px 34px',
  },
  holoOverlay: {
    position: 'absolute',
    inset: 0,
    height: '100%',
    opacity: 0,
    transition: 'opacity 0.4s',
  },
  num: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: '0.68rem',
    letterSpacing: '0.2em',
    marginBottom: '26px',
    position: 'relative',
    zIndex: 1,
  },
  icon: {
    fontSize: '1.5rem',
    marginBottom: '16px',
    position: 'relative',
    zIndex: 1,
  },
  name: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: '1.45rem',
    fontWeight: 400,
    marginBottom: '12px',
    lineHeight: '1.2',
    position: 'relative',
    zIndex: 1,
  },
  desc: {
    fontSize: '0.68rem',
    fontWeight: 300,
    lineHeight: '1.9',
    position: 'relative',
    zIndex: 1,
  },
}
