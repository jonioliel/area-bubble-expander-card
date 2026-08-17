import { describe, expect, it, vi } from "vitest";

import {
  quickActionActionEntities,
  quickActionDirectEntities,
  quickActionEntityService,
  quickActionEntities,
  quickActionMembers,
  runQuickAction,
  runQuickActionAction,
  runQuickActionDirectAction,
  runSectionAction,
  runSectionOffAction,
  sectionActionEntities,
} from "../src/overview/actions";
import { AUTO_FAN_GROUP, AUTO_FLOOR_HEATING_GROUP } from "../src/overview/constants";
import type { HassEntity, HomeAssistant } from "../src/types";
import type {
  OverviewArea,
  OverviewEntity,
  OverviewSection,
  OverviewSectionId,
} from "../src/overview/types";

type EntityOptions = Partial<Pick<OverviewEntity, "available" | "active" | "powered" | "protected" | "group">> & {
  attributes?: Record<string, unknown>;
  state?: string;
};

const overviewEntity = (
  entityId: string,
  section: OverviewSectionId,
  options: EntityOptions = {},
): OverviewEntity => {
  const domain = entityId.split(".")[0];
  const powered = options.powered ?? false;
  const entity: HassEntity = {
    entity_id: entityId,
    state: options.state ?? (powered ? "on" : "off"),
    attributes: options.attributes ?? {},
    last_changed: "2026-01-01T00:00:00.000Z",
    last_updated: "2026-01-01T00:00:00.000Z",
  };
  return {
    entity,
    entityId,
    domain,
    name: entityId,
    icon: "mdi:circle",
    areaId: "bedroom",
    section,
    labels: [],
    available: options.available ?? true,
    active: options.active ?? powered,
    powered,
    protected: options.protected ?? false,
    group: options.group,
  };
};

const overviewSection = (id: OverviewSectionId, entities: OverviewEntity[]): OverviewSection => ({
  id,
  title: id,
  icon: "mdi:circle",
  entities,
  activeCount: entities.filter((item) => item.active).length,
});

const overviewArea = (entities: OverviewEntity[]): OverviewArea => ({
  id: "bedroom",
  name: "Bedroom",
  icon: "mdi:bed",
  showWhenParentCollapsed: false,
  sections: [],
  allEntities: entities,
  temperatureMode: "none",
  occupancy: "none",
  occupancyCountSource: "none",
  occupancyEntities: [],
});

const homeAssistant = (callService = vi.fn(async () => undefined)): HomeAssistant => ({
  states: {},
  callService,
});

