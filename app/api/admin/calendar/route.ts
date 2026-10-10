import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { formatLongYmd, nextAvailableYmd } from "@/lib/calendar";
import { getCalendarState, patchCalendarState } from "@/lib/calendar-store";
import { parseYmd } from "@/lib/availability";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const denied = requireAdmin(request);
  if (denied) return denied;
  const calendar = await getCalendarState();
  const nextOpen = nextAvailableYmd(calendar, new Date());
  return NextResponse.json({
    unavailableUntil: calendar.unavailableUntil,
    overrides: calendar.overrides,
    nextAvailableDate: nextOpen,
    nextAvailableLabel: nextOpen ? formatLongYmd(nextOpen) : null,
  });
}

export async function PATCH(request: Request) {
  const denied = requireAdmin(request);
  if (denied) return denied;
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const patch: {
    unavailableUntil?: string;
    setOverrides?: { day: string; status: "open" | "closed" }[];
    clearOverrides?: string[];
  } = {};

  if (body.unavailableUntil !== undefined) {
    if (typeof body.unavailableUntil !== "string" || !parseYmd(body.unavailableUntil)) {
      return NextResponse.json(
        { error: "unavailableUntil must be YYYY-MM-DD" },
        { status: 400 }
      );
    }
    patch.unavailableUntil = body.unavailableUntil;
  }

  if (Array.isArray(body.setOverrides)) {
    patch.setOverrides = [];
    for (const item of body.setOverrides) {
      if (!item || typeof item !== "object") continue;
      const rec = item as { day?: unknown; status?: unknown };
      if (typeof rec.day !== "string" || !parseYmd(rec.day)) continue;
      if (rec.status !== "open" && rec.status !== "closed") continue;
      patch.setOverrides.push({ day: rec.day, status: rec.status });
    }
  }

  if (Array.isArray(body.clearOverrides)) {
    patch.clearOverrides = body.clearOverrides.filter(
      (d): d is string => typeof d === "string" && Boolean(parseYmd(d))
    );
  }

  try {
    const calendar = await patchCalendarState(patch);
    const nextOpen = nextAvailableYmd(calendar, new Date());
    return NextResponse.json({
      unavailableUntil: calendar.unavailableUntil,
      overrides: calendar.overrides,
      nextAvailableDate: nextOpen,
      nextAvailableLabel: nextOpen ? formatLongYmd(nextOpen) : null,
    });
  } catch (err) {
    console.error("calendar patch failed:", err);
    return NextResponse.json(
      { error: "Could not save calendar. Check DATABASE_URL or file permissions." },
      { status: 500 }
    );
  }
}
