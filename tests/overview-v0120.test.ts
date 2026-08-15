import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import { resolveOverviewConfig } from "../src/overview/config";
import { overviewCardStyles } from "../src/overview/styles";

const type = "custom:area-bubble-overview-card" as const;
const source = readFileSync(new URL("../src/overview/area-bubble-overview-card.ts", import.meta.url), "utf8");
const editor = readFileSync(new URL("../src/overview/editor.ts", import.meta.url), "utf8");
const css = overviewCardStyles.cssText;

describe("Overview 0.12 floor disclosure and room popup", () => {
  it("keeps existing cards on expander mode with both arrows visible", () => {
    const resolved = resolveOverviewConfig({ type });
    expect(resolved.show_floor_expand_button).toBe(true);
    expect(resolved.show_area_expand_button).toBe(true);
    expect(resolved.area_open_mode).toBe("expander");
  });

  it("sanitizes the global floor-arrow and room-opening settings", () => {
    expect(resolveOverviewConfig({ type, show_floor_expand_button: false, area_open_mode: "popup" })).toMatchObject({
      show_floor_expand_button: false,
      area_open_mode: "popup",
    });
    const malformed = resolveOverviewConfig({
      type,
      show_floor_expand_button: "no" as unknown as boolean,
      area_open_mode: "drawer" as unknown as "popup",
    });
    expect(malformed.show_floor_expand_button).toBe(true);
    expect(malformed.area_open_mode).toBe("expander");
  });

  it("supports a per-room opening-mode override without retaining invalid values", () => {
    const resolved = resolveOverviewConfig({
      type,
      area_open_mode: "popup",
      area_overrides: {
        parents: { open_mode: "expander" },
        kids: { open_mode: "popup" },
        invalid: { open_mode: "sheet" as unknown as "popup" },
      },
    });
    expect(resolved.area_overrides.parents.open_mode).toBe("expander");
    expect(resolved.area_overrides.kids.open_mode).toBe("popup");
    expect(resolved.area_overrides.invalid.open_mode).toBeUndefined();
  });

  it("removes only the visual floor arrow while retaining the full disclosure button", () => {
    expect(source).toMatch(/this\.config\.show_floor_expand_button\s*\?\s*html`<span class="floor-chevron/);
    expect(source).toContain('@click=${() => this.toggleFloor()}');
    expect(source).toContain('aria-expanded=${this.floorExpanded}');
    expect(css).toMatch(/\.floor-toggle\.without-floor-expand-button\s*\{[^}]*grid-template-columns:\s*auto minmax\(0,\s*1fr\)/s);
  });

  it("routes Area activation to expander or popup with dialog semantics", () => {
    expect(source).toContain('if (this.areaOpenMode(area) === "popup") this.openAreaPopup(event, area)');
    expect(source).toContain('aria-haspopup=${popupMode ? "dialog" : nothing}');
    expect(source).toContain('@click=${(event: Event) => this.activateArea(event, area)}');
    expect(source).toContain('if (this.areaOpenMode(area) === "popup") return false');
  });

  it("renders a native room dialog with top close, backdrop, Escape, and fresh sections", () => {
    expect(source).toContain('class="quick-action-dialog area-detail-dialog');
    expect(source).toContain('@cancel=${(event: Event) => { event.preventDefault(); this.closeAreaPopup(); }}');
    expect(source).toContain('if (event.target === event.currentTarget) this.closeAreaPopup()');
    expect(source).toContain('class="quick-popup-close"');
    expect(source).toContain('class="area-detail-content">${this.renderAreaContent(area)}');
    expect(source).toContain('if (typeof dialog.showModal === "function") dialog.showModal()');
  });

  it("restores trigger focus and safely hands More Info out of the modal", () => {
    expect(source).toContain('else if (this.areaPopupId) this.closeAreaPopup(false, item)');
    expect(source).toContain('if (moreInfo) this.moreInfo(moreInfo)');
    expect(source).toContain('else if (restoreFocus && trigger?.isConnected) trigger.focus()');
    expect(source).toContain('this.resetAreaPopup()');
  });

  it("keeps the popup header fixed while only room content scrolls", () => {
    expect(css).toMatch(/\.area-detail-popup\s*\{[^}]*grid-template-rows:\s*auto minmax\(0,\s*1fr\)/s);
    expect(css).toMatch(/\.area-detail-content\s*\{[^}]*min-height:\s*0;[^}]*overflow:\s*auto/s);
    expect(css).toContain(".area-detail-dialog.has-active .area-detail-popup");
    expect(css).toContain(".area-detail-dialog.all-off .area-detail-popup");
  });

  it("exposes global and per-room choices in the HA-style editor", () => {
    expect(editor).toContain("Show floor expand button");
    expect(editor).toContain("Room opening mode");
    expect(editor).toContain("Opening mode for this room");
    expect(editor).toContain('typeof config.show_floor_expand_button !== "boolean"');
    expect(editor).toContain('config.area_open_mode !== "expander" && config.area_open_mode !== "popup"');
  });
});
