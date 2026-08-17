import { LitElement, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { HomeAssistant } from "../types";
import {
  activeQuickActionSummaries,
  areaActionEntities,
  callEntityService,
  quickActionActionEntities,
  quickActionDirectEntities,
  quickActionEntityService,
  quickActionMembers,
  runQuickActionAction,
  runQuickActionDirectAction,
  runAreaAction,
  runSectionAction,
  sectionActionEntities,
  sectionToggleTurnOn,
} from "./actions";
import { resolveOverviewConfig, validateOverviewConfig } from "./config";
import {
  AUTO_FAN_GROUP,
  AUTO_FLOOR_HEATING_GROUP,
  CLIMATE_FEATURES,
  MEDIA_FEATURES,
  OVERVIEW_CARD_TAG,
  OVERVIEW_CARD_TYPE,
  OVERVIEW_EDITOR_TAG,
  OVERVIEW_STORAGE_PREFIX,
  WATER_HEATER_FEATURES,
} from "./constants";
import { discoverOverview } from "./discovery";
import { buildOverviewAreaHierarchy, visibleOverviewAreas } from "./hierarchy";
import { buildOverviewAreaContentLayout } from "./presentation";
import "./editor";
import {
  climateTemperatureSignature,
  climateTemperatureStep,
  climateTemperatureTargets,
  climateModes,
  coverControlDisabled,
  coverPosition,
  coverSupportsService,
  countsTowardAreaActivity,
  entityPowerService,
  lightBrightnessPercentage,
  normalizeClimateTemperature,
  supportsEntityFeature,
  supportsLightBrightness,
} from "./features";
import type { ClimateTemperatureTargets, CoverControlService } from "./features";
import { overviewCardStyles } from "./styles";
import { overviewLanguage, overviewRtl, overviewText, quickActionLabel } from "./translations";
import type {
  AreaBubbleOverviewCardConfig,
  OverviewArea,
  OverviewDiscovery,
  OverviewEntity,
  OverviewQuickActionId,
  OverviewQuickActionKind,
  OverviewSection,
  ResolvedOverviewConfig,
} from "./types";

const numberAttribute = (item: OverviewEntity, key: string): number | undefined => {
  const value = item.entity.attributes[key];
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
};

type QuickPopupState = {
  areaId: string;
  action: OverviewQuickActionKind;
};

type OptimisticClimateTargets = ClimateTemperatureTargets & {
  baseline: string;
  expiresAt: number;
};

const FLOOR_QUICK_AREA_ID = "__overview_floor__";
const COVER_COMMAND_TIMEOUT_MS = 12_000;

const isCoverControlService = (service: string): service is CoverControlService =>
  service === "open_cover" || service === "stop_cover" || service === "close_cover";

@customElement(OVERVIEW_CARD_TAG)
export class AreaBubbleOverviewCard extends LitElement {
  static override styles = overviewCardStyles;

  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private config?: ResolvedOverviewConfig;
  @state() private expanded: Record<string, boolean> = {};
  @state() private floorExpanded = true;
  @state() private pendingActions = new Set<string>();
  @state() private pendingSections = new Set<string>();
  @state() private pendingEntities = new Set<string>();
  @state() private pendingCoverCommands = new Set<string>();
  @state() private quickPopup?: QuickPopupState;
  @state() private areaPopupId?: string;
  @state() private floorPopupOpen = false;
  @state() private pendingFloor = false;
  @state() private pendingFloorRooms = new Set<string>();
  @state() private optimisticClimateTargets: Record<string, OptimisticClimateTargets> = {};
  @state() private error?: string;
  private storageId = "overview";
  private holdTimer?: number;
  private holdPointerId?: number;
  private holdEntityId?: string;
  private holdStart?: { x: number; y: number };
  private holdTarget?: HTMLElement;
  private suppressClickEntityId?: string;
  private suppressClickUntil = 0;
  private quickPopupTrigger?: HTMLElement;
  private quickPopupMoreInfo?: OverviewEntity;
  private restoreQuickPopupFocus = true;
  private areaPopupTrigger?: HTMLElement;
  private areaPopupMoreInfo?: OverviewEntity;
  private restoreAreaPopupFocus = true;
  private floorPopupTrigger?: HTMLElement;
  private durationTimer?: number;
  private climateTargetTimers = new Map<string, number>();

  public override connectedCallback(): void {
    super.connectedCallback();
    this.durationTimer ??= window.setInterval(() => this.requestUpdate(), 60_000);
  }

  public static getConfigElement(): HTMLElement {
    return document.createElement(OVERVIEW_EDITOR_TAG);
  }

  public static getStubConfig(): Partial<AreaBubbleOverviewCardConfig> {
    return { language: "auto", rtl: "auto" };
  }

  public setConfig(config: AreaBubbleOverviewCardConfig): void {
    this.resetQuickPopup();
    this.resetFloorPopup();
    this.resetAreaPopup();
    this.resetClimateTargets();
    try {
      validateOverviewConfig(config);
      this.config = resolveOverviewConfig(config);
      this.storageId = this.config.id || `${this.config.floor ? "floor" : "area"}:${this.config.floor ?? this.config.area ?? "unconfigured"}`;
      this.expanded = this.config.remember_expanded_state ? this.readExpanded() : {};
      this.floorExpanded = this.config.remember_expanded_state
        ? this.readFloorExpanded() ?? this.config.floor_default_expanded
        : this.config.floor_default_expanded;
      this.error = undefined;
    } catch (error) {
      this.error = error instanceof Error ? error.message : String(error);
    }
  }

  public getCardSize(): number {
    if (!this.config) return 3;
    const discovery = discoverOverview(this.hass, this.config);
    if (discovery.targetKind === "floor" && this.config.show_header && this.config.show_floor_header && !this.floorExpanded) return 2;
    const visibleAreas = visibleOverviewAreas(discovery.areas, (area) => this.isExpanded(area));
    return Math.max(
      2,
      visibleAreas.reduce(
        (size, area) => size + 2 + (this.isExpanded(area) ? area.sections.reduce((sum, section) => sum + section.entities.length, 0) : 0),
        discovery.targetKind === "floor" ? 1 : 0,
      ),
    );
  }

  public getGridOptions(): Record<string, number> {
    return { columns: 12, min_columns: 6 };
  }

  public override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.cancelHold();
    this.resetQuickPopup();
    this.resetFloorPopup();
    this.resetAreaPopup();
    this.resetClimateTargets();
    if (this.durationTimer !== undefined) window.clearInterval(this.durationTimer);
    this.durationTimer = undefined;
  }

  protected override render() {
    if (this.error) return html`<ha-card><div class="root"><div class="warning">${this.error}</div></div></ha-card>`;
    if (!this.config) return nothing;
    const rtl = overviewRtl(this.hass, this.config);
    this.setAttribute("dir", rtl ? "rtl" : "ltr");
    this.style.setProperty("--aboc-direction", rtl ? "rtl" : "ltr");
    this.applyStyleVariables();

    const discovery = discoverOverview(this.hass, this.config);
    const floorContentId = `overview-floor-${this.storageId.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
    const floorCanCollapse = discovery.targetKind === "floor" && this.config.show_header && this.config.show_floor_header;
    return html`
      <ha-card>
        <div class="root">
          ${this.renderOverallHeader(discovery, floorContentId)}
          ${discovery.targetKind === "none"
            ? this.renderEmpty(overviewText(this.hass, this.config, "choose_target"), "mdi:map-marker-plus-outline")
            : html`
                <div id=${floorContentId} ?hidden=${floorCanCollapse && !this.floorExpanded}>
                  ${discovery.areas.length
                    ? this.renderAreaHierarchy(discovery.areas)
                    : this.renderEmpty(overviewText(this.hass, this.config, "no_areas"), "mdi:home-search-outline")}
                </div>
              `}
          ${discovery.warnings.length && discovery.targetKind !== "none"
            ? html`<div class="warning">${discovery.warnings.join(" · ")}</div>`
            : nothing}
          ${this.config.debug ? html`<pre class="debug">${JSON.stringify(discovery, null, 2)}</pre>` : nothing}
        </div>
      </ha-card>
      ${this.renderQuickActionPopup(discovery)}
      ${this.renderFloorPopup(discovery)}
      ${this.renderAreaPopup(discovery)}
    `;
  }

  private renderOverallHeader(discovery: OverviewDiscovery, contentId: string) {
    if (!this.config?.show_header) return nothing;
    const show = discovery.targetKind === "floor" ? this.config.show_floor_header : Boolean(this.config.title);
    if (!show || !discovery.targetName) return nothing;
    if (discovery.targetKind === "floor") {
      const activeAreas = discovery.areas.filter((area) => area.allEntities.some(countsTowardAreaActivity));
      const floorQuickArea = this.floorQuickArea(discovery);
      const activeClimates = quickActionMembers(floorQuickArea, "climate")
        .filter((item) => item.powered && item.ignoreActivity !== true);
      const floorClimateBusy = this.quickActionPending(FLOOR_QUICK_AREA_ID, "climate")
        || activeClimates.some((item) => this.pendingEntities.has(item.entityId));
      const occupiedAreas = discovery.areas.filter((area) => area.occupancy === "occupied").length;
      const summary = [
        `${discovery.areas.length} ${this.localText("אזורים", "areas")}`,
        activeAreas.length ? `${activeAreas.length} ${this.localText("פעילים", "active")}` : "",
        this.config.show_occupancy && occupiedAreas ? `${occupiedAreas} ${this.localText("מאוכלסים", "occupied")}` : "",
      ].filter(Boolean).join(" · ");
      const label = `${this.floorExpanded ? this.localText("כיווץ קומה", "Collapse floor") : this.localText("פתיחת קומה", "Expand floor")}: ${discovery.targetName}`;
      return html`
        <div class="overview-heading floor-heading ${activeAreas.length ? "has-active" : "all-off"}" data-powered=${activeAreas.length ? "true" : "false"}>
          <div class="floor-summary-pill">
            <button class="floor-toggle ${this.config.show_floor_expand_button ? "" : "without-floor-expand-button"}" type="button" aria-expanded=${this.floorExpanded} aria-controls=${contentId} aria-label=${label} @click=${() => this.toggleFloor()}>
              <span class="icon-bubble small"><ha-icon icon=${discovery.targetIcon}></ha-icon></span>
              <span class="heading-main"><span class="floor-title">${discovery.targetName}</span><span class="subtitle">${summary}</span></span>
              ${this.config.show_floor_expand_button
                ? html`<span class="floor-chevron ${this.floorExpanded ? "expanded" : ""}" aria-hidden="true"><ha-icon icon="mdi:chevron-down"></ha-icon></span>`
                : nothing}
            </button>
            ${activeClimates.length
              ? html`<button
                  class="floor-climate-badge"
                  type="button"
                  aria-haspopup="dialog"
                  aria-expanded=${this.quickPopup?.areaId === FLOOR_QUICK_AREA_ID && this.quickPopup.action === "climate"}
                  aria-busy=${floorClimateBusy}
                  aria-label=${`${this.localText("פתיחת המזגנים הפעילים בקומה", "Open active floor climate controls")}: ${activeClimates.length}`}
                  ?disabled=${floorClimateBusy}
                  @click=${(event: Event) => this.openQuickActionPopup(event, floorQuickArea, "climate")}
                ><ha-icon icon=${this.config.quick_action_icons.climate}></ha-icon><span>${activeClimates.length}</span></button>`
              : nothing}
            ${activeAreas.length
              ? html`<button
                  class="floor-active-badge"
                  type="button"
                  aria-haspopup="dialog"
                  aria-expanded=${this.floorPopupOpen}
                  aria-label=${`${this.localText("פתיחת חדרים פעילים", "Open active rooms")}: ${activeAreas.length}`}
                  @click=${(event: Event) => this.openFloorPopup(event)}
                ><ha-icon icon="mdi:home-lightning-bolt-outline"></ha-icon><span>${activeAreas.length}</span></button>`
              : nothing}
          </div>
        </div>
      `;
    }
    return html`<div class="overview-heading"><span class="icon-bubble small"><ha-icon icon=${discovery.targetIcon}></ha-icon></span><div class="heading-main"><h2>${discovery.targetName}</h2></div></div>`;
  }

  private renderAreaHierarchy(areas: OverviewArea[]) {
    const { roots, children } = buildOverviewAreaHierarchy(areas);
    const visited = new Set<string>();
    const renderNode = (area: OverviewArea): unknown => {
      if (visited.has(area.id)) return nothing;
      visited.add(area.id);
      const nested = children.get(area.id) ?? [];
      const expanded = this.isExpanded(area);
      const popupOpen = this.areaOpenMode(area) === "popup" && this.areaPopupId === area.id;
      const visibleNested = popupOpen ? [] : expanded ? nested : nested.filter((child) => child.showWhenParentCollapsed);
      const nestedContent = visibleNested.length
        ? html`<div class="subareas" role="group" aria-label=${`${this.localText("תתי אזורים של", "Sub-areas of")} ${area.name}`}>${visibleNested.map(renderNode)}</div>`
        : nothing;
      return html`
        <div class="area-tree-node">
          ${this.renderArea(area, nestedContent)}
        </div>
      `;
    };
    return html`<div class="areas">${roots.map(renderNode)}</div>`;
  }

  private renderArea(area: OverviewArea, nestedContent: unknown = nothing) {
    if (!this.config) return nothing;
    const openMode = this.areaOpenMode(area);
    const popupMode = openMode === "popup";
    const popupOpen = popupMode && this.areaPopupId === area.id;
    const expanded = !popupMode && this.isExpanded(area);
    const activeCount = area.allEntities.filter(countsTowardAreaActivity).length;
    const activeQuickActions = this.config.show_quick_actions
      ? activeQuickActionSummaries(area, this.config.quick_actions)
      : [];
    const hasOccupancy = this.config.show_occupancy && area.occupancy !== "none";
    const hasTemperature = this.config.show_temperature && area.temperature !== undefined;
    const climateTemperatureAction = hasTemperature
      ? activeQuickActions.find(({ action }) => action === "climate")
      : undefined;
    const quickActions = climateTemperatureAction
      ? activeQuickActions.filter(({ action }) => action !== "climate")
      : activeQuickActions;
    const fanEntities = quickActionMembers(area, "fans");
    const activeClimateCount = climateTemperatureAction?.entities.filter((item) => item.powered && item.ignoreActivity !== true).length ?? 0;
    const activeFanCount = fanEntities.filter((item) => item.powered && item.ignoreActivity !== true).length;
    const totalClimateCount = climateTemperatureAction?.entities.length ?? 0;
    const totalFanCount = fanEntities.length;
    const hasStatuses = hasOccupancy || quickActions.length > 0 || hasTemperature || activeFanCount > 0;
    const formattedTemperature = hasTemperature ? this.formatTemperature(area.temperature!, area.temperatureUnit) : "";
    const temperatureModeLabel = {
      none: this.localText("ללא מצב מיזוג", "No climate mode"),
      off: this.localText("המיזוג כבוי", "Climate off"),
      cool: this.localText("קירור", "Cooling"),
      heat: this.localText("חימום", "Heating"),
      active: this.localText("מצב מיזוג פעיל", "Climate active"),
    }[area.temperatureMode];
    const summaryLoad = Math.min(8, quickActions.length + Number(hasOccupancy) + Number(hasTemperature) * 2 + Number(!hasTemperature && activeFanCount > 0));
    const compactStatuses = summaryLoad >= 5;
    const safeAreaId = area.id.replace(/[^a-zA-Z0-9_-]/g, "-");
    const contentId = `overview-area-${safeAreaId}`;
    const popupId = `overview-area-popup-${safeAreaId}`;
    const nameId = `overview-area-name-${safeAreaId}`;
    const toggleLabel = popupMode
      ? `${this.localText("פתיחת חדר בחלון", "Open room in dialog")}: ${area.name}`
      : `${overviewText(this.hass, this.config, expanded ? "collapse" : "expand")}: ${area.name}`;
    return html`
      <section
        class="area-panel ${activeCount ? "has-active" : "all-off"} ${expanded ? "expanded" : ""}"
        data-powered=${activeCount ? "true" : "false"}
        aria-labelledby=${nameId}
      >
        <header class="area-summary ${this.config.show_area_expand_button ? "" : "without-expand-button"}">
          <div
            class="area-summary-pill quick-actions-${this.config.quick_actions_position} climate-tag-${this.config.climate_tag_position} summary-load-${summaryLoad} ${compactStatuses ? "compact-statuses" : ""} ${hasStatuses ? "has-statuses" : "no-statuses"}"
            tabindex="-1"
            @click=${(event: MouseEvent) => this.handleAreaSummaryClick(event, area)}
          >
            <button
              class="area-toggle"
              type="button"
              aria-expanded=${popupMode ? popupOpen : expanded}
              aria-haspopup=${popupMode ? "dialog" : nothing}
              aria-controls=${popupMode ? popupId : contentId}
              aria-label=${toggleLabel}
              @click=${(event: Event) => this.activateArea(event, area)}
            >
              <span class="icon-bubble area-icon"><ha-icon icon=${area.icon}></ha-icon></span>
              <span class="area-main">
                <span class="area-name" id=${nameId}>${area.name}</span>
                ${activeCount ? html`<span class="active-summary">${activeCount} ${this.localText("פעילים", "active")}</span>` : nothing}
              </span>
            </button>
            <div class="area-statuses">
              ${this.renderOccupancy(area)}
              ${quickActions.length ? this.renderQuickActions(area, quickActions) : nothing}
              ${hasTemperature || climateTemperatureAction || activeFanCount > 0
                ? html`<span
                    class="temperature-summary tag-position-${this.config.climate_tag_position}"
                    style=${`--aboc-temperature-tag-gap:${this.config.style.climate_tag_gap}px`}
                  >
                    ${hasTemperature
                      ? html`<span class="temperature area-temperature temperature-${area.temperatureMode}" title=${`${formattedTemperature} · ${temperatureModeLabel}`} aria-label=${`${formattedTemperature} · ${temperatureModeLabel}`}>${formattedTemperature}</span>`
                      : nothing}
                    <span class="temperature-tags">
                      ${climateTemperatureAction && activeClimateCount > 0
                        ? this.renderTemperatureStatusTag(area, this.config.quick_action_icons.climate, activeClimateCount, totalClimateCount, "climate")
                        : nothing}
                      ${this.config.show_fan_tag && activeFanCount > 0
                        ? this.renderTemperatureStatusTag(area, "mdi:fan", activeFanCount, totalFanCount, "fan")
                        : nothing}
                    </span>
                  </span>`
                : nothing}
            </div>
          </div>
          ${this.config.show_area_expand_button
            ? html`<button
                class="expand-button"
                type="button"
                aria-expanded=${popupMode ? popupOpen : expanded}
                aria-haspopup=${popupMode ? "dialog" : nothing}
                aria-controls=${popupMode ? popupId : contentId}
                aria-label=${toggleLabel}
                @click=${(event: Event) => this.activateArea(event, area)}
              ><span class="chevron ${popupMode ? "popup-mode" : ""}" aria-hidden="true"><ha-icon icon=${popupMode ? "mdi:open-in-new" : "mdi:chevron-down"}></ha-icon></span></button>`
            : nothing}
        </header>
        <div class="area-disclosure" id=${contentId} ?hidden=${!expanded}>
          <div class="expanded-content">${this.renderAreaContent(area)}</div>
          ${expanded ? nestedContent : nothing}
        </div>
        ${expanded ? nothing : nestedContent}
      </section>
    `;
  }

  private renderTemperatureStatusTag(area: OverviewArea, icon: string, active: number, total: number, kind: "climate" | "fan") {
    if (!this.config) return nothing;
    const action: OverviewQuickActionKind = kind === "fan" ? "fans" : "climate";
    const pending = this.quickActionPending(area.id, action);
    const label = kind === "fan"
      ? this.localText("מאוורר פעיל", "Active fan")
      : this.localText("מיזוג אוויר פעיל", "Active climate");
    const openLabel = kind === "fan"
      ? this.localText("פתיחת בקרת מאווררים", "Open fan controls")
      : this.localText("פתיחת מיזוג אוויר", "Open climate controls");
    return html`<button
      class="temperature-status-tag temperature-${kind}-tag temperature-${area.temperatureMode}"
      type="button"
      title=${`${label}: ${active}/${total}`}
      aria-label=${`${openLabel}: ${area.name} · ${label} (${active}/${total})`}
      aria-haspopup="dialog"
      aria-expanded=${this.quickPopup?.areaId === area.id && this.quickPopup.action === action}
      aria-busy=${pending}
      ?disabled=${pending}
      @click=${(event: Event) => this.openQuickActionPopup(event, area, action)}
    ><ha-icon icon=${icon}></ha-icon></button>`;
  }

  private renderOccupancy(area: OverviewArea) {
    if (!this.config?.show_occupancy || area.occupancy === "none") return nothing;
    const occupied = area.occupancy === "occupied";
    const displayCount = area.occupancyCount === undefined ? "?" : area.occupancyCount > 9 ? "9+" : String(area.occupancyCount);
    const icon = occupied ? "mdi:account-multiple" : area.occupancy === "vacant" ? "mdi:account-multiple-outline" : "mdi:account-question-outline";
    const stateLabel = overviewText(this.hass, this.config, area.occupancy === "occupied" ? "occupied" : area.occupancy === "vacant" ? "vacant" : "unknown");
    const countLabel = area.occupancyCount === undefined
      ? stateLabel
      : area.occupancyCountSource === "entity"
        ? `${area.name}: ${area.occupancyCount} ${this.localText("נוכחים", "occupants")}`
        : `${area.name}: ${area.occupancyCount} ${this.localText("חיישני נוכחות פעילים", "active presence sensors")}`;
    return html`
      <span class="summary-chip occupancy ${occupied ? "occupied" : area.occupancy === "unknown" ? "unknown" : "vacant"}" title=${countLabel} aria-label=${countLabel}>
        <ha-icon icon=${icon}></ha-icon>
        <span class="occupancy-count" aria-hidden="true">${displayCount}</span>
        <span class="occupancy-label">${countLabel}</span>
      </span>
    `;
  }

  private renderQuickActions(
    area: OverviewArea,
    actions: Array<{ action: OverviewQuickActionId; entities: OverviewEntity[] }>,
  ) {
    if (!this.config) return nothing;
    return html`
      <div class="quick-actions" role="group" aria-label=${`${this.localText("פעולות מהירות", "Quick actions")}: ${area.name}`}>
        ${actions.map(({ action, entities }) => {
          const activeCount = entities.filter((item) => item.powered).length;
          const pending = this.quickActionPending(area.id, action) || entities.some((item) => this.pendingEntities.has(item.entityId));
          const label = quickActionLabel(this.hass, this.config!, action);
          const accessibleLabel = `${this.localText("פתיחת", "Open")} ${label}: ${area.name} (${activeCount}/${entities.length})`;
          const popupOpen = this.quickPopup?.areaId === area.id && this.quickPopup.action === action;
          return html`
            <button
              class="quick-action ${activeCount ? "active" : "inactive"}"
              type="button"
              title=${accessibleLabel}
              aria-label=${accessibleLabel}
              aria-haspopup="dialog"
              aria-expanded=${popupOpen}
              aria-busy=${pending}
              ?disabled=${pending}
              @click=${(event: Event) => this.openQuickActionPopup(event, area, action)}
            >
              <ha-icon icon=${pending ? "mdi:loading" : this.config!.quick_action_icons[action]}></ha-icon>
              ${activeCount ? html`<span class="count-badge">${activeCount}</span>` : nothing}
            </button>
          `;
        })}
      </div>
    `;
  }

  private renderAreaContent(area: OverviewArea) {
    if (!this.config) return nothing;
    const areaOverride = this.config.area_overrides[area.id] ?? this.config.area_overrides[area.name];
    const layout = buildOverviewAreaContentLayout(area, areaOverride?.subarea_order, this.config.show_empty_sections);
    return html`
      ${layout.generalSections.map((section) => this.renderSection(section, area))}
      ${layout.subareas.map((subarea, index) => {
        const activeCount = subarea.entities.filter(countsTowardAreaActivity).length;
        const headingId = `overview-room-subarea-${area.id}-${index}`.replace(/[^a-zA-Z0-9_-]/g, "-");
        return html`
          <section class="room-subarea ${activeCount ? "has-active" : "all-off"}" aria-labelledby=${headingId}>
            <header class="room-subarea-heading" id=${headingId}>
              <span class="icon-bubble room-subarea-icon"><ha-icon icon="mdi:home-floor-1"></ha-icon></span>
              <span class="room-subarea-title">${subarea.name}</span>
              <span class="room-subarea-count">${activeCount}/${subarea.entities.length}</span>
            </header>
            <div class="room-subarea-sections">
              ${subarea.sections.map((section) => this.renderSection(section, area, `subarea-${index}`))}
            </div>
          </section>
        `;
      })}
    `;
  }

  private renderSection(section: OverviewSection, area: OverviewArea, scope = "general") {
    const areaId = area.id;
    const actionAreaId = scope === "general" ? areaId : `${areaId}:${scope}`;
    const headingId = `overview-section-${section.id}-${areaId}-${scope}`.replace(/[^a-zA-Z0-9_-]/g, "-");
    const onTargets = sectionActionEntities(section, true);
    const offTargets = sectionActionEntities(section, false);
    const pendingOn = this.pendingSections.has(`${actionAreaId}:${section.id}:on`);
    const pendingOff = this.pendingSections.has(`${actionAreaId}:${section.id}:off`);
    const pending = pendingOn || pendingOff || section.entities.some((item) => this.pendingEntities.has(item.entityId));
    const onVerb = section.id === "covers" ? this.localText("פתיחת כל התריסים", "Open all covers") : this.localText("הפעלת הכל", "Turn everything on");
    const offVerb = section.id === "covers" ? this.localText("סגירת כל התריסים", "Close all covers") : this.localText("כיבוי הכל", "Turn everything off");
    const onLabel = `${onVerb}: ${section.title} (${onTargets.length})`;
    const offLabel = `${offVerb}: ${section.title} (${offTargets.length})`;
    const areaOverride = this.config?.area_overrides[area.id] ?? this.config?.area_overrides[area.name];
    const sectionStyle = { ...(this.config?.section_styles[section.id] ?? {}), ...(areaOverride?.section_styles?.[section.id] ?? {}) };
    const frameBrightness = this.config?.style.section_frame_brightness ?? 12;
    const frameMix = Math.max(0, 100 - Math.abs(frameBrightness));
    const linkedFrameColor = `color-mix(in srgb, var(--aboc-area-frame-color) ${frameMix}%, ${frameBrightness >= 0 ? "white" : "black"})`;
    const inheritedFrameColor = this.config?.style.link_section_frame_color
      ? linkedFrameColor
      : "color-mix(in srgb, var(--divider-color) 58%, transparent)";
    const requestedSectionColumns = sectionStyle.columns ?? (section.id === "lights_switches" || section.id === "floor_heating" ? 2 : 1);
    const sectionColumns = section.id === "covers" ? Math.min(2, requestedSectionColumns) : requestedSectionColumns;
    const entityCardSize = areaOverride?.entity_card_size ?? this.config?.entity_card_size ?? "medium";
    const defaultHeights = {
      compact: section.id === "climate" ? 96 : section.id === "floor_heating" ? 80 : 48,
      medium: section.id === "climate" ? 108 : section.id === "floor_heating" ? 92 : 56,
      wide: section.id === "climate" ? 120 : section.id === "floor_heating" ? 108 : 68,
    } as const;
    const defaultEntityHeight = defaultHeights[entityCardSize];
    const sectionEntityHeight = sectionStyle.entity_height ?? defaultEntityHeight;
    const actionPresentation = sectionStyle.action_presentation ?? this.config?.section_action_presentation ?? "icon";
    const sectionStyleText = [
      `--aboc-section-background:${sectionStyle.background || "transparent"}`,
      `--aboc-section-border-color:${sectionStyle.border_color || inheritedFrameColor}`,
      `--aboc-section-border-width:${sectionStyle.border_width ?? 1}px`,
      `--aboc-section-border-style:${sectionStyle.border_style ?? "solid"}`,
      `--aboc-section-columns:${sectionColumns}`,
      `--aboc-section-entity-height:${sectionEntityHeight}px`,
    ].join(";");
    const toggleTurnOn = sectionToggleTurnOn(section, offTargets);
    const toggleTargets = toggleTurnOn ? onTargets : offTargets;
    const togglePending = toggleTurnOn ? pendingOn : pendingOff;
    const toggleLabel = toggleTurnOn ? onLabel : offLabel;
    const compactGroup = section.id === "climate" && this.fanDisplayMode(area) === "button"
      ? AUTO_FAN_GROUP
      : section.id === "floor_heating" && this.heatingControlsDisplayMode(area) === "button"
        ? AUTO_FLOOR_HEATING_GROUP
        : undefined;
    const compactEntities = compactGroup
      ? section.entities.filter((item) => item.group === compactGroup)
      : [];
    return html`
      <section class="device-section section-${section.id} columns-${sectionColumns} entity-size-${entityCardSize} ${sectionStyle.show_border ? "section-framed" : ""}" style=${sectionStyleText} aria-labelledby=${headingId}>
        <h3 class="section-heading ${compactEntities.length ? "has-compact-subgroup-button" : ""}" id=${headingId}>
          <span class="section-heading-main"><ha-icon icon=${section.icon}></ha-icon><span class="section-title" title=${section.title}>${section.title}</span><span class="section-count">${section.activeCount}/${section.entities.length}</span></span>
          ${compactGroup && compactEntities.length ? this.renderAutomaticSubgroupButton(area, compactGroup, compactEntities) : nothing}
          <span class="section-actions" role="group" aria-label=${`${this.localText("שליטה כללית", "Group controls")}: ${section.title}`}>
            ${this.config?.section_action_mode === "toggle"
              ? html`<button
                  class="section-toggle-button presentation-${actionPresentation} ${toggleTurnOn ? "turn-on" : "turn-off"}"
                  type="button"
                  title=${toggleLabel}
                  aria-label=${toggleLabel}
                  aria-busy=${togglePending}
                  ?disabled=${pending || toggleTargets.length === 0}
                  @click=${(event: Event) => this.handleSectionAction(event, section, actionAreaId, toggleTurnOn)}
                >${this.renderSectionActionContent(section.id, toggleTurnOn, togglePending, actionPresentation)}</button>`
              : html`
                  <button
                    class="section-on-button presentation-${actionPresentation}"
                    type="button"
                    title=${onLabel}
                    aria-label=${onLabel}
                    aria-busy=${pendingOn}
                    ?disabled=${pending || onTargets.length === 0}
                    @click=${(event: Event) => this.handleSectionAction(event, section, actionAreaId, true)}
                  >${this.renderSectionActionContent(section.id, true, pendingOn, actionPresentation)}</button>
                  <button
                    class="section-off-button presentation-${actionPresentation}"
                    type="button"
                    title=${offLabel}
                    aria-label=${offLabel}
                    aria-busy=${pendingOff}
                    ?disabled=${pending || offTargets.length === 0}
                    @click=${(event: Event) => this.handleSectionAction(event, section, actionAreaId, false)}
                  >${this.renderSectionActionContent(section.id, false, pendingOff, actionPresentation)}</button>
                `}
          </span>
        </h3>
        ${this.renderSectionEntities(section, area, sectionColumns)}
      </section>
    `;
  }

  private renderSectionEntities(section: OverviewSection, area: OverviewArea, configuredColumns: number) {
    if (!section.entities.length) {
      return html`<div class="section-entities"><div class="secondary section-empty">${this.config && overviewLanguage(this.hass, this.config) === "he" ? "אין רכיבים בסעיף" : "No devices in this section"}</div></div>`;
    }
    const compactGroup = section.id === "climate" && this.fanDisplayMode(area) === "button"
      ? AUTO_FAN_GROUP
      : section.id === "floor_heating" && this.heatingControlsDisplayMode(area) === "button"
        ? AUTO_FLOOR_HEATING_GROUP
        : undefined;
    const gridColumns = (count: number, forceSingle = false): string =>
      `--aboc-section-columns:${forceSingle ? 1 : Math.max(1, Math.min(configuredColumns, count))}`;
    const ungrouped = section.entities.filter((item) => !item.group);
    const groups = new Map<string, OverviewEntity[]>();
    for (const item of section.entities) {
      if (!item.group) continue;
      if (item.group === compactGroup) continue;
      const entries = groups.get(item.group) ?? [];
      entries.push(item);
      groups.set(item.group, entries);
    }
    return html`
      ${ungrouped.length ? html`<div class="section-entities" style=${gridColumns(ungrouped.length)}>${ungrouped.map((item) => this.renderEntity(item, section.id))}</div>` : nothing}
      ${[...groups.entries()].map(([group, entities]) => {
        const title = this.subgroupTitle(group, area);
        const automaticHeatingControls = group === AUTO_FLOOR_HEATING_GROUP;
        return html`
          <section class="entity-subgroup ${automaticHeatingControls ? "automatic-heating-controls" : ""}" aria-label=${title}>
            <div class="entity-subgroup-heading"><ha-icon icon=${this.subgroupIcon(group)}></ha-icon><span>${title}</span><small>${entities.filter((item) => item.powered).length}/${entities.length}</small></div>
            <div class="section-entities" style=${gridColumns(entities.length, automaticHeatingControls)}>${entities.map((item) => this.renderEntity(item, section.id))}</div>
          </section>
        `;
      })}
    `;
  }

  private renderAutomaticSubgroupButton(area: OverviewArea, group: string, entities: OverviewEntity[]) {
    // `ignore_activity` only removes the device from room/Floor summaries. The
    // expanded control must still reflect the device's real powered state.
    const activeCount = entities.filter((item) => item.powered).length;
    const heatingControls = group === AUTO_FLOOR_HEATING_GROUP;
    const action: OverviewQuickActionKind = heatingControls ? "heating_controls" : "fans";
    const icon = heatingControls ? "mdi:radiator" : "mdi:fan";
    const title = this.subgroupTitle(group, area, true);
    const pending = this.quickActionPending(area.id, action) || entities.some((item) => this.pendingEntities.has(item.entityId));
    const turnOn = activeCount === 0;
    const targets = quickActionDirectEntities(entities, action, turnOn);
    const accessibleLabel = `${heatingControls
      ? this.localText(turnOn ? "הדלקת מפסק חימום" : "כיבוי מפסק חימום", turnOn ? "Turn heating switch on" : "Turn heating switch off")
      : this.localText(turnOn ? "הדלקת מאוורר" : "כיבוי מאוורר", turnOn ? "Turn fan on" : "Turn fan off")}: ${area.name} · ${activeCount}/${entities.length}`;
    return html`
      <button
        class="section-compact-subgroup-button ${heatingControls ? "section-heating-controls-button" : "section-fan-button"} ${activeCount ? "active" : "inactive"}"
        type="button"
        title=${accessibleLabel}
        aria-label=${accessibleLabel}
        aria-pressed=${activeCount > 0}
        aria-busy=${pending}
        ?disabled=${pending || targets.length === 0}
        @click=${(event: Event) => this.handleCompactSubgroupToggle(event, area, action, entities)}
      ><ha-icon icon=${pending ? "mdi:loading" : icon}></ha-icon><span>${title}</span><small>${activeCount}/${entities.length}</small></button>
    `;
  }

  private fanDisplayMode(area: OverviewArea): "subgroup" | "button" {
    const override = this.config?.area_overrides[area.id] ?? this.config?.area_overrides[area.name];
    return override?.fan_display_mode ?? this.config?.fan_display_mode ?? "subgroup";
  }

  private heatingControlsDisplayMode(area: OverviewArea): "subgroup" | "button" {
    const override = this.config?.area_overrides[area.id] ?? this.config?.area_overrides[area.name];
    return override?.heating_controls_display_mode ?? this.config?.heating_controls_display_mode ?? "subgroup";
  }

  private subgroupTitle(group: string, area: OverviewArea, compact = false): string {
    const key = group === AUTO_FAN_GROUP ? "fans" : group === AUTO_FLOOR_HEATING_GROUP ? "heating_controls" : undefined;
    if (!key) return group;
    const areaOverride = this.config?.area_overrides[area.id] ?? this.config?.area_overrides[area.name];
    const configured = areaOverride?.subgroup_titles?.[key] || this.config?.subgroup_titles[key];
    if (configured) return configured;
    if (key === "fans") return compact ? this.localText("מאוורר", "Fan") : this.localText("מאווררים", "Fans");
    if (key === "heating_controls") return compact ? this.localText("מפסק", "Switch") : this.localText("בקרי חימום", "Heating controls");
    return group;
  }

  private subgroupIcon(group: string): string {
    if (group === AUTO_FAN_GROUP) return "mdi:fan";
    if (group === AUTO_FLOOR_HEATING_GROUP) return "mdi:radiator";
    return "mdi:folder-home-outline";
  }

  private sectionActionIcon(section: OverviewSection["id"], turnOn: boolean): string {
    if (!this.config) return turnOn ? "mdi:play-circle-outline" : "mdi:stop-circle-outline";
    if (section === "covers") return turnOn ? this.config.section_action_icons.open : this.config.section_action_icons.close;
    return turnOn ? this.config.section_action_icons.on : this.config.section_action_icons.off;
  }

  private renderSectionActionContent(
    section: OverviewSection["id"],
    turnOn: boolean,
    pending: boolean,
    presentation: "icon" | "text" | "both",
  ) {
    const icon = pending ? "mdi:loading" : this.sectionActionIcon(section, turnOn);
    const label = section === "covers"
      ? turnOn ? this.localText("פתח", "Open") : this.localText("סגור", "Close")
      : turnOn ? this.localText("הדלק", "On") : this.localText("כבה", "Off");
    return html`
      ${presentation !== "text" ? html`<ha-icon icon=${icon}></ha-icon>` : nothing}
      ${presentation !== "icon" ? html`<span class="section-action-label">${pending ? this.localText("מבצע…", "Working…") : label}</span>` : nothing}
    `;
  }

  private renderQuickActionPopup(discovery: OverviewDiscovery) {
    if (!this.config || !this.quickPopup) return nothing;
    const area = this.quickPopup.areaId === FLOOR_QUICK_AREA_ID && discovery.targetKind === "floor"
      ? this.floorQuickArea(discovery)
      : discovery.areas.find((candidate) => candidate.id === this.quickPopup?.areaId);
    if (!area) {
      queueMicrotask(() => this.resetQuickPopup());
      return nothing;
    }
    const action = this.quickPopup.action;
    const entities = quickActionMembers(area, action);
    if (!entities.length) {
      queueMicrotask(() => this.resetQuickPopup());
      return nothing;
    }
    const label = quickActionLabel(this.hass, this.config, action);
    const activeCount = entities.filter((item) => item.powered).length;
    const onTargets = quickActionActionEntities(area, action, true);
    const offTargets = quickActionActionEntities(area, action, false);
    const pendingOn = this.pendingActions.has(`${area.id}:${action}:on`);
    const pendingOff = this.pendingActions.has(`${area.id}:${action}:off`);
    const pending = pendingOn || pendingOff;
    const entityPending = entities.some((item) => this.pendingEntities.has(item.entityId));
    const categoryBusy = pending || entityPending;
    const safeId = `${area.id}-${action}`.replace(/[^a-zA-Z0-9_-]/g, "-");
    const titleId = `overview-quick-popup-title-${safeId}`;
    const onVerb = action === "covers" ? this.localText("פתיחת הכל", "Open all") : this.localText("הפעלת הכל", "Turn all on");
    const offVerb = action === "covers" ? this.localText("סגירת הכל", "Close all") : this.localText("כיבוי הכל", "Turn all off");
    const popupIcon = action === "fans"
      ? "mdi:fan"
      : action === "heating_controls"
        ? "mdi:radiator"
        : this.config.quick_action_icons[action];
    return html`
      <dialog
        class="quick-action-dialog area-quick-action-dialog"
        aria-modal="true"
        aria-labelledby=${titleId}
        @cancel=${(event: Event) => this.handleQuickPopupCancel(event)}
        @close=${() => this.handleQuickPopupClosed()}
        @click=${(event: MouseEvent) => this.handleQuickPopupBackdrop(event)}
        @keydown=${(event: KeyboardEvent) => this.handleQuickPopupKeydown(event)}
      >
        <section class="quick-popup" aria-busy=${categoryBusy}>
          <header class="quick-popup-header">
            <span class="icon-bubble popup-icon"><ha-icon icon=${popupIcon}></ha-icon></span>
            <span class="quick-popup-heading">
              <span class="quick-popup-title" id=${titleId}>${label} · ${area.name}</span>
              <span class="quick-popup-summary">${activeCount} ${this.localText("דלוקים מתוך", "on of")} ${entities.length}</span>
            </span>
            <button class="quick-popup-close" type="button" aria-label=${this.localText("סגירת חלון", "Close dialog")} @click=${() => this.closeQuickActionPopup()}>
              <ha-icon icon="mdi:close"></ha-icon>
            </button>
          </header>
          <div class="quick-popup-group-actions" role="group" aria-label=${`${this.localText("שליטה כללית", "Group controls")}: ${label}`}>
            <button
              class="quick-popup-group-button turn-on"
              type="button"
              aria-label=${`${onVerb}: ${label} (${onTargets.length})`}
              aria-busy=${pendingOn}
              ?disabled=${categoryBusy || onTargets.length === 0}
              @click=${(event: Event) => this.handleQuickActionGroupAction(event, area, action, true)}
            ><ha-icon icon=${pendingOn ? "mdi:loading" : action === "covers" ? "mdi:arrow-up" : "mdi:power-on"}></ha-icon><span>${onVerb}</span><small>${onTargets.length}</small></button>
            <button
              class="quick-popup-group-button turn-off"
              type="button"
              aria-label=${`${offVerb}: ${label} (${offTargets.length})`}
              aria-busy=${pendingOff}
              ?disabled=${categoryBusy || offTargets.length === 0}
              @click=${(event: Event) => this.handleQuickActionGroupAction(event, area, action, false)}
            ><ha-icon icon=${pendingOff ? "mdi:loading" : action === "covers" ? "mdi:arrow-down" : "mdi:power-off"}></ha-icon><span>${offVerb}</span><small>${offTargets.length}</small></button>
          </div>
          <div class="quick-popup-list" role="list" aria-label=${label}>
            ${entities.map((item) => this.renderQuickPopupEntity(item, action, pending))}
          </div>
        </section>
      </dialog>
    `;
  }

  private renderFloorPopup(discovery: OverviewDiscovery) {
    if (!this.config || !this.floorPopupOpen || discovery.targetKind !== "floor") return nothing;
    const activeAreas = discovery.areas.filter((area) => area.allEntities.some(countsTowardAreaActivity));
    if (!activeAreas.length) {
      queueMicrotask(() => this.resetFloorPopup());
      return nothing;
    }
    const allTargets = activeAreas.flatMap((area) => areaActionEntities(area, false));
    const titleId = "overview-floor-popup-title";
    return html`
      <dialog
        class="quick-action-dialog floor-action-dialog"
        aria-modal="true"
        aria-labelledby=${titleId}
        @cancel=${(event: Event) => { event.preventDefault(); this.closeFloorPopup(); }}
        @close=${() => this.handleFloorPopupClosed()}
        @click=${(event: MouseEvent) => { if (event.target === event.currentTarget) this.closeFloorPopup(); }}
      >
        <section class="quick-popup floor-popup" aria-busy=${this.pendingFloor || this.pendingFloorRooms.size > 0}>
          <header class="quick-popup-header">
            <span class="icon-bubble popup-icon"><ha-icon icon=${discovery.targetIcon}></ha-icon></span>
            <span class="quick-popup-heading">
              <span class="quick-popup-title" id=${titleId}>${this.localText("חדרים פעילים", "Active rooms")} · ${discovery.targetName}</span>
              <span class="quick-popup-summary">${activeAreas.length} ${this.localText("חדרים דלוקים", "rooms on")}</span>
            </span>
            <button class="quick-popup-close" type="button" aria-label=${this.localText("סגירת חלון", "Close dialog")} @click=${() => this.closeFloorPopup()}><ha-icon icon="mdi:close"></ha-icon></button>
          </header>
          <button
            class="floor-all-off"
            type="button"
            aria-label=${`${this.localText("כיבוי כל החדרים", "Turn off all rooms")} (${allTargets.length})`}
            aria-busy=${this.pendingFloor}
            ?disabled=${this.pendingFloor || this.pendingFloorRooms.size > 0 || allTargets.length === 0}
            @click=${(event: Event) => this.handleFloorAllOff(event, activeAreas)}
          ><ha-icon icon=${this.pendingFloor ? "mdi:loading" : this.config.section_action_icons.off}></ha-icon><span>${this.localText("כיבוי כל החדרים", "Turn off all rooms")}</span><small>${allTargets.length}</small></button>
          <div class="floor-room-list" role="list">
            ${activeAreas.map((area) => {
              const targets = areaActionEntities(area, false);
              const busy = this.pendingFloor || this.pendingFloorRooms.has(area.id) || targets.some((item) => this.pendingEntities.has(item.entityId));
              return html`
                <article class="floor-room-row" role="listitem">
                  <span class="icon-bubble small"><ha-icon icon=${area.icon}></ha-icon></span>
                  <span class="floor-room-main"><strong>${area.name}</strong><small>${area.allEntities.filter(countsTowardAreaActivity).length} ${this.localText("פעילים", "active")}</small></span>
                  <button
                    class="floor-room-off"
                    type="button"
                    aria-label=${`${this.localText("כיבוי חדר", "Turn off room")}: ${area.name} (${targets.length})`}
                    aria-busy=${this.pendingFloorRooms.has(area.id)}
                    ?disabled=${busy || targets.length === 0}
                    @click=${(event: Event) => this.handleFloorRoomOff(event, area)}
                  ><ha-icon icon=${this.pendingFloorRooms.has(area.id) ? "mdi:loading" : this.config!.section_action_icons.off}></ha-icon></button>
                </article>
              `;
            })}
          </div>
        </section>
      </dialog>
    `;
  }

  private renderAreaPopup(discovery: OverviewDiscovery) {
    if (!this.config || !this.areaPopupId) return nothing;
    const area = discovery.areas.find((candidate) => candidate.id === this.areaPopupId);
    if (!area || this.areaOpenMode(area) !== "popup") {
      queueMicrotask(() => this.resetAreaPopup());
      return nothing;
    }
    const activeCount = area.allEntities.filter(countsTowardAreaActivity).length;
    const safeAreaId = area.id.replace(/[^a-zA-Z0-9_-]/g, "-");
    const dialogId = `overview-area-popup-${safeAreaId}`;
    const titleId = `${dialogId}-title`;
    return html`
      <dialog
        id=${dialogId}
        class="quick-action-dialog area-detail-dialog ${activeCount ? "has-active" : "all-off"}"
        aria-modal="true"
        aria-labelledby=${titleId}
        @cancel=${(event: Event) => { event.preventDefault(); this.closeAreaPopup(); }}
        @close=${() => this.handleAreaPopupClosed()}
        @click=${(event: MouseEvent) => { if (event.target === event.currentTarget) this.closeAreaPopup(); }}
      >
        <section class="quick-popup area-detail-popup">
          <header class="quick-popup-header area-detail-header">
            <span class="icon-bubble popup-icon"><ha-icon icon=${area.icon}></ha-icon></span>
            <span class="quick-popup-heading">
              <span class="quick-popup-title" id=${titleId}>${area.name}</span>
              <span class="quick-popup-summary">${activeCount
                ? `${activeCount} ${this.localText("פעילים", "active")}`
                : this.localText("הכול כבוי", "All off")}</span>
            </span>
            <button class="quick-popup-close" type="button" aria-label=${`${this.localText("סגירת חדר", "Close room")}: ${area.name}`} @click=${() => this.closeAreaPopup()}><ha-icon icon="mdi:close"></ha-icon></button>
          </header>
          <div class="area-detail-content">
            ${this.renderAreaContent(area)}
            ${this.renderAreaPopupSubareas(area, discovery.areas)}
          </div>
        </section>
      </dialog>
    `;
  }

  /** Renders the full configured Area subtree inside a parent Area dialog. */
  private renderAreaPopupSubareas(parent: OverviewArea, areas: OverviewArea[]) {
    const { children } = buildOverviewAreaHierarchy(areas);
    const visited = new Set<string>([parent.id]);
    const renderChildren = (area: OverviewArea): unknown => {
      const nested = (children.get(area.id) ?? []).filter((child) => !visited.has(child.id));
      if (!nested.length) return nothing;
      for (const child of nested) visited.add(child.id);
      return html`
        <div class="area-popup-subareas" role="group" aria-label=${`${this.localText("תתי אזורים של", "Sub-areas of")} ${area.name}`}>
          ${nested.map((child) => {
            const activeCount = child.allEntities.filter(countsTowardAreaActivity).length;
            const safeChildId = child.id.replace(/[^a-zA-Z0-9_-]/g, "-");
            const headingId = `area-popup-subarea-${safeChildId}`;
            const contentId = `${headingId}-content`;
            const expanded = this.isPopupSubareaExpanded(child);
            return html`
              <section class="area-popup-subarea ${activeCount ? "has-active" : "all-off"} ${expanded ? "expanded" : "collapsed"}" aria-labelledby=${headingId}>
                <button
                  class="area-popup-subarea-toggle"
                  type="button"
                  aria-expanded=${expanded}
                  aria-controls=${contentId}
                  aria-label=${`${expanded ? this.localText("כיווץ תת־אזור", "Collapse sub-area") : this.localText("פתיחת תת־אזור", "Expand sub-area")}: ${child.name}`}
                  @click=${(event: Event) => this.togglePopupSubarea(event, child)}
                >
                  <span class="icon-bubble small"><ha-icon icon=${child.icon}></ha-icon></span>
                  <span class="area-popup-subarea-heading">
                    <strong id=${headingId}>${child.name}</strong>
                    <small>${activeCount
                      ? `${activeCount} ${this.localText("פעילים", "active")}`
                      : this.localText("הכול כבוי", "All off")}</small>
                  </span>
                  <ha-icon class="area-popup-subarea-chevron" icon="mdi:chevron-down" aria-hidden="true"></ha-icon>
                </button>
                <div class="area-popup-subarea-disclosure" id=${contentId} ?hidden=${!expanded}>
                  <div class="area-popup-subarea-content">${this.renderAreaContent(child)}</div>
                  ${renderChildren(child)}
                </div>
              </section>
            `;
          })}
        </div>
      `;
    };
    return renderChildren(parent);
  }

  private floorQuickArea(discovery: OverviewDiscovery): OverviewArea {
    const uniqueEntities = new Map<string, OverviewEntity>();
    for (const area of discovery.areas) {
      for (const item of area.allEntities) uniqueEntities.set(item.entityId, item);
    }
    return {
      id: FLOOR_QUICK_AREA_ID,
      name: discovery.targetName,
      icon: discovery.targetIcon,
      showWhenParentCollapsed: false,
      sections: [],
      allEntities: [...uniqueEntities.values()],
      temperatureMode: "none",
      occupancy: "none",
      occupancyCountSource: "none",
      occupancyEntities: [],
    };
  }

  private renderQuickPopupEntity(item: OverviewEntity, action: OverviewQuickActionKind, groupPending: boolean) {
    if (action === "covers") return this.renderQuickPopupCoverEntity(item, groupPending);
    const busy = this.entityBusy(item);
    const turnOn = !item.powered;
    const plan = quickActionEntityService(action, item, turnOn);
    const disabled = !item.available || busy || groupPending || !plan;
    const actionLabel = turnOn ? this.localText("הפעלה", "Turn on") : this.localText("כיבוי", "Turn off");
    const disabledReason = !item.available
        ? overviewText(this.hass, this.config!, "unavailable")
        : !plan
          ? this.localText("אין פעולת שליטה נתמכת", "No supported control action")
          : "";
    return html`
      <article class="quick-popup-entity ${item.powered ? "active" : "inactive"} ${item.available ? "" : "unavailable"}" role="listitem">
        <button
          class="quick-popup-entity-main hold-target"
          type="button"
          title=${this.localText("לחיצה או לחיצה ארוכה לפרטים נוספים", "Tap or hold for more information")}
          @pointerdown=${(event: PointerEvent) => this.startHold(event, item)}
          @pointermove=${(event: PointerEvent) => this.moveHold(event)}
          @pointerup=${(event: PointerEvent) => this.finishHold(event)}
          @pointercancel=${() => this.cancelHold()}
          @pointerleave=${() => this.cancelHold()}
          @click=${(event: Event) => this.handleMoreInfoClick(event, item)}
        >
          <span class="icon-bubble small"><ha-icon icon=${item.icon}></ha-icon></span>
          <span class="entity-main">
            <span class="entity-name">${item.name}</span>
            <span class="state-text">${this.entitySecondary(item)}${item.protected ? ` · ${this.localText("מוגן מקבוצה", "group protected")}` : ""}</span>
          </span>
        </button>
        <button
          class="quick-popup-entity-toggle ${item.powered ? "active" : ""}"
          type="button"
          aria-pressed=${item.powered}
          aria-busy=${busy}
          aria-label=${disabledReason || `${actionLabel}: ${item.name}`}
          title=${disabledReason || `${actionLabel}: ${item.name}`}
          ?disabled=${disabled}
          @click=${(event: Event) => this.handleQuickPopupEntityAction(event, item, action)}
        ><ha-icon icon=${busy ? "mdi:loading" : "mdi:power"}></ha-icon></button>
      </article>
    `;
  }

  private renderQuickPopupCoverEntity(item: OverviewEntity, _groupPending: boolean) {
    const busy = this.coverBusy(item);
    const position = coverPosition(item.entity);
    const assumedState = item.entity.attributes.assumed_state === true;
    const moving = ["opening", "closing"].includes(item.entity.state.toLowerCase());
    const services = [
      { service: "open_cover", icon: "mdi:arrow-up" },
      { service: "stop_cover", icon: "mdi:stop" },
      { service: "close_cover", icon: "mdi:arrow-down" },
    ] as const;
    const supportedServices = services.filter(({ service }) => coverSupportsService(item.entity, service));
    return html`
      <article class="quick-popup-entity quick-popup-cover-entity ${item.powered ? "active" : "inactive"} ${item.available ? "" : "unavailable"}" role="listitem">
        <button
          class="quick-popup-entity-main hold-target"
          type="button"
          title=${this.localText("לחיצה או לחיצה ארוכה לפרטים נוספים", "Tap or hold for more information")}
          @pointerdown=${(event: PointerEvent) => this.startHold(event, item)}
          @pointermove=${(event: PointerEvent) => this.moveHold(event)}
          @pointerup=${(event: PointerEvent) => this.finishHold(event)}
          @pointercancel=${() => this.cancelHold()}
          @pointerleave=${() => this.cancelHold()}
          @click=${(event: Event) => this.handleMoreInfoClick(event, item)}
        >
          <span class="icon-bubble small"><ha-icon icon=${item.icon}></ha-icon></span>
          <span class="entity-main">
            <span class="entity-name">${item.name}</span>
            <span class="state-text">${this.entitySecondary(item)}${item.protected ? ` · ${this.localText("מוגן מקבוצה", "group protected")}` : ""}</span>
          </span>
        </button>
        <span class="quick-popup-cover-controls" role="group" aria-label=${`${this.localText("שליטה בתריס", "Cover controls")}: ${item.name}`}>
          ${supportedServices.map(({ service, icon }) => {
            const commandPending = this.coverCommandPending(item.entityId, service);
            const disabled = !item.available || commandPending || coverControlDisabled(
              service,
              item.entity.state,
              position,
              assumedState,
            );
            return html`<button
              class="quick-popup-cover-control ${service === "stop_cover" && !moving ? "idle-stop" : ""}"
              type="button"
              aria-busy=${commandPending}
              aria-label=${`${this.coverServiceLabel(service)}: ${item.name}`}
              title=${`${this.coverServiceLabel(service)}: ${item.name}`}
              ?disabled=${disabled}
              @click=${(event: Event) => this.runEntityService(event, item, service)}
            ><ha-icon icon=${commandPending ? "mdi:loading" : icon}></ha-icon></button>`;
          })}
        </span>
      </article>
    `;
  }

  private renderEntity(item: OverviewEntity, section: OverviewSection["id"]) {
    if (section === "floor_heating") return this.renderFloorHeating(item);
    if (item.domain === "climate") return this.renderClimate(item);
    if (item.domain === "cover") return this.renderCover(item);
    if (item.domain === "media_player") return this.renderMedia(item);
    if (supportsLightBrightness(item)) return this.renderLight(item);
    return this.renderToggle(item);
  }

  private renderEntityLead(item: OverviewEntity) {
    const presentation = this.entityPresentation(item);
    return html`
      <button
        class="entity-lead hold-target"
        type="button"
        title=${this.localText("לחיצה ארוכה לפרטים נוספים", "Hold for more information")}
        @pointerdown=${(event: PointerEvent) => this.startHold(event, item)}
        @pointermove=${(event: PointerEvent) => this.moveHold(event)}
        @pointerup=${(event: PointerEvent) => this.finishHold(event)}
        @pointercancel=${() => this.cancelHold()}
        @pointerleave=${() => this.cancelHold()}
        @click=${(event: Event) => this.handleMoreInfoClick(event, item)}
      >
        <span class="icon-bubble small"><ha-icon icon=${item.icon}></ha-icon></span>
          <span class="entity-main">
            <span class="entity-name">${item.name}</span>
            ${presentation.showState ? html`<span class="state-text">${this.entitySecondary(item)}</span>` : nothing}
          </span>
      </button>
    `;
  }

  private renderToggle(item: OverviewEntity) {
    const busy = this.entityBusy(item);
    const powerPlan = entityPowerService(item, !item.powered);
    const toggleDisabled = !item.available || busy || !powerPlan;
    const presentation = this.entityPresentation(item);
    const compactAuxiliary = this.isCompactAuxiliary(item);
    return html`
      <button
        class="toggle-tile entity-card hold-target tile-shape-${presentation.shape} tile-icon-${presentation.iconPosition} ${compactAuxiliary ? "compact-auxiliary" : ""} ${item.active ? "active" : ""} ${item.available ? "" : "unavailable"}"
        type="button"
        aria-pressed=${item.powered}
        aria-busy=${busy}
        aria-disabled=${toggleDisabled}
        aria-label=${`${item.name}: ${this.entitySecondary(item)}. ${this.localText("לחיצה ארוכה לפרטים נוספים", "Hold for more information")}`}
        title=${`${item.active ? overviewText(this.hass, this.config!, "turn_off") : overviewText(this.hass, this.config!, "on")} · ${this.localText("לחיצה ארוכה לפרטים", "hold for details")}`}
        @pointerdown=${(event: PointerEvent) => this.startHold(event, item)}
        @pointermove=${(event: PointerEvent) => this.moveHold(event)}
        @pointerup=${(event: PointerEvent) => this.finishHold(event)}
        @pointercancel=${() => this.cancelHold()}
        @pointerleave=${() => this.cancelHold()}
        @click=${(event: Event) => this.handleToggleClick(event, item)}
      >
        <span class="icon-bubble small"><ha-icon icon=${busy ? "mdi:loading" : item.icon}></ha-icon></span>
        <span class="entity-main">
          <span class="entity-name">${item.name}</span>
          ${presentation.showState ? html`<span class="state-text">${this.entitySecondary(item)}</span>` : nothing}
        </span>
      </button>
    `;
  }

  private renderClimate(item: OverviewEntity) {
    const current = numberAttribute(item, "current_temperature");
    const unit = this.areaTemperatureUnit(item);
    const step = climateTemperatureStep(item, unit);
    const targets = this.displayedClimateTargets(item);
    const target = targets.temperature;
    const rangeLow = targets.low;
    const rangeHigh = targets.high;
    // Match Home Assistant's thermostat control: prefer a valid single target
    // when an integration exposes both capability bits and attributes.
    const hasRange = target === undefined && rangeLow !== undefined && rangeHigh !== undefined;
    const modes = climateModes(item);
    const fanModes = supportsEntityFeature(item.entity, CLIMATE_FEATURES.FAN_MODE) && Array.isArray(item.entity.attributes.fan_modes)
      ? item.entity.attributes.fan_modes.map(String)
      : [];
    const busy = this.entityBusy(item);
    const modeIcon = this.climateModeIcon(item.entity.state);
    const modePresentation = this.config?.climate_mode_presentation ?? "both";
    const currentFanMode = String(item.entity.attributes.fan_mode ?? "");
    return html`
      <article class="climate-card entity-card full-span mode-${item.entity.state} ${item.active ? "active" : ""} ${item.available ? "" : "unavailable"}" aria-busy=${busy}>
        <div class="climate-primary">
          ${this.renderEntityLead(item)}
          ${!hasRange && target !== undefined
            ? html`
                <span class="temperature-stepper">
                  <button type="button" ?disabled=${busy || !item.available} @click=${() => this.setClimateTemperature(item, target - step)} aria-label=${`${this.localText("הורדת טמפרטורה", "Decrease temperature")}: ${item.name}`}>−</button>
                  <span>${this.formatTemperature(target, unit)}</span>
                  <button type="button" ?disabled=${busy || !item.available} @click=${() => this.setClimateTemperature(item, target + step)} aria-label=${`${this.localText("העלאת טמפרטורה", "Increase temperature")}: ${item.name}`}>+</button>
                </span>
              `
            : current !== undefined
              ? html`<span class="temperature current-temperature">${this.formatTemperature(current, unit)}</span>`
              : nothing}
        </div>
        ${hasRange ? this.renderClimateRange(item, rangeLow, rangeHigh, step, busy) : nothing}
        ${modes.length || fanModes.length
          ? html`<div class="climate-secondary" @click=${(event: Event) => event.stopPropagation()}>
          ${modes.length
            ? html`<div class="climate-mode-control presentation-${modePresentation}"><ha-control-select-menu
                class="mode-select"
                show-arrow
                hide-label
                .label=${`${this.localText("מצב מיזוג", "HVAC mode")}: ${item.name}`}
                .value=${item.entity.state}
                .disabled=${busy || !item.available}
                .options=${modes.map((mode) => ({ value: mode, label: this.climateModeLabel(mode), icon: this.climateModeIcon(mode) }))}
                @wa-select=${(event: Event) => this.setClimateMode(item, event)}
              >${modePresentation !== "text" ? html`<ha-icon slot="icon" icon=${modeIcon}></ha-icon>` : nothing}</ha-control-select-menu>
              ${modePresentation !== "icon" ? html`<span class="climate-mode-value">${this.climateModeLabel(item.entity.state)}</span>` : nothing}
              </div>`
            : nothing}
          ${fanModes.length
            ? html`<div class="climate-mode-control presentation-${modePresentation}"><ha-control-select-menu
                class="mode-select"
                show-arrow
                hide-label
                .label=${`${this.localText("מהירות מאוורר", "Fan mode")}: ${item.name}`}
                .value=${currentFanMode}
                .disabled=${busy || !item.available}
                .options=${fanModes.map((mode) => ({ value: mode, label: this.modeLabel(mode), icon: "mdi:fan" }))}
                @wa-select=${(event: Event) => this.setFanMode(item, event)}
              >${modePresentation !== "text" ? html`<ha-icon slot="icon" icon="mdi:fan"></ha-icon>` : nothing}</ha-control-select-menu>
              ${modePresentation !== "icon" ? html`<span class="climate-mode-value">${currentFanMode ? this.modeLabel(currentFanMode) : this.localText("לא ידוע", "Unknown")}</span>` : nothing}
              </div>`
            : nothing}
          </div>`
          : nothing}
      </article>
    `;
  }

  private renderLight(item: OverviewEntity) {
    const busy = this.entityBusy(item);
    const brightness = lightBrightnessPercentage(item);
    const powerPlan = entityPowerService(item, !item.powered);
    const brightnessLabel = `${this.localText("בהירות", "Brightness")}: ${item.name}`;
    const presentation = this.entityPresentation(item);
    return html`
      <article class="light-card dimmer-card ${item.powered ? "dimmer-on" : "dimmer-off"} entity-card tile-shape-${presentation.shape} tile-icon-${presentation.iconPosition} ${item.active ? "active" : ""} ${item.available ? "" : "unavailable"}" aria-busy=${busy}>
        <div class="light-primary">
          ${this.renderEntityLead(item)}
          <button
            class="light-power ${item.powered ? "active" : ""}"
            type="button"
            aria-pressed=${item.powered}
            aria-label=${`${item.powered ? overviewText(this.hass, this.config!, "turn_off") : overviewText(this.hass, this.config!, "on")}: ${item.name}`}
            ?disabled=${busy || !item.available || !powerPlan}
            @click=${(event: Event) => this.toggleEntity(event, item)}
          ><ha-icon icon=${busy ? "mdi:loading" : "mdi:power"}></ha-icon></button>
        </div>
        ${item.powered ? html`<div class="brightness-control" @click=${(event: Event) => event.stopPropagation()}>
          <ha-control-slider
            class="brightness-slider"
            .value=${brightness}
            .min=${0}
            .max=${100}
            .step=${1}
            .disabled=${busy || !item.available}
            .locale=${this.hass?.locale}
            .label=${brightnessLabel}
            unit="%"
            show-handle
            tooltip-mode="interaction"
            @value-changed=${(event: Event) => this.setLightBrightness(item, event)}
          ></ha-control-slider>
          <span class="brightness-value" aria-hidden="true">${brightness}%</span>
        </div>` : nothing}
      </article>
    `;
  }

  private renderClimateRange(item: OverviewEntity, low: number, high: number, step: number, busy: boolean) {
    return html`
      <div class="temperature-range" role="group" aria-label=${`${this.localText("טווח טמפרטורה", "Temperature range")}: ${item.name}`}>
        <span class="temperature-stepper range-stepper">
          <button type="button" ?disabled=${busy || !item.available} @click=${() => this.setClimateRange(item, low - step, high, "low")} aria-label=${`${this.localText("הורדת סף תחתון", "Decrease low target")}: ${item.name}`}>−</button>
          <span><small>${this.localText("נמוך", "Low")}</small>${this.formatTemperature(low, this.areaTemperatureUnit(item))}</span>
          <button type="button" ?disabled=${busy || !item.available} @click=${() => this.setClimateRange(item, low + step, high, "low")} aria-label=${`${this.localText("העלאת סף תחתון", "Increase low target")}: ${item.name}`}>+</button>
        </span>
        <span class="temperature-stepper range-stepper">
          <button type="button" ?disabled=${busy || !item.available} @click=${() => this.setClimateRange(item, low, high - step, "high")} aria-label=${`${this.localText("הורדת סף עליון", "Decrease high target")}: ${item.name}`}>−</button>
          <span><small>${this.localText("גבוה", "High")}</small>${this.formatTemperature(high, this.areaTemperatureUnit(item))}</span>
          <button type="button" ?disabled=${busy || !item.available} @click=${() => this.setClimateRange(item, low, high + step, "high")} aria-label=${`${this.localText("העלאת סף עליון", "Increase high target")}: ${item.name}`}>+</button>
        </span>
      </div>
    `;
  }

  private renderFloorHeating(item: OverviewEntity) {
    const targetFeature = item.domain === "water_heater"
      ? WATER_HEATER_FEATURES.TARGET_TEMPERATURE
      : CLIMATE_FEATURES.TARGET_TEMPERATURE;
    const unit = this.areaTemperatureUnit(item);
    const climateTargets = item.domain === "climate" ? this.displayedClimateTargets(item) : undefined;
    const target = climateTargets?.temperature ?? (supportsEntityFeature(item.entity, targetFeature) ? numberAttribute(item, "temperature") : undefined);
    const rangeLow = climateTargets?.low;
    const rangeHigh = climateTargets?.high;
    const hasRange = target === undefined && rangeLow !== undefined && rangeHigh !== undefined;
    const current = numberAttribute(item, "current_temperature");
    if (target === undefined && current === undefined && !hasRange) return this.renderToggle(item);
    const step = climateTemperatureStep(item, unit);
    const busy = this.entityBusy(item);
    const powerPlan = entityPowerService(item, !item.powered);
    return html`
      <article class="thermostat-card entity-card full-span ${item.active ? "active" : ""} ${item.available ? "" : "unavailable"}" aria-busy=${busy}>
        <div class="thermostat-primary">
          ${this.renderEntityLead(item)}
          ${target !== undefined
            ? html`<span class="temperature-stepper">
                <button type="button" ?disabled=${busy || !item.available} @click=${() => this.setClimateTemperature(item, target - step)} aria-label=${`${this.localText("הורדת טמפרטורה", "Decrease temperature")}: ${item.name}`}>−</button>
                <span>${this.formatTemperature(target, unit)}</span>
                <button type="button" ?disabled=${busy || !item.available} @click=${() => this.setClimateTemperature(item, target + step)} aria-label=${`${this.localText("העלאת טמפרטורה", "Increase temperature")}: ${item.name}`}>+</button>
              </span>`
            : current !== undefined
              ? html`<span class="temperature current-temperature">${this.formatTemperature(current, unit)}</span>`
              : nothing}
        </div>
        ${hasRange ? this.renderClimateRange(item, rangeLow, rangeHigh, step, busy) : nothing}
        <button
          class="thermostat-power ${item.powered ? "active" : ""}"
          type="button"
          aria-pressed=${item.powered}
          aria-label=${`${item.powered ? overviewText(this.hass, this.config!, "turn_off") : overviewText(this.hass, this.config!, "on")}: ${item.name}`}
          ?disabled=${busy || !item.available || !powerPlan}
          @click=${(event: Event) => this.toggleEntity(event, item)}
        ><ha-icon icon=${busy ? "mdi:loading" : "mdi:power"}></ha-icon></button>
      </article>
    `;
  }

  private renderCover(item: OverviewEntity) {
    const busy = this.coverBusy(item);
    const position = coverPosition(item.entity);
    const state = item.entity.state;
    const assumedState = item.entity.attributes.assumed_state === true;
    const moving = ["opening", "closing"].includes(state.toLowerCase());
    const services = [
      { service: "open_cover", icon: "mdi:arrow-up" },
      { service: "stop_cover", icon: "mdi:stop" },
      { service: "close_cover", icon: "mdi:arrow-down" },
    ].filter(({ service }) => coverSupportsService(item.entity, service as "open_cover" | "stop_cover" | "close_cover"));
    return html`
      <article class="cover-card entity-card ${item.active ? "active" : ""} ${item.available ? "" : "unavailable"}" aria-busy=${busy}>
        ${this.renderEntityLead(item)}
        <span class="cover-controls" role="group" aria-label=${`${this.localText("שליטה בתריס", "Cover controls")}: ${item.name}`}>
          ${services.map(({ service, icon }) => {
            const commandPending = this.coverCommandPending(item.entityId, service as CoverControlService);
            return html`
              <button
                class="cover-control ${service === "stop_cover" && !moving ? "idle-stop" : ""}"
                type="button"
                aria-busy=${commandPending}
                ?disabled=${!item.available || commandPending || coverControlDisabled(service as CoverControlService, state, position, assumedState)}
                @click=${(event: Event) => this.runEntityService(event, item, service)}
                aria-label=${`${this.coverServiceLabel(service)}: ${item.name}`}
              ><ha-icon icon=${commandPending ? "mdi:loading" : icon}></ha-icon></button>
            `;
          })}
        </span>
      </article>
    `;
  }

  private renderMedia(item: OverviewEntity) {
    const busy = this.entityBusy(item);
    const playing = item.entity.state === "playing";
    const volume = numberAttribute(item, "volume_level");
    const canSetVolume = volume !== undefined && supportsEntityFeature(item.entity, MEDIA_FEATURES.VOLUME_SET);
    const canPlayPause = supportsEntityFeature(item.entity, playing ? MEDIA_FEATURES.PAUSE : MEDIA_FEATURES.PLAY);
    const powerPlan = entityPowerService(item, !item.powered);
    return html`
      <article class="media-card entity-card full-span ${item.active ? "active" : ""} ${item.available ? "" : "unavailable"}" aria-busy=${busy}>
        ${this.renderEntityLead(item)}
        <div class="media-controls">
          ${canSetVolume
            ? html`
                <button class="control-button" type="button" ?disabled=${busy || !item.available} @click=${(event: Event) => this.setMediaVolume(event, item, volume - 0.05)} aria-label=${`${this.localText("הנמכת עוצמה", "Volume down")}: ${item.name}`}><ha-icon icon="mdi:volume-minus"></ha-icon></button>
                <span class="secondary">${Math.round(volume * 100)}%</span>
                <button class="control-button" type="button" ?disabled=${busy || !item.available} @click=${(event: Event) => this.setMediaVolume(event, item, volume + 0.05)} aria-label=${`${this.localText("הגברת עוצמה", "Volume up")}: ${item.name}`}><ha-icon icon="mdi:volume-plus"></ha-icon></button>
              `
            : nothing}
          ${canPlayPause
            ? html`<button class="control-button ${playing ? "active" : ""}" type="button" ?disabled=${busy || !item.available} @click=${(event: Event) => this.runEntityService(event, item, playing ? "media_pause" : "media_play")} aria-label=${`${this.localText(playing ? "השהיה" : "ניגון", playing ? "Pause" : "Play")}: ${item.name}`}><ha-icon icon=${playing ? "mdi:pause" : "mdi:play"}></ha-icon></button>`
            : nothing}
          ${powerPlan
            ? html`<button class="control-button" type="button" ?disabled=${busy || !item.available} @click=${(event: Event) => this.toggleEntity(event, item)} aria-label=${`${item.powered ? overviewText(this.hass, this.config!, "turn_off") : overviewText(this.hass, this.config!, "on")}: ${item.name}`}><ha-icon icon="mdi:power"></ha-icon></button>`
            : nothing}
        </div>
      </article>
    `;
  }

  private entitySecondary(item: OverviewEntity): string {
    if (!item.available) return overviewText(this.hass, this.config!, "unavailable");
    const binaryState = String(item.entity.state).toLowerCase();
    const binaryLabel = binaryState === "on" || binaryState === "off" ? this.binaryStateLabel(binaryState, item) : undefined;
    if (this.isCompactAuxiliary(item)) {
      const elapsed = item.powered ? this.elapsedSince(item.entity.last_changed) : undefined;
      return [binaryLabel ?? item.entity.state, elapsed].filter(Boolean).join(" · ");
    }
    if (item.domain === "climate") {
      const current = numberAttribute(item, "current_temperature");
      const action = String(item.entity.attributes.hvac_action ?? item.entity.state).replace(/_/g, " ");
      return [action, current !== undefined ? this.formatTemperature(current, this.areaTemperatureUnit(item)) : ""].filter(Boolean).join(" · ");
    }
    if (item.domain === "cover") {
      const position = coverPosition(item.entity);
      return position !== undefined ? `${item.entity.state} · ${Math.round(position)}%` : item.entity.state;
    }
    if (item.domain === "light") {
      const brightness = numberAttribute(item, "brightness");
      return brightness !== undefined && item.active ? `${binaryLabel ?? item.entity.state} · ${Math.round((brightness / 255) * 100)}%` : binaryLabel ?? item.entity.state;
    }
    if (item.domain === "media_player") {
      return String(item.entity.attributes.media_title ?? item.entity.attributes.source ?? item.entity.state);
    }
    if (item.section === "floor_heating") {
      const current = numberAttribute(item, "current_temperature");
      return [binaryLabel ?? item.entity.state, current !== undefined ? this.formatTemperature(current, this.areaTemperatureUnit(item)) : ""].filter(Boolean).join(" · ");
    }
    return binaryLabel ?? this.hass?.formatEntityState?.(item.entity) ?? item.entity.state;
  }

  private isCompactAuxiliary(item: OverviewEntity): boolean {
    return item.domain === "fan" ||
      (item.section === "climate" && ["switch", "input_boolean"].includes(item.domain)) ||
      (item.section === "floor_heating" && ["switch", "input_boolean"].includes(item.domain));
  }

  private elapsedSince(timestamp: string): string | undefined {
    const started = Date.parse(timestamp);
    if (!Number.isFinite(started)) return undefined;
    const totalMinutes = Math.max(0, Math.floor((Date.now() - started) / 60_000));
    if (totalMinutes < 1) return this.localText("פחות מדקה", "less than a minute");
    const days = Math.floor(totalMinutes / 1_440);
    const hours = Math.floor((totalMinutes % 1_440) / 60);
    const minutes = totalMinutes % 60;
    if (days > 0) return this.localText(`${days} י׳ ${hours} ש׳`, `${days}d ${hours}h`);
    if (hours > 0) return this.localText(`${hours} ש׳ ${minutes} דק׳`, `${hours}h ${minutes}m`);
    return this.localText(`${minutes} דק׳`, `${minutes}m`);
  }

  private entityPresentation(item: OverviewEntity) {
    const override = this.config?.entity_overrides[item.entityId];
    const isLightTile = item.section === "lights_switches";
    return {
      shape: override?.tile_shape ?? (isLightTile ? this.config?.light_tile_shape : "rectangle") ?? "rectangle",
      iconPosition: override?.icon_position ?? (isLightTile ? this.config?.light_icon_position : "start") ?? "start",
      showState: override?.show_state ?? (isLightTile ? this.config?.light_show_state : true) ?? true,
    };
  }

  private binaryStateLabel(state: "on" | "off", item: OverviewEntity): string {
    const configured = this.config?.entity_overrides[item.entityId]?.state_language ?? this.config?.entity_state_language ?? "auto";
    const language = configured === "auto"
      ? (this.config && overviewLanguage(this.hass, this.config) === "he" ? "he" : "en")
      : configured;
    if (language === "he") return state === "on" ? "דלוק" : "כבוי";
    return state === "on" ? "On" : "Off";
  }

  private climateModeIcon(mode: string): string {
    if (mode === "cool") return "mdi:snowflake";
    if (mode === "heat") return "mdi:fire";
    if (mode === "dry") return "mdi:water-percent";
    if (mode === "fan_only") return "mdi:fan";
    if (mode === "heat_cool" || mode === "auto") return "mdi:autorenew";
    return "mdi:power";
  }

  private climateModeLabel(mode: string): string {
    const labels: Record<string, [string, string]> = {
      off: ["כבוי", "Off"],
      auto: ["אוטומטי", "Auto"],
      cool: ["קירור", "Cool"],
      heat: ["חימום", "Heat"],
      dry: ["ייבוש", "Dry"],
      fan_only: ["מאוורר בלבד", "Fan only"],
      heat_cool: ["חימום וקירור", "Heat/Cool"],
    };
    const label = labels[mode];
    return label ? this.localText(label[0], label[1]) : this.modeLabel(mode);
  }

  private modeLabel(mode: string): string {
    return mode.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
  }

  private coverServiceLabel(service: string): string {
    if (service === "open_cover") return this.localText("פתיחה", "Open");
    if (service === "stop_cover") return this.localText("עצירה", "Stop");
    return this.localText("סגירה", "Close");
  }

  private localText(hebrew: string, english: string): string {
    return this.config && overviewLanguage(this.hass, this.config) === "he" ? hebrew : english;
  }

  private areaTemperatureUnit(item: OverviewEntity): string {
    return String(item.entity.attributes.temperature_unit ?? this.hass?.config?.unit_system?.temperature ?? "°C");
  }

  private formatTemperature(value: number, unit = "°C"): string {
    const locale = this.config && overviewLanguage(this.hass, this.config) === "he" ? "he-IL" : undefined;
    return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(value)} ${unit}`;
  }

  private renderEmpty(message: string, icon: string) {
    return html`<div class="empty"><ha-icon icon=${icon}></ha-icon><span>${message}</span></div>`;
  }

  private isExpanded(area: OverviewArea): boolean {
    if (this.areaOpenMode(area) === "popup") return false;
    const override = this.config?.area_overrides[area.id] ?? this.config?.area_overrides[area.name];
    return this.expanded[area.id] ?? override?.default_expanded ?? this.config?.default_expanded ?? false;
  }

  private isPopupSubareaExpanded(area: OverviewArea): boolean {
    const key = `popup-subarea:${area.id}`;
    const override = this.config?.area_overrides[area.id] ?? this.config?.area_overrides[area.name];
    return this.expanded[key] ?? override?.default_expanded ?? true;
  }

  private togglePopupSubarea(event: Event, area: OverviewArea): void {
    event.stopPropagation();
    const key = `popup-subarea:${area.id}`;
    this.expanded = { ...this.expanded, [key]: !this.isPopupSubareaExpanded(area) };
    if (this.config?.remember_expanded_state) this.writeExpanded();
  }

  private areaOpenMode(area: OverviewArea): "expander" | "popup" {
    const override = this.config?.area_overrides[area.id] ?? this.config?.area_overrides[area.name];
    return override?.open_mode ?? this.config?.area_open_mode ?? "expander";
  }

  private activateArea(event: Event, area: OverviewArea): void {
    if (this.areaOpenMode(area) === "popup") this.openAreaPopup(event, area);
    else this.toggleArea(area);
  }

  private handleAreaSummaryClick(event: MouseEvent, area: OverviewArea): void {
    const target = event.target as HTMLElement | null;
    if (target?.closest("button, a, input, select, textarea, [role='button']")) return;
    this.activateArea(event, area);
  }

  private toggleArea(area: OverviewArea): void {
    this.expanded = { ...this.expanded, [area.id]: !this.isExpanded(area) };
    if (this.config?.remember_expanded_state) this.writeExpanded();
    void this.updateComplete.then(() => this.dispatchEvent(new Event("iron-resize", { bubbles: true, composed: true })));
  }

  private toggleFloor(): void {
    this.floorExpanded = !this.floorExpanded;
    if (this.config?.remember_expanded_state) this.writeFloorExpanded();
    void this.updateComplete.then(() => this.dispatchEvent(new Event("iron-resize", { bubbles: true, composed: true })));
  }

  private startHold(event: PointerEvent, item: OverviewEntity): void {
    if (event.button !== 0) return;
    this.cancelHold();
    this.holdPointerId = event.pointerId;
    this.holdEntityId = item.entityId;
    this.holdStart = { x: event.clientX, y: event.clientY };
    this.holdTarget = event.currentTarget as HTMLElement;
    this.holdTarget.classList.add("holding");
    this.holdTimer = window.setTimeout(() => {
      if (this.holdEntityId !== item.entityId) return;
      this.holdTimer = undefined;
      this.suppressClickEntityId = item.entityId;
      this.suppressClickUntil = Date.now() + 1_500;
      this.holdTarget?.classList.remove("holding");
      this.showMoreInfo(item);
      try {
        navigator.vibrate?.(18);
      } catch {
        // Vibration is optional and may be blocked by the browser.
      }
    }, 500);
  }

  private moveHold(event: PointerEvent): void {
    if (event.pointerId !== this.holdPointerId || !this.holdStart) return;
    if (Math.hypot(event.clientX - this.holdStart.x, event.clientY - this.holdStart.y) > 8) this.cancelHold();
  }

  private finishHold(event: PointerEvent): void {
    if (event.pointerId !== this.holdPointerId) return;
    this.clearHoldTracking();
  }

  private cancelHold(): void {
    this.clearHoldTracking();
  }

  private clearHoldTracking(): void {
    if (this.holdTimer !== undefined) window.clearTimeout(this.holdTimer);
    this.holdTarget?.classList.remove("holding");
    this.holdTimer = undefined;
    this.holdPointerId = undefined;
    this.holdEntityId = undefined;
    this.holdStart = undefined;
    this.holdTarget = undefined;
  }

  private consumeHeldClick(event: Event, item: OverviewEntity): boolean {
    const shouldSuppress = this.suppressClickEntityId === item.entityId && Date.now() <= this.suppressClickUntil;
    this.suppressClickEntityId = undefined;
    this.suppressClickUntil = 0;
    if (!shouldSuppress) return false;
    event.preventDefault();
    event.stopPropagation();
    return true;
  }

  private handleMoreInfoClick(event: Event, item: OverviewEntity): void {
    event.stopPropagation();
    if (!this.consumeHeldClick(event, item)) this.showMoreInfo(item);
  }

  private handleToggleClick(event: Event, item: OverviewEntity): void {
    if (this.consumeHeldClick(event, item)) return;
    if (!item.available || this.entityBusy(item) || !entityPowerService(item, !item.powered)) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    this.toggleEntity(event, item);
  }

  private quickActionPending(areaId: string, action: OverviewQuickActionKind): boolean {
    return this.pendingActions.has(`${areaId}:${action}:on`) || this.pendingActions.has(`${areaId}:${action}:off`);
  }

  private openFloorPopup(event: Event): void {
    event.stopPropagation();
    this.resetQuickPopup();
    this.resetAreaPopup();
    this.floorPopupTrigger = event.currentTarget as HTMLElement;
    this.floorPopupOpen = true;
    void this.updateComplete.then(() => {
      const dialog = this.renderRoot.querySelector<HTMLDialogElement>(".floor-action-dialog");
      if (!dialog || dialog.open || !dialog.isConnected) return;
      if (typeof dialog.showModal === "function") dialog.showModal();
      else dialog.setAttribute("open", "");
    });
  }

  private closeFloorPopup(): void {
    const dialog = this.renderRoot.querySelector<HTMLDialogElement>(".floor-action-dialog");
    if (dialog?.open && typeof dialog.close === "function") dialog.close();
    else this.handleFloorPopupClosed();
  }

  private handleFloorPopupClosed(): void {
    this.floorPopupOpen = false;
    const trigger = this.floorPopupTrigger;
    this.floorPopupTrigger = undefined;
    void this.updateComplete.then(() => {
      if (trigger?.isConnected) trigger.focus();
    });
  }

  private resetFloorPopup(): void {
    const dialog = this.renderRoot?.querySelector<HTMLDialogElement>(".floor-action-dialog");
    if (dialog?.open && typeof dialog.close === "function") dialog.close();
    this.floorPopupOpen = false;
    this.floorPopupTrigger = undefined;
  }

  private openAreaPopup(event: Event, area: OverviewArea): void {
    event.stopPropagation();
    this.resetQuickPopup();
    this.resetFloorPopup();
    this.areaPopupTrigger = event.currentTarget as HTMLElement;
    this.areaPopupMoreInfo = undefined;
    this.restoreAreaPopupFocus = true;
    this.areaPopupId = area.id;
    void this.updateComplete.then(() => {
      const dialog = this.renderRoot.querySelector<HTMLDialogElement>(".area-detail-dialog");
      if (!dialog || dialog.open || !dialog.isConnected) return;
      if (typeof dialog.showModal === "function") dialog.showModal();
      else dialog.setAttribute("open", "");
    });
  }

  private closeAreaPopup(restoreFocus = true, moreInfo?: OverviewEntity): void {
    this.restoreAreaPopupFocus = restoreFocus;
    this.areaPopupMoreInfo = moreInfo;
    const dialog = this.renderRoot.querySelector<HTMLDialogElement>(".area-detail-dialog");
    if (dialog?.open && typeof dialog.close === "function") dialog.close();
    else this.handleAreaPopupClosed();
  }

  private handleAreaPopupClosed(): void {
    const moreInfo = this.areaPopupMoreInfo;
    const restoreFocus = this.restoreAreaPopupFocus;
    const trigger = this.areaPopupTrigger;
    this.areaPopupId = undefined;
    this.areaPopupTrigger = undefined;
    this.areaPopupMoreInfo = undefined;
    this.restoreAreaPopupFocus = true;
    void this.updateComplete.then(() => {
      if (moreInfo) this.moreInfo(moreInfo);
      else if (restoreFocus && trigger?.isConnected) trigger.focus();
    });
  }

  private resetAreaPopup(): void {
    const dialog = this.renderRoot?.querySelector<HTMLDialogElement>(".area-detail-dialog");
    if (dialog?.open && typeof dialog.close === "function") dialog.close();
    this.areaPopupId = undefined;
    this.areaPopupTrigger = undefined;
    this.areaPopupMoreInfo = undefined;
    this.restoreAreaPopupFocus = true;
  }

  private async handleFloorRoomOff(event: Event, area: OverviewArea): Promise<void> {
    event.stopPropagation();
    if (!this.hass || this.pendingFloor || this.pendingFloorRooms.has(area.id)) return;
    const targets = areaActionEntities(area, false);
    if (!targets.length || targets.some((item) => this.pendingEntities.has(item.entityId))) return;
    this.pendingFloorRooms = new Set([...this.pendingFloorRooms, area.id]);
    this.lockPendingEntities(targets);
    try {
      await runAreaAction(this.hass, area, false);
    } catch (error) {
      this.reportError(error);
    } finally {
      const next = new Set(this.pendingFloorRooms);
      next.delete(area.id);
      this.pendingFloorRooms = next;
      this.unlockPendingEntities(targets);
    }
  }

  private async handleFloorAllOff(event: Event, areas: OverviewArea[]): Promise<void> {
    event.stopPropagation();
    if (!this.hass || this.pendingFloor || this.pendingFloorRooms.size) return;
    const targets = areas.flatMap((area) => areaActionEntities(area, false));
    if (!targets.length || targets.some((item) => this.pendingEntities.has(item.entityId))) return;
    this.pendingFloor = true;
    this.lockPendingEntities(targets);
    try {
      const results = await Promise.allSettled(areas.map((area) => runAreaAction(this.hass!, area, false)));
      const failures = results.filter((result) => result.status === "rejected");
      if (failures.length) throw new Error(`${failures.length} of ${results.length} room actions failed.`);
    } catch (error) {
      this.reportError(error);
    } finally {
      this.pendingFloor = false;
      this.unlockPendingEntities(targets);
    }
  }

  private openQuickActionPopup(event: Event, area: OverviewArea, action: OverviewQuickActionKind): void {
    event.stopPropagation();
    this.resetFloorPopup();
    this.resetAreaPopup();
    this.quickPopupTrigger = event.currentTarget as HTMLElement;
    this.quickPopupMoreInfo = undefined;
    this.restoreQuickPopupFocus = true;
    this.quickPopup = { areaId: area.id, action };
    void this.updateComplete.then(() => {
      const dialog = this.renderRoot.querySelector<HTMLDialogElement>(".area-quick-action-dialog");
      if (!dialog || dialog.open || !dialog.isConnected) return;
      if (typeof dialog.showModal === "function") dialog.showModal();
      else dialog.setAttribute("open", "");
    });
  }

  private closeQuickActionPopup(restoreFocus = true, moreInfo?: OverviewEntity): void {
    this.restoreQuickPopupFocus = restoreFocus;
    this.quickPopupMoreInfo = moreInfo;
    const dialog = this.renderRoot.querySelector<HTMLDialogElement>(".area-quick-action-dialog");
    if (dialog?.open && typeof dialog.close === "function") dialog.close();
    else this.handleQuickPopupClosed();
  }

  private handleQuickPopupClosed(): void {
    const moreInfo = this.quickPopupMoreInfo;
    const restoreFocus = this.restoreQuickPopupFocus;
    this.quickPopup = undefined;
    const trigger = this.quickPopupTrigger;
    this.quickPopupTrigger = undefined;
    this.quickPopupMoreInfo = undefined;
    this.restoreQuickPopupFocus = true;
    void this.updateComplete.then(() => {
      if (moreInfo) this.moreInfo(moreInfo);
      else if (restoreFocus && trigger?.isConnected) trigger.focus();
    });
  }

  private resetQuickPopup(): void {
    const dialog = this.renderRoot?.querySelector<HTMLDialogElement>(".area-quick-action-dialog");
    if (dialog?.open && typeof dialog.close === "function") dialog.close();
    this.quickPopup = undefined;
    this.quickPopupTrigger = undefined;
    this.quickPopupMoreInfo = undefined;
    this.restoreQuickPopupFocus = true;
  }

  private showMoreInfo(item: OverviewEntity): void {
    if (this.quickPopup) this.closeQuickActionPopup(false, item);
    else if (this.areaPopupId) this.closeAreaPopup(false, item);
    else this.moreInfo(item);
  }

  private handleQuickPopupBackdrop(event: MouseEvent): void {
    if (event.target === event.currentTarget) this.closeQuickActionPopup();
  }

  private handleQuickPopupCancel(event: Event): void {
    event.preventDefault();
    this.closeQuickActionPopup();
  }

  private handleQuickPopupKeydown(event: KeyboardEvent): void {
    if (event.key !== "Escape") return;
    event.preventDefault();
    event.stopPropagation();
    this.closeQuickActionPopup();
  }

  private async handleCompactSubgroupToggle(
    event: Event,
    area: OverviewArea,
    action: OverviewQuickActionKind,
    members: OverviewEntity[],
  ): Promise<void> {
    event.stopPropagation();
    if (!this.hass) return;
    const turnOn = !members.some((item) => item.powered);
    const key = `${area.id}:${action}:${turnOn ? "on" : "off"}`;
    const targets = quickActionDirectEntities(members, action, turnOn);
    if (this.quickActionPending(area.id, action) || members.some((item) => this.pendingEntities.has(item.entityId)) || targets.length === 0) return;
    this.pendingActions = new Set([...this.pendingActions, key]);
    this.lockPendingEntities(targets);
    try {
      await runQuickActionDirectAction(this.hass, members, action, turnOn);
    } catch (error) {
      this.reportError(error);
    } finally {
      const next = new Set(this.pendingActions);
      next.delete(key);
      this.pendingActions = next;
      this.unlockPendingEntities(targets);
    }
  }

  private async handleQuickActionGroupAction(
    event: Event,
    area: OverviewArea,
    action: OverviewQuickActionKind,
    turnOn: boolean,
  ): Promise<void> {
    event.stopPropagation();
    if (!this.hass) return;
    const key = `${area.id}:${action}:${turnOn ? "on" : "off"}`;
    const members = quickActionMembers(area, action);
    const targets = quickActionActionEntities(area, action, turnOn);
    const coverService: CoverControlService | undefined = action === "covers"
      ? turnOn ? "open_cover" : "close_cover"
      : undefined;
    const targetPending = coverService
      ? targets.some((item) => this.coverCommandPending(item.entityId, coverService))
      : members.some((item) => this.pendingEntities.has(item.entityId));
    if (this.quickActionPending(area.id, action) || targetPending || targets.length === 0) return;
    this.pendingActions = new Set([...this.pendingActions, key]);
    if (coverService) this.lockPendingCoverCommands(targets, coverService);
    else this.lockPendingEntities(targets);
    try {
      const call = () => runQuickActionAction(this.hass!, area, action, turnOn);
      if (coverService) await this.withCoverCommandTimeout(call);
      else await call();
    } catch (error) {
      this.reportError(error);
    } finally {
      const next = new Set(this.pendingActions);
      next.delete(key);
      this.pendingActions = next;
      if (coverService) this.unlockPendingCoverCommands(targets, coverService);
      else this.unlockPendingEntities(targets);
    }
  }

  private handleQuickPopupEntityAction(event: Event, item: OverviewEntity, action: OverviewQuickActionKind): void {
    event.stopPropagation();
    const plan = quickActionEntityService(action, item, !item.powered);
    if (!this.hass || !item.available || this.entityBusy(item) || (this.quickPopup && this.quickActionPending(this.quickPopup.areaId, action)) || !plan) return;
    void this.performEntityCall(item, () => callEntityService(this.hass!, item.entityId, plan.service, plan.data));
  }

  private async handleSectionAction(
    event: Event,
    section: OverviewSection,
    areaId: string,
    turnOn: boolean,
  ): Promise<void> {
    event.stopPropagation();
    if (!this.hass) return;
    const key = `${areaId}:${section.id}:${turnOn ? "on" : "off"}`;
    const oppositeKey = `${areaId}:${section.id}:${turnOn ? "off" : "on"}`;
    const targets = sectionActionEntities(section, turnOn);
    const coverService: CoverControlService | undefined = section.id === "covers"
      ? turnOn ? "open_cover" : "close_cover"
      : undefined;
    const targetPending = coverService
      ? targets.some((item) => this.coverCommandPending(item.entityId, coverService))
      : section.entities.some((item) => this.pendingEntities.has(item.entityId));
    if (this.pendingSections.has(key) || this.pendingSections.has(oppositeKey) || targetPending || targets.length === 0) return;
    this.pendingSections = new Set([...this.pendingSections, key]);
    if (coverService) this.lockPendingCoverCommands(targets, coverService);
    else this.lockPendingEntities(targets);
    try {
      const call = () => runSectionAction(this.hass!, section, turnOn);
      if (coverService) await this.withCoverCommandTimeout(call);
      else await call();
    } catch (error) {
      this.reportError(error);
    } finally {
      const next = new Set(this.pendingSections);
      next.delete(key);
      this.pendingSections = next;
      if (coverService) this.unlockPendingCoverCommands(targets, coverService);
      else this.unlockPendingEntities(targets);
    }
  }

  private coverCommandKey(entityId: string, service: CoverControlService): string {
    return `${entityId}:${service}`;
  }

  private coverCommandPending(entityId: string, service: CoverControlService): boolean {
    return this.pendingCoverCommands.has(this.coverCommandKey(entityId, service));
  }

  private coverBusy(item: OverviewEntity): boolean {
    return (["open_cover", "stop_cover", "close_cover"] as const)
      .some((service) => this.coverCommandPending(item.entityId, service));
  }

  private lockPendingCoverCommands(targets: OverviewEntity[], service: CoverControlService): void {
    const next = new Set(this.pendingCoverCommands);
    for (const item of targets) next.add(this.coverCommandKey(item.entityId, service));
    this.pendingCoverCommands = next;
  }

  private unlockPendingCoverCommands(targets: OverviewEntity[], service: CoverControlService): void {
    const next = new Set(this.pendingCoverCommands);
    for (const item of targets) next.delete(this.coverCommandKey(item.entityId, service));
    this.pendingCoverCommands = next;
  }

  private lockPendingEntities(targets: OverviewEntity[]): void {
    this.pendingEntities = new Set([...this.pendingEntities, ...targets.map((item) => item.entityId)]);
  }

  private unlockPendingEntities(targets: OverviewEntity[]): void {
    const next = new Set(this.pendingEntities);
    for (const item of targets) next.delete(item.entityId);
    this.pendingEntities = next;
  }

  private entityBusy(item: OverviewEntity): boolean {
    return this.pendingEntities.has(item.entityId)
      || this.pendingSections.has(`${item.areaId}:${item.section}:on`)
      || this.pendingSections.has(`${item.areaId}:${item.section}:off`);
  }

  private displayedClimateTargets(item: OverviewEntity): ClimateTemperatureTargets {
    const serverTargets = climateTemperatureTargets(item);
    const optimistic = this.optimisticClimateTargets[item.entityId];
    if (!optimistic) return serverTargets;
    if (optimistic.expiresAt <= Date.now() || optimistic.baseline !== climateTemperatureSignature(serverTargets)) {
      queueMicrotask(() => {
        if (this.optimisticClimateTargets[item.entityId] === optimistic) this.clearClimateTarget(item.entityId);
      });
      return serverTargets;
    }
    return {
      temperature: optimistic.temperature,
      low: optimistic.low,
      high: optimistic.high,
    };
  }

  private setOptimisticClimateTargets(item: OverviewEntity, targets: ClimateTemperatureTargets): void {
    const expiresAt = Date.now() + 8_000;
    const existingTimer = this.climateTargetTimers.get(item.entityId);
    if (existingTimer !== undefined) window.clearTimeout(existingTimer);
    this.optimisticClimateTargets = {
      ...this.optimisticClimateTargets,
      [item.entityId]: {
        ...targets,
        baseline: climateTemperatureSignature(climateTemperatureTargets(item)),
        expiresAt,
      },
    };
    const timer = window.setTimeout(() => {
      const current = this.optimisticClimateTargets[item.entityId];
      if (current?.expiresAt === expiresAt) this.clearClimateTarget(item.entityId);
    }, 8_050);
    this.climateTargetTimers.set(item.entityId, timer);
  }

  private clearClimateTarget(entityId: string): void {
    const timer = this.climateTargetTimers.get(entityId);
    if (timer !== undefined) window.clearTimeout(timer);
    this.climateTargetTimers.delete(entityId);
    if (!(entityId in this.optimisticClimateTargets)) return;
    const next = { ...this.optimisticClimateTargets };
    delete next[entityId];
    this.optimisticClimateTargets = next;
  }

  private resetClimateTargets(): void {
    for (const timer of this.climateTargetTimers.values()) window.clearTimeout(timer);
    this.climateTargetTimers.clear();
    this.optimisticClimateTargets = {};
  }

  private toggleEntity(event: Event, item: OverviewEntity): void {
    event.stopPropagation();
    const plan = entityPowerService(item, !item.powered);
    if (!plan) return;
    if (item.domain === "climate") this.clearClimateTarget(item.entityId);
    void this.performEntityCall(item, () => callEntityService(this.hass!, item.entityId, plan.service, plan.data));
  }

  private runEntityService(event: Event, item: OverviewEntity, service: string): void {
    event.stopPropagation();
    const call = () => callEntityService(this.hass!, item.entityId, service);
    if (item.domain === "cover" && isCoverControlService(service)) {
      void this.performCoverCommand(item, service, call);
      return;
    }
    void this.performEntityCall(item, call);
  }

  private setClimateTemperature(item: OverviewEntity, temperature: number): void {
    const current = this.displayedClimateTargets(item);
    const step = climateTemperatureStep(item, this.areaTemperatureUnit(item));
    const target = normalizeClimateTemperature(item, temperature, step);
    if (current.temperature === target) return;
    const optimistic = { ...current, temperature: target };
    this.setOptimisticClimateTargets(item, optimistic);
    void this.performEntityCall(item, () => callEntityService(this.hass!, item.entityId, "set_temperature", { temperature: target }))
      .then((success) => { if (!success) this.clearClimateTarget(item.entityId); });
  }

  private setClimateRange(item: OverviewEntity, low: number, high: number, changed: "low" | "high"): void {
    const current = this.displayedClimateTargets(item);
    const step = climateTemperatureStep(item, this.areaTemperatureUnit(item));
    let targetLow = normalizeClimateTemperature(item, low, step);
    let targetHigh = normalizeClimateTemperature(item, high, step);
    if (changed === "low" && targetLow > targetHigh) targetLow = targetHigh;
    if (changed === "high" && targetHigh < targetLow) targetHigh = targetLow;
    if (current.low === targetLow && current.high === targetHigh) return;
    const optimistic = { ...current, low: targetLow, high: targetHigh };
    this.setOptimisticClimateTargets(item, optimistic);
    void this.performEntityCall(item, () => callEntityService(this.hass!, item.entityId, "set_temperature", {
      target_temp_low: targetLow,
      target_temp_high: targetHigh,
    })).then((success) => { if (!success) this.clearClimateTarget(item.entityId); });
  }

  private menuValue(event: Event): string | undefined {
    const detail = (event as CustomEvent<{ value?: unknown; item?: { value?: unknown } }>).detail;
    const value = detail?.value ?? detail?.item?.value;
    return typeof value === "string" && value ? value : undefined;
  }

  private setClimateMode(item: OverviewEntity, event: Event): void {
    event.stopPropagation();
    const hvacMode = this.menuValue(event);
    if (!hvacMode || hvacMode === item.entity.state) return;
    this.clearClimateTarget(item.entityId);
    void this.performEntityCall(item, () => callEntityService(this.hass!, item.entityId, "set_hvac_mode", { hvac_mode: hvacMode }));
  }

  private setFanMode(item: OverviewEntity, event: Event): void {
    event.stopPropagation();
    const fanMode = this.menuValue(event);
    if (!fanMode || fanMode === String(item.entity.attributes.fan_mode ?? "")) return;
    void this.performEntityCall(item, () => callEntityService(this.hass!, item.entityId, "set_fan_mode", { fan_mode: fanMode }));
  }

  private setLightBrightness(item: OverviewEntity, event: Event): void {
    event.stopPropagation();
    const value = (event as CustomEvent<{ value?: unknown }>).detail?.value;
    if (typeof value !== "number" || !Number.isFinite(value)) return;
    const brightness = Math.min(100, Math.max(0, Math.round(value)));
    if (brightness === lightBrightnessPercentage(item)) return;
    void this.performEntityCall(item, () => brightness === 0
      ? callEntityService(this.hass!, item.entityId, "turn_off")
      : callEntityService(this.hass!, item.entityId, "turn_on", { brightness_pct: brightness }));
  }

  private setMediaVolume(event: Event, item: OverviewEntity, volume: number): void {
    event.stopPropagation();
    void this.performEntityCall(item, () => callEntityService(this.hass!, item.entityId, "volume_set", { volume_level: Math.min(1, Math.max(0, volume)) }));
  }

  private async performEntityCall(item: OverviewEntity, call: () => Promise<unknown>): Promise<boolean> {
    if (!this.hass || this.entityBusy(item)) return false;
    this.pendingEntities = new Set([...this.pendingEntities, item.entityId]);
    try {
      await call();
      return true;
    } catch (error) {
      this.reportError(error);
      return false;
    } finally {
      const next = new Set(this.pendingEntities);
      next.delete(item.entityId);
      this.pendingEntities = next;
    }
  }

  private async performCoverCommand(
    item: OverviewEntity,
    service: CoverControlService,
    call: () => Promise<unknown>,
    timeoutMs = COVER_COMMAND_TIMEOUT_MS,
  ): Promise<boolean> {
    if (!this.hass || !item.available || this.coverCommandPending(item.entityId, service)) return false;
    this.lockPendingCoverCommands([item], service);
    try {
      await this.withCoverCommandTimeout(call, timeoutMs);
      return true;
    } catch (error) {
      this.reportError(error);
      return false;
    } finally {
      this.unlockPendingCoverCommands([item], service);
    }
  }

  private async withCoverCommandTimeout<T>(call: () => Promise<T>, timeoutMs = COVER_COMMAND_TIMEOUT_MS): Promise<T> {
    let timer: number | undefined;
    const timeout = new Promise<never>((_resolve, reject) => {
      timer = window.setTimeout(() => reject(new Error("Cover command timed out.")), timeoutMs);
    });
    try {
      return await Promise.race([Promise.resolve().then(call), timeout]);
    } finally {
      if (timer !== undefined) window.clearTimeout(timer);
    }
  }

  private moreInfo(item: OverviewEntity): void {
    this.dispatchEvent(new CustomEvent("hass-more-info", { bubbles: true, composed: true, detail: { entityId: item.entityId } }));
  }

  private reportError(error: unknown): void {
    const message = error instanceof Error ? error.message : String(error);
    if (this.config?.debug) console.warn("[area-bubble-overview-card]", error);
    this.dispatchEvent(new CustomEvent("hass-notification", { bubbles: true, composed: true, detail: { message } }));
  }

  private storageKey(): string {
    return `${OVERVIEW_STORAGE_PREFIX}:${this.storageId}:expanded`;
  }

  private floorStorageKey(): string {
    return `${OVERVIEW_STORAGE_PREFIX}:${this.storageId}:floor-expanded`;
  }

  private readExpanded(): Record<string, boolean> {
    try {
      const value = localStorage.getItem(this.storageKey());
      return value ? (JSON.parse(value) as Record<string, boolean>) : {};
    } catch {
      return {};
    }
  }

  private writeExpanded(): void {
    try {
      localStorage.setItem(this.storageKey(), JSON.stringify(this.expanded));
    } catch {
      // localStorage can be disabled in kiosk and hardened browser modes.
    }
  }

  private readFloorExpanded(): boolean | undefined {
    try {
      const value = localStorage.getItem(this.floorStorageKey());
      return value === null ? undefined : value === "true";
    } catch {
      return undefined;
    }
  }

  private writeFloorExpanded(): void {
    try {
      localStorage.setItem(this.floorStorageKey(), String(this.floorExpanded));
    } catch {
      // localStorage can be disabled in kiosk and hardened browser modes.
    }
  }

  private applyStyleVariables(): void {
    if (!this.config) return;
    const style = this.config.style;
    this.style.setProperty("--area-bubble-overview-border-radius", `${style.border_radius}px`);
    this.style.setProperty("--area-bubble-overview-blur", `${style.blur}px`);
    this.style.setProperty("--area-bubble-overview-gap", `${style.section_gap}px`);
    this.style.setProperty("--area-bubble-overview-section-gap", `${style.category_gap}px`);
    this.style.setProperty("--area-bubble-overview-row-height", `${style.row_height}px`);
    this.style.setProperty("--area-bubble-overview-area-name-size", `${style.area_name_size}px`);
    this.style.setProperty("--area-bubble-overview-quick-action-size", `${style.quick_action_size}px`);
    this.style.setProperty("--area-bubble-overview-quick-action-icon-size", `${style.quick_action_icon_size}px`);
    this.style.setProperty("--area-bubble-overview-section-action-size", `${style.section_action_size}px`);
    this.style.setProperty("--area-bubble-overview-section-action-icon-size", `${style.section_action_icon_size}px`);
    this.style.setProperty("--area-bubble-overview-accent", style.accent_color);
    this.style.setProperty("--area-bubble-overview-active", style.active_color);
    this.style.setProperty("--area-bubble-overview-row-bg", style.row_background);
    this.style.setProperty(
      "--area-bubble-overview-card-bg",
      style.card_transparent ? "transparent" : style.card_background,
    );
    this.style.setProperty("--area-bubble-overview-primary-text", style.primary_text_color);
    this.style.setProperty("--area-bubble-overview-secondary-text", style.secondary_text_color);
    this.style.setProperty("--area-bubble-overview-active-text", style.active_text_color);
    this.style.setProperty("--area-bubble-overview-control-text", style.control_text_color);
    this.style.setProperty(
      "--area-bubble-overview-card-border",
      style.card_transparent ? "transparent" : "color-mix(in srgb, var(--divider-color) 58%, transparent)",
    );
    this.style.setProperty("--area-bubble-overview-active-surface", style.active_surface);
    this.style.setProperty("--area-bubble-overview-entity-active-surface", style.entity_active_surface);
    this.style.setProperty("--area-bubble-overview-area-frame-width", `${style.area_frame_width}px`);
    if (style.area_frame_color) this.style.setProperty("--area-bubble-overview-area-frame-color", style.area_frame_color);
    else this.style.removeProperty("--area-bubble-overview-area-frame-color");
    this.style.setProperty("--area-bubble-overview-entity-frame-width", `${style.entity_frame_width}px`);
    if (style.entity_frame_color) this.style.setProperty("--area-bubble-overview-entity-frame-color", style.entity_frame_color);
    else this.style.removeProperty("--area-bubble-overview-entity-frame-color");
    this.style.setProperty("--area-bubble-overview-climate-surface", style.climate_surface);
    this.style.setProperty("--area-bubble-overview-control-surface", style.control_surface);
    this.style.setProperty("--area-bubble-overview-climate-color", style.climate_color);
    this.style.setProperty("--area-bubble-overview-cover-color", style.cover_color);
    this.style.setProperty("--area-bubble-overview-media-color", style.media_color);
    this.style.setProperty("--area-bubble-overview-temperature-off-surface", style.temperature_off_surface);
    this.style.setProperty("--area-bubble-overview-temperature-cool-surface", style.temperature_cool_surface);
    this.style.setProperty("--area-bubble-overview-temperature-heat-surface", style.temperature_heat_surface);
    this.style.setProperty("--area-bubble-overview-temperature-active-surface", style.temperature_active_surface);
    this.style.setProperty("--area-bubble-overview-occupancy-active-color", style.occupancy_active_color);
    this.style.setProperty("--area-bubble-overview-occupancy-vacant-color", style.occupancy_vacant_color);
    this.style.setProperty("--area-bubble-overview-occupancy-unknown-color", style.occupancy_unknown_color);
    this.style.setProperty(
      "--area-bubble-overview-shadow",
      style.show_shadows && !style.card_transparent
        ? `0 12px 30px rgba(0,0,0,${style.shadow_intensity})`
        : "none",
    );
  }
}

window.customCards = window.customCards ?? [];
if (!window.customCards.some((card) => card.type === OVERVIEW_CARD_TAG)) {
  window.customCards.push({
    type: OVERVIEW_CARD_TAG,
    name: "Area Bubble Overview Card",
    description: "Room and floor overview with climate, heating, covers, lights, media, presence, and safe quick actions.",
    preview: true,
    documentationURL: "https://github.com/jonioliel/area-bubble-expander-card#area-bubble-overview-card",
  });
}

declare global {
  interface HTMLElementTagNameMap {
    "area-bubble-overview-card": AreaBubbleOverviewCard;
  }
}
