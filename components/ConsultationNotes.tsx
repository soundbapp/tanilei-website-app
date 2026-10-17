import { ARRIVAL_SURCHARGE_USD, CONSULTATION_IN_CHAIR } from "@/lib/consultation";

export default function ConsultationNotes() {
  return (
    <div className="border border-[rgba(201,169,154,0.4)] bg-white/80 px-5 py-6 text-left">
      <p className="mb-3 text-[0.8rem] uppercase tracking-[0.18em] text-[var(--rose-deep)]">
        Consultation
      </p>
      <p className="text-[1.05rem] font-light leading-[1.75] text-[var(--text)]">
        Tell us the service you need. Upload a before photo of your hair today,
        and a second photo of the look you want. Share a brief bio of your hair
        — color or natural, highlights, wigs, weaves, sprays, and anything else
        we should know.
      </p>
      <p className="mt-3 text-[1.05rem] font-light leading-[1.75] text-[var(--text)]">
        Arrive detangled, braided, and ready to be treated. If you are not
        prepared, a ${ARRIVAL_SURCHARGE_USD} surcharge applies.
      </p>
      <p className="mt-4 text-[0.8rem] uppercase tracking-[0.16em] text-[var(--rose-deep)]">
        In the chair we go over
      </p>
      <ul className="mt-2 list-none space-y-1">
        {CONSULTATION_IN_CHAIR.map((item) => (
          <li
            key={item}
            className="text-[1rem] font-light leading-[1.75] text-[var(--text-light)]"
          >
            — {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
