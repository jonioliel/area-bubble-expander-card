import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const card = readFileSync(new URL("../src/overview/area-bubble-overview-card.ts", import.meta.url), "utf8");
const editor = readFileSync(new URL("../src/overview/editor.ts", import.meta.url), "utf8");
const styles = readFileSync(new URL("../src/overview/styles.ts", import.meta.url), "utf8");

describe("Overview 0.20 compact labels and progressive editor", () => {
  it("uses a short heating-control label while preserving configured overrides", () => {
    expect(card).toContain('this.localText("מפסק", "Switch")');
    expect(card).toContain("areaOverride?.subgroup_titles?.[key] || this.config?.subgroup_titles[key]");
    expect(styles).toContain("font-size: clamp(10px, 2.8cqi, 12px)");
    expect(editor).toContain('"Heating-controls / button label"');
    expect(editor).toContain('"Heating-controls / button label in this room"');
  });

  it("keeps room, category, and device exceptions behind explicit disclosures", () => {
    expect(editor).toContain('class="override-details area-override-details"');
    expect(editor).toContain('class="override-details category-override-details"');
    expect(editor).toContain('class="override-details entity-override-details"');
    expect(editor).toContain('"Edit this room"');
    expect(editor).toContain('"Room-specific category overrides"');
    expect(editor).toContain('"Device overrides"');
  });

  it("retains global settings and every scoped override path", () => {
    expect(editor).toContain('this.commitKey("entity_card_size"');
    expect(editor).toContain('this.commitKey("heating_controls_display_mode"');
    expect(editor).toContain("this.setGlobalSectionStyle(");
    expect(editor).toContain("this.setAreaSectionStyle(");
    expect(editor).toContain("this.updateAreaOverride(");
    expect(editor).toContain("this.updateEntityOverride(");
  });
});