describe("Overview section-wide directional actions", () => {
  it("selects only available, unprotected, supported entities that need the requested state", () => {
    const section = overviewSection("lights_switches", [
      overviewEntity("light.off", "lights_switches"),
      overviewEntity("light.on", "lights_switches", { powered: true }),
      overviewEntity("switch.unavailable", "lights_switches", { available: false }),
      overviewEntity("switch.protected", "lights_switches", { protected: true }),
      overviewEntity("sensor.unsupported", "lights_switches"),
    ]);

    expect(sectionActionEntities(section, true).map((item) => item.entityId)).toEqual(["light.off"]);
    expect(sectionActionEntities(section, false).map((item) => item.entityId)).toEqual(["light.on"]);
    expect(sectionActionEntities(section).map((item) => item.entityId)).toEqual(["light.on"]);
  });

  it("turns on lights, switches, and fans in domain-grouped service calls", async () => {
    const callService = vi.fn(async () => undefined);
    const section = overviewSection("lights_switches", [
      overviewEntity("light.ceiling", "lights_switches"),
      overviewEntity("light.bedside", "lights_switches"),
      overviewEntity("switch.wall", "lights_switches"),
      overviewEntity("fan.vent", "lights_switches"),
      overviewEntity("light.already_on", "lights_switches", { powered: true }),
      overviewEntity("switch.protected", "lights_switches", { protected: true }),
    ]);

    await runSectionAction(homeAssistant(callService), section, true);

    expect(callService).toHaveBeenCalledTimes(3);
    expect(callService).toHaveBeenNthCalledWith(1, "light", "turn_on", undefined, {
      entity_id: ["light.ceiling", "light.bedside"],
    });
    expect(callService).toHaveBeenNthCalledWith(2, "switch", "turn_on", undefined, {
      entity_id: ["switch.wall"],
    });
    expect(callService).toHaveBeenNthCalledWith(3, "fan", "turn_on", undefined, {
      entity_id: ["fan.vent"],
    });
  });

  it("opens and closes covers only when the directional feature is supported", async () => {
    const openCalls = vi.fn(async () => undefined);
    const openSection = overviewSection("covers", [
      overviewEntity("cover.both", "covers", { attributes: { supported_features: 3 } }),
      overviewEntity("cover.open_only", "covers", { attributes: { supported_features: 1 } }),
      overviewEntity("cover.close_only", "covers", { attributes: { supported_features: 2 } }),
      overviewEntity("cover.already_open", "covers", { powered: true, state: "open", attributes: { supported_features: 3 } }),
    ]);

    expect(sectionActionEntities(openSection, true).map((item) => item.entityId)).toEqual([
      "cover.both",
      "cover.open_only",
    ]);
    await runSectionAction(homeAssistant(openCalls), openSection, true);
    expect(openCalls).toHaveBeenCalledWith("cover", "open_cover", undefined, {
      entity_id: ["cover.both", "cover.open_only"],
    });

    const closeCalls = vi.fn(async () => undefined);
    const closeSection = overviewSection("covers", [
      overviewEntity("cover.both", "covers", { powered: true, state: "open", attributes: { supported_features: 3 } }),
      overviewEntity("cover.close_only", "covers", { powered: true, state: "open", attributes: { supported_features: 2 } }),
      overviewEntity("cover.open_only", "covers", { powered: true, state: "open", attributes: { supported_features: 1 } }),
    ]);
    await runSectionAction(homeAssistant(closeCalls), closeSection, false);
    expect(closeCalls).toHaveBeenCalledWith("cover", "close_cover", undefined, {
      entity_id: ["cover.both", "cover.close_only"],
    });
  });

  it("uses feature-aware native and fallback ON services for climate, water heaters, and media", async () => {
    const callService = vi.fn(async () => undefined);
    const section = overviewSection("climate", [
      overviewEntity("climate.native", "climate", { attributes: { supported_features: 256 } }),
      overviewEntity("climate.fallback", "climate", {
        attributes: { supported_features: 1, hvac_modes: ["off", "heat"] },
      }),
      overviewEntity("water_heater.boiler", "climate", { attributes: { supported_features: 8 } }),
      overviewEntity("media_player.speaker", "climate", { attributes: { supported_features: 128 } }),
      overviewEntity("media_player.readonly", "climate", { attributes: { supported_features: 4 } }),
    ]);

    await runSectionAction(homeAssistant(callService), section, true);

    expect(callService).toHaveBeenCalledTimes(4);
    expect(callService).toHaveBeenNthCalledWith(1, "climate", "turn_on", undefined, {
      entity_id: ["climate.native"],
    });
    expect(callService).toHaveBeenNthCalledWith(2, "climate", "set_hvac_mode", { hvac_mode: "heat" }, {
      entity_id: ["climate.fallback"],
    });
    expect(callService).toHaveBeenNthCalledWith(3, "water_heater", "turn_on", undefined, {
      entity_id: ["water_heater.boiler"],
    });
    expect(callService).toHaveBeenNthCalledWith(4, "media_player", "turn_on", undefined, {
      entity_id: ["media_player.speaker"],
    });
  });

  it("keeps the OFF wrapper compatible", async () => {
    const directCalls = vi.fn(async () => undefined);
    const wrapperCalls = vi.fn(async () => undefined);
    const section = overviewSection("lights_switches", [
      overviewEntity("light.one", "lights_switches", { powered: true }),
      overviewEntity("light.two", "lights_switches", { powered: true }),
    ]);

    await runSectionAction(homeAssistant(directCalls), section, false);
    await runSectionOffAction(homeAssistant(wrapperCalls), section);
    expect(wrapperCalls.mock.calls).toEqual(directCalls.mock.calls);
  });

  it("finishes planning before making any service call", async () => {
    const callService = vi.fn(async () => undefined);
    const attributes: Record<string, unknown> = {};
    Object.defineProperty(attributes, "supported_features", {
      get: () => {
        throw new Error("invalid feature metadata");
      },
    });
    const section = overviewSection("media", [
      overviewEntity("switch.valid", "media"),
      overviewEntity("media_player.invalid", "media", { attributes }),
    ]);

    await expect(runSectionAction(homeAssistant(callService), section, true)).rejects.toThrow("invalid feature metadata");
    expect(callService).not.toHaveBeenCalled();
  });
});

