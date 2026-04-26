import { Resend } from "resend";
import {
  briefSection,
  ctaBlock,
  dataRow,
  pBlock,
  pMuted,
  wrapPremiumEmail,
} from "./email-templates";
import type { IntakeV2 } from "./intake";

const OUTLOOK_CC = "tanileibeauty@outlook.com";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

/** Deduplicate addresses (Resend can reject or duplicate deliveries if `to` repeats). */
function dedupeEmails(addresses: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of addresses) {
    const a = raw.trim();
    if (!a) continue;
    const k = a.toLowerCase();
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(a);
  }
  return out;
}

/**
 * "From" must use an address on a domain verified in the Resend dashboard
 * (or Resend’s test sender, depending on your account).
 */
export function getFromAddress(): string {
  let v = process.env.EMAIL_FROM?.trim() || "Tani/Lei <hello@tanilei.com>";
  if (
    (v.startsWith('"') && v.endsWith('"')) ||
    (v.startsWith("'") && v.endsWith("'"))
  ) {
    v = v.slice(1, -1).trim();
  }
  return v;
}

/**
 * Comma- or semicolon-separated NOTIFY_EMAIL in env (e.g. team inboxes + Gmail).
 * Outlook in code is always merged in; duplicates are removed.
 */
function parseNotifyEmailsFromEnv(): string[] {
  const raw = process.env.NOTIFY_EMAIL?.trim();
  if (!raw) return ["delivered@resend.dev"];
  return raw
    .split(/[;,]/)
    .map((a) => a.trim())
    .filter(Boolean);
}

export function getNotifyDestinations(): string[] {
  return dedupeEmails([...parseNotifyEmailsFromEnv(), OUTLOOK_CC]);
}

/** BCC on guest-facing confirmations so the team gets a copy of what the guest received. */
function getGuestConfirmationBcc(): string[] {
  return dedupeEmails([...parseNotifyEmailsFromEnv(), OUTLOOK_CC]);
}

export async function sendWaitlistRequest(visitorEmail: string) {
  const resend = getResend();
  if (!resend) {
    return { ok: false as const, error: "Resend is not configured" };
  }
  const from = getFromAddress();
  const to = getNotifyDestinations();

  const businessHtml = wrapPremiumEmail({
    preheader: "Someone joined the Tani/Lei request list on the site.",
    eyebrow: "Priority list",
    title: "New request",
    innerHtml: `
      ${pBlock("A new guest is asking for early access, priority booking, and the complimentary beauty consultation.", { emphasis: false })}
      ${dataRow("Email", visitorEmail)}
      ${pMuted("Reply to the sender address to reach this guest directly from your mail client.")}
    `,
  });

  const businessText = `Tani/Lei — new list request
Email: ${visitorEmail}
Reply to this email to contact them (Reply-To is set to their address).`;

  const { data, error } = await resend.emails.send({
    from,
    to,
    replyTo: visitorEmail,
    subject: `Tani/Lei — new list request from ${visitorEmail}`,
    text: businessText,
    html: businessHtml,
  });
  if (error) {
    return { ok: false as const, error: error.message };
  }

  const guestHtml = wrapPremiumEmail({
    preheader: "We’ll be in touch with early access and your beauty consultation.",
    eyebrow: "Begin your journey",
    title: "We received your request",
    innerHtml: `
      ${pBlock("Thank you for your interest in Tani/Lei. We’ve added you to the list and will be in touch soon with early access, priority booking, and your complimentary beauty consultation.", { emphasis: false })}
      ${pMuted("With care,")}
    `,
  });

  const guestText = `We received your request — Tani/Lei

Thank you for your interest. We'll be in touch soon with early access, priority booking, and your complimentary beauty consultation.

With care,
Tani/Lei
hello@tanilei.com · 202-510-8945`;

  const { error: confirmError } = await resend.emails.send({
    from,
    to: [visitorEmail],
    bcc: getGuestConfirmationBcc(),
    subject: "We received your request — Tani/Lei",
    text: guestText,
    html: guestHtml,
  });
  if (confirmError) {
    console.warn("Resend confirmation error (notification still sent):", confirmError);
  }
  return { ok: true as const, id: data?.id };
}

type AppointmentPayload = {
  startsAt: Date;
  endsAt: Date;
  customerName: string;
  customerEmail: string;
  phone: string;
  notes: string;
  /** Private pre-visit form link (include in guest confirmation). */
  intakeUrl: string;
};

