import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import { resolveOverviewConfig } from "../src/overview/config";

const type = "custom:area-bubble-overview-card" as const;
const editorSource = readFileSync(new URL("../src/overview/editor.ts", import.meta.url), "utf8");

describe("Overview temperature visibility configuration", () => {
  it("preserves the existing temperature behavior by default", () => {
    expect(resolveOverviewConfig({ type }).hide_temperature_when_climate_off).toBe(false);
    expect(resolveOverviewConfig({ type, hide_temperature_when_climate_off: true }).hide_temperature_when_climate_off).toBe(true);
    expect(resolveOverviewConfig({ type, hide_temperature_when_climate_off: false }).hide_temperature_when_climate_off).toBe(false);
  });

  it("accepts only boolean global values", () => {
    expect(resolveOverviewConfig({
      type,
      hide_temperature_when_climate_off: "true" as unknown as boolean,
    }).hide_temperature_when_climate_off).toBe(false);
  });

  it("retains boolean room overrides and drops malformed values", () => {
    const resolved = resolveOverviewConfig({
      type,
      area_overrides: {
        hidden: { hide_temperature_when_climate_off: true },
        shown: { hide_temperature_when_climate_off: false },
        inherited: {},
        malformed: { hide_temperature_when_climate_off: "yes" as unknown as boolean },
      },
    });

    expect(resolved.area_overrides.hidden.hide_temperature_when_climate_off).toBe(true);
    expect(resolved.area_overrides.shown.hide_temperature_when_climate_off).toBe(false);
    expect(resolved.area_overrides.inherited.hide_temperature_when_climate_off).toBeUndefined();
    expect(resolved.area_overrides.malformed.hide_temperature_when_climate_off).toBeUndefined();
  });

  it("offers a global switch and a compact inherited room override in the visual editor", () => {
    expect(editorSource).toContain("Hide temperature when climate is off");
    expect(editorSource).toContain('"hide_temperature_when_climate_off"');
    expect(editorSource).toContain("Temperature while climate is off in this room");
    expect(editorSource).toContain("override.hide_temperature_when_climate_off === undefined");
    expect(editorSource).toContain('hide_temperature_when_climate_off: value === "" ? undefined : value === "true"');
    expect(editorSource).toContain('typeof config.hide_temperature_when_climate_off !== "boolean"');
    expect(editorSource).toContain('override && typeof override === "object" && !Array.isArray(override)');
    expect(editorSource).toContain('typeof validOverride.hide_temperature_when_climate_off !== "boolean"');
  });
});
