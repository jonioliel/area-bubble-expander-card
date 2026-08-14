import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import { resolveOverviewConfig } from "../src/overview/config";
import { lightBrightnessPercentage, supportsLightBrightness } from "../src/overview/features";
import type { OverviewEntity } from "../src/overview/types";
import type { HassEntity } from "../src/types";

const overviewEntity = (
  entityId: string,
  state: string,
  attributes: Record<string, unknown>,
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
    icon: "mdi:lightbulb",
    areaId: "room",
    section: "lights_switches",
    labels: [],
    available: true,
    active: state === "on",
    powered: state === "on",
    protected: false,
  };
};

describe("Overview dimmer controls", () => {
  it("detects dimmable Home Assistant lights without treating on/off lights as dimmers", () => {
    expect(supportsLightBrightness(overviewEntity("light.dimmer", "off", {
      supported_color_modes: ["brightness"],
    }))).toBe(true);
    expect(supportsLightBrightness(overviewEntity("light.legacy", "on", { brightness: 128 }))).toBe(true);
    expect(supportsLightBrightness(overviewEntity("light.relay", "on", {
      supported_color_modes: ["onoff"],
    }))).toBe(false);
    expect(supportsLightBrightness(overviewEntity("switch.relay", "on", { brightness: 128 }))).toBe(false);
  });

  it("maps Home Assistant brightness to a stable zero-to-one-hundred percentage", () => {
    expect(lightBrightnessPercentage(overviewEntity("light.off", "off", { brightness: 200 }))).toBe(0);
    expect(lightBrightnessPercentage(overviewEntity("light.half", "on", { brightness: 128 }))).toBe(50);
    expect(lightBrightnessPercentage(overviewEntity("light.max", "on", {}))).toBe(100);
  });

  it("renders the HA slider and sends brightness_pct or turn_off only after a committed value", () => {
    const source = readFileSync(new URL("../src/overview/area-bubble-overview-card.ts", import.meta.url), "utf8");
    expect(source).toContain("<ha-control-slider");
    expect(source).toContain("@value-changed=${(event: Event) => this.setLightBrightness(item, event)}");
    expect(source).toContain('{ brightness_pct: brightness }');
    expect(source).toMatch(/brightness === 0[\s\S]*?"turn_off"/);
  });
});

describe("Overview climate menus and typography", () => {
  it("uses HA dropdown menus and removes the duplicate climate power control", () => {
    const source = readFileSync(new URL("../src/overview/area-bubble-overview-card.ts", import.meta.url), "utf8");
    expect(source).toContain("<ha-control-select-menu");
    expect(source).toContain("@wa-select=${(event: Event) => this.setClimateMode(item, event)}");
    expect(source).toContain("@wa-select=${(event: Event) => this.setFanMode(item, event)}");
    expect(source).not.toContain('class="climate-mode-button');
    const styles = readFileSync(new URL("../src/overview/styles.ts", import.meta.url), "utf8");
    expect(styles).not.toContain(".climate-mode-button");
  });

  it("defaults, clamps, and preserves the room-name font size", () => {
    const type = "custom:area-bubble-overview-card" as const;
    expect(resolveOverviewConfig({ type }).style.area_name_size).toBe(17);
    expect(resolveOverviewConfig({ type, style: { area_name_size: 14 } }).style.area_name_size).toBe(14);
    expect(resolveOverviewConfig({ type, style: { area_name_size: 2 } }).style.area_name_size).toBe(11);
    expect(resolveOverviewConfig({ type, style: { area_name_size: 99 } }).style.area_name_size).toBe(24);
  });
});
