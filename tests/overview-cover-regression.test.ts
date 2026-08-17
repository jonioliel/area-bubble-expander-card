import { beforeAll, describe, expect, it, vi } from "vitest";

import {
  quickActionActionEntities,
  runSectionAction,
  sectionActionEntities,
  sectionToggleTurnOn,
} from "../src/overview/actions";
import { isOverviewEntityActive, isOverviewEntityAvailable, isOverviewEntityPowered } from "../src/overview/discovery";
import {
  coverControlDisabled,
  coverNeedsAction,
  coverSupportsService,
  isCoverOpen,
} from "../src/overview/features";
import type { AreaBubbleOverviewCardConfig, OverviewArea, OverviewEntity, OverviewSection } from "../src/overview/types";
import type { HassEntity, HomeAssistant } from "../src/types";

const CARD_TYPE = "custom:area-bubble-overview-card" as const;

type CoverOptions = {
  state?: string;
  position?: number | string;
  supportedFeatures?: number;
  omitSupportedFeatures?: boolean;
  assumedState?: boolean;
  available?: boolean;
  protected?: boolean;
};

const cover = (id: string, options: CoverOptions = {}): OverviewEntity => {
  const state = options.state ?? "closed";
  const attributes: Record<string, unknown> = {};
  if (!options.omitSupportedFeatures) attributes.supported_features = options.supportedFeatures ?? 15;
  if (options.position !== undefined) attributes.current_position = options.position;
  if (options.assumedState !== undefined) attributes.assumed_state = options.assumedState;
  const entity: HassEntity = {
    entity_id: id,
    state,
    attributes,
    last_changed: "2026-08-17T00:00:00Z",
    last_updated: "2026-08-17T00:00:00Z",
  };
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
    powered: isOverviewEntityPowered(entity, "cover"),
    protected: options.protected ?? false,
  };
};

