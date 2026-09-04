// Finish palettes shown in the "Productie" panel.
//
// Painted fronts: Mebo's production partner Global Design (Suceava) paints to
// the RAL K7 fan deck, so these are real RAL Classic references — the number
// and name are the official ones, the hex is only a screen approximation
// (RAL does not publish binding hex values). The copy carries that caveat.
// Sources: frontmdf.ro / global-design.ro (RAL K7 for painted MDF fronts).
export const PAINTED_COLORS = [
  { ral: "9010", hex: "#F1F0EA" },
  { ral: "9001", hex: "#EAE6DA" },
  { ral: "1013", hex: "#E3D9C6" },
  { ral: "7044", hex: "#CAC4B0" },
  { ral: "7038", hex: "#B5B8B1" },
  { ral: "6021", hex: "#89AC76" },
  { ral: "7016", hex: "#383E42" },
  { ral: "9005", hex: "#0E0E10" },
] as const;

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
