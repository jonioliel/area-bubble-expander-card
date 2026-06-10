import { LitElement, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { EDITOR_TAG } from "./constants";
import { editorStyles } from "./styles";
import { listToText, resolveConfig, splitList } from "./helpers/config";
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

  public setConfig(config: AreaBubbleExpanderCardConfig): void {
    this.config = { ...config };
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
          ${visibleSchema.map((item) => this.renderField(item, resolved))}
          ${this.activeSection === "Debug"
            ? html`<div class="field"><label>Resulting config JSON</label><textarea class="yaml" readonly>${JSON.stringify(this.config, null, 2)}</textarea></div>`
            : nothing}
        </div>
      </div>
    `;
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
    const next = structuredClone(this.config) as Record<string, unknown>;
    this.writePath(next, item.key, value);
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
