import { LitElement, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { HomeAssistant } from "../types";
import { callEntityService, quickActionEntities, runQuickAction } from "./actions";
import { resolveOverviewConfig, validateOverviewConfig } from "./config";
import { OVERVIEW_CARD_TAG, OVERVIEW_CARD_TYPE, OVERVIEW_EDITOR_TAG, OVERVIEW_STORAGE_PREFIX, QUICK_ACTION_ICONS } from "./constants";
import { discoverOverview } from "./discovery";
import "./editor";
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
  @state() private pendingActions = new Set<string>();
  @state() private pendingEntities = new Set<string>();
  @state() private error?: string;
  private storageId = "overview";

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
      this.error = undefined;
    } catch (error) {
      this.error = error instanceof Error ? error.message : String(error);
    }
  }

  public getCardSize(): number {
    if (!this.config) return 3;
    const discovery = discoverOverview(this.hass, this.config);
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

  protected override render() {
    if (this.error) return html`<ha-card><div class="root"><div class="warning">${this.error}</div></div></ha-card>`;
    if (!this.config) return nothing;
    const rtl = overviewRtl(this.hass, this.config);
    this.setAttribute("dir", rtl ? "rtl" : "ltr");
    this.style.setProperty("--aboc-direction", rtl ? "rtl" : "ltr");
    this.applyStyleVariables();

    const discovery = discoverOverview(this.hass, this.config);
    return html`
      <ha-card>
        <div class="root">
          ${this.renderOverallHeader(discovery)}
          ${discovery.targetKind === "none"
            ? this.renderEmpty(overviewText(this.hass, this.config, "choose_target"), "mdi:map-marker-plus-outline")
            : discovery.areas.length
              ? html`<div class="areas">${discovery.areas.map((area) => this.renderArea(area))}</div>`
              : this.renderEmpty(overviewText(this.hass, this.config, "no_areas"), "mdi:home-search-outline")}
          ${discovery.warnings.length && discovery.targetKind !== "none"
            ? html`<div class="warning">${discovery.warnings.join(" · ")}</div>`
            : nothing}
          ${this.config.debug ? html`<pre class="debug">${JSON.stringify(discovery, null, 2)}</pre>` : nothing}
        </div>
      </ha-card>
    `;
  }

  private renderOverallHeader(discovery: OverviewDiscovery) {
    if (!this.config?.show_header) return nothing;
    const show = discovery.targetKind === "floor" ? this.config.show_floor_header : Boolean(this.config.title);
    if (!show || !discovery.targetName) return nothing;
    return html`
      <div class="overview-heading">
        <span class="icon-bubble small"><ha-icon icon=${discovery.targetIcon}></ha-icon></span>
        <div class="heading-main">
          <h2>${discovery.targetName}</h2>
          ${discovery.targetKind === "floor"
            ? html`<div class="subtitle">${discovery.areas.length} ${overviewLanguage(this.hass, this.config) === "he" ? "אזורים" : "areas"}</div>`
            : nothing}
        </div>
      </div>
    `;
  }

  private renderArea(area: OverviewArea) {
    if (!this.config) return nothing;
    const expanded = this.isExpanded(area);
    const activeCount = area.allEntities.filter((item) => item.active).length;
    return html`
      <section class="area-panel ${expanded ? "expanded" : ""}">
        <div class="area-summary">
          <button
            class="area-toggle"
            type="button"
            aria-expanded=${expanded}
            aria-label=${overviewText(this.hass, this.config, expanded ? "collapse" : "expand")}
            @click=${() => this.toggleArea(area)}
          >
            <span class="icon-bubble"><ha-icon icon=${area.icon}></ha-icon></span>
            <span class="area-main">
              <span class="area-name">${area.name}</span>
              <span class="summary-chips">
                ${activeCount
                  ? html`<span class="summary-chip"><ha-icon icon="mdi:power-plug"></ha-icon>${activeCount}</span>`
                  : nothing}
                ${this.renderOccupancy(area)}
              </span>
            </span>
            ${this.config.show_temperature && area.temperature !== undefined
              ? html`<span class="temperature">${this.formatTemperature(area.temperature, area.temperatureUnit)}</span>`
              : nothing}
            <span class="chevron" aria-hidden="true"><ha-icon icon="mdi:chevron-down"></ha-icon></span>
          </button>
          ${this.config.show_quick_actions ? this.renderQuickActions(area) : nothing}
        </div>
        ${expanded
          ? html`<div class="expanded-content">${area.sections.map((section) => this.renderSection(section))}</div>`
          : nothing}
      </section>
    `;
  }

  private renderOccupancy(area: OverviewArea) {
    if (!this.config?.show_occupancy || area.occupancy === "none") return nothing;
    const occupied = area.occupancy === "occupied";
    const icon = occupied ? "mdi:account-check" : area.occupancy === "vacant" ? "mdi:account-off-outline" : "mdi:account-question-outline";
    return html`
      <span class="summary-chip ${occupied ? "occupied" : ""}">
        <ha-icon icon=${icon}></ha-icon>
        ${overviewText(this.hass, this.config, area.occupancy === "occupied" ? "occupied" : area.occupancy === "vacant" ? "vacant" : "unknown")}
      </span>
    `;
  }

  private renderQuickActions(area: OverviewArea) {
    if (!this.config) return nothing;
    return html`
      <div class="quick-actions" aria-label=${overviewLanguage(this.hass, this.config) === "he" ? "פעולות מהירות" : "Quick actions"}>
        ${this.config.quick_actions.map((action) => {
          const entities = quickActionEntities(area, action);
          const key = `${area.id}:${action}`;
          const pending = this.pendingActions.has(key);
          const label = quickActionLabel(this.hass, this.config!, action);
          return html`
            <button
              class="quick-action ${entities.length ? "active" : ""}"
              type="button"
              title=${label}
              aria-label=${label}
              ?disabled=${!entities.length || pending}
              @click=${(event: Event) => this.handleQuickAction(event, area, action)}
            >
              <ha-icon icon=${pending ? "mdi:loading" : QUICK_ACTION_ICONS[action]}></ha-icon>
              ${entities.length ? html`<span class="count-badge">${entities.length}</span>` : nothing}
            </button>
          `;
        })}
      </div>
    `;
  }

  private renderSection(section: OverviewSection) {
    return html`
      <div class="device-section">
        <div class="section-heading">
          <ha-icon icon=${section.icon}></ha-icon>
          <span>${section.title}</span>
          <span class="section-count">${section.activeCount}/${section.entities.length}</span>
        </div>
        ${section.entities.length
          ? section.entities.map((item) => this.renderEntity(item))
          : html`<div class="secondary">${this.config && overviewLanguage(this.hass, this.config) === "he" ? "אין רכיבים בסעיף" : "No devices in this section"}</div>`}
      </div>
    `;
  }

  private renderEntity(item: OverviewEntity) {
    if (item.domain === "climate") return this.renderClimate(item);
    if (item.domain === "cover") return this.renderCover(item);
    if (item.domain === "media_player") return this.renderMedia(item);
    return this.renderToggle(item);
  }

  private renderEntityLead(item: OverviewEntity) {
    return html`
      <button class="entity-lead" type="button" @click=${() => this.moreInfo(item)}>
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
    return html`
      <div class="entity-row ${item.active ? "active" : ""} ${item.available ? "" : "unavailable"}">
        ${this.renderEntityLead(item)}
        <span class="entity-controls">
          <button
            class="control-button ${item.active ? "active" : ""}"
            type="button"
            title=${item.active ? overviewText(this.hass, this.config!, "turn_off") : overviewText(this.hass, this.config!, "on")}
            ?disabled=${!item.available || busy}
            @click=${(event: Event) => this.toggleEntity(event, item)}
          ><ha-icon icon=${busy ? "mdi:loading" : item.active ? "mdi:power" : "mdi:power-off"}></ha-icon></button>
        </span>
      </div>
    `;
  }

  private renderClimate(item: OverviewEntity) {
    const target = numberAttribute(item, "temperature");
    const current = numberAttribute(item, "current_temperature");
    const step = numberAttribute(item, "target_temp_step") ?? 0.5;
    const modes = Array.isArray(item.entity.attributes.hvac_modes) ? item.entity.attributes.hvac_modes.map(String) : [];
    const fanModes = Array.isArray(item.entity.attributes.fan_modes) ? item.entity.attributes.fan_modes.map(String) : [];
    const busy = this.pendingEntities.has(item.entityId);
    return html`
      <div class="entity-row wide-row ${item.active ? "active" : ""} ${item.available ? "" : "unavailable"}">
        ${this.renderEntityLead(item)}
        <div class="climate-controls" @click=${(event: Event) => event.stopPropagation()}>
          <button
            class="control-button ${item.active ? "active" : ""}"
            type="button"
            ?disabled=${!item.available || busy}
            @click=${(event: Event) => this.toggleEntity(event, item)}
          ><ha-icon icon="mdi:power"></ha-icon></button>
          ${target !== undefined
            ? html`
                <span class="temperature-stepper">
                  <button type="button" ?disabled=${busy} @click=${() => this.setClimateTemperature(item, target - step)} aria-label="Decrease temperature">−</button>
                  <span>${this.formatTemperature(target, this.areaTemperatureUnit(item))}</span>
                  <button type="button" ?disabled=${busy} @click=${() => this.setClimateTemperature(item, target + step)} aria-label="Increase temperature">+</button>
                </span>
              `
            : current !== undefined
              ? html`<span class="temperature">${this.formatTemperature(current, this.areaTemperatureUnit(item))}</span>`
              : nothing}
          ${modes.length
            ? html`<select .value=${item.entity.state} ?disabled=${busy} @change=${(event: Event) => this.setClimateMode(item, event)} aria-label="HVAC mode">
                ${modes.map((mode) => html`<option value=${mode} ?selected=${mode === item.entity.state}>${mode.replace(/_/g, " ")}</option>`)}
              </select>`
            : nothing}
          ${fanModes.length
            ? html`<select .value=${String(item.entity.attributes.fan_mode ?? "")} ?disabled=${busy} @change=${(event: Event) => this.setFanMode(item, event)} aria-label="Fan mode">
                ${fanModes.map((mode) => html`<option value=${mode} ?selected=${mode === String(item.entity.attributes.fan_mode ?? "")}>${mode.replace(/_/g, " ")}</option>`)}
              </select>`
            : nothing}
        </div>
      </div>
    `;
  }

  private renderCover(item: OverviewEntity) {
    const busy = this.pendingEntities.has(item.entityId);
    const supportedFeatures = numberAttribute(item, "supported_features");
    const services = [
      { service: "open_cover", icon: "mdi:arrow-up", feature: 1 },
      { service: "stop_cover", icon: "mdi:stop", feature: 8 },
      { service: "close_cover", icon: "mdi:arrow-down", feature: 2 },
    ].filter(({ feature }) => supportedFeatures === undefined || (supportedFeatures & feature) !== 0);
    return html`
      <div class="entity-row ${item.active ? "active" : ""} ${item.available ? "" : "unavailable"}">
        ${this.renderEntityLead(item)}
        <span class="entity-controls">
          ${services.map(({ service, icon }) => html`
            <button
              class="control-button"
              type="button"
              ?disabled=${!item.available || busy}
              @click=${(event: Event) => this.runEntityService(event, item, service)}
              aria-label=${service.replace("_cover", "")}
            ><ha-icon icon=${icon}></ha-icon></button>
          `)}
        </span>
      </div>
    `;
  }

  private renderMedia(item: OverviewEntity) {
    const busy = this.pendingEntities.has(item.entityId);
    const playing = item.entity.state === "playing";
    const volume = numberAttribute(item, "volume_level");
    return html`
      <div class="entity-row wide-row ${item.active ? "active" : ""} ${item.available ? "" : "unavailable"}">
        ${this.renderEntityLead(item)}
        <div class="media-controls">
          ${volume !== undefined
            ? html`
                <button class="control-button" type="button" ?disabled=${busy} @click=${(event: Event) => this.setMediaVolume(event, item, volume - 0.05)} aria-label="Volume down"><ha-icon icon="mdi:volume-minus"></ha-icon></button>
                <span class="secondary">${Math.round(volume * 100)}%</span>
                <button class="control-button" type="button" ?disabled=${busy} @click=${(event: Event) => this.setMediaVolume(event, item, volume + 0.05)} aria-label="Volume up"><ha-icon icon="mdi:volume-plus"></ha-icon></button>
              `
            : nothing}
          <button class="control-button ${playing ? "active" : ""}" type="button" ?disabled=${busy || !item.available} @click=${(event: Event) => this.runEntityService(event, item, playing ? "media_pause" : "media_play")} aria-label=${playing ? "Pause" : "Play"}><ha-icon icon=${playing ? "mdi:pause" : "mdi:play"}></ha-icon></button>
          <button class="control-button" type="button" ?disabled=${busy || !item.available} @click=${(event: Event) => this.runEntityService(event, item, item.active ? "turn_off" : "turn_on")} aria-label="Power"><ha-icon icon="mdi:power"></ha-icon></button>
        </div>
      </div>
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
    return this.hass?.formatEntityState?.(item.entity) ?? item.entity.state;
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

  private toggleEntity(event: Event, item: OverviewEntity): void {
    event.stopPropagation();
    const service = item.active ? "turn_off" : "turn_on";
    void this.performEntityCall(item, () => callEntityService(this.hass!, item.entityId, service));
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
