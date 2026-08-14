import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import { resolveOverviewConfig } from "../src/overview/config";
import type { AreaBubbleOverviewCardConfig } from "../src/overview/types";

const CARD_TYPE = "custom:area-bubble-overview-card" as const;

describe("Overview Area expand-button configuration", () => {
  it("keeps the Area expand button visible by default for backwards compatibility", () => {
    expect(resolveOverviewConfig({ type: CARD_TYPE }).show_area_expand_button).toBe(true);
  });

  it("preserves an explicit false value", () => {
    expect(
      resolveOverviewConfig({ type: CARD_TYPE, show_area_expand_button: false }).show_area_expand_button,
    ).toBe(false);
  });

  it("sanitizes malformed values back to the default", () => {
    const malformed = {
      type: CARD_TYPE,
      show_area_expand_button: "no",
    } as unknown as AreaBubbleOverviewCardConfig;

    expect(resolveOverviewConfig(malformed).show_area_expand_button).toBe(true);
  });

  it("exposes the option as a native editor boolean row with clear bilingual copy", () => {
    const editorSource = readFileSync(new URL("../src/overview/editor.ts", import.meta.url), "utf8");

    expect(editorSource).toContain('["show_area_expand_button"');
    expect(editorSource).toContain('"Show area expand buttons"');
    expect(editorSource).toContain('"הצג חץ פתיחה לאזורים"');
    expect(editorSource).toContain("resolved.show_area_expand_button");
    expect(editorSource).toContain('typeof config.show_area_expand_button !== "boolean"');
  });
});
