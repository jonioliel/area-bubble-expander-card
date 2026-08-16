import type { HassEntity } from "../types";
import { CLIMATE_FEATURES, MEDIA_FEATURES, WATER_HEATER_FEATURES } from "./constants";
import type { OverviewEntity } from "./types";

export type EntityServicePlan = {
  service: string;
  data?: Record<string, unknown>;
};

export const supportsEntityFeature = (entity: HassEntity, feature: number): boolean => {
  const supported = entity.attributes.supported_features;
  return typeof supported !== "number" || (supported & feature) !== 0;
};

export const climateModes = (item: OverviewEntity): string[] =>
  Array.isArray(item.entity.attributes.hvac_modes) ? item.entity.attributes.hvac_modes.map(String) : [];

export type ClimateTemperatureTargets = {
  temperature?: number;
  low?: number;
  high?: number;
};

const finiteAttribute = (item: OverviewEntity, key: string): number | undefined => {
  const value = item.entity.attributes[key];
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
};

/**
 * Returns only temperature targets that the Climate entity advertises. Home
 * Assistant validates single targets and target ranges against different
 * supported-feature bits, so the card must never mix their service payloads.
 */
export const climateTemperatureTargets = (item: OverviewEntity): ClimateTemperatureTargets => ({
  temperature: supportsEntityFeature(item.entity, CLIMATE_FEATURES.TARGET_TEMPERATURE)
    ? finiteAttribute(item, "temperature")
    : undefined,
  low: supportsEntityFeature(item.entity, CLIMATE_FEATURES.TARGET_TEMPERATURE_RANGE)
    ? finiteAttribute(item, "target_temp_low")
    : undefined,
  high: supportsEntityFeature(item.entity, CLIMATE_FEATURES.TARGET_TEMPERATURE_RANGE)
    ? finiteAttribute(item, "target_temp_high")
    : undefined,
});

/** Home Assistant defaults target steps to 1°F and 0.5°C. */
export const climateTemperatureStep = (item: OverviewEntity, unit: string): number => {
  const configured = finiteAttribute(item, "target_temp_step");
  if (configured !== undefined && configured > 0) return configured;
  return unit.toUpperCase().includes("F") ? 1 : 0.5;
};

const stepPrecision = (step: number): number => {
  const text = String(step).toLowerCase();
  if (text.includes("e-")) return Math.min(6, Number(text.split("e-")[1]) || 0);
  return Math.min(6, text.split(".")[1]?.length ?? 0);
};

/** Clamps and removes floating-point drift without moving the target grid. */
export const normalizeClimateTemperature = (item: OverviewEntity, value: number, step: number): number => {
  const min = finiteAttribute(item, "min_temp") ?? -100;
  const max = finiteAttribute(item, "max_temp") ?? 100;
  const clamped = Math.min(max, Math.max(min, value));
  return Number(clamped.toFixed(stepPrecision(step)));
};

export const climateTemperatureSignature = (targets: ClimateTemperatureTargets): string =>
  `${targets.temperature ?? ""}|${targets.low ?? ""}|${targets.high ?? ""}`;

const NON_DIMMABLE_LIGHT_MODES = new Set(["onoff", "unknown"]);

/**
 * Home Assistant does not expose brightness as a supported_features bit. The
 * supported color modes are the reliable capability signal, while the
 * brightness attribute keeps legacy and template lights working.
 */
export const supportsLightBrightness = (item: OverviewEntity): boolean => {
  if (item.domain !== "light") return false;
  const supportedModes = Array.isArray(item.entity.attributes.supported_color_modes)
    ? item.entity.attributes.supported_color_modes.map(String)
    : [];
  const currentMode = typeof item.entity.attributes.color_mode === "string"
    ? [item.entity.attributes.color_mode]
    : [];
  return [...supportedModes, ...currentMode].some((mode) => !NON_DIMMABLE_LIGHT_MODES.has(mode))
    || typeof item.entity.attributes.brightness === "number";
};

export const lightBrightnessPercentage = (item: OverviewEntity): number => {
  if (!item.powered) return 0;
  const brightness = item.entity.attributes.brightness;
  if (typeof brightness !== "number" || !Number.isFinite(brightness)) return 100;
  return Math.min(100, Math.max(0, Math.round((brightness / 255) * 100)));
};

export type CoverControlService = "open_cover" | "stop_cover" | "close_cover";

/**
 * A cover can report `open` while it is only partially open. Prefer its
 * numeric position when available so both directional controls remain usable;
 * Stop is useful only while the cover is moving.
 */
export const coverControlDisabled = (
  service: CoverControlService,
  state: string,
  position?: number,
): boolean => {
  if (service === "open_cover") return position !== undefined ? position >= 100 : state === "open";
  if (service === "close_cover") return position !== undefined ? position <= 0 : state === "closed";
  return !["opening", "closing"].includes(state);
};

/** Covers report their open state in the cover quick action, not as room activity. */
export const countsTowardAreaActivity = (item: OverviewEntity): boolean =>
  item.powered && item.domain !== "cover" && item.ignoreActivity !== true;

export const entityPowerService = (item: OverviewEntity, turnOn: boolean): EntityServicePlan | undefined => {
  if (item.domain === "climate") {
    const feature = turnOn ? CLIMATE_FEATURES.TURN_ON : CLIMATE_FEATURES.TURN_OFF;
    if (supportsEntityFeature(item.entity, feature)) return { service: turnOn ? "turn_on" : "turn_off" };
    const modes = climateModes(item);
    if (!turnOn && modes.includes("off")) return { service: "set_hvac_mode", data: { hvac_mode: "off" } };
    const onMode = modes.find((mode) => mode !== "off");
    return turnOn && onMode ? { service: "set_hvac_mode", data: { hvac_mode: onMode } } : undefined;
  }
  if (item.domain === "media_player") {
    const feature = turnOn ? MEDIA_FEATURES.TURN_ON : MEDIA_FEATURES.TURN_OFF;
    return supportsEntityFeature(item.entity, feature) ? { service: turnOn ? "turn_on" : "turn_off" } : undefined;
  }
  if (item.domain === "water_heater") {
    return supportsEntityFeature(item.entity, WATER_HEATER_FEATURES.ON_OFF)
      ? { service: turnOn ? "turn_on" : "turn_off" }
      : undefined;
  }
  if (["light", "switch", "fan", "input_boolean"].includes(item.domain)) {
    return { service: turnOn ? "turn_on" : "turn_off" };
  }
  return undefined;
};
