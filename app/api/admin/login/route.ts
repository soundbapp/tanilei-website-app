import { NextResponse } from "next/server";
import {
  applySessionCookie,
  createSessionToken,
  isAdminPasswordConfigured,
  verifyAdminPassword,
} from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!isAdminPasswordConfigured()) {
    return NextResponse.json(
      {
        error:
          "Staff login is not configured. Set TANI_ADMIN_PASSWORD on the server.",
      },
      { status: 503 }
    );
  }
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const password = typeof body.password === "string" ? body.password : "";
  if (!verifyAdminPassword(password)) {
    return NextResponse.json({ error: "That password is not right." }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  return applySessionCookie(res, createSessionToken());
}
