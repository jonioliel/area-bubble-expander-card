import { describe, expect, it, vi } from "vitest";

import { quickActionEntities, runQuickAction } from "../src/overview/actions";
import { entityPowerService, supportsEntityFeature } from "../src/overview/features";
import { resolveOverviewConfig, validateOverviewConfig } from "../src/overview/config";
import { discoverOverview, isOverviewEntityPowered, overviewEntityAreaId } from "../src/overview/discovery";
import type { HassEntity, HomeAssistant } from "../src/types";
import type {
  AreaBubbleOverviewCardConfig,
  OverviewArea,
  OverviewEntity,
  OverviewQuickActionId,
  OverviewSectionId,
  ResolvedOverviewConfig,
} from "../src/overview/types";

const CARD_TYPE = "custom:area-bubble-overview-card" as const;
const ALL_SECTIONS: OverviewSectionId[] = ["climate", "floor_heating", "covers", "lights_switches", "media"];

const entity = (
  entityId: string,
  state = "off",
  attributes: Record<string, unknown> = {},
): HassEntity => ({
  entity_id: entityId,
  state,
  attributes,
  last_changed: "2026-01-01T00:00:00.000Z",
  last_updated: "2026-01-01T00:00:00.000Z",
});

const hass = (overrides: Partial<HomeAssistant> = {}): HomeAssistant => ({
  states: {},
  language: "en",
  locale: { language: "en" },
  config: { unit_system: { temperature: "°C" } },
  callService: vi.fn(async () => undefined),
  ...overrides,
});

const resolved = (
  patch: Partial<AreaBubbleOverviewCardConfig> = {},
): ResolvedOverviewConfig =>
  resolveOverviewConfig({
    type: CARD_TYPE,
    language: "en",
    ...patch,
  });

const discoverArea = (
  instance: HomeAssistant,
  configPatch: Partial<AreaBubbleOverviewCardConfig> = {},
): OverviewArea => {
  const result = discoverOverview(instance, resolved({ area: "kids", ...configPatch }));
  expect(result.areas).toHaveLength(1);
  return result.areas[0];
};

const sectionEntities = (area: OverviewArea, section: OverviewSectionId): string[] =>
  area.sections.find((item) => item.id === section)?.entities.map((item) => item.entityId) ?? [];

describe("overview configuration", () => {
  it("validates the card type, exclusive target, and duplicate section IDs", () => {
    expect(() => validateOverviewConfig({ type: CARD_TYPE, area: "kids" })).not.toThrow();

    expect(() => validateOverviewConfig(null as unknown as AreaBubbleOverviewCardConfig)).toThrow(
      "Invalid Area Bubble Overview Card configuration.",
    );
    expect(() =>
      validateOverviewConfig({ type: "custom:wrong-card" } as unknown as AreaBubbleOverviewCardConfig),
    ).toThrow(`Card type must be ${CARD_TYPE}.`);
    expect(() => validateOverviewConfig({ type: CARD_TYPE, area: "kids", floor: "upstairs" })).toThrow(
      "Choose either an area or a floor, not both.",
    );
    expect(() =>
      validateOverviewConfig({
        type: CARD_TYPE,
        area: "kids",
        section_order: ["climate", "covers", "climate"],
      }),
    ).toThrow("section_order cannot contain duplicates.");
  });

  it("preserves defaults for omitted arrays and style values", () => {
    const config = resolved({ area: "kids" });

    expect(config.type).toBe(CARD_TYPE);
    expect(config.target_icon).toBe("");
    expect(config.floor_default_expanded).toBe(true);
    expect(resolved({ floor_default_expanded: false }).floor_default_expanded).toBe(false);
    expect(config.section_order).toEqual(ALL_SECTIONS);
    expect(config.quick_actions).toEqual(["lights", "climate", "floor_heating", "switches", "covers", "media"]);
    expect(config.floor_heating_labels).toEqual(["floor_heating", "underfloor_heating"]);
    expect(config.style).toMatchObject({
      border_radius: 26,
      row_height: 56,
      active_color: "var(--state-active-color, #ffd54f)",
      row_background: "color-mix(in srgb, var(--secondary-background-color) 78%, transparent)",
      active_surface: "rgba(174, 215, 219, 0.94)",
      climate_surface: "rgba(139, 181, 255, 0.94)",
      control_surface: "rgba(11, 28, 58, 0.94)",
    });
  });

  it("sanitizes section/action lists and malformed nested overrides", () => {
    const config = resolveOverviewConfig({
      type: CARD_TYPE,
      area: "",
      floor: "",
      id: 42 as unknown as string,
      title: false as unknown as string,
      section_order: ["media", "invalid", "climate"] as OverviewSectionId[],
      section_titles: {
        media: "Audio",
        covers: 17 as unknown as string,
      },
      quick_actions: [" media ", "invalid", "lights", "media"] as OverviewQuickActionId[],
      area_order: [" kids ", "", "office"],
      include_entities: {
        climate: [" climate.kids ", "", "fan.kids"],
      },
      area_overrides: {
        kids: {
          name: "Children",
          occupancy_count_entity: " sensor.kids_people ",
          occupancy_entities: [" binary_sensor.kids_presence ", ""],
          section_order: ["covers", "invalid"] as OverviewSectionId[],
          section_titles: {
            covers: "Shades",
            climate: 99 as unknown as string,
          },
          include_entities: {
            floor_heating: [" switch.floor ", ""],
          },
        },
        blank_count: {
          occupancy_count_entity: "   ",
        },
        broken: [] as unknown as never,
      },
      entity_overrides: {
        "light.kids": {
          name: "Night light",
          section: "invalid" as OverviewSectionId,
          hidden: "yes" as unknown as boolean,
          protected: true,
        },
        broken: null as unknown as never,
      },
    });

    expect(config.id).toBe("");
    expect(config.area).toBeUndefined();
    expect(config.floor).toBeUndefined();
    expect(config.title).toBe("");
    expect(config.section_order).toEqual(["media", "climate", "floor_heating", "covers", "lights_switches"]);
    expect(config.section_titles).toEqual({
      climate: "",
      floor_heating: "",
      covers: "",
      lights_switches: "",
      media: "Audio",
    });
    expect(config.quick_actions).toEqual(["media", "lights"]);
    expect(config.area_order).toEqual(["kids", "office"]);
    expect(config.include_entities).toEqual({ climate: ["climate.kids", "fan.kids"] });
    expect(config.area_overrides.broken).toBeUndefined();
    expect(config.area_overrides.kids).toMatchObject({
      name: "Children",
      occupancy_count_entity: "sensor.kids_people",
      occupancy_entities: ["binary_sensor.kids_presence"],
      section_order: ["covers", "climate", "floor_heating", "lights_switches", "media"],
      section_titles: { covers: "Shades" },
      include_entities: { floor_heating: ["switch.floor"] },
    });
    expect(config.area_overrides.blank_count).not.toHaveProperty("occupancy_count_entity");
    expect(config.entity_overrides.broken).toBeUndefined();
    expect(config.entity_overrides["light.kids"]).toEqual({
      name: "Night light",
      protected: true,
    });
  });

  it("trims a configured target icon and ignores malformed icon/count overrides", () => {
    const config = resolveOverviewConfig({
      type: CARD_TYPE,
      area: "kids",
      target_icon: "  mdi:home-heart  ",
      area_overrides: {
        kids: { occupancy_count_entity: 7 as unknown as string },
      },
    });

    expect(config.target_icon).toBe("mdi:home-heart");
    expect(config.area_overrides.kids).not.toHaveProperty("occupancy_count_entity");
  });
});

