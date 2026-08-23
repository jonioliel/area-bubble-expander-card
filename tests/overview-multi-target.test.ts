import { readFileSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";

import { resolveOverviewConfig } from "../src/overview/config";
import { discoverOverview } from "../src/overview/discovery";
import type { AreaBubbleOverviewCardConfig } from "../src/overview/types";
import type { HomeAssistant } from "../src/types";

const CARD_TYPE = "custom:area-bubble-overview-card" as const;

const home = (): HomeAssistant => ({
  states: {},
  areas: {
    cellar: { area_id: "cellar", name: "Cellar", floor_id: "basement" },
    kitchen: { area_id: "kitchen", name: "Kitchen", floor_id: "ground" },
    lounge: { area_id: "lounge", name: "Lounge", floor_id: "ground" },
    office: { area_id: "office", name: "Office", floor_id: "top" },
    detached: { area_id: "detached", name: "Detached studio" },
  },
  floors: {
    top: { floor_id: "top", name: "Top", level: 2, icon: "mdi:home-floor-2" },
    ground: { floor_id: "ground", name: "Ground", level: 0, icon: "mdi:home-floor-0" },
    basement: { floor_id: "basement", name: "Basement", level: -1, icon: "mdi:home-floor-negative-1" },
  },
  callService: vi.fn(async () => undefined),
});

const config = (patch: Partial<AreaBubbleOverviewCardConfig>) => resolveOverviewConfig({
  type: CARD_TYPE,
  language: "en",
  ...patch,
});

describe("multiple Floor and Area targets", () => {
  it("keeps legacy scalar targets while exposing normalized target arrays", () => {
    expect(config({ floor: "ground" }).floors).toEqual(["ground"]);
    expect(config({ area: "kitchen" }).areas).toEqual(["kitchen"]);
    expect(config({ floors: [" ground ", "ground", "top"] }).floors).toEqual(["ground", "top"]);
    expect(config({ areas: [" kitchen ", "kitchen", "office"] }).areas).toEqual(["kitchen", "office"]);
  });

  it("orders selected Floors by Home Assistant LEVEL by default", () => {
    const result = discoverOverview(home(), config({ floors: ["top", "basement", "ground"] }));

    expect(result.targetKind).toBe("floor");
    expect(result.floorGroups.map((floor) => [floor.id, floor.level])).toEqual([
      ["basement", -1],
      ["ground", 0],
      ["top", 2],
    ]);
  });

  it("lets floor_order override LEVEL and appends unordered Floors by LEVEL", () => {
    const result = discoverOverview(home(), config({
      floors: ["ground", "top", "basement"],
      floor_order: ["Top", "basement"],
    }));

    expect(result.floorGroups.map((floor) => floor.id)).toEqual(["top", "basement", "ground"]);
  });

  it("supports ordered individual Areas and a mixed Floor plus Area target without duplicates", () => {
    const individual = discoverOverview(home(), config({
      areas: ["kitchen", "Detached studio", "office"],
      area_order: ["office", "detached", "kitchen"],
    }));
    expect(individual.areas.map((area) => area.id)).toEqual(["office", "detached", "kitchen"]);

    const mixed = discoverOverview(home(), config({
      floors: ["ground"],
      areas: ["kitchen", "detached"],
    }));
    expect(mixed.targetKind).toBe("mixed");
    expect(mixed.floorGroups).toHaveLength(1);
    expect(mixed.floorGroups[0].areas.map((area) => area.id)).toEqual(["kitchen", "lounge"]);
    expect(mixed.standaloneAreas.map((area) => area.id)).toEqual(["detached"]);
    expect(new Set(mixed.areas.map((area) => area.id)).size).toBe(mixed.areas.length);
  });

  it("reports every missing selection without dropping valid targets", () => {
    const result = discoverOverview(home(), config({
      floors: ["missing-floor", "ground"],
      areas: ["missing-area", "office"],
    }));

    expect(result.floorGroups.map((floor) => floor.id)).toEqual(["ground"]);
    expect(result.standaloneAreas.map((area) => area.id)).toEqual(["office"]);
    expect(result.warnings).toEqual(["Floor not found: missing-floor", "Area not found: missing-area"]);
  });

  it("exposes multi-selection, ordering, and independent Floor disclosure in the UI", () => {
    const editor = readFileSync(new URL("../src/overview/editor.ts", import.meta.url), "utf8");
    const card = readFileSync(new URL("../src/overview/area-bubble-overview-card.ts", import.meta.url), "utf8");

    expect(editor).toContain('kind: "area" | "floor"');
    expect(editor).toContain('this.moveTarget(kind, item.id, -1)');
    expect(editor).toContain('this.l("ברירת המחדל מסודרת לפי LEVEL"');
    expect(card).toContain("floorExpandedById");
    expect(card).toContain("discovery.floorGroups.map((group) => this.renderFloorGroup(group))");
    expect(card).toContain("this.toggleFloor(group.id)");
  });
});
