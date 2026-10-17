export const SERVICE_MENU = [
  { name: "Women's Haircut", price: "$250+" },
  { name: "Silk Press", price: "$250+" },
  { name: "Keratin Treatment", price: "$500+" },
  { name: "Smoothening Treatment", price: "$225+" },
  { name: "Partial highlights", price: "$500+" },
  { name: "Full Highlights", price: "$700+" },
  { name: "Low Lights", price: "$300+" },
  { name: "Base color", price: "$200+" },
  { name: "Individual keratin bond extensions", price: "consultation needed" },
  { name: "Traditional sew in extensions", price: "consultation needed" },
  { name: "Tape in extensions", price: "consultation needed" },
  { name: "Color correction", price: "consultation needed" },
] as const;

export type ServiceMenuItem = (typeof SERVICE_MENU)[number];

export const SERVICE_OPTIONS = [
  ...SERVICE_MENU.map((s) => s.name),
  "Other",
] as const;

/** Older booking values still accepted on intake so in-flight forms keep working. */
export const LEGACY_SERVICE_OPTIONS = [
  "Hair Styling & Treatment",
  "Color",
  "Highlights",
  "Cut",
  "Wig install or style",
  "Weave or extensions",
  "Nails",
  "Lash Extensions",
  "Brow Design",
  "Virtual Consultation",
] as const;

export function isKnownService(name: string): boolean {
  return (
    (SERVICE_OPTIONS as readonly string[]).includes(name) ||
    (LEGACY_SERVICE_OPTIONS as readonly string[]).includes(name)
  );
}

export function serviceLabel(item: { name: string; price: string }): string {
  return item.price === "consultation needed"
    ? `${item.name} — consultation needed`
    : `${item.name} ${item.price}`;
}

export const HAIR_BIO_TAGS = [
  "Color treated",
  "Natural / virgin",
  "Highlights",
  "Lowlights",
  "Relaxed or chemically straightened",
  "Wig",
  "Weave",
  "Extensions",
  "Protective style",
  "Hair spray or heavy product",
] as const;

export const CONSULTATION_IN_CHAIR = [
  "Price for the service",
  "Timing for the visit",
  "Hair health and history",
  "What to expect moving forward",
  "When you should rebook",
] as const;