describe("area and floor discovery", () => {
  const registryHass = (): HomeAssistant =>
    hass({
      areas: {
        kids: { area_id: "kids", name: "Kids room", floor_id: "upstairs", icon: "mdi:teddy-bear" },
        office: { area_id: "office", name: "Office", floor_id: "upstairs" },
        kitchen: { area_id: "kitchen", name: "Kitchen", floor_id: "ground" },
      },
      floors: {
        upstairs: { floor_id: "upstairs", name: "Upper floor", icon: "mdi:home-floor-2" },
        ground: { floor_id: "ground", name: "Ground floor" },
      },
      entities: {
        "light.kids": { entity_id: "light.kids", area_id: "kids" },
        "light.office": { entity_id: "light.office", area_id: "office" },
        "light.kitchen": { entity_id: "light.kitchen", area_id: "kitchen" },
      },
      states: {
        "light.kids": entity("light.kids", "on", { friendly_name: "Kids light" }),
        "light.office": entity("light.office", "off", { friendly_name: "Office light" }),
        "light.kitchen": entity("light.kitchen", "on", { friendly_name: "Kitchen light" }),
      },
    });

  it("finds an area by ID or display name and reports a missing area", () => {
    const instance = registryHass();
    const byId = discoverOverview(instance, resolved({ area: "kids" }));
    const byName = discoverOverview(instance, resolved({ area: "Kids room", title: "Children" }));
    const missing = discoverOverview(instance, resolved({ area: "attic" }));

    expect(byId).toMatchObject({
      targetKind: "area",
      targetName: "Kids room",
      targetIcon: "mdi:teddy-bear",
      warnings: [],
    });
    expect(byId.areas.map((area) => area.id)).toEqual(["kids"]);
    expect(byName.targetName).toBe("Children");
    expect(byName.areas.map((area) => area.id)).toEqual(["kids"]);
    expect(missing).toMatchObject({
      targetKind: "area",
      targetName: "attic",
      areas: [],
      warnings: ["Area not found: attic"],
    });
  });

  it("applies target, area, and entity icon overrides in their intended scopes", () => {
    const instance = registryHass();
    instance.states["light.kids"].attributes.icon = "mdi:lightbulb-variant";

    const result = discoverOverview(
      instance,
      resolved({
        area: "kids",
        target_icon: "mdi:home-heart",
        area_overrides: { kids: { icon: "mdi:rocket-launch" } },
        entity_overrides: { "light.kids": { icon: "mdi:ceiling-light-multiple" } },
      }),
    );

    expect(result.targetIcon).toBe("mdi:home-heart");
    expect(result.areas[0].icon).toBe("mdi:rocket-launch");
    expect(result.areas[0].allEntities[0].icon).toBe("mdi:ceiling-light-multiple");
  });

  it("falls back through area/entity registry icons and lets a target icon override a floor icon", () => {
    const instance = registryHass();
    instance.states["light.kids"].attributes.icon = "mdi:light-recessed";

    const areaResult = discoverOverview(instance, resolved({ area: "kids" }));
    const overriddenAreaTarget = discoverOverview(
      instance,
      resolved({ area: "kids", area_overrides: { kids: { icon: "mdi:star-four-points" } } }),
    );
    const floorResult = discoverOverview(
      instance,
      resolved({ floor: "upstairs", target_icon: "mdi:layers-triple" }),
    );

    expect(areaResult.targetIcon).toBe("mdi:teddy-bear");
    expect(areaResult.areas[0].icon).toBe("mdi:teddy-bear");
    expect(areaResult.areas[0].allEntities[0].icon).toBe("mdi:light-recessed");
    expect(overriddenAreaTarget.targetIcon).toBe("mdi:star-four-points");
    expect(floorResult.targetIcon).toBe("mdi:layers-triple");
    expect(floorResult.areas.find((area) => area.id === "kids")?.icon).toBe("mdi:teddy-bear");
    expect(floorResult.areas.find((area) => area.id === "office")?.allEntities[0].icon).toBe("mdi:lightbulb");
  });

  it("expands a floor into its areas and honors configured area ordering", () => {
    const result = discoverOverview(
      registryHass(),
      resolved({ floor: "Upper floor", area_order: ["Office", "kids"] }),
    );

    expect(result).toMatchObject({
      targetKind: "floor",
      targetName: "Upper floor",
      targetIcon: "mdi:home-floor-2",
      warnings: [],
    });
    expect(result.areas.map((area) => area.id)).toEqual(["office", "kids"]);
    expect(result.areas.every((area) => area.floorId === "upstairs")).toBe(true);
  });

  it("resolves direct entity area before falling back through its device", () => {
    const instance = hass({
      entities: {
        "light.direct": { entity_id: "light.direct", area_id: "office", device_id: "device-kids" },
        "switch.device": { entity_id: "switch.device", device_id: "device-kids" },
        "light.orphan": { entity_id: "light.orphan" },
      },
      devices: {
        "device-kids": { id: "device-kids", area_id: "kids" },
      },
    });

    expect(overviewEntityAreaId(instance, "light.direct")).toBe("office");
    expect(overviewEntityAreaId(instance, "switch.device")).toBe("kids");
    expect(overviewEntityAreaId(instance, "light.orphan")).toBeUndefined();
    expect(overviewEntityAreaId(undefined, "light.orphan")).toBeUndefined();
  });
});

