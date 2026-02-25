const steps = [
  { num: '01', name: 'Welcome & Consult',     desc: "Arrive to a calm, curated space. Tani's team reviews your profile and maps your visit — no guessing, no generic solutions." },
  { num: '02', name: 'Hair Treatment',         desc: "Rejuvenation, styling, color — whatever your hair needs, executed at the standard Tani learned in the industry's top rooms." },
  { num: '03', name: 'Nails, Lashes & Brows', desc: 'While you relax, specialists complete your nails, perfect your lashes, and sculpt your brows. All in one session.' },
  { num: '04', name: 'The Reveal',             desc: "You leave whole. Not just done — genuinely transformed. And you'll already be looking forward to coming back." },
]

export default function Experience() {
  return (
    <section id="experience" style={s.section}>
      {/* Background holo accent */}
      <div className="holo" style={s.holoBg} />

      <div style={s.inner}>
        <div className="section-header">
          <p style={{ ...s.eyebrow }}>The Full Day</p>
          <h2 className="section-title" style={{ color: 'white' }}>
            A Day That <em>Transforms</em>
          </h2>
          <div className="section-line" />
          <p style={s.subtitle}>
            Come in for one service. Stay for the full ritual. Either way, you leave different.
          </p>
        </div>

        <div style={s.grid}>
          {steps.map(step => (
            <div key={step.num} style={s.step} className="exp-step">
              <p style={s.stepNum}>{step.num}</p>
              <h3 style={s.stepName}>{step.name}</h3>
              <p style={s.stepDesc}>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .exp-step { transition: background 0.4s; }
        .exp-step:hover { background: #3a2920 !important; }
        @media (max-width: 900px) { .exp-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 600px) { .exp-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  )
}

const s: Record<string, React.CSSProperties> = {
  section: {
    background: 'var(--dark)',
    padding: '100px 60px',
    position: 'relative',
    overflow: 'hidden',
  },
  holoBg: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '40%',
    height: '100%',
    opacity: 0.07,
    zIndex: 0,
  },
  inner: {
    maxWidth: '1100px',
    margin: '0 auto',
    position: 'relative',
    zIndex: 1,
  },
  eyebrow: {
    fontSize: '0.52rem',
    letterSpacing: '0.38em',
    textTransform: 'uppercase',
    color: 'var(--rose-gold)',
    marginBottom: '16px',
  },
  subtitle: {
    fontSize: '0.72rem',
    color: 'rgba(255,255,255,0.38)',
    marginTop: '16px',
    fontWeight: 300,
    lineHeight: '2',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '1px',
    background: 'rgba(201,169,154,0.12)',
    marginTop: '60px',
  },
  step: {
    background: 'var(--dark)',
    padding: '46px 26px',
  },
  stepNum: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: '3.2rem',
    fontWeight: 300,
    color: 'rgba(201,169,154,0.1)',
    lineHeight: '1',
    marginBottom: '16px',
  },
  stepName: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: '1.3rem',
    color: 'var(--rose-light)',
    marginBottom: '12px',
  },
  stepDesc: {
    fontSize: '0.66rem',
    fontWeight: 300,
    lineHeight: '1.9',
    color: 'rgba(232,213,204,0.48)',
  },
}
