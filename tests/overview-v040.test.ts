import { describe, expect, it, vi } from "vitest";

import { resolveOverviewConfig } from "../src/overview/config";
import { QUICK_ACTION_ICONS } from "../src/overview/constants";
import { discoverOverview } from "../src/overview/discovery";
import type { AreaBubbleOverviewCardConfig, OverviewQuickActionId } from "../src/overview/types";
import type { HassEntity, HomeAssistant } from "../src/types";

const CARD_TYPE = "custom:area-bubble-overview-card" as const;

type V040ConfigInput = AreaBubbleOverviewCardConfig & {
  quick_action_icons?: Partial<Record<OverviewQuickActionId, unknown>> & Record<string, unknown>;
  area_overrides?: Record<
    string,
    NonNullable<AreaBubbleOverviewCardConfig["area_overrides"]>[string] & {
      parent_area?: unknown;
    }
  >;
};

type V040ResolvedConfig = ReturnType<typeof resolveOverviewConfig> & {
  quick_action_icons: Record<OverviewQuickActionId, string>;
  area_overrides: Record<string, { parent_area?: string }>;
};

type V040TemperatureMode = "none" | "off" | "cool" | "heat" | "active";

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

const resolveV040 = (patch: Omit<V040ConfigInput, "type"> = {}): V040ResolvedConfig =>
  resolveOverviewConfig({ type: CARD_TYPE, ...patch } as AreaBubbleOverviewCardConfig) as V040ResolvedConfig;

const discoveredArea = (
  instance: HomeAssistant,
  patch: Omit<V040ConfigInput, "type" | "area"> = {},
) => {
  const discovery = discoverOverview(
    instance,
    resolveV040({ area: "room", ...patch } as Omit<V040ConfigInput, "type">),
  );
  expect(discovery.areas).toHaveLength(1);
  return discovery.areas[0] as (typeof discovery.areas)[number] & {
    parentAreaId?: string;
    temperatureMode: V040TemperatureMode;
  };
};

const floorInstance = (
  areas: Array<{ id: string; name?: string; floorId?: string }>,
): HomeAssistant =>
  hass({
    areas: Object.fromEntries(
      areas.map(({ id, name = id, floorId = "upstairs" }) => [
        id,
        { area_id: id, name, floor_id: floorId },
      ]),
    ),
    floors: {
      upstairs: { floor_id: "upstairs", name: "Upper floor" },
      downstairs: { floor_id: "downstairs", name: "Lower floor" },
    },
  });

const discoverFloor = (
  instance: HomeAssistant,
  patch: Omit<V040ConfigInput, "type" | "floor"> = {},
) =>
  discoverOverview(
    instance,
    resolveV040({ floor: "upstairs", ...patch } as Omit<V040ConfigInput, "type">),
  );