describe("Overview quick-action directional actions", () => {
  it("keeps fans out of climate actions and safely toggles the compact fan group in both directions", async () => {
    const callService = vi.fn(async () => undefined);
    const area = overviewArea([
      overviewEntity("climate.parents", "climate", { powered: true }),
      overviewEntity("climate.fan_coil", "climate", { powered: true, group: AUTO_FAN_GROUP }),
      overviewEntity("fan.ceiling", "climate", { powered: true }),
      overviewEntity("switch.parents_fan", "climate", { powered: true, group: AUTO_FAN_GROUP }),
      overviewEntity("switch.unrelated", "climate", { powered: true }),
      overviewEntity("climate.floor_heating", "floor_heating", { powered: true }),
    ]);

    expect(quickActionMembers(area, "climate").map((item) => item.entityId)).toEqual([
      "climate.parents",
      "climate.fan_coil",
    ]);
    expect(quickActionMembers(area, "floor_heating").map((item) => item.entityId)).toEqual([
      "climate.floor_heating",
    ]);
    expect(quickActionMembers(area, "fans").map((item) => item.entityId)).toEqual([
      "fan.ceiling",
      "switch.parents_fan",
    ]);

    await runQuickActionAction(homeAssistant(callService), area, "fans", false);
    expect(callService).toHaveBeenCalledWith("fan", "turn_off", undefined, { entity_id: ["fan.ceiling"] });
    expect(callService).toHaveBeenCalledWith("switch", "turn_off", undefined, { entity_id: ["switch.parents_fan"] });

    callService.mockClear();
    const offArea = overviewArea([
      overviewEntity("fan.ceiling", "climate"),
      overviewEntity("switch.parents_fan", "climate", { group: AUTO_FAN_GROUP }),
      overviewEntity("switch.protected_fan", "climate", { group: AUTO_FAN_GROUP, protected: true }),
      overviewEntity("switch.unavailable_fan", "climate", { group: AUTO_FAN_GROUP, available: false }),
    ]);
    await runQuickActionAction(homeAssistant(callService), offArea, "fans", true);
    expect(callService).toHaveBeenCalledWith("fan", "turn_on", undefined, { entity_id: ["fan.ceiling"] });
    expect(callService).toHaveBeenCalledWith("switch", "turn_on", undefined, { entity_id: ["switch.parents_fan"] });
    expect(callService).toHaveBeenCalledTimes(2);
  });

  it("exposes safe directional services for individual popup rows", () => {
    const cover = overviewEntity("cover.shade", "covers", { attributes: { supported_features: 3 } });
    const closeOnly = overviewEntity("cover.close_only", "covers", { attributes: { supported_features: 2 } });
    const light = overviewEntity("light.ceiling", "lights_switches");

    expect(quickActionEntityService("covers", cover, true)).toEqual({ service: "open_cover" });
    expect(quickActionEntityService("covers", cover, false)).toEqual({ service: "close_cover" });
    expect(quickActionEntityService("covers", closeOnly, true)).toBeUndefined();
    expect(quickActionEntityService("lights", light, true)).toEqual({ service: "turn_on" });
    expect(quickActionEntityService("media", light, true)).toBeUndefined();
  });

  it("keeps protected members out of bulk actions but allows an explicit compact subgroup toggle", async () => {
    const callService = vi.fn(async () => undefined);
    const members = [
      overviewEntity("fan.protected", "climate", { group: AUTO_FAN_GROUP, protected: true }),
      overviewEntity("switch.unavailable", "climate", { group: AUTO_FAN_GROUP, available: false }),
    ];
    const area = overviewArea(members);

    expect(quickActionActionEntities(area, "fans", true)).toEqual([]);
    expect(quickActionDirectEntities(members, "fans", true).map((item) => item.entityId)).toEqual(["fan.protected"]);

    await runQuickActionDirectAction(homeAssistant(callService), members, "fans", true);
    expect(callService).toHaveBeenCalledOnce();
    expect(callService).toHaveBeenCalledWith("fan", "turn_on", undefined, { entity_id: ["fan.protected"] });

    callService.mockClear();
    const heatingMembers = [
      overviewEntity("switch.protected_heating", "floor_heating", {
        group: AUTO_FLOOR_HEATING_GROUP,
        protected: true,
      }),
    ];
    expect(quickActionDirectEntities(heatingMembers, "heating_controls", true).map((item) => item.entityId)).toEqual([
      "switch.protected_heating",
    ]);
    await runQuickActionDirectAction(homeAssistant(callService), heatingMembers, "heating_controls", true);
    expect(callService).toHaveBeenCalledOnce();
    expect(callService).toHaveBeenCalledWith("switch", "turn_on", undefined, {
      entity_id: ["switch.protected_heating"],
    });
  });

  it("returns all category members for display but only safe opposite-state entities for an action", () => {
    const area = overviewArea([
      overviewEntity("light.off", "lights_switches"),
      overviewEntity("light.on", "lights_switches", { powered: true }),
      overviewEntity("light.unavailable", "lights_switches", { available: false }),
      overviewEntity("light.protected", "lights_switches", { protected: true }),
      overviewEntity("switch.wall", "lights_switches"),
    ]);

    expect(quickActionMembers(area, "lights").map((item) => item.entityId)).toEqual([
      "light.off",
      "light.on",
      "light.unavailable",
      "light.protected",
    ]);
    expect(quickActionActionEntities(area, "lights", true).map((item) => item.entityId)).toEqual(["light.off"]);
    expect(quickActionActionEntities(area, "lights", false).map((item) => item.entityId)).toEqual(["light.on"]);
    expect(quickActionEntities(area, "lights").map((item) => item.entityId)).toEqual(["light.on"]);
  });

  it("supports directional quick actions, including opening covers", async () => {
    const lightCalls = vi.fn(async () => undefined);
    const lights = overviewArea([
      overviewEntity("light.one", "lights_switches"),
      overviewEntity("light.two", "lights_switches"),
    ]);
    await runQuickActionAction(homeAssistant(lightCalls), lights, "lights", true);
    expect(lightCalls).toHaveBeenCalledWith("light", "turn_on", undefined, {
      entity_id: ["light.one", "light.two"],
    });

    const coverCalls = vi.fn(async () => undefined);
    const covers = overviewArea([
      overviewEntity("cover.left", "covers", { attributes: { supported_features: 1 } }),
      overviewEntity("cover.right", "covers", { attributes: { supported_features: 3 } }),
    ]);
    await runQuickActionAction(homeAssistant(coverCalls), covers, "covers", true);
    expect(coverCalls).toHaveBeenCalledWith("cover", "open_cover", undefined, {
      entity_id: ["cover.left", "cover.right"],
    });
  });

  it("preserves the legacy quick-action OFF wrappers", async () => {
    const directCalls = vi.fn(async () => undefined);
    const wrapperCalls = vi.fn(async () => undefined);
    const area = overviewArea([
      overviewEntity("switch.one", "lights_switches", { powered: true }),
      overviewEntity("switch.two", "lights_switches", { powered: true }),
    ]);

    await runQuickActionAction(homeAssistant(directCalls), area, "switches", false);
    await runQuickAction(homeAssistant(wrapperCalls), area, "switches");
    expect(wrapperCalls.mock.calls).toEqual(directCalls.mock.calls);
  });

  it("skips unsupported category members while operating every valid target", async () => {
    const callService = vi.fn(async () => undefined);
    const area = overviewArea([
      overviewEntity("switch.floor", "floor_heating"),
      overviewEntity("sensor.temperature", "floor_heating"),
    ]);

    await expect(runQuickActionAction(homeAssistant(callService), area, "floor_heating", true)).resolves.toBeUndefined();
    expect(quickActionMembers(area, "floor_heating").map((item) => item.entityId)).toContain("sensor.temperature");
    expect(quickActionActionEntities(area, "floor_heating", true).map((item) => item.entityId)).toEqual([
      "switch.floor",
    ]);
    expect(callService).toHaveBeenCalledWith("switch", "turn_on", undefined, {
      entity_id: ["switch.floor"],
    });
  });
});
