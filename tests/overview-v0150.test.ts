import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import { resolveOverviewConfig } from "../src/overview/config";
import { AUTO_FAN_GROUP, AUTO_FLOOR_HEATING_GROUP } from "../src/overview/constants";
import { discoverOverview } from "../src/overview/discovery";
import { overviewCardStyles } from "../src/overview/styles";
import type { HassEntity, HomeAssistant } from "../src/types";

const type = "custom:area-bubble-overview-card" as const;
const source = readFileSync(new URL("../src/overview/area-bubble-overview-card.ts", import.meta.url), "utf8");
const editor = readFileSync(new URL("../src/overview/editor.ts", import.meta.url), "utf8");

const state = (entityId: string, value: string, friendlyName: string): HassEntity => ({
  entity_id: entityId,
  state: value,
  attributes: { friendly_name: friendlyName },
  last_changed: "2026-08-15T08:00:00Z",
  last_updated: "2026-08-15T08:00:00Z",
});

const hass = (states: HassEntity[]): HomeAssistant => ({
  states: Object.fromEntries(states.map((entity) => [entity.entity_id, entity])),
  entities: Object.fromEntries(states.map((entity) => [entity.entity_id, { entity_id: entity.entity_id, area_id: "room" }])),
  devices: {},
  areas: { room: { area_id: "room", name: "Room" } },
  floors: {},
  config: { unit_system: { temperature: "°C" } },
  callService: async () => undefined,
} as HomeAssistant);

describe("Overview 0.15 auxiliary climate and heating discovery", () => {
  it("maps named fan switches into a localized automatic fan subgroup", () => {
    const discovery = discoverOverview(hass([
      state("switch.room_fan", "on", "Room fan"),
      state("switch.vent", "off", "מאוורר מקלחת"),
      state("fan.ceiling", "on", "Ceiling fan"),
      state("switch.regular", "off", "Regular switch"),
    ]), resolveOverviewConfig({ type, area: "room", language: "en" }));
    const area = discovery.areas[0];
    const fans = area.sections.find((section) => section.id === "climate")?.entities ?? [];
    expect(fans.map((item) => item.entityId).sort()).toEqual(["fan.ceiling", "switch.room_fan", "switch.vent"]);
    expect(fans.every((item) => item.group === AUTO_FAN_GROUP)).toBe(true);
    expect(area.sections.find((section) => section.id === "lights_switches")?.entities.map((item) => item.entityId)).toEqual(["switch.regular"]);
  });

  it("maps both floor-heating thermostats and relays while grouping only compact controls", () => {
    const discovery = discoverOverview(hass([
      state("climate.underfloor", "heat", "Underfloor heating thermostat"),
      state("switch.floor_heating", "on", "Floor heating relay"),
      state("input_boolean.ufh", "off", "חימום תת רצפתי"),
    ]), resolveOverviewConfig({ type, area: "room", language: "en" }));
    const entities = discovery.areas[0].sections.find((section) => section.id === "floor_heating")?.entities ?? [];
    expect(entities.map((item) => item.entityId).sort()).toEqual(["climate.underfloor", "input_boolean.ufh", "switch.floor_heating"]);
    expect(entities.find((item) => item.domain === "climate")?.group).toBeUndefined();
    expect(entities.filter((item) => item.domain !== "climate").every((item) => item.group === AUTO_FLOOR_HEATING_GROUP)).toBe(true);
  });

  it("always gives a manual section override precedence over automatic naming", () => {
    const discovery = discoverOverview(
      hass([state("switch.room_fan", "on", "Room fan")]),
      resolveOverviewConfig({ type, area: "room", language: "en", entity_overrides: { "switch.room_fan": { section: "lights_switches" } } }),
    );
    const item = discovery.areas[0].allEntities[0];
    expect(item.section).toBe("lights_switches");
    expect(item.group).toBeUndefined();
  });

  it("renders auxiliary switches no taller than a cover and shows powered duration", () => {
    const css = overviewCardStyles.cssText;
    expect(css).toMatch(/\.toggle-tile\.compact-auxiliary\s*\{[^}]*min-height:\s*min\(56px/s);
    expect(source).toContain('compactAuxiliary ? "compact-auxiliary"');
    expect(source).toContain("this.elapsedSince(item.entity.last_changed)");
    expect(source).toContain("window.setInterval(() => this.requestUpdate(), 60_000)");
    expect(source).toContain('this.localText("מאווררים", "Fans")');
    expect(source).toContain('this.localText("בקרי חימום", "Heating controls")');
  });

  it("documents automatic discovery and manual override in the visual editor", () => {
    expect(editor).toContain("Fans and floor heating are mapped automatically by name and labels");
    expect(editor).toContain("the manual section choice here always takes precedence");
  });
});
