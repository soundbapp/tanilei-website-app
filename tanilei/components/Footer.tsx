const serviceLinks = [
  'Hair Styling & Treatment',
  'Nails',
  'Lash Extensions',
  'Brow Design',
  'Virtual Consultations',
  'Beauty Kits',
]

export default function Footer() {
  return (
    <>
      <footer style={s.footer}>
        {/* Brand */}
        <div style={s.brand}>
          <span style={s.logo}>Tani/Lei</span>
          <p style={s.brandText}>
            The Beauty Experience<br />
            Dallas, Texas<br /><br />
            Celebrity-trained luxury beauty<br />
            for the woman who deserves extraordinary.
          </p>
        </div>

        {/* Services */}
        <div>
          <p style={s.colTitle}>Services</p>
          <ul style={s.linkList}>
            {serviceLinks.map(l => (
              <li key={l}>
                <a href="#services" style={s.footerLink}>{l}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Connect */}
        <div>
          <p style={s.colTitle}>Connect</p>
          <div style={s.contactText}>
            <a href="https://tanilei.com" style={s.contactLink}>tanilei.com</a><br />
            <a href="mailto:hello@tanilei.com" style={s.contactLink}>hello@tanilei.com</a><br />
            202-510-8945<br />
            Dallas, TX
          </div>
        </div>
      </footer>

      <div style={s.footerBottom}>
        <p style={s.bottomText}>© 2026 Tani/Lei · All Rights Reserved</p>
        <p style={s.bottomText}>Dallas, TX · tanilei.com</p>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; padding: 48px 24px !important; }
          .footer-bottom-bar { padding: 16px 24px !important; flex-direction: column !important; gap: 6px !important; }
        }
        @media (max-width: 600px) {
          .footer-grid { grid-template-columns: 1fr !important; padding: 44px 20px !important; gap: 30px !important; }
          .footer-bottom-bar p:last-child { display: none !important; }
        }
      `}</style>
    </>
  )
}

const s: Record<string, React.CSSProperties> = {
  footer: {
    background: 'var(--dark)',
    padding: '60px',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '40px',
  },
  brand: {},
  logo: {
    fontFamily: "'Great Vibes', cursive",
    fontSize: '2.2rem',
    color: 'white',
    marginBottom: '12px',
    display: 'block',
  },
  brandText: {
    fontSize: '0.56rem',
    letterSpacing: '0.12em',
    color: 'rgba(201,169,154,0.5)',
    lineHeight: '2.1',
  },
  colTitle: {
    fontSize: '0.5rem',
    letterSpacing: '0.32em',
    textTransform: 'uppercase',
    color: 'var(--rose-gold)',
    marginBottom: '20px',
  },
  linkList: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '11px',
  },
  footerLink: {
    fontSize: '0.6rem',
    fontWeight: 300,
    color: 'rgba(255,255,255,0.42)',
    textDecoration: 'none',
    transition: 'color 0.3s',
  },
  contactText: {
    fontSize: '0.6rem',
    fontWeight: 300,
    color: 'rgba(255,255,255,0.42)',
    lineHeight: '2.2',
  },
  contactLink: {
    color: 'var(--rose-gold)',
    textDecoration: 'none',
  },
  footerBottom: {
    background: '#1a100d',
    padding: '18px 60px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomText: {
    fontSize: '0.46rem',
    letterSpacing: '0.15em',
    color: 'rgba(255,255,255,0.22)',
    textTransform: 'uppercase',
  },
}
