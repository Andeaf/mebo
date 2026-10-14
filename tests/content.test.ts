import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import en from "../messages/en.json";
import nl from "../messages/nl.json";
import { FEATURED_RAL, isLight } from "@/lib/materials";
import { galleryProjects } from "@/lib/projects";
import { RAL_COLORS, parseRalCodes, ralByCode, ralGroup } from "@/lib/ral";

// Every leaf path in a messages file, arrays included ("privacy.intro.0").
function keyPaths(value: unknown, prefix = ""): string[] {
  if (value === null || typeof value !== "object") return [prefix];
  return Object.entries(value).flatMap(([key, child]) =>
    keyPaths(child, prefix ? `${prefix}.${key}` : key),
  );
}

describe("translations", () => {
  it("define exactly the same keys in Dutch and English", () => {
    expect(keyPaths(en).sort()).toEqual(keyPaths(nl).sort());
  });
});

describe("RAL palette", () => {
  it("lists all 213 RAL Classic shades once", () => {
    expect(RAL_COLORS).toHaveLength(213);
    expect(new Set(RAL_COLORS.map((c) => c.code)).size).toBe(213);
  });

  it("gives every shade a code, a hex approximation and both names", () => {
    for (const c of RAL_COLORS) {
      expect(c.code).toMatch(/^[1-9]\d{3}$/);
      expect(c.hex).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(c.nl.trim()).not.toBe("");
      expect(c.en.trim()).not.toBe("");
      expect(ralGroup(c.code)).toBe(c.code[0]);
    }
  });

  it("only features shades that exist", () => {
    for (const code of FEATURED_RAL) expect(ralByCode(code).code).toBe(code);
    expect(() => ralByCode("0000")).toThrow();
  });

  it("reads colour codes from a URL, dropping unknown and repeated ones", () => {
    expect(parseRalCodes(" 9010,7016,9010,0000,abc ").map((c) => c.code)).toEqual([
      "9010",
      "7016",
    ]);
    expect(parseRalCodes(null)).toEqual([]);
  });

  it("tells light swatches from dark ones", () => {
    expect(isLight(ralByCode("9010").hex)).toBe(true);
    expect(isLight(ralByCode("9005").hex)).toBe(false);
  });
});

describe("project gallery", () => {
  it("only references photos that exist in public/", () => {
    const photos = galleryProjects.flatMap((p) => p.images);
    expect(photos.length).toBeGreaterThan(0);
    const missing = photos.filter(
      (p) => !existsSync(path.join(process.cwd(), "public", p)),
    );
    expect(missing).toEqual([]);
  });
});
