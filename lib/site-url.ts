/**
 * Public site base URL (no trailing slash). Used for pre-visit links in server-side email.
 * Set SITE_URL in production. On Vercel, VERCEL_URL is used as fallback.
 */
export function getSiteUrl(): string {
  const raw =
    process.env.SITE_URL?.trim() ||
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`
      : "http://localhost:3001");
  return raw.replace(/\/$/, "");
}
