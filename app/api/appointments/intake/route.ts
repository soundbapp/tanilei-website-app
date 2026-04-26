import { NextResponse } from "next/server";
import { getDb, isDatabaseConfigured } from "@/lib/db";
import { sendIntakeToTeam } from "@/lib/email";
import { parseIntakeBody } from "@/lib/intake";
import { BUSINESS_TZ } from "@/lib/availability";

export const dynamic = "force-dynamic";

const DEFAULT_SERVICE_LABEL = "Hair Styling & Treatment";

type ApptRow = {
  starts_at: string;
  intake_submitted_at: string | null;
  customer_name: string;
  customer_email: string | null;
};

function getStylistNameFromEnv(): string {
  return (
    process.env.INTAKE_STYLIST_NAME?.trim() ||
    process.env.NEXT_PUBLIC_STYLIST_NAME?.trim() ||
    "Tani Abdu"
  );
}

function getToken(request: Request): string | null {
  const u = new URL(request.url);
  return u.searchParams.get("t") || u.searchParams.get("token");
}

function formatWhen(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    timeZone: BUSINESS_TZ,
    dateStyle: "full",
    timeStyle: "short",
  });
}

export async function GET(request: Request) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { error: "Not configured" },
      { status: 503 }
    );
  }
  const token = getToken(request);
  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }

  const sql = getDb();
  const rows = await sql`
    SELECT starts_at, intake_submitted_at, customer_name, customer_email
    FROM appointments
    WHERE intake_token = ${token}
    LIMIT 1
  `;
  const row = (rows as ApptRow[])[0];
  if (!row) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const first = row.customer_name.split(/\s+/)[0] || "there";
  return NextResponse.json({
    submitted: Boolean(row.intake_submitted_at),
    whenLabel: formatWhen(row.starts_at),
    firstName: first,
    customerName: row.customer_name,
    serviceLabel: DEFAULT_SERVICE_LABEL,
    stylistName: getStylistNameFromEnv(),
    emailHint: row.customer_email?.trim() || "",
    timeZone: BUSINESS_TZ,
  });
}

export async function POST(request: Request) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { error: "Not configured" },
      { status: 503 }
    );
  }
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { error: "Email is not configured" },
      { status: 500 }
    );
  }

  let body: { token?: string; answers?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const token =
    typeof body.token === "string" ? body.token.trim() : "";
  if (!token) {
    return NextResponse.json({ error: "token is required" }, { status: 400 });
  }

  const parsed = parseIntakeBody(body.answers);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const sql = getDb();
  const jsonStr = JSON.stringify(parsed.answers);

  const updated = await sql`
    UPDATE appointments
    SET intake_answers = ${jsonStr}::jsonb,
        intake_submitted_at = now()
    WHERE intake_token = ${token}
      AND intake_submitted_at IS NULL
    RETURNING id, customer_name, customer_email, phone, starts_at
  `;

  const row = (updated as {
    id: string;
    customer_name: string;
    customer_email: string;
    phone: string | null;
    starts_at: string;
  }[])[0];

  if (!row) {
    const again = await sql`
      SELECT intake_submitted_at FROM appointments WHERE intake_token = ${token} LIMIT 1
    `;
    const r = (again as { intake_submitted_at: string | null }[])[0];
    if (r?.intake_submitted_at) {
      return NextResponse.json(
        { error: "This form was already submitted." },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const when = formatWhen(row.starts_at);
  const emailResult = await sendIntakeToTeam({
    when,
    customerName: row.customer_name,
    customerEmail: row.customer_email,
    phone: row.phone || "",
    answers: parsed.answers,
  });
  if (!emailResult.ok) {
    console.error("Intake team email failed:", emailResult.error);
  }

  return NextResponse.json({
    success: true,
    id: row.id,
    emailError: !emailResult.ok,
  });
}
