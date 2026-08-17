import type { HassEntity } from "../types";
import { CLIMATE_FEATURES, COVER_FEATURES, MEDIA_FEATURES, WATER_HEATER_FEATURES } from "./constants";
import type { OverviewArea, OverviewEntity } from "./types";

export type EntityServicePlan = {
  service: string;
  data?: Record<string, unknown>;
};

export const supportsEntityFeature = (entity: HassEntity, feature: number): boolean => {
  const supported = entity.attributes.supported_features;
  return typeof supported !== "number" || (supported & feature) !== 0;
};

/**
 * Decides whether the current room temperature belongs in an Area summary.
 * Sensor-only rooms keep their temperature because there is no room climate
 * entity whose power state can govern the badge. Underfloor thermostats and
 * entities excluded from room activity are deliberately ignored.
 */
export const shouldShowAreaTemperature = (area: OverviewArea, hideWhenClimateOff: boolean): boolean => {
  if (area.temperature === undefined) return false;
  if (!hideWhenClimateOff) return true;
  const roomClimates = area.allEntities.filter(
    (item) => item.domain === "climate"
      && item.section === "climate"
      && item.available
      && item.ignoreActivity !== true,
  );
  return roomClimates.length === 0 || area.temperatureMode !== "off";
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

/** Normalized HA cover position: 0 is closed and 100 is fully open. */
export const coverPosition = (entity: HassEntity): number | undefined => {
  const value = entity.attributes.current_position;
  if (typeof value === "number" && Number.isFinite(value)) return Math.min(100, Math.max(0, value));
  if (typeof value === "string" && value.trim() && Number.isFinite(Number(value))) {
    return Math.min(100, Math.max(0, Number(value)));
  }
  return undefined;
};

/**
 * Cover state used by badges and counts. Position wins over an idle state,
 * while a moving cover remains open until Home Assistant reports completion.
 */
export const isCoverOpen = (entity: HassEntity): boolean => {
  const state = String(entity.state ?? "").toLowerCase();
  if (["", "unknown", "unavailable"].includes(state)) return false;
  if (["opening", "closing"].includes(state)) return true;
  const position = coverPosition(entity);
  return position !== undefined ? position > 0 : state === "open";
};

/**
 * A cover can report `open` while it is only partially open. Prefer its
 * numeric position when available so both directional controls remain usable;
 * Stop is useful only while the cover is moving.
 */
export const coverControlDisabled = (
  service: CoverControlService,
  state: string,
  position?: number,
  assumedState = false,
): boolean => {
  const normalizedState = state.toLowerCase();
  if (normalizedState === "unavailable") return true;
  // Match Home Assistant's native Cover controls: integrations are not
  // required to publish `opening` / `closing` quickly (or at all), so Stop
  // must remain callable whenever the entity is available. The UI can still
  // render an idle Stop action with lower visual emphasis without disabling
  // the service itself.
  if (service === "stop_cover") return false;
  // Do not repeat a command in the direction that is already in progress,
  // but keep the opposite direction available so the user can reverse it.
  if (normalizedState === "opening") return service === "open_cover";
  if (normalizedState === "closing") return service === "close_cover";
  // An assumed state is not a reliable endpoint. Home Assistant exposes that
  // uncertainty explicitly, so both directional actions must stay available.
  if (assumedState) return false;
  if (service === "open_cover") return position !== undefined ? position >= 100 : normalizedState === "open";
  return position !== undefined ? position <= 0 : normalizedState === "closed";
};

/** Whether a cover still needs a requested fully-open or fully-closed action. */
export const coverNeedsAction = (item: OverviewEntity, turnOn: boolean): boolean =>
  item.domain === "cover" && !coverControlDisabled(
    turnOn ? "open_cover" : "close_cover",
    item.entity.state,
    coverPosition(item.entity),
    item.entity.attributes.assumed_state === true,
  );

export const coverSupportsService = (entity: HassEntity, service: CoverControlService): boolean => {
  const feature = service === "open_cover"
    ? COVER_FEATURES.OPEN
    : service === "close_cover"
      ? COVER_FEATURES.CLOSE
      : COVER_FEATURES.STOP;
  return supportsEntityFeature(entity, feature);
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
