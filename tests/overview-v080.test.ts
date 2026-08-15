import { readFileSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";

import { areaActionEntities, runAreaAction } from "../src/overview/actions";
import { resolveOverviewConfig } from "../src/overview/config";
import { SECTION_ACTION_ICONS } from "../src/overview/constants";
import { overviewCardStyles } from "../src/overview/styles";
import type { OverviewArea, OverviewEntity, OverviewSectionId } from "../src/overview/types";
import type { HassEntity, HomeAssistant } from "../src/types";

const type = "custom:area-bubble-overview-card" as const;

const entity = (
  entityId: string,
  powered: boolean,
  section: OverviewSectionId = "lights_switches",
  options: Partial<Pick<OverviewEntity, "available" | "protected" | "group">> = {},
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
    areaId: "kids",
    section,
    labels: [],
    available: options.available ?? true,
    active: powered,
    powered,
    protected: options.protected ?? false,
    group: options.group,
  };
};

const area = (entities: OverviewEntity[]): OverviewArea => ({
  id: "kids",
  name: "Kids",
  icon: "mdi:bed",
  showWhenParentCollapsed: false,
  sections: [],
  allEntities: entities,
  temperatureMode: "none",
  occupancy: "none",
  occupancyCountSource: "none",
  occupancyEntities: [],
});

describe("Overview 0.8 configuration", () => {
  it("defaults to separate category controls and safe semantic icons", () => {
    const resolved = resolveOverviewConfig({ type });
    expect(resolved.section_action_mode).toBe("dual");
    expect(resolved.section_action_icons).toEqual(SECTION_ACTION_ICONS);
    expect(resolved.style).toMatchObject({
      quick_action_size: 38,
      quick_action_icon_size: 20,
      section_action_size: 44,
      section_action_icon_size: 22,
      category_gap: 12,
    });
  });

  it("sanitizes category appearance, action icons, grouping, and size limits", () => {
    const resolved = resolveOverviewConfig({
      type,
      section_action_mode: "toggle",
      section_action_icons: { on: " mdi:lightbulb-on ", off: "", close: "mdi:blinds" },
      section_styles: {
        climate: { background: " #123456 ", border_color: " #abcdef ", show_border: true },
      },
      area_overrides: {
        kids: { section_styles: { climate: { background: " rgba(1,2,3,.4) ", show_border: false } } },
      },
      entity_overrides: {
        "light.shower": { group: " Shower " },
        "light.blank": { group: "   " },
      },
      style: {
        quick_action_size: 2,
        quick_action_icon_size: 100,
        section_action_size: 60,
        section_action_icon_size: 1,
        category_gap: 100,
      },
    });
    expect(resolved.section_action_mode).toBe("toggle");
    expect(resolved.section_action_icons).toMatchObject({
      on: "mdi:lightbulb-on",
      off: SECTION_ACTION_ICONS.off,
      close: "mdi:blinds",
    });
    expect(resolved.section_styles.climate).toEqual({
      background: "#123456",
      border_color: "#abcdef",
      show_border: true,
    });
    expect(resolved.area_overrides.kids.section_styles?.climate).toEqual({
      background: "rgba(1,2,3,.4)",
      show_border: false,
    });
    expect(resolved.entity_overrides["light.shower"].group).toBe("Shower");
    expect(resolved.entity_overrides["light.blank"].group).toBeUndefined();
    expect(resolved.style).toMatchObject({
      quick_action_size: 28,
      quick_action_icon_size: 34,
      section_action_size: 56,
      section_action_icon_size: 16,
      category_gap: 40,
    });
  });
});

describe("room and floor power safety", () => {
  it("never lets an open cover activate room-wide power actions", async () => {
    const room = area([
      entity("cover.open", true, "covers"),
      entity("light.on", true),
      entity("switch.off", false),
      entity("light.protected", true, "lights_switches", { protected: true }),
      entity("switch.unavailable", true, "lights_switches", { available: false }),
    ]);
    expect(areaActionEntities(room, false).map((item) => item.entityId)).toEqual(["light.on"]);
    expect(areaActionEntities(room, true).map((item) => item.entityId)).toEqual(["switch.off"]);

    const callService = vi.fn(async () => undefined);
    await runAreaAction({ states: {}, callService } as HomeAssistant, room, false);
    expect(callService).toHaveBeenCalledOnce();
    expect(callService).toHaveBeenCalledWith("light", "turn_off", undefined, { entity_id: ["light.on"] });
  });
});

describe("Overview 0.8 rendering contracts", () => {
  const source = readFileSync(new URL("../src/overview/area-bubble-overview-card.ts", import.meta.url), "utf8");
  const editor = readFileSync(new URL("../src/overview/editor.ts", import.meta.url), "utf8");
  const css = overviewCardStyles.cssText;

  it("keeps category titles separate from configurable action controls", () => {
    expect(source).toContain('class="section-heading-main"');
    expect(source).toContain('class="section-actions"');
    expect(source).toContain('section_action_mode === "toggle"');
    expect(css).toMatch(/\.section-heading\s*\{[^}]*grid-template-columns:\s*minmax\(0,\s*1fr\) auto;[^}]*min-height:\s*max\(44px,\s*var\(--aboc-section-action-size\)\)/s);
    expect(css).toMatch(/\.section-title\s*\{[^}]*min-width:\s*0;[^}]*text-overflow:\s*ellipsis/s);
  });

  it("supports global and per-room category styling and adjustable spacing", () => {
    expect(source).toContain("areaOverride?.section_styles?.[section.id]");
    expect(source).toContain("--aboc-section-background:");
    expect(css).toMatch(/\.expanded-content\s*\{[^}]*gap:\s*var\(--aboc-section-gap\)/s);
    expect(css).toMatch(/\.device-section\s*\{[^}]*background:\s*var\(--aboc-section-background,\s*transparent\)/s);
    expect(css).toMatch(/\.device-section\.section-framed\s*\{[^}]*border-color:\s*var\(--aboc-section-border-color\)/s);
    expect(editor).toContain('"Room category appearance"');
    expect(editor).toContain('"Subtle category frame"');
  });

  it("keeps automatic implementation sub-groups while promoting manual room sub-areas", () => {
    expect(source).toContain("const groups = new Map<string, OverviewEntity[]>()");
    expect(source).toContain('class="entity-subgroup"');
    expect(source).toContain('class="entity-subgroup-heading"');
    expect(source).toContain('class="room-subarea');
    expect(editor).toContain('"Sub-area inside room"');
  });

  it("makes the floor header active and opens room-level bulk controls", () => {
    expect(source).toContain('class="overview-heading floor-heading ${activeAreas.length ? "has-active" : "all-off"}"');
    expect(source).toContain('class="floor-active-badge"');
    expect(source).toContain("this.openFloorPopup(event)");
    expect(source).toContain('class="floor-all-off"');
    expect(source).toContain('class="floor-room-off"');
    expect(source).toContain("area.allEntities.some(countsTowardAreaActivity)");
    expect(css).toMatch(/\.floor-heading\.has-active \.floor-summary-pill\s*\{[^}]*background:\s*var\(--aboc-active-surface\)/s);
  });
});
