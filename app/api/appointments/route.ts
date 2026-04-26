import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { getDb, isDatabaseConfigured } from "@/lib/db";
import { isValidSlotWindow } from "@/lib/availability";
import { getFreeSlotsForDate } from "@/lib/appointments-queries";
import { sendAppointmentNotifications } from "@/lib/email";
import { formatInTimeZone } from "date-fns-tz";
import { BUSINESS_TZ } from "@/lib/availability";
import { getSiteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isUniqueViolation(e: unknown): boolean {
  const o = e as { code?: string; message?: string };
  if (o?.code === "23505") return true;
  if (typeof o?.message === "string" && /duplicate|unique/i.test(o.message)) {
    return true;
  }
  return false;
}

export async function POST(request: Request) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { error: "Booking is not configured. Set DATABASE_URL." },
      { status: 503 }
    );
  }
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { error: "Email is not configured" },
      { status: 500 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const startsAtRaw = body.startsAt;
  const endsAtRaw = body.endsAt;
  if (typeof startsAtRaw !== "string" || typeof endsAtRaw !== "string") {
    return NextResponse.json(
      { error: "startsAt and endsAt (ISO strings) are required" },
      { status: 400 }
    );
  }
  const startsAt = new Date(startsAtRaw);
  const endsAt = new Date(endsAtRaw);
  if (Number.isNaN(startsAt.getTime()) || Number.isNaN(endsAt.getTime())) {
    return NextResponse.json({ error: "Invalid date" }, { status: 400 });
  }

  const now = new Date();
  if (!isValidSlotWindow(startsAt, endsAt, now)) {
    return NextResponse.json(
      { error: "That time is not available for booking" },
      { status: 400 }
    );
  }

  const ymd = formatInTimeZone(startsAt, BUSINESS_TZ, "yyyy-MM-dd");
  const free = await getFreeSlotsForDate(ymd, now);
  if (!free.some((s) => s.start === startsAt.toISOString())) {
    return NextResponse.json(
      { error: "That slot was just taken. Please pick another time." },
      { status: 409 }
    );
  }

  const customerName =
    typeof body.customerName === "string" ? body.customerName.trim() : "";
  const customerEmail =
    typeof body.customerEmail === "string" ? body.customerEmail.trim() : "";
  const phone =
    typeof body.phone === "string" ? body.phone.trim() : "";
  const notes = typeof body.notes === "string" ? body.notes.trim() : "";
  if (!customerName) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }
  if (!customerEmail || !EMAIL_RE.test(customerEmail)) {
    return NextResponse.json(
      { error: "A valid email is required" },
      { status: 400 }
    );
  }

  const intakeToken = randomBytes(32).toString("base64url");
  const intakeUrl = `${getSiteUrl()}/pre-visit?t=${encodeURIComponent(intakeToken)}`;

  const sql = getDb();
  try {
    const rows = await sql`
      INSERT INTO appointments (starts_at, ends_at, customer_name, customer_email, phone, notes, intake_token)
      VALUES (
        ${startsAt.toISOString()}::timestamptz,
        ${endsAt.toISOString()}::timestamptz,
        ${customerName},
        ${customerEmail},
        ${phone || null},
        ${notes || null},
        ${intakeToken}
      )
      RETURNING id
    `;
    const id = (rows as { id: string }[])[0]?.id;
    const notify = await sendAppointmentNotifications({
      startsAt,
      endsAt,
      customerName,
      customerEmail,
      phone,
      notes,
      intakeUrl,
    });
    if (!notify.ok) {
      console.error("Appointment email failed after insert:", notify.error);
    }
    return NextResponse.json({
      success: true,
      id,
      emailError: !notify.ok,
    });
  } catch (e) {
    if (isUniqueViolation(e)) {
      return NextResponse.json(
        { error: "That slot was just taken. Please pick another time." },
        { status: 409 }
      );
    }
    console.error("Appointment insert error:", e);
    return NextResponse.json({ error: "Could not book this time" }, { status: 500 });
  }
}
