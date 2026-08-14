import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import { activeQuickActionSummaries } from "../src/overview/actions";
import type {
  OverviewArea,
  OverviewEntity,
  OverviewQuickActionId,
  OverviewSectionId,
} from "../src/overview/types";
import type { HassEntity } from "../src/types";

const entity = (
  entityId: string,
  section: OverviewSectionId,
  powered: boolean,
  state = powered ? "on" : "off",
): OverviewEntity => {
  const hassEntity: HassEntity = {
    entity_id: entityId,
    state,
    attributes: {},
    last_changed: "2026-01-01T00:00:00.000Z",
    last_updated: "2026-01-01T00:00:00.000Z",
  };
  return {
    entity: hassEntity,
    entityId,
    domain: entityId.split(".")[0],
    name: entityId,
    icon: "mdi:circle",
    areaId: "kids",
    section,
    labels: [],
    available: true,
    active: powered,
    powered,
    protected: false,
  };
};

const area = (allEntities: OverviewEntity[]): OverviewArea => ({
  id: "kids",
  name: "Kids",
  icon: "mdi:teddy-bear",
  showWhenParentCollapsed: false,
  sections: [],
  allEntities,
  temperatureMode: "off",
  occupancy: "none",
  occupancyCountSource: "none",
  occupancyEntities: [],
});

describe("collapsed Overview quick-action summaries", () => {
  it("hides categories whose members are all powered off or closed", () => {
    const target = area([
      entity("light.ceiling", "lights_switches", false),
      entity("switch.reading", "lights_switches", false),
      entity("climate.ac", "climate", false),
      entity("cover.shutter", "covers", false, "closed"),
      entity("media_player.speaker", "media", false, "off"),
    ]);
    const actions: OverviewQuickActionId[] = ["lights", "switches", "climate", "covers", "media"];

    expect(activeQuickActionSummaries(target, actions)).toEqual([]);
  });

  it("keeps configured ordering and only shows categories with a powered member", () => {
    const target = area([
      entity("light.on", "lights_switches", true),
      entity("light.off", "lights_switches", false),
      entity("climate.off", "climate", false),
      entity("cover.open", "covers", true, "open"),
      entity("cover.closed", "covers", false, "closed"),
      entity("media_player.playing", "media", true, "playing"),
    ]);

    const result = activeQuickActionSummaries(target, ["covers", "climate", "lights", "media"]);

    expect(result.map(({ action }) => action)).toEqual(["covers", "lights", "media"]);
    expect(result.find(({ action }) => action === "covers")?.entities.map(({ entityId }) => entityId)).toEqual([
      "cover.open",
      "cover.closed",
    ]);
    expect(result.find(({ action }) => action === "lights")?.entities.map(({ entityId }) => entityId)).toEqual([
      "light.on",
      "light.off",
    ]);
  });

  it("treats a closed cover as inactive until another cover is open", () => {
    const closed = entity("cover.closed", "covers", false, "closed");
    const open = entity("cover.open", "covers", true, "open");

    expect(activeQuickActionSummaries(area([closed]), ["covers"])).toEqual([]);
    expect(activeQuickActionSummaries(area([closed, open]), ["covers"]).map(({ action }) => action)).toEqual([
      "covers",
    ]);
  });
});

describe("optional Area disclosure arrow", () => {
  it("omits the separate arrow button while preserving disclosure behavior on the Area name", () => {
    const source = readFileSync(
      new URL("../src/overview/area-bubble-overview-card.ts", import.meta.url),
      "utf8",
    );
    const areaToggle = source.match(/<button\s+class="area-toggle"[\s\S]*?<\/button>/)?.[0] ?? "";

    expect(source).toMatch(
      /\$\{this\.config\.show_area_expand_button\s*\?\s*html`<button[\s\S]*?class="expand-button"/,
    );
    expect(areaToggle).toContain("aria-expanded=${expanded}");
    expect(areaToggle).toContain("aria-controls=${contentId}");
    expect(areaToggle).toContain("@click=${() => this.toggleArea(area)}");
  });
});
