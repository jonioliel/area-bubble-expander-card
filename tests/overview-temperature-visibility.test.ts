import { describe, expect, it } from "vitest";

import { resolveOverviewConfig } from "../src/overview/config";
import { shouldShowAreaTemperature } from "../src/overview/features";
import type { OverviewArea, OverviewEntity, OverviewSectionId, ResolvedOverviewConfig } from "../src/overview/types";
import type { HassEntity } from "../src/types";

const type = "custom:area-bubble-overview-card" as const;

const overviewEntity = (
  entityId: string,
  section: OverviewSectionId,
  powered: boolean,
  available = true,
): OverviewEntity => {
  const entity: HassEntity = {
    entity_id: entityId,
    state: powered ? "cool" : "off",
    attributes: {},
    last_changed: "2026-01-01T00:00:00Z",
    last_updated: "2026-01-01T00:00:00Z",
  };
  return {
    entity,
    entityId,
    domain: entityId.split(".")[0],
    name: entityId,
    icon: "mdi:thermostat",
    areaId: "kids",
    section,
    labels: [],
    available,
    active: powered,
    powered,
    protected: false,
  };
};

const area = (
  allEntities: OverviewEntity[],
  temperatureMode: OverviewArea["temperatureMode"] = allEntities.some(
    (item) => item.domain === "climate"
      && item.section === "climate"
      && item.available
      && item.ignoreActivity !== true
      && item.powered,
  ) ? "cool" : "off",
): OverviewArea => ({
  id: "kids",
  name: "Kids",
  icon: "mdi:teddy-bear",
  showWhenParentCollapsed: false,
  sections: [],
  allEntities,
  temperature: 24.5,
  temperatureUnit: "°C",
  temperatureMode,
  occupancy: "none",
  occupancyCountSource: "none",
  occupancyEntities: [],
});

const effectiveHideWhenClimateOff = (config: ResolvedOverviewConfig, target: OverviewArea): boolean =>
  config.area_overrides[target.id]?.hide_temperature_when_climate_off
    ?? config.area_overrides[target.name]?.hide_temperature_when_climate_off
    ?? config.hide_temperature_when_climate_off;

