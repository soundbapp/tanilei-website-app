const features = [
  { icon: '🪞', name: 'AI Consultations',  desc: 'Personalized beauty recommendations based on your profile, goals, and history — anytime.' },
  { icon: '📅', name: 'Smart Reminders',   desc: "The app knows your care cycle. Get reminded when it's time to book or restock — before you need to ask." },
  { icon: '📦', name: 'Kit Monitoring',    desc: "Track your product levels. Reorder what you're running low on with one tap." },
  { icon: '🎥', name: 'Virtual Sessions',  desc: 'Book and attend live video consultations with Tani directly through the app — wherever you are.' },
]

export default function AppSection() {
  return (
    <section className="section-wrap app-section" id="app" style={{ background: 'white' }}>
      <div className="section-header">
        <p className="section-eyebrow">The Tani/Lei App</p>
        <h2 className="section-title">Beauty Intelligence,<br /><em>In Your Pocket</em></h2>
        <div className="section-line" />
      </div>

      <div style={s.grid}>
        {/* Feature cards */}
        <div style={s.features}>
          {features.map(f => (
            <div key={f.name} style={s.featureCard} className="app-feature">
              <div style={s.featureIcon}>{f.icon}</div>
              <h4 style={s.featureName}>{f.name}</h4>
              <p style={s.featureDesc}>{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Phone mockup */}
        <div style={s.phoneMock}>
          <div style={s.ring1} />
          <div style={s.ring2} />
          <div style={s.phoneOuter}>
            <div style={s.notch} />
            <div className="holo" style={s.phoneScreen} />
            <div style={s.phoneContent}>
              <div style={s.phoneTop}>
                <span style={s.phoneLogo}>Tani/Lei</span>
                <span style={{ fontSize: '0.5rem', color: 'rgba(42,31,26,0.3)' }}>✦</span>
              </div>
              <p style={s.phoneGreet}>Good morning,</p>
              <p style={s.phoneName}>Sarah</p>
              <div style={s.phoneDarkCard}>
                <p style={s.phoneCardLabel}>Next Appointment</p>
                <p style={s.phoneCardVal}>Tuesday, Mar 4</p>
              </div>
              <div style={s.phoneLightCard}>
                <p style={{ ...s.phoneCardLabel, color: 'var(--rose-deep)' }}>Kit Status</p>
                <p style={{ ...s.phoneCardVal, color: 'var(--dark)', fontSize: '0.72rem' }}>Argan Treatment — Running Low</p>
              </div>
              <p style={s.phoneRecLabel}>Today's Recommendations</p>
              <div style={s.pills}>
                {['Deep Condition', 'Scalp Massage', 'Heat Free Day'].map(p => (
                  <span key={p} style={s.pill}>{p}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .app-feature { border: 1px solid rgba(201,169,154,0.28); transition: border-color 0.3s, box-shadow 0.3s; }
        .app-feature:hover { border-color: var(--rose-gold); box-shadow: 0 8px 28px rgba(201,169,154,0.12); }
        @media (max-width: 900px) {
          .app-grid { grid-template-columns: 1fr !important; gap: 44px !important; }
        }
        @media (max-width: 600px) {
          .app-features-grid { grid-template-columns: 1fr !important; }
          .phone-mock { height: 360px !important; }
        }
      `}</style>
    </section>
  )
}

const s: Record<string, React.CSSProperties> = {
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1.2fr',
    gap: '70px',
    alignItems: 'center',
    marginTop: '60px',
  },
  features: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '22px',
  },
  featureCard: {
    padding: '26px 20px',
  },
  featureIcon: { fontSize: '1.3rem', marginBottom: '12px' },
  featureName: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: '1.05rem',
    color: 'var(--dark)',
    marginBottom: '8px',
  },
  featureDesc: {
    fontSize: '0.62rem',
    fontWeight: 300,
    lineHeight: '1.9',
    color: 'var(--text-light)',
  },
  phoneMock: {
    position: 'relative',
    height: '520px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring1: { position: 'absolute', width: '300px', height: '300px', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', borderRadius: '50%', border: '1px solid rgba(201,169,154,0.22)' },
  ring2: { position: 'absolute', width: '400px', height: '400px', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', borderRadius: '50%', border: '1px solid rgba(201,169,154,0.22)' },
  phoneOuter: {
    width: '238px',
    height: '478px',
    border: '2px solid rgba(201,169,154,0.38)',
    borderRadius: '34px',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 28px 70px rgba(42,31,26,0.1)',
  },
  notch: {
    width: '74px',
    height: '18px',
    background: 'var(--dark)',
    borderRadius: '0 0 12px 12px',
    position: 'absolute',
    top: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 2,
  },
  phoneScreen: { width: '100%', height: '100%' },
  phoneContent: {
    position: 'absolute',
    inset: 0,
    padding: '44px 16px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '9px',
  },
  phoneTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' },
  phoneLogo: { fontFamily: "'Great Vibes', cursive", fontSize: '1.1rem', color: 'var(--dark)' },
  phoneGreet: { fontSize: '0.48rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-light)' },
  phoneName: { fontFamily: "'Cormorant Garamond', serif", fontSize: '1.2rem', color: 'var(--dark)', marginBottom: '12px' },
  phoneDarkCard: { background: 'var(--dark)', borderRadius: '10px', padding: '13px' },
  phoneLightCard: { background: 'rgba(42,31,26,0.05)', borderRadius: '10px', padding: '13px' },
  phoneCardLabel: { fontSize: '0.4rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--rose-gold)', marginBottom: '5px' },
  phoneCardVal: { fontFamily: "'Cormorant Garamond', serif", fontSize: '0.92rem', color: 'white' },
  phoneRecLabel: { fontSize: '0.38rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-light)' },
  pills: { display: 'flex', flexWrap: 'wrap', gap: '5px' },
  pill: {
    fontSize: '0.36rem',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    background: 'rgba(201,169,154,0.16)',
    color: 'var(--text)',
    padding: '5px 8px',
    borderRadius: '20px',
    border: '1px solid rgba(201,169,154,0.28)',
  },
}