describe("entity classification and filtering", () => {
  it("distinguishes visual activity from powered-on media and water-heater states", () => {
    expect(isOverviewEntityPowered(entity("media_player.speaker", "idle"))).toBe(true);
    expect(isOverviewEntityPowered(entity("media_player.speaker", "standby"))).toBe(false);
    expect(isOverviewEntityPowered(entity("water_heater.boiler", "eco"))).toBe(true);
    expect(isOverviewEntityPowered(entity("water_heater.boiler", "off"))).toBe(false);
  });

  it("classifies supported domains and floor heating by entity/device label, list, and override", () => {
    const states = Object.fromEntries(
      [
        entity("climate.ac", "cool", { friendly_name: "AC" }),
        entity("fan.ceiling", "on", { friendly_name: "Fan" }),
        entity("cover.shade", "open", { friendly_name: "Shade" }),
        entity("light.ceiling", "on", { friendly_name: "Ceiling" }),
        entity("switch.socket", "on", { friendly_name: "Socket" }),
        entity("media_player.speaker", "playing", { friendly_name: "Speaker" }),
        entity("switch.entity_label", "on", { friendly_name: "Labeled at entity" }),
        entity("switch.device_label", "on", { friendly_name: "Labeled at device" }),
        entity("switch.explicit", "on", { friendly_name: "Explicit list" }),
        entity("switch.override", "on", { friendly_name: "Override" }),
        entity("switch.override_precedence", "on", { friendly_name: "Override wins" }),
      ].map((item) => [item.entity_id, item]),
    );
    const entities = Object.fromEntries(
      Object.keys(states).map((entityId) => [
        entityId,
        {
          entity_id: entityId,
          area_id: "kids",
          ...(entityId === "switch.entity_label" || entityId === "switch.override_precedence"
            ? { labels: ["warm_floor"] }
            : {}),
          ...(entityId === "switch.device_label" ? { device_id: "floor-device" } : {}),
        },
      ]),
    );
    const area = discoverArea(
      hass({
        areas: { kids: { area_id: "kids", name: "Kids" } },
        states,
        entities,
        devices: { "floor-device": { id: "floor-device", area_id: "kids", labels: ["warm_floor"] } },
      }),
      {
        floor_heating_labels: ["warm_floor"],
        floor_heating_entities: ["switch.explicit"],
        entity_overrides: {
          "switch.override": { section: "floor_heating" },
          "switch.override_precedence": { section: "lights_switches" },
        },
      },
    );

    expect(sectionEntities(area, "climate")).toEqual(["climate.ac", "fan.ceiling"]);
    expect(sectionEntities(area, "covers")).toEqual(["cover.shade"]);
    expect(sectionEntities(area, "lights_switches")).toEqual([
      "light.ceiling",
      "switch.override_precedence",
      "switch.socket",
    ]);
    expect(sectionEntities(area, "media")).toEqual(["media_player.speaker"]);
    expect(sectionEntities(area, "floor_heating")).toEqual([
      "switch.explicit",
      "switch.device_label",
      "switch.entity_label",
      "switch.override",
    ]);
  });

  it("supports global and area include overrides for otherwise unclassified entities", () => {
    const instance = hass({
      areas: { kids: { area_id: "kids", name: "Kids" } },
      states: {
        "sensor.assigned": entity("sensor.assigned", "42", { friendly_name: "Assigned sensor" }),
        "input_boolean.forced": entity("input_boolean.forced", "on", { friendly_name: "Forced helper" }),
      },
      entities: {
        "sensor.assigned": { entity_id: "sensor.assigned", area_id: "kids" },
        "input_boolean.forced": { entity_id: "input_boolean.forced" },
      },
    });

    const area = discoverArea(instance, {
      include_entities: { media: ["sensor.assigned"] },
      area_overrides: {
        kids: { include_entities: { lights_switches: ["input_boolean.forced"] } },
      },
    });

    expect(sectionEntities(area, "media")).toEqual(["sensor.assigned"]);
    expect(sectionEntities(area, "lights_switches")).toEqual(["input_boolean.forced"]);
  });

  it("removes hidden, disabled, diagnostic, and excluded entities", () => {
    const ids = [
      "light.visible",
      "light.registry_hidden",
      "light.hidden_by",
      "light.disabled",
      "light.device_disabled",
      "light.config",
      "light.diagnostic",
      "light.override_hidden",
      "light.global_excluded",
      "light.area_excluded",
    ];
    const states = Object.fromEntries(ids.map((id) => [id, entity(id, "on", { friendly_name: id })]));
    const entities = Object.fromEntries(
      ids.map((id) => [
        id,
        {
          entity_id: id,
          area_id: "kids",
          ...(id === "light.registry_hidden" ? { hidden: true } : {}),
          ...(id === "light.hidden_by" ? { hidden_by: "user" } : {}),
          ...(id === "light.disabled" ? { disabled_by: "user" } : {}),
          ...(id === "light.device_disabled" ? { device_id: "disabled-device" } : {}),
          ...(id === "light.config" ? { entity_category: "config" } : {}),
          ...(id === "light.diagnostic" ? { entity_category: "diagnostic" } : {}),
        },
      ]),
    );
    const area = discoverArea(
      hass({
        areas: { kids: { area_id: "kids", name: "Kids" } },
        states,
        entities,
        devices: { "disabled-device": { id: "disabled-device", area_id: "kids", disabled_by: "user" } },
      }),
      {
        exclude_entities: ["light.global_excluded"],
        area_overrides: { kids: { exclude_entities: ["light.area_excluded"] } },
        entity_overrides: { "light.override_hidden": { hidden: true } },
      },
    );

    expect(area.allEntities.map((item) => item.entityId)).toEqual(["light.visible"]);
  });

  it("removes excluded entities from area power, temperature, and occupancy summaries", () => {
    const area = discoverArea(
      hass({
        areas: { kids: { area_id: "kids", name: "Kids" } },
        states: {
          "switch.always_on": entity("switch.always_on", "on", { friendly_name: "Infrastructure" }),
          "light.room": entity("light.room", "off", { friendly_name: "Room light" }),
          "sensor.hot": entity("sensor.hot", "99", {
            device_class: "temperature",
            unit_of_measurement: "ֲ°C",
          }),
          "sensor.room_temperature": entity("sensor.room_temperature", "22", {
            device_class: "temperature",
            unit_of_measurement: "ֲ°C",
          }),
          "binary_sensor.always_present": entity("binary_sensor.always_present", "on", {
            device_class: "presence",
          }),
          "binary_sensor.room_presence": entity("binary_sensor.room_presence", "off", {
            device_class: "presence",
          }),
        },
        entities: Object.fromEntries(
          [
            "switch.always_on",
            "light.room",
            "sensor.hot",
            "sensor.room_temperature",
            "binary_sensor.always_present",
            "binary_sensor.room_presence",
          ].map((entityId) => [entityId, { entity_id: entityId, area_id: "kids" }]),
        ),
      }),
      {
        exclude_entities: ["switch.always_on"],
        area_overrides: {
          kids: {
            temperature_entity: "sensor.hot",
            occupancy_entities: ["binary_sensor.always_present", "binary_sensor.room_presence"],
            exclude_entities: ["sensor.hot", "binary_sensor.always_present"],
          },
        },
      },
    );

    expect(area.allEntities.map((item) => item.entityId)).toEqual(["light.room"]);
    expect(area.allEntities.some((item) => item.powered)).toBe(false);
    expect(area.sections.flatMap((section) => section.entities).some((item) => item.powered)).toBe(false);
    expect(area.sections.every((section) => section.activeCount === 0)).toBe(true);
    expect(quickActionEntities(area, "switches")).toEqual([]);
    expect(area.temperature).toBe(22);
    expect(area.occupancy).toBe("vacant");
    expect(area.occupancyCount).toBe(0);
    expect(area.occupancyCountSource).toBe("sensors");
    expect(area.occupancyEntities).toEqual(["binary_sensor.room_presence"]);
  });

  it("omits hidden areas and marks protected entities from override, list, entity label, or device label", () => {
    const ids = ["light.override", "light.list", "light.entity_label", "light.device_label", "light.normal"];
    const instance = hass({
      areas: {
        kids: { area_id: "kids", name: "Kids", floor_id: "upstairs" },
        office: { area_id: "office", name: "Office", floor_id: "upstairs" },
      },
      floors: { upstairs: { floor_id: "upstairs", name: "Upstairs" } },
      states: Object.fromEntries([
        ...ids.map((id) => [id, entity(id, "on", { friendly_name: id })] as const),
        ["light.office", entity("light.office", "on")],
      ]),
      entities: {
        ...Object.fromEntries(
          ids.map((id) => [
            id,
            {
              entity_id: id,
              area_id: "kids",
              ...(id === "light.entity_label" ? { labels: ["do_not_stop"] } : {}),
              ...(id === "light.device_label" ? { device_id: "protected-device" } : {}),
            },
          ]),
        ),
        "light.office": { entity_id: "light.office", area_id: "office" },
      },
      devices: {
        "protected-device": { id: "protected-device", area_id: "kids", labels: ["do_not_stop"] },
      },
    });
    const config = resolved({
      floor: "upstairs",
      protected_labels: ["do_not_stop"],
      protected_entities: ["light.list"],
      area_overrides: { office: { hidden: true } },
      entity_overrides: { "light.override": { protected: true } },
    });

    const result = discoverOverview(instance, config);
    expect(result.areas.map((area) => area.id)).toEqual(["kids"]);
    expect(
      Object.fromEntries(result.areas[0].allEntities.map((item) => [item.entityId, item.protected])),
    ).toEqual({
      "light.override": true,
      "light.list": true,
      "light.entity_label": true,
      "light.device_label": true,
      "light.normal": false,
    });
  });
});

