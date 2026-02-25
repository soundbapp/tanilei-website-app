const services = [
  {
    num: "01",
    icon: "✦",
    name: "Hair Styling & Treatment",
    desc: "Celebrity-level cuts, color, and styling — plus transformative rejuvenation treatments that restore health and luminosity to every strand.",
  },
  {
    num: "02",
    icon: "◈",
    name: "Nails",
    desc: "Precision nail artistry — from classic manicures and pedicures to sculptural nail art that becomes your signature.",
  },
  {
    num: "03",
    icon: "◇",
    name: "Lash Extensions",
    desc: "Volume, lift, and drama — expertly applied lashes that frame your eyes and let you wake up ready.",
  },
  {
    num: "04",
    icon: "⊹",
    name: "Brow Design",
    desc: "Architectural precision. Your brows shaped and defined to complement your unique bone structure and aesthetic.",
  },
  {
    num: "05",
    icon: "◉",
    name: "Virtual Consultations",
    desc: "Can't come in? Tani meets you where you are. Book a private virtual session for personalized guidance and your curated care plan.",
  },
  {
    num: "06",
    icon: "✧",
    name: "Curated Beauty Kits",
    desc: "Your personalized product ritual, delivered. Tani selects everything based on your beauty profile — right to your door, monthly.",
  },
];

export default function Services() {
  return (
    <section id="services" className="section-wrap services bg-[var(--cream)] px-5 py-16 md:px-12 md:py-[100px]">
      <div className="section-header mb-10 md:mb-16">
        <p className="section-eyebrow mb-4 text-[0.52rem] uppercase tracking-[0.38em] text-[var(--rose-deep)]">
          What We Offer
        </p>
        <h2 className="font-serif section-title mb-4 text-[clamp(2.2rem,4.5vw,3.8rem)] font-light leading-tight text-[var(--dark)]">
          Beauty, <em className="text-[var(--rose-deep)]">Fully Realized</em>
        </h2>
        <div className="mx-auto h-px w-[50px] bg-[var(--rose-gold)]" />
      </div>
      <div className="services-grid mx-auto grid max-w-[1100px] grid-cols-1 gap-px sm:grid-cols-2 md:grid-cols-3">
        {services.map((s) => (
          <div
            key={s.num}
            className="service-card relative overflow-hidden bg-[var(--rose-pale)] p-6 transition-transform duration-300 hover:-translate-y-1 hover:[&_.svc-holo]:opacity-15 md:p-[52px_34px]"
          >
            <div className="svc-holo holo absolute inset-0 h-full opacity-0 transition-opacity duration-300" />
            <p className="svc-num relative z-[1] mb-6 font-serif text-[0.68rem] tracking-[0.2em] text-[var(--rose-gold)]">
              {s.num}
            </p>
            <div className="svc-icon relative z-[1] mb-4 text-2xl text-[var(--dark)]">{s.icon}</div>
            <h3 className="svc-name font-serif relative z-[1] mb-3 text-lg font-normal leading-snug md:text-[1.45rem] text-[var(--dark)]">
              {s.name}
            </h3>
            <p className="svc-desc relative z-[1] text-[0.68rem] font-light leading-[1.9] text-[var(--text-light)]">
              {s.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
