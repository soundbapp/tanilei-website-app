/**
 * Public site base URL (no trailing slash). Used for pre-visit links in server-side email.
 *
 * Priority:
 * 1. `SITE_URL` or `NEXT_PUBLIC_SITE_URL` — set in Vercel for full control (e.g. https://www.tanilei.com).
 * 2. `VERCEL_PROJECT_PRODUCTION_URL` — Vercel’s **shortest production custom domain** when one is assigned
 *    (requires “System Environment Variables” enabled in Project → Settings → Environment Variables).
 * 3. `VERCEL_URL` — the deployment hostname (*.vercel.app); use only if no custom domain exists.
 * 4. Local dev: http://localhost:3001
 */
export function getSiteUrl(): string {
  const explicit =
    process.env.SITE_URL?.trim() ||
    process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) {
    return explicit.replace(/\/$/, "");
  }

  const host =
    process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim() ||
    process.env.VERCEL_URL?.trim();
  if (host) {
    const h = host.replace(/^https?:\/\//, "");
    return `https://${h}`.replace(/\/$/, "");
  }

  return "http://localhost:3001";
}
