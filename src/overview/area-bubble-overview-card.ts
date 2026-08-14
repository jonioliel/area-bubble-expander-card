import { LitElement, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { HomeAssistant } from "../types";
import {
  activeQuickActionSummaries,
  areaActionEntities,
  callEntityService,
  quickActionActionEntities,
  quickActionEntityService,
  quickActionMembers,
  runQuickActionAction,
  runAreaAction,
  runSectionAction,
  sectionActionEntities,
} from "./actions";
import { resolveOverviewConfig, validateOverviewConfig } from "./config";
import {
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
import "./editor";
import {
  climateModes,
  countsTowardAreaActivity,
  entityPowerService,
  lightBrightnessPercentage,
  supportsEntityFeature,
  supportsLightBrightness,
} from "./features";
import { overviewCardStyles } from "./styles";
import { overviewLanguage, overviewRtl, overviewText, quickActionLabel } from "./translations";
import type {
  AreaBubbleOverviewCardConfig,
  OverviewArea,
  OverviewDiscovery,
  OverviewEntity,
  OverviewQuickActionId,
  OverviewSection,
  ResolvedOverviewConfig,
} from "./types";

const numberAttribute = (item: OverviewEntity, key: string): number | undefined => {
  const value = item.entity.attributes[key];
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
};

type QuickPopupState = {
  areaId: string;
  action: OverviewQuickActionId;
};

const FLOOR_QUICK_AREA_ID = "__overview_floor__";

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
  @state() private quickPopup?: QuickPopupState;
  @state() private floorPopupOpen = false;
  @state() private pendingFloor = false;
  @state() private pendingFloorRooms = new Set<string>();
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
  private floorPopupTrigger?: HTMLElement;

  public static getConfigElement(): HTMLElement {
    return document.createElement(OVERVIEW_EDITOR_TAG);
  }

  public static getStubConfig(): Partial<AreaBubbleOverviewCardConfig> {
    return { language: "auto", rtl: "auto" };
  }

  public setConfig(config: AreaBubbleOverviewCardConfig): void {
    this.resetQuickPopup();
    this.resetFloorPopup();
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
            <button class="floor-toggle" type="button" aria-expanded=${this.floorExpanded} aria-controls=${contentId} aria-label=${label} @click=${() => this.toggleFloor()}>
              <span class="icon-bubble small"><ha-icon icon=${discovery.targetIcon}></ha-icon></span>
              <span class="heading-main"><span class="floor-title">${discovery.targetName}</span><span class="subtitle">${summary}</span></span>
              <span class="floor-chevron ${this.floorExpanded ? "expanded" : ""}" aria-hidden="true"><ha-icon icon="mdi:chevron-down"></ha-icon></span>
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
      const visibleNested = expanded ? nested : nested.filter((child) => child.showWhenParentCollapsed);
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
    const expanded = this.isExpanded(area);
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
    const activeClimateCount = climateTemperatureAction?.entities.filter((item) => item.powered && item.ignoreActivity !== true).length ?? 0;
    const hasStatuses = hasOccupancy || quickActions.length > 0 || hasTemperature;
    const formattedTemperature = hasTemperature ? this.formatTemperature(area.temperature!, area.temperatureUnit) : "";
    const temperatureModeLabel = {
      none: this.localText("ללא מצב מיזוג", "No climate mode"),
      off: this.localText("המיזוג כבוי", "Climate off"),
      cool: this.localText("קירור", "Cooling"),
      heat: this.localText("חימום", "Heating"),
      active: this.localText("מצב מיזוג פעיל", "Climate active"),
    }[area.temperatureMode];
    const summaryLoad = Math.min(8, quickActions.length + Number(hasOccupancy) + Number(hasTemperature) * 2);
    const compactStatuses = summaryLoad >= 5;
    const safeAreaId = area.id.replace(/[^a-zA-Z0-9_-]/g, "-");
    const contentId = `overview-area-${safeAreaId}`;
    const nameId = `overview-area-name-${safeAreaId}`;
    const toggleLabel = `${overviewText(this.hass, this.config, expanded ? "collapse" : "expand")}: ${area.name}`;
    return html`
      <section
        class="area-panel ${activeCount ? "has-active" : "all-off"} ${expanded ? "expanded" : ""}"
        data-powered=${activeCount ? "true" : "false"}
        aria-labelledby=${nameId}
      >
        <header class="area-summary ${this.config.show_area_expand_button ? "" : "without-expand-button"}">
          <div class="area-summary-pill summary-load-${summaryLoad} ${compactStatuses ? "compact-statuses" : ""} ${hasStatuses ? "has-statuses" : "no-statuses"}">
            <button
              class="area-toggle"
              type="button"
              aria-expanded=${expanded}
              aria-controls=${contentId}
              aria-label=${toggleLabel}
              @click=${() => this.toggleArea(area)}
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
              ${hasTemperature || climateTemperatureAction
                ? html`<span class="temperature-summary">
                    ${hasTemperature
                      ? html`<span class="temperature area-temperature temperature-${area.temperatureMode}" title=${`${formattedTemperature} · ${temperatureModeLabel}`} aria-label=${`${formattedTemperature} · ${temperatureModeLabel}`}>${formattedTemperature}</span>`
                      : nothing}
                    ${climateTemperatureAction
                      ? html`<button
                          class="temperature-climate-tag temperature-${area.temperatureMode}"
                          type="button"
                          title=${`${activeClimateCount} ${this.localText("מזגנים פעילים", "active climate devices")}`}
                          aria-label=${`${this.localText("פתיחת מיזוג אוויר", "Open climate controls")}: ${area.name} (${activeClimateCount}/${climateTemperatureAction.entities.length})`}
                          aria-haspopup="dialog"
                          aria-expanded=${this.quickPopup?.areaId === area.id && this.quickPopup.action === "climate"}
                          aria-busy=${this.quickActionPending(area.id, "climate")}
                          ?disabled=${this.quickActionPending(area.id, "climate")}
                          @click=${(event: Event) => this.openQuickActionPopup(event, area, "climate")}
                        >
                          <ha-icon icon=${this.config.quick_action_icons.climate}></ha-icon>
                        </button>`
                      : nothing}
                  </span>`
                : nothing}
            </div>
          </div>
          ${this.config.show_area_expand_button
            ? html`<button
                class="expand-button"
                type="button"
                aria-expanded=${expanded}
                aria-controls=${contentId}
                aria-label=${toggleLabel}
                @click=${() => this.toggleArea(area)}
              ><span class="chevron" aria-hidden="true"><ha-icon icon="mdi:chevron-down"></ha-icon></span></button>`
            : nothing}
        </header>
        <div class="area-disclosure" id=${contentId} ?hidden=${!expanded}>
          <div class="expanded-content">${area.sections.map((section) => this.renderSection(section, area))}</div>
          ${expanded ? nestedContent : nothing}
        </div>
        ${expanded ? nothing : nestedContent}
      </section>
    `;
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

  private renderSection(section: OverviewSection, area: OverviewArea) {
    const areaId = area.id;
    const headingId = `overview-section-${section.id}-${areaId.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
    const onTargets = sectionActionEntities(section, true);
    const offTargets = sectionActionEntities(section, false);
    const pendingOn = this.pendingSections.has(`${areaId}:${section.id}:on`);
    const pendingOff = this.pendingSections.has(`${areaId}:${section.id}:off`);
    const pending = pendingOn || pendingOff || section.entities.some((item) => this.pendingEntities.has(item.entityId));
    const onVerb = section.id === "covers" ? this.localText("פתיחת כל התריסים", "Open all covers") : this.localText("הפעלת הכל", "Turn everything on");
    const offVerb = section.id === "covers" ? this.localText("סגירת כל התריסים", "Close all covers") : this.localText("כיבוי הכל", "Turn everything off");
    const onLabel = `${onVerb}: ${section.title} (${onTargets.length})`;
    const offLabel = `${offVerb}: ${section.title} (${offTargets.length})`;
    const areaOverride = this.config?.area_overrides[area.id] ?? this.config?.area_overrides[area.name];
    const sectionStyle = { ...(this.config?.section_styles[section.id] ?? {}), ...(areaOverride?.section_styles?.[section.id] ?? {}) };
    const sectionStyleText = [
      `--aboc-section-background:${sectionStyle.background || "transparent"}`,
      `--aboc-section-border-color:${sectionStyle.border_color || "color-mix(in srgb, var(--divider-color) 58%, transparent)"}`,
      `--aboc-section-border-width:${sectionStyle.border_width ?? 1}px`,
      `--aboc-section-border-style:${sectionStyle.border_style ?? "solid"}`,
    ].join(";");
    const toggleTurnOn = offTargets.length === 0;
    const toggleTargets = toggleTurnOn ? onTargets : offTargets;
    const togglePending = toggleTurnOn ? pendingOn : pendingOff;
    const toggleLabel = toggleTurnOn ? onLabel : offLabel;
    return html`
      <section class="device-section section-${section.id} ${sectionStyle.show_border ? "section-framed" : ""}" style=${sectionStyleText} aria-labelledby=${headingId}>
        <h3 class="section-heading" id=${headingId}>
          <span class="section-heading-main"><ha-icon icon=${section.icon}></ha-icon><span class="section-title" title=${section.title}>${section.title}</span><span class="section-count">${section.activeCount}/${section.entities.length}</span></span>
          <span class="section-actions" role="group" aria-label=${`${this.localText("שליטה כללית", "Group controls")}: ${section.title}`}>
            ${this.config?.section_action_mode === "toggle"
              ? html`<button
                  class="section-toggle-button ${toggleTurnOn ? "turn-on" : "turn-off"}"
                  type="button"
                  title=${toggleLabel}
                  aria-label=${toggleLabel}
                  aria-busy=${togglePending}
                  ?disabled=${pending || toggleTargets.length === 0}
                  @click=${(event: Event) => this.handleSectionAction(event, section, areaId, toggleTurnOn)}
                ><ha-icon icon=${togglePending ? "mdi:loading" : this.sectionActionIcon(section.id, toggleTurnOn)}></ha-icon></button>`
              : html`
                  <button
                    class="section-on-button"
                    type="button"
                    title=${onLabel}
                    aria-label=${onLabel}
                    aria-busy=${pendingOn}
                    ?disabled=${pending || onTargets.length === 0}
                    @click=${(event: Event) => this.handleSectionAction(event, section, areaId, true)}
                  ><ha-icon icon=${pendingOn ? "mdi:loading" : this.sectionActionIcon(section.id, true)}></ha-icon></button>
                  <button
                    class="section-off-button"
                    type="button"
                    title=${offLabel}
                    aria-label=${offLabel}
                    aria-busy=${pendingOff}
                    ?disabled=${pending || offTargets.length === 0}
                    @click=${(event: Event) => this.handleSectionAction(event, section, areaId, false)}
                  ><ha-icon icon=${pendingOff ? "mdi:loading" : this.sectionActionIcon(section.id, false)}></ha-icon></button>
                `}
          </span>
        </h3>
        ${this.renderSectionEntities(section)}
      </section>
    `;
  }

  private renderSectionEntities(section: OverviewSection) {
    if (!section.entities.length) {
      return html`<div class="section-entities"><div class="secondary section-empty">${this.config && overviewLanguage(this.hass, this.config) === "he" ? "אין רכיבים בסעיף" : "No devices in this section"}</div></div>`;
    }
    const ungrouped = section.entities.filter((item) => !item.group);
    const groups = new Map<string, OverviewEntity[]>();
    for (const item of section.entities) {
      if (!item.group) continue;
      const entries = groups.get(item.group) ?? [];
      entries.push(item);
      groups.set(item.group, entries);
    }
    return html`
      ${ungrouped.length ? html`<div class="section-entities">${ungrouped.map((item) => this.renderEntity(item, section.id))}</div>` : nothing}
      ${[...groups.entries()].map(([group, entities]) => html`
        <section class="entity-subgroup" aria-label=${group}>
          <div class="entity-subgroup-heading"><ha-icon icon="mdi:folder-home-outline"></ha-icon><span>${group}</span><small>${entities.filter((item) => item.powered).length}/${entities.length}</small></div>
          <div class="section-entities">${entities.map((item) => this.renderEntity(item, section.id))}</div>
        </section>
      `)}
    `;
  }

  private sectionActionIcon(section: OverviewSection["id"], turnOn: boolean): string {
    if (!this.config) return turnOn ? "mdi:play-circle-outline" : "mdi:stop-circle-outline";
    if (section === "covers") return turnOn ? this.config.section_action_icons.open : this.config.section_action_icons.close;
    return turnOn ? this.config.section_action_icons.on : this.config.section_action_icons.off;
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
            <span class="icon-bubble popup-icon"><ha-icon icon=${this.config.quick_action_icons[action]}></ha-icon></span>
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
              @click=${(event: Event) => this.handleQuickPopupGroupAction(event, area, action, true)}
            ><ha-icon icon=${pendingOn ? "mdi:loading" : action === "covers" ? "mdi:arrow-up" : "mdi:power-on"}></ha-icon><span>${onVerb}</span><small>${onTargets.length}</small></button>
            <button
              class="quick-popup-group-button turn-off"
              type="button"
              aria-label=${`${offVerb}: ${label} (${offTargets.length})`}
              aria-busy=${pendingOff}
              ?disabled=${categoryBusy || offTargets.length === 0}
              @click=${(event: Event) => this.handleQuickPopupGroupAction(event, area, action, false)}
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

  private renderQuickPopupEntity(item: OverviewEntity, action: OverviewQuickActionId, groupPending: boolean) {
    const busy = this.entityBusy(item);
    const turnOn = !item.powered;
    const plan = quickActionEntityService(action, item, turnOn);
    const disabled = !item.available || busy || groupPending || !plan;
    const actionLabel = action === "covers"
      ? turnOn ? this.localText("פתיחה", "Open") : this.localText("סגירה", "Close")
      : turnOn ? this.localText("הפעלה", "Turn on") : this.localText("כיבוי", "Turn off");
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
        ><ha-icon icon=${busy ? "mdi:loading" : action === "covers" ? turnOn ? "mdi:arrow-up" : "mdi:arrow-down" : "mdi:power"}></ha-icon></button>
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
          <span class="state-text">${this.entitySecondary(item)}</span>
        </span>
      </button>
    `;
  }

  private renderToggle(item: OverviewEntity) {
    const busy = this.entityBusy(item);
    const powerPlan = entityPowerService(item, !item.powered);
    const toggleDisabled = !item.available || busy || !powerPlan;
    return html`
      <button
        class="toggle-tile entity-card hold-target ${item.active ? "active" : ""} ${item.available ? "" : "unavailable"}"
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
          <span class="state-text">${this.entitySecondary(item)}</span>
        </span>
      </button>
    `;
  }

  private renderClimate(item: OverviewEntity) {
    const current = numberAttribute(item, "current_temperature");
    const step = numberAttribute(item, "target_temp_step") ?? 0.5;
    const target = supportsEntityFeature(item.entity, CLIMATE_FEATURES.TARGET_TEMPERATURE)
      ? numberAttribute(item, "temperature")
      : undefined;
    const rangeLow = supportsEntityFeature(item.entity, CLIMATE_FEATURES.TARGET_TEMPERATURE_RANGE)
      ? numberAttribute(item, "target_temp_low")
      : undefined;
    const rangeHigh = supportsEntityFeature(item.entity, CLIMATE_FEATURES.TARGET_TEMPERATURE_RANGE)
      ? numberAttribute(item, "target_temp_high")
      : undefined;
    const hasRange = rangeLow !== undefined && rangeHigh !== undefined;
    const modes = climateModes(item);
    const fanModes = supportsEntityFeature(item.entity, CLIMATE_FEATURES.FAN_MODE) && Array.isArray(item.entity.attributes.fan_modes)
      ? item.entity.attributes.fan_modes.map(String)
      : [];
    const busy = this.entityBusy(item);
    const modeIcon = this.climateModeIcon(item.entity.state);
    return html`
      <article class="climate-card entity-card full-span mode-${item.entity.state} ${item.active ? "active" : ""} ${item.available ? "" : "unavailable"}" aria-busy=${busy}>
        <div class="climate-primary">
          ${this.renderEntityLead(item)}
          ${!hasRange && target !== undefined
            ? html`
                <span class="temperature-stepper">
                  <button type="button" ?disabled=${busy || !item.available} @click=${() => this.setClimateTemperature(item, target - step)} aria-label=${`${this.localText("הורדת טמפרטורה", "Decrease temperature")}: ${item.name}`}>−</button>
                  <span>${this.formatTemperature(target, this.areaTemperatureUnit(item))}</span>
                  <button type="button" ?disabled=${busy || !item.available} @click=${() => this.setClimateTemperature(item, target + step)} aria-label=${`${this.localText("העלאת טמפרטורה", "Increase temperature")}: ${item.name}`}>+</button>
                </span>
              `
            : current !== undefined
              ? html`<span class="temperature current-temperature">${this.formatTemperature(current, this.areaTemperatureUnit(item))}</span>`
              : nothing}
        </div>
        ${hasRange ? this.renderClimateRange(item, rangeLow, rangeHigh, step, busy) : nothing}
        ${modes.length || fanModes.length
          ? html`<div class="climate-secondary" @click=${(event: Event) => event.stopPropagation()}>
          ${modes.length
            ? html`<ha-control-select-menu
                class="mode-select"
                show-arrow
                hide-label
                .label=${`${this.localText("מצב מיזוג", "HVAC mode")}: ${item.name}`}
                .value=${item.entity.state}
                .disabled=${busy || !item.available}
                .options=${modes.map((mode) => ({ value: mode, label: this.climateModeLabel(mode), icon: this.climateModeIcon(mode) }))}
                @wa-select=${(event: Event) => this.setClimateMode(item, event)}
              ><ha-icon slot="icon" icon=${modeIcon}></ha-icon></ha-control-select-menu>`
            : nothing}
          ${fanModes.length
            ? html`<ha-control-select-menu
                class="mode-select"
                show-arrow
                hide-label
                .label=${`${this.localText("מהירות מאוורר", "Fan mode")}: ${item.name}`}
                .value=${String(item.entity.attributes.fan_mode ?? "")}
                .disabled=${busy || !item.available}
                .options=${fanModes.map((mode) => ({ value: mode, label: this.modeLabel(mode), icon: "mdi:fan" }))}
                @wa-select=${(event: Event) => this.setFanMode(item, event)}
              ><ha-icon slot="icon" icon="mdi:fan"></ha-icon></ha-control-select-menu>`
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
    return html`
      <article class="light-card entity-card ${item.active ? "active" : ""} ${item.available ? "" : "unavailable"}" aria-busy=${busy}>
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
        <div class="brightness-control" @click=${(event: Event) => event.stopPropagation()}>
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
        </div>
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
    const target = supportsEntityFeature(item.entity, targetFeature) ? numberAttribute(item, "temperature") : undefined;
    const current = numberAttribute(item, "current_temperature");
    if (target === undefined && current === undefined) return this.renderToggle(item);
    const step = numberAttribute(item, "target_temp_step") ?? 0.5;
    const busy = this.entityBusy(item);
    const powerPlan = entityPowerService(item, !item.powered);
    return html`
      <article class="thermostat-card entity-card full-span ${item.active ? "active" : ""} ${item.available ? "" : "unavailable"}" aria-busy=${busy}>
        <div class="thermostat-primary">
          ${this.renderEntityLead(item)}
          ${target !== undefined
            ? html`<span class="temperature-stepper">
                <button type="button" ?disabled=${busy || !item.available} @click=${() => this.setClimateTemperature(item, target - step)} aria-label=${`${this.localText("הורדת טמפרטורה", "Decrease temperature")}: ${item.name}`}>−</button>
                <span>${this.formatTemperature(target, this.areaTemperatureUnit(item))}</span>
                <button type="button" ?disabled=${busy || !item.available} @click=${() => this.setClimateTemperature(item, target + step)} aria-label=${`${this.localText("העלאת טמפרטורה", "Increase temperature")}: ${item.name}`}>+</button>
              </span>`
            : html`<span class="temperature current-temperature">${this.formatTemperature(current!, this.areaTemperatureUnit(item))}</span>`}
        </div>
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
    const busy = this.entityBusy(item);
    const supportedFeatures = numberAttribute(item, "supported_features");
    const position = numberAttribute(item, "current_position");
    const state = item.entity.state;
    const services = [
      { service: "open_cover", icon: "mdi:arrow-up", feature: 1 },
      { service: "stop_cover", icon: "mdi:stop", feature: 8 },
      { service: "close_cover", icon: "mdi:arrow-down", feature: 2 },
    ].filter(({ feature }) => supportedFeatures === undefined || (supportedFeatures & feature) !== 0);
    const stateDisables = (service: string): boolean => {
      if (service === "open_cover") return state === "open" || (position !== undefined && position >= 100);
      if (service === "close_cover") return state === "closed" || (position !== undefined && position <= 0);
      return service === "stop_cover" && !["opening", "closing"].includes(state);
    };
    return html`
      <article class="cover-card entity-card full-span ${item.active ? "active" : ""} ${item.available ? "" : "unavailable"}" aria-busy=${busy}>
        ${this.renderEntityLead(item)}
        <span class="cover-controls" role="group" aria-label=${`${this.localText("שליטה בתריס", "Cover controls")}: ${item.name}`}>
          ${services.map(({ service, icon }) => html`
            <button
              class="cover-control"
              type="button"
              ?disabled=${!item.available || busy || stateDisables(service)}
              @click=${(event: Event) => this.runEntityService(event, item, service)}
              aria-label=${`${this.coverServiceLabel(service)}: ${item.name}`}
            ><ha-icon icon=${icon}></ha-icon></button>
          `)}
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
    if (item.domain === "climate") {
      const current = numberAttribute(item, "current_temperature");
      const action = String(item.entity.attributes.hvac_action ?? item.entity.state).replace(/_/g, " ");
      return [action, current !== undefined ? this.formatTemperature(current, this.areaTemperatureUnit(item)) : ""].filter(Boolean).join(" · ");
    }
    if (item.domain === "cover") {
      const position = numberAttribute(item, "current_position");
      return position !== undefined ? `${item.entity.state} · ${Math.round(position)}%` : item.entity.state;
    }
    if (item.domain === "light") {
      const brightness = numberAttribute(item, "brightness");
      return brightness !== undefined && item.active ? `${overviewText(this.hass, this.config!, "on")} · ${Math.round((brightness / 255) * 100)}%` : item.entity.state;
    }
    if (item.domain === "media_player") {
      return String(item.entity.attributes.media_title ?? item.entity.attributes.source ?? item.entity.state);
    }
    if (item.section === "floor_heating") {
      const current = numberAttribute(item, "current_temperature");
      return [item.entity.state, current !== undefined ? this.formatTemperature(current, this.areaTemperatureUnit(item)) : ""].filter(Boolean).join(" · ");
    }
    return this.hass?.formatEntityState?.(item.entity) ?? item.entity.state;
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
    const override = this.config?.area_overrides[area.id] ?? this.config?.area_overrides[area.name];
    return this.expanded[area.id] ?? override?.default_expanded ?? this.config?.default_expanded ?? false;
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

  private quickActionPending(areaId: string, action: OverviewQuickActionId): boolean {
    return this.pendingActions.has(`${areaId}:${action}:on`) || this.pendingActions.has(`${areaId}:${action}:off`);
  }

  private openFloorPopup(event: Event): void {
    event.stopPropagation();
    this.resetQuickPopup();
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

  private openQuickActionPopup(event: Event, area: OverviewArea, action: OverviewQuickActionId): void {
    event.stopPropagation();
    this.resetFloorPopup();
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

  private async handleQuickPopupGroupAction(
    event: Event,
    area: OverviewArea,
    action: OverviewQuickActionId,
    turnOn: boolean,
  ): Promise<void> {
    event.stopPropagation();
    if (!this.hass) return;
    const key = `${area.id}:${action}:${turnOn ? "on" : "off"}`;
    const members = quickActionMembers(area, action);
    const targets = quickActionActionEntities(area, action, turnOn);
    if (this.quickActionPending(area.id, action) || members.some((item) => this.pendingEntities.has(item.entityId)) || targets.length === 0) return;
    this.pendingActions = new Set([...this.pendingActions, key]);
    this.lockPendingEntities(targets);
    try {
      await runQuickActionAction(this.hass, area, action, turnOn);
    } catch (error) {
      this.reportError(error);
    } finally {
      const next = new Set(this.pendingActions);
      next.delete(key);
      this.pendingActions = next;
      this.unlockPendingEntities(targets);
    }
  }

  private handleQuickPopupEntityAction(event: Event, item: OverviewEntity, action: OverviewQuickActionId): void {
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
    if (this.pendingSections.has(key) || this.pendingSections.has(oppositeKey) || section.entities.some((item) => this.pendingEntities.has(item.entityId)) || targets.length === 0) return;
    this.pendingSections = new Set([...this.pendingSections, key]);
    this.lockPendingEntities(targets);
    try {
      await runSectionAction(this.hass, section, turnOn);
    } catch (error) {
      this.reportError(error);
    } finally {
      const next = new Set(this.pendingSections);
      next.delete(key);
      this.pendingSections = next;
      this.unlockPendingEntities(targets);
    }
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

  private toggleEntity(event: Event, item: OverviewEntity): void {
    event.stopPropagation();
    const plan = entityPowerService(item, !item.powered);
    if (!plan) return;
    void this.performEntityCall(item, () => callEntityService(this.hass!, item.entityId, plan.service, plan.data));
  }

  private runEntityService(event: Event, item: OverviewEntity, service: string): void {
    event.stopPropagation();
    void this.performEntityCall(item, () => callEntityService(this.hass!, item.entityId, service));
  }

  private setClimateTemperature(item: OverviewEntity, temperature: number): void {
    const min = numberAttribute(item, "min_temp") ?? -100;
    const max = numberAttribute(item, "max_temp") ?? 100;
    const target = Math.min(max, Math.max(min, temperature));
    void this.performEntityCall(item, () => callEntityService(this.hass!, item.entityId, "set_temperature", { temperature: target }));
  }

  private setClimateRange(item: OverviewEntity, low: number, high: number, changed: "low" | "high"): void {
    const min = numberAttribute(item, "min_temp") ?? -100;
    const max = numberAttribute(item, "max_temp") ?? 100;
    const targetLow = changed === "low" ? Math.min(high, Math.max(min, low)) : low;
    const targetHigh = changed === "high" ? Math.max(targetLow, Math.min(max, high)) : high;
    void this.performEntityCall(item, () => callEntityService(this.hass!, item.entityId, "set_temperature", {
      target_temp_low: targetLow,
      target_temp_high: targetHigh,
    }));
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

  private async performEntityCall(item: OverviewEntity, call: () => Promise<unknown>): Promise<void> {
    if (!this.hass || this.entityBusy(item)) return;
    this.pendingEntities = new Set([...this.pendingEntities, item.entityId]);
    try {
      await call();
    } catch (error) {
      this.reportError(error);
    } finally {
      const next = new Set(this.pendingEntities);
      next.delete(item.entityId);
      this.pendingEntities = next;
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
    this.style.setProperty(
      "--area-bubble-overview-card-border",
      style.card_transparent ? "transparent" : "color-mix(in srgb, var(--divider-color) 58%, transparent)",
    );
    this.style.setProperty("--area-bubble-overview-active-surface", style.active_surface);
    this.style.setProperty("--area-bubble-overview-entity-active-surface", style.entity_active_surface);
    this.style.setProperty("--area-bubble-overview-area-frame-width", `${style.area_frame_width}px`);
    if (style.area_frame_color) this.style.setProperty("--area-bubble-overview-area-frame-color", style.area_frame_color);
    else this.style.removeProperty("--area-bubble-overview-area-frame-color");
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
