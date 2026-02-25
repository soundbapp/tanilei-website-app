const steps = [
  {
    num: "01",
    name: "Welcome & Consult",
    desc: "Arrive to a calm, curated space. Tani's team reviews your profile and maps your visit — no guessing, no generic solutions.",
  },
  {
    num: "02",
    name: "Hair Treatment",
    desc: "Rejuvenation, styling, color — whatever your hair needs, executed at the standard Tani learned in the industry's top rooms.",
  },
  {
    num: "03",
    name: "Nails, Lashes & Brows",
    desc: "While you relax, specialists complete your nails, perfect your lashes, and sculpt your brows. All in one session.",
  },
  {
    num: "04",
    name: "The Reveal",
    desc: "You leave whole. Not just done — genuinely transformed. And you'll already be looking forward to coming back.",
  },
];

export default function Experience() {
  return (
    <section id="experience" className="experience relative overflow-hidden bg-[var(--dark)] px-5 py-14 md:px-12 md:py-[100px]">
      <div className="experience-holo holo absolute right-0 top-0 h-full w-[40%] opacity-[0.07]" />
      <div className="exp-inner relative z-[1] mx-auto max-w-[1100px]">
        <div className="section-header">
          <p className="section-eyebrow mb-4 text-[0.52rem] uppercase tracking-[0.38em] text-[var(--rose-gold)]">
            The Full Day
          </p>
          <h2 className="font-serif section-title mb-4 text-center text-[clamp(1.9rem,7.5vw,2.8rem)] font-light leading-tight text-white">
            A Day That <em className="text-[var(--rose-deep)]">Transforms</em>
          </h2>
          <div className="section-line mx-auto mb-4 h-px w-[50px] bg-[var(--rose-gold)]" />
          <p className="exp-subtitle mt-4 text-[0.72rem] font-light leading-[2] text-[rgba(255,255,255,0.38)]">
            Come in for one service. Stay for the full ritual. Either way, you leave different.
          </p>
        </div>
        <div className="exp-grid mt-16 grid grid-cols-1 gap-px bg-[rgba(201,169,154,0.12)] md:grid-cols-2 lg:mt-[60px] lg:grid-cols-4">
          {steps.map((s) => (
            <div
              key={s.num}
              className="exp-step bg-[var(--dark)] p-5 transition-colors duration-300 hover:bg-[#3a2920] md:p-6 lg:p-[46px_26px]"
            >
              <p className="font-serif exp-num mb-4 text-[3.2rem] font-light leading-none text-[rgba(201,169,154,0.1)]">
                {s.num}
              </p>
              <h3 className="font-serif exp-name mb-3 text-[1.3rem] text-[var(--rose-light)]">
                {s.name}
              </h3>
              <p className="exp-desc text-[0.66rem] font-light leading-[1.9] text-[rgba(232,213,204,0.48)]">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
