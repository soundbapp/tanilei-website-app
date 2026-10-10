import { mkdir, readFile, writeFile } from "fs/promises";
import { dirname, join } from "path";
import { getDb, isDatabaseConfigured } from "./db";
import {
  emptyCalendarState,
  INITIAL_UNAVAILABLE_UNTIL,
  type CalendarState,
  type DayOverrideStatus,
} from "./calendar";
import { parseYmd } from "./availability";

const FILE_PATH = join(process.cwd(), "data", "calendar-settings.json");

let schemaReady = false;

async function ensureSchema(): Promise<void> {
  if (schemaReady || !isDatabaseConfigured()) return;
  const sql = getDb();
  await sql`
    CREATE TABLE IF NOT EXISTS calendar_settings (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      unavailable_until DATE NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS calendar_day_overrides (
      day DATE PRIMARY KEY,
      status TEXT NOT NULL CHECK (status IN ('open', 'closed')),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
  await sql`
    INSERT INTO calendar_settings (id, unavailable_until)
    VALUES (1, ${INITIAL_UNAVAILABLE_UNTIL}::date)
    ON CONFLICT (id) DO NOTHING
  `;
  schemaReady = true;
}

async function readFileState(): Promise<CalendarState> {
  try {
    const raw = await readFile(FILE_PATH, "utf8");
    const parsed = JSON.parse(raw) as Partial<CalendarState>;
    return normalizeState(parsed);
  } catch {
    return emptyCalendarState();
  }
}

async function writeFileState(state: CalendarState): Promise<void> {
  await mkdir(dirname(FILE_PATH), { recursive: true });
  await writeFile(FILE_PATH, JSON.stringify(state, null, 2) + "\n", "utf8");
}

function normalizeState(input: Partial<CalendarState> | null | undefined): CalendarState {
  const unavailableUntil =
    typeof input?.unavailableUntil === "string" && parseYmd(input.unavailableUntil)
      ? input.unavailableUntil
      : INITIAL_UNAVAILABLE_UNTIL;
  const overrides: Record<string, DayOverrideStatus> = {};
  if (input?.overrides && typeof input.overrides === "object") {
    for (const [day, status] of Object.entries(input.overrides)) {
      if (!parseYmd(day)) continue;
      if (status === "open" || status === "closed") overrides[day] = status;
    }
  }
  return { unavailableUntil, overrides };
}

async function readDbState(): Promise<CalendarState> {
  await ensureSchema();
  const sql = getDb();
  const settings = (await sql`
    SELECT unavailable_until::text AS unavailable_until
    FROM calendar_settings
    WHERE id = 1
  `) as { unavailable_until: string }[];
  const rows = (await sql`
    SELECT day::text AS day, status
    FROM calendar_day_overrides
  `) as { day: string; status: DayOverrideStatus }[];
  const overrides: Record<string, DayOverrideStatus> = {};
  for (const row of rows) {
    const day = row.day.slice(0, 10);
    if (row.status === "open" || row.status === "closed") overrides[day] = row.status;
  }
  return normalizeState({
    unavailableUntil: settings[0]?.unavailable_until?.slice(0, 10),
    overrides,
  });
}

async function writeDbState(state: CalendarState): Promise<void> {
  await ensureSchema();
  const sql = getDb();
  await sql`
    INSERT INTO calendar_settings (id, unavailable_until, updated_at)
    VALUES (1, ${state.unavailableUntil}::date, now())
    ON CONFLICT (id) DO UPDATE SET
      unavailable_until = EXCLUDED.unavailable_until,
      updated_at = now()
  `;
  await sql`DELETE FROM calendar_day_overrides`;
  for (const [day, status] of Object.entries(state.overrides)) {
    await sql`
      INSERT INTO calendar_day_overrides (day, status, updated_at)
      VALUES (${day}::date, ${status}, now())
    `;
  }
}

export async function getCalendarState(): Promise<CalendarState> {
  if (isDatabaseConfigured()) {
    try {
      return await readDbState();
    } catch (err) {
      console.error("calendar_settings read failed, using file/default:", err);
    }
  }
  return readFileState();
}

export async function saveCalendarState(state: CalendarState): Promise<CalendarState> {
  const next = normalizeState(state);
  if (isDatabaseConfigured()) {
    await writeDbState(next);
    return next;
  }
  await writeFileState(next);
  return next;
}

export type CalendarPatch = {
  unavailableUntil?: string;
  setOverrides?: { day: string; status: DayOverrideStatus }[];
  clearOverrides?: string[];
};

export async function patchCalendarState(patch: CalendarPatch): Promise<CalendarState> {
  const current = await getCalendarState();
  if (patch.unavailableUntil) {
    const p = parseYmd(patch.unavailableUntil);
    if (!p) throw new Error("unavailableUntil must be YYYY-MM-DD");
    current.unavailableUntil = p;
  }
  if (patch.setOverrides) {
    for (const item of patch.setOverrides) {
      const day = parseYmd(item.day);
      if (!day) continue;
      if (item.status !== "open" && item.status !== "closed") continue;
      current.overrides[day] = item.status;
    }
  }
  if (patch.clearOverrides) {
    for (const day of patch.clearOverrides) {
      const p = parseYmd(day);
      if (p) delete current.overrides[p];
    }
  }
  return saveCalendarState(current);
}
