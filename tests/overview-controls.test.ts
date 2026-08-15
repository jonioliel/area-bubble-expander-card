import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import { resolveOverviewConfig } from "../src/overview/config";
import { coverControlDisabled, countsTowardAreaActivity, lightBrightnessPercentage, supportsLightBrightness } from "../src/overview/features";
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

  it("renders an inline HA slider only while the dimmer is on and commits brightness safely", () => {
    const source = readFileSync(new URL("../src/overview/area-bubble-overview-card.ts", import.meta.url), "utf8");
    const styles = readFileSync(new URL("../src/overview/styles.ts", import.meta.url), "utf8");
    expect(source).toContain("<ha-control-slider");
    expect(source).toContain('${item.powered ? html`<div class="brightness-control"');
    expect(source).toContain('${item.powered ? "dimmer-on" : "dimmer-off"}');
    expect(source).toContain("@value-changed=${(event: Event) => this.setLightBrightness(item, event)}");
    expect(source).toContain('{ brightness_pct: brightness }');
    expect(source).toMatch(/brightness === 0[\s\S]*?"turn_off"/);
    expect(styles).toMatch(/\.light-card\.dimmer-on\s*\{[^}]*grid-template-columns:\s*minmax\(168px,\s*1\.15fr\)\s*minmax\(112px,\s*0\.85fr\)/s);
    expect(styles).toMatch(/\.light-card\.dimmer-off\s*\{[^}]*grid-template-columns:\s*minmax\(0,\s*1fr\)/s);
    expect(styles).toMatch(/@container overview-card \(max-width:\s*340px\)[\s\S]*?\.light-card\.dimmer-on\s*\{[^}]*grid-template-columns:\s*minmax\(156px,\s*1fr\)\s*minmax\(72px,\s*0\.45fr\)/s);
    expect(styles).toMatch(/\.light-card\.dimmer-on \.brightness-value\s*\{[^}]*display:\s*none/s);
    expect(styles).not.toContain("--aboc-light-card-min-height");
  });

  it("keeps partially open cover directions enabled and dims Stop only while idle", () => {
    expect(coverControlDisabled("open_cover", "open", 17)).toBe(false);
    expect(coverControlDisabled("close_cover", "open", 17)).toBe(false);
    expect(coverControlDisabled("stop_cover", "open", 17)).toBe(true);
    expect(coverControlDisabled("stop_cover", "opening", 17)).toBe(false);
    expect(coverControlDisabled("open_cover", "open", 100)).toBe(true);
    expect(coverControlDisabled("close_cover", "closed", 0)).toBe(true);
  });

  it("lets a lone final switch use the complete row after a three-column grid or dimmer", () => {
    const styles = readFileSync(new URL("../src/overview/styles.ts", import.meta.url), "utf8");
    expect(styles).toMatch(/\.section-lights_switches\.columns-3 \.section-entities > \.toggle-tile:last-child:nth-child\(3n \+ 1\),[\s\S]*?\.light-card:nth-last-child\(2\) \+ \.toggle-tile:last-child\s*\{[^}]*grid-column:\s*1 \/ -1/s);
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

  it("keeps open covers out of room activity and merges climate into the temperature tag", () => {
    expect(countsTowardAreaActivity({ ...overviewEntity("cover.room", "open", {}), powered: true })).toBe(false);
    expect(countsTowardAreaActivity({ ...overviewEntity("climate.room", "cool", {}), powered: true })).toBe(true);
    expect(countsTowardAreaActivity(overviewEntity("light.room", "on", {}))).toBe(true);

    const source = readFileSync(new URL("../src/overview/area-bubble-overview-card.ts", import.meta.url), "utf8");
    expect(source).toContain('activeQuickActions.filter(({ action }) => action !== "climate")');
    expect(source).toContain('class="temperature-status-tag temperature-${kind}-tag temperature-${area.temperatureMode}"');
    expect(source).not.toContain('<span>${activeClimateCount}</span>');
    expect(source).toContain('const action: OverviewQuickActionKind = kind === "fan" ? "fans" : "climate"');
    expect(source).toContain('this.openQuickActionPopup(event, area, action)');
  });

  it("defaults, clamps, and preserves the room-name font size", () => {
    const type = "custom:area-bubble-overview-card" as const;
    expect(resolveOverviewConfig({ type }).style.area_name_size).toBe(17);
    expect(resolveOverviewConfig({ type, style: { area_name_size: 14 } }).style.area_name_size).toBe(14);
    expect(resolveOverviewConfig({ type, style: { area_name_size: 2 } }).style.area_name_size).toBe(11);
    expect(resolveOverviewConfig({ type, style: { area_name_size: 99 } }).style.area_name_size).toBe(24);
  });

  it("defaults to a transparent card and preserves an explicit background mode", () => {
    const type = "custom:area-bubble-overview-card" as const;
    expect(resolveOverviewConfig({ type }).style.card_transparent).toBe(true);
    expect(resolveOverviewConfig({ type, style: { card_transparent: false, card_background: "#123456" } }).style).toMatchObject({
      card_transparent: false,
      card_background: "#123456",
    });
    expect(resolveOverviewConfig({ type, style: { card_transparent: "yes" as unknown as boolean } }).style.card_transparent).toBe(true);

    const editor = readFileSync(new URL("../src/overview/editor.ts", import.meta.url), "utf8");
    expect(editor).toContain('"Transparent card background"');
    expect(editor).toContain('"Card background"');
  });
});
