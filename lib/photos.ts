export type IntakePhoto = {
  mime: "image/jpeg" | "image/png" | "image/webp";
  data: string;
};

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_BYTES = 900_000;

function byteLengthFromBase64(b64: string): number {
  const clean = b64.replace(/\s/g, "");
  const padding = clean.endsWith("==") ? 2 : clean.endsWith("=") ? 1 : 0;
  return Math.floor((clean.length * 3) / 4) - padding;
}

export function parseIntakePhoto(
  raw: unknown,
  label: string
): { ok: true; v: IntakePhoto } | { ok: false; error: string } {
  if (!raw || typeof raw !== "object") {
    return { ok: false, error: `${label} is required` };
  }
  const o = raw as { mime?: unknown; data?: unknown };
  if (typeof o.mime !== "string" || !ALLOWED.has(o.mime)) {
    return { ok: false, error: `${label} must be a JPEG, PNG, or WebP image` };
  }
  if (typeof o.data !== "string" || o.data.length < 32) {
    return { ok: false, error: `${label} is required` };
  }
  const data = o.data.replace(/\s/g, "");
  if (!/^[A-Za-z0-9+/]+=*$/.test(data)) {
    return { ok: false, error: `${label} is not a valid image` };
  }
  if (byteLengthFromBase64(data) > MAX_BYTES) {
    return { ok: false, error: `${label} is too large. Please use a smaller photo.` };
  }
  return { ok: true, v: { mime: o.mime as IntakePhoto["mime"], data } };
}

export function photoExtension(mime: IntakePhoto["mime"]): string {
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  return "jpg";
}
