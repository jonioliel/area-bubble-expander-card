import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import { resolveOverviewConfig } from "../src/overview/config";
import { OVERVIEW_DEFAULT_STYLE, OVERVIEW_LEGACY_THEME_NAMES, OVERVIEW_NEW_THEME_NAMES, OVERVIEW_THEME_NAMES, OVERVIEW_THEME_PRESETS, OVERVIEW_THEME_VARIANTS, overviewThemePalette } from "../src/overview/constants";
import { overviewCardStyles } from "../src/overview/styles";
import type { OverviewThemeMode, OverviewThemePreset } from "../src/overview/types";

const type = "custom:area-bubble-overview-card" as const;
const legacyPresets: OverviewThemePreset[] = ["classic", "elegant", "light", "dark", "modern", "ocean", "emerald", "violet", "coral", "amber", "rose"];
const contemporaryPresets: OverviewThemePreset[] = ["champagne_emerald", "arctic_cobalt", "sage_jade", "violet_indigo", "coral_teal"];
const presets: OverviewThemePreset[] = [...legacyPresets, ...contemporaryPresets];
const designedPresets = presets.filter((preset) => preset !== "classic");
const vividLegacyPresets: OverviewThemePreset[] = ["ocean", "emerald", "violet", "coral", "amber", "rose"];
const explicitModes: Array<Exclude<OverviewThemeMode, "recommended">> = ["light", "dark"];
const cardSource = readFileSync(new URL("../src/overview/area-bubble-overview-card.ts", import.meta.url), "utf8");
const editorSource = readFileSync(new URL("../src/overview/editor.ts", import.meta.url), "utf8");
const css = overviewCardStyles.cssText;

const rgb = (hex: string): [number, number, number] => {
  const clean = hex.replace("#", "");
  return [0, 2, 4].map((index) => Number.parseInt(clean.slice(index, index + 2), 16)) as [number, number, number];
};

const luminance = (hex: string): number => {
  const channels = rgb(hex).map((value) => {
    const normalized = value / 255;
    return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
  });
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
};

const contrast = (a: string, b: string): number => {
  const [lighter, darker] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (lighter + 0.05) / (darker + 0.05);
};