describe("Overview v0.4 area hierarchy configuration", () => {
  it("trims parent_area and omits blank or malformed parent references", () => {
    const config = resolveV040({
      floor: "upstairs",
      area_overrides: {
        shower: { parent_area: "  parents_room  " },
        blank: { parent_area: "   " },
        malformed: { parent_area: 42 },
      },
    });

    expect(config.area_overrides.shower.parent_area).toBe("parents_room");
    expect(config.area_overrides.blank).not.toHaveProperty("parent_area");
    expect(config.area_overrides.malformed).not.toHaveProperty("parent_area");
  });

  it("exposes the sanitized parent area ID on discovered child areas", () => {
    const instance = hass({
      areas: {
        parents_room: { area_id: "parents_room", name: "Parents room", floor_id: "upstairs" },
        shower: { area_id: "shower", name: "Parents shower", floor_id: "upstairs" },
      },
      floors: {
        upstairs: { floor_id: "upstairs", name: "Upper floor" },
      },
    });
    const discovery = discoverOverview(
      instance,
      resolveV040({
        floor: "upstairs",
        area_overrides: {
          shower: { parent_area: " parents_room " },
        },
      }),
    );
    const areas = discovery.areas as Array<(typeof discovery.areas)[number] & { parentAreaId?: string }>;

    expect(areas.find((area) => area.id === "parents_room")?.parentAreaId).toBeUndefined();
    expect(areas.find((area) => area.id === "shower")?.parentAreaId).toBe("parents_room");
  });

  it("detaches every member of a two-area parent cycle and emits one safe warning", () => {
    const discovery = discoverFloor(floorInstance([
      { id: "parents_room", name: "Parents room" },
      { id: "parents_shower", name: "Parents shower" },
    ]), {
      area_overrides: {
        parents_room: { parent_area: "parents_shower" },
        parents_shower: { parent_area: "parents_room" },
      },
    });

    expect(discovery.areas).toHaveLength(2);
    expect(discovery.areas.map((area) => [area.id, area.parentAreaId])).toEqual([
      ["parents_room", undefined],
      ["parents_shower", undefined],
    ]);
    expect(discovery.warnings).toHaveLength(1);
    expect(discovery.warnings[0]).toContain("Area parent cycle ignored");
    expect(discovery.warnings[0]).toContain("parents_room");
    expect(discovery.warnings[0]).toContain("parents_shower");
  });

  it("detaches only the three cyclic areas while preserving a non-cyclic child", () => {
    const discovery = discoverFloor(floorInstance([
      { id: "alpha", name: "Alpha" },
      { id: "beta", name: "Beta" },
      { id: "gamma", name: "Gamma" },
      { id: "child", name: "Child" },
    ]), {
      area_overrides: {
        alpha: { parent_area: "beta" },
        beta: { parent_area: "gamma" },
        gamma: { parent_area: "alpha" },
        child: { parent_area: "alpha" },
      },
    });
    const byId = new Map(discovery.areas.map((area) => [area.id, area]));

    expect(byId.get("alpha")?.parentAreaId).toBeUndefined();
    expect(byId.get("beta")?.parentAreaId).toBeUndefined();
    expect(byId.get("gamma")?.parentAreaId).toBeUndefined();
    expect(byId.get("child")?.parentAreaId).toBe("alpha");
    expect(discovery.warnings).toHaveLength(1);
  });

  it("turns missing, out-of-target, and hidden parents into root areas", () => {
    const discovery = discoverFloor(floorInstance([
      { id: "missing_child", name: "Missing child" },
      { id: "outside_child", name: "Outside child" },
      { id: "hidden_child", name: "Hidden child" },
      { id: "hidden_parent", name: "Hidden parent" },
      { id: "outside_parent", name: "Outside parent", floorId: "downstairs" },
    ]), {
      area_overrides: {
        missing_child: { parent_area: "does_not_exist" },
        outside_child: { parent_area: "outside_parent" },
        hidden_child: { parent_area: "hidden_parent" },
        hidden_parent: { hidden: true },
      },
    });

    expect(discovery.areas.map((area) => area.id)).toEqual([
      "hidden_child",
      "missing_child",
      "outside_child",
    ]);
    expect(discovery.areas.every((area) => area.parentAreaId === undefined)).toBe(true);
    expect(discovery.warnings).toEqual([]);
  });

  it("does not resolve an ambiguous duplicate display-name alias as a parent", () => {
    const discovery = discoverFloor(floorInstance([
      { id: "first", name: "First registry name" },
      { id: "second", name: "Second registry name" },
      { id: "child", name: "Child" },
    ]), {
      area_overrides: {
        first: { name: "Shared room" },
        second: { name: "Shared room" },
        child: { parent_area: "Shared room" },
      },
    });

    expect(discovery.areas.find((area) => area.id === "child")?.parentAreaId).toBeUndefined();
  });

  it("returns every targeted visible area exactly once after hierarchy normalization", () => {
    const discovery = discoverFloor(floorInstance([
      { id: "root", name: "Root room" },
      { id: "child", name: "Child room" },
      { id: "grandchild", name: "Grandchild room" },
      { id: "sibling", name: "Sibling room" },
    ]), {
      area_overrides: {
        child: { parent_area: "Root room" },
        grandchild: { parent_area: "child" },
        sibling: { parent_area: "root" },
      },
    });
    const ids = discovery.areas.map((area) => area.id);

    expect(ids).toHaveLength(4);
    expect(new Set(ids).size).toBe(4);
    expect(ids.sort()).toEqual(["child", "grandchild", "root", "sibling"]);
  });
});

describe("Overview v0.4 quick-action icon configuration", () => {
  it("resolves every default quick-action icon when no overrides are configured", () => {
    expect(resolveV040({ area: "room" }).quick_action_icons).toEqual(QUICK_ACTION_ICONS);
  });

  it("accepts only known quick actions, trims icons, and falls back for invalid values", () => {
    const config = resolveV040({
      area: "room",
      quick_action_icons: {
        lights: "  mdi:floor-lamp  ",
        climate: "   ",
        floor_heating: "mdi:radiator",
        switches: 17,
        unsupported_action: "mdi:alert",
      },
    });

    expect(config.quick_action_icons).toEqual({
      ...QUICK_ACTION_ICONS,
      lights: "mdi:floor-lamp",
      floor_heating: "mdi:radiator",
    });
    expect(config.quick_action_icons).not.toHaveProperty("unsupported_action");
  });

  it("uses the complete default map when quick_action_icons is malformed", () => {
    const config = resolveV040({
      area: "room",
      quick_action_icons: [] as unknown as V040ConfigInput["quick_action_icons"],
    });

    expect(config.quick_action_icons).toEqual(QUICK_ACTION_ICONS);
  });
});

