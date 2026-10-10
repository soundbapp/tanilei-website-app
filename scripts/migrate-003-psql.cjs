/**
 * Run 003 with psql (Neon / Postgres).
 * Usage: node --env-file=.env.local ./scripts/migrate-003-psql.cjs
 */
const { execFileSync } = require("node:child_process");
const { join } = require("node:path");

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("Missing DATABASE_URL");
  process.exit(1);
}

const file = join(__dirname, "..", "db/migrations/003_calendar.sql");
execFileSync("psql", [url, "-f", file, "-v", "ON_ERROR_STOP=1"], { stdio: "inherit" });
console.log("OK: migration 003 applied.");
