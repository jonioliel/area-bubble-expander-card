import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import { resolveOverviewConfig } from "../src/overview/config";
import { AUTO_FAN_GROUP } from "../src/overview/constants";
import { discoverOverview, stripAreaNameFromEntityName } from "../src/overview/discovery";
import { buildOverviewAreaContentLayout } from "../src/overview/presentation";
import type { HassEntity, HomeAssistant } from "../src/types";
import type { OverviewArea, OverviewEntity, OverviewSectionId } from "../src/overview/types";

const type = "custom:area-bubble-overview-card" as const;
const cardSource = readFileSync(new URL("../src/overview/area-bubble-overview-card.ts", import.meta.url), "utf8");
const editorSource = readFileSync(new URL("../src/overview/editor.ts", import.meta.url), "utf8");

const state = (entityId: string, friendlyName: string): HassEntity => ({
  entity_id: entityId,
  state: "off",
  attributes: { friendly_name: friendlyName },
  last_changed: "2026-08-15T09:00:00Z",
  last_updated: "2026-08-15T09:00:00Z",
});

const hass = (states: HassEntity[]): HomeAssistant => ({
  states: Object.fromEntries(states.map((entity) => [entity.entity_id, entity])),
  entities: Object.fromEntries(states.map((entity) => [entity.entity_id, { entity_id: entity.entity_id, area_id: "ori" }])),
  devices: {},
  areas: { ori: { area_id: "ori", name: "אורי" } },
  floors: {},
  locale: { language: "he" },
  language: "he",
  config: { unit_system: { temperature: "°C" } },
  callService: async () => undefined,
} as HomeAssistant);

const item = (entityId: string, section: OverviewSectionId, group?: string): OverviewEntity => ({
  entity: state(entityId, entityId),
  entityId,
  domain: entityId.split(".")[0],
  name: entityId,
  icon: "mdi:circle",
  areaId: "ori",
  section,
  labels: [],
  available: true,
  active: false,
  powered: false,
  protected: false,
  group,
});

describe("Overview 0.16 smart names and room sub-areas", () => {
  it("removes a complete Area name without damaging partial words", () => {
    expect(stripAreaNameFromEntityName("אורי ספוטים", ["אורי"])).toBe("ספוטים");
    expect(stripAreaNameFromEntityName("תריס אורי", ["אורי"])).toBe("תריס");
    expect(stripAreaNameFromEntityName("אוריאל ספוטים", ["אורי"])).toBe("אוריאל ספוטים");
    expect(stripAreaNameFromEntityName("אורי", ["אורי"])).toBe("אורי");
  });

  it("supports a global default plus a per-entity keep/remove override", () => {
    const resolved = resolveOverviewConfig({
      type,
      area: "ori",
      entity_overrides: { "switch.keep": { strip_area_name: false } },
    });
    expect(resolved.strip_area_name_from_entity_names).toBe(true);
    const area = discoverOverview(hass([
      state("switch.spots", "אורי ספוטים"),
      state("switch.keep", "אורי קריאה"),
    ]), resolved).areas[0];
    expect(area.allEntities.find((entity) => entity.entityId === "switch.spots")?.name).toBe("ספוטים");
    expect(area.allEntities.find((entity) => entity.entityId === "switch.keep")?.name).toBe("אורי קריאה");

    const forced = discoverOverview(hass([state("switch.spots", "אורי ספוטים")]), resolveOverviewConfig({
      type,
      area: "ori",
      strip_area_name_from_entity_names: false,
      entity_overrides: { "switch.spots": { strip_area_name: true } },
    })).areas[0];
    expect(forced.allEntities[0].name).toBe("ספוטים");
  });

  it("pivots manual sub-areas above categories and keeps automatic groups inside categories", () => {
    const generalLight = item("light.general", "lights_switches");
    const automaticFan = item("switch.fan", "climate", AUTO_FAN_GROUP);
    const showerLight = item("light.shower", "lights_switches", "מקלחת");
    const showerHeat = item("climate.shower", "floor_heating", "מקלחת");
    const toiletLight = item("light.toilet", "lights_switches", "שירותים");
    const area: OverviewArea = {
      id: "ori",
      name: "אורי",
      icon: "mdi:bed",
      showWhenParentCollapsed: false,
      sections: [
        { id: "climate", title: "מיזוג אוויר", icon: "mdi:air-conditioner", entities: [automaticFan], activeCount: 0 },
        { id: "floor_heating", title: "חימום רצפתי", icon: "mdi:heating-coil", entities: [showerHeat], activeCount: 0 },
        { id: "lights_switches", title: "תאורה", icon: "mdi:lightbulb", entities: [generalLight, showerLight, toiletLight], activeCount: 0 },
      ],
      allEntities: [automaticFan, showerHeat, generalLight, showerLight, toiletLight],
      temperatureMode: "off",
      occupancy: "none",
      occupancyCountSource: "none",
      occupancyEntities: [],
    };

    const layout = buildOverviewAreaContentLayout(area, ["שירותים", "מקלחת"]);
    expect(layout.generalSections.map((section) => section.id)).toEqual(["climate", "lights_switches"]);
    expect(layout.generalSections.flatMap((section) => section.entities).map((entity) => entity.entityId)).toEqual([
      "switch.fan",
      "light.general",
    ]);
    expect(layout.generalSections[0].entities[0].group).toBe(AUTO_FAN_GROUP);
    expect(layout.subareas.map((subarea) => subarea.name)).toEqual(["שירותים", "מקלחת"]);
    expect(layout.subareas[1].sections.map((section) => section.id)).toEqual(["floor_heating", "lights_switches"]);
    expect(layout.subareas[1].entities.every((entity) => entity.group === undefined)).toBe(true);
  });

  it("sanitizes sub-area ordering and per-device strip choices", () => {
    const resolved = resolveOverviewConfig({
      type,
      area: "ori",
      area_overrides: { ori: { subarea_order: ["  מקלחת  ", "", "שירותים"] } },
      entity_overrides: {
        "switch.good": { strip_area_name: false },
        "switch.bad": { strip_area_name: "false" as unknown as boolean },
      },
    });
    expect(resolved.area_overrides.ori.subarea_order).toEqual(["מקלחת", "שירותים"]);
    expect(resolved.entity_overrides["switch.good"].strip_area_name).toBe(false);
    expect(resolved.entity_overrides["switch.bad"].strip_area_name).toBeUndefined();
  });

  it("uses one shared content hierarchy in both Expander and Popup and exposes editor controls", () => {
    expect(cardSource.match(/this\.renderAreaContent\(area\)/g)).toHaveLength(2);
    expect(cardSource).toContain("buildOverviewAreaContentLayout");
    expect(editorSource).toContain('"strip_area_name_from_entity_names"');
    expect(editorSource).toContain("override.strip_area_name");
    expect(editorSource).toContain("moveRoomSubarea");
    expect(editorSource).toContain("General room categories are shown first");
  });
});
