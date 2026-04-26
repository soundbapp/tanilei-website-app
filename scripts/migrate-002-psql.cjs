/**
 * Run 002 with psql (Neon / Postgres). More reliable than WS-based client in some envs.
 * Usage: node --env-file=.env.local ./scripts/migrate-002-psql.cjs
 */
const { readFileSync } = require("node:fs");
const { execFileSync } = require("node:child_process");
const { join } = require("node:path");

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("Missing DATABASE_URL");
  process.exit(1);
}

const file = join(__dirname, "..", "db/migrations/002_appointment_intake.sql");
execFileSync("psql", [url, "-f", file, "-v", "ON_ERROR_STOP=1"], { stdio: "inherit" });
console.log("OK: migration 002 applied.");