describe("temperature and occupancy", () => {
  it("uses area override temperature before the area registry source and discovered sensors", () => {
    const area = discoverArea(
      hass({
        areas: {
          kids: {
            area_id: "kids",
            name: "Kids",
            temperature_entity_id: "sensor.registry_temperature",
          },
        },
        states: {
          "sensor.override_temperature": entity("sensor.override_temperature", "31.5", {
            unit_of_measurement: "°F",
          }),
          "sensor.registry_temperature": entity("sensor.registry_temperature", "28", {
            unit_of_measurement: "°C",
          }),
          "sensor.room_temperature": entity("sensor.room_temperature", "20", {
            device_class: "temperature",
            unit_of_measurement: "°C",
          }),
        },
        entities: {
          "sensor.room_temperature": { entity_id: "sensor.room_temperature", area_id: "kids" },
        },
      }),
      { area_overrides: { kids: { temperature_entity: "sensor.override_temperature" } } },
    );

    expect(area.temperature).toBe(31.5);
    expect(area.temperatureUnit).toBe("°F");
  });

  it("uses the area registry temperature when there is no valid override source", () => {
    const area = discoverArea(
      hass({
        areas: {
          kids: { area_id: "kids", name: "Kids", temperature_entity_id: "sensor.registry_temperature" },
        },
        states: {
          "sensor.bad_override": entity("sensor.bad_override", "unknown"),
          "sensor.registry_temperature": entity("sensor.registry_temperature", "28", {
            unit_of_measurement: "°C",
          }),
          "sensor.room_temperature": entity("sensor.room_temperature", "20", { device_class: "temperature" }),
        },
        entities: {
          "sensor.room_temperature": { entity_id: "sensor.room_temperature", area_id: "kids" },
        },
      }),
      { area_overrides: { kids: { temperature_entity: "sensor.bad_override" } } },
    );

    expect(area.temperature).toBe(28);
    expect(area.temperatureUnit).toBe("°C");
  });

  it("takes the median of assigned temperature sensors before climate temperatures", () => {
    const instance = hass({
      areas: { kids: { area_id: "kids", name: "Kids" } },
      states: {
        "sensor.low": entity("sensor.low", "18", { device_class: "temperature", unit_of_measurement: "°C" }),
        "sensor.high": entity("sensor.high", "26", { device_class: "temperature", unit_of_measurement: "°C" }),
        "sensor.invalid": entity("sensor.invalid", "unknown", { device_class: "temperature" }),
        "climate.ac": entity("climate.ac", "cool", { current_temperature: 40 }),
      },
      entities: {
        "sensor.low": { entity_id: "sensor.low", area_id: "kids" },
        "sensor.high": { entity_id: "sensor.high", area_id: "kids" },
        "sensor.invalid": { entity_id: "sensor.invalid", area_id: "kids" },
        "climate.ac": { entity_id: "climate.ac", area_id: "kids" },
      },
    });

    const area = discoverArea(instance);
    expect(area.temperature).toBe(22);
    expect(area.temperatureUnit).toBe("°C");
  });

  it("falls back to the median current_temperature of assigned climates", () => {
    const area = discoverArea(
      hass({
        areas: { kids: { area_id: "kids", name: "Kids" } },
        states: {
          "climate.one": entity("climate.one", "heat", { current_temperature: 21 }),
          "climate.two": entity("climate.two", "cool", { current_temperature: "25" }),
          "climate.invalid": entity("climate.invalid", "off", { current_temperature: "unknown" }),
        },
        entities: {
          "climate.one": { entity_id: "climate.one", area_id: "kids" },
          "climate.two": { entity_id: "climate.two", area_id: "kids" },
          "climate.invalid": { entity_id: "climate.invalid", area_id: "kids" },
        },
      }),
    );

    expect(area.temperature).toBe(23);
    expect(area.temperatureUnit).toBe("°C");
  });

  it.each([
    ["occupied", 1, ["on", "off"]],
    ["occupied", 2, ["present", "detected"]],
    ["vacant", 0, ["off", "away"]],
    ["unknown", undefined, ["unknown", "off"]],
  ] as const)("derives %s and a numeric sensor count from matching occupancy sensors", (expected, count, sensorStates) => {
    const area = discoverArea(
      hass({
        areas: { kids: { area_id: "kids", name: "Kids" } },
        states: {
          "binary_sensor.motion": entity("binary_sensor.motion", sensorStates[0], { device_class: "motion" }),
          "binary_sensor.presence": entity("binary_sensor.presence", sensorStates[1], { device_class: "presence" }),
          "binary_sensor.window": entity("binary_sensor.window", "on", { device_class: "window" }),
        },
        entities: {
          "binary_sensor.motion": { entity_id: "binary_sensor.motion", area_id: "kids" },
          "binary_sensor.presence": { entity_id: "binary_sensor.presence", area_id: "kids" },
          "binary_sensor.window": { entity_id: "binary_sensor.window", area_id: "kids" },
        },
      }),
    );

    expect(area.occupancy).toBe(expected);
    expect(area.occupancyCount).toBe(count);
    expect(area.occupancyCountSource).toBe("sensors");
    expect(area.occupancyEntities).toEqual(["binary_sensor.motion", "binary_sensor.presence"]);
  });

  it.each([
    ["2.4", "occupied", 2],
    ["0", "vacant", 0],
    ["-3", "vacant", 0],
  ] as const)("uses numeric occupancy count %s as the authoritative source", (state, occupancy, count) => {
    const area = discoverArea(
      hass({
        areas: { kids: { area_id: "kids", name: "Kids" } },
        states: {
          "sensor.people": entity("sensor.people", state),
          "binary_sensor.motion": entity("binary_sensor.motion", "off", { device_class: "motion" }),
        },
        entities: {
          "sensor.people": { entity_id: "sensor.people", area_id: "kids" },
          "binary_sensor.motion": { entity_id: "binary_sensor.motion", area_id: "kids" },
        },
      }),
      { area_overrides: { kids: { occupancy_count_entity: "sensor.people" } } },
    );

    expect(area.occupancy).toBe(occupancy);
    expect(area.occupancyCount).toBe(count);
    expect(area.occupancyCountSource).toBe("entity");
    expect(area.occupancyEntities).toEqual(["sensor.people"]);
  });

  it("reports an invalid count entity as unknown instead of falling back to binary sensors", () => {
    const area = discoverArea(
      hass({
        areas: { kids: { area_id: "kids", name: "Kids" } },
        states: {
          "sensor.people": entity("sensor.people", "unknown"),
          "binary_sensor.motion": entity("binary_sensor.motion", "on", { device_class: "motion" }),
        },
        entities: {
          "sensor.people": { entity_id: "sensor.people", area_id: "kids" },
          "binary_sensor.motion": { entity_id: "binary_sensor.motion", area_id: "kids" },
        },
      }),
      { area_overrides: { kids: { occupancy_count_entity: "sensor.people" } } },
    );

    expect(area.occupancy).toBe("unknown");
    expect(area.occupancyCount).toBeUndefined();
    expect(area.occupancyCountSource).toBe("entity");
    expect(area.occupancyEntities).toEqual(["sensor.people"]);
  });

  it("counts explicitly configured people and trackers by their Home Assistant presence states", () => {
    const area = discoverArea(
      hass({
        areas: { kids: { area_id: "kids", name: "Kids" } },
        states: {
          "person.alice": entity("person.alice", "home"),
          "device_tracker.bob": entity("device_tracker.bob", "home"),
          "person.carol": entity("person.carol", "not_home"),
        },
      }),
      {
        area_overrides: {
          kids: {
            occupancy_entities: ["person.alice", "device_tracker.bob", "person.carol"],
          },
        },
      },
    );

    expect(area.occupancy).toBe("occupied");
    expect(area.occupancyCount).toBe(2);
    expect(area.occupancyCountSource).toBe("sensors");
    expect(area.occupancyEntities).toEqual(["person.alice", "device_tracker.bob", "person.carol"]);
  });

  it("lets excluding the configured count entity remove its summary impact", () => {
    const area = discoverArea(
      hass({
        areas: { kids: { area_id: "kids", name: "Kids" } },
        states: {
          "sensor.people": entity("sensor.people", "4"),
          "binary_sensor.motion": entity("binary_sensor.motion", "off", { device_class: "motion" }),
        },
        entities: {
          "sensor.people": { entity_id: "sensor.people", area_id: "kids" },
          "binary_sensor.motion": { entity_id: "binary_sensor.motion", area_id: "kids" },
        },
      }),
      {
        area_overrides: {
          kids: {
            occupancy_count_entity: "sensor.people",
            exclude_entities: ["sensor.people"],
          },
        },
      },
    );

    expect(area.occupancy).toBe("vacant");
    expect(area.occupancyCount).toBe(0);
    expect(area.occupancyCountSource).toBe("sensors");
    expect(area.occupancyEntities).toEqual(["binary_sensor.motion"]);
  });

  it("lets explicit occupancy entities override automatic discovery and reports none without candidates", () => {
    const instance = hass({
      areas: { kids: { area_id: "kids", name: "Kids" } },
      states: {
        "binary_sensor.auto_motion": entity("binary_sensor.auto_motion", "on", { device_class: "motion" }),
        "binary_sensor.explicit": entity("binary_sensor.explicit", "off", { device_class: "door" }),
      },
      entities: {
        "binary_sensor.auto_motion": { entity_id: "binary_sensor.auto_motion", area_id: "kids" },
      },
    });

    const explicit = discoverArea(instance, {
      area_overrides: { kids: { occupancy_entities: ["binary_sensor.explicit"] } },
    });
    const none = discoverArea(instance, { occupancy_device_classes: ["occupancy"] });

    expect(explicit.occupancy).toBe("vacant");
    expect(explicit.occupancyCount).toBe(0);
    expect(explicit.occupancyCountSource).toBe("sensors");
    expect(explicit.occupancyEntities).toEqual(["binary_sensor.explicit"]);
    expect(none.occupancy).toBe("none");
    expect(none.occupancyCount).toBeUndefined();
    expect(none.occupancyCountSource).toBe("none");
    expect(none.occupancyEntities).toEqual([]);
  });
});

