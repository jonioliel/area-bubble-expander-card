import { LitElement, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { HassAreaRegistryEntry, HassEntity, HomeAssistant } from "../types";
import { resolveOverviewConfig } from "./config";
import { OVERVIEW_CARD_TYPE, OVERVIEW_DEFAULT_STYLE, OVERVIEW_EDITOR_TAG, OVERVIEW_QUICK_ACTIONS, OVERVIEW_SECTIONS, OVERVIEW_THEME_PRESETS, QUICK_ACTION_ICONS, SECTION_ACTION_ICONS, SECTION_ICONS } from "./constants";
import { discoverOverview, isOverviewEntityPowered, overviewEntityAreaId } from "./discovery";
import { overviewLanguage } from "./translations";
import type {
  AreaBubbleOverviewCardConfig,
  OverviewAreaOverride,
  OverviewEntityOverride,
  OverviewQuickActionId,
  OverviewSectionId,
  OverviewSectionStyle,
  OverviewStyleConfig,
  OverviewThemePreset,
  ResolvedOverviewConfig,
} from "./types";
import { css } from "lit";

type AreaOption = { id: string; name: string; icon: string; floorId?: string };

@customElement(OVERVIEW_EDITOR_TAG)
export class AreaBubbleOverviewCardEditor extends LitElement {
  static override styles = css`
    :host { display: block; color: var(--primary-text-color); }
    * { box-sizing: border-box; }
    .editor { display: grid; gap: 12px; direction: var(--overview-editor-direction, ltr); }
    .intro {
      display: grid;
      grid-template-columns: auto minmax(0, 1fr);
      align-items: center;
      gap: 12px;
      padding: 14px;
      border: 1px solid var(--divider-color);
      border-radius: 14px;
      background: color-mix(in srgb, var(--primary-color) 8%, var(--card-background-color));
    }
    .intro-icon { display: grid; place-items: center; width: 44px; height: 44px; border-radius: 50%; background: color-mix(in srgb, var(--primary-color) 16%, transparent); color: var(--primary-color); }
    .intro strong, .intro span { display: block; }
    .intro span, .hint, .meta { color: var(--secondary-text-color); font-size: 12px; line-height: 1.4; }
    details { overflow: hidden; border: 1px solid var(--divider-color); border-radius: 14px; background: var(--card-background-color); }
    summary { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; align-items: center; gap: 10px; min-height: 58px; padding: 10px 14px; cursor: pointer; list-style: none; }
    summary::-webkit-details-marker { display: none; }
    summary > ha-icon:first-child { color: var(--primary-color); }
    summary .summary-title { display: block; font-weight: 700; }
    summary .summary-subtitle { display: block; margin-top: 2px; color: var(--secondary-text-color); font-size: 12px; }
    summary .chevron { transition: transform 140ms ease; }
    details[open] summary .chevron { transform: rotate(180deg); }
    .panel { display: grid; gap: 12px; padding: 0 14px 14px; border-top: 1px solid color-mix(in srgb, var(--divider-color) 70%, transparent); }
    .panel > :first-child { margin-top: 14px; }
    .segmented { display: grid; grid-template-columns: 1fr 1fr; gap: 4px; padding: 4px; border-radius: 12px; background: var(--secondary-background-color); }
    button { font: inherit; }
    .segment, .small-button, .icon-button {
      min-height: 38px;
      border: 1px solid transparent;
      border-radius: 10px;
      background: transparent;
      color: var(--primary-text-color);
      cursor: pointer;
    }
    .segment.active { background: var(--card-background-color); border-color: var(--divider-color); color: var(--primary-color); font-weight: 700; }
    .field { display: grid; gap: 6px; }
    .field > label { font-size: 13px; font-weight: 650; }
    input[type="text"], input[type="search"], input[type="number"], select, textarea {
      width: 100%; min-height: 42px; padding: 8px 10px; border: 1px solid var(--divider-color); border-radius: 10px;
      background: var(--card-background-color); color: var(--primary-text-color); font: inherit;
    }
    ha-icon-picker { display: block; width: 100%; min-width: 0; }
    .icon-picker-row { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; align-items: center; gap: 8px; }
    .icon-preview { display: grid; place-items: center; width: 42px; height: 42px; border-radius: 50%; background: color-mix(in srgb, var(--primary-color) 14%, transparent); color: var(--primary-color); }
    .reset-button { min-height: 38px; padding: 0 10px; border: 1px solid var(--divider-color); border-radius: 10px; background: transparent; color: var(--primary-text-color); cursor: pointer; }
    .color-control { display: grid; grid-template-columns: 42px minmax(0, 1fr) auto; align-items: center; gap: 8px; }
    .color-control input[type="color"] { width: 42px; height: 42px; padding: 3px; border: 1px solid var(--divider-color); border-radius: 10px; background: var(--card-background-color); cursor: pointer; }
    .color-control input[type="text"] { min-width: 0; direction: ltr; text-align: left; }
    .state-preview { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
    .state-preview-item { display: flex; align-items: center; gap: 9px; min-height: 48px; padding: 7px 10px; border: 1px solid var(--divider-color); border-radius: 12px; background: var(--preview-surface); color: var(--primary-text-color); font-size: 12px; font-weight: 700; }
    .state-preview-item.on { color: #111827; }
    .state-preview-item.off { color: #f4f3ec; }
    .state-preview-item::before { content: ""; width: 28px; height: 28px; border-radius: 50%; background: color-mix(in srgb, var(--primary-text-color) 12%, transparent); }
    .theme-preset-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
    .theme-preset {
      display: grid;
      grid-template-columns: auto minmax(0, 1fr);
      align-items: center;
      gap: 10px;
      min-height: 74px;
      padding: 10px;
      border: 2px solid color-mix(in srgb, var(--divider-color) 72%, transparent);
      border-radius: 14px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
      text-align: start;
      cursor: pointer;
    }
    .theme-preset.selected { border-color: var(--primary-color); box-shadow: 0 0 0 2px color-mix(in srgb, var(--primary-color) 18%, transparent); }
    .theme-preset-preview { display: grid; place-items: center; width: 58px; height: 52px; border: 1px solid var(--theme-frame); border-radius: 13px; background: var(--theme-card); box-shadow: 0 6px 14px rgba(0,0,0,0.12); }
    .theme-preset-swatches { display: flex; gap: 4px; }
    .theme-preset-swatches i { display: block; width: 13px; height: 13px; border-radius: 999px; background: var(--theme-active); }
    .theme-preset-swatches i:nth-child(2) { background: var(--theme-control); }
    .theme-preset-swatches i:nth-child(3) { background: var(--theme-accent); }
    .theme-preset-copy { min-width: 0; }
    .theme-preset-copy strong, .theme-preset-copy span { display: block; }
    .theme-preset-copy strong { margin-bottom: 3px; font-size: 13px; }
    .theme-preset-copy span { color: var(--secondary-text-color); font-size: 11px; line-height: 1.35; }
    textarea { min-height: 90px; resize: vertical; direction: ltr; }
    input:focus-visible, select:focus-visible, textarea:focus-visible, button:focus-visible, summary:focus-visible { outline: 2px solid var(--primary-color); outline-offset: 2px; }
    .settings-list { display: grid; gap: 2px; }
    .setting-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; min-height: 48px; padding: 6px 2px; border-bottom: 1px solid color-mix(in srgb, var(--divider-color) 55%, transparent); }
    .setting-row:last-child { border-bottom: 0; }
    .setting-main { min-width: 0; }
    .setting-title { font-size: 13px; font-weight: 650; }
    .switch { position: relative; display: inline-flex; width: 42px; height: 24px; flex: 0 0 auto; }
    .switch input { position: absolute; width: 1px; height: 1px; opacity: 0; }
    .switch span { width: 42px; height: 24px; border-radius: 999px; background: var(--disabled-color, #777); transition: background-color 120ms ease; cursor: pointer; }
    .switch span::after { content: ""; display: block; width: 18px; height: 18px; margin: 3px; border-radius: 50%; background: white; box-shadow: 0 1px 3px rgba(0,0,0,.35); transition: transform 120ms ease; }
    .switch input:checked + span { background: var(--primary-color); }
    .switch input:checked + span::after { transform: translateX(18px); }
    :host([dir="rtl"]) .switch input:checked + span::after { transform: translateX(-18px); }
    .switch input:focus-visible + span { outline: 2px solid var(--primary-color); outline-offset: 2px; }
    .order-list { display: grid; gap: 8px; }
    .order-item { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; align-items: center; gap: 9px; min-height: 54px; padding: 8px; border: 1px solid color-mix(in srgb, var(--divider-color) 70%, transparent); border-radius: 11px; background: var(--secondary-background-color); }
    .order-icon { display: grid; place-items: center; width: 38px; height: 38px; border-radius: 50%; background: color-mix(in srgb, var(--primary-color) 13%, transparent); color: var(--primary-color); }
    .order-main { min-width: 0; }
    .order-title { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 13px; font-weight: 650; }
    .order-controls { display: flex; gap: 4px; }
    .icon-button { display: grid; place-items: center; width: 34px; min-height: 34px; border-color: var(--divider-color); }
    .icon-button[disabled], .small-button[disabled] { cursor: not-allowed; opacity: .4; }
    .inline-fields { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 10px; }
    .area-card { display: grid; gap: 10px; padding: 10px; border: 1px solid var(--divider-color); border-radius: 12px; }
    .area-card.child { margin-inline-start: 18px; border-inline-start: 3px solid color-mix(in srgb, var(--primary-color) 44%, var(--divider-color)); }
    .area-card.hidden { opacity: .62; }
    .area-line { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; align-items: center; gap: 9px; }
    .area-actions { display: flex; align-items: center; gap: 4px; }
    .entity-toolbar { position: sticky; top: 0; z-index: 2; display: grid; grid-template-columns: 1fr 1fr; gap: 8px; padding-block: 4px; background: var(--card-background-color); }
    .entity-list { display: grid; gap: 8px; max-height: 560px; overflow: auto; padding-inline-end: 2px; }
    .entity-item { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; gap: 9px; padding: 10px; border: 1px solid var(--divider-color); border-radius: 12px; background: var(--secondary-background-color); }
    .entity-item.active { border-color: color-mix(in srgb, var(--primary-color) 45%, var(--divider-color)); }
    .entity-item.excluded { border-style: dashed; opacity: .68; }
    .entity-item.excluded .order-icon { color: var(--secondary-text-color); background: color-mix(in srgb, var(--secondary-text-color) 10%, transparent); }
    .visibility-button { display: grid; place-items: center; width: 40px; height: 40px; padding: 0; border: 1px solid var(--divider-color); border-radius: 10px; background: var(--card-background-color); color: var(--error-color, #db4437); cursor: pointer; }
    .visibility-button.restore { color: var(--success-color, #4caf50); }
    .visibility-button[disabled] { cursor: not-allowed; opacity: .45; }
    .quick-action-icon-field { grid-column: 1 / -1; width: 100%; }
    .section-style-editor { grid-column: 1 / -1; display: grid; gap: 8px; width: 100%; padding-block-start: 4px; border-block-start: 1px solid color-mix(in srgb, var(--divider-color) 55%, transparent); }
    .entity-fields { grid-column: 1 / -1; display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    .entity-flags { grid-column: 1 / -1; display: flex; flex-wrap: wrap; gap: 12px; }
    .check-label { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; }
    .empty { padding: 18px; color: var(--secondary-text-color); text-align: center; }
    .status { display: inline-flex; align-items: center; gap: 5px; min-height: 24px; padding: 0 8px; border-radius: 999px; background: color-mix(in srgb, var(--success-color, #4caf50) 14%, transparent); color: var(--success-color, #4caf50); font-size: 11px; font-weight: 700; }
    @media (max-width: 560px) {
      .inline-fields, .entity-toolbar, .entity-fields, .state-preview, .theme-preset-grid { grid-template-columns: 1fr; }
      .icon-picker-row, .color-control { grid-template-columns: auto minmax(0, 1fr); }
      .icon-picker-row .reset-button, .color-control .reset-button { grid-column: 1 / -1; }
      .order-item { grid-template-columns: auto minmax(0, 1fr); }
      .order-controls { grid-column: 1 / -1; }
      .icon-button { flex: 1; width: auto; }
    }
    @media (prefers-reduced-motion: reduce) { * { transition: none !important; } }
  `;

  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private config: AreaBubbleOverviewCardConfig = { type: OVERVIEW_CARD_TYPE };
  @state() private targetMode: "area" | "floor" = "area";
  @state() private activeAreaId = "";
  @state() private entitySearch = "";
  @state() private candidateEntityId = "";
  @state() private candidateSection: OverviewSectionId = "floor_heating";

  public setConfig(config: AreaBubbleOverviewCardConfig): void {
    const sanitized: AreaBubbleOverviewCardConfig = { ...config, type: OVERVIEW_CARD_TYPE };
    if (typeof config.show_area_expand_button !== "boolean") delete sanitized.show_area_expand_button;
    if (typeof config.show_floor_expand_button !== "boolean") delete sanitized.show_floor_expand_button;
    if (config.area_open_mode !== "expander" && config.area_open_mode !== "popup") delete sanitized.area_open_mode;
    if (!["classic", "elegant", "light", "dark", "modern"].includes(String(config.theme_preset))) delete sanitized.theme_preset;
    this.config = sanitized;
    this.targetMode = config.floor ? "floor" : "area";
    if (config.area) this.activeAreaId = config.area;
  }

  protected override shouldUpdate(changedProperties: Map<PropertyKey, unknown>): boolean {
    if (changedProperties.size !== 1 || !changedProperties.has("hass")) return true;
    const previous = changedProperties.get("hass") as HomeAssistant | undefined;
    if (!previous || !this.hass) return true;
    if (
      previous.areas !== this.hass.areas ||
      previous.floors !== this.hass.floors ||
      previous.entities !== this.hass.entities ||
      previous.devices !== this.hass.devices ||
      previous.labels !== this.hass.labels
    ) return true;
    return previous.states !== this.hass.states;
  }

  protected override render() {
    const resolved = resolveOverviewConfig(this.config);
    const language = overviewLanguage(this.hass, resolved);
    const rtl = typeof resolved.rtl === "boolean" ? resolved.rtl : language === "he";
    this.setAttribute("dir", rtl ? "rtl" : "ltr");
    this.style.setProperty("--overview-editor-direction", rtl ? "rtl" : "ltr");
    const discovery = discoverOverview(this.hass, resolved);
    const areas = this.targetAreas(resolved);
    const entitiesByArea = this.entityMapByArea();
    if (areas.length && !areas.some((area) => area.id === this.activeAreaId)) {
      queueMicrotask(() => (this.activeAreaId = areas[0].id));
    }

    return html`
      <div class="editor">
        <div class="intro">
          <span class="intro-icon"><ha-icon icon="mdi:home-analytics"></ha-icon></span>
          <div>
            <strong>${this.l("סקירת אזור וקומה", "Area and floor overview", language)}</strong>
            <span>${this.l("גילוי אוטומטי עם סידור והתאמות שנשמרים גם כשנוספים רכיבים", "Automatic discovery with ordering that keeps working as devices are added", language)}</span>
          </div>
        </div>
        ${this.renderTarget(resolved, language)}
        ${this.renderSummarySettings(resolved, language)}
        ${this.renderSections(resolved, language)}
        ${this.renderAreas(resolved, areas, entitiesByArea, language)}
        ${this.renderEntities(resolved, discovery, areas, language)}
        ${this.renderAppearance(resolved, language)}
        ${this.renderAdvanced(resolved, language)}
      </div>
    `;
  }

  private renderTarget(resolved: ResolvedOverviewConfig, language: "he" | "en") {
    const areas = this.areaOptions();
    const floors = this.floorOptions();
    const selectedTarget = this.targetMode === "area" ? this.areaIdFor(resolved.area) : this.floorIdFor(resolved.floor);
    const targetOptions = this.targetMode === "area" ? areas : floors;
    const automaticIcon = targetOptions.find((item) => item.id === selectedTarget)?.icon ?? (this.targetMode === "floor" ? "mdi:home-floor-0" : "mdi:floor-plan");
    return html`
      <details open>
        ${this.summary("mdi:map-marker-radius", this.l("יעד", "Target", language), this.l("בחרו חדר יחיד או קומה שלמה", "Choose one room or a complete floor", language))}
        <div class="panel">
          <div class="segmented">
            <button type="button" class="segment ${this.targetMode === "area" ? "active" : ""}" @click=${() => (this.targetMode = "area")}>${this.l("אזור", "Area", language)}</button>
            <button type="button" class="segment ${this.targetMode === "floor" ? "active" : ""}" @click=${() => (this.targetMode = "floor")}>${this.l("קומה", "Floor", language)}</button>
          </div>
          <div class="field">
            <label>${this.targetMode === "area" ? this.l("אזור להצגה", "Area to show", language) : this.l("קומה להצגה", "Floor to show", language)}</label>
            <select .value=${selectedTarget} @change=${(event: Event) => this.setTarget((event.target as HTMLSelectElement).value)}>
              <option value="" ?selected=${!selectedTarget}>${this.l("בחרו...", "Choose...", language)}</option>
              ${(this.targetMode === "area" ? areas : floors).map((item) => html`<option value=${item.id} ?selected=${item.id === selectedTarget}>${item.name}</option>`)}
            </select>
          </div>
          <div class="field">
            <label>${this.l("כותרת מותאמת (רשות)", "Custom title (optional)", language)}</label>
            <input type="text" .value=${resolved.title} @change=${(event: Event) => this.commitKey("title", (event.target as HTMLInputElement).value)} />
          </div>
          ${this.iconField(
            this.l("אייקון הכותרת", "Header icon", language),
            resolved.target_icon,
            automaticIcon,
            language,
            (value) => this.commitKey("target_icon", value),
          )}
          ${this.targetMode === "floor" && !floors.length ? html`<div class="hint">${this.l("לא נמצאו קומות. צרו קומה בהגדרות Home Assistant ושייכו אליה אזורים.", "No floors were found. Create a floor in Home Assistant and assign areas to it.", language)}</div>` : nothing}
        </div>
      </details>
    `;
  }

  private renderSummarySettings(resolved: ResolvedOverviewConfig, language: "he" | "en") {
    const rows: Array<[keyof AreaBubbleOverviewCardConfig, string, string, boolean]> = [
      ["show_header", this.l("הצג כותרת", "Show header", language), this.l("כותרת קומה או כותרת מותאמת", "Floor or custom card heading", language), resolved.show_header],
      ["show_temperature", this.l("הצג טמפרטורה", "Show temperature", language), this.l("חיישן מועדף, חיישני טמפרטורה או מזגן", "Preferred sensor, temperature sensors, or climate", language), resolved.show_temperature],
      ["show_occupancy", this.l("הצג נוכחות", "Show occupancy", language), this.l("מאוכלס, ריק או לא ידוע", "Occupied, vacant, or unknown", language), resolved.show_occupancy],
      ["show_quick_actions", this.l("הצג פעולות מהירות", "Show quick actions", language), this.l("פתח שליטה רק לקטגוריות פעילות", "Open control popups only for active categories", language), resolved.show_quick_actions],
      ["show_area_expand_button", this.l("הצג חץ פתיחה לאזורים", "Show area expand buttons", language), this.l("ניתן לפתוח ולכווץ גם בלחיצה על שם האזור", "Areas can still be expanded and collapsed by clicking their name", language), resolved.show_area_expand_button],
      ["show_floor_expand_button", this.l("הצג חץ פתיחה בכותרת הקומה", "Show floor expand button", language), this.l("גם ללא החץ, לחיצה על כותרת הקומה פותחת ומכווצת אותה", "The floor header remains clickable when the arrow is hidden", language), resolved.show_floor_expand_button],
      ["default_expanded", this.l("פתוח כברירת מחדל", "Expanded by default", language), "", resolved.default_expanded],
      ["floor_default_expanded", this.l("פתח קומה כברירת מחדל", "Floor expanded by default", language), this.l("חל רק כאשר היעד הוא קומה", "Used only when the target is a floor", language), resolved.floor_default_expanded],
      ["remember_expanded_state", this.l("זכור מצב פתיחה", "Remember expansion", language), this.l("שומר בנפרד את מצב הקומה ואת מצב כל אזור", "Remembers the floor and each area separately", language), resolved.remember_expanded_state],
      ["show_empty_sections", this.l("הצג סעיפים ריקים", "Show empty sections", language), "", resolved.show_empty_sections],
    ];
    return html`
      <details>
        ${this.summary("mdi:view-dashboard-outline", this.l("תצוגה וסיכום", "Display and summary", language), this.l("טמפרטורה, נוכחות והרחבה", "Temperature, occupancy, and expansion", language))}
        <div class="panel">
          <div class="field">
            <label>${this.l("אופן פתיחת חדר", "Room opening mode", language)}</label>
            <select .value=${resolved.area_open_mode} @change=${(event: Event) => this.commitKey("area_open_mode", (event.target as HTMLSelectElement).value)}>
              <option value="expander">Expander</option>
              <option value="popup">Popup</option>
            </select>
            <div class="hint">${this.l("Popup פותח את תוכן החדר בחלון עם כפתור סגירה עליון. ניתן לבחור מצב אחר לכל חדר.", "Popup opens the room content in a modal with a top close button. Each room can override this setting.", language)}</div>
          </div>
          <div class="settings-list">${rows.map(([key, title, description, value]) => this.booleanRow(title, description, value, (checked) => this.commitKey(key, checked)))}</div>
        </div>
      </details>
    `;
  }

  private renderSections(resolved: ResolvedOverviewConfig, language: "he" | "en") {
    return html`
      <details>
        ${this.summary("mdi:format-list-bulleted-square", this.l("סעיפים ופעולות", "Sections and actions", language), this.l("עריכת כותרות, סדר וכפתורי הכיבוי", "Edit titles, order, and quick controls", language))}
        <div class="panel">
          <div class="hint">${this.l("ישויות חדשות מצטרפות אוטומטית בסוף הסעיף, כך שהסידור הידני נשאר יציב.", "New entities are appended automatically, so your manual order remains stable.", language)}</div>
          <div class="field">
            <label>${this.l("כפתורי שליטה בכותרת קטגוריה", "Category header controls", language)}</label>
            <select .value=${resolved.section_action_mode} @change=${(event: Event) => this.commitKey("section_action_mode", (event.target as HTMLSelectElement).value)}>
              <option value="toggle">${this.l("כפתור אחד — החלפת מצב", "One smart toggle button", language)}</option>
              <option value="dual">${this.l("שני כפתורים — הדלקה וכיבוי", "Two buttons — on and off", language)}</option>
            </select>
          </div>
          <div class="inline-fields">
            ${(["on", "off", "open", "close"] as const).map((key) => this.iconField(
              this.sectionActionIconName(key, language),
              typeof this.config.section_action_icons?.[key] === "string" ? this.config.section_action_icons[key]! : "",
              SECTION_ACTION_ICONS[key],
              language,
              (value) => this.setSectionActionIcon(key, value),
            ))}
          </div>
          <div class="order-list">
            ${resolved.section_order.map((section, index) => html`
              <div class="order-item">
                <span class="order-icon"><ha-icon icon=${SECTION_ICONS[section]}></ha-icon></span>
                <div class="order-main field">
                  <label>${this.sectionDefaultName(section, language)}</label>
                  <input type="text" .value=${resolved.section_titles[section]} placeholder=${this.sectionDefaultName(section, language)} @change=${(event: Event) => this.setSectionTitle(section, (event.target as HTMLInputElement).value)} />
                </div>
                ${this.orderButtons(index, resolved.section_order.length, () => this.moveSection(section, -1), () => this.moveSection(section, 1))}
                <div class="section-style-editor">
                  ${this.booleanRow(
                    this.l("מסגרת קלה לקטגוריה", "Subtle category frame", language),
                    this.l("ניתן לדרוס את ההגדרה בכל חדר בנפרד.", "Can be overridden for an individual room.", language),
                    resolved.section_styles[section].show_border ?? false,
                    (checked) => this.setGlobalSectionStyle(section, { show_border: checked }),
                  )}
                  ${section === "lights_switches"
                    ? this.numberField(
                        this.l("מספר אריחי תאורה בשורה", "Light tiles per row", language),
                        resolved.section_styles[section].columns ?? 2,
                        1,
                        3,
                        (value) => this.setGlobalSectionStyle(section, { columns: Math.round(value) as 1 | 2 | 3 }),
                      )
                    : nothing}
                  <div class="inline-fields">
                    ${this.valueColorField(
                      this.l("רקע קטגוריה", "Category background", language),
                      resolved.section_styles[section].background ?? "transparent",
                      "#ffffff",
                      Boolean(this.config.section_styles?.[section]?.background),
                      language,
                      (value) => this.setGlobalSectionStyle(section, { background: value || undefined }),
                    )}
                    ${this.valueColorField(
                      this.l("צבע מסגרת", "Frame color", language),
                      resolved.section_styles[section].border_color ?? "var(--divider-color)",
                      "#888888",
                      Boolean(this.config.section_styles?.[section]?.border_color),
                      language,
                      (value) => this.setGlobalSectionStyle(section, { border_color: value || undefined }),
                    )}
                  </div>
                  <div class="inline-fields">
                    ${this.numberField(
                      this.l("עובי המסגרת", "Frame thickness", language),
                      resolved.section_styles[section].border_width ?? 1,
                      0,
                      8,
                      (value) => this.setGlobalSectionStyle(section, { border_width: value }),
                    )}
                    <div class="field">
                      <label>${this.l("סגנון המסגרת", "Frame style", language)}</label>
                      <select .value=${resolved.section_styles[section].border_style ?? "solid"} @change=${(event: Event) => this.setGlobalSectionStyle(section, { border_style: (event.target as HTMLSelectElement).value as OverviewSectionStyle["border_style"] })}>
                        <option value="solid">${this.l("רציף", "Solid", language)}</option>
                        <option value="dashed">${this.l("מקווקו", "Dashed", language)}</option>
                        <option value="dotted">${this.l("מנוקד", "Dotted", language)}</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            `)}
          </div>
          <div class="setting-title">${this.l("פעולות מהירות", "Quick actions", language)}</div>
          <div class="order-list">
            ${[...resolved.quick_actions, ...OVERVIEW_QUICK_ACTIONS.filter((action) => !resolved.quick_actions.includes(action))].map((action) => {
              const enabled = resolved.quick_actions.includes(action);
              const index = resolved.quick_actions.indexOf(action);
              const configuredIcon = this.config.quick_action_icons?.[action];
              const customIcon = typeof configuredIcon === "string" ? configuredIcon : "";
              return html`
                <div class="order-item">
                  <span class="order-icon"><ha-icon icon=${resolved.quick_action_icons[action]}></ha-icon></span>
                  <div class="order-main"><div class="order-title">${this.quickName(action, language)}</div></div>
                  <div class="area-actions">
                    ${enabled ? this.orderButtons(index, resolved.quick_actions.length, () => this.moveQuickAction(action, -1), () => this.moveQuickAction(action, 1)) : nothing}
                    ${this.switchControl(enabled, (checked) => this.toggleQuickAction(action, checked), this.quickName(action, language))}
                  </div>
                  <div class="quick-action-icon-field">
                    ${this.iconField(
                      `${this.l("אייקון פעולה", "Action icon", language)} · ${this.quickName(action, language)}`,
                      customIcon,
                      QUICK_ACTION_ICONS[action],
                      language,
                      (value) => this.setQuickActionIcon(action, value),
                    )}
                  </div>
                </div>
              `;
            })}
          </div>
        </div>
      </details>
    `;
  }

  private renderAreas(
    resolved: ResolvedOverviewConfig,
    areas: AreaOption[],
    entitiesByArea: Map<string, HassEntity[]>,
    language: "he" | "en",
  ) {
    return html`
      <details>
        ${this.summary("mdi:floor-plan", this.l("אזורים בקומה", "Areas", language), this.l("סדר, כותרת, אייקון וחיישנים מועדפים", "Order, title, icon, and preferred sensors", language))}
        <div class="panel">
          ${areas.length
            ? html`<div class="order-list">${areas.map((area) => {
                const parentId = this.normalizedParentId(area.id, resolved);
                const siblings = areas.filter((candidate) => this.normalizedParentId(candidate.id, resolved) === parentId);
                return this.renderAreaEditor(area, siblings.findIndex((candidate) => candidate.id === area.id), siblings.length, resolved, entitiesByArea.get(area.id) ?? [], language);
              })}</div>`
            : html`<div class="empty">${this.l("בחרו יעד כדי לערוך אזורים", "Choose a target to edit its areas", language)}</div>`}
        </div>
      </details>
    `;
  }

  private renderAreaEditor(
    area: AreaOption,
    index: number,
    total: number,
    resolved: ResolvedOverviewConfig,
    areaEntities: HassEntity[],
    language: "he" | "en",
  ) {
    const override = resolved.area_overrides[area.id] ?? resolved.area_overrides[area.name] ?? {};
    const selected = this.activeAreaId === area.id;
    const temperatureOptions = areaEntities.filter(
      (item) => item.entity_id.startsWith("climate.") || (item.entity_id.startsWith("sensor.") && item.attributes.device_class === "temperature"),
    );
    const occupancyOptions = areaEntities.filter((item) => {
      const domain = item.entity_id.split(".")[0];
      return domain === "binary_sensor" || domain === "person" || domain === "device_tracker";
    });
    const occupancyCountOptions = areaEntities.filter((item) => {
      const domain = item.entity_id.split(".")[0];
      return ["sensor", "input_number", "counter"].includes(domain ?? "") && (Number.isFinite(Number(item.state)) || item.entity_id === override.occupancy_count_entity);
    });
    const parentOptions = this.targetAreas(resolved).filter((candidate) => {
      const candidateOverride = resolved.area_overrides[candidate.id] ?? resolved.area_overrides[candidate.name];
      return candidate.id !== area.id && candidateOverride?.hidden !== true && !this.wouldCreateAreaCycle(area.id, candidate.id, resolved);
    });
    const parentValue = override.parent_area
      ? this.areaOptions().find((candidate) => candidate.id === override.parent_area || candidate.name === override.parent_area)?.id ?? ""
      : "";
    const parentName = this.areaOptions().find((candidate) => candidate.id === parentValue)?.name ?? parentValue;
    return html`
      <div class="area-card ${override.hidden ? "hidden" : ""} ${parentValue ? "child" : ""}">
        <div class="area-line">
          <span class="order-icon"><ha-icon icon=${override.icon ?? area.icon}></ha-icon></span>
          <button type="button" class="segment ${selected ? "active" : ""}" @click=${() => (this.activeAreaId = area.id)}>
            ${override.name || area.name}
          </button>
          <div class="area-actions">
            ${this.orderButtons(index, total, () => this.moveArea(area.id, -1, resolved), () => this.moveArea(area.id, 1, resolved))}
            ${this.switchControl(!override.hidden, (checked) => this.updateAreaOverride(area.id, { hidden: !checked }), this.l("הצג אזור", "Show area", language))}
          </div>
        </div>
        ${selected
          ? html`
              <div class="inline-fields">
                <div class="field"><label>${this.l("שם מותאם", "Custom name", language)}</label><input type="text" .value=${override.name ?? ""} placeholder=${area.name} @change=${(event: Event) => this.updateAreaOverride(area.id, { name: (event.target as HTMLInputElement).value || undefined })} /></div>
                ${this.iconField(this.l("אייקון האזור", "Area icon", language), override.icon ?? "", area.icon, language, (value) => this.updateAreaOverride(area.id, { icon: value || undefined }))}
              </div>
              <div class="field">
                <label>${this.l("תת־אזור של", "Parent area", language)}</label>
                <select .value=${parentValue} @change=${(event: Event) => this.updateAreaOverride(area.id, { parent_area: (event.target as HTMLSelectElement).value || undefined })}>
                  <option value="">${this.l("ללא אזור אב", "No parent area", language)}</option>
                  ${parentOptions.map((candidate) => html`<option value=${candidate.id}>${candidate.name}</option>`)}
                </select>
                <div class="hint">${this.l("הקשר הוא חזותי בלבד; המצב והפעולות של כל אזור נשארים עצמאיים.", "Nesting is visual only; every area's state and actions remain independent.", language)}</div>
              </div>
              ${parentValue
                ? this.booleanRow(
                    this.l("הצג כשהאזור הראשי מכווץ", "Show when parent is collapsed", language),
                    this.l(
                      `כבוי כברירת מחדל. כשהאפשרות פעילה, תת־האזור נשאר גלוי בתוך ${parentName} גם כשהוא מכווץ. החצים בשורת האזור קובעים את הסדר רק בין תתי־אזורים של אותו אזור אב.`,
                      `Off by default. When enabled, this child remains visible inside ${parentName} while the parent is collapsed. The arrows in the area row order only children of the same parent.`,
                      language,
                    ),
                    override.show_when_parent_collapsed ?? false,
                    (checked) => this.updateAreaOverride(area.id, { show_when_parent_collapsed: checked }),
                  )
                : nothing}
              <div class="field">
                <label>${this.l("אופן פתיחת חדר זה", "Opening mode for this room", language)}</label>
                <select .value=${override.open_mode ?? ""} @change=${(event: Event) => this.updateAreaOverride(area.id, { open_mode: ((event.target as HTMLSelectElement).value || undefined) as OverviewAreaOverride["open_mode"] })}>
                  <option value="">${this.l("כמו ההגדרה הכללית", "Use global setting", language)}</option>
                  <option value="expander">Expander</option>
                  <option value="popup">Popup</option>
                </select>
              </div>
              <div class="field">
                <label>${this.l("מקור טמפרטורה מועדף", "Preferred temperature source", language)}</label>
                <select .value=${override.temperature_entity ?? ""} @change=${(event: Event) => this.updateAreaOverride(area.id, { temperature_entity: (event.target as HTMLSelectElement).value || undefined })}>
                  <option value="">${this.l("אוטומטי", "Automatic", language)}</option>
                  ${temperatureOptions.map((entity) => html`<option value=${entity.entity_id}>${this.entityName(entity)}</option>`)}
                </select>
              </div>
              <div class="field">
                <label>${this.l("מקור ספירת נוכחים", "Occupancy count source", language)}</label>
                <select .value=${override.occupancy_count_entity ?? ""} @change=${(event: Event) => this.updateAreaOverride(area.id, { occupancy_count_entity: (event.target as HTMLSelectElement).value || undefined })}>
                  <option value="">${this.l("ספירת חיישני נוכחות פעילים", "Count active presence sensors", language)}</option>
                  ${occupancyCountOptions.map((entity) => html`<option value=${entity.entity_id}>${this.entityName(entity)}</option>`)}
                </select>
                <div class="hint">${this.l("בחרו חיישן מספרי כדי להציג מספר אנשים אמיתי; אחרת יוצג מספר חיישני הנוכחות הפעילים.", "Choose a numeric sensor for a true people count; otherwise the card shows the number of active presence sensors.", language)}</div>
              </div>
              ${occupancyOptions.length
                ? html`<div class="field"><label>${this.l("מקורות נוכחות (ריק = אוטומטי)", "Presence sources (empty = automatic)", language)}</label><div class="entity-flags">${occupancyOptions.map((entity) => {
                    const selectedEntity = override.occupancy_entities?.includes(entity.entity_id) ?? false;
                    return html`<label class="check-label"><input type="checkbox" .checked=${selectedEntity} @change=${(event: Event) => this.toggleAreaList(area.id, "occupancy_entities", entity.entity_id, (event.target as HTMLInputElement).checked)} />${this.entityName(entity)}</label>`;
                  })}</div></div>`
                : nothing}
              <div class="setting-row"><div class="setting-main"><div class="setting-title">${this.l("פתוח כברירת מחדל באזור זה", "Expanded by default for this area", language)}</div></div>${this.switchControl(override.default_expanded ?? resolved.default_expanded, (checked) => this.updateAreaOverride(area.id, { default_expanded: checked }), "")}</div>
              <div class="setting-title">${this.l("כותרות סעיפים באזור", "Area section titles", language)}</div>
              <div class="inline-fields">
                ${resolved.section_order.map((section) => html`<div class="field"><label>${this.sectionDefaultName(section, language)}</label><input type="text" .value=${override.section_titles?.[section] ?? ""} placeholder=${resolved.section_titles[section] || this.sectionDefaultName(section, language)} @change=${(event: Event) => this.setAreaSectionTitle(area.id, section, (event.target as HTMLInputElement).value)} /></div>`)}
              </div>
              <div class="setting-title">${this.l("מראה קטגוריות בחדר", "Room category appearance", language)}</div>
              <div class="order-list">
                ${resolved.section_order.map((section) => {
                  const globalStyle = resolved.section_styles[section];
                  const localStyle = override.section_styles?.[section] ?? {};
                  return html`
                    <div class="area-card">
                      <div class="setting-title">${this.sectionDefaultName(section, language)}</div>
                      ${this.booleanRow(
                        this.l("הצג מסגרת בחדר זה", "Show frame in this room", language),
                        "",
                        localStyle.show_border ?? globalStyle.show_border ?? false,
                        (checked) => this.setAreaSectionStyle(area.id, section, { show_border: checked }),
                      )}
                      ${section === "lights_switches"
                        ? html`<div class="field">
                            <label>${this.l("מספר תאורות בשורה בחדר זה", "Light tiles per row in this room", language)}</label>
                            <select .value=${localStyle.columns === undefined ? "" : String(localStyle.columns)} @change=${(event: Event) => {
                              const value = (event.target as HTMLSelectElement).value;
                              this.setAreaSectionStyle(area.id, section, { columns: value ? Number(value) as 1 | 2 | 3 : undefined });
                            }}>
                              <option value="">${this.l("כמו ההגדרה הכללית", "Use global setting", language)}</option>
                              <option value="1">1</option><option value="2">2</option><option value="3">3</option>
                            </select>
                          </div>`
                        : nothing}
                      <div class="inline-fields">
                        ${this.valueColorField(
                          this.l("רקע בחדר זה", "Background in this room", language),
                          localStyle.background ?? globalStyle.background ?? "transparent",
                          "#ffffff",
                          Boolean(localStyle.background),
                          language,
                          (value) => this.setAreaSectionStyle(area.id, section, { background: value || undefined }),
                        )}
                        ${this.valueColorField(
                          this.l("צבע מסגרת בחדר זה", "Frame color in this room", language),
                          localStyle.border_color ?? globalStyle.border_color ?? "var(--divider-color)",
                          "#888888",
                          Boolean(localStyle.border_color),
                          language,
                          (value) => this.setAreaSectionStyle(area.id, section, { border_color: value || undefined }),
                        )}
                      </div>
                      <div class="inline-fields">
                        <div class="field">
                          <label>${this.l("עובי מסגרת בחדר זה", "Frame thickness in this room", language)}</label>
                          <input
                            type="number"
                            min="0"
                            max="8"
                            .value=${localStyle.border_width === undefined ? "" : String(localStyle.border_width)}
                            placeholder=${String(globalStyle.border_width ?? 1)}
                            @change=${(event: Event) => {
                              const value = (event.target as HTMLInputElement).value;
                              this.setAreaSectionStyle(area.id, section, { border_width: value === "" ? undefined : Number(value) });
                            }}
                          />
                        </div>
                        <div class="field">
                          <label>${this.l("סגנון מסגרת בחדר זה", "Frame style in this room", language)}</label>
                          <select .value=${localStyle.border_style ?? ""} @change=${(event: Event) => this.setAreaSectionStyle(area.id, section, { border_style: ((event.target as HTMLSelectElement).value || undefined) as OverviewSectionStyle["border_style"] })}>
                            <option value="">${this.l("כמו ההגדרה הכללית", "Use global style", language)}</option>
                            <option value="solid">${this.l("רציף", "Solid", language)}</option>
                            <option value="dashed">${this.l("מקווקו", "Dashed", language)}</option>
                            <option value="dotted">${this.l("מנוקד", "Dotted", language)}</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  `;
                })}
              </div>
            `
          : nothing}
      </div>
    `;
  }

  private renderEntities(
    resolved: ResolvedOverviewConfig,
    discovery: ReturnType<typeof discoverOverview>,
    areas: AreaOption[],
    language: "he" | "en",
  ) {
    const areaId = this.activeAreaId || areas[0]?.id || "";
    const area = discovery.areas.find((item) => item.id === areaId);
    const editableArea = discoverOverview(this.hass, this.configForEntityEditor(resolved, areaId)).areas.find((item) => item.id === areaId);
    const discovered = new Map((editableArea?.allEntities ?? area?.allEntities ?? []).map((item) => [item.entityId, item]));
    const editableEntities = this.entitiesForEditor(areaId, discovered, resolved);
    const candidates = this.unclassifiedCandidates(areaId, discovered);
    const entities = editableEntities.filter((item) => `${item.name} ${item.entityId} ${item.section}`.toLowerCase().includes(this.entitySearch.toLowerCase()));
    return html`
      <details>
        ${this.summary("mdi:tune-variant", this.l("רכיבים וסדר", "Devices and order", language), this.l("שיוך סעיף, שם, הגנה וסדר לכל אזור", "Section, name, protection, and order per area", language))}
        <div class="panel">
          <div class="entity-toolbar">
            <select .value=${areaId} @change=${(event: Event) => (this.activeAreaId = (event.target as HTMLSelectElement).value)}>${areas.map((item) => html`<option value=${item.id}>${item.name}</option>`)}</select>
            <input type="search" placeholder=${this.l("חיפוש רכיב", "Search devices", language)} .value=${this.entitySearch} @input=${(event: Event) => (this.entitySearch = (event.target as HTMLInputElement).value)} />
          </div>
          <div class="hint">${this.l("לכל רכיב יש כפתור הסתרה מלא. רכיב מוסתר נשאר כאן לשחזור, אך אינו מוצג ואינו משפיע על צבע, מונים או פעולות האזור.", "Every device has a complete hide control. Hidden devices remain here for restore, but do not appear or affect area color, counts, or actions.", language)}</div>
          ${candidates.length
            ? html`
                <div class="area-card">
                  <div class="setting-title">${this.l("הוספת רכיב שלא זוהה", "Add an unclassified device", language)}</div>
                  <div class="entity-fields">
                    <div class="field">
                      <label>${this.l("רכיב", "Device", language)}</label>
                      <select .value=${this.candidateEntityId} @change=${(event: Event) => (this.candidateEntityId = (event.target as HTMLSelectElement).value)}>
                        <option value="">${this.l("בחרו...", "Choose...", language)}</option>
                        ${candidates.map((entity) => html`<option value=${entity.entity_id}>${this.entityName(entity)}</option>`)}
                      </select>
                    </div>
                    <div class="field">
                      <label>${this.l("סעיף", "Section", language)}</label>
                      <select .value=${this.candidateSection} @change=${(event: Event) => (this.candidateSection = (event.target as HTMLSelectElement).value as OverviewSectionId)}>
                        ${OVERVIEW_SECTIONS.map((section) => html`<option value=${section}>${this.sectionDefaultName(section, language)}</option>`)}
                      </select>
                    </div>
                  </div>
                  <button class="small-button segment" type="button" ?disabled=${!this.candidateEntityId} @click=${() => this.addCandidateEntity()}>
                    ${this.l("הוסף לסעיף", "Add to section", language)}
                  </button>
                </div>
              `
            : nothing}
          <div class="entity-list">
            ${entities.length
              ? entities.map((item) => {
                   const override = resolved.entity_overrides[item.entityId] ?? {};
                   const sectionEntities = editableEntities.filter((entity) => entity.section === item.section);
                   const index = sectionEntities.findIndex((entity) => entity.entityId === item.entityId);
                   const excluded = this.isEntityExcluded(areaId, item.entityId, resolved);
                   const globallyExcluded = this.isEntityGloballyExcluded(item.entityId, resolved);
                   const visibilityLabel = globallyExcluded
                     ? this.l("מוסתר גלובלית — ניתן לשנות במתקדם", "Globally hidden — change it in Advanced", language)
                     : excluded
                       ? this.l("החזר רכיב לאזור", "Restore device to area", language)
                       : this.l("הסתר רכיב לחלוטין מהאזור", "Hide device completely from area", language);
                   return html`
                    <div class="entity-item ${!excluded && item.active ? "active" : ""} ${excluded ? "excluded" : ""}">
                      <span class="order-icon"><ha-icon icon=${override.icon ?? item.icon}></ha-icon></span>
                      <div class="order-main"><div class="order-title">${override.name || item.name}</div><div class="meta">${item.entityId}${excluded ? ` · ${globallyExcluded ? this.l("מוסתר גלובלית", "globally hidden", language) : this.l("מוסר מהאזור", "removed from area", language)}` : ""}</div></div>
                      <button
                        class="visibility-button ${excluded ? "restore" : ""}"
                        type="button"
                        title=${visibilityLabel}
                        aria-label=${`${visibilityLabel}: ${item.name}`}
                        ?disabled=${globallyExcluded}
                        @click=${() => this.setEntityVisible(areaId, item.entityId, excluded)}
                      ><ha-icon icon=${excluded ? "mdi:restore" : "mdi:eye-off-outline"}></ha-icon></button>
                      <div class="entity-fields">
                        <div class="field"><label>${this.l("שם מותאם", "Custom name", language)}</label><input type="text" .value=${override.name ?? ""} placeholder=${item.name} @change=${(event: Event) => this.updateEntityOverride(item.entityId, { name: (event.target as HTMLInputElement).value || undefined })} /></div>
                        <div class="field"><label>${this.l("סעיף", "Section", language)}</label><select .value=${override.section ?? item.section} @change=${(event: Event) => this.updateEntityOverride(item.entityId, { section: (event.target as HTMLSelectElement).value as OverviewSectionId })}>${OVERVIEW_SECTIONS.map((section) => html`<option value=${section}>${this.sectionDefaultName(section, language)}</option>`)}</select></div>
                        <div class="field"><label>${this.l("תת־קבוצה בתוך החדר", "Sub-group inside room", language)}</label><input type="text" .value=${override.group ?? item.group ?? ""} placeholder=${this.l("לדוגמה: מקלחת", "Example: Shower", language)} @change=${(event: Event) => this.updateEntityOverride(item.entityId, { group: (event.target as HTMLInputElement).value.trim() || undefined })} /><div class="hint">${this.l("רכיבים עם אותו שם קבוצה יוצגו יחד בתוך הקטגוריה.", "Devices with the same group name are shown together inside the category.", language)}</div></div>
                        ${this.iconField(this.l("אייקון הרכיב", "Device icon", language), override.icon ?? "", item.icon, language, (value) => this.updateEntityOverride(item.entityId, { icon: value || undefined }))}
                        ${item.section === "lights_switches" ? html`
                          <div class="field"><label>${this.l("צורת האריח", "Tile shape", language)}</label><select .value=${override.tile_shape ?? ""} @change=${(event: Event) => this.updateEntityOverride(item.entityId, { tile_shape: ((event.target as HTMLSelectElement).value || undefined) as OverviewEntityOverride["tile_shape"] })}><option value="">${this.l("כמו ההגדרה הכללית", "Use global setting", language)}</option><option value="rectangle">${this.l("מלבן", "Rectangle", language)}</option><option value="square">${this.l("ריבוע", "Square", language)}</option></select></div>
                          <div class="field"><label>${this.l("מיקום האייקון", "Icon position", language)}</label><select .value=${override.icon_position ?? ""} @change=${(event: Event) => this.updateEntityOverride(item.entityId, { icon_position: ((event.target as HTMLSelectElement).value || undefined) as OverviewEntityOverride["icon_position"] })}><option value="">${this.l("כמו ההגדרה הכללית", "Use global setting", language)}</option><option value="start">${this.l("תחילת השורה לפי השפה", "Language start", language)}</option><option value="right">${this.l("ימין", "Right", language)}</option><option value="left">${this.l("שמאל", "Left", language)}</option><option value="center">${this.l("מרכז", "Center", language)}</option></select></div>
                          <div class="field"><label>${this.l("הצגת מידע", "State information", language)}</label><select .value=${override.show_state === undefined ? "" : String(override.show_state)} @change=${(event: Event) => { const value = (event.target as HTMLSelectElement).value; this.updateEntityOverride(item.entityId, { show_state: value === "" ? undefined : value === "true" }); }}><option value="">${this.l("כמו ההגדרה הכללית", "Use global setting", language)}</option><option value="true">${this.l("הצג", "Show", language)}</option><option value="false">${this.l("הסתר", "Hide", language)}</option></select></div>
                          <div class="field"><label>${this.l("שפת מצב הרכיב", "Device state language", language)}</label><select .value=${override.state_language ?? ""} @change=${(event: Event) => this.updateEntityOverride(item.entityId, { state_language: ((event.target as HTMLSelectElement).value || undefined) as OverviewEntityOverride["state_language"] })}><option value="">${this.l("כמו ההגדרה הכללית", "Use global setting", language)}</option><option value="auto">Auto</option><option value="he">עברית</option><option value="en">English</option></select></div>
                        ` : nothing}
                      </div>
                      <div class="entity-flags">
                        <label class="check-label"><input type="checkbox" .checked=${override.protected ?? item.protected} @change=${(event: Event) => this.updateEntityOverride(item.entityId, { protected: (event.target as HTMLInputElement).checked })} />${this.l("מוגן מכיבוי קבוצתי", "Protect from group off", language)}</label>
                        <label class="check-label" title=${this.l("הרכיב נשאר גלוי וניתן לשליטה, אך לא ישפיע על צבע החדר, מצב הקומה או תגי הפעולה המהירה.", "The device stays visible and controllable, but does not affect room color, floor state, or quick-action badges.", language)}><input type="checkbox" .checked=${override.ignore_activity ?? item.ignoreActivity ?? false} @change=${(event: Event) => this.updateEntityOverride(item.entityId, { ignore_activity: (event.target as HTMLInputElement).checked })} />${this.l("אל תשפיע על מצב החדר והקומה", "Ignore in room and floor activity", language)}</label>
                        ${this.orderButtons(index, sectionEntities.length, () => this.moveEntity(areaId, item.section, item.entityId, -1, sectionEntities.map((entity) => entity.entityId)), () => this.moveEntity(areaId, item.section, item.entityId, 1, sectionEntities.map((entity) => entity.entityId)))}
                      </div>
                    </div>
                  `;
                })
              : html`<div class="empty">${this.l("אין רכיבים להצגה באזור זה", "No devices to show in this area", language)}</div>`}
          </div>
        </div>
      </details>
    `;
  }

  private renderAppearance(resolved: ResolvedOverviewConfig, language: "he" | "en") {
    return html`
      <details>
        ${this.summary("mdi:palette-outline", this.l("מראה ושפה", "Appearance and language", language), this.l("צבעים, מרווחים ו-RTL", "Colors, spacing, and RTL", language))}
        <div class="panel">
          <div class="setting-title">${this.l("ערכת עיצוב", "Design theme", language)}</div>
          <div class="theme-preset-grid" role="radiogroup" aria-label=${this.l("בחירת ערכת עיצוב", "Choose design theme", language)}>
            ${([
              ["classic", this.l("קלאסי", "Classic", language), this.l("המראה המקורי, משתלב עם ערכת Home Assistant", "Original look that follows the Home Assistant theme", language)],
              ["elegant", this.l("אלגנטי · ספיר", "Elegant · Sapphire", language), this.l("כחול מעושן, מתכת עדינה וניגודיות רגועה", "Muted blue, subtle metallic depth, calm contrast", language)],
              ["light", this.l("מואר · שמיים", "Luminous · Sky", language), this.l("לבן נקי, תכלת רך ותחושה אוורירית", "Clean white, soft sky blue, airy finish", language)],
              ["dark", this.l("כהה · חצות", "Dark · Midnight", language), this.l("גרפיט עמוק, טורקיז מרוסן וקריאות גבוהה", "Deep graphite, restrained teal, high readability", language)],
              ["modern", this.l("עכשווי · מרווה", "Modern · Sage", language), this.l("גוונים טבעיים, חמים ומינימליסטיים", "Natural, warm, minimalist tones", language)],
            ] as Array<[OverviewThemePreset, string, string]>).map(([preset, title, description]) => {
              const palette = { ...OVERVIEW_DEFAULT_STYLE, ...OVERVIEW_THEME_PRESETS[preset] };
              return html`<button
                class="theme-preset ${resolved.theme_preset === preset ? "selected" : ""}"
                type="button"
                role="radio"
                aria-checked=${resolved.theme_preset === preset}
                style=${`--theme-card:${palette.card_background};--theme-active:${palette.active_surface};--theme-control:${palette.control_surface};--theme-accent:${palette.accent_color};--theme-frame:${palette.area_frame_color || "var(--divider-color)"}`}
                @click=${() => this.applyThemePreset(preset)}
              ><span class="theme-preset-preview"><span class="theme-preset-swatches"><i></i><i></i><i></i></span></span><span class="theme-preset-copy"><strong>${title}</strong><span>${description}</span></span></button>`;
            })}
          </div>
          <div class="hint">${this.l("בחירת ערכה מחליפה את צבעי הערכה בלבד. לאחר מכן ניתן להתאים כל צבע ידנית.", "Choosing a theme replaces theme colors only; every color can still be fine-tuned below.", language)}</div>
          <div class="inline-fields">
            <div class="field"><label>${this.l("מיקום פעולות מהירות בחדר", "Room quick-actions position", language)}</label><select .value=${resolved.quick_actions_position} @change=${(event: Event) => this.commitKey("quick_actions_position", (event.target as HTMLSelectElement).value)}><option value="opposite">${this.l("בצד הנגדי לשם", "Opposite the room name", language)}</option><option value="near_name">${this.l("צמוד לשם החדר", "Next to the room name", language)}</option></select></div>
            <div class="field"><label>${this.l("מיקום תגי מזגן ומאוורר", "Climate and fan tag position", language)}</label><select .value=${resolved.climate_tag_position} @change=${(event: Event) => this.commitKey("climate_tag_position", (event.target as HTMLSelectElement).value)}><option value="left">${this.l("משמאל לטמפרטורה", "Left of temperature", language)}</option><option value="right">${this.l("מימין לטמפרטורה", "Right of temperature", language)}</option><option value="top">${this.l("מעל הטמפרטורה", "Above temperature", language)}</option><option value="bottom">${this.l("מתחת לטמפרטורה", "Below temperature", language)}</option></select></div>
            <div class="field"><label>${this.l("שפת מצב דלוק/כבוי", "On/off state language", language)}</label><select .value=${resolved.entity_state_language} @change=${(event: Event) => this.commitKey("entity_state_language", (event.target as HTMLSelectElement).value)}><option value="auto">Auto</option><option value="he">עברית</option><option value="en">English</option></select></div>
            <div class="field"><label>${this.l("צורת אריחי תאורה", "Light tile shape", language)}</label><select .value=${resolved.light_tile_shape} @change=${(event: Event) => this.commitKey("light_tile_shape", (event.target as HTMLSelectElement).value)}><option value="rectangle">${this.l("מלבנים", "Rectangles", language)}</option><option value="square">${this.l("ריבועים", "Squares", language)}</option></select></div>
            <div class="field"><label>${this.l("מיקום אייקון תאורה", "Light icon position", language)}</label><select .value=${resolved.light_icon_position} @change=${(event: Event) => this.commitKey("light_icon_position", (event.target as HTMLSelectElement).value)}><option value="start">${this.l("תחילת השורה לפי השפה", "Language start", language)}</option><option value="right">${this.l("ימין", "Right", language)}</option><option value="left">${this.l("שמאל", "Left", language)}</option><option value="center">${this.l("מרכז", "Center", language)}</option></select></div>
          </div>
          ${this.booleanRow(this.l("הצג תג מאוורר פעיל", "Show active fan tag", language), this.l("מאוורר נשאר בתוך קטגוריית המיזוג ופותח את אותו חלון שליטה.", "Fans remain in the climate category and open the same control popup.", language), resolved.show_fan_tag, (checked) => this.commitKey("show_fan_tag", checked))}
          ${this.booleanRow(this.l("הצג מידע באריחי תאורה", "Show state on light tiles", language), this.l("ניתן לדרוס הגדרה זו לכל רכיב בנפרד.", "Can be overridden for each device.", language), resolved.light_show_state, (checked) => this.commitKey("light_show_state", checked))}
          ${this.booleanRow(this.l("קשר צבע מסגרות קטגוריה למסגרת החדר", "Link category frames to room frame", language), this.l("קטגוריה ללא צבע פרטי תקבל גוון בהיר או כהה מצבע מסגרת החדר.", "A category without its own color receives a lighter or darker shade of the room frame.", language), resolved.style.link_section_frame_color, (checked) => this.setStyle("link_section_frame_color", checked))}
          <div class="inline-fields">
            ${this.numberField(this.l("עיגול פינות", "Corner radius", language), resolved.style.border_radius, 4, 40, (value) => this.setStyle("border_radius", value))}
            ${this.numberField(this.l("טשטוש זכוכית", "Glass blur", language), resolved.style.blur, 0, 40, (value) => this.setStyle("blur", value))}
            ${this.numberField(this.l("גובה שורה", "Row height", language), resolved.style.row_height, 44, 84, (value) => this.setStyle("row_height", value))}
            ${this.numberField(this.l("גודל שם חדר", "Room name size", language), resolved.style.area_name_size, 11, 24, (value) => this.setStyle("area_name_size", value))}
            ${this.numberField(this.l("מרווח כללי", "General spacing", language), resolved.style.section_gap, 4, 30, (value) => this.setStyle("section_gap", value))}
            ${this.numberField(this.l("רווח בין קטגוריות", "Gap between categories", language), resolved.style.category_gap, 0, 40, (value) => this.setStyle("category_gap", value))}
            ${this.numberField(this.l("גודל עיגול פעולה מהירה בחדר", "Room quick-action circle size", language), resolved.style.quick_action_size, 28, 52, (value) => this.setStyle("quick_action_size", value))}
            ${this.numberField(this.l("גודל אייקון פעולה מהירה בחדר", "Room quick-action icon size", language), resolved.style.quick_action_icon_size, 14, 34, (value) => this.setStyle("quick_action_icon_size", value))}
            ${this.numberField(this.l("גודל כפתור פעולה בקטגוריה", "Category action button size", language), resolved.style.section_action_size, 36, 56, (value) => this.setStyle("section_action_size", value))}
            ${this.numberField(this.l("גודל אייקון פעולה בקטגוריה", "Category action icon size", language), resolved.style.section_action_icon_size, 16, 36, (value) => this.setStyle("section_action_icon_size", value))}
            ${this.numberField(this.l("עובי מסגרת החדר", "Room frame thickness", language), resolved.style.area_frame_width, 0, 8, (value) => this.setStyle("area_frame_width", value))}
            ${this.numberField(this.l("מרחק תג מהטמפרטורה", "Tag distance from temperature", language), resolved.style.climate_tag_gap, 0, 20, (value) => this.setStyle("climate_tag_gap", value))}
            ${this.numberField(this.l("הפרש בהירות מסגרת קטגוריה", "Category frame brightness difference", language), resolved.style.section_frame_brightness, -100, 100, (value) => this.setStyle("section_frame_brightness", value))}
          </div>
          ${this.booleanRow(
            this.l("רקע כרטיס שקוף", "Transparent card background", language),
            this.l("מציג את רקע הדשבורד שמאחורי הכרטיס. כיבוי האפשרות משתמש בצבע שנבחר למטה.", "Shows the dashboard behind the card. Turn it off to use the background color selected below.", language),
            resolved.style.card_transparent,
            (checked) => this.setStyle("card_transparent", checked),
          )}
          <div class="setting-title">${this.l("צבעי מצב", "State colors", language)}</div>
          <div class="state-preview">
            <div class="state-preview-item off" style=${`--preview-surface: ${resolved.style.row_background}`}>${this.l("כבוי", "OFF", language)}</div>
            <div class="state-preview-item on" style=${`--preview-surface: ${resolved.style.active_surface}`}>${this.l("חדר פעיל", "Active room", language)}</div>
            <div class="state-preview-item on" style=${`--preview-surface: ${resolved.style.entity_active_surface}`}>${this.l("רכיב דלוק", "Active device", language)}</div>
          </div>
          <div class="inline-fields">
            ${this.colorField(this.l("רקע הכרטיס", "Card background", language), "card_background", resolved.style.card_background, "#ffffff", language)}
            ${this.colorField(this.l("רקע כבוי", "OFF surface", language), "row_background", resolved.style.row_background, "#e7e7e7", language)}
            ${this.colorField(this.l("רקע חדר או קומה פעילים", "Active room or floor surface", language), "active_surface", resolved.style.active_surface, "#aed7db", language)}
            ${this.colorField(this.l("רקע רכיב דלוק", "Active device surface", language), "entity_active_surface", resolved.style.entity_active_surface, "#aed7db", language)}
            ${this.colorField(this.l("צבע מסגרת החדר", "Room frame color", language), "area_frame_color", resolved.style.area_frame_color || "var(--divider-color)", "#607086", language)}
            ${this.colorField(this.l("צבע תג פעיל", "Active count badge", language), "active_color", resolved.style.active_color, "#ffd54f", language)}
            ${this.colorField(this.l("צבע נוכחות פעילה", "Occupied presence color", language), "occupancy_active_color", resolved.style.occupancy_active_color, "#b8f5c2", language)}
            ${this.colorField(this.l("צבע חדר ריק", "Vacant presence color", language), "occupancy_vacant_color", resolved.style.occupancy_vacant_color, "#f4f3ec", language)}
            ${this.colorField(this.l("צבע נוכחות לא ידועה", "Unknown presence color", language), "occupancy_unknown_color", resolved.style.occupancy_unknown_color, "#ffcc80", language)}
            ${this.colorField(this.l("צבע הדגשה", "Accent color", language), "accent_color", resolved.style.accent_color, "#03a9f4", language)}
            ${this.colorField(this.l("צבע טקסט ראשי", "Primary text color", language), "primary_text_color", resolved.style.primary_text_color, "#172033", language)}
            ${this.colorField(this.l("צבע טקסט משני", "Secondary text color", language), "secondary_text_color", resolved.style.secondary_text_color, "#526174", language)}
            ${this.colorField(this.l("טקסט על רקע פעיל", "Text on active surfaces", language), "active_text_color", resolved.style.active_text_color, "#172033", language)}
            ${this.colorField(this.l("טקסט על כפתורי שליטה", "Text on control pills", language), "control_text_color", resolved.style.control_text_color, "#f8fafc", language)}
            ${this.colorField(this.l("טמפרטורה — מיזוג כבוי", "Temperature — climate off", language), "temperature_off_surface", resolved.style.temperature_off_surface, "#0b1c3a", language)}
            ${this.colorField(this.l("טמפרטורה — קירור", "Temperature — cooling", language), "temperature_cool_surface", resolved.style.temperature_cool_surface, "#2271c4", language)}
            ${this.colorField(this.l("טמפרטורה — חימום", "Temperature — heating", language), "temperature_heat_surface", resolved.style.temperature_heat_surface, "#c6532f", language)}
            ${this.colorField(this.l("טמפרטורה — מצב פעיל אחר", "Temperature — other active mode", language), "temperature_active_surface", resolved.style.temperature_active_surface, "#5b56a8", language)}
            ${this.colorField(this.l("רקע מזגן פעיל", "Active climate surface", language), "climate_surface", resolved.style.climate_surface, "#8bb5ff", language)}
            ${this.colorField(this.l("רקע פקדי גלולה", "Pill control surface", language), "control_surface", resolved.style.control_surface, "#0b1c3a", language)}
            ${this.colorField(this.l("צבע מיזוג", "Climate accent", language), "climate_color", resolved.style.climate_color, "#2196f3", language)}
            ${this.colorField(this.l("צבע תריסים", "Cover accent", language), "cover_color", resolved.style.cover_color, "#00bcd4", language)}
            ${this.colorField(this.l("צבע מוזיקה", "Music accent", language), "media_color", resolved.style.media_color, "#9c27b0", language)}
          </div>
          <div class="inline-fields">
            <div class="field"><label>${this.l("שפה", "Language", language)}</label><select .value=${resolved.language} @change=${(event: Event) => this.commitKey("language", (event.target as HTMLSelectElement).value)}><option value="auto">Auto</option><option value="he">עברית</option><option value="en">English</option></select></div>
            <div class="field"><label>RTL</label><select .value=${String(resolved.rtl)} @change=${(event: Event) => this.commitKey("rtl", this.parseRtl((event.target as HTMLSelectElement).value))}><option value="auto">Auto</option><option value="true">Enabled</option><option value="false">Disabled</option></select></div>
          </div>
        </div>
      </details>
    `;
  }

  private renderAdvanced(resolved: ResolvedOverviewConfig, language: "he" | "en") {
    return html`
      <details>
        ${this.summary("mdi:cog-outline", this.l("מתקדם ובטיחות", "Advanced and safety", language), this.l("תוויות, החרגות ומזהה אחסון", "Labels, exclusions, and storage ID", language))}
        <div class="panel">
          ${this.listField(this.l("תוויות חימום רצפתי", "Floor-heating labels", language), resolved.floor_heating_labels, (value) => this.commitKey("floor_heating_labels", value))}
          ${this.listField(this.l("ישויות חימום רצפתי", "Floor-heating entities", language), resolved.floor_heating_entities, (value) => this.commitKey("floor_heating_entities", value))}
          ${this.listField(this.l("ישויות מוגנות", "Protected entities", language), resolved.protected_entities, (value) => this.commitKey("protected_entities", value))}
          ${this.listField(this.l("תוויות מוגנות", "Protected labels", language), resolved.protected_labels, (value) => this.commitKey("protected_labels", value))}
          ${this.listField(this.l("ישויות מוסתרות", "Excluded entities", language), resolved.exclude_entities, (value) => this.commitKey("exclude_entities", value))}
          <div class="field"><label>${this.l("מזהה יציב לכרטיס", "Stable card ID", language)}</label><input type="text" .value=${resolved.id} placeholder="kids-room" @change=${(event: Event) => this.commitKey("id", (event.target as HTMLInputElement).value)} /><div class="hint">${this.l("משמש לשמירת מצב פתיחה. מומלץ כאשר יש כמה כרטיסים לאותו יעד.", "Used to remember expansion; recommended when several cards share a target.", language)}</div></div>
          ${this.booleanRow(this.l("מצב אבחון", "Debug mode", language), this.l("מציג את מודל הגילוי בתוך הכרטיס", "Shows the discovery model inside the card", language), resolved.debug, (checked) => this.commitKey("debug", checked))}
        </div>
      </details>
    `;
  }

  private summary(icon: string, title: string, subtitle: string) {
    return html`<summary><ha-icon icon=${icon}></ha-icon><span><span class="summary-title">${title}</span><span class="summary-subtitle">${subtitle}</span></span><ha-icon class="chevron" icon="mdi:chevron-down"></ha-icon></summary>`;
  }

  private booleanRow(title: string, description: string, value: boolean, onChange: (checked: boolean) => void) {
    return html`<div class="setting-row"><div class="setting-main"><div class="setting-title">${title}</div>${description ? html`<div class="meta">${description}</div>` : nothing}</div>${this.switchControl(value, onChange, title)}</div>`;
  }

  private switchControl(value: boolean, onChange: (checked: boolean) => void, label: string) {
    return html`<label class="switch" title=${label}><input type="checkbox" .checked=${value} aria-label=${label} @change=${(event: Event) => onChange((event.target as HTMLInputElement).checked)} /><span></span></label>`;
  }

  private orderButtons(index: number, total: number, up: () => void, down: () => void) {
    return html`<div class="order-controls"><button class="icon-button" type="button" ?disabled=${index <= 0} @click=${up} aria-label="Move up"><ha-icon icon="mdi:arrow-up"></ha-icon></button><button class="icon-button" type="button" ?disabled=${index < 0 || index >= total - 1} @click=${down} aria-label="Move down"><ha-icon icon="mdi:arrow-down"></ha-icon></button></div>`;
  }

  private numberField(label: string, value: number, min: number, max: number, onChange: (value: number) => void) {
    return html`<div class="field"><label>${label}</label><input type="number" min=${min} max=${max} .value=${String(value)} @change=${(event: Event) => onChange(Number((event.target as HTMLInputElement).value))} /></div>`;
  }

  private listField(label: string, value: string[], onChange: (value: string[]) => void) {
    return html`<div class="field"><label>${label}</label><textarea .value=${value.join("\n")} @change=${(event: Event) => onChange(this.splitList((event.target as HTMLTextAreaElement).value))}></textarea></div>`;
  }

  private iconField(label: string, value: string, automaticIcon: string, language: "he" | "en", onChange: (value: string) => void) {
    const effectiveIcon = value.trim() || automaticIcon || "mdi:circle-outline";
    return html`
      <div class="field">
        <label>${label}</label>
        <div class="icon-picker-row">
          <span class="icon-preview"><ha-icon icon=${effectiveIcon}></ha-icon></span>
          <ha-icon-picker
            .hass=${this.hass}
            .value=${value}
            @value-changed=${(event: Event) => onChange(this.controlValue(event))}
          ></ha-icon-picker>
          <button class="reset-button" type="button" ?disabled=${!value} @click=${() => onChange("")}>${this.l("איפוס", "Reset", language)}</button>
        </div>
        <div class="hint">${this.l("החיפוש נמצא בתוך בורר האייקונים.", "Search is built into the icon picker.", language)}</div>
      </div>
    `;
  }

  private colorField(
    label: string,
    key: keyof OverviewStyleConfig,
    value: string,
    pickerFallback: string,
    language: "he" | "en",
  ) {
    const customized = this.config.style?.[key] !== undefined;
    return html`
      <div class="field">
        <label>${label}</label>
        <div class="color-control">
          <input type="color" .value=${this.pickerColor(value, pickerFallback)} aria-label=${label} @input=${(event: Event) => this.setStyle(key, (event.target as HTMLInputElement).value)} />
          <input type="text" .value=${value} aria-label=${`${label} CSS`} @change=${(event: Event) => this.setStyle(key, (event.target as HTMLInputElement).value.trim())} />
          <button class="reset-button" type="button" ?disabled=${!customized} @click=${() => this.setStyle(key, undefined)}>${this.l("איפוס", "Reset", language)}</button>
        </div>
      </div>
    `;
  }

  private valueColorField(
    label: string,
    value: string,
    pickerFallback: string,
    customized: boolean,
    language: "he" | "en",
    onChange: (value: string) => void,
  ) {
    return html`
      <div class="field">
        <label>${label}</label>
        <div class="color-control">
          <input type="color" .value=${this.pickerColor(value, pickerFallback)} aria-label=${label} @input=${(event: Event) => onChange((event.target as HTMLInputElement).value)} />
          <input type="text" .value=${value} aria-label=${`${label} CSS`} @change=${(event: Event) => onChange((event.target as HTMLInputElement).value.trim())} />
          <button class="reset-button" type="button" ?disabled=${!customized} @click=${() => onChange("")}>${this.l("איפוס", "Reset", language)}</button>
        </div>
      </div>
    `;
  }

  private pickerColor(value: string, fallback: string): string {
    const hex = value.trim().match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i)?.[1];
    if (hex) return hex.length === 3 ? `#${[...hex].map((part) => `${part}${part}`).join("")}` : `#${hex}`;
    const rgb = value.match(/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/i);
    if (!rgb) return fallback;
    return `#${rgb.slice(1, 4).map((part) => Math.max(0, Math.min(255, Math.round(Number(part)))).toString(16).padStart(2, "0")).join("")}`;
  }

  private controlValue(event: Event): string {
    const detail = (event as CustomEvent<{ value?: unknown }>).detail;
    const target = event.currentTarget as HTMLElement & { value?: unknown };
    const value = detail?.value ?? target.value;
    return typeof value === "string" ? value.trim() : "";
  }

  private areaOptions(): AreaOption[] {
    return Object.entries(this.hass?.areas ?? {})
      .map(([key, area]) => ({ id: area.area_id ?? area.id ?? key, name: area.name, icon: area.icon ?? "mdi:floor-plan", floorId: area.floor_id ?? undefined }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  private floorOptions(): Array<{ id: string; name: string; icon: string }> {
    return Object.entries(this.hass?.floors ?? {})
      .map(([key, floor]) => ({ id: floor.floor_id ?? floor.id ?? key, name: floor.name, icon: floor.icon ?? "mdi:home-floor-0", level: floor.level ?? Number.MAX_SAFE_INTEGER }))
      .sort((a, b) => a.level - b.level || a.name.localeCompare(b.name));
  }

  private targetAreas(resolved: ResolvedOverviewConfig): AreaOption[] {
    const options = this.areaOptions();
    let selected = options;
    if (resolved.area) selected = options.filter((area) => area.id === resolved.area || area.name === resolved.area);
    if (resolved.floor) {
      const floorId = this.floorIdFor(resolved.floor);
      selected = options.filter((area) => area.floorId === floorId);
    }
    return selected.sort((a, b) => {
      const ai = resolved.area_order.findIndex((item) => item === a.id || item === a.name);
      const bi = resolved.area_order.findIndex((item) => item === b.id || item === b.name);
      return (ai < 0 ? Number.MAX_SAFE_INTEGER : ai) - (bi < 0 ? Number.MAX_SAFE_INTEGER : bi) || a.name.localeCompare(b.name);
    });
  }

  private entityMapByArea(): Map<string, HassEntity[]> {
    const result = new Map<string, HassEntity[]>();
    for (const entity of Object.values(this.hass?.states ?? {})) {
      const areaId = overviewEntityAreaId(this.hass, entity.entity_id);
      if (!areaId) continue;
      const entries = result.get(areaId) ?? [];
      entries.push(entity);
      result.set(areaId, entries);
    }
    return result;
  }

  private entitiesForEditor(
    areaId: string,
    discovered: Map<string, import("./types").OverviewEntity>,
    resolved: ResolvedOverviewConfig,
  ): import("./types").OverviewEntity[] {
    const result = [...discovered.values()];
    for (const entity of Object.values(this.hass?.states ?? {})) {
      if (overviewEntityAreaId(this.hass, entity.entity_id) !== areaId || discovered.has(entity.entity_id)) continue;
      const registry = this.hass?.entities?.[entity.entity_id];
      if (registry?.hidden || registry?.hidden_by || registry?.disabled_by || registry?.entity_category === "config" || registry?.entity_category === "diagnostic") continue;
      const override = resolved.entity_overrides[entity.entity_id];
      if (!override?.section) continue;
      const domain = entity.entity_id.split(".")[0] ?? "";
      result.push({
        entity,
        entityId: entity.entity_id,
        domain,
        name: override.name ?? this.entityName(entity),
        icon: override.icon ?? String(entity.attributes.icon ?? "mdi:circle-outline"),
        areaId,
        section: override.section,
        labels: [],
        available: !["unavailable", "unknown"].includes(entity.state),
        active: !["off", "closed", "idle", "standby", "unavailable", "unknown"].includes(entity.state),
        powered: isOverviewEntityPowered(entity, domain),
        protected: override.protected === true,
        ignoreActivity: override.ignore_activity === true,
        group: override.group,
      });
    }
    return result;
  }

  private unclassifiedCandidates(
    areaId: string,
    discovered: Map<string, import("./types").OverviewEntity>,
  ): HassEntity[] {
    const supported = new Set(["input_boolean", "water_heater"]);
    return Object.values(this.hass?.states ?? {}).filter((entity) => {
      if (overviewEntityAreaId(this.hass, entity.entity_id) !== areaId || discovered.has(entity.entity_id)) return false;
      if (this.config.entity_overrides?.[entity.entity_id]?.section) return false;
      const registry = this.hass?.entities?.[entity.entity_id];
      if (registry?.hidden || registry?.hidden_by || registry?.disabled_by || registry?.entity_category) return false;
      return supported.has(entity.entity_id.split(".")[0] ?? "");
    });
  }

  private addCandidateEntity(): void {
    if (!this.candidateEntityId) return;
    this.updateEntityOverride(this.candidateEntityId, { section: this.candidateSection });
    this.candidateEntityId = "";
  }

  private entityName(entity: HassEntity): string {
    return this.hass?.formatEntityName?.(entity) ?? String(entity.attributes.friendly_name ?? entity.entity_id);
  }

  private setTarget(value: string): void {
    const next = { ...this.config };
    if (this.targetMode === "area") {
      next.area = value || undefined;
      delete next.floor;
      this.activeAreaId = value;
    } else {
      next.floor = value || undefined;
      delete next.area;
      this.activeAreaId = "";
    }
    this.commit(next);
  }

  private setSectionTitle(section: OverviewSectionId, value: string): void {
    this.commit({ ...this.config, section_titles: { ...(this.config.section_titles ?? {}), [section]: value || undefined } });
  }

  private moveSection(section: OverviewSectionId, direction: -1 | 1): void {
    const order = [...resolveOverviewConfig(this.config).section_order];
    this.moveValue(order, section, direction);
    this.commitKey("section_order", order);
  }

  private toggleQuickAction(action: OverviewQuickActionId, enabled: boolean): void {
    const current = [...resolveOverviewConfig(this.config).quick_actions];
    const next = enabled ? [...current.filter((item) => item !== action), action] : current.filter((item) => item !== action);
    this.commitKey("quick_actions", next);
  }

  private moveQuickAction(action: OverviewQuickActionId, direction: -1 | 1): void {
    const order = [...resolveOverviewConfig(this.config).quick_actions];
    this.moveValue(order, action, direction);
    this.commitKey("quick_actions", order);
  }

  private setQuickActionIcon(action: OverviewQuickActionId, value: string): void {
    const configured = this.config.quick_action_icons;
    const icons = configured && typeof configured === "object" && !Array.isArray(configured) ? { ...configured } : {};
    const normalized = value.trim();
    if (normalized) icons[action] = normalized;
    else delete icons[action];
    this.commit({ ...this.config, quick_action_icons: icons });
  }

  private setSectionActionIcon(key: "on" | "off" | "open" | "close", value: string): void {
    const icons = { ...(this.config.section_action_icons ?? {}) };
    const normalized = value.trim();
    if (normalized) icons[key] = normalized;
    else delete icons[key];
    this.commit({ ...this.config, section_action_icons: icons });
  }

  private cleanSectionStyle(style: OverviewSectionStyle): OverviewSectionStyle {
    return Object.fromEntries(Object.entries(style).filter(([, value]) => value !== undefined && value !== "")) as OverviewSectionStyle;
  }

  private setGlobalSectionStyle(section: OverviewSectionId, patch: Partial<OverviewSectionStyle>): void {
    const sectionStyles = { ...(this.config.section_styles ?? {}) };
    const next = this.cleanSectionStyle({ ...(sectionStyles[section] ?? {}), ...patch });
    if (Object.keys(next).length) sectionStyles[section] = next;
    else delete sectionStyles[section];
    this.commit({ ...this.config, section_styles: sectionStyles });
  }

  private normalizedParentId(areaId: string, resolved: ResolvedOverviewConfig): string | undefined {
    const options = this.targetAreas(resolved);
    const area = options.find((candidate) => candidate.id === areaId);
    const override = resolved.area_overrides[areaId] ?? resolved.area_overrides[area?.name ?? ""];
    const raw = override?.parent_area;
    if (!raw) return undefined;
    return options.find((candidate) => candidate.id === raw || candidate.name === raw)?.id;
  }

  private wouldCreateAreaCycle(areaId: string, parentId: string, resolved: ResolvedOverviewConfig): boolean {
    const seen = new Set<string>();
    let current: string | undefined = parentId;
    while (current && !seen.has(current)) {
      if (current === areaId) return true;
      seen.add(current);
      current = this.normalizedParentId(current, resolved);
    }
    return false;
  }

  private moveArea(areaId: string, direction: -1 | 1, resolved: ResolvedOverviewConfig): void {
    const areas = this.targetAreas(resolved);
    const parentId = this.normalizedParentId(areaId, resolved);
    const siblings = areas.filter((area) => this.normalizedParentId(area.id, resolved) === parentId).map((area) => area.id);
    const index = siblings.indexOf(areaId);
    const swapId = siblings[index + direction];
    if (index < 0 || !swapId) return;
    const order = areas.map((area) => area.id);
    const areaIndex = order.indexOf(areaId);
    const swapIndex = order.indexOf(swapId);
    [order[areaIndex], order[swapIndex]] = [order[swapIndex], order[areaIndex]];
    this.commitKey("area_order", order);
  }

  private updateAreaOverride(areaId: string, patch: Partial<OverviewAreaOverride>): void {
    const areaOverrides = { ...(this.config.area_overrides ?? {}) };
    const areaName = this.areaOptions().find((area) => area.id === areaId)?.name;
    const current = this.currentAreaOverride(areaId);
    if (areaName && areaName !== areaId) delete areaOverrides[areaName];
    areaOverrides[areaId] = { ...current, ...patch };
    this.commit({ ...this.config, area_overrides: areaOverrides });
  }

  private toggleAreaList(areaId: string, key: "occupancy_entities" | "exclude_entities", value: string, enabled: boolean): void {
    const current = this.currentAreaOverride(areaId);
    const list = [...(current[key] ?? [])].filter((item) => item !== value);
    if (enabled) list.push(value);
    this.updateAreaOverride(areaId, { [key]: list });
  }

  private setAreaSectionTitle(areaId: string, section: OverviewSectionId, value: string): void {
    const current = this.currentAreaOverride(areaId);
    this.updateAreaOverride(areaId, { section_titles: { ...(current.section_titles ?? {}), [section]: value || undefined } });
  }

  private setAreaSectionStyle(areaId: string, section: OverviewSectionId, patch: Partial<OverviewSectionStyle>): void {
    const current = this.currentAreaOverride(areaId);
    const sectionStyles = { ...(current.section_styles ?? {}) };
    const next = this.cleanSectionStyle({ ...(sectionStyles[section] ?? {}), ...patch });
    if (Object.keys(next).length) sectionStyles[section] = next;
    else delete sectionStyles[section];
    this.updateAreaOverride(areaId, { section_styles: sectionStyles });
  }

  private updateEntityOverride(entityId: string, patch: Partial<OverviewEntityOverride>): void {
    const current = this.config.entity_overrides?.[entityId] ?? {};
    this.commit({ ...this.config, entity_overrides: { ...(this.config.entity_overrides ?? {}), [entityId]: { ...current, ...patch } } });
  }

  private configForEntityEditor(resolved: ResolvedOverviewConfig, areaId: string): ResolvedOverviewConfig {
    if (!areaId) return resolved;
    const current = resolved.area_overrides[areaId] ?? resolved.area_overrides[this.areaOptions().find((area) => area.id === areaId)?.name ?? ""] ?? {};
    return {
      ...resolved,
      exclude_entities: [],
      area_overrides: {
        ...resolved.area_overrides,
        [areaId]: { ...current, hidden: false, exclude_entities: [] },
      },
      entity_overrides: Object.fromEntries(
        Object.entries(resolved.entity_overrides).map(([entityId, override]) => [entityId, { ...override, hidden: false }]),
      ),
    };
  }

  private isEntityExcluded(areaId: string, entityId: string, resolved: ResolvedOverviewConfig): boolean {
    const current = resolved.area_overrides[areaId] ?? resolved.area_overrides[this.areaOptions().find((area) => area.id === areaId)?.name ?? ""] ?? {};
    return resolved.exclude_entities.includes(entityId) || Boolean(current.exclude_entities?.includes(entityId)) || resolved.entity_overrides[entityId]?.hidden === true;
  }

  private isEntityGloballyExcluded(entityId: string, resolved: ResolvedOverviewConfig): boolean {
    return resolved.exclude_entities.includes(entityId) || resolved.entity_overrides[entityId]?.hidden === true;
  }

  private setEntityVisible(areaId: string, entityId: string, visible: boolean): void {
    const areaOverrides = { ...(this.config.area_overrides ?? {}) };
    const areaName = this.areaOptions().find((area) => area.id === areaId)?.name;
    const current = this.currentAreaOverride(areaId);
    const localExcluded = [...(current.exclude_entities ?? [])].filter((item) => item !== entityId);
    if (!visible) localExcluded.push(entityId);
    const nextArea: OverviewAreaOverride = { ...current, exclude_entities: localExcluded };
    if (areaName && areaName !== areaId) delete areaOverrides[areaName];
    areaOverrides[areaId] = nextArea;
    this.commit({ ...this.config, area_overrides: areaOverrides });
  }

  private moveEntity(areaId: string, section: OverviewSectionId, entityId: string, direction: -1 | 1, fallback: string[]): void {
    const current = this.currentAreaOverride(areaId);
    const stored = current.entity_order?.[section] ?? [];
    const order = [...stored, ...fallback.filter((item) => !stored.includes(item))];
    this.moveValue(order, entityId, direction);
    this.updateAreaOverride(areaId, { entity_order: { ...(current.entity_order ?? {}), [section]: order } });
  }

  private currentAreaOverride(areaId: string): OverviewAreaOverride {
    const areaName = this.areaOptions().find((area) => area.id === areaId)?.name;
    const named = areaName && areaName !== areaId ? this.config.area_overrides?.[areaName] : undefined;
    return { ...(named ?? {}), ...(this.config.area_overrides?.[areaId] ?? {}) };
  }

  private setStyle(key: keyof OverviewStyleConfig, value: unknown): void {
    const style = { ...(this.config.style ?? {}) } as Record<string, unknown>;
    if (value === undefined || value === "") delete style[key];
    else style[key] = value;
    this.commit({ ...this.config, style: style as OverviewStyleConfig });
  }

  private applyThemePreset(preset: OverviewThemePreset): void {
    const style = { ...(this.config.style ?? {}) } as Record<string, unknown>;
    const themeKeys = new Set(
      Object.values(OVERVIEW_THEME_PRESETS).flatMap((theme) => Object.keys(theme)),
    );
    for (const key of themeKeys) delete style[key];
    this.commit({
      ...this.config,
      theme_preset: preset,
      style: (Object.keys(style).length ? style : undefined) as OverviewStyleConfig | undefined,
    });
  }

  private commitKey(key: keyof AreaBubbleOverviewCardConfig, value: unknown): void {
    const next = { ...this.config } as Record<string, unknown>;
    if (value === "" || value === undefined) delete next[key];
    else next[key] = value;
    this.commit(next as AreaBubbleOverviewCardConfig);
  }

  private commit(config: AreaBubbleOverviewCardConfig): void {
    this.config = { ...config, type: OVERVIEW_CARD_TYPE };
    this.dispatchEvent(new CustomEvent("config-changed", { bubbles: true, composed: true, detail: { config: this.config } }));
  }

  private moveValue<T>(list: T[], value: T, direction: -1 | 1): void {
    const index = list.indexOf(value);
    const next = index + direction;
    if (index < 0 || next < 0 || next >= list.length) return;
    [list[index], list[next]] = [list[next], list[index]];
  }

  private splitList(value: string): string[] {
    return value.split(/[\n,]/).map((item) => item.trim()).filter(Boolean);
  }

  private parseRtl(value: string): "auto" | boolean {
    return value === "true" ? true : value === "false" ? false : "auto";
  }

  private areaIdFor(area: string | undefined): string {
    if (!area) return "";
    return this.areaOptions().find((option) => option.id === area || option.name === area)?.id ?? area;
  }

  private floorIdFor(floor: string | undefined): string {
    if (!floor) return "";
    return this.floorOptions().find((option) => option.id === floor || option.name === floor)?.id ?? floor;
  }

  private l(he: string, en: string, language: "he" | "en"): string {
    return language === "he" ? he : en;
  }

  private sectionDefaultName(section: OverviewSectionId, language: "he" | "en"): string {
    const names: Record<"he" | "en", Record<OverviewSectionId, string>> = {
      he: { climate: "מיזוג אוויר", floor_heating: "חימום רצפתי", covers: "תריסים", lights_switches: "מפסקים ותאורה", media: "מוזיקה" },
      en: { climate: "Climate", floor_heating: "Floor heating", covers: "Covers", lights_switches: "Lights and switches", media: "Music" },
    };
    return names[language][section];
  }

  private quickName(action: OverviewQuickActionId, language: "he" | "en"): string {
    const names: Record<"he" | "en", Record<OverviewQuickActionId, string>> = {
      he: { lights: "תאורה", climate: "מיזוג", floor_heating: "חימום רצפתי", switches: "מפסקים", covers: "תריסים", media: "מוזיקה" },
      en: { lights: "Lights", climate: "Climate", floor_heating: "Floor heating", switches: "Switches", covers: "Covers", media: "Music" },
    };
    return names[language][action];
  }

  private sectionActionIconName(key: "on" | "off" | "open" | "close", language: "he" | "en"): string {
    const names = {
      he: { on: "אייקון הדלקה", off: "אייקון כיבוי", open: "אייקון פתיחת תריסים", close: "אייקון סגירת תריסים" },
      en: { on: "Turn-on icon", off: "Turn-off icon", open: "Open-covers icon", close: "Close-covers icon" },
    } as const;
    return names[language][key];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "area-bubble-overview-card-editor": AreaBubbleOverviewCardEditor;
  }
}
