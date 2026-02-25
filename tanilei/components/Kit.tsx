import Image from 'next/image'

const features = [
  'Personalized to your hair type, texture, and beauty goals — curated by Tani herself after your consultation.',
  'Premium products, not mass-market shelves. Every item selected because it belongs in your routine.',
  'Smart tracking via the Tani/Lei app — know when you\'re running low before you run out.',
  'Monthly delivery with seasonal refreshes as your needs evolve.',
]

export default function Kit() {
  return (
    <section className="section-wrap" id="kit" style={{ background: 'var(--rose-pale)' }}>
      <div style={s.inner}>
        <div style={s.content}>
          <p className="section-eyebrow" style={{ textAlign: 'left' }}>The Tani/Lei Kit</p>
          <h2 className="section-title" style={{ textAlign: 'left' }}>
            Your Beauty,<br /><em>Delivered Monthly</em>
          </h2>
          <div className="section-line" style={{ margin: '0 0 28px' }} />
          <ul style={s.list}>
            {features.map((f, i) => (
              <li key={i} style={s.listItem}>
                <span style={s.bullet}>◆</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
          <a href="#book" className="btn-primary">Get Your Kit</a>
        </div>

        <div style={s.visual}>
          <Image
            src="/images/kit_mockup.png"
            alt="Tani/Lei Beauty Kit"
            width={600}
            height={480}
            style={s.kitImg}
          />
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .kit-inner { grid-template-columns: 1fr !important; gap: 40px !important; }
          .kit-content .section-eyebrow,
          .kit-content .section-title { text-align: center !important; }
          .kit-content .section-line  { margin: 0 auto 28px !important; }
          .kit-visual { height: 300px !important; }
        }
      `}</style>
    </section>
  )
}

const s: Record<string, React.CSSProperties> = {
  inner: {
    maxWidth: '1100px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '80px',
    alignItems: 'center',
  },
  content: {},
  list: {
    listStyle: 'none',
    marginBottom: '44px',
  },
  listItem: {
    display: 'flex',
    gap: '14px',
    alignItems: 'flex-start',
    padding: '15px 0',
    borderBottom: '1px solid rgba(201,169,154,0.28)',
    fontSize: '0.7rem',
    fontWeight: 300,
    lineHeight: '1.8',
    color: 'var(--text-light)',
  },
  bullet: {
    color: 'var(--rose-gold)',
    fontSize: '0.38rem',
    marginTop: '6px',
    flexShrink: 0,
  },
  visual: {
    position: 'relative',
    height: '480px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  kitImg: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    filter: 'drop-shadow(0 20px 50px rgba(42,31,26,0.13))',
  },
}
