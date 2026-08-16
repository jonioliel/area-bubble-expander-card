import { readFileSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";

import { quickActionMembers, runQuickActionAction } from "../src/overview/actions";
import { resolveOverviewConfig } from "../src/overview/config";
import { AUTO_FLOOR_HEATING_GROUP } from "../src/overview/constants";
import { discoverOverview } from "../src/overview/discovery";
import type { HassEntity, HomeAssistant } from "../src/types";

const type = "custom:area-bubble-overview-card" as const;
const cardSource = readFileSync(new URL("../src/overview/area-bubble-overview-card.ts", import.meta.url), "utf8");
const editorSource = readFileSync(new URL("../src/overview/editor.ts", import.meta.url), "utf8");

const entity = (entityId: string, state: string, name: string): HassEntity => ({
  entity_id: entityId,
  state,
  attributes: { friendly_name: name },
  last_changed: "2026-08-15T12:00:00Z",
  last_updated: "2026-08-15T12:00:00Z",
});

const heatingArea = (relayState = "on") => {
  const states = [
    entity("climate.floor_thermostat", "heat", "Floor heating thermostat"),
    entity("switch.floor_relay", relayState, "Floor heating relay"),
    entity("input_boolean.floor_enable", "off", "Underfloor heating enable"),
  ];
  const hass: HomeAssistant = {
    states: Object.fromEntries(states.map((item) => [item.entity_id, item])),
    entities: Object.fromEntries(states.map((item) => [item.entity_id, { entity_id: item.entity_id, area_id: "room" }])),
    devices: {},
    areas: { room: { area_id: "room", name: "Room" } },
    floors: {},
    language: "en",
    locale: { language: "en" },
    config: { unit_system: { temperature: "°C" } },
    callService: vi.fn(async () => undefined),
  };
  const area = discoverOverview(hass, resolveOverviewConfig({ type, area: "room", language: "en" })).areas[0];
  return { area, hass };
};

describe("Overview 0.19 adaptive grids and heating-control button", () => {
  it("sanitizes global and per-room heating-control presentation", () => {
    expect(resolveOverviewConfig({ type }).heating_controls_display_mode).toBe("subgroup");
    expect(resolveOverviewConfig({ type, heating_controls_display_mode: "button" }).heating_controls_display_mode).toBe("button");
    const resolved = resolveOverviewConfig({
      type,
      heating_controls_display_mode: "broken" as "button",
      area_overrides: {
        room: { heating_controls_display_mode: "button" },
        invalid: { heating_controls_display_mode: "row" as "button" },
      },
    });
    expect(resolved.heating_controls_display_mode).toBe("subgroup");
    expect(resolved.area_overrides.room.heating_controls_display_mode).toBe("button");
    expect(resolved.area_overrides.invalid.heating_controls_display_mode).toBeUndefined();
  });

  it("limits every entity grid to the number of items actually present", () => {
    expect(cardSource).toContain("Math.max(1, Math.min(configuredColumns, count))");
    expect(cardSource).toContain("gridColumns(ungrouped.length)");
    expect(cardSource).toContain("gridColumns(entities.length, automaticHeatingControls)");
  });

  it("keeps automatic heating controls full-width in subgroup mode", () => {
    expect(cardSource).toContain("const automaticHeatingControls = group === AUTO_FLOOR_HEATING_GROUP");
    expect(cardSource).toContain("forceSingle ? 1");
  });

  it("directly toggles only the safe heating-control relays", async () => {
    const { area, hass } = heatingArea();
    const members = quickActionMembers(area, "heating_controls");
    expect(members.map((item) => item.entityId).sort()).toEqual(["input_boolean.floor_enable", "switch.floor_relay"]);
    expect(members.every((item) => item.group === AUTO_FLOOR_HEATING_GROUP)).toBe(true);
    expect(members.some((item) => item.domain === "climate")).toBe(false);

    await runQuickActionAction(hass, area, "heating_controls", false);
    expect(hass.callService).toHaveBeenCalledTimes(1);
    expect(hass.callService).toHaveBeenCalledWith("switch", "turn_off", undefined, { entity_id: ["switch.floor_relay"] });

    const off = heatingArea("off");
    await runQuickActionAction(off.hass, off.area, "heating_controls", true);
    expect(off.hass.callService).toHaveBeenCalledTimes(2);
    expect(off.hass.callService).toHaveBeenCalledWith("switch", "turn_on", undefined, { entity_id: ["switch.floor_relay"] });
    expect(off.hass.callService).toHaveBeenCalledWith("input_boolean", "turn_on", undefined, { entity_id: ["input_boolean.floor_enable"] });
    expect(cardSource).toContain('this.handleCompactSubgroupToggle(event, area, action, entities)');
    expect(cardSource).toContain('runQuickActionDirectAction(this.hass, members, action, turnOn)');
  });

  it("offers the heating-control choice globally and per room in the editor", () => {
    expect(editorSource).toContain("Floor-heating controls display");
    expect(editorSource).toContain("Heating-controls display in this room");
    expect(editorSource).toContain('commitKey("heating_controls_display_mode"');
    expect(editorSource).toContain("heating_controls_display_mode: ((event.target as HTMLSelectElement).value || undefined)");
    expect(cardSource).toContain('this.heatingControlsDisplayMode(area) === "button"');
    expect(cardSource).toContain('"section-heating-controls-button"');
  });
});
