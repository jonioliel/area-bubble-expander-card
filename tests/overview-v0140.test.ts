import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import { resolveOverviewConfig } from "../src/overview/config";
import { SECTION_ACTION_ICONS } from "../src/overview/constants";
import { overviewCardStyles } from "../src/overview/styles";

const type = "custom:area-bubble-overview-card" as const;
const source = readFileSync(new URL("../src/overview/area-bubble-overview-card.ts", import.meta.url), "utf8");
const editor = readFileSync(new URL("../src/overview/editor.ts", import.meta.url), "utf8");
const css = overviewCardStyles.cssText;

describe("Overview 0.14 device density and category controls", () => {
  it("uses clear equipment frames and elegant semantic action icons", () => {
    const resolved = resolveOverviewConfig({ type });
    expect(resolved.style.entity_frame_width).toBe(1);
    expect(resolved.section_action_presentation).toBe("icon");
    expect(resolved.climate_mode_presentation).toBe("both");
    expect(SECTION_ACTION_ICONS).toEqual({
      on: "mdi:power",
      off: "mdi:power-off",
      open: "mdi:window-shutter-open",
      close: "mdi:window-shutter",
    });
  });

  it("sanitizes device frames, heights, columns, and presentation modes", () => {
    const resolved = resolveOverviewConfig({
      type,
      section_action_presentation: "both",
      climate_mode_presentation: "text",
      section_styles: {
        covers: { columns: 3, entity_height: 30, action_presentation: "text" },
        lights_switches: { columns: 3, entity_height: 68, action_presentation: "both" },
      },
      area_overrides: {
        kids: { section_styles: { covers: { columns: 2, entity_height: 200 } } },
      },
      style: { entity_frame_color: " #718096 ", entity_frame_width: 20 },
    });
    expect(resolved.section_action_presentation).toBe("both");
    expect(resolved.climate_mode_presentation).toBe("text");
    expect(resolved.section_styles.covers).toMatchObject({ columns: 2, entity_height: 44, action_presentation: "text" });
    expect(resolved.section_styles.lights_switches).toMatchObject({ columns: 3, entity_height: 68, action_presentation: "both" });
    expect(resolved.area_overrides.kids.section_styles?.covers).toMatchObject({ columns: 2, entity_height: 140 });
    expect(resolved.style.entity_frame_color).toBe("#718096");
    expect(resolved.style.entity_frame_width).toBe(6);
  });

  it("renders cover columns without forcing every cover to span the grid", () => {
    expect(source).toContain('section.id === "covers" ? Math.min(2, requestedSectionColumns)');
    expect(source).toContain('class="cover-card entity-card ${item.active');
    expect(source).not.toContain('class="cover-card entity-card full-span');
    expect(css).toMatch(/\.section-covers \.section-entities\s*\{[^}]*repeat\(var\(--aboc-section-columns/s);
  });

  it("applies configurable equipment height and a visible off-state frame", () => {
    expect(source).toContain('`--aboc-section-entity-height:${sectionEntityHeight}px`');
    expect(css).toMatch(/\.entity-card\s*\{[^}]*border:\s*var\(--aboc-entity-frame-width\) solid var\(--aboc-entity-frame-color\)/s);
    expect(css).toContain("var(--aboc-section-entity-height");
    expect(editor).toContain('"Device tile height"');
    expect(editor).toContain('"Device frame color"');
    expect(editor).toContain('"Device frame thickness"');
  });

  it("shows climate and fan modes as text, icons, or both", () => {
    expect(source).toContain('class="climate-mode-control presentation-${modePresentation}"');
    expect(source).toContain('class="climate-mode-value"');
    expect(source).toContain("this.climateModeLabel(item.entity.state)");
    expect(source).toContain("this.modeLabel(currentFanMode)");
    expect(editor).toContain('"Climate and fan mode display"');
  });

  it("supports icon, text, and combined category action buttons", () => {
    expect(source).toContain('presentation-${actionPresentation}');
    expect(source).toContain('class="section-action-label"');
    expect(css).toContain(".section-on-button.presentation-both");
    expect(editor).toContain('"Category button appearance"');
    expect(editor).toContain('"Action button appearance"');
  });
});
