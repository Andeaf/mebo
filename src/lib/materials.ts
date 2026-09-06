// Finish palettes shown in the "Productie" panel.
//
// Painted fronts: Mebo's production partner Global Design (Suceava) paints to
// the RAL Classic / NCS fan decks. The full RAL list lives in `ral.ts` and has
// its own page (/kleuren); the panel shows a short, kitchen-friendly selection.
import { ralByCode } from "./ral";

export const FEATURED_RAL = [
  "9010",
  "9001",
  "1013",
  "7044",
  "7038",
  "6021",
  "7016",
  "9005",
] as const;

export const PAINTED_COLORS = FEATURED_RAL.map(ralByCode);

// Veneered MDF panels — wood species, not a branded colour system.
export const VENEER_COLORS = [
  "#DCCBAA",
  "#C6A272",
  "#8A6A47",
  "#86503A",
  "#5C4531",
  "#43322B",
  "#2B241F",
] as const;

export function isLight(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6;
}
