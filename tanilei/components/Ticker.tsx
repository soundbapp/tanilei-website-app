const items = [
  'Hair Styling', 'Hair Rejuvenation', 'Nail Art & Care',
  'Lash Extensions', 'Brow Design', 'Virtual Consultations',
  'Curated Beauty Kits', 'The Full Experience',
]

export default function Ticker() {
  // Duplicate for seamless infinite loop
  const all = [...items, ...items]

  return (
    <div style={s.ticker}>
      <div style={s.track}>
        {all.map((item, i) => (
          <span key={i}>
            <span style={s.item}>{item}</span>
            <span style={s.dot}>◆</span>
          </span>
        ))}
      </div>
      <style>{`
        @keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }
      `}</style>
    </div>
  )
}

const s: Record<string, React.CSSProperties> = {
  ticker: {
    background: 'var(--dark)',
    padding: '13px 0',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
  track: {
    display: 'inline-flex',
    animation: 'ticker 28s linear infinite',
  },
  item: {
    fontSize: '0.52rem',
    letterSpacing: '0.25em',
    textTransform: 'uppercase',
    color: 'var(--rose-gold)',
    padding: '0 32px',
  },
  dot: {
    color: 'var(--rose-deep)',
    padding: '0 6px',
    fontSize: '0.52rem',
  },
}