describe("area, section, and entity ordering", () => {
  it("uses area order, per-area section order, explicit entity order, then display name", () => {
    const instance = hass({
      areas: {
        alpha: { area_id: "alpha", name: "Alpha", floor_id: "floor" },
        zeta: { area_id: "zeta", name: "Zeta", floor_id: "floor" },
      },
      floors: { floor: { floor_id: "floor", name: "Floor" } },
      states: {
        "light.alpha": entity("light.alpha", "on", { friendly_name: "Alpha light" }),
        "light.zebra": entity("light.zebra", "on", { friendly_name: "Zebra" }),
        "light.apple": entity("light.apple", "on", { friendly_name: "Apple" }),
        "light.middle": entity("light.middle", "on", { friendly_name: "Middle" }),
        "cover.zeta": entity("cover.zeta", "open", { friendly_name: "Shade" }),
        "media_player.zeta": entity("media_player.zeta", "playing", { friendly_name: "Music" }),
      },
      entities: {
        "light.alpha": { entity_id: "light.alpha", area_id: "alpha" },
        "light.zebra": { entity_id: "light.zebra", area_id: "zeta" },
        "light.apple": { entity_id: "light.apple", area_id: "zeta" },
        "light.middle": { entity_id: "light.middle", area_id: "zeta" },
        "cover.zeta": { entity_id: "cover.zeta", area_id: "zeta" },
        "media_player.zeta": { entity_id: "media_player.zeta", area_id: "zeta" },
      },
    });
    const result = discoverOverview(
      instance,
      resolved({
        floor: "floor",
        area_order: ["Zeta"],
        area_overrides: {
          zeta: {
            section_order: ["media", "covers", "lights_switches"],
            entity_order: { lights_switches: ["light.middle"] },
          },
        },
      }),
    );

    expect(result.areas.map((area) => area.id)).toEqual(["zeta", "alpha"]);
    expect(result.areas[0].sections.map((section) => section.id)).toEqual(["media", "covers", "lights_switches"]);
    expect(sectionEntities(result.areas[0], "lights_switches")).toEqual([
      "light.middle",
      "light.apple",
      "light.zebra",
    ]);
  });
});

