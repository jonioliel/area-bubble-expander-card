import { beforeAll, describe, expect, it, vi } from "vitest";

import {
  climateTemperatureStep,
  climateTemperatureTargets,
  normalizeClimateTemperature,
  type ClimateTemperatureTargets,
} from "../src/overview/features";
import type { AreaBubbleOverviewCardConfig, OverviewEntity } from "../src/overview/types";
import type { HassEntity, HomeAssistant } from "../src/types";

const CARD_TYPE = "custom:area-bubble-overview-card" as const;

const climate = (attributes: Record<string, unknown>, state = "cool"): OverviewEntity => {
  const entity: HassEntity = {
    entity_id: "climate.room",
    state,
    attributes: {
      friendly_name: "Room climate",
      min_temp: 7,
      max_temp: 35,
      ...attributes,
    },
    last_changed: "2026-01-01T00:00:00Z",
    last_updated: "2026-01-01T00:00:00Z",
  };
  return {
    entity,
    entityId: entity.entity_id,
    domain: "climate",
    name: "Room climate",
    icon: "mdi:air-conditioner",
    areaId: "room",
    section: "climate",
    labels: [],
    available: true,
    active: state !== "off",
    powered: state !== "off",
    protected: false,
  };
};

describe("Home Assistant climate target semantics", () => {
  it("keeps single-temperature and temperature-range capabilities separate", () => {
    const attributes = { temperature: 22, target_temp_low: 18, target_temp_high: 26 };
    expect(climateTemperatureTargets(climate({ ...attributes, supported_features: 1 }))).toEqual({
      temperature: 22,
      low: undefined,
      high: undefined,
    });
    expect(climateTemperatureTargets(climate({ ...attributes, supported_features: 2 }))).toEqual({
      temperature: undefined,
      low: 18,
      high: 26,
    });
  });

  it("uses the entity step and Home Assistant's Celsius/Fahrenheit fallbacks", () => {
    expect(climateTemperatureStep(climate({ supported_features: 1 }), "°C")).toBe(0.5);
    expect(climateTemperatureStep(climate({ supported_features: 1 }), "°F")).toBe(1);
    expect(climateTemperatureStep(climate({ supported_features: 1, target_temp_step: 0.1 }), "°F")).toBe(0.1);
    expect(climateTemperatureStep(climate({ supported_features: 1, target_temp_step: 0 }), "°C")).toBe(0.5);
  });

  it("clamps targets and removes floating-point drift at the advertised precision", () => {
    const item = climate({ supported_features: 1, target_temp_step: 0.1 });
    expect(normalizeClimateTemperature(item, 21.200000000000003, 0.1)).toBe(21.2);
    expect(normalizeClimateTemperature(item, 99, 0.1)).toBe(35);
    expect(normalizeClimateTemperature(item, -99, 0.1)).toBe(7);
  });
});

type CardUnderTest = {
  hass?: HomeAssistant;
  setConfig(config: AreaBubbleOverviewCardConfig): void;
  setClimateTemperature(item: OverviewEntity, temperature: number): void;
  setClimateRange(item: OverviewEntity, low: number, high: number, changed: "low" | "high"): void;
  setClimateMode(item: OverviewEntity, event: Event): void;
  setFanMode(item: OverviewEntity, event: Event): void;
  setLightBrightness(item: OverviewEntity, event: Event): void;
  setMediaVolume(event: Event, item: OverviewEntity, volume: number): void;
  runEntityService(event: Event, item: OverviewEntity, service: string): void;
  displayedClimateTargets(item: OverviewEntity): ClimateTemperatureTargets;
};

let CardConstructor: new () => CardUnderTest;

beforeAll(async () => {
  class TestHTMLElement {
    public isConnected = false;
    public style = { setProperty: () => undefined };
    public setAttribute(): void {}
    public dispatchEvent(): boolean { return true; }
  }

  const registeredElements = new Map<string, unknown>();
  vi.stubGlobal("HTMLElement", TestHTMLElement);
  vi.stubGlobal("customElements", {
    define: (name: string, constructor: unknown) => registeredElements.set(name, constructor),
    get: (name: string) => registeredElements.get(name),
  });
  vi.stubGlobal("Document", class TestDocument {});
  vi.stubGlobal("ShadowRoot", class TestShadowRoot {});
  vi.stubGlobal("CSSStyleSheet", class TestCSSStyleSheet {});
  vi.stubGlobal("document", {
    documentElement: { lang: "en" },
    createElement: () => ({}),
    createTreeWalker: () => ({}),
  });
  vi.stubGlobal("window", {
    customCards: [],
    setTimeout: globalThis.setTimeout.bind(globalThis),
    clearTimeout: globalThis.clearTimeout.bind(globalThis),
  });

  const module = await import("../src/overview/area-bubble-overview-card");
  CardConstructor = module.AreaBubbleOverviewCard as unknown as new () => CardUnderTest;
});

const cardWithService = (callService = vi.fn(async () => undefined)) => {
  const card = new CardConstructor();
  card.hass = {
    states: {},
    language: "en",
    locale: { language: "en" },
    config: { unit_system: { temperature: "°C" } },
    callService,
  };
  card.setConfig({ type: CARD_TYPE, area: "room", remember_expanded_state: false });
  return { card, callService };
};

const menuEvent = (value: string): Event => ({
  detail: { item: { value } },
  stopPropagation: vi.fn(),
}) as unknown as Event;

const controlEvent = (detail: Record<string, unknown> = {}): Event => ({
  detail,
  stopPropagation: vi.fn(),
}) as unknown as Event;

