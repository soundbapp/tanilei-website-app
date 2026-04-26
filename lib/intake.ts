/**
 * Pre-visit intake v2 (schemaVersion: 2) — appointments.intake_answers JSONB.
 * Legacy v1 (top-level string keys, no schemaVersion) is rejected on new POSTs.
 */

export const INTAKE_SCHEMA_VERSION = 2 as const;

export const REFERRAL_OPTIONS = [
  "Instagram",
  "TikTok",
  "A friend",
  "Google",
  "I'm a returning client",
  "Other",
] as const;

export const HAIR_TYPE_OPTIONS = [
  "Fine",
  "Medium",
  "Thick",
  "Coily / 4C",
  "Wavy",
  "Curly",
] as const;

export const HAIR_LENGTH_OPTIONS = [
  "Short",
  "Shoulder",
  "Mid-back",
  "Long",
] as const;

export const CONCERN_OPTIONS = [
  "Damage / Breakage",
  "Dryness",
  "Scalp health",
  "Thinning",
  "Growth",
  "Color maintenance",
  "Frizz",
  "None right now",
] as const;

export const CHEMICAL_OPTIONS = [
  "Relaxer",
  "Keratin / Smoothing",
  "Texturizer",
  "None",
] as const;

export const STYLE_OPTIONS = [
  "Natural / Effortless",
  "Polished / Classic",
  "Bold / Expressive",
  "Glamorous",
  "Low maintenance",
  "Still figuring it out",
] as const;

export const ADDON_OPTIONS = [
  "Scalp treatment",
  "Deep conditioning",
  "Wig install or style",
  "Nails",
  "Lash extensions",
  "Brow design",
  "Not today",
] as const;

export type IntakeV2 = {
  schemaVersion: typeof INTAKE_SCHEMA_VERSION;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  firstVisit: "first" | "returning";
  referral: string[];

  hairType: string;
  hairLength: string;
  concerns: string[];
  colorTreated: "recent" | "grown" | "natural" | "";
  chemicals: string[];
  allergies: string;

  goals: string;
  inspirationUrl: string;
  usualStyle: string[];
  openness: 1 | 2 | 3 | 4 | 5;
  addOns: string[];
  visitNotes: string;

  reminderPref: "sms" | "email" | "both";
  kitInterest: "yes" | "maybe" | "no";
  noteToTani: string;
};

const MAX_LONG = 5000;
const MAX_MED = 2000;
const MAX_ARR = 20;

function str(v: unknown, max: number, req: string): { ok: true; v: string } | { ok: false; error: string } {
  if (typeof v !== "string") return { ok: false, error: req };
  const t = v.trim();
  if (t.length > max) return { ok: false, error: req };
  return { ok: true, v: t };
}

function strOpt(v: unknown, max: number): string {
  if (typeof v !== "string") return "";
  return v.trim().slice(0, max);
}

function isV1Legacy(o: Record<string, unknown>): boolean {
  return (
    o.schemaVersion === undefined &&
    (o.allergies !== undefined || o.goals !== undefined) &&
    o.firstName === undefined
  );
}

function pickChips(
  v: unknown,
  allowed: readonly string[],
  label: string,
  required = false
): { ok: true; v: string[] } | { ok: false; error: string } {
  if (!Array.isArray(v)) {
    if (required) return { ok: false, error: `${label} is required` };
    return { ok: true, v: [] };
  }
  if (v.length > MAX_ARR) return { ok: false, error: `Too many ${label}` };
  const out: string[] = [];
  for (const item of v) {
    if (typeof item !== "string") return { ok: false, error: `Invalid ${label}` };
    const t = item.trim();
    if (!t) continue;
    if (t.length > 200) return { ok: false, error: `Invalid ${label}` };
    if (!allowed.includes(t)) return { ok: false, error: `Invalid ${label} option` };
    if (!out.includes(t)) out.push(t);
  }
  if (required && out.length === 0) {
    return { ok: false, error: `Select at least one ${label}` };
  }
  return { ok: true, v: out };
}

