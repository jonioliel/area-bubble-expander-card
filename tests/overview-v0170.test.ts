import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import { resolveOverviewConfig } from "../src/overview/config";
import { overviewCardStyles } from "../src/overview/styles";

const type = "custom:area-bubble-overview-card" as const;
const cardSource = readFileSync(new URL("../src/overview/area-bubble-overview-card.ts", import.meta.url), "utf8");
const editorSource = readFileSync(new URL("../src/overview/editor.ts", import.meta.url), "utf8");
const css = overviewCardStyles.cssText;

describe("Overview 0.17 responsive device cards", () => {
  it("lets a single cover span the complete two-column cover grid", () => {
    expect(css).toMatch(/\.section-covers\.columns-2 \.section-entities > \.cover-card:only-child\s*\{[^}]*grid-column:\s*1\s*\/\s*-1/s);
    expect(css).toMatch(/\.section-covers\.columns-2 \.section-entities > \.cover-card:only-child\s*\{[^}]*grid-template-columns:\s*minmax\(0,\s*1fr\) auto/s);
    expect(css).toMatch(/\.cover-card:only-child \.cover-controls\s*\{[^}]*justify-content:\s*flex-end/s);
  });

  it("uses smaller visuals and safe word wrapping for three-column light tiles", () => {
    expect(css).toMatch(/\.section-lights_switches\.columns-3 \.toggle-tile\s*\{[^}]*--aboc-entity-icon-size:\s*32px/s);
    expect(css).toMatch(/\.section-lights_switches\.columns-3 \.toggle-tile\s*\{[^}]*--aboc-entity-icon-glyph-size:\s*18px/s);
    expect(css).toMatch(/\.section-lights_switches\.columns-3 \.entity-name\s*\{[^}]*word-break:\s*normal[^}]*-webkit-line-clamp:\s*3/s);
    expect(css).not.toMatch(/\.entity-name\s*\{[^}]*overflow-wrap:\s*anywhere/s);
  });

  it("resolves compact, medium, and wide device-card sizes globally and per room", () => {
    expect(resolveOverviewConfig({ type }).entity_card_size).toBe("medium");
    expect(resolveOverviewConfig({ type, entity_card_size: "compact" }).entity_card_size).toBe("compact");
    expect(resolveOverviewConfig({
      type,
      entity_card_size: "wide",
      area_overrides: {
        ori: { entity_card_size: "compact" },
        broken: { entity_card_size: "giant" as "compact" },
      },
    }).area_overrides).toMatchObject({ ori: { entity_card_size: "compact" }, broken: {} });
    expect(cardSource).toContain("entity-size-${entityCardSize}");
    expect(css).toContain(".device-section.entity-size-compact");
    expect(css).toContain(".device-section.entity-size-medium");
    expect(css).toContain(".device-section.entity-size-wide");
  });

  it("sanitizes editable automatic sub-category titles globally and per room", () => {
    const resolved = resolveOverviewConfig({
      type,
      subgroup_titles: { fans: "  אוורור  ", heating_controls: "" },
      area_overrides: {
        ori: { subgroup_titles: { fans: " מאווררי החדר ", heating_controls: " בקרי רצפה " } },
      },
    });
    expect(resolved.subgroup_titles).toEqual({ fans: "אוורור", heating_controls: "" });
    expect(resolved.area_overrides.ori.subgroup_titles).toEqual({
      fans: "מאווררי החדר",
      heating_controls: "בקרי רצפה",
    });
    expect(cardSource).toContain("areaOverride?.subgroup_titles?.[key]");
  });

  it("exposes all new controls in the visual editor", () => {
    expect(editorSource).toContain('"entity_card_size"');
    expect(editorSource).toContain("Device card size in this room");
    expect(editorSource).toContain("Fans sub-category name");
    expect(editorSource).toContain("Heating-controls sub-category name");
    expect(editorSource).toContain("setAreaSubgroupTitle");
  });
});
