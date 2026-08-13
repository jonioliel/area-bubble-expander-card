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
