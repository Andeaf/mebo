// Generates neutral gray placeholder JPGs with the target filename rendered on
// them, so the layout can be judged before the real project photos are dropped
// in. Re-run with: npm run placeholders
// Real photos simply replace these files — same name, same folder, no code changes.
import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const OUT_DIR = path.resolve("public/images/projects");

// tone "dark" = white text will be overlaid on the site → darker placeholder
const IMAGES = [
  { name: "hero-keuken-eiken.jpg", w: 2400, h: 1600, tone: "dark" },
  { name: "ontwerp-showroom.jpg", w: 1200, h: 1500, tone: "dark" },
  { name: "productie-cnc.jpg", w: 1200, h: 1500, tone: "dark" },
  { name: "montage-team.jpg", w: 1200, h: 1500, tone: "dark" },
  { name: "project-keuken-zwart-01.jpg", w: 2400, h: 1350, tone: "dark" },
  { name: "materialen-eiken-fronten.jpg", w: 1600, h: 1200, tone: "light" },
  { name: "proces-tekening-montage.jpg", w: 1600, h: 1200, tone: "light" },
  { name: "maatwerk-werkplaats.jpg", w: 2400, h: 1350, tone: "dark" },
];

const TONES = {
  dark: { bg: "#4b4a47", fg: "#8d8a85" },
  light: { bg: "#b3afa8", fg: "#efede8" },
};

function placeholderSvg({ name, w, h, tone }) {
  const { bg, fg } = TONES[tone];
  const fontSize = Math.round(Math.min(w, h) / 24);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <rect width="100%" height="100%" fill="${bg}"/>
    <text x="50%" y="48%" font-family="Arial, Helvetica, sans-serif" font-size="${fontSize}" fill="${fg}" text-anchor="middle">${name}</text>
    <text x="50%" y="48%" dy="${fontSize * 1.6}" font-family="Arial, Helvetica, sans-serif" font-size="${Math.round(fontSize * 0.65)}" fill="${fg}" text-anchor="middle">${w} × ${h}</text>
  </svg>`;
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  for (const img of IMAGES) {
    const svg = Buffer.from(placeholderSvg(img));
    await sharp(svg).jpeg({ quality: 70 }).toFile(path.join(OUT_DIR, img.name));
    console.log(`✓ ${img.name} (${img.w}×${img.h})`);
  }

  // Simple branded OG image (cream background, wordmark + tagline)
  const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
    <rect width="100%" height="100%" fill="#f7f6f3"/>
    <text x="90" y="330" font-family="Arial, Helvetica, sans-serif" font-size="120" font-weight="600" fill="#212121">mebo</text>
    <text x="92" y="400" font-family="Arial, Helvetica, sans-serif" font-size="34" fill="#6f6b64">Maatwerk meubels &amp; keukens — IJmuiden</text>
    <rect x="90" y="440" width="72" height="6" fill="#212121"/>
  </svg>`;
  await sharp(Buffer.from(og))
    .jpeg({ quality: 85 })
    .toFile(path.resolve("public/og.jpg"));
  console.log("✓ og.jpg (1200×630)");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
