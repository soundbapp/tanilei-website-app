/**
 * Branded HTML for transactional email — mirrors site tokens from styles/globals.css
 * (cream, rose gold, deep rose, dark; Cormorant + Montserrat via Google Fonts for clients that load them).
 */

const CREAM = "#faf6f3";
const DARK = "#2a1f1a";
const ROSE_GOLD = "#c9a99a";
const ROSE_DEEP = "#a07060";
const TEXT = "#3d2b22";
const TEXT_LIGHT = "#7a5c50";
const BG_MIST = "#e8d5cc";

const FONT_SANS =
  "Montserrat, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
const FONT_SERIF = "'Cormorant Garamond', Georgia, 'Times New Roman', serif";

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function wrapPremiumEmail({
  preheader,
  eyebrow,
  title,
  innerHtml,
}: {
  preheader: string;
  eyebrow: string;
  title: string;
  /** Safe HTML: escape user data before passing in. */
  innerHtml: string;
}): string {
  const p = escapeHtml(preheader);
  const e = escapeHtml(eyebrow);
  const t = escapeHtml(title);
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width" />
  <meta http-equiv="x-ua-compatible" content="ie=edge" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&family=Montserrat:wght@200;300;400;500&display=swap" rel="stylesheet" />
  <title>${t}</title>
</head>
<body style="margin:0;padding:0;background-color:${BG_MIST};-webkit-text-size-adjust:100%;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${p}</div>
  <table role="presentation" width="100%" cellPadding="0" cellSpacing="0" style="background-color:${BG_MIST};background:linear-gradient(180deg, ${BG_MIST} 0%, ${CREAM} 40%, #f0e8e2 100%);">
    <tr>
      <td align="center" style="padding:40px 16px 48px;">
        <table role="presentation" width="100%" style="max-width:560px;border-collapse:collapse;background-color:${CREAM};border:1px solid ${ROSE_GOLD};box-shadow:0 8px 32px rgba(42,31,26,0.08);">
          <tr>
            <td style="height:3px;padding:0;background:linear-gradient(90deg, ${ROSE_GOLD} 0%, #e8d5cc 35%, ${ROSE_DEEP} 70%, ${ROSE_GOLD} 100%);line-height:3px;font-size:0;">&nbsp;</td>
          </tr>
          <tr>
            <td style="padding:36px 32px 8px 32px;">
              <p style="margin:0;font-family:${FONT_SANS};font-size:9px;letter-spacing:0.32em;text-transform:uppercase;color:${ROSE_DEEP};font-weight:500;">${e}</p>
              <h1 style="margin:10px 0 0 0;font-family:${FONT_SERIF};font-size:32px;font-weight:300;font-style:normal;color:${DARK};line-height:1.2;letter-spacing:-0.02em;">${t}</h1>
              <div style="margin-top:14px;height:1px;width:48px;background-color:${ROSE_GOLD};line-height:0;font-size:0;">&nbsp;</div>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 32px 0 32px;font-family:${FONT_SANS};font-size:15px;font-weight:300;line-height:1.85;color:${TEXT};">
              ${innerHtml}
            </td>
          </tr>
          <tr>
            <td style="padding:32px 32px 32px 32px;border-top:1px solid rgba(201,169,154,0.4);">
              <p style="margin:0 0 6px 0;font-family:${FONT_SANS};font-size:9px;letter-spacing:0.5em;text-transform:uppercase;color:${TEXT_LIGHT};">Tani/Lei</p>
              <p style="margin:0 0 16px 0;font-family:${FONT_SANS};font-size:12px;font-weight:300;font-style:italic;color:${ROSE_DEEP};line-height:1.5;">The Beauty Experience</p>
              <p style="margin:0;font-family:${FONT_SANS};font-size:11px;font-weight:300;color:${TEXT_LIGHT};line-height:1.7;">
                <a href="tel:2025108945" style="color:${ROSE_DEEP};text-decoration:none;">202-510-8945</a>
                <span style="color:${ROSE_GOLD};">&nbsp;&nbsp;·&nbsp;&nbsp;</span>
                <a href="mailto:hello@tanilei.com" style="color:${ROSE_DEEP};text-decoration:none;">hello@tanilei.com</a>
              </p>
            </td>
          </tr>
        </table>
        <p style="margin:20px 0 0 0;font-family:${FONT_SANS};font-size:10px;font-weight:300;color:${TEXT_LIGHT};text-align:center;max-width:480px;">You’re receiving this because of an action on tanilei.com or a request sent to Tani/Lei.</p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/** Paragraph with generous spacing, premium body copy. */
export function pBlock(text: string, opts?: { emphasis?: boolean }): string {
  const weight = opts?.emphasis ? "500" : "300";
  return `<p style="margin:0 0 18px 0;font-size:15px;font-weight:${weight};color:${TEXT};">${escapeHtml(
    text
  )}</p>`;
}

export function pMuted(text: string): string {
  return `<p style="margin:0 0 18px 0;font-size:14px;font-weight:300;font-style:italic;color:${TEXT_LIGHT};line-height:1.7;">${escapeHtml(
    text
  )}</p>`;
}

/** Titled block for the team “brief” (short lines, scannable in email). */
export function briefSection(title: string, lines: string[]): string {
  if (!lines.length) return "";
  const body = lines
    .filter((l) => l.length > 0)
    .map((l) => escapeHtml(l))
    .join("<br>");
  if (!body) return "";
  return `<div style="margin:0 0 20px 0;">
  <p style="margin:0 0 8px 0;font-family:Montserrat, sans-serif;font-size:9px;letter-spacing:0.2em;text-transform:uppercase;color:${ROSE_DEEP};font-weight:500;">${escapeHtml(
    title
  )}</p>
  <p style="margin:0;font-family:Montserrat, sans-serif;font-size:15px;font-weight:300;color:${TEXT};line-height:1.55;">${body}</p>
</div>`;
}

export function dataRow(
  label: string,
  value: string
): string {
  return `<table role="presentation" width="100%" cellPadding="0" cellSpacing="0" style="margin:0 0 14px 0;border-collapse:collapse;">
  <tr>
    <td style="padding:0 0 4px 0;font-family:Montserrat, sans-serif;font-size:9px;letter-spacing:0.2em;text-transform:uppercase;color:${ROSE_DEEP};font-weight:500;">${escapeHtml(
      label
    )}</td>
  </tr>
  <tr>
    <td style="padding:0;font-family:Montserrat, sans-serif;font-size:15px;font-weight:300;color:${TEXT};line-height:1.5;">${escapeHtml(
      value
    )}</td>
  </tr>
</table>`;
}

/** Primary CTA button (table cell) — link must be already safe (you control the URL). */
export function ctaBlock(label: string, href: string): string {
  const safe = escapeHtml(href);
  return `<table role="presentation" width="100%" cellPadding="0" cellSpacing="0" style="margin:24px 0;border-collapse:collapse;">
  <tr>
    <td align="center" style="padding:20px 16px;border:1px solid ${ROSE_GOLD};background-color:${CREAM};">
      <p style="margin:0 0 14px 0;font-family:${FONT_SANS};font-size:13px;font-weight:300;color:${TEXT};line-height:1.6;">${escapeHtml(
        label
      )}</p>
      <a href="${safe}" style="display:inline-block;padding:14px 28px;font-family:${FONT_SANS};font-size:10px;font-weight:500;letter-spacing:0.22em;text-transform:uppercase;color:#ffffff;background-color:${DARK};text-decoration:none;border:1px solid ${DARK};">Complete your pre-visit form</a>
    </td>
  </tr>
</table>`;
}
