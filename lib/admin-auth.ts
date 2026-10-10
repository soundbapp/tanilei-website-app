import { createHmac, randomBytes, timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";

export const ADMIN_COOKIE = "tani_admin";
const MAX_AGE_SEC = 60 * 60 * 24 * 7;

function sessionSecret(): string {
  return (
    process.env.TANI_SESSION_SECRET?.trim() ||
    process.env.TANI_ADMIN_PASSWORD?.trim() ||
    "tanilei-calendar-dev-secret"
  );
}

export function isAdminPasswordConfigured(): boolean {
  return Boolean(process.env.TANI_ADMIN_PASSWORD?.trim());
}

export function verifyAdminPassword(password: string): boolean {
  const expected = process.env.TANI_ADMIN_PASSWORD?.trim() || "";
  if (!expected || typeof password !== "string") return false;
  const a = Buffer.from(password);
  const b = Buffer.from(expected);
  if (a.length !== b.length) {
    timingSafeEqual(a.length > 0 ? a.subarray(0, 1) : Buffer.from([0]), Buffer.from([1]));
    return false;
  }
  return timingSafeEqual(a, b);
}

function sign(payloadB64: string): string {
  return createHmac("sha256", sessionSecret()).update(payloadB64).digest("base64url");
}

export function createSessionToken(): string {
  const payload = Buffer.from(
    JSON.stringify({
      exp: Date.now() + MAX_AGE_SEC * 1000,
      n: randomBytes(8).toString("hex"),
    }),
    "utf8"
  ).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function readSessionToken(token: string | undefined | null): boolean {
  if (!token || !token.includes(".")) return false;
  const [payload, mac] = token.split(".");
  if (!payload || !mac) return false;
  const expected = sign(payload);
  const a = Buffer.from(mac);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      exp?: number;
    };
    return typeof data.exp === "number" && data.exp > Date.now();
  } catch {
    return false;
  }
}

export function cookieFromRequest(request: Request): string | null {
  const header = request.headers.get("cookie") || "";
  const parts = header.split(";").map((p) => p.trim());
  for (const part of parts) {
    if (part.startsWith(`${ADMIN_COOKIE}=`)) {
      return decodeURIComponent(part.slice(ADMIN_COOKIE.length + 1));
    }
  }
  return null;
}

export function isAdminRequest(request: Request): boolean {
  return readSessionToken(cookieFromRequest(request));
}

export function requireAdmin(request: Request): NextResponse | null {
  if (isAdminRequest(request)) return null;
  return NextResponse.json({ error: "Please sign in." }, { status: 401 });
}

export function applySessionCookie(res: NextResponse, token: string | null): NextResponse {
  if (!token) {
    res.cookies.set(ADMIN_COOKIE, "", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0,
    });
    return res;
  }
  res.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SEC,
  });
  return res;
}