const room = (entities: OverviewEntity[]): OverviewArea => ({
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

const coverSection = (entities: OverviewEntity[]): OverviewSection => ({
  id: "covers",
  title: "Covers",
  icon: "mdi:window-shutter",
  entities,
  activeCount: entities.filter((item) => item.active).length,
});

describe("cover state and position regressions", () => {
  it("lets a numeric position override a contradictory idle state everywhere", () => {
    const physicallyClosed = cover("cover.state_open_position_zero", { state: "open", position: 0 });
    const physicallyOpen = cover("cover.state_closed_position_hundred", { state: "closed", position: 100 });

    expect(isCoverOpen(physicallyClosed.entity)).toBe(false);
    expect(physicallyClosed.powered).toBe(false);
    expect(coverNeedsAction(physicallyClosed, true)).toBe(true);
    expect(coverNeedsAction(physicallyClosed, false)).toBe(false);

    expect(isCoverOpen(physicallyOpen.entity)).toBe(true);
    expect(physicallyOpen.powered).toBe(true);
    expect(coverNeedsAction(physicallyOpen, true)).toBe(false);
    expect(coverNeedsAction(physicallyOpen, false)).toBe(true);

    const area = room([physicallyClosed, physicallyOpen]);
    expect(quickActionActionEntities(area, "covers", true).map((item) => item.entityId)).toEqual([
      physicallyClosed.entityId,
    ]);
    expect(quickActionActionEntities(area, "covers", false).map((item) => item.entityId)).toEqual([
      physicallyOpen.entityId,
    ]);
  });

  it("keeps the reverse direction and Stop enabled while moving, including endpoint-position races", () => {
    expect(coverControlDisabled("open_cover", "opening", 100)).toBe(true);
    expect(coverControlDisabled("stop_cover", "opening", 100)).toBe(false);
    expect(coverControlDisabled("close_cover", "opening", 100)).toBe(false);

    expect(coverControlDisabled("open_cover", "closing", 0)).toBe(false);
    expect(coverControlDisabled("stop_cover", "closing", 0)).toBe(false);
    expect(coverControlDisabled("close_cover", "closing", 0)).toBe(true);

    const area = room([
      cover("cover.opening", { state: "opening", position: 100 }),
      cover("cover.closing", { state: "closing", position: 0 }),
    ]);
    expect(quickActionActionEntities(area, "covers", true).map((item) => item.entityId)).toEqual(["cover.closing"]);
    expect(quickActionActionEntities(area, "covers", false).map((item) => item.entityId)).toEqual(["cover.opening"]);
  });

  it("keeps unknown covers commandable and distinguishes them from unavailable covers", () => {
    const unknown = cover("cover.unknown", { state: "unknown" });
    const unavailable = cover("cover.unavailable", { state: "unavailable", available: false });

    expect(coverControlDisabled("open_cover", "unknown")).toBe(false);
    expect(coverControlDisabled("stop_cover", "unknown")).toBe(false);
    expect(coverControlDisabled("close_cover", "unknown")).toBe(false);
    expect(coverControlDisabled("stop_cover", "unavailable")).toBe(true);
    expect(isOverviewEntityAvailable(unknown.entity, "cover")).toBe(true);
    expect(isOverviewEntityAvailable(unavailable.entity, "cover")).toBe(false);
    expect(quickActionActionEntities(room([unknown]), "covers", true)).toEqual([unknown]);
    expect(quickActionActionEntities(room([unknown]), "covers", false)).toEqual([unknown]);
    expect(quickActionActionEntities(room([unavailable]), "covers", true)).toEqual([]);
    expect(quickActionActionEntities(room([unavailable]), "covers", false)).toEqual([]);
  });

  it("does not trust an assumed endpoint for either row or bulk direction", () => {
    const assumedOpen = cover("cover.assumed_open", { state: "open", position: 100, assumedState: true });
    const assumedClosed = cover("cover.assumed_closed", { state: "closed", position: 0, assumedState: true });
    const area = room([assumedOpen, assumedClosed]);

    expect(coverControlDisabled("open_cover", "open", 100, true)).toBe(false);
    expect(coverControlDisabled("close_cover", "open", 100, true)).toBe(false);
    expect(coverControlDisabled("open_cover", "closed", 0, true)).toBe(false);
    expect(coverControlDisabled("close_cover", "closed", 0, true)).toBe(false);
    expect(quickActionActionEntities(area, "covers", true).map((item) => item.entityId)).toEqual([
      "cover.assumed_open",
      "cover.assumed_closed",
    ]);
    expect(quickActionActionEntities(area, "covers", false).map((item) => item.entityId)).toEqual([
      "cover.assumed_open",
      "cover.assumed_closed",
    ]);
    expect(sectionToggleTurnOn(coverSection([assumedClosed]))).toBe(true);
    expect(sectionToggleTurnOn(coverSection([assumedOpen]))).toBe(false);
    expect(sectionToggleTurnOn(coverSection([assumedClosed, assumedOpen]))).toBe(false);
  });
});

describe("cover supported_features regressions", () => {
  it("treats an omitted supported_features attribute as legacy support, but explicit zero as unsupported", () => {
    const legacy = cover("cover.legacy", { state: "open", position: 50, omitSupportedFeatures: true });
    const explicitZero = cover("cover.no_services", { state: "open", position: 50, supportedFeatures: 0 });

    for (const service of ["open_cover", "stop_cover", "close_cover"] as const) {
      expect(coverSupportsService(legacy.entity, service)).toBe(true);
      expect(coverSupportsService(explicitZero.entity, service)).toBe(false);
    }
    expect(sectionActionEntities(coverSection([legacy, explicitZero]), false).map((item) => item.entityId)).toEqual([
      "cover.legacy",
    ]);
  });

  it("honors each directional feature independently in section target planning", () => {
    const openOnly = cover("cover.open_only", { state: "closed", position: 0, supportedFeatures: 1 });
    const closeOnly = cover("cover.close_only", { state: "open", position: 100, supportedFeatures: 2 });
    const stopOnly = cover("cover.stop_only", { state: "opening", position: 40, supportedFeatures: 8 });
    const section = coverSection([openOnly, closeOnly, stopOnly]);

    expect(sectionActionEntities(section, true).map((item) => item.entityId)).toEqual(["cover.open_only"]);
    expect(sectionActionEntities(section, false).map((item) => item.entityId)).toEqual(["cover.close_only"]);
  });
});

type LitTemplate = {
  strings: readonly string[];
  values: unknown[];
};

const isTemplate = (value: unknown): value is LitTemplate => {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<LitTemplate>;
  return Array.isArray(candidate.strings) && Array.isArray(candidate.values);
};

const collectTemplates = (value: unknown, output: LitTemplate[] = []): LitTemplate[] => {
  if (Array.isArray(value)) {
    for (const child of value) collectTemplates(child, output);
    return output;
  }
  if (!isTemplate(value)) return output;
  output.push(value);
  for (const child of value.values) collectTemplates(child, output);
  return output;
};

const templatesWithClass = (value: unknown, className: string): LitTemplate[] => {
  const escaped = className.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const classPattern = new RegExp(`class="${escaped}(?:[ \"]|$)`);
  return collectTemplates(value).filter((template) => classPattern.test(template.strings.join("")));
};

const expressionAfter = (template: LitTemplate, marker: string): unknown => {
  const index = template.strings.findIndex((part) => part.includes(marker));
  if (index < 0) throw new Error(`Template marker not found: ${marker}`);
  return template.values[index];
};

type CardUnderTest = {
  hass?: HomeAssistant;
  pendingEntities: Set<string>;
  pendingCoverCommands: Set<string>;
  setConfig(config: AreaBubbleOverviewCardConfig): void;
  renderCover(item: OverviewEntity): unknown;
  renderQuickPopupCoverEntity(item: OverviewEntity, groupPending: boolean): unknown;
  runEntityService(event: Event, item: OverviewEntity, service: string): void;
  handleSectionAction(event: Event, section: OverviewSection, areaId: string, turnOn: boolean): Promise<void>;
  performCoverCommand(
    item: OverviewEntity,
    service: "open_cover" | "stop_cover" | "close_cover",
    call: () => Promise<unknown>,
    timeoutMs?: number,
  ): Promise<boolean>;
};

let CardConstructor: new () => CardUnderTest;

beforeAll(async () => {
  class TestHTMLElement {
    public isConnected = false;
    public style = { setProperty: () => undefined };
    public setAttribute(): void {}
    public dispatchEvent(): boolean { return true; }
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
  vi.stubGlobal("window", {
    customCards: [],
    setTimeout: globalThis.setTimeout.bind(globalThis),
    clearTimeout: globalThis.clearTimeout.bind(globalThis),
  });

  const module = await import("../src/overview/area-bubble-overview-card");
  CardConstructor = module.AreaBubbleOverviewCard as unknown as new () => CardUnderTest;
}, 30_000);

const cardWithService = (callService = vi.fn(async () => undefined)) => {
  const card = new CardConstructor();
  card.hass = {
    states: {},
    language: "en",
    locale: { language: "en" },
    config: { unit_system: { temperature: "°C" } },
    callService,
  };
  card.setConfig({ type: CARD_TYPE, area: "room", language: "en", remember_expanded_state: false });
  return { card, callService };
};

const controlEvent = (): Event => ({ stopPropagation: vi.fn() }) as unknown as Event;

const disabledStates = (template: unknown, className: string): boolean[] =>
  templatesWithClass(template, className).map((control) => Boolean(expressionAfter(control, "?disabled=")));

describe("cover row and Popup regressions", () => {
  it.each([
    ["idle partial", { state: "open", position: 37 }, [false, false, false]],
    ["state-open/position-closed mismatch", { state: "open", position: 0 }, [false, false, true]],
    ["state-closed/position-open mismatch", { state: "closed", position: 100 }, [true, false, false]],
    ["opening", { state: "opening", position: 37 }, [true, false, false]],
    ["closing", { state: "closing", position: 37 }, [false, false, true]],
    ["assumed open endpoint", { state: "open", position: 100, assumedState: true }, [false, false, false]],
    ["unknown", { state: "unknown" }, [false, false, false]],
  ] satisfies Array<[string, CoverOptions, boolean[]]>) (
    "keeps expanded-row and Popup controls in parity for %s",
    (_name, options, expected) => {
      const { card } = cardWithService();
      const item = cover("cover.shade", options);
      expect(disabledStates(card.renderCover(item), "cover-control")).toEqual(expected);
      expect(disabledStates(card.renderQuickPopupCoverEntity(item, false), "quick-popup-cover-control")).toEqual(expected);
    },
  );

  it("renders all legacy controls when supported_features is missing and none when it is explicitly zero", () => {
    const { card } = cardWithService();
    const legacy = cover("cover.legacy", { state: "open", position: 50, omitSupportedFeatures: true });
    const explicitZero = cover("cover.zero", { state: "open", position: 50, supportedFeatures: 0 });

    expect(templatesWithClass(card.renderCover(legacy), "cover-control")).toHaveLength(3);
    expect(templatesWithClass(card.renderQuickPopupCoverEntity(legacy, false), "quick-popup-cover-control")).toHaveLength(3);
    expect(templatesWithClass(card.renderCover(explicitZero), "cover-control")).toHaveLength(0);
    expect(templatesWithClass(card.renderQuickPopupCoverEntity(explicitZero, false), "quick-popup-cover-control")).toHaveLength(0);
  });

  it("keeps unknown row and Popup commands enabled but blocks an unavailable entity", () => {
    const { card } = cardWithService();
    const unknown = cover("cover.unknown", { state: "unknown" });
    const unavailable = cover("cover.unavailable", { state: "unavailable", available: false });

    expect(disabledStates(card.renderCover(unknown), "cover-control")).toEqual([false, false, false]);
    expect(disabledStates(card.renderQuickPopupCoverEntity(unknown, false), "quick-popup-cover-control")).toEqual([false, false, false]);
    expect(disabledStates(card.renderCover(unavailable), "cover-control")).toEqual([true, true, true]);
    expect(disabledStates(card.renderQuickPopupCoverEntity(unavailable, false), "quick-popup-cover-control")).toEqual([true, true, true]);
  });

  it("dispatches Open, Stop, and Close in the same order from both the row and Popup", async () => {
    for (const render of ["row", "popup"] as const) {
      const { card, callService } = cardWithService();
      const item = cover(`cover.${render}`, { state: "opening", position: 40 });
      const template = render === "row" ? card.renderCover(item) : card.renderQuickPopupCoverEntity(item, false);
      const controls = templatesWithClass(template, render === "row" ? "cover-control" : "quick-popup-cover-control");

      for (const control of controls) {
        const click = expressionAfter(control, "@click=") as (event: Event) => void;
        click(controlEvent());
        await vi.waitFor(() => expect(card.pendingEntities.has(item.entityId)).toBe(false));
      }

      expect(callService).toHaveBeenNthCalledWith(1, "cover", "open_cover", undefined, { entity_id: item.entityId });
      expect(callService).toHaveBeenNthCalledWith(2, "cover", "stop_cover", undefined, { entity_id: item.entityId });
      expect(callService).toHaveBeenNthCalledWith(3, "cover", "close_cover", undefined, { entity_id: item.entityId });
    }
  });
});

describe("cover pending-state regressions", () => {
  it("blocks only the identical pending command while Stop and direction reversal remain available", async () => {
    const resolvers = new Map<string, () => void>();
    const callService = vi.fn((_domain: string, service: string) => new Promise<void>((resolve) => {
      resolvers.set(service, resolve);
    }));
    const { card } = cardWithService(callService);
    const item = cover("cover.pending", { state: "open", position: 35 });

    card.runEntityService(controlEvent(), item, "close_cover");
    await vi.waitFor(() => expect(card.pendingCoverCommands.has(`${item.entityId}:close_cover`)).toBe(true));
    expect(card.pendingEntities.has(item.entityId)).toBe(false);
    expect(disabledStates(card.renderCover(item), "cover-control")).toEqual([false, false, true]);
    expect(disabledStates(card.renderQuickPopupCoverEntity(item, false), "quick-popup-cover-control")).toEqual([false, false, true]);

    card.runEntityService(controlEvent(), item, "close_cover");
    expect(callService).toHaveBeenCalledOnce();

    card.runEntityService(controlEvent(), item, "stop_cover");
    await vi.waitFor(() => expect(callService).toHaveBeenCalledTimes(2));
    expect(disabledStates(card.renderCover(item), "cover-control")).toEqual([false, true, true]);

    resolvers.get("stop_cover")?.();
    await vi.waitFor(() => expect(card.pendingCoverCommands.has(`${item.entityId}:stop_cover`)).toBe(false));
    card.runEntityService(controlEvent(), item, "open_cover");
    await vi.waitFor(() => expect(callService).toHaveBeenCalledTimes(3));
    expect(disabledStates(card.renderQuickPopupCoverEntity(item, false), "quick-popup-cover-control")).toEqual([true, false, true]);

    resolvers.get("close_cover")?.();
    resolvers.get("open_cover")?.();
    await vi.waitFor(() => expect(card.pendingCoverCommands.size).toBe(0));
  });

  it("does not let a category pending flag suppress individual Stop or reverse controls", () => {
    const { card } = cardWithService();
    const item = cover("cover.group_pending", { state: "open", position: 35 });
    expect(disabledStates(card.renderQuickPopupCoverEntity(item, true), "quick-popup-cover-control")).toEqual([
      false,
      false,
      false,
    ]);
  });

  it("tracks a section direction per cover without blocking an individual Stop or reverse command", async () => {
    const resolvers: Array<() => void> = [];
    const callService = vi.fn(() => new Promise<void>((resolve) => { resolvers.push(resolve); }));
    const { card } = cardWithService(callService);
    const item = cover("cover.section_pending", { state: "open", position: 45 });
    const section = coverSection([item]);

    const opening = card.handleSectionAction(controlEvent(), section, "room", true);
    await vi.waitFor(() => expect(card.pendingCoverCommands.has(`${item.entityId}:open_cover`)).toBe(true));
    expect(card.pendingEntities.has(item.entityId)).toBe(false);
    expect(disabledStates(card.renderCover(item), "cover-control")).toEqual([true, false, false]);

    card.runEntityService(controlEvent(), item, "stop_cover");
    await vi.waitFor(() => expect(callService).toHaveBeenCalledTimes(2));
    expect(card.pendingCoverCommands.has(`${item.entityId}:stop_cover`)).toBe(true);

    card.runEntityService(controlEvent(), item, "close_cover");
    await vi.waitFor(() => expect(callService).toHaveBeenCalledTimes(3));
    expect(card.pendingCoverCommands.has(`${item.entityId}:close_cover`)).toBe(true);

    for (const resolve of resolvers) resolve();
    await opening;
    await vi.waitFor(() => expect(card.pendingCoverCommands.size).toBe(0));
  });

  it("releases an individual cover lock when a service Promise never settles", async () => {
    const { card } = cardWithService();
    const item = cover("cover.timeout", { state: "open", position: 45 });

    const success = await card.performCoverCommand(
      item,
      "close_cover",
      () => new Promise<never>(() => undefined),
      5,
    );

    expect(success).toBe(false);
    expect(card.pendingCoverCommands.has(`${item.entityId}:close_cover`)).toBe(false);
  });

  it("keeps a section service call feature-aware across mixed legacy and unsupported covers", async () => {
    const callService = vi.fn(async () => undefined);
    const section = coverSection([
      cover("cover.legacy", { state: "open", position: 60, omitSupportedFeatures: true }),
      cover("cover.zero", { state: "open", position: 60, supportedFeatures: 0 }),
      cover("cover.open_only", { state: "open", position: 60, supportedFeatures: 1 }),
      cover("cover.close_only", { state: "open", position: 60, supportedFeatures: 2 }),
    ]);

    await runSectionAction({ states: {}, callService }, section, false);

    expect(callService).toHaveBeenCalledOnce();
    expect(callService).toHaveBeenCalledWith("cover", "close_cover", undefined, {
      entity_id: ["cover.legacy", "cover.close_only"],
    });
  });
});
