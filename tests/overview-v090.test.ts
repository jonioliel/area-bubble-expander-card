import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import { activeQuickActionSummaries } from "../src/overview/actions";
import { resolveOverviewConfig } from "../src/overview/config";
import { countsTowardAreaActivity } from "../src/overview/features";
import { overviewCardStyles } from "../src/overview/styles";
import type { OverviewArea, OverviewEntity, OverviewSectionId } from "../src/overview/types";
import type { HassEntity } from "../src/types";

const type = "custom:area-bubble-overview-card" as const;

const entity = (
  entityId: string,
  powered: boolean,
  section: OverviewSectionId,
  ignoreActivity = false,
): OverviewEntity => {
  const state: HassEntity = {
    entity_id: entityId,
    state: powered ? "on" : "off",
    attributes: {},
    last_changed: "2026-08-15T00:00:00Z",
    last_updated: "2026-08-15T00:00:00Z",
  };
  return {
    entity: state,
    entityId,
    domain: entityId.split(".")[0],
    name: entityId,
    icon: "mdi:circle",
    areaId: "room",
    section,
    labels: [],
    available: true,
    active: powered,
    powered,
    protected: false,
    ignoreActivity,
  };
};

const area = (allEntities: OverviewEntity[]): OverviewArea => ({
  id: "room",
  name: "Room",
  icon: "mdi:bed",
  showWhenParentCollapsed: false,
  sections: [],
  allEntities,
  temperatureMode: "none",
  occupancy: "none",
  occupancyCountSource: "none",
  occupancyEntities: [],
});

describe("Overview 0.9 configuration", () => {
  it("sanitizes configurable category borders and per-room overrides", () => {
    const resolved = resolveOverviewConfig({
      type,
      section_styles: {
        climate: { show_border: true, border_width: 99, border_style: "dashed", border_color: " #123456 " },
        covers: { border_width: -4, border_style: "invalid" as "solid" },
      },
      area_overrides: {
        room: { section_styles: { climate: { border_width: 3, border_style: "dotted" } } },
      },
    });

    expect(resolved.section_styles.climate).toMatchObject({
      show_border: true,
      border_width: 8,
      border_style: "dashed",
      border_color: "#123456",
    });
    expect(resolved.section_styles.covers).toEqual({ border_width: 0 });
    expect(resolved.area_overrides.room.section_styles?.climate).toEqual({ border_width: 3, border_style: "dotted" });
  });

  it("provides high-contrast configurable occupancy colors", () => {
    expect(resolveOverviewConfig({ type }).style).toMatchObject({
      occupancy_active_color: "#b8f5c2",
      occupancy_vacant_color: "#f4f3ec",
      occupancy_unknown_color: "#ffcc80",
    });
    expect(resolveOverviewConfig({
      type,
      style: {
        occupancy_active_color: " #ffffff ",
        occupancy_vacant_color: "#111111",
        occupancy_unknown_color: "   ",
      },
    }).style).toMatchObject({
      occupancy_active_color: "#ffffff",
      occupancy_vacant_color: "#111111",
      occupancy_unknown_color: "#ffcc80",
    });
  });

  it("preserves the visible-but-ignored entity flag", () => {
    const resolved = resolveOverviewConfig({
      type,
      entity_overrides: {
        "switch.always_on": { protected: true, ignore_activity: true },
        "light.normal": { ignore_activity: false },
        "light.invalid": { ignore_activity: "yes" as unknown as boolean },
      },
    });
    expect(resolved.entity_overrides["switch.always_on"]).toMatchObject({ protected: true, ignore_activity: true });
    expect(resolved.entity_overrides["light.normal"].ignore_activity).toBe(false);
    expect(resolved.entity_overrides["light.invalid"].ignore_activity).toBeUndefined();
  });

  it("keeps ignored climates out of the room temperature mode", () => {
    const source = readFileSync(new URL("../src/overview/discovery.ts", import.meta.url), "utf8");
    expect(source).toContain("overviewTemperatureMode(entities.filter((item) => item.ignoreActivity !== true))");
  });
});

describe("ignored room and floor activity", () => {
  it("keeps an ignored powered device visible without activating the room or quick badge", () => {
    const ignored = entity("light.always_on", true, "lights_switches", true);
    const off = entity("light.ceiling", false, "lights_switches");
    const target = area([ignored, off]);

    expect(target.allEntities).toHaveLength(2);
    expect(countsTowardAreaActivity(ignored)).toBe(false);
    expect(activeQuickActionSummaries(target, ["lights"])).toEqual([]);
  });

  it("retains all popup members when another device activates the category", () => {
    const ignored = entity("light.always_on", true, "lights_switches", true);
    const active = entity("light.ceiling", true, "lights_switches");
    const result = activeQuickActionSummaries(area([ignored, active]), ["lights"]);

    expect(result).toHaveLength(1);
    expect(result[0].entities.map((item) => item.entityId)).toEqual(["light.always_on", "light.ceiling"]);
  });
});

describe("Overview 0.9 rendering and editor contracts", () => {
  const source = readFileSync(new URL("../src/overview/area-bubble-overview-card.ts", import.meta.url), "utf8");
  const editor = readFileSync(new URL("../src/overview/editor.ts", import.meta.url), "utf8");
  const css = overviewCardStyles.cssText;

  it("adds an independent floor climate badge that reuses the climate popup", () => {
    expect(source).toContain('const FLOOR_QUICK_AREA_ID = "__overview_floor__"');
    expect(source).toContain('class="floor-climate-badge"');
    expect(source).toContain('this.openQuickActionPopup(event, floorQuickArea, "climate")');
    expect(source).toContain('this.quickPopup?.areaId === quickAreaId');
  });

  it("applies frame width/style, top separation, and occupancy color variables", () => {
    expect(source).toContain("--aboc-section-border-width:");
    expect(source).toContain("--aboc-section-border-style:");
    expect(css).toMatch(/\.expanded-content\s*\{[^}]*padding:\s*9px 9px 10px/s);
    expect(css).toMatch(/\.device-section\.section-framed\s*\{[^}]*border-width:\s*var\(--aboc-section-border-width/s);
    expect(css).toContain("var(--aboc-occupancy-active)");
    expect(css).toContain("var(--aboc-occupancy-vacant)");
    expect(css).toContain("var(--aboc-occupancy-unknown)");
  });

  it("uses only Home Assistant's searchable icon picker", () => {
    const iconField = editor.slice(editor.indexOf("private iconField"), editor.indexOf("private colorField"));
    expect(iconField).toContain("<ha-icon-picker");
    expect(iconField).toContain('"Search is built into the icon picker."');
    expect(iconField).not.toContain('<input type="text"');
  });

  it("exposes the ignore-activity and occupancy controls in the editor", () => {
    expect(editor).toContain('"Ignore in room and floor activity"');
    expect(editor).toContain('"Occupied presence color"');
    expect(editor).toContain('"Frame thickness"');
    expect(editor).toContain('"Frame style"');
  });
});
