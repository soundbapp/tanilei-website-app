const appFeatures = [
  {
    icon: "🪞",
    name: "AI Consultations",
    desc: "Personalized beauty recommendations based on your profile, goals, and history — anytime.",
  },
  {
    icon: "📅",
    name: "Smart Reminders",
    desc: "The app knows your care cycle. Get reminded when it's time to book or restock — before you need to ask.",
  },
  {
    icon: "📦",
    name: "Kit Monitoring",
    desc: "Track your product levels. Reorder what you're running low on with one tap.",
  },
  {
    icon: "🎥",
    name: "Virtual Sessions",
    desc: "Book and attend live video consultations with Tani directly through the app — wherever you are.",
  },
];

export default function AppSection() {
  return (
    <section id="app" className="section-wrap app-section bg-white px-5 py-14 md:px-12 md:py-[100px]">
      <div className="section-header mb-10 md:mb-16">
        <p className="section-eyebrow mb-4 text-[0.52rem] uppercase tracking-[0.38em] text-[var(--rose-deep)]">
          The Tani/Lei App
        </p>
        <h2 className="font-serif section-title mb-4 text-center text-[clamp(1.9rem,7.5vw,2.8rem)] font-light leading-tight text-[var(--dark)]">
          Beauty Intelligence,
          <br />
          <em className="text-[var(--rose-deep)]">In Your Pocket</em>
        </h2>
        <div className="mx-auto h-px w-[50px] bg-[var(--rose-gold)]" />
      </div>
      <div className="app-grid mt-10 grid grid-cols-1 gap-10 md:mt-12 lg:mt-[60px] lg:grid-cols-[1fr_1.2fr] lg:gap-[70px]">
        <div className="app-features grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-5">
          {appFeatures.map((f) => (
            <div
              key={f.name}
              className="app-feature border border-[rgba(201,169,154,0.28)] p-5 transition-[border-color,box-shadow] duration-300 hover:border-[var(--rose-gold)] hover:shadow-[0_8px_28px_rgba(201,169,154,0.12)] md:p-6"
            >
              <div className="app-icon mb-3 text-xl">{f.icon}</div>
              <h4 className="font-serif app-feat-name mb-2 text-[1.05rem] text-[var(--dark)]">
                {f.name}
              </h4>
              <p className="app-feat-desc text-[0.62rem] font-light leading-[1.9] text-[var(--text-light)]">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
        <div className="phone-mock flex h-[360px] items-center justify-center md:h-[520px]">
          <div className="phone-ring phone-ring-1 absolute left-1/2 top-1/2 h-[230px] w-[230px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[rgba(201,169,154,0.22)] md:h-[300px] md:w-[300px]" />
          <div className="phone-ring phone-ring-2 absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[rgba(201,169,154,0.22)] md:h-[400px] md:w-[400px]" />
          <div className="phone-outer relative h-[392px] w-[196px] overflow-hidden rounded-[34px] border-2 border-[rgba(201,169,154,0.38)] shadow-[0_28px_70px_rgba(42,31,26,0.1)] md:h-[478px] md:w-[238px]">
            <div className="phone-notch absolute left-1/2 top-0 z-[2] h-[18px] w-[74px] -translate-x-1/2 rounded-b-xl bg-[var(--dark)]" />
            <div className="phone-screen holo absolute inset-0" />
            <div className="phone-content absolute inset-0 flex flex-col gap-2 p-4 pt-11">
              <div className="phone-top mb-1 flex items-center justify-between">
                <span className="font-script phone-logo text-[1.1rem] text-[var(--dark)]">Tani/Lei</span>
                <span className="text-[0.5rem] text-[rgba(42,31,26,0.3)]">✦</span>
              </div>
              <p className="phone-greet text-[0.48rem] uppercase tracking-[0.15em] text-[var(--text-light)]">
                Good morning,
              </p>
              <p className="font-serif phone-name mb-3 text-[1.2rem] text-[var(--dark)]">Sarah</p>
              <div className="phone-card rounded-[10px] bg-[var(--dark)] p-3">
                <p className="phone-clabel mb-1 text-[0.4rem] uppercase tracking-[0.2em] text-[var(--rose-gold)]">
                  Next Appointment
                </p>
                <p className="font-serif phone-cval text-[0.92rem] text-white">Tuesday, Mar 4</p>
              </div>
              <div className="phone-card-light rounded-[10px] bg-[rgba(42,31,26,0.05)] p-3">
                <p className="phone-clabel text-[0.4rem] uppercase tracking-[0.2em] text-[var(--rose-deep)]">
                  Kit Status
                </p>
                <p className="font-serif phone-cval text-[var(--dark)] text-[0.72rem]">
                  Argan Treatment — Running Low
                </p>
              </div>
              <p className="phone-rlabel text-[0.38rem] uppercase tracking-[0.2em] text-[var(--text-light)]">
                Today&apos;s Recommendations
              </p>
              <div className="phone-pills flex flex-wrap gap-1">
                <span className="phone-pill rounded-full border border-[rgba(201,169,154,0.28)] bg-[rgba(201,169,154,0.16)] px-2 py-1 text-[0.36rem] uppercase tracking-[0.12em] text-[var(--text)]">
                  Deep Condition
                </span>
                <span className="phone-pill rounded-full border border-[rgba(201,169,154,0.28)] bg-[rgba(201,169,154,0.16)] px-2 py-1 text-[0.36rem] uppercase tracking-[0.12em] text-[var(--text)]">
                  Scalp Massage
                </span>
                <span className="phone-pill rounded-full border border-[rgba(201,169,154,0.28)] bg-[rgba(201,169,154,0.16)] px-2 py-1 text-[0.36rem] uppercase tracking-[0.12em] text-[var(--text)]">
                  Heat Free Day
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
