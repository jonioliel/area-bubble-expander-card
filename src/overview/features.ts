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
