const items = [
  "Hair Styling",
  "Hair Rejuvenation",
  "Nail Art & Care",
  "Lash Extensions",
  "Brow Design",
  "Virtual Consultations",
  "Curated Beauty Kits",
  "The Full Experience",
];

export default function Ticker() {
  const row = items.flatMap((item) => [item, "◆"]);
  const track = [...row, ...row];

  return (
    <div className="overflow-hidden whitespace-nowrap bg-[var(--dark)] py-3">
      <div className="animate-ticker inline-flex">
        {track.map((content, i) =>
          content === "◆" ? (
            <span key={i} className="px-1.5 text-[var(--rose-deep)]">
              ◆
            </span>
          ) : (
            <span key={i} className="px-8 text-[0.52rem] uppercase tracking-[0.25em] text-[var(--rose-gold)]">
              {content}
            </span>
          )
        )}
      </div>
    </div>
  );
}
