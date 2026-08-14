import { beforeAll, describe, expect, it, vi } from "vitest";

import { resolveOverviewConfig } from "../src/overview/config";
import { discoverOverview } from "../src/overview/discovery";
import { visibleOverviewAreas } from "../src/overview/hierarchy";
import { overviewCardStyles } from "../src/overview/styles";
import type { AreaBubbleOverviewCardConfig, OverviewArea } from "../src/overview/types";
import type { HomeAssistant } from "../src/types";

const CARD_TYPE = "custom:area-bubble-overview-card" as const;

const area = (
  id: string,
  patch: Partial<OverviewArea> = {},
): OverviewArea => ({
  id,
  name: id,
  icon: "mdi:floor-plan",
  showWhenParentCollapsed: false,
  sections: [],
  allEntities: [],
  temperatureMode: "none",
  occupancy: "none",
  occupancyCountSource: "none",
  occupancyEntities: [],
  ...patch,
});

const visibleIds = (areas: OverviewArea[], expandedIds: string[] = []): string[] => {
  const expanded = new Set(expandedIds);
  return visibleOverviewAreas(areas, (candidate) => expanded.has(candidate.id)).map((candidate) => candidate.id);
};

describe("collapsed sub-area visibility", () => {
  it("hides children by default while their parent is collapsed", () => {
    const areas = [
      area("parents_room"),
      area("parents_shower", { parentAreaId: "parents_room" }),
    ];

    expect(visibleIds(areas)).toEqual(["parents_room"]);
    expect(visibleIds(areas, ["parents_room"])).toEqual(["parents_room", "parents_shower"]);
  });

  it("shows only children that explicitly opt in while their parent is collapsed", () => {
    const areas = [
      area("parents_room"),
      area("hidden_child", { parentAreaId: "parents_room" }),
      area("visible_child", {
        parentAreaId: "parents_room",
        showWhenParentCollapsed: true,
      }),
    ];

    expect(visibleIds(areas)).toEqual(["parents_room", "visible_child"]);
  });

  it("uses area_order to control sibling order inside the parent", () => {
    const discovery = discoverOverview(
      hierarchyHass(),
      resolveOverviewConfig({
        type: CARD_TYPE,
        floor: "upstairs",
        area_order: ["grandchild", "child", "root"],
        area_overrides: {
          child: { parent_area: "root" },
          grandchild: { parent_area: "root" },
        },
      }),
    );

    expect(visibleOverviewAreas(discovery.areas, () => true).map((candidate) => candidate.id)).toEqual([
      "root",
      "grandchild",
      "child",
    ]);
  });

  it("never leaks a descendant through a hidden ancestor", () => {
    const areas = [
      area("root"),
      area("hidden_child", { parentAreaId: "root" }),
      area("grandchild", {
        parentAreaId: "hidden_child",
        showWhenParentCollapsed: true,
      }),
    ];

    expect(visibleIds(areas)).toEqual(["root"]);
    expect(visibleIds(areas, ["root"])).toEqual(["root", "hidden_child", "grandchild"]);
  });

  it("applies the opt-in independently at every visible nesting level", () => {
    const areas = [
      area("root"),
      area("child", {
        parentAreaId: "root",
        showWhenParentCollapsed: true,
      }),
      area("grandchild", {
        parentAreaId: "child",
        showWhenParentCollapsed: true,
      }),
    ];

    expect(visibleIds(areas)).toEqual(["root", "child", "grandchild"]);
  });
});

describe("vacant occupancy contrast", () => {
  it("uses the high-contrast light text token for both the zero and its icon", () => {
    const cssText = overviewCardStyles.cssText;
    const vacantRule = Array.from(cssText.matchAll(/([^{}]+)\{([^{}]*)\}/g))
      .filter((match) =>
        match[1]
          .split(",")
          .map((selector) => selector.trim())
          .includes(".summary-chip.occupancy.vacant"),
      )
      .map((match) => match[2])
      .join("\n");

    expect(vacantRule).toMatch(/color:\s*var\(--aboc-occupancy-vacant\)/);
    expect(vacantRule).not.toMatch(/--secondary-text-color|opacity\s*:/);
  });
});

type CardUnderTest = {
  hass?: HomeAssistant;
  setConfig(config: AreaBubbleOverviewCardConfig): void;
  getCardSize(): number;
};

let CardConstructor: new () => CardUnderTest;

beforeAll(async () => {
  class TestHTMLElement {
    public isConnected = false;
    public style = { setProperty: () => undefined };
    public setAttribute(): void {}
  }

  const registeredElements = new Map<string, unknown>();
  vi.stubGlobal("HTMLElement", TestHTMLElement);
  vi.stubGlobal("customElements", {
    define: (name: string, constructor: unknown) => registeredElements.set(name, constructor),
    get: (name: string) => registeredElements.get(name),
  });
  vi.stubGlobal("Document", class TestDocument {});
  vi.stubGlobal("ShadowRoot", class TestShadowRoot {});
  vi.stubGlobal("CSSStyleSheet", class TestCSSStyleSheet {});
  vi.stubGlobal("document", {
    documentElement: { lang: "en" },
    createElement: () => ({}),
    createTreeWalker: () => ({}),
  });
  vi.stubGlobal("window", { customCards: [] });

  const module = await import("../src/overview/area-bubble-overview-card");
  CardConstructor = module.AreaBubbleOverviewCard as unknown as new () => CardUnderTest;
});

const hierarchyHass = (): HomeAssistant => ({
  states: {},
  language: "en",
  locale: { language: "en" },
  config: { unit_system: { temperature: "°C" } },
  callService: vi.fn(async () => undefined),
  floors: {
    upstairs: { floor_id: "upstairs", name: "Upper floor" },
  },
  areas: {
    root: { area_id: "root", name: "Root", floor_id: "upstairs" },
    child: { area_id: "child", name: "Child", floor_id: "upstairs" },
    grandchild: { area_id: "grandchild", name: "Grandchild", floor_id: "upstairs" },
  },
});

const cardSize = (areaOverrides: NonNullable<AreaBubbleOverviewCardConfig["area_overrides"]>): number => {
  const card = new CardConstructor();
  card.hass = hierarchyHass();
  card.setConfig({
    type: CARD_TYPE,
    floor: "upstairs",
    show_header: false,
    remember_expanded_state: false,
    default_expanded: false,
    area_overrides: {
      child: { parent_area: "root" },
      grandchild: { parent_area: "child" },
      ...areaOverrides,
    },
  });
  return card.getCardSize();
};

describe("getCardSize hierarchy visibility", () => {
  it("does not reserve space for descendants hidden by a collapsed parent", () => {
    expect(cardSize({})).toBe(3);
  });

  it("reserves space only for collapsed-parent children that opt in", () => {
    expect(cardSize({ child: { parent_area: "root", show_when_parent_collapsed: true } })).toBe(5);
    expect(cardSize({
      child: { parent_area: "root", show_when_parent_collapsed: true },
      grandchild: { parent_area: "child", show_when_parent_collapsed: true },
    })).toBe(7);
  });

  it("includes normal descendants once each when their ancestors are expanded", () => {
    expect(cardSize({
      root: { default_expanded: true },
      child: { parent_area: "root", default_expanded: true },
      grandchild: { parent_area: "child" },
    })).toBe(7);
  });
});
