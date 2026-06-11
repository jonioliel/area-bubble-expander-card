import { LitElement, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { EDITOR_TAG } from "./constants";
import { editorStyles } from "./styles";
import { listToText, resolveConfig, splitList } from "./helpers/config";
import { resolveArea } from "./helpers/area";
import { discoverActiveEntities } from "./helpers/entity";
import type { AreaBubbleExpanderCardConfig, EditorSchemaItem, HomeAssistant } from "./types";

const sections = [
  "General",
  "Display",
  "Areas",
  "Entities",
  "Active Rules",
  "Actions",
  "Safety",
  "Sorting",
  "Style",
  "Hebrew / RTL",
  "Advanced",
  "Debug",
  "Badge",
];

const schema: EditorSchemaItem[] = [
  { section: "General", key: "title", label: "Card title", type: "text" },
  { section: "General", key: "show_header", label: "Show header", type: "boolean" },
  { section: "General", key: "show_total_count", label: "Show total active count", type: "boolean" },
  { section: "General", key: "show_active_area_count", label: "Show active area count", type: "boolean" },
  { section: "General", key: "show_empty", label: "Show empty state", type: "boolean" },
  { section: "General", key: "empty_title", label: "Empty title", type: "text" },
  { section: "General", key: "empty_subtitle", label: "Empty subtitle", type: "text" },
  { section: "Display", key: "default_expanded", label: "Default expanded", type: "boolean" },
  { section: "Display", key: "remember_expanded_state", label: "Remember expanded state", type: "boolean" },
  { section: "Display", key: "expand_on_header_tap", label: "Expand on header tap", type: "boolean" },
  { section: "Display", key: "show_area_icons", label: "Show area icons", type: "boolean" },
  { section: "Display", key: "show_entity_icons", label: "Show entity icons", type: "boolean" },
  { section: "Display", key: "show_entity_secondary_info", label: "Show secondary info", type: "boolean" },
  { section: "Display", key: "show_domain_chips", label: "Show domain chips", type: "boolean" },
  {
    section: "Display",
    key: "domain_chip_mode",
    label: "Domain chip mode",
    type: "select",
    options: [
      { value: "icons", label: "Icons" },
      { value: "text", label: "Text" },
      { value: "icons_and_text", label: "Icons and text" },
    ],
  },
  { section: "Display", key: "show_preview_entities", label: "Show preview entities", type: "boolean" },
  { section: "Display", key: "preview_entity_count", label: "Preview entity count", type: "number", min: 0, max: 10, step: 1 },
  { section: "Display", key: "max_entities_per_area", label: "Max entities per area (0 = unlimited)", type: "number", min: 0, max: 200, step: 1 },
  { section: "Areas", key: "include_areas", label: "Include areas (IDs or names)", type: "multi-text" },
  { section: "Areas", key: "exclude_areas", label: "Exclude areas (IDs or names)", type: "multi-text" },
  { section: "Areas", key: "custom_area_order", label: "Custom area order", type: "multi-text" },
  { section: "Areas", key: "areas", label: "Area overrides JSON", type: "textarea" },
  { section: "Entities", key: "domains", label: "Included domains", type: "multi-text" },
  { section: "Entities", key: "exclude_domains", label: "Excluded domains", type: "multi-text" },
  { section: "Entities", key: "include_entities", label: "Include entities", type: "multi-text" },
  { section: "Entities", key: "exclude_entities", label: "Exclude entities", type: "multi-text" },
  { section: "Entities", key: "exclude_labels", label: "Exclude labels", type: "multi-text" },
  { section: "Entities", key: "exclude_entity_category", label: "Exclude entity categories", type: "multi-text" },
  { section: "Entities", key: "exclude_by_regex", label: "Exclude by regex", type: "multi-text" },
  { section: "Entities", key: "exclude_hidden_entities", label: "Exclude hidden entities", type: "boolean" },
  { section: "Entities", key: "exclude_unavailable", label: "Exclude unavailable", type: "boolean" },
  { section: "Entities", key: "entity_overrides", label: "Entity overrides JSON", type: "textarea" },
  { section: "Active Rules", key: "paused_media_players_active", label: "Paused media players count as active", type: "boolean" },
  { section: "Active Rules", key: "active_states", label: "Active states JSON", type: "textarea" },
  { section: "Active Rules", key: "inactive_states", label: "Inactive states JSON", type: "textarea" },
  { section: "Actions", key: "show_area_turn_off", label: "Show area turn-off", type: "boolean" },
  { section: "Actions", key: "show_entity_turn_off", label: "Show entity turn-off", type: "boolean" },
  { section: "Actions", key: "show_global_turn_off", label: "Show global turn-off", type: "boolean" },
  { section: "Actions", key: "confirm_area_turn_off", label: "Confirm area turn-off", type: "boolean" },
  { section: "Actions", key: "confirm_entity_turn_off", label: "Confirm entity turn-off", type: "boolean" },
  { section: "Actions", key: "confirm_global_turn_off", label: "Confirm global turn-off", type: "boolean" },
  {
    section: "Actions",
    key: "area_turn_off_mode",
    label: "Area turn-off mode",
    type: "select",
    options: [
      { value: "safe_displayed_entities", label: "Safe displayed entities" },
      { value: "domain_grouped_services", label: "Domain grouped services" },
      { value: "homeassistant_area", label: "Home Assistant area target" },
    ],
  },
  { section: "Actions", key: "service_mapping", label: "Service mapping JSON", type: "textarea" },
  { section: "Safety", key: "protected_labels", label: "Protected labels", type: "multi-text" },
  { section: "Safety", key: "protected_entities", label: "Protected entities", type: "multi-text" },
  { section: "Safety", key: "disable_turn_off_for_domains", label: "Disable turn-off for domains", type: "multi-text" },
  { section: "Safety", key: "dangerous_domains", label: "Dangerous domains", type: "multi-text" },
  {
    section: "Safety",
    key: "protected_entity_behavior",
    label: "Protected entity behavior",
    type: "select",
    options: [
      { value: "hide", label: "Hide" },
      { value: "show_disabled", label: "Show disabled" },
      { value: "show_with_lock_icon", label: "Show with lock icon" },
    ],
  },
  {
    section: "Safety",
    key: "safety_mode",
    label: "Safety mode",
    type: "select",
    options: [
      { value: "strict", label: "Strict" },
      { value: "normal", label: "Normal" },
      { value: "custom", label: "Custom" },
    ],
  },
  {
    section: "Sorting",
    key: "area_sort",
    label: "Area sort",
    type: "select",
    options: [
      { value: "count_desc", label: "Count descending" },
      { value: "count_asc", label: "Count ascending" },
      { value: "name", label: "Name" },
      { value: "custom", label: "Custom" },
      { value: "original", label: "Original" },
    ],
  },
  {
    section: "Sorting",
    key: "entity_sort",
    label: "Entity sort",
    type: "select",
    options: [
      { value: "domain", label: "Domain" },
      { value: "name", label: "Name" },
      { value: "state", label: "State" },
      { value: "last_changed", label: "Last changed" },
      { value: "custom", label: "Custom" },
    ],
  },
  { section: "Sorting", key: "custom_entity_order", label: "Custom entity order", type: "multi-text" },
  {
    section: "Style",
    key: "style.preset",
    label: "Theme preset",
    type: "select",
    options: [
      { value: "bubble_glass", label: "Bubble Glass" },
      { value: "bubble_solid", label: "Bubble Solid" },
      { value: "expander_minimal", label: "Expander Minimal" },
      { value: "home_assistant_native", label: "Home Assistant Native" },
      { value: "dark_glass", label: "Dark Glass" },
      { value: "light_glass", label: "Light Glass" },
      { value: "compact_mobile", label: "Compact Mobile" },
    ],
  },
  { section: "Style", key: "style.glass", label: "Glass mode", type: "boolean" },
  { section: "Style", key: "style.compact", label: "Compact mode", type: "boolean" },
  { section: "Style", key: "style.border_radius", label: "Border radius", type: "number", min: 4, max: 40, step: 1 },
  { section: "Style", key: "style.blur", label: "Blur", type: "number", min: 0, max: 40, step: 1 },
  { section: "Style", key: "style.section_gap", label: "Section gap", type: "number", min: 4, max: 30, step: 1 },
  { section: "Style", key: "style.row_height", label: "Row height", type: "number", min: 40, max: 80, step: 1 },
  { section: "Style", key: "style.accent_color", label: "Accent color", type: "color" },
  { section: "Style", key: "style.danger_color", label: "Danger color", type: "color" },
  { section: "Style", key: "style.row_background", label: "Row background", type: "text" },
  { section: "Style", key: "style.chip_background", label: "Chip background", type: "text" },
  {
    section: "Hebrew / RTL",
    key: "language",
    label: "Language",
    type: "select",
    options: [
      { value: "auto", label: "Auto" },
      { value: "he", label: "Hebrew" },
      { value: "en", label: "English" },
    ],
  },
  {
    section: "Hebrew / RTL",
    key: "rtl",
    label: "RTL",
    type: "select",
    options: [
      { value: "auto", label: "Auto" },
      { value: "true", label: "Enabled" },
      { value: "false", label: "Disabled" },
    ],
  },
  { section: "Hebrew / RTL", key: "labels", label: "Custom labels JSON", type: "textarea" },
  { section: "Hebrew / RTL", key: "domain_labels", label: "Custom domain labels JSON", type: "textarea" },
  { section: "Advanced", key: "show_last_changed", label: "Show last changed", type: "boolean" },
  { section: "Advanced", key: "show_brightness", label: "Show light brightness", type: "boolean" },
  { section: "Advanced", key: "show_temperature", label: "Show climate temperature", type: "boolean" },
  { section: "Advanced", key: "show_media_title", label: "Show media title", type: "boolean" },
  { section: "Advanced", key: "enable_animations", label: "Enable animations", type: "boolean" },
  { section: "Advanced", key: "respect_reduced_motion", label: "Respect reduced motion", type: "boolean" },
  { section: "Debug", key: "debug", label: "Debug logging", type: "boolean" },
  { section: "Debug", key: "show_debug", label: "Show skipped/protected diagnostics", type: "boolean" },
  { section: "Debug", key: "show_entity_ids", label: "Show entity IDs", type: "boolean" },
  { section: "Debug", key: "show_area_ids", label: "Show area IDs", type: "boolean" },
];

@customElement(EDITOR_TAG)
export class AreaBubbleExpanderCardEditor extends LitElement {
  static override styles = editorStyles;

  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private config: AreaBubbleExpanderCardConfig = { type: "custom:area-bubble-expander-card" };
  @state() private activeSection = "General";
  @state() private areaSearch = "";
  @state() private entitySearch = "";
  @state() private labelSearch = "";
  @state() private registryLabels: Array<{ label_id?: string; id?: string; name?: string; icon?: string }> = [];
  private labelRegistryLoaded = false;

  public setConfig(config: AreaBubbleExpanderCardConfig): void {
    this.config = { ...config };
  }

  protected override updated(changedProperties: Map<PropertyKey, unknown>): void {
    if (changedProperties.has("hass")) void this.loadLabelRegistry();
  }

  protected override render() {
    const resolved = resolveConfig(this.config);
    const visibleSchema = schema.filter((item) => item.section === this.activeSection);
    return html`
      <div class="editor">
        <div class="tabs">
          ${sections.map(
            (section) => html`
              <button class="tab ${this.activeSection === section ? "active" : ""}" @click=${() => (this.activeSection = section)}>
                ${section}
              </button>
            `,
          )}
        </div>
        <div class="section">
          ${this.activeSection === "Areas" ? this.renderAreaPicker(resolved) : nothing}
          ${this.activeSection === "Areas" ? this.renderAreaOrder(resolved) : nothing}
          ${this.activeSection === "Entities" ? this.renderEntityPicker(resolved) : nothing}
          ${this.activeSection === "Entities" ? this.renderLabelPicker(resolved) : nothing}
          ${this.activeSection === "Badge" ? this.renderBadgeTemplates(resolved) : nothing}
          ${visibleSchema.map((item) => this.renderField(item, resolved))}
          ${this.activeSection === "Debug"
            ? html`<div class="field"><label>Resulting config JSON</label><textarea class="yaml" readonly>${JSON.stringify(this.config, null, 2)}</textarea></div>`
            : nothing}
        </div>
      </div>
    `;
  }

  private async loadLabelRegistry(): Promise<void> {
    if (this.labelRegistryLoaded || !this.hass?.callWS) return;
    try {
      this.registryLabels = await this.hass.callWS<Array<{ label_id?: string; id?: string; name?: string; icon?: string }>>({
        type: "config/label_registry/list",
      });
      this.labelRegistryLoaded = true;
    } catch {
      this.registryLabels = [];
    }
  }

  private renderAreaPicker(resolved: ReturnType<typeof resolveConfig>) {
    const areas = this.areaOptions(resolved);
    const filtered = areas.filter((area) => this.matchesSearch(`${area.name} ${area.id}`, this.areaSearch));
    return html`
      <div class="picker-panel">
        <div class="picker-heading">
          <div>
            <strong>Areas from Home Assistant</strong>
            <span>${filtered.length} / ${areas.length}</span>
          </div>
          <input
            class="search"
            type="search"
            placeholder="Search area name or ID"
            .value=${this.areaSearch}
            @input=${(ev: Event) => this.updateSearch(ev, "area")}
          />
        </div>
        <div class="picker-list">
          ${filtered.map(
            (area) => html`
              <div class="picker-item">
                <ha-icon icon=${area.icon}></ha-icon>
                <div class="picker-main">
                  <div class="picker-title">${area.name}</div>
                  <div class="picker-meta">${area.id}</div>
                </div>
                <button class="pill ${resolved.include_areas.includes(area.id) || resolved.include_areas.includes(area.name) ? "active" : ""}" @click=${() => this.toggleListValue("include_areas", area.id)}>
                  Include
                </button>
                <button class="pill danger ${resolved.exclude_areas.includes(area.id) || resolved.exclude_areas.includes(area.name) ? "active" : ""}" @click=${() => this.toggleListValue("exclude_areas", area.id)}>
                  Exclude
                </button>
              </div>
            `,
          )}
        </div>
      </div>
    `;
  }

  private renderEntityPicker(resolved: ReturnType<typeof resolveConfig>) {
    const entities = this.entityOptions(resolved);
    const filtered = entities.filter((entity) =>
      this.matchesSearch(`${entity.name} ${entity.entityId} ${entity.domain} ${entity.areaName} ${entity.labels}`, this.entitySearch),
    );
    return html`
      <div class="picker-panel">
        <div class="picker-heading">
          <div>
            <strong>Entities from Home Assistant</strong>
            <span>${filtered.length} / ${entities.length}</span>
          </div>
          <input
            class="search"
            type="search"
            placeholder="Search entity, area, or domain"
            .value=${this.entitySearch}
            @input=${(ev: Event) => this.updateSearch(ev, "entity")}
          />
        </div>
        <div class="picker-list entities-picker">
          ${filtered.map(
            (entity) => html`
              <div class="picker-item">
                <ha-icon icon=${entity.icon}></ha-icon>
                <div class="picker-main">
                  <div class="picker-title">${entity.name}</div>
                  <div class="picker-meta">
                    ${entity.entityId} · ${entity.areaName} · ${entity.domain}${entity.labels ? ` · labels: ${entity.labels}` : ""}
                  </div>
                </div>
                <button class="pill ${resolved.include_entities.includes(entity.entityId) ? "active" : ""}" @click=${() => this.toggleListValue("include_entities", entity.entityId)}>
                  Include
                </button>
                <button class="pill danger ${resolved.exclude_entities.includes(entity.entityId) ? "active" : ""}" @click=${() => this.toggleListValue("exclude_entities", entity.entityId)}>
                  Hide
                </button>
              </div>
            `,
          )}
        </div>
      </div>
    `;
  }

  private renderLabelPicker(resolved: ReturnType<typeof resolveConfig>) {
    const labels = this.labelOptions();
    const filtered = labels.filter((label) => this.matchesSearch(`${label.id} ${label.name}`, this.labelSearch));
    return html`
      <div class="picker-panel">
        <div class="picker-heading">
          <div>
            <strong>Labels from Home Assistant</strong>
            <span>${filtered.length} / ${labels.length}</span>
          </div>
          <input
            class="search"
            type="search"
            placeholder="Search label name or ID"
            .value=${this.labelSearch}
            @input=${(ev: Event) => this.updateSearch(ev, "label")}
          />
        </div>
        <div class="picker-list compact-picker">
          ${filtered.map(
            (label) => html`
              <div class="picker-item">
                <ha-icon icon=${label.icon}></ha-icon>
                <div class="picker-main">
                  <div class="picker-title">${label.name}</div>
                  <div class="picker-meta">${label.id}</div>
                </div>
                <button class="pill danger ${resolved.exclude_labels.includes(label.id) ? "active" : ""}" @click=${() => this.toggleListValue("exclude_labels", label.id)}>
                  Exclude
                </button>
              </div>
            `,
          )}
        </div>
      </div>
    `;
  }

  private renderAreaOrder(resolved: ReturnType<typeof resolveConfig>) {
    const areas = this.orderedAreaOptions(resolved);
    return html`
      <div class="picker-panel">
        <div class="picker-heading single">
          <div>
            <strong>Active area display order</strong>
            <span>Use arrows to set a custom order for active areas.</span>
          </div>
          <button class="pill ${resolved.area_sort === "custom" ? "active" : ""}" @click=${() => this.updateKey("area_sort", "custom")}>
            Use custom order
          </button>
        </div>
        <div class="picker-list compact-picker">
          ${areas.map(
            (area, index) => html`
              <div class="picker-item order-item">
                <ha-icon icon=${area.icon}></ha-icon>
                <div class="picker-main">
                  <div class="picker-title">${area.name}</div>
                  <div class="picker-meta">${area.id}</div>
                </div>
                <button class="pill" ?disabled=${index === 0} @click=${() => this.moveArea(area.id, -1)}>Up</button>
                <button class="pill" ?disabled=${index === areas.length - 1} @click=${() => this.moveArea(area.id, 1)}>Down</button>
              </div>
            `,
          )}
        </div>
      </div>
    `;
  }

  private renderBadgeTemplates(resolved: ReturnType<typeof resolveConfig>) {
    const { groups } = discoverActiveEntities(this.hass, resolved);
    const activeCount = groups.reduce((sum, group) => sum + group.entities.length, 0);
    const activeAreaCount = groups.length;
    return html`
      <div class="picker-panel">
        <div class="picker-heading single">
          <div>
            <strong>Badge / Template helper</strong>
            <span>${activeCount} active entities · ${activeAreaCount} active areas right now</span>
          </div>
        </div>
        <div class="field">
          <label>Template sensors YAML</label>
          <textarea class="yaml template-output" readonly .value=${this.templateSensorYaml(resolved)}></textarea>
        </div>
        <div class="field">
          <label>Dashboard badge YAML</label>
          <textarea class="yaml template-output small" readonly .value=${this.badgeYaml()}></textarea>
        </div>
      </div>
    `;
  }

  private areaOptions(resolved: ReturnType<typeof resolveConfig>) {
    const registryAreas = Object.entries(this.hass?.areas ?? {}).map(([key, area]) => ({
      id: area.area_id ?? area.id ?? key,
      name: area.name,
      icon: area.icon ?? "mdi:floor-plan",
    }));

    const fromEntities = new Map<string, { id: string; name: string; icon: string }>();
    for (const entityId of Object.keys(this.hass?.states ?? {})) {
      const area = resolveArea(this.hass, resolved, entityId);
      fromEntities.set(area.id, { id: area.id, name: area.name, icon: area.icon });
    }

    return [...registryAreas, ...fromEntities.values()]
      .filter((area, index, list) => list.findIndex((item) => item.id === area.id) === index)
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  private orderedAreaOptions(resolved: ReturnType<typeof resolveConfig>) {
    const areas = this.areaOptions(resolved);
    const order = resolved.custom_area_order;
    return areas.sort((a, b) => {
      const aIndex = this.orderIndex(order, a.id, a.name);
      const bIndex = this.orderIndex(order, b.id, b.name);
      return aIndex - bIndex || a.name.localeCompare(b.name);
    });
  }

  private entityOptions(resolved: ReturnType<typeof resolveConfig>) {
    return Object.values(this.hass?.states ?? {})
      .map((entity) => {
        const domain = entity.entity_id.split(".")[0] ?? "";
        const area = resolveArea(this.hass, resolved, entity.entity_id);
        return {
          entityId: entity.entity_id,
          domain,
          areaName: area.name,
          name: String(entity.attributes.friendly_name ?? entity.entity_id),
          icon: String(entity.attributes.icon ?? resolved.domain_icons[domain] ?? "mdi:toggle-switch-outline"),
          labels: this.labelsForEntity(entity.entity_id).join(" "),
        };
      })
      .sort((a, b) => a.areaName.localeCompare(b.areaName) || a.name.localeCompare(b.name));
  }

  private labelOptions() {
    const byId = new Map<string, { id: string; name: string; icon: string }>();

    for (const label of this.registryLabels) {
      const id = label.label_id ?? label.id;
      if (!id) continue;
      byId.set(id, {
        id,
        name: label.name ?? id,
        icon: label.icon ?? "mdi:label-outline",
      });
    }

    for (const [key, label] of Object.entries(this.hass?.labels ?? {})) {
      const id = label.label_id ?? key;
      if (byId.has(id)) continue;
      byId.set(id, {
        id,
        name: label.name ?? id,
        icon: label.icon ?? "mdi:label-outline",
      });
    }

    for (const entityId of Object.keys(this.hass?.states ?? {})) {
      for (const label of this.labelsForEntity(entityId)) {
        if (!byId.has(label)) byId.set(label, { id: label, name: label, icon: "mdi:label-outline" });
      }
    }

    return [...byId.values()].sort((a, b) => a.name.localeCompare(b.name));
  }

  private templateSensorYaml(resolved: ReturnType<typeof resolveConfig>): string {
    const domains = JSON.stringify(resolved.domains);
    const excludeDomains = JSON.stringify(resolved.exclude_domains);
    const excludeEntities = JSON.stringify(resolved.exclude_entities);
    const excludeAreas = JSON.stringify(resolved.exclude_areas);
    const excludeLabels = JSON.stringify(resolved.exclude_labels);
    const activeStates = JSON.stringify(resolved.active_states);
    const inactiveStates = JSON.stringify(resolved.inactive_states);
    return `template:
  - sensor:
      - name: Area Bubble Active Entities
        unique_id: area_bubble_active_entities
        icon: mdi:power-plug
        state: >
          {% set domains = ${domains} %}
          {% set exclude_domains = ${excludeDomains} %}
          {% set exclude_entities = ${excludeEntities} %}
          {% set exclude_areas = ${excludeAreas} %}
          {% set exclude_labels = ${excludeLabels} %}
          {% set active_states = ${activeStates} %}
          {% set inactive_states = ${inactiveStates} %}
          {% set blocked = namespace(entities=[]) %}
          {% for label in exclude_labels %}
            {% set blocked.entities = blocked.entities + label_entities(label) %}
          {% endfor %}
          {% set ns = namespace(count=0) %}
          {% for s in states %}
            {% set domain = s.entity_id.split('.')[0] %}
            {% set state = s.state | lower %}
            {% set area = area_name(s.entity_id) or 'No Area' %}
            {% set area_identifier = area_id(s.entity_id) or '' %}
            {% set allowed = domain in domains and domain not in exclude_domains and s.entity_id not in exclude_entities and s.entity_id not in blocked.entities and area not in exclude_areas and area_identifier not in exclude_areas and state not in ['unavailable', 'unknown', 'none', ''] %}
            {% set is_active = false %}
            {% if active_states.get(domain) is not none %}
              {% set is_active = state in active_states.get(domain) %}
            {% elif inactive_states.get(domain) is not none %}
              {% set is_active = state not in inactive_states.get(domain) %}
            {% else %}
              {% set is_active = state == 'on' %}
            {% endif %}
            {% if allowed and is_active %}
              {% set ns.count = ns.count + 1 %}
            {% endif %}
          {% endfor %}
          {{ ns.count }}
      - name: Area Bubble Active Areas
        unique_id: area_bubble_active_areas
        icon: mdi:floor-plan
        state: >
          {% set domains = ${domains} %}
          {% set exclude_domains = ${excludeDomains} %}
          {% set exclude_entities = ${excludeEntities} %}
          {% set exclude_areas = ${excludeAreas} %}
          {% set exclude_labels = ${excludeLabels} %}
          {% set active_states = ${activeStates} %}
          {% set inactive_states = ${inactiveStates} %}
          {% set blocked = namespace(entities=[]) %}
          {% for label in exclude_labels %}
            {% set blocked.entities = blocked.entities + label_entities(label) %}
          {% endfor %}
          {% set ns = namespace(areas=[]) %}
          {% for s in states %}
            {% set domain = s.entity_id.split('.')[0] %}
            {% set state = s.state | lower %}
            {% set area = area_name(s.entity_id) or 'No Area' %}
            {% set area_identifier = area_id(s.entity_id) or '' %}
            {% set allowed = domain in domains and domain not in exclude_domains and s.entity_id not in exclude_entities and s.entity_id not in blocked.entities and area not in exclude_areas and area_identifier not in exclude_areas and state not in ['unavailable', 'unknown', 'none', ''] %}
            {% set is_active = false %}
            {% if active_states.get(domain) is not none %}
              {% set is_active = state in active_states.get(domain) %}
            {% elif inactive_states.get(domain) is not none %}
              {% set is_active = state not in inactive_states.get(domain) %}
            {% else %}
              {% set is_active = state == 'on' %}
            {% endif %}
            {% if allowed and is_active and area not in ns.areas %}
              {% set ns.areas = ns.areas + [area] %}
            {% endif %}
          {% endfor %}
          {{ ns.areas | count }}`;
  }

  private badgeYaml(): string {
    return `type: entity
entity: sensor.area_bubble_active_entities
name: דלוקים
show_name: true
show_state: true
tap_action:
  action: navigate
  navigation_path: /lovelace/0`;
  }

  private labelsForEntity(entityId: string): string[] {
    const entity = this.hass?.entities?.[entityId];
    const device = entity?.device_id ? this.hass?.devices?.[entity.device_id] : undefined;
    return [...(entity?.labels ?? []), ...(device?.labels ?? [])];
  }

  private matchesSearch(text: string, search: string): boolean {
    const needle = search.trim().toLowerCase();
    return !needle || text.toLowerCase().includes(needle);
  }

  private updateSearch(ev: Event, type: "area" | "entity" | "label"): void {
    ev.stopPropagation();
    const value = (ev.target as HTMLInputElement).value;
    if (type === "area") this.areaSearch = value;
    if (type === "entity") this.entitySearch = value;
    if (type === "label") this.labelSearch = value;
  }

  private moveArea(areaId: string, direction: -1 | 1): void {
    const resolved = resolveConfig(this.config);
    const order = this.orderedAreaOptions(resolved).map((area) => area.id);
    const currentIndex = order.indexOf(areaId);
    const nextIndex = currentIndex + direction;
    if (currentIndex < 0 || nextIndex < 0 || nextIndex >= order.length) return;
    const next = [...order];
    [next[currentIndex], next[nextIndex]] = [next[nextIndex], next[currentIndex]];
    this.updateKey("area_sort", "custom");
    this.updateKey("custom_area_order", next);
  }

  private orderIndex(order: string[], id: string, name?: string): number {
    const byId = order.indexOf(id);
    if (byId >= 0) return byId;
    if (name) {
      const byName = order.indexOf(name);
      if (byName >= 0) return byName;
    }
    return Number.MAX_SAFE_INTEGER;
  }

  private toggleListValue(key: string, value: string): void {
    const current = splitList(this.readPath(key));
    const next = current.includes(value) ? current.filter((item) => item !== value) : [...current, value];
    this.updateKey(key, next);
  }

  private renderField(item: EditorSchemaItem, resolved: Record<string, unknown>) {
    const value = this.readPath(item.key);
    if (item.type === "boolean") {
      return html`
        <div class="row">
          <label>${item.label}</label>
          <input type="checkbox" .checked=${Boolean(value ?? this.readResolvedPath(resolved, item.key))} @change=${(ev: Event) => this.update(item, (ev.target as HTMLInputElement).checked)} />
        </div>
      `;
    }
    if (item.type === "select") {
      const current = this.stringifySelectValue(value ?? this.readResolvedPath(resolved, item.key));
      return html`
        <div class="field">
          <label>${item.label}</label>
          <select @change=${(ev: Event) => this.update(item, this.parseSelectValue(item.key, (ev.target as HTMLSelectElement).value))}>
            ${item.options?.map((option) => html`<option value=${option.value} ?selected=${current === option.value}>${option.label}</option>`)}
          </select>
        </div>
      `;
    }
    if (item.type === "number") {
      return html`
        <div class="field">
          <label>${item.label}</label>
          <input
            type="number"
            min=${item.min ?? ""}
            max=${item.max ?? ""}
            step=${item.step ?? 1}
            .value=${String(value ?? this.readResolvedPath(resolved, item.key) ?? "")}
            @change=${(ev: Event) => this.update(item, Number((ev.target as HTMLInputElement).value))}
          />
        </div>
      `;
    }
    if (item.type === "multi-text") {
      return html`
        <div class="field">
          <label>${item.label}</label>
          <textarea .value=${listToText(value ?? this.readResolvedPath(resolved, item.key))} @change=${(ev: Event) => this.update(item, splitList((ev.target as HTMLTextAreaElement).value))}></textarea>
        </div>
      `;
    }
    if (item.type === "textarea") {
      return html`
        <div class="field">
          <label>${item.label}</label>
          <textarea class="yaml" .value=${this.textareaValue(value ?? this.readResolvedPath(resolved, item.key))} @change=${(ev: Event) => this.updateJson(item, (ev.target as HTMLTextAreaElement).value)}></textarea>
        </div>
      `;
    }
    return html`
      <div class="field">
        <label>${item.label}</label>
        <input
          type=${item.type === "color" ? "text" : "text"}
          .value=${String(value ?? this.readResolvedPath(resolved, item.key) ?? "")}
          @change=${(ev: Event) => this.update(item, (ev.target as HTMLInputElement).value)}
        />
      </div>
    `;
  }

  private updateJson(item: EditorSchemaItem, raw: string): void {
    try {
      this.update(item, raw.trim() ? JSON.parse(raw) : undefined);
    } catch {
      this.update(item, raw);
    }
  }

  private update(item: EditorSchemaItem, value: unknown): void {
    this.updateKey(item.key, value);
  }

  private updateKey(key: string, value: unknown): void {
    const next = structuredClone(this.config) as Record<string, unknown>;
    this.writePath(next, key, value);
    this.config = next as AreaBubbleExpanderCardConfig;
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        bubbles: true,
        composed: true,
        detail: { config: this.config },
      }),
    );
  }

  private readPath(path: string): unknown {
    return this.readResolvedPath(this.config as Record<string, unknown>, path);
  }

  private readResolvedPath(source: Record<string, unknown>, path: string): unknown {
    return path.split(".").reduce<unknown>((value, segment) => {
      if (value && typeof value === "object") return (value as Record<string, unknown>)[segment];
      return undefined;
    }, source);
  }

  private writePath(source: Record<string, unknown>, path: string, value: unknown): void {
    const parts = path.split(".");
    let cursor = source;
    for (const part of parts.slice(0, -1)) {
      cursor[part] = cursor[part] && typeof cursor[part] === "object" ? cursor[part] : {};
      cursor = cursor[part] as Record<string, unknown>;
    }
    const last = parts[parts.length - 1];
    if (value === undefined || value === "") delete cursor[last];
    else cursor[last] = value;
  }

  private textareaValue(value: unknown): string {
    if (typeof value === "string") return value;
    return JSON.stringify(value ?? {}, null, 2);
  }

  private stringifySelectValue(value: unknown): string {
    if (typeof value === "boolean") return String(value);
    return String(value ?? "");
  }

  private parseSelectValue(key: string, value: string): unknown {
    if (key === "rtl") {
      if (value === "true") return true;
      if (value === "false") return false;
      return "auto";
    }
    return value;
  }
}