const actionEntity = (
  entityId: string,
  section: OverviewSectionId,
  options: Partial<Pick<OverviewEntity, "available" | "active" | "powered" | "protected">> & { supportedFeatures?: number } = {},
): OverviewEntity => {
  const domain = entityId.split(".")[0];
  const { supportedFeatures, ...entityOptions } = options;
  const powered = options.powered ?? options.active !== false;
  return {
    entity: entity(
      entityId,
      powered ? "on" : "off",
      supportedFeatures === undefined ? {} : { supported_features: supportedFeatures },
    ),
    entityId,
    domain,
    name: entityId,
    icon: "mdi:circle",
    areaId: "kids",
    section,
    labels: [],
    available: true,
    active: true,
    powered,
    protected: false,
    ...entityOptions,
  };
};

const actionArea = (allEntities: OverviewEntity[]): OverviewArea => ({
  id: "kids",
  name: "Kids",
  icon: "mdi:teddy-bear",
  sections: [],
  allEntities,
  occupancy: "none",
  occupancyCountSource: "none",
  occupancyEntities: [],
});

describe("quick area actions", () => {
  const area = actionArea([
    actionEntity("light.on", "lights_switches"),
    actionEntity("light.off", "lights_switches", { active: false }),
    actionEntity("light.unavailable", "lights_switches", { available: false }),
    actionEntity("light.protected", "lights_switches", { protected: true }),
    actionEntity("switch.on", "lights_switches"),
    actionEntity("switch.floor", "floor_heating"),
    actionEntity("climate.ac", "climate"),
    actionEntity("fan.ac", "climate"),
    actionEntity("cover.shade", "covers"),
    actionEntity("cover.open_only", "covers", { supportedFeatures: 1 }),
    actionEntity("media_player.speaker", "media"),
  ]);

  it.each([
    ["lights", ["light.on"]],
    ["switches", ["switch.on"]],
    ["climate", ["climate.ac"]],
    ["fans", ["fan.ac"]],
    ["floor_heating", ["switch.floor"]],
    ["covers", ["cover.shade"]],
    ["media", ["media_player.speaker"]],
  ] as const)("selects only safe active entities for %s", (action, expected) => {
    expect(quickActionEntities(area, action).map((item) => item.entityId)).toEqual(expected);
  });

  it("groups same-service entities into one call and separates domain services", async () => {
    const callService = vi.fn(async () => undefined);
    const instance = hass({ callService });
    const floorArea = actionArea([
      actionEntity("switch.floor_one", "floor_heating"),
      actionEntity("switch.floor_two", "floor_heating"),
      actionEntity("climate.floor_one", "floor_heating"),
      actionEntity("climate.floor_two", "floor_heating"),
      actionEntity("fan.floor", "floor_heating"),
      actionEntity("water_heater.boiler", "floor_heating", { supportedFeatures: 8 }),
      actionEntity("switch.protected", "floor_heating", { protected: true }),
    ]);

    await runQuickAction(instance, floorArea, "floor_heating");

    expect(callService).toHaveBeenCalledTimes(4);
    expect(callService).toHaveBeenNthCalledWith(1, "switch", "turn_off", undefined, {
      entity_id: ["switch.floor_one", "switch.floor_two"],
    });
    expect(callService).toHaveBeenNthCalledWith(2, "climate", "turn_off", undefined, {
      entity_id: ["climate.floor_one", "climate.floor_two"],
    });
    expect(callService).toHaveBeenNthCalledWith(3, "fan", "turn_off", undefined, {
      entity_id: ["fan.floor"],
    });
    expect(callService).toHaveBeenNthCalledWith(4, "water_heater", "turn_off", undefined, {
      entity_id: ["water_heater.boiler"],
    });
  });

  it("uses supported-feature-aware climate and media power actions", () => {
    const climate = actionEntity("climate.ac", "climate", { supportedFeatures: 1 });
    climate.entity.attributes.hvac_modes = ["off", "cool"];
    climate.entity.state = "cool";
    expect(entityPowerService(climate, false)).toEqual({ service: "set_hvac_mode", data: { hvac_mode: "off" } });

    const media = actionEntity("media_player.speaker", "media", { supportedFeatures: 4 });
    expect(entityPowerService(media, false)).toBeUndefined();
    expect(supportsEntityFeature(media.entity, 4)).toBe(true);
    expect(supportsEntityFeature(media.entity, 256)).toBe(false);
  });

  it("includes idle media and active water heaters only when they can be turned off", () => {
    const media = actionEntity("media_player.idle", "media", { active: false, powered: true, supportedFeatures: 256 });
    media.entity.state = "idle";
    const unsupportedMedia = actionEntity("media_player.readonly", "media", { powered: true, supportedFeatures: 4 });
    const boiler = actionEntity("water_heater.boiler", "floor_heating", { active: true, powered: true, supportedFeatures: 8 });

    const targetArea = actionArea([media, unsupportedMedia, boiler]);
    expect(quickActionEntities(targetArea, "media").map((item) => item.entityId)).toEqual(["media_player.idle"]);
    expect(quickActionEntities(targetArea, "floor_heating").map((item) => item.entityId)).toEqual(["water_heater.boiler"]);
  });

  it("keeps an unsupported override visible but skips it in the safe group action", async () => {
    const callService = vi.fn(async () => undefined);
    const instance = hass({ callService });
    const invalidArea = actionArea([actionEntity("sensor.temperature", "floor_heating")]);

    await expect(runQuickAction(instance, invalidArea, "floor_heating")).resolves.toBeUndefined();
    expect(callService).not.toHaveBeenCalled();
  });

  it("controls valid targets while safely skipping an unsupported override", async () => {
    const callService = vi.fn(async () => undefined);
    const instance = hass({ callService });
    const invalidArea = actionArea([
      actionEntity("switch.floor", "floor_heating"),
      actionEntity("sensor.temperature", "floor_heating"),
    ]);

    await expect(runQuickAction(instance, invalidArea, "floor_heating")).resolves.toBeUndefined();
    expect(callService).toHaveBeenCalledOnce();
    expect(callService).toHaveBeenCalledWith("switch", "turn_off", undefined, {
      entity_id: ["switch.floor"],
    });
  });

  it("uses close_cover for cover actions", async () => {
    const callService = vi.fn(async () => undefined);
    await runQuickAction(hass({ callService }), actionArea([
      actionEntity("cover.left", "covers"),
      actionEntity("cover.right", "covers"),
    ]), "covers");

    expect(callService).toHaveBeenCalledOnce();
    expect(callService).toHaveBeenCalledWith("cover", "close_cover", undefined, {
      entity_id: ["cover.left", "cover.right"],
    });
  });

  it("reports climate failures without pulling fan entities into the climate action", async () => {
    const callService = vi.fn((domain: string) =>
      domain === "climate" ? Promise.reject(new Error("offline")) : Promise.resolve(undefined),
    );
    const instance = hass({ callService });
    const climateArea = actionArea([
      actionEntity("climate.ac", "climate"),
      actionEntity("fan.vent", "climate"),
    ]);

    await expect(runQuickAction(instance, climateArea, "climate")).rejects.toThrow(
      "1 of 1 area actions failed.",
    );
    expect(callService).toHaveBeenCalledTimes(1);
    expect(callService).toHaveBeenCalledWith("climate", "turn_off", undefined, {
      entity_id: ["climate.ac"],
    });
  });
});