export async function sendAppointmentNotifications(a: AppointmentPayload) {
  const resend = getResend();
  if (!resend) {
    return { ok: false as const, error: "Resend is not configured" };
  }
  const from = getFromAddress();
  const to = getNotifyDestinations();
  const when = a.startsAt.toLocaleString("en-US", {
    timeZone: "America/New_York",
    dateStyle: "full",
    timeStyle: "short",
  });

  const businessHtml = wrapPremiumEmail({
    preheader: `New visit booked: ${when} Eastern`,
    eyebrow: "Appointments",
    title: "New booking",
    innerHtml: `
      ${pBlock("A guest has reserved a time on the calendar. Details are below.", { emphasis: false })}
      ${dataRow("Date & time (Eastern)", when)}
      ${dataRow("Name", a.customerName)}
      ${dataRow("Email", a.customerEmail)}
      ${dataRow("Phone", a.phone || "—")}
      ${dataRow("Notes", a.notes || "—")}
      ${pMuted("Reply to the guest with their email in Reply-To from your client.")}
    `,
  });

  const businessText = `Tani/Lei — new appointment

Date & time (Eastern): ${when}
Name: ${a.customerName}
Email: ${a.customerEmail}
Phone: ${a.phone || "—"}
Notes: ${a.notes || "—"}`;

  const { data, error } = await resend.emails.send({
    from,
    to,
    replyTo: a.customerEmail,
    subject: `Tani/Lei — new appointment, ${when}`,
    text: businessText,
    html: businessHtml,
  });
  if (error) {
    return { ok: false as const, error: error.message };
  }

  const first = a.customerName.split(/\s+/)[0] || "there";
  const guestHtml = wrapPremiumEmail({
    preheader: `You’re set for ${when} Eastern. We’ll see you then.`,
    eyebrow: "Your visit",
    title: "You’re on the books",
    innerHtml: `
      ${pBlock(`Hi ${first},`)}
      ${pBlock("Your time is held on our calendar. We’re looking forward to welcoming you to your Tani/Lei experience.", { emphasis: false })}
      ${dataRow("Reserved for (Eastern)", when)}
      ${ctaBlock(
        "Before your visit, share a few details (about 2 minutes) so we can prepare for you — skin, hair, and any history we should know.",
        a.intakeUrl
      )}
      ${pMuted("If you need to change this time, reply to this message or call us and we’ll help.")}
    `,
  });

  const guestText = `Hi ${first},

Your Tani/Lei appointment is confirmed.

When (Eastern): ${when}

Pre-visit form (2 minutes):
${a.intakeUrl}

If you need to change your visit, reply to this email or call 202-510-8945.

Tani/Lei
hello@tanilei.com`;

  const { error: gErr } = await resend.emails.send({
    from,
    to: [a.customerEmail],
    bcc: getGuestConfirmationBcc(),
    subject: "Your Tani/Lei visit is confirmed",
    text: guestText,
    html: guestHtml,
  });
  if (gErr) {
    console.warn("Guest confirmation email failed (business still notified):", gErr);
  }
  return { ok: true as const, id: data?.id };
}

const OPENNESS_PHRASE: Record<1 | 2 | 3 | 4 | 5, string> = {
  1: "1/5 — wants something specific",
  2: "2/5",
  3: "3/5",
  4: "4/5",
  5: "5/5 — very open to professional guidance",
};

function colorTreatedLine(a: IntakeV2): string | null {
  if (a.colorTreated === "recent") return "Color: recently colored";
  if (a.colorTreated === "grown") return "Color: grown out / previously colored";
  if (a.colorTreated === "natural") return "Color: natural";
  return null;
}

