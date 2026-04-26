"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  INTAKE_SCHEMA_VERSION,
  INTAKE_V2,
  type IntakeV2,
} from "@/lib/intake";

type LoadState = "loading" | "ready" | "submitted" | "not_found" | "error";

const STEPS = ["You", "Your Hair", "The Visit", "Confirm"] as const;

type Draft = Omit<
  IntakeV2,
  "schemaVersion" | "firstVisit" | "colorTreated" | "reminderPref" | "kitInterest"
> & {
  firstVisit: "" | "first" | "returning";
  colorTreated: "" | "recent" | "grown" | "natural";
  reminderPref: "" | IntakeV2["reminderPref"];
  kitInterest: "" | IntakeV2["kitInterest"];
};

function emptyDraft(): Draft {
  return {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    firstVisit: "",
    referral: [],
    hairType: "",
    hairLength: "",
    concerns: [],
    colorTreated: "",
    chemicals: [],
    allergies: "",
    goals: "",
    inspirationUrl: "",
    usualStyle: [],
    openness: 3,
    addOns: [],
    visitNotes: "",
    reminderPref: "sms",
    kitInterest: "",
    noteToTani: "",
  };
}

function toggleMulti(list: string[], value: string): string[] {
  if (list.includes(value)) {
    return list.filter((v) => v !== value);
  }
  return [...list, value];
}

function isValidEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());
}

const chipClass =
  "text-[0.48rem] uppercase tracking-[0.15em] border px-3.5 py-1.5 transition-colors " +
  "border-[var(--rose-light)] bg-white text-[var(--text-light)] hover:border-[var(--rose-gold)] hover:text-[var(--rose-deep)]";
const chipSelectedClass =
  " border-[var(--dark)] bg-[var(--dark)] text-[var(--rose-gold)] hover:text-[var(--rose-gold)]";

const inputClass =
  "w-full border border-[var(--rose-light)] bg-white px-3.5 py-2.5 text-[0.65rem] text-[var(--text)] outline-none " +
  "placeholder:text-[var(--text-light)] focus:border-[var(--rose-gold)]";

const labelClass =
  "mb-1.5 block text-[0.5rem] uppercase tracking-[0.2em] text-[var(--text-light)]";
const labelReq = (
  <span className="text-[var(--rose-gold)]"> *</span>
);

type IntakeGetPayload = {
  whenLabel: string;
  firstName: string;
  customerName: string;
  serviceLabel: string;
  stylistName: string;
  emailHint: string;
};

