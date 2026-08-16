import { LitElement, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { CARD_TAG, EDITOR_TAG } from "./constants";
import "./editor";
import { cardStyles } from "./styles";
import { resolveConfig, validateConfig } from "./helpers/config";
import { discoverActiveEntities } from "./helpers/entity";
import { readExpandedState, writeExpandedState } from "./helpers/storage";
import { safeTurnOffCandidates } from "./helpers/safety";
import { turnOffAreaViaHomeAssistant, turnOffEntitiesByDomain, turnOffEntity } from "./helpers/services";
import { displaySecondary } from "./helpers/format";
import { domainLabel, resolveLanguage, resolveRtl, t } from "./translations";
import type { AreaBubbleExpanderCardConfig, AreaGroup, DiscoveredEntity, HomeAssistant, LovelaceAction, ResolvedConfig } from "./types";

@customElement(CARD_TAG)
export class AreaBubbleExpanderCard extends LitElement {
  static override styles = cardStyles;

  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private config?: ResolvedConfig;
  @state() private expanded: Record<string, boolean> = {};
  @state() private error?: string;

  private cardId = Math.random().toString(36).slice(2);

  public static getConfigElement(): HTMLElement {
    return document.createElement(EDITOR_TAG);
  }

  public static getStubConfig(): Partial<AreaBubbleExpanderCardConfig> {
    return { language: "auto", rtl: "auto" };
  }

  public setConfig(config: AreaBubbleExpanderCardConfig): void {
    try {
      validateConfig(config);
      this.config = resolveConfig(config);
      this.cardId = config.id || this.stableCardId(config);
      this.expanded = this.config.remember_expanded_state ? readExpandedState(this.cardId) : {};
      this.error = undefined;
    } catch (err) {
      this.error = err instanceof Error ? err.message : String(err);
    }
  }

  public getCardSize(): number {
    if (!this.hass || !this.config) return 3;
    const { groups } = discoverActiveEntities(this.hass, this.config);
    return Math.max(2, 1 + groups.reduce((size, group) => size + (this.isExpanded(group) ? group.entities.length : 1), 0));
  }

  public getGridOptions(): Record<string, number> {
    return { columns: 12, min_columns: 6 };
  }

  protected override render() {
    if (this.error) return html`<ha-card><div class="root">${this.error}</div></ha-card>`;
    if (!this.config) return nothing;

    const rtl = resolveRtl(this.hass, this.config);
    this.style.setProperty("--abec-direction", rtl ? "rtl" : "ltr");
    this.setAttribute("dir", rtl ? "rtl" : "ltr");
    this.toggleAttribute("animations-disabled", !this.config.enable_animations);
    this.toggleAttribute("respect-reduced-motion", this.config.respect_reduced_motion);
    this.toggleAttribute("compact", this.config.style.compact);
    this.applyStyleVars();

    const { groups, skipped } = discoverActiveEntities(this.hass, this.config);
    const total = groups.reduce((sum, group) => sum + group.entities.length, 0);
    const activeAreas = groups.length;

    return html`
      <ha-card>
        <div class="root">
          ${this.config.show_header ? this.renderHeader(groups, total, activeAreas) : nothing}
          ${groups.length ? html`<div class="sections">${groups.map((group) => this.renderArea(group))}</div>` : this.renderEmpty()}
          ${this.config.debug || this.config.show_debug
            ? html`<div class="debug">${JSON.stringify(skipped.slice(0, 80), null, 2)}</div>`
            : nothing}
        </div>
      </ha-card>
    `;
  }

  private renderHeader(groups: AreaGroup[], total: number, activeAreas: number) {
    if (!this.config) return nothing;
    const title = this.config.title || t(this.config, this.hass, "title");
    const subtitle = [
      this.config.show_total_count ? `${total} ${t(this.config, this.hass, "active_entities")}` : "",
      this.config.show_active_area_count ? `${activeAreas} ${t(this.config, this.hass, "active_areas")}` : "",
    ]
      .filter(Boolean)
      .join(" · ");

    return html`
      <div class="header">
        <div class="title">
          <div>${title}</div>
          ${subtitle ? html`<div class="subtitle">${subtitle}</div>` : nothing}
        </div>
        ${this.config.show_global_turn_off
          ? html`
              <button
                class="icon-button danger"
                title=${t(this.config, this.hass, "turn_off_all")}
                aria-label=${t(this.config, this.hass, "turn_off_all")}
                @click=${(ev: Event) => this.turnOffGlobal(ev, groups)}
              >
                <ha-icon icon="mdi:power"></ha-icon>
              </button>
            `
          : nothing}
      </div>
    `;
  }

  private renderArea(group: AreaGroup) {
    if (!this.config) return nothing;
    const expanded = this.isExpanded(group);
    const preview = group.entities.slice(0, this.config.preview_entity_count).map((item) => item.name).join(" · ");
    const candidates = safeTurnOffCandidates(group.entities, this.config);
    const areaOverride = this.config.areas[group.id] ?? this.config.areas[group.name];
    const allowTurnOff = areaOverride?.allow_turn_off !== false && candidates.length > 0;

    const shownEntities =
      this.config.max_entities_per_area > 0 ? group.entities.slice(0, this.config.max_entities_per_area) : group.entities;
    const hiddenCount = group.entities.length - shownEntities.length;

    return html`
      <section class="area-section ${expanded ? "expanded" : ""}" style=${areaOverride?.accent_color ? `--abec-accent:${areaOverride.accent_color}` : ""}>
        <div class="area-header">
          <button
            class="area-toggle"
            type="button"
            aria-expanded=${expanded}
            aria-label=${`${t(this.config, this.hass, expanded ? "collapse_area" : "expand_area")}: ${group.name}`}
            ?disabled=${!this.config.expand_on_header_tap}
            @click=${() => this.toggleArea(group)}
          >
            ${this.config.show_area_icons ? html`<span class="icon-bubble area-icon"><ha-icon icon=${group.icon}></ha-icon></span>` : nothing}
            <span class="area-main">
              <span class="area-line">
                <span class="area-name">${group.name}</span>
                <span class="count">${group.entities.length} ${t(this.config, this.hass, "active_entities")}</span>
              </span>
              ${this.config.show_preview_entities && !expanded && preview ? html`<span class="preview">${preview}</span>` : nothing}
              ${this.config.show_domain_chips ? this.renderDomainChips(group) : nothing}
              ${this.config.show_area_ids ? html`<span class="preview">${group.id}</span>` : nothing}
            </span>
          </button>
          <span class="controls">
            ${this.config.show_area_turn_off
              ? html`
                  <button
                    class="icon-button danger"
                    ?disabled=${!allowTurnOff}
                    title=${t(this.config, this.hass, "turn_off_area")}
                    aria-label=${t(this.config, this.hass, "turn_off_area")}
                    @click=${(ev: Event) => this.turnOffArea(ev, group)}
                  >
                    <ha-icon icon="mdi:power"></ha-icon>
                  </button>
                `
              : nothing}
            <span class="icon-button chevron" aria-hidden="true"><ha-icon icon="mdi:chevron-down"></ha-icon></span>
          </span>
        </div>
        ${expanded
          ? html`
              <div class="entities">
                ${shownEntities.map((item) => this.renderEntity(item))}
                ${hiddenCount > 0 ? html`<div class="secondary">${hiddenCount} ${t(this.config, this.hass, "show_more")}</div>` : nothing}
              </div>
            `
          : nothing}
      </section>
    `;
  }

  private renderDomainChips(group: AreaGroup) {
    if (!this.config) return nothing;
    return html`
      <div class="chips">
        ${Object.entries(group.domainCounts).map(([domain, count]) => {
          const mode = this.config?.domain_chip_mode ?? "icons";
          return html`
            <span class="chip" title=${domainLabel(this.config!, this.hass, domain)}>
              ${mode !== "text" ? html`<ha-icon icon=${this.config!.domain_icons[domain] ?? "mdi:circle"}></ha-icon>` : nothing}
              ${mode !== "icons" ? html`<span>${count} ${domainLabel(this.config!, this.hass, domain)}</span>` : html`<span>${count}</span>`}
            </span>
          `;
        })}
      </div>
    `;
  }

  private renderEntity(item: DiscoveredEntity) {
    if (!this.config) return nothing;
    const secondary = this.config.show_entity_secondary_info ? displaySecondary(item, this.config) : "";
    return html`
      <div
        class="entity-row"
      >
        <button
          class="entity-lead"
          type="button"
          @click=${() => this.handleAction(item, this.config?.tap_action ?? { action: "more-info" })}
          @contextmenu=${(ev: Event) => this.handleHoldAction(ev, item)}
          @dblclick=${() => this.handleAction(item, this.config?.double_tap_action ?? { action: "none" })}
        >
          ${this.config.show_entity_icons ? html`<span class="icon-bubble entity-icon"><ha-icon icon=${item.icon}></ha-icon></span>` : nothing}
          <span class="entity-main">
            <span class="entity-line">
              <span class="entity-name">${item.name}</span>
              ${item.protected
                ? html`<span class="protected-badge"><ha-icon icon="mdi:lock"></ha-icon>${t(this.config, this.hass, "protected")}</span>`
                : nothing}
            </span>
            ${secondary ? html`<span class="secondary">${secondary}</span>` : nothing}
          </span>
        </button>
        ${this.config.show_entity_turn_off
          ? html`
              <button
                class="icon-button danger"
                ?disabled=${!item.controllable}
                title=${item.disabledReason ?? t(this.config, this.hass, "turn_off_entity")}
                aria-label=${t(this.config, this.hass, "turn_off_entity")}
                @click=${(ev: Event) => this.turnOffEntity(ev, item)}
              >
                <ha-icon icon=${item.protected ? "mdi:lock" : "mdi:power"}></ha-icon>
              </button>
            `
          : nothing}
      </div>
    `;
  }

  private renderEmpty() {
    if (!this.config || !this.config.show_empty) return nothing;
    return html`
      <div class="empty">
        <ha-icon icon="mdi:home-check-outline"></ha-icon>
        <div class="empty-title">${this.config.empty_title || t(this.config, this.hass, "empty_title")}</div>
        <div class="subtitle">${this.config.empty_subtitle || t(this.config, this.hass, "empty_subtitle")}</div>
      </div>
    `;
  }

  private isExpanded(group: AreaGroup): boolean {
    if (!this.config) return false;
    const override = this.config.areas[group.id] ?? this.config.areas[group.name];
    return this.expanded[group.id] ?? override?.default_expanded ?? this.config.default_expanded;
  }

  private toggleArea(group: AreaGroup): void {
    if (!this.config?.expand_on_header_tap) return;
    this.expanded = { ...this.expanded, [group.id]: !this.isExpanded(group) };
    if (this.config.remember_expanded_state) writeExpandedState(this.cardId, this.expanded);
  }

  private handleHoldAction(ev: Event, item: DiscoveredEntity): void {
    ev.preventDefault();
    this.handleAction(item, this.config?.hold_action ?? { action: "none" });
  }

  private async turnOffEntity(ev: Event, item: DiscoveredEntity): Promise<void> {
    ev.stopPropagation();
    if (!this.hass || !this.config || !item.controllable) return;
    const requireConfirm = this.config.confirm_entity_turn_off || this.config.dangerous_domains.includes(item.domain);
    if (requireConfirm && !window.confirm(t(this.config, this.hass, "confirm_entity_turn_off", { entity: item.name }))) return;
    try {
      await turnOffEntity(this.hass, item, this.config);
    } catch (err) {
      this.reportError(err);
    }
  }

  private async turnOffArea(ev: Event, group: AreaGroup): Promise<void> {
    ev.stopPropagation();
    if (!this.hass || !this.config) return;
    const candidates = safeTurnOffCandidates(group.entities, this.config);
    if (!candidates.length) return;
    const areaOverride = this.config.areas[group.id] ?? this.config.areas[group.name];
    const defaultConfirm =
      this.config.confirm_area_turn_off ||
      this.config.area_turn_off_mode === "homeassistant_area" ||
      candidates.some((item) => this.config!.dangerous_domains.includes(item.domain));
    const requireConfirm = areaOverride?.confirm_turn_off ?? defaultConfirm;
    const message = `${t(this.config, this.hass, "confirm_area_turn_off", { area: group.name, count: candidates.length })}\n${t(
      this.config,
      this.hass,
      "protected_will_remain",
    )}`;
    if (requireConfirm && !window.confirm(message)) return;
    try {
      if (this.config.area_turn_off_mode === "homeassistant_area") await turnOffAreaViaHomeAssistant(this.hass, group.id);
      else await turnOffEntitiesByDomain(this.hass, candidates, this.config);
    } catch (err) {
      this.reportError(err);
    }
  }

  private async turnOffGlobal(ev: Event, groups: AreaGroup[]): Promise<void> {
    ev.stopPropagation();
    if (!this.hass || !this.config) return;
    const candidates = safeTurnOffCandidates(groups.flatMap((group) => group.entities), this.config);
    if (!candidates.length) return;
    const requireConfirm = this.config.confirm_global_turn_off || candidates.some((item) => this.config!.dangerous_domains.includes(item.domain));
    if (requireConfirm && !window.confirm(t(this.config, this.hass, "confirm_global_turn_off"))) return;
    try {
      await turnOffEntitiesByDomain(this.hass, candidates, this.config);
    } catch (err) {
      this.reportError(err);
    }
  }

  private handleAction(item: DiscoveredEntity, action: LovelaceAction): void {
    if (!this.hass) return;
    if (action.action === "none") return;
    if (action.action === "more-info") {
      this.dispatchEvent(new CustomEvent("hass-more-info", { bubbles: true, composed: true, detail: { entityId: item.entityId } }));
      return;
    }
    if (action.action === "toggle") {
      void this.hass.callService("homeassistant", "toggle", undefined, { entity_id: item.entityId })
        .catch((error) => this.reportError(error));
      return;
    }
    if (action.action === "turn-off") {
      void this.turnOffEntity(new Event("click"), item);
      return;
    }
    if (action.action === "navigate") history.pushState(null, "", action.navigation_path);
    if (action.action === "url") window.open(action.url_path, "_blank", "noopener");
    if (action.action === "call-service") {
      const parts = action.service.split(".");
      const [domain, service] = parts;
      if (parts.length !== 2 || !domain || !service) {
        this.reportError(new Error(`Invalid action service: ${action.service}`));
        return;
      }
      void this.hass.callService(domain, service, action.service_data, action.target ?? { entity_id: item.entityId })
        .catch((error) => this.reportError(error));
    }
  }

  private reportError(err: unknown): void {
    const message = err instanceof Error ? err.message : String(err);
    if (this.config?.debug) console.warn("[area-bubble-expander-card]", err);
    this.dispatchEvent(new CustomEvent("hass-notification", { bubbles: true, composed: true, detail: { message } }));
  }

  private applyStyleVars(): void {
    if (!this.config) return;
    const style = this.config.style;
    this.style.setProperty("--area-bubble-expander-card-border-radius", `${style.border_radius}px`);
    this.style.setProperty("--area-bubble-expander-card-glass-blur", `${style.glass ? style.blur : 0}px`);
    this.style.setProperty("--area-bubble-expander-card-accent-color", style.accent_color);
    this.style.setProperty("--area-bubble-expander-card-danger-color", style.danger_color);
    this.style.setProperty("--area-bubble-expander-card-section-gap", `${style.section_gap}px`);
    this.style.setProperty("--area-bubble-expander-card-row-height", `${style.row_height}px`);
    this.style.setProperty("--area-bubble-expander-card-header-font-size", `${style.text_size}px`);
    this.style.setProperty("--area-bubble-expander-card-secondary-font-size", `${style.secondary_text_size}px`);
    this.style.setProperty("--area-bubble-expander-card-chip-background", style.chip_background);
    this.style.setProperty("--area-bubble-expander-card-row-background", style.row_background);
    this.style.setProperty("--area-bubble-expander-card-header-background", style.header_background);
    this.style.setProperty("--area-bubble-expander-card-background", style.collapsed_background);
    this.style.setProperty("--area-bubble-expander-card-background-expanded", style.expanded_background);
    this.style.setProperty("--area-bubble-expander-card-border-color", `rgba(255,255,255,${style.border_opacity})`);
    this.style.setProperty("--area-bubble-expander-card-area-icon-size", `${style.area_icon_size}px`);
    this.style.setProperty("--area-bubble-expander-card-entity-icon-size", `${style.entity_icon_size}px`);
    this.style.setProperty("--area-bubble-expander-card-icon-size", `${style.icon_size}px`);
    this.style.setProperty("--area-bubble-expander-card-shadow", style.show_shadows ? `0 12px 30px rgba(0,0,0,${style.shadow_intensity})` : "none");
  }

  private stableCardId(config: AreaBubbleExpanderCardConfig): string {
    const seed = JSON.stringify({
      title: config.title ?? "",
      include_areas: config.include_areas ?? [],
      exclude_areas: config.exclude_areas ?? [],
      custom_area_order: config.custom_area_order ?? [],
    });
    let hash = 2166136261;
    for (let index = 0; index < seed.length; index += 1) {
      hash ^= seed.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return `card-${(hash >>> 0).toString(36)}`;
  }
}

window.customCards = window.customCards ?? [];
if (!window.customCards.some((card) => card.type === "area-bubble-expander-card")) {
  window.customCards.push({
    type: "area-bubble-expander-card",
    name: "Area Bubble Expander Card",
    description: "Active entities grouped by Home Assistant Area with safe controls and RTL support.",
    preview: true,
    documentationURL: "https://github.com/jonioliel/area-bubble-expander-card",
  });
}

console.info(
  `%c AREA-BUBBLE-CARDS %c 0.20.3 ${resolveLanguage(undefined, "auto")}`,
  "color: white; background: #03a9f4; font-weight: 700;",
  "color: #03a9f4; font-weight: 700;",
);
