import Image from 'next/image'

export default function About() {
  return (
    <section id="about">
      <div style={s.wrap}>

        {/* Visual — photo upper-left, card bottom-right overlapping */}
        <div style={s.visual}>
          <Image
            src="/images/tani_headshot.png"
            alt="Tani Abdu"
            style={s.photo}
            width={600}
            height={520}
          />
          <div style={s.card}>
            <p style={s.cardLabel}>Lead Stylist & Founder</p>
            <p style={s.cardName}>Tani Abdu</p>
            <p style={s.cardTitle}>Celebrity-Trained · Dallas, TX</p>
          </div>
        </div>

        {/* Content */}
        <div style={s.content}>
          <p className="section-eyebrow" style={{ textAlign: 'left' }}>The Artisan Behind the Brand</p>
          <h2 className="section-title" style={{ textAlign: 'left' }}>
            Born from the <em>Highest Levels</em>
          </h2>
          <div className="section-line" style={{ margin: '0 0 28px' }} />
          <p style={s.quote}>
            "Beauty is not a service. It is an experience you carry with you long after you leave the chair."
          </p>
          <p style={s.body}>
            Tani Abdu built her craft alongside industry icons — including years as assistant to Aaron Grenia
            at IGK — before bringing that level of excellence to Dallas. With expertise across hair, nails,
            lashes, brows, and skin, she's not a stylist. She's your beauty partner.
          </p>
          <div style={s.credRow}>
            {[
              { num: 'IGK',  label: 'Trained Under\nAaron Grenia' },
              { num: '10+',  label: 'Years of\nExperience' },
              { num: '5★',   label: 'Client\nRetention' },
            ].map(c => (
              <div key={c.num} style={s.cred}>
                <p style={s.credNum}>{c.num}</p>
                <p style={s.credLabel}>{c.label}</p>
              </div>
            ))}
          </div>
          <a href="#book" className="btn-primary">Meet Tani</a>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .about-wrap  { grid-template-columns: 1fr !important; gap: 40px !important; padding: 72px 24px !important; }
          .about-visual { height: 420px !important; }
          .about-photo  { width: 82% !important; }
          .about-content .section-eyebrow,
          .about-content .section-title { text-align: center !important; }
          .about-content .section-line  { margin: 0 auto 24px !important; }
          .about-cred-row { justify-content: center !important; }
        }
        @media (max-width: 600px) {
          .about-visual { height: 340px !important; }
          .about-card   { width: 70% !important; }
        }
      `}</style>
    </section>
  )
}

const s: Record<string, React.CSSProperties> = {
  wrap: {
    padding: '100px 60px',
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '80px',
    alignItems: 'center',
  },
  visual: {
    position: 'relative',
    height: '560px',
  },
  photo: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '78%',
    height: '80%',
    objectFit: 'cover',
    objectPosition: 'center 12%',
    borderRadius: '2px',
    boxShadow: '0 20px 50px rgba(42,31,26,0.13)',
    zIndex: 1,
  },
  card: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: '55%',
    background: 'var(--dark)',
    padding: '26px 30px',
    zIndex: 2,
    borderLeft: '3px solid var(--rose-gold)',
  },
  cardLabel: {
    fontSize: '0.48rem',
    letterSpacing: '0.32em',
    textTransform: 'uppercase',
    color: 'var(--rose-gold)',
    marginBottom: '8px',
  },
  cardName: {
    fontFamily: "'Great Vibes', cursive",
    fontSize: '1.9rem',
    color: 'white',
    marginBottom: '4px',
  },
  cardTitle: {
    fontSize: '0.48rem',
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color: 'var(--rose-light)',
    opacity: 0.65,
  },
  content: {},
  quote: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: '1.1rem',
    fontWeight: 300,
    fontStyle: 'italic',
    lineHeight: '2',
    color: 'var(--text-light)',
    marginBottom: '20px',
  },
  body: {
    fontSize: '0.72rem',
    fontWeight: 300,
    lineHeight: '2',
    color: 'var(--text-light)',
    marginBottom: '36px',
  },
  credRow: {
    display: 'flex',
    gap: '32px',
    marginBottom: '36px',
    flexWrap: 'wrap',
  },
  cred: {
    borderTop: '1px solid var(--rose-gold)',
    paddingTop: '14px',
    minWidth: '75px',
  },
  credNum: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: '1.8rem',
    fontWeight: 300,
    color: 'var(--dark)',
    marginBottom: '4px',
  },
  credLabel: {
    fontSize: '0.48rem',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: 'var(--text-light)',
    lineHeight: '1.6',
    whiteSpace: 'pre-line',
  },
}