describe("Overview v0.4 room temperature mode discovery", () => {
  const instanceWithClimate = (
    state: string,
    attributes: Record<string, unknown> = {},
  ): HomeAssistant =>
    hass({
      areas: { room: { area_id: "room", name: "Room" } },
      states: {
        "climate.room": entity("climate.room", state, {
          current_temperature: 24,
          ...attributes,
        }),
      },
      entities: {
        "climate.room": { entity_id: "climate.room", area_id: "room" },
      },
    });

  it("reports none when the area has no climate entity", () => {
    const area = discoveredArea(
      hass({
        areas: { room: { area_id: "room", name: "Room" } },
        states: {
          "sensor.room_temperature": entity("sensor.room_temperature", "24", {
            device_class: "temperature",
          }),
        },
        entities: {
          "sensor.room_temperature": { entity_id: "sensor.room_temperature", area_id: "room" },
        },
      }),
    );

    expect(area.temperature).toBe(24);
    expect(area.temperatureMode).toBe("none");
  });

  it.each([
    ["off", "off"],
    ["cool", "cool"],
    ["heat", "heat"],
    ["auto", "active"],
    ["dry", "active"],
    ["fan_only", "active"],
  ] as const)("maps climate state %s to temperature mode %s when hvac_action is absent", (state, expected) => {
    expect(discoveredArea(instanceWithClimate(state)).temperatureMode).toBe(expected);
  });

  it.each([
    ["cooling", "heat", "cool"],
    ["heating", "cool", "heat"],
    ["idle", "cool", "cool"],
    ["off", "heat", "off"],
    ["drying", "cool", "active"],
    ["fan", "heat", "active"],
  ] as const)(
    "prefers hvac_action %s over conflicting climate state %s",
    (hvacAction, state, expected) => {
      const area = discoveredArea(instanceWithClimate(state, { hvac_action: hvacAction }));
      expect(area.temperatureMode).toBe(expected);
    },
  );

  it("ignores climate entities classified as floor heating", () => {
    const area = discoveredArea(
      hass({
        areas: { room: { area_id: "room", name: "Room" } },
        states: {
          "climate.air_conditioner": entity("climate.air_conditioner", "cool", {
            current_temperature: 24,
            hvac_action: "cooling",
          }),
          "climate.floor_heating": entity("climate.floor_heating", "heat", {
            current_temperature: 24,
            hvac_action: "heating",
          }),
        },
        entities: {
          "climate.air_conditioner": { entity_id: "climate.air_conditioner", area_id: "room" },
          "climate.floor_heating": { entity_id: "climate.floor_heating", area_id: "room" },
        },
      }),
      { floor_heating_entities: ["climate.floor_heating"] },
    );

    expect(area.allEntities.find((item) => item.entityId === "climate.floor_heating")?.section).toBe("floor_heating");
    expect(area.temperatureMode).toBe("cool");
  });

  it("does not let an excluded climate entity influence temperature mode", () => {
    const area = discoveredArea(
      instanceWithClimate("heat", { hvac_action: "heating" }),
      { exclude_entities: ["climate.room"] },
    );

    expect(area.allEntities).toEqual([]);
    expect(area.temperatureMode).toBe("none");
  });

  it("resolves simultaneous heating and cooling deterministically as active", () => {
    const mixedInstance = (reverse: boolean): HomeAssistant => {
      const entries = [
        ["climate.heating", entity("climate.heating", "heat", { hvac_action: "heating" })],
        ["climate.cooling", entity("climate.cooling", "cool", { hvac_action: "cooling" })],
      ] as const;
      const ordered = reverse ? [...entries].reverse() : entries;
      return hass({
        areas: { room: { area_id: "room", name: "Room" } },
        states: Object.fromEntries(ordered),
        entities: Object.fromEntries(
          ordered.map(([entityId]) => [entityId, { entity_id: entityId, area_id: "room" }]),
        ),
      });
    };

    expect(discoveredArea(mixedInstance(false)).temperatureMode).toBe("active");
    expect(discoveredArea(mixedInstance(true)).temperatureMode).toBe("active");
  });
});