export default function PreVisitForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("t") || searchParams.get("token") || "";

  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [meta, setMeta] = useState<IntakeGetPayload | null>(null);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<Draft>(emptyDraft);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState(false);
  const [stepError, setStepError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!token) {
      setLoadState("not_found");
      return;
    }
    setFormError(null);
    try {
      const res = await fetch(
        `/api/appointments/intake?t=${encodeURIComponent(token)}`
      );
      if (res.status === 404) {
        setLoadState("not_found");
        return;
      }
      if (!res.ok) {
        setLoadState("error");
        return;
      }
      const data = (await res.json()) as {
        submitted: boolean;
        whenLabel: string;
        firstName: string;
        customerName: string;
        serviceLabel: string;
        stylistName: string;
        emailHint: string;
      };
      setMeta({
        whenLabel: data.whenLabel || "",
        firstName: data.firstName || "there",
        customerName: data.customerName || "",
        serviceLabel: data.serviceLabel || "Hair Styling & Treatment",
        stylistName: data.stylistName || "Tani Abdu",
        emailHint: data.emailHint || "",
      });
      if (data.emailHint) {
        setForm((f) => ({ ...f, email: f.email || data.emailHint }));
      }
      if (data.submitted) {
        setLoadState("submitted");
      } else {
        setLoadState("ready");
      }
    } catch {
      setLoadState("error");
    }
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  const toIntakeV2 = (): IntakeV2 => ({
    schemaVersion: INTAKE_SCHEMA_VERSION,
    firstName: form.firstName.trim(),
    lastName: form.lastName.trim(),
    email: form.email.trim(),
    phone: form.phone.trim(),
    firstVisit: form.firstVisit as "first" | "returning",
    referral: form.referral,
    hairType: form.hairType,
    hairLength: form.hairLength.trim(),
    concerns: form.concerns,
    colorTreated: form.colorTreated === "" ? "" : form.colorTreated,
    chemicals: form.chemicals,
    allergies: form.allergies,
    goals: form.goals.trim(),
    inspirationUrl: form.inspirationUrl.trim(),
    usualStyle: form.usualStyle,
    openness: form.openness,
    addOns: form.addOns,
    visitNotes: form.visitNotes.trim(),
    reminderPref: form.reminderPref as IntakeV2["reminderPref"],
    kitInterest: form.kitInterest as IntakeV2["kitInterest"],
    noteToTani: form.noteToTani.trim(),
  });

  const validateStep = (s: number): string | null => {
    if (s === 0) {
      if (!form.firstName.trim()) return "Please enter your first name.";
      if (!form.lastName.trim()) return "Please enter your last name.";
      if (!form.email.trim() || !isValidEmail(form.email)) {
        return "Please enter a valid email address.";
      }
      if (form.firstVisit !== "first" && form.firstVisit !== "returning") {
        return "Please tell us if this is your first visit.";
      }
    }
    if (s === 1) {
      if (!form.hairType) return "Please select a hair type.";
    }
    if (s === 2) {
      if (!form.goals.trim()) {
        return "Please share what you’re hoping to achieve (required).";
      }
    }
    if (s === 3) {
      if (form.reminderPref !== "sms" && form.reminderPref !== "email" && form.reminderPref !== "both") {
        return "Please choose how you’d like reminders.";
      }
      if (form.kitInterest !== "yes" && form.kitInterest !== "maybe" && form.kitInterest !== "no") {
        return "Please choose an option for the beauty kit.";
      }
    }
    return null;
  };

  const goNext = () => {
    setStepError(null);
    const err = validateStep(step);
    if (err) {
      setStepError(err);
      return;
    }
    setStep((x) => Math.min(x + 1, 3));
  };

  const goBack = () => {
    setStepError(null);
    setStep((x) => Math.max(x - 1, 0));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step !== 3) return;
    if (!token) return;
    setStepError(null);
    for (let s = 0; s <= 3; s++) {
      const err = validateStep(s);
      if (err) {
        setStepError(err);
        setStep(s);
        return;
      }
    }
    setSaving(true);
    setFormError(null);
    setEmailError(false);
    const answers = toIntakeV2();
    try {
      const res = await fetch("/api/appointments/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, answers }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 409) {
        setLoadState("submitted");
        return;
      }
      if (!res.ok) {
        setFormError(
          (data as { error?: string }).error || "Could not save. Please try again."
        );
        return;
      }
      if ((data as { emailError?: boolean }).emailError) {
        setEmailError(true);
      }
      setLoadState("submitted");
    } catch {
      setFormError("Could not save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (!token) {
    return (
      <div className="mx-auto max-w-lg text-center text-[0.8rem] leading-[1.8] text-[var(--text)]">
        <p className="mb-4 text-[var(--rose-deep)]">
          This page needs the link from your appointment confirmation email.
        </p>
        <Link
          href="/appointments"
          className="text-[0.58rem] uppercase tracking-[0.2em] text-[var(--text-light)] no-underline hover:text-[var(--rose-deep)]"
        >
          Book an appointment
        </Link>
      </div>
    );
  }

  if (loadState === "loading") {
    return (
      <p className="text-center text-[0.72rem] text-[var(--text-light)]">
        Loading…
      </p>
    );
  }

  if (loadState === "not_found") {
    return (
      <div className="mx-auto max-w-lg text-center text-[0.8rem] text-[var(--text)]">
        <p className="mb-4 text-[var(--rose-deep)]">
          This link is invalid or has expired. If you have an upcoming visit, use
          the latest email from TaniLei, or get in touch.
        </p>
        <a
          href="mailto:hello@tanilei.com"
          className="text-[var(--rose-deep)] no-underline"
        >
          hello@tanilei.com
        </a>
        <p className="mt-6">
          <Link
            href="/appointments"
            className="text-[0.58rem] uppercase tracking-[0.2em] text-[var(--text-light)] no-underline hover:text-[var(--rose-deep)]"
          >
            Book an appointment
          </Link>
        </p>
      </div>
    );
  }

  if (loadState === "error") {
    return (
      <p className="text-center text-[0.72rem] text-red-600">
        Something went wrong.{" "}
        <button
          type="button"
          onClick={() => {
            setLoadState("loading");
            load();
          }}
          className="text-[var(--rose-deep)] underline"
        >
          Try again
        </button>
      </p>
    );
  }

  if (loadState === "submitted" && !saving) {
    return (
      <div className="mx-auto max-w-md text-center">
        <p className="text-[0.9rem] font-medium text-[var(--rose-gold)]" aria-hidden>
          ✦
        </p>
        <p className="mt-2 font-serif text-[clamp(1.15rem,2.5vw,1.4rem)] font-light italic text-[var(--dark)]">
          You&apos;re all set.
        </p>
        <p className="mt-3 text-[0.72rem] leading-[1.9] text-[var(--text-light)]">
          {emailError
            ? "We saved your answers. If the team’s confirmation email is delayed, don’t worry — we have your form."
            : "Thank you. Your pre-visit details are on their way to the team. We can’t wait to see you."}
        </p>
        <p className="mt-4 text-[0.72rem] text-[var(--text-light)]">
          {meta?.whenLabel
            ? `Your visit: ${meta.whenLabel} (Eastern)`
            : null}
        </p>
        <Link
          href="/"
          className="mt-8 inline-block text-[0.58rem] uppercase tracking-[0.2em] text-[var(--text-light)] no-underline hover:text-[var(--rose-deep)]"
        >
          Home
        </Link>
      </div>
    );
  }

  const m = meta!;
  const progressPct = ((step + 1) / 4) * 100;

  return (
    <div className="mx-auto w-full max-w-[680px] overflow-hidden bg-[var(--cream)] text-[var(--text)]">
      <div className="bg-[var(--dark)] px-6 py-6 pb-5 md:px-8">
        <p className="text-[0.4rem] uppercase tracking-[0.32em] text-[var(--rose-gold)]">
          Pre-Appointment Intake
        </p>
        <h2 className="mt-1.5 font-serif text-[1.4rem] font-light italic leading-tight text-white md:text-[1.5rem]">
          Tani/Lei
        </h2>
        <p className="mt-1.5 text-[0.5rem] uppercase tracking-[0.18em] text-[var(--rose-light)] opacity-80">
          The Beauty Experience · Carrollton, Texas
        </p>
      </div>

      <div className="flex flex-col gap-3 border-l-[3px] border-[var(--rose-gold)] bg-[var(--rose-pale)] px-4 py-3.5 sm:flex-row sm:items-center sm:gap-4 md:px-5">
        <div className="min-w-0 flex-1">
          <p className="text-[0.4rem] uppercase tracking-[0.28em] text-[var(--rose-deep)]">
            Your appointment
          </p>
          <p className="font-serif text-[0.9rem] text-[var(--dark)]">
            {m.serviceLabel}
          </p>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[0.4rem] uppercase tracking-[0.28em] text-[var(--rose-deep)]">
            Date & time
          </p>
          <p className="font-serif text-[0.9rem] text-[var(--dark)]">
            {m.whenLabel} (Eastern)
          </p>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[0.4rem] uppercase tracking-[0.28em] text-[var(--rose-deep)]">
            Stylist
          </p>
          <p className="font-serif text-[0.9rem] text-[var(--dark)]">
            {m.stylistName}
          </p>
        </div>
      </div>

      <div className="px-0 pt-6">
        <div className="h-0.5 w-full bg-[var(--rose-light)]">
          <div
            className="h-full bg-[var(--rose-gold)] transition-[width] duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <div className="flex justify-between px-4 pt-1.5 text-[0.4rem] uppercase tracking-[0.2em] md:px-8">
          {STEPS.map((label, i) => (
            <button
              key={label}
              type="button"
              className={
                "bg-transparent p-0 text-left " +
                (i === step
                  ? "font-medium text-[var(--rose-deep)]"
                  : i < step
                    ? "text-[var(--rose-gold)]"
                    : "text-[var(--text-light)]")
              }
              onClick={() => {
                if (i < step) {
                  setStepError(null);
                  setStep(i);
                }
              }}
              disabled={i > step}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {formError && (
        <p className="mt-4 px-4 text-[0.68rem] text-red-600 md:px-8" role="alert">
          {formError}
        </p>
      )}
      {stepError && (
        <p className="mt-2 px-4 text-[0.68rem] text-red-600 md:px-8" role="alert">
          {stepError}
        </p>
      )}

      <form onSubmit={handleFormSubmit} className="px-4 pb-10 pt-2 md:px-8">
        {step === 0 && (
          <section>
            <p className="text-[0.4rem] uppercase tracking-[0.32em] text-[var(--rose-deep)]">
              Step 1 of 4
            </p>
            <h3 className="mt-1.5 font-serif text-[1.1rem] font-light italic text-[var(--dark)]">
              Tell us about yourself
            </h3>
            <p className="mb-5 mt-1 text-[0.55rem] font-light leading-[1.9] text-[var(--text-light)]">
              So Tani can greet you properly and have everything ready before you
              arrive, {m.firstName}.
            </p>
            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              <div>
                <label className={labelClass} htmlFor="pv-first">
                  First name{labelReq}
                </label>
                <input
                  id="pv-first"
                  className={inputClass}
                  value={form.firstName}
                  onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                  autoComplete="given-name"
                  disabled={saving}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="pv-last">
                  Last name{labelReq}
                </label>
                <input
                  id="pv-last"
                  className={inputClass}
                  value={form.lastName}
                  onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                  autoComplete="family-name"
                  disabled={saving}
                />
              </div>
            </div>
            <div className="mt-3.5 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              <div>
                <label className={labelClass} htmlFor="pv-email">
                  Email{labelReq}
                </label>
                <input
                  id="pv-email"
                  type="email"
                  className={inputClass}
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  autoComplete="email"
                  disabled={saving}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="pv-phone">
                  Phone
                </label>
                <input
                  id="pv-phone"
                  type="tel"
                  className={inputClass}
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  autoComplete="tel"
                  disabled={saving}
                />
              </div>
            </div>
            <div className="mt-5">
              <p className={labelClass}>
                Is this your first visit with Tani?{labelReq}
              </p>
              <div className="flex flex-col gap-2">
                {(
                  [
                    ["first", "Yes — this is my first time", "We can’t wait to meet you."],
                    ["returning", "No — I’ve been here before", ""],
                  ] as const
                ).map(([v, t, sub]) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, firstVisit: v }))}
                    className={
                      "flex items-start gap-2.5 border px-3.5 py-2.5 text-left transition-colors " +
                      (form.firstVisit === v
                        ? "border-[var(--dark)] bg-[var(--rose-pale)]"
                        : "border-[var(--rose-light)] bg-white hover:border-[var(--rose-gold)]")
                    }
                    disabled={saving}
                  >
                    <span
                      className={
                        "mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full border-2 " +
                        (form.firstVisit === v
                          ? "border-[var(--rose-gold)] bg-[var(--dark)]"
                          : "border-[var(--rose-gold)]")
                      }
                    />
                    <span>
                      <span className="text-[0.6rem] text-[var(--text)]">{t}</span>
                      {sub ? (
                        <span className="mt-0.5 block text-[0.5rem] text-[var(--text-light)]">
                          {sub}
                        </span>
                      ) : null}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-5">
              <p className={labelClass}>How did you hear about Tani/Lei?</p>
              <div className="flex flex-wrap gap-2">
                {INTAKE_V2.REFERRAL_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() =>
                      setForm((f) => ({
                        ...f,
                        referral: toggleMulti(f.referral, opt),
                      }))
                    }
                    className={
                      chipClass +
                      (form.referral.includes(opt) ? chipSelectedClass : "")
                    }
                    disabled={saving}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-6 flex justify-end border-t border-[var(--rose-light)] pt-5">
              <button
                type="button"
                onClick={goNext}
                className="bg-[var(--dark)] px-6 py-2.5 text-[0.5rem] font-medium uppercase tracking-[0.2em] text-white border border-[var(--dark)] transition-colors hover:bg-transparent hover:text-[var(--dark)]"
                disabled={saving}
              >
                Continue →
              </button>
            </div>
          </section>
        )}

        {step === 1 && (
          <section>
            <p className="text-[0.4rem] uppercase tracking-[0.32em] text-[var(--rose-deep)]">
              Step 2 of 4
            </p>
            <h3 className="mt-1.5 font-serif text-[1.1rem] font-light italic text-[var(--dark)]">
              Your hair, your way
            </h3>
            <p className="mb-5 mt-1 text-[0.55rem] font-light leading-[1.9] text-[var(--text-light)]">
              The more Tani knows, the better she can prepare.
            </p>
            <div className="mb-4">
              <p className={labelClass}>
                Hair type{labelReq}
              </p>
              <div className="flex flex-wrap gap-2">
                {INTAKE_V2.HAIR_TYPE_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, hairType: opt }))}
                    className={
                      chipClass +
                      (form.hairType === opt ? chipSelectedClass : "")
                    }
                    disabled={saving}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <p className={labelClass}>Hair length</p>
              <div className="flex flex-wrap gap-2">
                {INTAKE_V2.HAIR_LENGTH_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, hairLength: opt }))}
                    className={
                      chipClass +
                      (form.hairLength === opt ? chipSelectedClass : "")
                    }
                    disabled={saving}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <p className={labelClass}>Current hair concerns</p>
              <div className="flex flex-wrap gap-2">
                {INTAKE_V2.CONCERN_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() =>
                      setForm((f) => ({
                        ...f,
                        concerns: toggleMulti(f.concerns, opt),
                      }))
                    }
                    className={
                      chipClass +
                      (form.concerns.includes(opt) ? chipSelectedClass : "")
                    }
                    disabled={saving}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <p className={labelClass}>Is your hair color-treated?</p>
              <div className="flex flex-col gap-2">
                {(
                  [
                    ["recent", "Yes — recently colored"],
                    ["grown", "Yes — but it’s grown out"],
                    ["natural", "No — natural color"],
                  ] as const
                ).map(([v, t]) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, colorTreated: v }))}
                    className={
                      "flex items-center gap-2.5 border px-3.5 py-2.5 text-left text-[0.6rem] " +
                      (form.colorTreated === v
                        ? "border-[var(--dark)] bg-[var(--rose-pale)]"
                        : "border-[var(--rose-light)] bg-white hover:border-[var(--rose-gold)]")
                    }
                    disabled={saving}
                  >
                    <span
                      className={
                        "h-2.5 w-2.5 shrink-0 rounded-full border-2 " +
                        (form.colorTreated === v
                          ? "border-[var(--rose-gold)] bg-[var(--dark)]"
                          : "border-[var(--rose-gold)]")
                      }
                    />
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <p className={labelClass}>Chemical treatments (last 6 months)</p>
              <div className="flex flex-wrap gap-2">
                {INTAKE_V2.CHEMICAL_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() =>
                      setForm((f) => ({
                        ...f,
                        chemicals: toggleMulti(f.chemicals, opt),
                      }))
                    }
                    className={
                      chipClass +
                      (form.chemicals.includes(opt) ? chipSelectedClass : "")
                    }
                    disabled={saving}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className={labelClass} htmlFor="pv-allergies">
                Allergies or sensitivities
              </label>
              <textarea
                id="pv-allergies"
                className={`${inputClass} min-h-[72px] resize-y leading-[1.7]`}
                value={form.allergies}
                onChange={(e) => setForm((f) => ({ ...f, allergies: e.target.value }))}
                placeholder="e.g. latex, certain fragrances — or leave blank if none"
                rows={3}
                disabled={saving}
              />
            </div>
            <div className="mt-6 flex justify-between border-t border-[var(--rose-light)] pt-5">
              <button
                type="button"
                onClick={goBack}
                className="bg-transparent p-0 text-[0.5rem] uppercase tracking-[0.2em] text-[var(--text-light)]"
                disabled={saving}
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={goNext}
                className="bg-[var(--dark)] px-6 py-2.5 text-[0.5rem] font-medium uppercase tracking-[0.2em] text-white border border-[var(--dark)] transition-colors hover:bg-transparent hover:text-[var(--dark)]"
                disabled={saving}
              >
                Continue →
              </button>
            </div>
          </section>
        )}

        {step === 2 && (
          <section>
            <p className="text-[0.4rem] uppercase tracking-[0.32em] text-[var(--rose-deep)]">
              Step 3 of 4
            </p>
            <h3 className="mt-1.5 font-serif text-[1.1rem] font-light italic text-[var(--dark)]">
              About your visit
            </h3>
            <p className="mb-5 mt-1 text-[0.55rem] font-light leading-[1.9] text-[var(--text-light)]">
              Help Tani understand what you&apos;re coming in for and what you
              want to walk away with.
            </p>
            <div className="mb-4">
              <label className={labelClass} htmlFor="pv-goals">
                What are you hoping to achieve today?{labelReq}
              </label>
              <textarea
                id="pv-goals"
                className={`${inputClass} min-h-[90px] resize-y leading-[1.7]`}
                value={form.goals}
                onChange={(e) => setForm((f) => ({ ...f, goals: e.target.value }))}
                placeholder="Be as specific or as open as you’d like."
                rows={4}
                disabled={saving}
              />
            </div>
            <div className="mb-4">
              <label className={labelClass} htmlFor="pv-inspiration">
                Inspiration (paste a link)
              </label>
              <input
                id="pv-inspiration"
                type="url"
                className={inputClass}
                value={form.inspirationUrl}
                onChange={(e) =>
                  setForm((f) => ({ ...f, inspirationUrl: e.target.value }))
                }
                placeholder="https:// (Pinterest, Instagram, etc.)"
                autoComplete="off"
                disabled={saving}
              />
            </div>
            <div className="my-4 h-px w-full bg-[var(--rose-light)]" />
            <div className="mb-4">
              <p className={labelClass}>Usual style</p>
              <div className="flex flex-wrap gap-2">
                {INTAKE_V2.STYLE_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() =>
                      setForm((f) => ({
                        ...f,
                        usualStyle: toggleMulti(f.usualStyle, opt),
                      }))
                    }
                    className={
                      chipClass +
                      (form.usualStyle.includes(opt) ? chipSelectedClass : "")
                    }
                    disabled={saving}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-2">
              <p className={labelClass}>
                How open are you to Tani&apos;s recommendations?
              </p>
              <div className="flex gap-1.5">
                {([1, 2, 3, 4, 5] as const).map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, openness: n }))}
                    className={
                      "min-w-0 flex-1 border py-1.5 text-center text-[0.58rem] " +
                      (form.openness === n
                        ? "border-[var(--dark)] bg-[var(--dark)] text-[var(--rose-gold)]"
                        : "border-[var(--rose-light)] bg-white text-[var(--text-light)] hover:border-[var(--rose-gold)]")
                    }
                    disabled={saving}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <div className="mt-1 flex justify-between text-[0.38rem] uppercase tracking-[0.08em] text-[var(--text-light)]">
                <span>Specific goals</span>
                <span>Fully open</span>
              </div>
            </div>
            <div className="my-4 h-px w-full bg-[var(--rose-light)]" />
            <div className="mb-4">
              <p className={labelClass}>Add-on services</p>
              <div className="flex flex-wrap gap-2">
                {INTAKE_V2.ADDON_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() =>
                      setForm((f) => ({
                        ...f,
                        addOns: toggleMulti(f.addOns, opt),
                      }))
                    }
                    className={
                      chipClass +
                      (form.addOns.includes(opt) ? chipSelectedClass : "")
                    }
                    disabled={saving}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className={labelClass} htmlFor="pv-visit-notes">
                Anything else before your visit?
              </label>
              <textarea
                id="pv-visit-notes"
                className={`${inputClass} min-h-[72px] resize-y leading-[1.7]`}
                value={form.visitNotes}
                onChange={(e) =>
                  setForm((f) => ({ ...f, visitNotes: e.target.value }))
                }
                placeholder="Time constraints, special occasion, access needs — anything at all."
                rows={3}
                disabled={saving}
              />
            </div>
            <div className="mt-6 flex justify-between border-t border-[var(--rose-light)] pt-5">
              <button
                type="button"
                onClick={goBack}
                className="bg-transparent p-0 text-[0.5rem] uppercase tracking-[0.2em] text-[var(--text-light)]"
                disabled={saving}
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={goNext}
                className="bg-[var(--dark)] px-6 py-2.5 text-[0.5rem] font-medium uppercase tracking-[0.2em] text-white border border-[var(--dark)] transition-colors hover:bg-transparent hover:text-[var(--dark)]"
                disabled={saving}
              >
                Continue →
              </button>
            </div>
          </section>
        )}

        {step === 3 && (
          <section>
            <p className="text-[0.4rem] uppercase tracking-[0.32em] text-[var(--rose-deep)]">
              Step 4 of 4
            </p>
            <h3 className="mt-1.5 font-serif text-[1.1rem] font-light italic text-[var(--dark)]">
              Almost done
            </h3>
            <p className="mb-5 mt-1 text-[0.55rem] font-light leading-[1.9] text-[var(--text-light)]">
              Communication preferences so we can take care of you.
            </p>
            <div className="mb-5">
              <p className={labelClass}>Appointment reminders{labelReq}</p>
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    ["sms", "Text / SMS"],
                    ["email", "Email"],
                    ["both", "Both"],
                  ] as const
                ).map(([v, t]) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() =>
                      setForm((f) => ({ ...f, reminderPref: v }))
                    }
                    className={
                      chipClass +
                      (form.reminderPref === v ? chipSelectedClass : "")
                    }
                    disabled={saving}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-5">
              <p className={labelClass}>
                Monthly beauty kit interest{labelReq}
              </p>
              <div className="flex flex-col gap-2">
                {(
                  [
                    [
                      "yes",
                      "Yes — tell me more",
                      "Products for your hair profile, delivered monthly",
                    ],
                    ["maybe", "Maybe later", ""],
                    ["no", "Not interested", ""],
                  ] as const
                ).map(([v, t, sub]) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, kitInterest: v }))}
                    className={
                      "flex items-start gap-2.5 border px-3.5 py-2.5 text-left " +
                      (form.kitInterest === v
                        ? "border-[var(--dark)] bg-[var(--rose-pale)]"
                        : "border-[var(--rose-light)] bg-white hover:border-[var(--rose-gold)]")
                    }
                    disabled={saving}
                  >
                    <span
                      className={
                        "mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full border-2 " +
                        (form.kitInterest === v
                          ? "border-[var(--rose-gold)] bg-[var(--dark)]"
                          : "border-[var(--rose-gold)]")
                      }
                    />
                    <span>
                      <span className="text-[0.6rem] text-[var(--text)]">{t}</span>
                      {sub ? (
                        <span className="mt-0.5 block text-[0.5rem] text-[var(--text-light)]">
                          {sub}
                        </span>
                      ) : null}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className={labelClass} htmlFor="pv-note-tani">
                A note to Tani
              </label>
              <textarea
                id="pv-note-tani"
                className={`${inputClass} min-h-[80px] resize-y leading-[1.7]`}
                value={form.noteToTani}
                onChange={(e) =>
                  setForm((f) => ({ ...f, noteToTani: e.target.value }))
                }
                placeholder="A question, a hello — or leave blank."
                rows={3}
                disabled={saving}
              />
            </div>
            <div className="mt-5 border-l-[3px] border-[var(--rose-gold)] bg-[var(--rose-pale)] px-4 py-3.5 text-[0.55rem] font-light leading-[1.8] text-[var(--text-light)]">
              <p className="text-[0.4rem] uppercase tracking-[0.2em] text-[var(--rose-deep)]">
                Your information
              </p>
              <p className="mt-1.5">
                Everything you share goes to Tani to prepare for your visit and is
                kept private.
              </p>
            </div>
            <div className="mt-6 flex justify-between border-t border-[var(--rose-light)] pt-5">
              <button
                type="button"
                onClick={goBack}
                className="bg-transparent p-0 text-[0.5rem] uppercase tracking-[0.2em] text-[var(--text-light)]"
                disabled={saving}
              >
                ← Back
              </button>
              <button
                type="submit"
                className="border border-[var(--rose-gold)] bg-[var(--rose-gold)] px-6 py-2.5 text-[0.5rem] font-medium uppercase tracking-[0.2em] text-[var(--dark)] transition-colors hover:border-[var(--dark)] hover:bg-[var(--dark)] hover:text-[var(--rose-gold)]"
                disabled={saving}
              >
                {saving ? "Sending…" : "Submit ✦"}
              </button>
            </div>
          </section>
        )}
      </form>
    </div>
  );
}
