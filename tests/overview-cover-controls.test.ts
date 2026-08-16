import { readFileSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";

import {
  quickActionActionEntities,
  runQuickActionAction,
  runSectionAction,
  sectionActionEntities,
} from "../src/overview/actions";
import { isOverviewEntityActive, isOverviewEntityPowered } from "../src/overview/discovery";
import {
  coverControlDisabled,
  coverNeedsAction,
  coverPosition,
  isCoverOpen,
} from "../src/overview/features";
import type { HassEntity, HomeAssistant } from "../src/types";
import type { OverviewArea, OverviewEntity, OverviewSection } from "../src/overview/types";

type CoverOptions = {
  state?: string;
  position?: number | string;
  supportedFeatures?: number;
  assumedState?: boolean;
  available?: boolean;
  protected?: boolean;
};

const coverEntity = (id: string, options: CoverOptions = {}): OverviewEntity => {
  const state = options.state ?? "closed";
  const attributes: Record<string, unknown> = {
    supported_features: options.supportedFeatures ?? 15,
  };
  if (options.position !== undefined) attributes.current_position = options.position;
  if (options.assumedState !== undefined) attributes.assumed_state = options.assumedState;
  const entity: HassEntity = {
    entity_id: id,
    state,
    attributes,
    last_changed: "2026-01-01T00:00:00Z",
    last_updated: "2026-01-01T00:00:00Z",
  };
  const powered = isOverviewEntityPowered(entity, "cover");
  return {
    entity,
    entityId: id,
    domain: "cover",
    name: id,
    icon: "mdi:window-shutter",
    areaId: "room",
    section: "covers",
    labels: [],
    available: options.available ?? true,
    active: isOverviewEntityActive(entity, "cover"),
    powered,
    protected: options.protected ?? false,
  };
};

const area = (entities: OverviewEntity[]): OverviewArea => ({
  id: "room",
  name: "Room",
  icon: "mdi:bed",
  showWhenParentCollapsed: false,
  sections: [],
  allEntities: entities,
  temperatureMode: "none",
  occupancy: "none",
  occupancyCountSource: "none",
  occupancyEntities: [],
});

const section = (entities: OverviewEntity[]): OverviewSection => ({
  id: "covers",
  title: "Covers",
  icon: "mdi:window-shutter",
  entities,
  activeCount: entities.filter((item) => item.active).length,
});

const hass = (callService = vi.fn(async () => undefined)): HomeAssistant => ({ states: {}, callService });

describe("Home Assistant cover state semantics", () => {
  it("normalizes numeric and string positions to Home Assistant's zero-to-one-hundred range", () => {
    expect(coverPosition(coverEntity("cover.one", { position: 17 }).entity)).toBe(17);
    expect(coverPosition(coverEntity("cover.two", { position: "42" }).entity)).toBe(42);
    expect(coverPosition(coverEntity("cover.three", { position: 140 }).entity)).toBe(100);
    expect(coverPosition(coverEntity("cover.four", { position: -4 }).entity)).toBe(0);
    expect(coverPosition(coverEntity("cover.five", { position: "bad" }).entity)).toBeUndefined();
  });

  it("uses a partial position for cover badges even when an integration reports an idle endpoint state", () => {
    const partial = coverEntity("cover.partial", { state: "closed", position: 17 });
    const closed = coverEntity("cover.closed", { state: "open", position: 0 });
    expect(isCoverOpen(partial.entity)).toBe(true);
    expect(partial.powered).toBe(true);
    expect(partial.active).toBe(true);
    expect(isCoverOpen(closed.entity)).toBe(false);
    expect(closed.powered).toBe(false);
  });

  it("keeps both directions available at a partial idle position and Stop only while moving", () => {
    expect(coverControlDisabled("open_cover", "open", 17)).toBe(false);
    expect(coverControlDisabled("close_cover", "open", 17)).toBe(false);
    expect(coverControlDisabled("stop_cover", "open", 17)).toBe(true);
    expect(coverControlDisabled("open_cover", "opening", 17)).toBe(true);
    expect(coverControlDisabled("close_cover", "opening", 17)).toBe(false);
    expect(coverControlDisabled("stop_cover", "opening", 17)).toBe(false);
    expect(coverControlDisabled("open_cover", "closing", 83)).toBe(false);
    expect(coverControlDisabled("close_cover", "closing", 83)).toBe(true);
    expect(coverControlDisabled("stop_cover", "closing", 83)).toBe(false);
  });

  it("keeps both endpoints available when Home Assistant marks the state as assumed", () => {
    expect(coverControlDisabled("open_cover", "open", undefined, true)).toBe(false);
    expect(coverControlDisabled("close_cover", "closed", undefined, true)).toBe(false);
    expect(coverControlDisabled("stop_cover", "closed", undefined, true)).toBe(true);
  });

  it("recognizes completed endpoints without repeating their directional command", () => {
    expect(coverNeedsAction(coverEntity("cover.open", { state: "open", position: 100 }), true)).toBe(false);
    expect(coverNeedsAction(coverEntity("cover.open", { state: "open", position: 100 }), false)).toBe(true);
    expect(coverNeedsAction(coverEntity("cover.closed", { state: "closed", position: 0 }), false)).toBe(false);
    expect(coverNeedsAction(coverEntity("cover.closed", { state: "closed", position: 0 }), true)).toBe(true);
  });
});

describe("Cover group controls", () => {
  it("opens partial covers, reverses closing covers, and skips fully open or already-opening covers", () => {
    const room = area([
      coverEntity("cover.partial", { state: "open", position: 17 }),
      coverEntity("cover.closing", { state: "closing", position: 60 }),
      coverEntity("cover.opening", { state: "opening", position: 60 }),
      coverEntity("cover.open", { state: "open", position: 100 }),
      coverEntity("cover.close_only", { state: "closed", position: 0, supportedFeatures: 2 }),
    ]);
    expect(quickActionActionEntities(room, "covers", true).map((item) => item.entityId)).toEqual([
      "cover.partial",
      "cover.closing",
    ]);
  });

  it("closes partial covers, reverses opening covers, and skips fully closed or already-closing covers", () => {
    const covers = section([
      coverEntity("cover.partial", { state: "open", position: 17 }),
      coverEntity("cover.opening", { state: "opening", position: 60 }),
      coverEntity("cover.closing", { state: "closing", position: 60 }),
      coverEntity("cover.closed", { state: "closed", position: 0 }),
      coverEntity("cover.open_only", { state: "open", position: 100, supportedFeatures: 1 }),
    ]);
    expect(sectionActionEntities(covers, false).map((item) => item.entityId)).toEqual([
      "cover.partial",
      "cover.opening",
    ]);
  });

  it("keeps unavailable and group-protected covers out of group actions", () => {
    const room = area([
      coverEntity("cover.available", { state: "open", position: 30 }),
      coverEntity("cover.unavailable", { state: "open", position: 30, available: false }),
      coverEntity("cover.protected", { state: "open", position: 30, protected: true }),
    ]);
    expect(quickActionActionEntities(room, "covers", false).map((item) => item.entityId)).toEqual([
      "cover.available",
    ]);
  });

  it("sends one feature-aware service call for every cover that needs the group direction", async () => {
    const callService = vi.fn(async () => undefined);
    const room = area([
      coverEntity("cover.partial", { state: "open", position: "17" }),
      coverEntity("cover.closing", { state: "closing", position: 70 }),
      coverEntity("cover.open", { state: "open", position: 100 }),
    ]);
    await runQuickActionAction(hass(callService), room, "covers", true);
    expect(callService).toHaveBeenCalledOnce();
    expect(callService).toHaveBeenCalledWith("cover", "open_cover", undefined, {
      entity_id: ["cover.partial", "cover.closing"],
    });
  });

  it("uses the same position-aware target selection in expanded cover sections", async () => {
    const callService = vi.fn(async () => undefined);
    await runSectionAction(hass(callService), section([
      coverEntity("cover.partial", { state: "open", position: 45 }),
      coverEntity("cover.closing", { state: "closing", position: 20 }),
      coverEntity("cover.closed", { state: "closed", position: 0 }),
    ]), false);
    expect(callService).toHaveBeenCalledOnce();
    expect(callService).toHaveBeenCalledWith("cover", "close_cover", undefined, {
      entity_id: ["cover.partial"],
    });
  });
});

describe("Cover UI contracts", () => {
  it("offers Open, Stop, and Close per entity in both the expanded card and quick popup", () => {
    const source = readFileSync(new URL("../src/overview/area-bubble-overview-card.ts", import.meta.url), "utf8");
    const styles = readFileSync(new URL("../src/overview/styles.ts", import.meta.url), "utf8");
    expect(source).toContain('if (action === "covers") return this.renderQuickPopupCoverEntity(item, groupPending)');
    expect(source.match(/service: "open_cover"/g)?.length).toBeGreaterThanOrEqual(2);
    expect(source.match(/service: "stop_cover"/g)?.length).toBeGreaterThanOrEqual(2);
    expect(source.match(/service: "close_cover"/g)?.length).toBeGreaterThanOrEqual(2);
    expect(source).toContain("item.entity.attributes.assumed_state === true");
    expect(styles).toMatch(/\.quick-popup-cover-control\s*\{[^}]*width:\s*44px[^}]*height:\s*44px/s);
  });
});