export function parseIntakeBody(
  raw: unknown
): { ok: true; answers: IntakeV2 } | { ok: false; error: string } {
  if (raw === null || typeof raw !== "object") {
    return { ok: false, error: "Invalid answers" };
  }
  const o = raw as Record<string, unknown>;

  if (isV1Legacy(o)) {
    return {
      ok: false,
      error:
        "This form was updated. Please refresh the page to use the new questionnaire.",
    };
  }

  if (o.schemaVersion !== 2) {
    return { ok: false, error: "Invalid form version" };
  }

  const firstName = str(o.firstName, 120, "First name is required");
  if (!firstName.ok || !firstName.v) {
    return firstName.ok
      ? { ok: false, error: "First name is required" }
      : firstName;
  }

  const lastName = str(o.lastName, 120, "Last name is required");
  if (!lastName.ok || !lastName.v) {
    return lastName.ok
      ? { ok: false, error: "Last name is required" }
      : lastName;
  }

  const em = str(o.email, 320, "Email is required");
  if (!em.ok || !em.v) return em.ok ? { ok: false, error: "Email is required" } : em;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em.v)) {
    return { ok: false, error: "Invalid email" };
  }

  const phone = strOpt(o.phone, 40);
  if (o.firstVisit !== "first" && o.firstVisit !== "returning") {
    return { ok: false, error: "Please indicate if this is your first visit" };
  }
  const firstVisit = o.firstVisit;

  const ref = pickChips(o.referral, REFERRAL_OPTIONS as unknown as string[], "referral", false);
  if (!ref.ok) return ref;

  const hairTypeR = str(o.hairType, 80, "Hair type is required");
  if (!hairTypeR.ok || !hairTypeR.v) {
    return hairTypeR.ok
      ? { ok: false, error: "Hair type is required" }
      : hairTypeR;
  }
  if (!HAIR_TYPE_OPTIONS.includes(hairTypeR.v as (typeof HAIR_TYPE_OPTIONS)[number])) {
    return { ok: false, error: "Invalid hair type" };
  }
  const hairType = hairTypeR.v;

  const hairLength = strOpt(o.hairLength, 40);
  if (
    hairLength &&
    !HAIR_LENGTH_OPTIONS.includes(hairLength as (typeof HAIR_LENGTH_OPTIONS)[number])
  ) {
    return { ok: false, error: "Invalid hair length" };
  }

  const concerns = pickChips(
    o.concerns,
    CONCERN_OPTIONS as unknown as string[],
    "concern",
    false
  );
  if (!concerns.ok) return concerns;

  let colorTreated: "recent" | "grown" | "natural" | "" = "";
  if (o.colorTreated === "recent" || o.colorTreated === "grown" || o.colorTreated === "natural") {
    colorTreated = o.colorTreated;
  } else if (o.colorTreated !== "" && o.colorTreated != null) {
    return { ok: false, error: "Invalid color-treatment option" };
  }

  const chem = pickChips(
    o.chemicals,
    CHEMICAL_OPTIONS as unknown as string[],
    "chemicals",
    false
  );
  if (!chem.ok) return chem;

  const allergies = strOpt(o.allergies, MAX_MED);

  const goalsR = str(o.goals, MAX_LONG, "Goals for your visit are required");
  if (!goalsR.ok || !goalsR.v) {
    return goalsR.ok
      ? { ok: false, error: "What you want to achieve (Step 3) is required" }
      : goalsR;
  }

  const inspirationUrl = strOpt(o.inspirationUrl, 2000);
  if (inspirationUrl) {
    try {
      const u = new URL(inspirationUrl);
      if (u.protocol !== "http:" && u.protocol !== "https:") {
        return { ok: false, error: "Inspiration link must be http or https" };
      }
    } catch {
      return { ok: false, error: "Invalid inspiration link" };
    }
  }

  const usualStyle = pickChips(
    o.usualStyle,
    STYLE_OPTIONS as unknown as string[],
    "style",
    false
  );
  if (!usualStyle.ok) return usualStyle;

  if (typeof o.openness !== "number" || !Number.isInteger(o.openness)) {
    return { ok: false, error: "Openness 1–5 is required" };
  }
  if (o.openness < 1 || o.openness > 5) {
    return { ok: false, error: "Openness must be 1–5" };
  }
  const openness = o.openness as 1 | 2 | 3 | 4 | 5;

  const addOns = pickChips(
    o.addOns,
    ADDON_OPTIONS as unknown as string[],
    "add-on",
    false
  );
  if (!addOns.ok) return addOns;

  const visitNotes = strOpt(o.visitNotes, MAX_MED);

  if (o.reminderPref !== "sms" && o.reminderPref !== "email" && o.reminderPref !== "both") {
    return { ok: false, error: "Reminder preference is required" };
  }
  if (o.kitInterest !== "yes" && o.kitInterest !== "maybe" && o.kitInterest !== "no") {
    return { ok: false, error: "Kit interest is required" };
  }
  const noteToTani = strOpt(o.noteToTani, MAX_LONG);

  return {
    ok: true,
    answers: {
      schemaVersion: 2,
      firstName: firstName.v,
      lastName: lastName.v,
      email: em.v,
      phone,
      firstVisit,
      referral: ref.v,
      hairType,
      hairLength,
      concerns: concerns.v,
      colorTreated,
      chemicals: chem.v,
      allergies,
      goals: goalsR.v,
      inspirationUrl,
      usualStyle: usualStyle.v,
      openness,
      addOns: addOns.v,
      visitNotes,
      reminderPref: o.reminderPref,
      kitInterest: o.kitInterest,
      noteToTani,
    },
  };
}

/** Export field lists for the client form (reference). */
export const INTAKE_V2 = {
  REFERRAL_OPTIONS,
  HAIR_TYPE_OPTIONS,
  HAIR_LENGTH_OPTIONS,
  CONCERN_OPTIONS,
  CHEMICAL_OPTIONS,
  STYLE_OPTIONS,
  ADDON_OPTIONS,
} as const;