function buildIntakeBriefHtml(a: IntakeV2, when: string, bookingName: string) {
  const fullName = `${a.firstName} ${a.lastName}`.trim();
  const clientLine = fullName || bookingName;

  const hairLines: string[] = [];
  const typeLen = [a.hairType, a.hairLength && `Length: ${a.hairLength}`]
    .filter(Boolean)
    .join(" · ");
  if (typeLen) hairLines.push(typeLen);
  if (a.concerns.length) {
    hairLines.push(`Concerns: ${a.concerns.join(", ")}`);
  }
  const colorLine = colorTreatedLine(a);
  if (colorLine) hairLines.push(colorLine);
  if (a.chemicals.length) {
    hairLines.push(`Chemicals (6 mo.): ${a.chemicals.join(", ")}`);
  }

  const goalLines: string[] = [a.goals.trim() || "—"];
  if (a.inspirationUrl.trim()) {
    goalLines.push(`Inspiration: ${a.inspirationUrl.trim()}`);
  }
  if (a.usualStyle.length) {
    goalLines.push(`Usual style: ${a.usualStyle.join(", ")}`);
  }
  goalLines.push(`Open to recommendations: ${OPENNESS_PHRASE[a.openness]}`);
  if (a.addOns.length) {
    goalLines.push(`Add-ons: ${a.addOns.join(", ")}`);
  }
  if (a.visitNotes.trim()) {
    goalLines.push(`Visit notes: ${a.visitNotes.trim()}`);
  }

  const flags: string[] = [];
  if (a.allergies.trim()) {
    flags.push(`Allergies / sensitivities: ${a.allergies.trim()}`);
  } else {
    flags.push("No allergies noted");
  }

  const meta: string[] = [
    a.firstVisit === "first" ? "First visit" : "Returning",
    a.referral.length ? `Heard about us: ${a.referral.join(", ")}` : "Referral: —",
    `Reminders: ${
      a.reminderPref === "sms"
        ? "Text/SMS"
        : a.reminderPref === "email"
          ? "Email"
          : "Text + email"
    }`,
    `Beauty kit: ${
      a.kitInterest === "yes" ? "Yes" : a.kitInterest === "maybe" ? "Maybe later" : "Not now"
    }`,
  ];

  const noteTani = a.noteToTani.trim();
  const noteBlock =
    noteTani.length > 0
      ? dataRow(
          "Note to Tani",
          noteTani.length > 800 ? `${noteTani.slice(0, 800)}…` : noteTani
        )
      : "";

  return `
    ${pBlock(`Client — ${clientLine}`, { emphasis: true })}
    ${dataRow("Appointment (Eastern)", when)}
    ${dataRow("On file (booking)", bookingName)}
    ${dataRow("Email", a.email)}
    ${dataRow("Phone", a.phone?.trim() || "—")}
    ${briefSection("Flags", flags)}
    ${briefSection("Hair", hairLines.length ? hairLines : ["—"])}
    ${briefSection("Goals & visit", goalLines.filter(Boolean) as string[])}
    ${briefSection("Logistics", meta)}
    ${noteBlock}
    ${pMuted("Reply to the guest using Reply-To. The full form is saved on the appointment record.")}
  `;
}

function buildIntakeBriefText(a: IntakeV2, when: string, bookingName: string) {
  const fullName = `${a.firstName} ${a.lastName}`.trim();
  const ct = colorTreatedLine(a);
  return `Tani/Lei — pre-visit brief
Appointment (Eastern): ${when}
Client: ${fullName || bookingName}
On file: ${bookingName}
${a.email} · ${a.phone?.trim() || "no phone"}

HAIR: ${a.hairType} · ${a.hairLength || "length n/a"}${
    a.concerns.length ? ` | Concerns: ${a.concerns.join(", ")}` : ""
  }
${ct ? `${ct}\n` : ""}Chemicals: ${a.chemicals.join(", ") || "—"}

GOALS: ${a.goals}
${
  a.inspirationUrl.trim() ? `Inspiration: ${a.inspirationUrl}\n` : ""
}Open: ${OPENNESS_PHRASE[a.openness]}
Add-ons: ${a.addOns.join(", ") || "—"}
${
  a.visitNotes.trim() ? `Visit notes: ${a.visitNotes}\n` : ""
}FLAGS / allergies: ${a.allergies.trim() || "—"}
Logistics: ${a.firstVisit} · ${
    a.referral.length ? a.referral.join(", ") : "—"
  } · Reminders: ${a.reminderPref} · Kit: ${a.kitInterest}
${
  a.noteToTani.trim() ? `Note to Tani: ${a.noteToTani}\n` : ""
}`;
}

export async function sendIntakeToTeam(payload: {
  when: string;
  customerName: string;
  customerEmail: string;
  phone: string;
  answers: IntakeV2;
}) {
  const resend = getResend();
  if (!resend) {
    return { ok: false as const, error: "Resend is not configured" };
  }
  const from = getFromAddress();
  const to = getNotifyDestinations();
  const a = payload.answers;
  const displayName = `${a.firstName} ${a.lastName}`.trim() || payload.customerName;
  const businessHtml = wrapPremiumEmail({
    preheader: `${displayName} · ${payload.when} · flags & hair at a glance`,
    eyebrow: "Pre-visit",
    title: "Client brief",
    innerHtml: buildIntakeBriefHtml(a, payload.when, payload.customerName),
  });

  const businessText = buildIntakeBriefText(
    a,
    payload.when,
    payload.customerName
  );

  const { data, error } = await resend.emails.send({
    from,
    to,
    replyTo: a.email.trim() || payload.customerEmail,
    subject: `Tani/Lei — pre-visit: ${displayName} · ${payload.when}`,
    text: businessText,
    html: businessHtml,
  });
  if (error) {
    return { ok: false as const, error: error.message };
  }
  return { ok: true as const, id: data?.id };
}
