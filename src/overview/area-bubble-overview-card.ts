import { LitElement, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { HomeAssistant } from "../types";
import { callEntityService, quickActionEntities, runQuickAction, runSectionOffAction, sectionActionEntities } from "./actions";
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
import "./editor";
import { climateModes, entityPowerService, supportsEntityFeature } from "./features";
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
  @state() private error?: string;
  private storageId = "overview";
  private holdTimer?: number;
  private holdPointerId?: number;
  private holdEntityId?: string;
  private holdStart?: { x: number; y: number };
  private holdTarget?: HTMLElement;
  private suppressClickEntityId?: string;
  private suppressClickUntil = 0;

  public static getConfigElement(): HTMLElement {
    return document.createElement(OVERVIEW_EDITOR_TAG);
  }

  public static getStubConfig(): Partial<AreaBubbleOverviewCardConfig> {
    return { language: "auto", rtl: "auto" };
  }

  public setConfig(config: AreaBubbleOverviewCardConfig): void {
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
    return Math.max(
      2,
      discovery.areas.reduce(
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
    `;
  }

  private renderOverallHeader(discovery: OverviewDiscovery, contentId: string) {
    if (!this.config?.show_header) return nothing;
    const show = discovery.targetKind === "floor" ? this.config.show_floor_header : Boolean(this.config.title);
    if (!show || !discovery.targetName) return nothing;
    if (discovery.targetKind === "floor") {
      const activeAreas = discovery.areas.filter((area) => area.allEntities.some((item) => item.powered)).length;
      const occupiedAreas = discovery.areas.filter((area) => area.occupancy === "occupied").length;
      const summary = [
        `${discovery.areas.length} ${this.localText("אזורים", "areas")}`,
        activeAreas ? `${activeAreas} ${this.localText("פעילים", "active")}` : "",
        this.config.show_occupancy && occupiedAreas ? `${occupiedAreas} ${this.localText("מאוכלסים", "occupied")}` : "",
      ].filter(Boolean).join(" · ");
      const label = `${this.floorExpanded ? this.localText("כיווץ קומה", "Collapse floor") : this.localText("פתיחת קומה", "Expand floor")}: ${discovery.targetName}`;
      return html`
        <div class="overview-heading floor-heading">
          <button class="floor-toggle" type="button" aria-expanded=${this.floorExpanded} aria-controls=${contentId} aria-label=${label} @click=${() => this.toggleFloor()}>
            <span class="icon-bubble small"><ha-icon icon=${discovery.targetIcon}></ha-icon></span>
            <span class="heading-main"><span class="floor-title">${discovery.targetName}</span><span class="subtitle">${summary}</span></span>
            <span class="floor-chevron ${this.floorExpanded ? "expanded" : ""}" aria-hidden="true"><ha-icon icon="mdi:chevron-down"></ha-icon></span>
          </button>
        </div>
      `;
    }
    return html`<div class="overview-heading"><span class="icon-bubble small"><ha-icon icon=${discovery.targetIcon}></ha-icon></span><div class="heading-main"><h2>${discovery.targetName}</h2></div></div>`;
  }

  private renderAreaHierarchy(areas: OverviewArea[]) {
    const byId = new Map(areas.map((area) => [area.id, area]));
    const children = new Map<string, OverviewArea[]>();
    const roots: OverviewArea[] = [];
    for (const area of areas) {
      if (area.parentAreaId && byId.has(area.parentAreaId)) {
        const siblings = children.get(area.parentAreaId) ?? [];
        siblings.push(area);
        children.set(area.parentAreaId, siblings);
      } else {
        roots.push(area);
      }
    }
    const visited = new Set<string>();
    const renderNode = (area: OverviewArea): unknown => {
      if (visited.has(area.id)) return nothing;
      visited.add(area.id);
      const nested = children.get(area.id) ?? [];
      return html`
        <div class="area-tree-node">
          ${this.renderArea(area)}
          ${nested.length
            ? html`<div class="subareas" role="group" aria-label=${`${this.localText("תתי אזורים של", "Sub-areas of")} ${area.name}`}>${nested.map(renderNode)}</div>`
            : nothing}
        </div>
      `;
    };
    const renderedRoots = roots.map(renderNode);
    const renderedOrphans = areas.filter((area) => !visited.has(area.id)).map(renderNode);
    return html`<div class="areas">${renderedRoots}${renderedOrphans}</div>`;
  }

  private renderArea(area: OverviewArea) {
    if (!this.config) return nothing;
    const expanded = this.isExpanded(area);
    const activeCount = area.allEntities.filter((item) => item.powered).length;
    const quickActions = this.config.show_quick_actions
      ? this.config.quick_actions
          .map((action) => ({ action, entities: quickActionEntities(area, action) }))
          .filter((item) => item.entities.length > 0)
      : [];
    const hasOccupancy = this.config.show_occupancy && area.occupancy !== "none";
    const hasTemperature = this.config.show_temperature && area.temperature !== undefined;
    const formattedTemperature = hasTemperature ? this.formatTemperature(area.temperature!, area.temperatureUnit) : "";
    const temperatureModeLabel = {
      none: this.localText("ללא מצב מיזוג", "No climate mode"),
      off: this.localText("המיזוג כבוי", "Climate off"),
      cool: this.localText("קירור", "Cooling"),
      heat: this.localText("חימום", "Heating"),
      active: this.localText("מצב מיזוג פעיל", "Climate active"),
    }[area.temperatureMode];
    const denseActions = quickActions.length >= 3 || (quickActions.length >= 2 && hasOccupancy && hasTemperature);
    const responsiveActions =
      (quickActions.length >= 2 && hasTemperature) ||
      (quickActions.length >= 1 && hasOccupancy && hasTemperature);
    const contentId = `overview-area-${area.id.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
    const toggleLabel = `${overviewText(this.hass, this.config, expanded ? "collapse" : "expand")}: ${area.name}`;
    return html`
      <section
        class="area-panel ${activeCount ? "has-active" : "all-off"} ${expanded ? "expanded" : ""}"
        data-powered=${activeCount ? "true" : "false"}
      >
        <header class="area-summary">
          <div class="area-summary-pill ${denseActions ? "dense-actions" : ""} ${responsiveActions ? "responsive-actions" : ""}">
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
                <span class="area-name">${area.name}</span>
                ${activeCount ? html`<span class="active-summary">${activeCount} ${this.localText("פעילים", "active")}</span>` : nothing}
              </span>
            </button>
            <div class="area-statuses">
              ${this.renderOccupancy(area)}
              ${quickActions.length ? this.renderQuickActions(area, quickActions) : nothing}
              ${hasTemperature
                ? html`<span class="temperature area-temperature temperature-${area.temperatureMode}" title=${`${formattedTemperature} · ${temperatureModeLabel}`} aria-label=${`${formattedTemperature} · ${temperatureModeLabel}`}>${formattedTemperature}</span>`
                : nothing}
            </div>
          </div>
          <button
            class="expand-button"
            type="button"
            aria-expanded=${expanded}
            aria-controls=${contentId}
            aria-label=${toggleLabel}
            @click=${() => this.toggleArea(area)}
          ><span class="chevron" aria-hidden="true"><ha-icon icon="mdi:chevron-down"></ha-icon></span></button>
        </header>
        ${expanded
          ? html`<div class="expanded-content" id=${contentId}>${area.sections.map((section) => this.renderSection(section, area.id))}</div>`
          : nothing}
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
          const key = `${area.id}:${action}`;
          const pending = this.pendingActions.has(key);
          const label = quickActionLabel(this.hass, this.config!, action);
          const accessibleLabel = `${label}: ${area.name} (${entities.length})`;
          return html`
            <button
              class="quick-action active"
              type="button"
              title=${accessibleLabel}
              aria-label=${accessibleLabel}
              aria-busy=${pending}
              ?disabled=${pending}
              @click=${(event: Event) => this.handleQuickAction(event, area, action)}
            >
              <ha-icon icon=${pending ? "mdi:loading" : this.config!.quick_action_icons[action]}></ha-icon>
              ${entities.length ? html`<span class="count-badge">${entities.length}</span>` : nothing}
            </button>
          `;
        })}
      </div>
    `;
  }

  private renderSection(section: OverviewSection, areaId: string) {
    const headingId = `overview-section-${section.id}-${areaId.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
    const actionKey = `${areaId}:${section.id}`;
    const targets = sectionActionEntities(section);
    const pending = this.pendingSections.has(actionKey);
    const actionVerb = section.id === "covers" ? this.localText("סגירת כל התריסים", "Close all covers") : this.localText("כיבוי כללי", "Turn everything off");
    const actionLabel = `${actionVerb}: ${section.title} (${targets.length})`;
    return html`
      <section class="device-section section-${section.id}" aria-labelledby=${headingId}>
        <h3 class="section-heading" id=${headingId}>
          <ha-icon icon=${section.icon}></ha-icon>
          <span class="section-title" title=${section.title}>${section.title}</span>
          <span class="section-count">${section.activeCount}/${section.entities.length}</span>
          <button
            class="section-off-button"
            type="button"
            title=${actionLabel}
            aria-label=${actionLabel}
            aria-busy=${pending}
            ?disabled=${pending || targets.length === 0}
            @click=${(event: Event) => this.handleSectionOff(event, section, areaId)}
          ><ha-icon icon=${pending ? "mdi:loading" : section.id === "covers" ? "mdi:window-shutter-alert" : "mdi:power"}></ha-icon></button>
        </h3>
        <div class="section-entities">
          ${section.entities.length
            ? section.entities.map((item) => this.renderEntity(item, section.id))
            : html`<div class="secondary section-empty">${this.config && overviewLanguage(this.hass, this.config) === "he" ? "אין רכיבים בסעיף" : "No devices in this section"}</div>`}
        </div>
      </section>
    `;
  }

  private renderEntity(item: OverviewEntity, section: OverviewSection["id"]) {
    if (section === "floor_heating") return this.renderFloorHeating(item);
    if (item.domain === "climate") return this.renderClimate(item);
    if (item.domain === "cover") return this.renderCover(item);
    if (item.domain === "media_player") return this.renderMedia(item);
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
    const busy = this.pendingEntities.has(item.entityId);
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
    const busy = this.pendingEntities.has(item.entityId);
    const modeIcon = this.climateModeIcon(item);
    const powerPlan = entityPowerService(item, !item.powered);
    return html`
      <article class="climate-card entity-card full-span mode-${item.entity.state} ${item.active ? "active" : ""} ${item.available ? "" : "unavailable"}" aria-busy=${busy}>
        <div class="climate-primary">
          ${this.renderEntityLead(item)}
          <button
            class="climate-mode-button ${item.active ? "active" : ""}"
            type="button"
            ?disabled=${!item.available || busy || !powerPlan}
            aria-pressed=${item.powered}
            aria-label=${`${item.powered ? overviewText(this.hass, this.config!, "turn_off") : overviewText(this.hass, this.config!, "on")}: ${item.name}`}
            @click=${(event: Event) => this.toggleEntity(event, item)}
          ><ha-icon icon=${busy ? "mdi:loading" : modeIcon}></ha-icon></button>
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
            ? html`<label class="select-pill">
                <ha-icon icon=${modeIcon}></ha-icon>
                <select .value=${item.entity.state} ?disabled=${busy || !item.available} @change=${(event: Event) => this.setClimateMode(item, event)} aria-label=${`${this.localText("מצב מיזוג", "HVAC mode")}: ${item.name}`}>
                  ${modes.map((mode) => html`<option value=${mode} ?selected=${mode === item.entity.state}>${mode.replace(/_/g, " ")}</option>`)}
                </select>
                <ha-icon class="select-chevron" icon="mdi:chevron-down"></ha-icon>
              </label>`
            : nothing}
          ${fanModes.length
            ? html`<label class="select-pill">
                <ha-icon icon="mdi:fan"></ha-icon>
                <select .value=${String(item.entity.attributes.fan_mode ?? "")} ?disabled=${busy || !item.available} @change=${(event: Event) => this.setFanMode(item, event)} aria-label=${`${this.localText("מהירות מאוורר", "Fan mode")}: ${item.name}`}>
                  ${fanModes.map((mode) => html`<option value=${mode} ?selected=${mode === String(item.entity.attributes.fan_mode ?? "")}>${mode.replace(/_/g, " ")}</option>`)}
                </select>
                <ha-icon class="select-chevron" icon="mdi:chevron-down"></ha-icon>
              </label>`
            : nothing}
          </div>`
          : nothing}
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
    const busy = this.pendingEntities.has(item.entityId);
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
    const busy = this.pendingEntities.has(item.entityId);
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
    const busy = this.pendingEntities.has(item.entityId);
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

  private climateModeIcon(item: OverviewEntity): string {
    const mode = item.entity.state;
    if (mode === "cool") return "mdi:snowflake";
    if (mode === "heat") return "mdi:fire";
    if (mode === "dry") return "mdi:water-percent";
    if (mode === "fan_only") return "mdi:fan";
    if (mode === "heat_cool" || mode === "auto") return "mdi:autorenew";
    return "mdi:power";
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
      this.moreInfo(item);
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
    if (!this.consumeHeldClick(event, item)) this.moreInfo(item);
  }

  private handleToggleClick(event: Event, item: OverviewEntity): void {
    if (this.consumeHeldClick(event, item)) return;
    if (!item.available || this.pendingEntities.has(item.entityId) || !entityPowerService(item, !item.powered)) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    this.toggleEntity(event, item);
  }

  private async handleQuickAction(event: Event, area: OverviewArea, action: OverviewQuickActionId): Promise<void> {
    event.stopPropagation();
    if (!this.hass) return;
    const key = `${area.id}:${action}`;
    if (this.pendingActions.has(key)) return;
    this.pendingActions = new Set([...this.pendingActions, key]);
    try {
      await runQuickAction(this.hass, area, action);
    } catch (error) {
      this.reportError(error);
    } finally {
      const next = new Set(this.pendingActions);
      next.delete(key);
      this.pendingActions = next;
    }
  }

  private async handleSectionOff(event: Event, section: OverviewSection, areaId: string): Promise<void> {
    event.stopPropagation();
    if (!this.hass) return;
    const key = `${areaId}:${section.id}`;
    if (this.pendingSections.has(key) || sectionActionEntities(section).length === 0) return;
    this.pendingSections = new Set([...this.pendingSections, key]);
    try {
      await runSectionOffAction(this.hass, section);
    } catch (error) {
      this.reportError(error);
    } finally {
      const next = new Set(this.pendingSections);
      next.delete(key);
      this.pendingSections = next;
    }
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

  private setClimateMode(item: OverviewEntity, event: Event): void {
    event.stopPropagation();
    const hvacMode = (event.target as HTMLSelectElement).value;
    void this.performEntityCall(item, () => callEntityService(this.hass!, item.entityId, "set_hvac_mode", { hvac_mode: hvacMode }));
  }

  private setFanMode(item: OverviewEntity, event: Event): void {
    event.stopPropagation();
    const fanMode = (event.target as HTMLSelectElement).value;
    void this.performEntityCall(item, () => callEntityService(this.hass!, item.entityId, "set_fan_mode", { fan_mode: fanMode }));
  }

  private setMediaVolume(event: Event, item: OverviewEntity, volume: number): void {
    event.stopPropagation();
    void this.performEntityCall(item, () => callEntityService(this.hass!, item.entityId, "volume_set", { volume_level: Math.min(1, Math.max(0, volume)) }));
  }

  private async performEntityCall(item: OverviewEntity, call: () => Promise<unknown>): Promise<void> {
    if (!this.hass || this.pendingEntities.has(item.entityId)) return;
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
    this.style.setProperty("--area-bubble-overview-row-height", `${style.row_height}px`);
    this.style.setProperty("--area-bubble-overview-accent", style.accent_color);
    this.style.setProperty("--area-bubble-overview-active", style.active_color);
    this.style.setProperty("--area-bubble-overview-row-bg", style.row_background);
    this.style.setProperty("--area-bubble-overview-active-surface", style.active_surface);
    this.style.setProperty("--area-bubble-overview-climate-surface", style.climate_surface);
    this.style.setProperty("--area-bubble-overview-control-surface", style.control_surface);
    this.style.setProperty("--area-bubble-overview-climate-color", style.climate_color);
    this.style.setProperty("--area-bubble-overview-cover-color", style.cover_color);
    this.style.setProperty("--area-bubble-overview-media-color", style.media_color);
    this.style.setProperty("--area-bubble-overview-temperature-off-surface", style.temperature_off_surface);
    this.style.setProperty("--area-bubble-overview-temperature-cool-surface", style.temperature_cool_surface);
    this.style.setProperty("--area-bubble-overview-temperature-heat-surface", style.temperature_heat_surface);
    this.style.setProperty("--area-bubble-overview-temperature-active-surface", style.temperature_active_surface);
    this.style.setProperty(
      "--area-bubble-overview-shadow",
      style.show_shadows ? `0 12px 30px rgba(0,0,0,${style.shadow_intensity})` : "none",
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
