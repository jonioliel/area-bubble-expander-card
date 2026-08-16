import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import { resolveOverviewConfig } from "../src/overview/config";
import { overviewCardStyles } from "../src/overview/styles";

const type = "custom:area-bubble-overview-card" as const;
const cardSource = readFileSync(new URL("../src/overview/area-bubble-overview-card.ts", import.meta.url), "utf8");
const editorSource = readFileSync(new URL("../src/overview/editor.ts", import.meta.url), "utf8");
const css = overviewCardStyles.cssText;

describe("Overview 0.18.2 popup sub-areas and compact fan control", () => {
  it("keeps the full fan subgroup by default and sanitizes global and room modes", () => {
    expect(resolveOverviewConfig({ type }).fan_display_mode).toBe("subgroup");
    expect(resolveOverviewConfig({ type, fan_display_mode: "button" }).fan_display_mode).toBe("button");

    const resolved = resolveOverviewConfig({
      type,
      fan_display_mode: "broken" as "button",
      area_overrides: {
        parents: { fan_display_mode: "button" },
        invalid: { fan_display_mode: "row" as "button" },
      },
    });
    expect(resolved.fan_display_mode).toBe("subgroup");
    expect(resolved.area_overrides.parents.fan_display_mode).toBe("button");
    expect(resolved.area_overrides.invalid.fan_display_mode).toBeUndefined();
  });

  it("renders an accessible independently collapsible child Area inside a room popup", () => {
    expect(cardSource).toContain('class="area-popup-subarea-toggle"');
    expect(cardSource).toContain("aria-expanded=${expanded}");
    expect(cardSource).toContain("aria-controls=${contentId}");
    expect(cardSource).toContain("this.togglePopupSubarea(event, child)");
    expect(cardSource).toContain("private isPopupSubareaExpanded(area: OverviewArea)");
    expect(css).toMatch(/\.area-popup-subarea-disclosure\[hidden\]\s*\{[^}]*display:\s*none/s);
    expect(css).toMatch(/\.area-popup-subarea\.expanded > \.area-popup-subarea-toggle \.area-popup-subarea-chevron\s*\{[^}]*rotate\(180deg\)/s);
  });

  it("replaces only the automatic fan subgroup with a touch-safe direct toggle", () => {
    expect(cardSource).toContain('this.fanDisplayMode(area) === "button"');
    expect(cardSource).toContain('? AUTO_FAN_GROUP');
    expect(cardSource).toContain('"section-fan-button"');
    expect(cardSource).toContain("entities.filter((item) => item.powered).length");
    expect(cardSource).toContain('const action: OverviewQuickActionKind = heatingControls ? "heating_controls" : "fans"');
    expect(cardSource).toContain("this.handleCompactSubgroupToggle(event, area, action, entities)");
    expect(cardSource).toContain("quickActionDirectEntities(entities, action, turnOn)");
    expect(cardSource).toContain("runQuickActionDirectAction(this.hass, members, action, turnOn)");
    expect(cardSource).toContain("aria-pressed=${activeCount > 0}");
    expect(css).toMatch(/\.section-heading\.has-compact-subgroup-button\s*\{[^}]*grid-template-columns:\s*minmax\(0,\s*1fr\) minmax\(0,\s*auto\) auto/s);
    expect(css).toMatch(/\.section-compact-subgroup-button\s*\{[^}]*min-height:\s*44px;[^}]*border-radius:\s*999px/s);
    expect(css).toMatch(/\.section-compact-subgroup-button\.inactive\s*\{[^}]*background:\s*color-mix/s);
    expect(css).toMatch(/\.section-compact-subgroup-button\.active\s*\{[^}]*border-color:[^}]*background:\s*color-mix/s);
  });

  it("offers the display choice globally and per room in the visual editor", () => {
    expect(editorSource).toContain("Fans inside Climate");
    expect(editorSource).toContain("Compact oval button");
    expect(editorSource).toContain("Fan display in this room");
    expect(editorSource).toContain('commitKey("fan_display_mode"');
    expect(editorSource).toContain("fan_display_mode: ((event.target as HTMLSelectElement).value || undefined)");
  });
});