describe("room temperature visibility while climate is off", () => {
  it("keeps the temperature visible by default for backwards compatibility", () => {
    const target = area([overviewEntity("climate.kids_ac", "climate", false)]);
    const config = resolveOverviewConfig({ type });

    expect(config.hide_temperature_when_climate_off).toBe(false);
    expect(shouldShowAreaTemperature(target, effectiveHideWhenClimateOff(config, target))).toBe(true);
  });

  it("hides the temperature only when the option is enabled and every air-conditioning climate is off", () => {
    const config = resolveOverviewConfig({ type, hide_temperature_when_climate_off: true });

    expect(shouldShowAreaTemperature(area([
      overviewEntity("climate.kids_ac", "climate", false),
      overviewEntity("climate.kids_second_ac", "climate", false),
    ]), config.hide_temperature_when_climate_off)).toBe(false);
    expect(shouldShowAreaTemperature(area([
      overviewEntity("climate.kids_ac", "climate", false),
      overviewEntity("climate.kids_second_ac", "climate", true),
    ]), config.hide_temperature_when_climate_off)).toBe(true);
  });

  it("does not treat floor-heating thermostats as the room air conditioner", () => {
    const config = resolveOverviewConfig({ type, hide_temperature_when_climate_off: true });

    expect(shouldShowAreaTemperature(area([
      overviewEntity("climate.kids_floor", "floor_heating", false),
    ]), config.hide_temperature_when_climate_off)).toBe(true);
    expect(shouldShowAreaTemperature(area([
      overviewEntity("climate.kids_ac", "climate", false),
      overviewEntity("climate.kids_floor", "floor_heating", true),
    ]), config.hide_temperature_when_climate_off)).toBe(false);
  });

  it("keeps sensor-only room temperatures visible because there is no air conditioner to be off", () => {
    const config = resolveOverviewConfig({ type, hide_temperature_when_climate_off: true });

    expect(shouldShowAreaTemperature(area([
      overviewEntity("sensor.kids_temperature", "lights_switches", false),
    ]), config.hide_temperature_when_climate_off)).toBe(true);
    expect(shouldShowAreaTemperature(area([]), config.hide_temperature_when_climate_off)).toBe(true);
  });

  it("keeps the temperature visible when every air conditioner is unavailable", () => {
    const config = resolveOverviewConfig({ type, hide_temperature_when_climate_off: true });

    expect(shouldShowAreaTemperature(area([
      overviewEntity("climate.kids_ac", "climate", false, false),
    ]), config.hide_temperature_when_climate_off)).toBe(true);
    expect(shouldShowAreaTemperature(area([
      overviewEntity("climate.kids_unavailable", "climate", false, false),
      overviewEntity("climate.kids_available", "climate", false, true),
    ]), config.hide_temperature_when_climate_off)).toBe(false);
  });

  it("ignores climate entities that are excluded from room activity", () => {
    const config = resolveOverviewConfig({ type, hide_temperature_when_climate_off: true });
    const ignoredOff = overviewEntity("climate.ignored_ac", "climate", false);
    ignoredOff.ignoreActivity = true;
    const ignoredOn = overviewEntity("climate.ignored_on_ac", "climate", true);
    ignoredOn.ignoreActivity = true;

    expect(shouldShowAreaTemperature(area([ignoredOff], "none"), config.hide_temperature_when_climate_off)).toBe(true);
    expect(shouldShowAreaTemperature(area([
      overviewEntity("climate.room_ac", "climate", false),
      ignoredOn,
    ], "off"), config.hide_temperature_when_climate_off)).toBe(false);
  });

  it("uses the resolved HVAC action mode when it contradicts a stale entity power state", () => {
    const config = resolveOverviewConfig({ type, hide_temperature_when_climate_off: true });
    const staleOffClimate = overviewEntity("climate.kids_ac", "climate", false);

    expect(shouldShowAreaTemperature(
      area([staleOffClimate], "cool"),
      config.hide_temperature_when_climate_off,
    )).toBe(true);
  });

  it("lets an area override take precedence over the global setting in both directions", () => {
    const target = area([overviewEntity("climate.kids_ac", "climate", false)]);
    const forceVisible = resolveOverviewConfig({
      type,
      hide_temperature_when_climate_off: true,
      area_overrides: { kids: { hide_temperature_when_climate_off: false } },
    });
    const forceHidden = resolveOverviewConfig({
      type,
      hide_temperature_when_climate_off: false,
      area_overrides: { kids: { hide_temperature_when_climate_off: true } },
    });
    const forceHiddenByName = resolveOverviewConfig({
      type,
      hide_temperature_when_climate_off: false,
      area_overrides: { Kids: { hide_temperature_when_climate_off: true } },
    });

    expect(forceVisible.area_overrides.kids.hide_temperature_when_climate_off).toBe(false);
    expect(forceHidden.area_overrides.kids.hide_temperature_when_climate_off).toBe(true);
    expect(shouldShowAreaTemperature(target, effectiveHideWhenClimateOff(forceVisible, target))).toBe(true);
    expect(shouldShowAreaTemperature(target, effectiveHideWhenClimateOff(forceHidden, target))).toBe(false);
    expect(shouldShowAreaTemperature(target, effectiveHideWhenClimateOff(forceHiddenByName, target))).toBe(false);
  });

  it("does not render a temperature that is missing regardless of the climate setting", () => {
    const target = { ...area([overviewEntity("climate.kids_ac", "climate", true)]), temperature: undefined };

    expect(shouldShowAreaTemperature(target, false)).toBe(false);
    expect(shouldShowAreaTemperature(target, true)).toBe(false);
  });
});
