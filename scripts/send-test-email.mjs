/**
 * One-off test: `node --env-file=.env.local ./scripts/send-test-email.mjs`
 * Requires Node 20+.
 */
import { Resend } from "resend";

const key = process.env.RESEND_API_KEY;
if (!key) {
  console.error("Missing RESEND_API_KEY. Run: node --env-file=.env.local ./scripts/send-test-email.mjs");
  process.exit(1);
}

const from = process.env.EMAIL_FROM?.trim() || "TaniLei <hello@tanilei.com>";
const raw = process.env.NOTIFY_EMAIL?.trim() || "hello@tanilei.com";
const to = [];
const seen = new Set();
for (const part of raw.split(/[;,]/)) {
  const a = part.trim();
  if (!a) continue;
  const k = a.toLowerCase();
  if (seen.has(k)) continue;
  seen.add(k);
  to.push(a);
}

const resend = new Resend(key);
const { data, error } = await resend.emails.send({
  from,
  to,
  subject: "[TaniLei] Test — Resend is working",
  html: `<p>This is a test from the TaniLei site repository (<code>scripts/send-test-email.mjs</code>).</p>
<p>If you see this, <strong>EMAIL_FROM</strong> and <strong>NOTIFY_EMAIL</strong> are loaded and your verified domain is sending mail correctly.</p>`,
  text: "TaniLei / Resend test — configuration OK.",
});

if (error) {
  console.error("Resend error:", error.message);
  process.exit(1);
}
console.log("Test email sent. Resend id:", data?.id);
console.log("To:", to.join(", "));