const gradientHexColors = (value: string): string[] => value.match(/#[0-9a-f]{6}/gi) ?? [];

const colorDistance = (a: string, b: string): number => {
  const left = rgb(a);
  const right = rgb(b);
  return Math.sqrt(left.reduce((sum, channel, index) => sum + (channel - right[index]) ** 2, 0));
};

const expectRoomDeviceSeparation = (palette: { active_surface?: unknown; entity_active_surface?: unknown; active_text_color?: unknown }): void => {
  const roomStops = gradientHexColors(String(palette.active_surface));
  const entitySurface = String(palette.entity_active_surface);
  expect(roomStops.length).toBeGreaterThanOrEqual(2);
  expect(entitySurface).toMatch(/^#[0-9a-f]{6}$/i);
  expect(Math.min(...roomStops.map((stop) => colorDistance(stop, entitySurface)))).toBeGreaterThanOrEqual(32);
  for (const stop of roomStops) expect(contrast(String(palette.active_text_color), stop)).toBeGreaterThanOrEqual(4.5);
  expect(contrast(String(palette.active_text_color), entitySurface)).toBeGreaterThanOrEqual(4.5);
};

describe("Overview professional design themes", () => {
  it("preserves the existing classic theme as the backwards-compatible default", () => {
    const resolved = resolveOverviewConfig({ type });
    expect(resolved.theme_preset).toBe("classic");
    expect(resolved.style.card_transparent).toBe(OVERVIEW_DEFAULT_STYLE.card_transparent);
    expect(resolved.style.active_surface).toBe(OVERVIEW_DEFAULT_STYLE.active_surface);
    expect(resolved.style.entity_active_surface).not.toBe(resolved.style.active_surface);
  });

  it("ships fifteen complete coordinated palettes plus the backwards-compatible classic base", () => {
    expect(Object.keys(OVERVIEW_THEME_PRESETS)).toEqual(presets);
    expect(OVERVIEW_THEME_NAMES).toEqual(presets);
    for (const preset of designedPresets) {
      const palette = OVERVIEW_THEME_PRESETS[preset];
      expect(palette.card_background).toMatch(/^linear-gradient\(/);
      expect(palette.active_surface).toMatch(/^linear-gradient\(/);
      expect(palette.temperature_cool_surface).toMatch(/^linear-gradient\(/);
      expect(palette.card_transparent).toBe(false);
      expect(palette.area_frame_color).toMatch(/^#[0-9a-f]{6}$/i);
      expectRoomDeviceSeparation(palette);
    }
  });

  it("adds six vivid professional color families", () => {
    expect(vividLegacyPresets).toEqual(["ocean", "emerald", "violet", "coral", "amber", "rose"]);
    for (const preset of vividLegacyPresets) {
      expect(OVERVIEW_THEME_PRESETS[preset].card_background).toMatch(/^linear-gradient\(/);
      expect(OVERVIEW_THEME_PRESETS[preset].show_shadows).toBe(true);
    }
  });

  it("separates five compact contemporary themes from the backwards-compatible legacy group", () => {
    expect(OVERVIEW_LEGACY_THEME_NAMES).toEqual(legacyPresets);
    expect(OVERVIEW_NEW_THEME_NAMES).toEqual(contemporaryPresets);
    for (const preset of contemporaryPresets) {
      const palette = OVERVIEW_THEME_PRESETS[preset];
      expect(palette.row_height).toBe(48);
      expect(palette.section_gap).toBe(6);
      expect(palette.quick_action_size).toBe(32);
      expect(palette.card_background).toMatch(/rgba\([^)]*,0\.(?:7|8)/);
      expect(palette.border_radius).toBe(22);
    }
  });

  it("provides complete light and dark variants for every theme family", () => {
    for (const preset of presets) {
      for (const mode of explicitModes) {
        const palette = OVERVIEW_THEME_VARIANTS[preset][mode];
        expect(palette.card_background).toMatch(/^linear-gradient\(/);
        expect(palette.active_surface).toMatch(/^linear-gradient\(/);
        expect(palette.entity_active_surface).toMatch(/^#[0-9a-f]{6}$/i);
        expect(palette.control_surface).toMatch(/^#[0-9a-f]{6}$/i);
        expect(palette.card_transparent).toBe(false);
        expectRoomDeviceSeparation(palette);
      }
    }
  });

  it.each(presets.flatMap((preset) => explicitModes.map((mode) => [preset, mode] as const)))(
    "keeps readable active and control contrast in %s/%s",
    (preset, mode) => {
      const palette = OVERVIEW_THEME_VARIANTS[preset][mode];
      expect(contrast(String(palette.active_text_color), String(palette.entity_active_surface))).toBeGreaterThanOrEqual(4.5);
      expect(contrast(String(palette.control_text_color), String(palette.control_surface))).toBeGreaterThanOrEqual(4.5);
      expect(contrast(String(palette.occupancy_active_color), String(palette.control_surface))).toBeGreaterThanOrEqual(4.5);
      expect(contrast(String(palette.occupancy_vacant_color), String(palette.control_surface))).toBeGreaterThanOrEqual(4.5);
      expect(contrast(String(palette.occupancy_unknown_color), String(palette.control_surface))).toBeGreaterThanOrEqual(4.5);
    },
  );

  it("resolves explicit theme modes while preserving recommended legacy defaults", () => {
    expect(resolveOverviewConfig({ type }).theme_mode).toBe("recommended");
    expect(resolveOverviewConfig({ type }).style.active_surface).toBe(OVERVIEW_DEFAULT_STYLE.active_surface);
    expect(resolveOverviewConfig({ type, theme_preset: "ocean", theme_mode: "dark" }).style.card_background)
      .toBe(OVERVIEW_THEME_VARIANTS.ocean.dark.card_background);
    expect(resolveOverviewConfig({ type, theme_preset: "emerald", theme_mode: "light" }).style.active_surface)
      .toBe(OVERVIEW_THEME_VARIANTS.emerald.light.active_surface);
    expect(resolveOverviewConfig({ type, theme_preset: "rose", theme_mode: "invalid" as OverviewThemeMode }).theme_mode)
      .toBe("recommended");
    expect(overviewThemePalette("classic", "recommended")).toEqual({});
  });

  it.each(designedPresets)("resolves the %s palette as a complete style base", (preset) => {
    const resolved = resolveOverviewConfig({ type, theme_preset: preset });
    const palette = OVERVIEW_THEME_PRESETS[preset];
    expect(resolved.theme_preset).toBe(preset);
    expect(resolved.style.card_background).toBe(palette.card_background);
    expect(resolved.style.active_surface).toBe(palette.active_surface);
    expect(resolved.style.control_surface).toBe(palette.control_surface);
    expect(resolved.style.primary_text_color).toBe(palette.primary_text_color);
  });

  it("lets explicit appearance values override a selected theme", () => {
    const resolved = resolveOverviewConfig({
      type,
      theme_preset: "dark",
      style: {
        active_surface: "#123456",
        primary_text_color: "#fafafa",
        card_transparent: true,
        area_name_size: 19,
      },
    });
    expect(resolved.style.active_surface).toBe("#123456");
    expect(resolved.style.primary_text_color).toBe("#fafafa");
    expect(resolved.style.card_transparent).toBe(true);
    expect(resolved.style.area_name_size).toBe(19);
    expect(resolved.style.control_surface).toBe(OVERVIEW_THEME_PRESETS.dark.control_surface);
  });

  it("falls back safely when YAML contains an unknown theme", () => {
    const resolved = resolveOverviewConfig({ type, theme_preset: "neon" as OverviewThemePreset });
    expect(resolved.theme_preset).toBe("classic");
    expect(resolved.style.card_background).toBe(OVERVIEW_DEFAULT_STYLE.card_background);
  });

  it.each(designedPresets)("keeps readable active and control contrast in %s", (preset) => {
    const palette = OVERVIEW_THEME_PRESETS[preset];
    expect(contrast(String(palette.active_text_color), String(palette.entity_active_surface))).toBeGreaterThanOrEqual(4.5);
    expect(contrast(String(palette.control_text_color), String(palette.control_surface))).toBeGreaterThanOrEqual(4.5);
  });

  it("routes semantic text colors into every card surface", () => {
    expect(css).toContain("--aboc-primary-text: var(--area-bubble-overview-primary-text");
    expect(css).toContain("--aboc-secondary-text: var(--area-bubble-overview-secondary-text");
    expect(css).toContain("--aboc-dark-text: var(--area-bubble-overview-active-text");
    expect(css).toContain("--aboc-light-text: var(--area-bubble-overview-control-text");
    expect(cardSource).toContain('"--area-bubble-overview-primary-text", style.primary_text_color');
    expect(cardSource).toContain('"--area-bubble-overview-control-text", style.control_text_color');
  });

  it("provides visual theme cards and retains manual fine tuning", () => {
    expect(editorSource).toContain('class="theme-preset-grid"');
    expect(editorSource).toContain("Elegant · Sapphire");
    expect(editorSource).toContain("Luminous · Sky");
    expect(editorSource).toContain("Dark · Midnight");
    expect(editorSource).toContain("Modern · Sage");
    expect(editorSource).toContain("Ocean · Azure");
    expect(editorSource).toContain("Botanical · Emerald");
    expect(editorSource).toContain("Atelier · Amethyst");
    expect(editorSource).toContain("Terracotta · Coral");
    expect(editorSource).toContain("Golden · Amber");
    expect(editorSource).toContain("Rose · Berry");
    expect(editorSource).toContain("Champagne Emerald");
    expect(editorSource).toContain("Arctic Cobalt");
    expect(editorSource).toContain("Sage Jade");
    expect(editorSource).toContain("Violet Indigo");
    expect(editorSource).toContain("Coral Teal");
    expect(editorSource).toContain('this.l("עיצוב חדש", "New design"');
    expect(editorSource).toContain('this.l("עיצוב ישן", "Old design"');
    expect(editorSource).toContain('class="theme-mode-switch"');
    expect(editorSource).toContain("--theme-entity:");
    expect(editorSource).toContain('<i></i><i></i><i></i><i></i>');
    expect(editorSource).toContain("this.applyThemeMode(mode)");
    expect(editorSource).toContain("this.applyThemePreset(preset)");
    expect(editorSource).toContain('OVERVIEW_NEW_THEME_NAMES.includes(preset) ? { quick_actions_position: "opposite" as const }');
    expect(editorSource).toContain("for (const key of themeKeys) delete style[key]");
    expect(editorSource).toContain("Primary text color");
    expect(editorSource).toContain("Text on control pills");
  });

  it("activates the compact glass layout only for new themes and keeps status tags opposite by default", () => {
    expect(cardSource).toContain("OVERVIEW_NEW_THEME_NAMES.includes(this.config.theme_preset)");
    expect(cardSource).toContain('modernDesign ? "design-new" : "design-legacy"');
    expect(css).toMatch(/\.root\.design-new \.area-summary-pill\s*\{[^}]*min-height:\s*var\(--aboc-row-height\)/s);
    expect(css).toMatch(/\.root\.design-new \.area-summary-pill::after\s*\{[^}]*linear-gradient/s);
    expect(css).toMatch(/\.root\.design-new \.area-summary-pill\.quick-actions-opposite \.area-statuses\s*\{[^}]*justify-content:\s*flex-end;[^}]*margin-inline-start:\s*auto/s);
    expect(resolveOverviewConfig({ type, theme_preset: "champagne_emerald" }).quick_actions_position).toBe("opposite");
  });
});
