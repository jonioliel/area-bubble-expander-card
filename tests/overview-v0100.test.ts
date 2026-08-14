import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import { resolveOverviewConfig } from "../src/overview/config";
import { overviewCardStyles } from "../src/overview/styles";

const type = "custom:area-bubble-overview-card" as const;

describe("Overview 0.10 appearance configuration", () => {
  it("keeps room and active-device surfaces independent", () => {
    const resolved = resolveOverviewConfig({
      type,
      style: {
        active_surface: "#112233",
        entity_active_surface: " #445566 ",
      },
    });

    expect(resolved.style.active_surface).toBe("#112233");
    expect(resolved.style.entity_active_surface).toBe("#445566");
  });

  it("sanitizes the optional room frame color and thickness", () => {
    expect(resolveOverviewConfig({ type }).style).toMatchObject({
      area_frame_color: "",
      area_frame_width: 2,
    });
    expect(resolveOverviewConfig({
      type,
      style: { area_frame_color: " #789abc ", area_frame_width: 99 },
    }).style).toMatchObject({
      area_frame_color: "#789abc",
      area_frame_width: 8,
    });
    expect(resolveOverviewConfig({
      type,
      style: { area_frame_color: "   ", area_frame_width: -4 },
    }).style).toMatchObject({
      area_frame_color: "",
      area_frame_width: 0,
    });
  });
});

describe("Overview 0.10 compact summary contracts", () => {
  const source = readFileSync(new URL("../src/overview/area-bubble-overview-card.ts", import.meta.url), "utf8");
  const editor = readFileSync(new URL("../src/overview/editor.ts", import.meta.url), "utf8");
  const css = overviewCardStyles.cssText;

  it("keeps temperature and its climate action in one non-overlapping cluster", () => {
    expect(source).toContain('class="temperature-summary"');
    expect(css).toMatch(/\.temperature-summary\s*\{[^}]*display:\s*inline-flex;[^}]*gap:\s*1px/s);
    expect(css).toMatch(/\.temperature-climate-tag\s*\{[^}]*margin-inline-start:\s*0/s);
  });

  it("shrinks dense mobile statuses before clipping them", () => {
    expect(css).toMatch(/@container overview-card \(max-width:\s*430px\)[\s\S]*?\.area-summary-pill\.has-statuses[\s\S]*?max-width:\s*96px/s);
    expect(css).toMatch(/@container overview-card \(max-width:\s*340px\)[\s\S]*?\.compact-statuses \.quick-action\s*\{[^}]*30px/s);
    expect(css).toMatch(/@container overview-card \(max-width:\s*340px\)[\s\S]*?\.compact-statuses \.temperature-climate-tag\s*\{[^}]*width:\s*18px/s);
  });

  it("routes the two active surfaces and room frame through separate theme variables", () => {
    expect(css).toContain("--aboc-entity-active-surface");
    expect(css).toMatch(/\.area-panel\.has-active\s*>\s*\.area-summary\s*>\s*\.area-summary-pill\s*\{[^}]*background:\s*var\(--aboc-active-surface\)/s);
    expect(css).toMatch(/\.toggle-tile\.active\s*\{[^}]*background:\s*var\(--aboc-entity-active-surface\)/s);
    expect(css).toContain("border: var(--aboc-area-frame-width) solid var(--aboc-area-frame-color)");
    expect(source).toContain("--area-bubble-overview-area-frame-color");
    expect(editor).toContain('"Active room or floor surface"');
    expect(editor).toContain('"Active device surface"');
    expect(editor).toContain('"Room frame color"');
    expect(editor).toContain('"Room frame thickness"');
  });
});
