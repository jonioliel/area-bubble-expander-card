import { describe, expect, it, vi } from "vitest";

import { runSectionOffAction, sectionActionEntities } from "../src/overview/actions";
import type { HassEntity, HomeAssistant } from "../src/types";
import type { OverviewEntity, OverviewSection, OverviewSectionId } from "../src/overview/types";

type EntityOptions = Partial<Pick<OverviewEntity, "available" | "active" | "powered" | "protected">> & {
  attributes?: Record<string, unknown>;
  state?: string;
};

const overviewEntity = (
  entityId: string,
  section: OverviewSectionId,
  options: EntityOptions = {},
): OverviewEntity => {
  const domain = entityId.split(".")[0];
  const powered = options.powered ?? true;
  const state = options.state ?? (powered ? "on" : "off");
  const entity: HassEntity = {
    entity_id: entityId,
    state,
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
  };
};

const overviewSection = (id: OverviewSectionId, entities: OverviewEntity[]): OverviewSection => ({
  id,
  title: id,
  icon: "mdi:circle",
  entities,
  activeCount: entities.filter((item) => item.active).length,
});

const homeAssistant = (callService = vi.fn(async () => undefined)): HomeAssistant => ({
  states: {},
  callService,
});

describe("Overview section-wide off actions", () => {
  it("selects every powered, available, unprotected entity, including powered idle entities", () => {
    const section = overviewSection("media", [
      overviewEntity("media_player.playing", "media"),
      overviewEntity("media_player.idle", "media", { active: false, powered: true, state: "idle" }),
      overviewEntity("media_player.off", "media", { powered: false }),
      overviewEntity("media_player.unavailable", "media", { available: false }),
      overviewEntity("media_player.protected", "media", { protected: true }),
    ]);

    expect(sectionActionEntities(section).map((item) => item.entityId)).toEqual([
      "media_player.playing",
      "media_player.idle",
    ]);
  });

  it("turns off lights and switches and groups each domain into one service call", async () => {
    const callService = vi.fn(async () => undefined);
    const section = overviewSection("lights_switches", [
      overviewEntity("light.ceiling", "lights_switches"),
      overviewEntity("light.bedside", "lights_switches"),
      overviewEntity("switch.lamp", "lights_switches"),
      overviewEntity("switch.already_off", "lights_switches", { powered: false }),
      overviewEntity("switch.always_on", "lights_switches", { protected: true }),
    ]);

    await runSectionOffAction(homeAssistant(callService), section);

    expect(callService).toHaveBeenCalledTimes(2);
    expect(callService).toHaveBeenNthCalledWith(1, "light", "turn_off", undefined, {
      entity_id: ["light.ceiling", "light.bedside"],
    });
    expect(callService).toHaveBeenNthCalledWith(2, "switch", "turn_off", undefined, {
      entity_id: ["switch.lamp"],
    });
  });

  it("closes every open cover with one close_cover call", async () => {
    const callService = vi.fn(async () => undefined);
    const section = overviewSection("covers", [
      overviewEntity("cover.left", "covers", { attributes: { supported_features: 2 } }),
      overviewEntity("cover.right", "covers", { attributes: { supported_features: 15 } }),
      overviewEntity("cover.closed", "covers", { powered: false, state: "closed" }),
    ]);

    await runSectionOffAction(homeAssistant(callService), section);

    expect(callService).toHaveBeenCalledOnce();
    expect(callService).toHaveBeenCalledWith("cover", "close_cover", undefined, {
      entity_id: ["cover.left", "cover.right"],
    });
  });

  it("uses feature-aware climate services and groups identical fallback modes", async () => {
    const callService = vi.fn(async () => undefined);
    const section = overviewSection("climate", [
      overviewEntity("climate.native", "climate", { attributes: { supported_features: 128 } }),
      overviewEntity("climate.fallback_one", "climate", {
        state: "cool",
        attributes: { supported_features: 1, hvac_modes: ["off", "cool"] },
      }),
      overviewEntity("climate.fallback_two", "climate", {
        state: "heat",
        attributes: { supported_features: 1, hvac_modes: ["off", "heat"] },
      }),
      overviewEntity("fan.ventilation", "climate"),
    ]);

    await runSectionOffAction(homeAssistant(callService), section);

    expect(callService).toHaveBeenCalledTimes(3);
    expect(callService).toHaveBeenNthCalledWith(1, "climate", "turn_off", undefined, {
      entity_id: ["climate.native"],
    });
    expect(callService).toHaveBeenNthCalledWith(2, "climate", "set_hvac_mode", { hvac_mode: "off" }, {
      entity_id: ["climate.fallback_one", "climate.fallback_two"],
    });
    expect(callService).toHaveBeenNthCalledWith(3, "fan", "turn_off", undefined, {
      entity_id: ["fan.ventilation"],
    });
  });

  it("uses supported power services for floor heating and media sections", async () => {
    const floorCalls = vi.fn(async () => undefined);
    await runSectionOffAction(homeAssistant(floorCalls), overviewSection("floor_heating", [
      overviewEntity("switch.floor_left", "floor_heating"),
      overviewEntity("switch.floor_right", "floor_heating"),
      overviewEntity("water_heater.boiler", "floor_heating", { attributes: { supported_features: 8 } }),
    ]));

    expect(floorCalls).toHaveBeenNthCalledWith(1, "switch", "turn_off", undefined, {
      entity_id: ["switch.floor_left", "switch.floor_right"],
    });
    expect(floorCalls).toHaveBeenNthCalledWith(2, "water_heater", "turn_off", undefined, {
      entity_id: ["water_heater.boiler"],
    });

    const mediaCalls = vi.fn(async () => undefined);
    await runSectionOffAction(homeAssistant(mediaCalls), overviewSection("media", [
      overviewEntity("media_player.speaker", "media", { attributes: { supported_features: 256 } }),
    ]));
    expect(mediaCalls).toHaveBeenCalledWith("media_player", "turn_off", undefined, {
      entity_id: ["media_player.speaker"],
    });
  });

  it.each([
    [
      "covers" as const,
      overviewEntity("cover.open_only", "covers", { attributes: { supported_features: 1 } }),
    ],
    [
      "media" as const,
      overviewEntity("media_player.volume_only", "media", { attributes: { supported_features: 4 } }),
    ],
    [
      "lights_switches" as const,
      overviewEntity("sensor.forced_into_section", "lights_switches"),
    ],
  ])("skips an unsupported powered entity in %s while controlling valid targets", async (sectionId, unsupported) => {
    const callService = vi.fn(async () => undefined);
    const valid = sectionId === "covers"
      ? overviewEntity("cover.valid", "covers", { attributes: { supported_features: 2 } })
      : overviewEntity("switch.valid", sectionId);

    await expect(runSectionOffAction(
      homeAssistant(callService),
      overviewSection(sectionId, [valid, unsupported]),
    )).resolves.toBeUndefined();
    expect(callService).toHaveBeenCalledOnce();
    expect(callService.mock.calls[0]?.[3]).toEqual({ entity_id: [valid.entityId] });
  });

  it("does nothing when the section has no safe powered targets", async () => {
    const callService = vi.fn(async () => undefined);
    const section = overviewSection("lights_switches", [
      overviewEntity("light.off", "lights_switches", { powered: false }),
      overviewEntity("switch.protected", "lights_switches", { protected: true }),
      overviewEntity("switch.unavailable", "lights_switches", { available: false }),
    ]);

    await expect(runSectionOffAction(homeAssistant(callService), section)).resolves.toBeUndefined();
    expect(callService).not.toHaveBeenCalled();
  });

  it("waits for every service group and reports partial failures", async () => {
    const callService = vi.fn((domain: string) =>
      domain === "switch" ? Promise.reject(new Error("offline")) : Promise.resolve(undefined),
    );
    const section = overviewSection("lights_switches", [
      overviewEntity("light.ceiling", "lights_switches"),
      overviewEntity("switch.wall", "lights_switches"),
    ]);

    await expect(runSectionOffAction(homeAssistant(callService), section)).rejects.toThrow(
      "1 of 2 section actions failed.",
    );
    expect(callService).toHaveBeenCalledTimes(2);
  });
});
