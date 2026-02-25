'use client'
import { useState } from 'react'

export default function Booking() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) setSubmitted(true)
  }

  return (
    <section id="book" style={s.section}>
      <div className="holo" style={s.holoBg} />
      <div style={s.inner}>
        <p className="section-eyebrow">Begin Your Journey</p>
        <h2 className="section-title">Reserve Your <em>Experience</em></h2>
        <div className="section-line" style={{ margin: '18px auto 0' }} />
        <p style={s.sub}>
          Join the Tani/Lei family. Enter your email to receive early access, priority booking,
          and your complimentary beauty consultation.
        </p>

        {submitted ? (
          <p style={s.successMsg}>
            Thank you — we'll be in touch soon. ✦
          </p>
        ) : (
          <form onSubmit={handleSubmit} style={s.form}>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              style={s.input}
            />
            <button type="submit" style={s.submitBtn}>Request Access</button>
          </form>
        )}

        <p style={s.note}>
          Call us ·{' '}
          <a href="tel:2025108945" style={s.link}>202-510-8945</a>
          {' · '}
          <a href="mailto:hello@tanilei.com" style={s.link}>hello@tanilei.com</a>
        </p>
      </div>

      <style>{`
        @media (max-width: 600px) {
          .booking-form { flex-direction: column !important; border: none !important; gap: 8px !important; }
          .booking-input { border: 1px solid rgba(201,169,154,0.4) !important; }
          .booking-section { padding-bottom: 120px !important; }
        }
      `}</style>
    </section>
  )
}

const s: Record<string, React.CSSProperties> = {
  section: {
    padding: '100px 60px',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  holoBg: {
    position: 'absolute',
    inset: 0,
    height: '100%',
    opacity: 0.38,
    zIndex: 0,
  },
  inner: {
    position: 'relative',
    zIndex: 1,
    maxWidth: '680px',
    margin: '0 auto',
  },
  sub: {
    fontSize: '0.72rem',
    fontWeight: 300,
    lineHeight: '2',
    color: 'var(--text-light)',
    margin: '28px auto 44px',
    maxWidth: '440px',
  },
  form: {
    display: 'flex',
    maxWidth: '440px',
    margin: '0 auto 16px',
    border: '1px solid rgba(201,169,154,0.45)',
  },
  input: {
    flex: 1,
    padding: '15px 18px',
    border: 'none',
    outline: 'none',
    background: 'white',
    fontFamily: "'Montserrat', sans-serif",
    fontSize: '0.68rem',
    color: 'var(--text)',
    minHeight: '52px',
  },
  submitBtn: {
    padding: '15px 22px',
    background: 'var(--dark)',
    color: 'white',
    border: 'none',
    fontFamily: "'Montserrat', sans-serif",
    fontSize: '0.5rem',
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    minHeight: '52px',
    transition: 'background 0.3s',
  },
  successMsg: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: '1.2rem',
    fontStyle: 'italic',
    color: 'var(--rose-deep)',
    margin: '0 auto 16px',
    padding: '24px 0',
  },
  note: {
    fontSize: '0.5rem',
    letterSpacing: '0.12em',
    color: 'var(--text-light)',
  },
  link: {
    color: 'var(--rose-deep)',
    textDecoration: 'none',
  },
}
