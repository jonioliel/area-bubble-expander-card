import { LitElement, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { HassAreaRegistryEntry, HassEntity, HomeAssistant } from "../types";
import { resolveOverviewConfig } from "./config";
import { OVERVIEW_CARD_TYPE, OVERVIEW_DEFAULT_STYLE, OVERVIEW_EDITOR_TAG, OVERVIEW_QUICK_ACTIONS, OVERVIEW_SECTIONS, QUICK_ACTION_ICONS, SECTION_ICONS } from "./constants";
import { discoverOverview, isOverviewEntityPowered, overviewEntityAreaId } from "./discovery";
import { overviewLanguage } from "./translations";
import type {
  AreaBubbleOverviewCardConfig,
  OverviewAreaOverride,
  OverviewEntityOverride,
  OverviewQuickActionId,
  OverviewSectionId,
  OverviewStyleConfig,
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
    .area-card.hidden { opacity: .62; }
    .area-line { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; align-items: center; gap: 9px; }
    .area-actions { display: flex; align-items: center; gap: 4px; }
    .entity-toolbar { position: sticky; top: 0; z-index: 2; display: grid; grid-template-columns: 1fr 1fr; gap: 8px; padding-block: 4px; background: var(--card-background-color); }
    .entity-list { display: grid; gap: 8px; max-height: 560px; overflow: auto; padding-inline-end: 2px; }
    .entity-item { display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 9px; padding: 10px; border: 1px solid var(--divider-color); border-radius: 12px; background: var(--secondary-background-color); }
    .entity-item.active { border-color: color-mix(in srgb, var(--primary-color) 45%, var(--divider-color)); }
    .entity-item.excluded { border-style: dashed; opacity: .68; }
    .entity-item.excluded .order-icon { color: var(--secondary-text-color); background: color-mix(in srgb, var(--secondary-text-color) 10%, transparent); }
    .entity-fields { grid-column: 1 / -1; display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    .entity-flags { grid-column: 1 / -1; display: flex; flex-wrap: wrap; gap: 12px; }
    .check-label { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; }
    .empty { padding: 18px; color: var(--secondary-text-color); text-align: center; }
    .status { display: inline-flex; align-items: center; gap: 5px; min-height: 24px; padding: 0 8px; border-radius: 999px; background: color-mix(in srgb, var(--success-color, #4caf50) 14%, transparent); color: var(--success-color, #4caf50); font-size: 11px; font-weight: 700; }
    @media (max-width: 560px) {
      .inline-fields, .entity-toolbar, .entity-fields, .state-preview { grid-template-columns: 1fr; }
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
    this.config = { ...config, type: OVERVIEW_CARD_TYPE };
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
      ["show_quick_actions", this.l("הצג פעולות מהירות", "Show quick actions", language), this.l("כיבוי ישירות מהכרטיס הסגור", "Turn devices off without opening the area", language), resolved.show_quick_actions],
      ["default_expanded", this.l("פתוח כברירת מחדל", "Expanded by default", language), "", resolved.default_expanded],
      ["floor_default_expanded", this.l("פתח קומה כברירת מחדל", "Floor expanded by default", language), this.l("חל רק כאשר היעד הוא קומה", "Used only when the target is a floor", language), resolved.floor_default_expanded],
      ["remember_expanded_state", this.l("זכור מצב פתיחה", "Remember expansion", language), this.l("שומר בנפרד את מצב הקומה ואת מצב כל אזור", "Remembers the floor and each area separately", language), resolved.remember_expanded_state],
      ["show_empty_sections", this.l("הצג סעיפים ריקים", "Show empty sections", language), "", resolved.show_empty_sections],
    ];
    return html`
      <details>
        ${this.summary("mdi:view-dashboard-outline", this.l("תצוגה וסיכום", "Display and summary", language), this.l("טמפרטורה, נוכחות והרחבה", "Temperature, occupancy, and expansion", language))}
        <div class="panel"><div class="settings-list">${rows.map(([key, title, description, value]) => this.booleanRow(title, description, value, (checked) => this.commitKey(key, checked)))}</div></div>
      </details>
    `;
  }

  private renderSections(resolved: ResolvedOverviewConfig, language: "he" | "en") {
    return html`
      <details>
        ${this.summary("mdi:format-list-bulleted-square", this.l("סעיפים ופעולות", "Sections and actions", language), this.l("עריכת כותרות, סדר וכפתורי הכיבוי", "Edit titles, order, and quick controls", language))}
        <div class="panel">
          <div class="hint">${this.l("ישויות חדשות מצטרפות אוטומטית בסוף הסעיף, כך שהסידור הידני נשאר יציב.", "New entities are appended automatically, so your manual order remains stable.", language)}</div>
          <div class="order-list">
            ${resolved.section_order.map((section, index) => html`
              <div class="order-item">
                <span class="order-icon"><ha-icon icon=${SECTION_ICONS[section]}></ha-icon></span>
                <div class="order-main field">
                  <label>${this.sectionDefaultName(section, language)}</label>
                  <input type="text" .value=${resolved.section_titles[section]} placeholder=${this.sectionDefaultName(section, language)} @change=${(event: Event) => this.setSectionTitle(section, (event.target as HTMLInputElement).value)} />
                </div>
                ${this.orderButtons(index, resolved.section_order.length, () => this.moveSection(section, -1), () => this.moveSection(section, 1))}
              </div>
            `)}
          </div>
          <div class="setting-title">${this.l("פעולות מהירות", "Quick actions", language)}</div>
          <div class="order-list">
            ${[...resolved.quick_actions, ...OVERVIEW_QUICK_ACTIONS.filter((action) => !resolved.quick_actions.includes(action))].map((action) => {
              const enabled = resolved.quick_actions.includes(action);
              const index = resolved.quick_actions.indexOf(action);
              return html`
                <div class="order-item">
                  <span class="order-icon"><ha-icon icon=${QUICK_ACTION_ICONS[action]}></ha-icon></span>
                  <div class="order-main"><div class="order-title">${this.quickName(action, language)}</div></div>
                  <div class="area-actions">
                    ${enabled ? this.orderButtons(index, resolved.quick_actions.length, () => this.moveQuickAction(action, -1), () => this.moveQuickAction(action, 1)) : nothing}
                    ${this.switchControl(enabled, (checked) => this.toggleQuickAction(action, checked), this.quickName(action, language))}
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
            ? html`<div class="order-list">${areas.map((area, index) => this.renderAreaEditor(area, index, areas.length, resolved, entitiesByArea.get(area.id) ?? [], language))}</div>`
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
    return html`
      <div class="area-card ${override.hidden ? "hidden" : ""}">
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
          <div class="hint">${this.l("שינוי סעיף הוא הדרך המומלצת לזהות חימום רצפתי או לתקן גילוי אוטומטי.", "Change a section to identify floor heating or correct automatic discovery.", language)}</div>
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
                   return html`
                    <div class="entity-item ${!excluded && item.active ? "active" : ""} ${excluded ? "excluded" : ""}">
                      <span class="order-icon"><ha-icon icon=${override.icon ?? item.icon}></ha-icon></span>
                      <div class="order-main"><div class="order-title">${override.name || item.name}</div><div class="meta">${item.entityId}${excluded ? ` · ${this.l("מוסר מהאזור", "removed from area", language)}` : ""}</div></div>
                      <div class="entity-fields">
                        <div class="field"><label>${this.l("שם מותאם", "Custom name", language)}</label><input type="text" .value=${override.name ?? ""} placeholder=${item.name} @change=${(event: Event) => this.updateEntityOverride(item.entityId, { name: (event.target as HTMLInputElement).value || undefined })} /></div>
                        <div class="field"><label>${this.l("סעיף", "Section", language)}</label><select .value=${override.section ?? item.section} @change=${(event: Event) => this.updateEntityOverride(item.entityId, { section: (event.target as HTMLSelectElement).value as OverviewSectionId })}>${OVERVIEW_SECTIONS.map((section) => html`<option value=${section}>${this.sectionDefaultName(section, language)}</option>`)}</select></div>
                        ${this.iconField(this.l("אייקון הרכיב", "Device icon", language), override.icon ?? "", item.icon, language, (value) => this.updateEntityOverride(item.entityId, { icon: value || undefined }))}
                      </div>
                      <div class="entity-flags">
                        <label class="check-label"><input type="checkbox" .checked=${!excluded} @change=${(event: Event) => this.setEntityVisible(areaId, item.entityId, (event.target as HTMLInputElement).checked)} />${this.l("הצג וספור במצב האזור", "Show and include in area state", language)}</label>
                        <label class="check-label"><input type="checkbox" .checked=${override.protected ?? item.protected} @change=${(event: Event) => this.updateEntityOverride(item.entityId, { protected: (event.target as HTMLInputElement).checked })} />${this.l("מוגן מכיבוי קבוצתי", "Protect from group off", language)}</label>
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
          <div class="inline-fields">
            ${this.numberField(this.l("עיגול פינות", "Corner radius", language), resolved.style.border_radius, 4, 40, (value) => this.setStyle("border_radius", value))}
            ${this.numberField(this.l("טשטוש זכוכית", "Glass blur", language), resolved.style.blur, 0, 40, (value) => this.setStyle("blur", value))}
            ${this.numberField(this.l("גובה שורה", "Row height", language), resolved.style.row_height, 44, 84, (value) => this.setStyle("row_height", value))}
            ${this.numberField(this.l("מרווח סעיפים", "Section gap", language), resolved.style.section_gap, 4, 30, (value) => this.setStyle("section_gap", value))}
          </div>
          <div class="setting-title">${this.l("צבעי מצב", "State colors", language)}</div>
          <div class="state-preview">
            <div class="state-preview-item off" style=${`--preview-surface: ${resolved.style.row_background}`}>${this.l("כבוי", "OFF", language)}</div>
            <div class="state-preview-item on" style=${`--preview-surface: ${resolved.style.active_surface}`}>${this.l("דלוק", "ON", language)}</div>
          </div>
          <div class="inline-fields">
            ${this.colorField(this.l("רקע כבוי", "OFF surface", language), "row_background", resolved.style.row_background, "#4a4a4a", language)}
            ${this.colorField(this.l("רקע דלוק", "ON surface", language), "active_surface", resolved.style.active_surface, "#aed7db", language)}
            ${this.colorField(this.l("צבע תג פעיל", "Active count badge", language), "active_color", resolved.style.active_color, "#ffd54f", language)}
            ${this.colorField(this.l("צבע הדגשה", "Accent color", language), "accent_color", resolved.style.accent_color, "#03a9f4", language)}
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
        <input type="text" dir="ltr" .value=${value} placeholder=${automaticIcon} @change=${(event: Event) => onChange((event.target as HTMLInputElement).value.trim())} />
        <div class="hint">${this.l("אפשר לבחור מהרשימה או להזין אייקון MDI ידנית.", "Choose from the picker or enter an MDI icon manually.", language)}</div>
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

  private moveArea(areaId: string, direction: -1 | 1, resolved: ResolvedOverviewConfig): void {
    const order = this.targetAreas(resolved).map((area) => area.id);
    this.moveValue(order, areaId, direction);
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

  private setEntityVisible(areaId: string, entityId: string, visible: boolean): void {
    const areaOverrides = { ...(this.config.area_overrides ?? {}) };
    const areaName = this.areaOptions().find((area) => area.id === areaId)?.name;
    const current = this.currentAreaOverride(areaId);
    const localExcluded = [...(current.exclude_entities ?? [])].filter((item) => item !== entityId);
    if (!visible) localExcluded.push(entityId);
    const nextArea: OverviewAreaOverride = { ...current, exclude_entities: localExcluded };
    if (!visible) {
      if (nextArea.temperature_entity === entityId) delete nextArea.temperature_entity;
      if (nextArea.occupancy_count_entity === entityId) delete nextArea.occupancy_count_entity;
      if (nextArea.occupancy_entities?.includes(entityId)) {
        nextArea.occupancy_entities = nextArea.occupancy_entities.filter((item) => item !== entityId);
      }
    }
    if (areaName && areaName !== areaId) delete areaOverrides[areaName];
    areaOverrides[areaId] = nextArea;

    const entityOverrides = { ...(this.config.entity_overrides ?? {}) };
    if (visible && entityOverrides[entityId]?.hidden === true) {
      entityOverrides[entityId] = { ...entityOverrides[entityId], hidden: false };
    }
    this.commit({
      ...this.config,
      area_overrides: areaOverrides,
      entity_overrides: entityOverrides,
      exclude_entities: visible ? (this.config.exclude_entities ?? []).filter((item) => item !== entityId) : this.config.exclude_entities,
    });
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
}

declare global {
  interface HTMLElementTagNameMap {
    "area-bubble-overview-card-editor": AreaBubbleOverviewCardEditor;
  }
}