const entityItem = (
  entityId: string,
  state: string,
  attributes: Record<string, unknown>,
  section: OverviewEntity["section"],
): OverviewEntity => {
  const entity: HassEntity = {
    entity_id: entityId,
    state,
    attributes,
    last_changed: "2026-01-01T00:00:00Z",
    last_updated: "2026-01-01T00:00:00Z",
  };
  return {
    entity,
    entityId,
    domain: entityId.split(".")[0],
    name: entityId,
    icon: "mdi:circle",
    areaId: "room",
    section,
    labels: [],
    available: true,
    active: state === "on" || state === "playing" || state === "open",
    powered: state === "on" || state === "playing" || state === "open",
    protected: false,
  };
};

describe("Overview thermostat service controls", () => {
  it("keeps an optimistic target so consecutive changes never resend stale state", async () => {
    const { card, callService } = cardWithService();
    const item = climate({ supported_features: 1, temperature: 21, target_temp_step: 0.5 });

    card.setClimateTemperature(item, 21.5);
    await vi.waitFor(() => expect(callService).toHaveBeenCalledTimes(1));
    await vi.waitFor(() => expect(card.displayedClimateTargets(item).temperature).toBe(21.5));

    card.setClimateTemperature(item, card.displayedClimateTargets(item).temperature! + 0.5);
    await vi.waitFor(() => expect(callService).toHaveBeenCalledTimes(2));

    expect(callService).toHaveBeenNthCalledWith(1, "climate", "set_temperature", { temperature: 21.5 }, { entity_id: "climate.room" });
    expect(callService).toHaveBeenNthCalledWith(2, "climate", "set_temperature", { temperature: 22 }, { entity_id: "climate.room" });
  });

  it("sends complete, ordered range targets and preserves the optimistic pair", async () => {
    const { card, callService } = cardWithService();
    const item = climate({ supported_features: 2, target_temp_low: 18, target_temp_high: 24, target_temp_step: 0.5 }, "heat_cool");

    card.setClimateRange(item, 24.5, 24, "low");
    await vi.waitFor(() => expect(callService).toHaveBeenCalledTimes(1));

    expect(callService).toHaveBeenCalledWith("climate", "set_temperature", {
      target_temp_low: 24,
      target_temp_high: 24,
    }, { entity_id: "climate.room" });
    expect(card.displayedClimateTargets(item)).toMatchObject({ low: 24, high: 24 });
  });

  it("uses the selected HVAC and fan values from Home Assistant menus", async () => {
    const { card, callService } = cardWithService();
    const item = climate({
      supported_features: 9,
      temperature: 22,
      hvac_modes: ["off", "cool", "heat"],
      fan_mode: "auto",
      fan_modes: ["auto", "high"],
    });

    card.setClimateMode(item, menuEvent("heat"));
    await vi.waitFor(() => expect(callService).toHaveBeenCalledTimes(1));
    card.setFanMode(item, menuEvent("high"));
    await vi.waitFor(() => expect(callService).toHaveBeenCalledTimes(2));

    expect(callService).toHaveBeenNthCalledWith(1, "climate", "set_hvac_mode", { hvac_mode: "heat" }, { entity_id: "climate.room" });
    expect(callService).toHaveBeenNthCalledWith(2, "climate", "set_fan_mode", { fan_mode: "high" }, { entity_id: "climate.room" });
  });

  it("rolls an optimistic target back when Home Assistant rejects the action", async () => {
    const { card } = cardWithService(vi.fn(async () => { throw new Error("rejected"); }));
    const item = climate({ supported_features: 1, temperature: 21, target_temp_step: 0.5 });

    card.setClimateTemperature(item, 21.5);
    await vi.waitFor(() => expect(card.displayedClimateTargets(item).temperature).toBe(21));
  });
});

describe("Overview individual service controls", () => {
  it("clamps light brightness and uses off instead of an invalid zero brightness", async () => {
    const { card, callService } = cardWithService();
    const light = entityItem("light.dimmer", "on", { brightness: 128, supported_color_modes: ["brightness"] }, "lights_switches");

    card.setLightBrightness(light, controlEvent({ value: 150 }));
    await vi.waitFor(() => expect(callService).toHaveBeenCalledTimes(1));
    card.setLightBrightness(light, controlEvent({ value: 0 }));
    await vi.waitFor(() => expect(callService).toHaveBeenCalledTimes(2));

    expect(callService).toHaveBeenNthCalledWith(1, "light", "turn_on", { brightness_pct: 100 }, { entity_id: "light.dimmer" });
    expect(callService).toHaveBeenNthCalledWith(2, "light", "turn_off", undefined, { entity_id: "light.dimmer" });
  });

  it("clamps media volume to Home Assistant's zero-to-one range", async () => {
    const { card, callService } = cardWithService();
    const player = entityItem("media_player.speaker", "playing", { volume_level: 0.4, supported_features: 4 }, "media");

    card.setMediaVolume(controlEvent(), player, 1.4);
    await vi.waitFor(() => expect(callService).toHaveBeenCalledTimes(1));

    expect(callService).toHaveBeenCalledWith("media_player", "volume_set", { volume_level: 1 }, { entity_id: "media_player.speaker" });
  });

  it("routes direct cover controls through the entity's real domain", async () => {
    const { card, callService } = cardWithService();
    const cover = entityItem("cover.shade", "open", { current_position: 50, supported_features: 11 }, "covers");

    card.runEntityService(controlEvent(), cover, "close_cover");
    await vi.waitFor(() => expect(callService).toHaveBeenCalledTimes(1));

    expect(callService).toHaveBeenCalledWith("cover", "close_cover", undefined, { entity_id: "cover.shade" });
  });
});
