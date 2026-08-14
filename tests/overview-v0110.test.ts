import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import { resolveOverviewConfig } from "../src/overview/config";
import { overviewCardStyles } from "../src/overview/styles";

const type = "custom:area-bubble-overview-card" as const;
const source = readFileSync(new URL("../src/overview/area-bubble-overview-card.ts", import.meta.url), "utf8");
const editor = readFileSync(new URL("../src/overview/editor.ts", import.meta.url), "utf8");
const css = overviewCardStyles.cssText;

describe("Overview 0.11 summary and tile customization", () => {
  it("uses safe, compact defaults", () => {
    const resolved = resolveOverviewConfig({ type });
    expect(resolved.quick_actions_position).toBe("opposite");
    expect(resolved.climate_tag_position).toBe("left");
    expect(resolved.show_fan_tag).toBe(true);
    expect(resolved.entity_state_language).toBe("auto");
    expect(resolved.light_tile_shape).toBe("rectangle");
    expect(resolved.light_icon_position).toBe("start");
    expect(resolved.light_show_state).toBe(true);
    expect(resolved.style.climate_tag_gap).toBe(0);
    expect(resolved.style.link_section_frame_color).toBe(false);
    expect(resolved.style.section_frame_brightness).toBe(12);
  });

  it("sanitizes summary placement and style ranges", () => {
    const resolved = resolveOverviewConfig({
      type,
      quick_actions_position: "near_name",
      climate_tag_position: "bottom",
      show_fan_tag: false,
      entity_state_language: "he",
      light_tile_shape: "square",
      light_icon_position: "center",
      light_show_state: false,
      style: { climate_tag_gap: 99, link_section_frame_color: true, section_frame_brightness: -140 },
    });
    expect(resolved.quick_actions_position).toBe("near_name");
    expect(resolved.climate_tag_position).toBe("bottom");
    expect(resolved.show_fan_tag).toBe(false);
    expect(resolved.entity_state_language).toBe("he");
    expect(resolved.light_tile_shape).toBe("square");
    expect(resolved.light_icon_position).toBe("center");
    expect(resolved.light_show_state).toBe(false);
    expect(resolved.style.climate_tag_gap).toBe(20);
    expect(resolved.style.link_section_frame_color).toBe(true);
    expect(resolved.style.section_frame_brightness).toBe(-100);
  });

  it("supports one to three lighting columns globally and per room", () => {
    const resolved = resolveOverviewConfig({
      type,
      section_styles: { lights_switches: { columns: 3 } },
      area_overrides: { kids: { section_styles: { lights_switches: { columns: 1 } } } },
    });
    expect(resolved.section_styles.lights_switches.columns).toBe(3);
    expect(resolved.area_overrides.kids.section_styles?.lights_switches?.columns).toBe(1);
    expect(resolveOverviewConfig({ type, section_styles: { lights_switches: { columns: 9 } } }).section_styles.lights_switches.columns).toBe(3);
    expect(css).toContain("repeat(var(--aboc-section-columns, 2), minmax(0, 1fr))");
    expect(source).toContain('`--aboc-section-columns:${sectionColumns}`');
  });

  it("sanitizes per-device tile presentation overrides", () => {
    const resolved = resolveOverviewConfig({
      type,
      entity_overrides: {
        "light.desk": { tile_shape: "square", icon_position: "right", show_state: false, state_language: "en" },
      },
    });
    expect(resolved.entity_overrides["light.desk"]).toMatchObject({
      tile_shape: "square",
      icon_position: "right",
      show_state: false,
      state_language: "en",
    });
  });

  it("places quick actions near the name or at the opposite logical edge", () => {
    expect(source).toContain('quick-actions-${this.config.quick_actions_position}');
    expect(css).toMatch(/\.quick-actions-opposite \.area-statuses\s*\{[^}]*justify-content:\s*flex-end/s);
    expect(css).toMatch(/\.quick-actions-near_name \.area-statuses\s*\{[^}]*justify-content:\s*flex-start/s);
  });

  it("attaches climate and fan tags to any requested temperature edge", () => {
    for (const position of ["left", "right", "top", "bottom"]) {
      expect(css).toContain(`.temperature-summary.tag-position-${position}`);
    }
    expect(source).toContain('style=${`--aboc-temperature-tag-gap:${this.config.style.climate_tag_gap}px`}');
    expect(source).toContain('this.renderTemperatureStatusTag(area, "mdi:fan", activeFanCount, totalFanCount, "fan")');
    expect(source).toContain('this.openQuickActionPopup(event, area, "climate")');
    expect(source).toContain('item.domain === "fan" && item.powered');
    expect(css).toMatch(/\.temperature-status-tag\.temperature-fan-tag\s*\{[^}]*background:\s*var\(--aboc-entity-active-surface\)/s);
  });

  it("supports rectangles, squares, logical icon placement, and optional state text", () => {
    expect(source).toContain('tile-shape-${presentation.shape} tile-icon-${presentation.iconPosition}');
    expect(source).toContain("presentation.showState");
    expect(css).toMatch(/\.toggle-tile\.tile-shape-square\s*\{[^}]*aspect-ratio:\s*1/s);
    expect(css).toContain(".toggle-tile.tile-icon-center");
    expect(css).toContain(".toggle-tile.tile-icon-right");
    expect(css).toMatch(/\.toggle-tile\.tile-icon-start\s*\{[^}]*direction:\s*var\(--aboc-direction/s);
    expect(css).toMatch(/\.section-lights_switches \.light-card\s*\{[^}]*grid-column:\s*1\s*\/\s*-1/s);
  });

  it("localizes binary state labels independently of the card language", () => {
    expect(source).toContain('return state === "on" ? "דלוק" : "כבוי"');
    expect(source).toContain('return state === "on" ? "On" : "Off"');
    expect(editor).toContain("On/off state language");
    expect(editor).toContain("Device state language");
  });

  it("links category frames to a derived room-frame shade unless explicitly overridden", () => {
    expect(source).toContain("this.config?.style.link_section_frame_color");
    expect(source).toContain("sectionStyle.border_color || inheritedFrameColor");
    expect(source).toContain("color-mix(in srgb, var(--aboc-area-frame-color)");
    expect(editor).toContain("Link category frames to room frame");
    expect(editor).toContain("Category frame brightness difference");
  });

  it("exposes all new choices in the visual editor", () => {
    for (const label of [
      "Room quick-actions position",
      "Climate and fan tag position",
      "Show active fan tag",
      "Light tiles per row",
      "Light tile shape",
      "Light icon position",
      "Tag distance from temperature",
    ]) expect(editor).toContain(label);
  });
});
