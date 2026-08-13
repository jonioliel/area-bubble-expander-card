import { LitElement, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { HassAreaRegistryEntry, HassEntity, HomeAssistant } from "../types";
import { resolveOverviewConfig } from "./config";
import { OVERVIEW_CARD_TYPE, OVERVIEW_EDITOR_TAG, OVERVIEW_QUICK_ACTIONS, OVERVIEW_SECTIONS, QUICK_ACTION_ICONS, SECTION_ICONS } from "./constants";
import { discoverOverview, overviewEntityAreaId } from "./discovery";
import { overviewLanguage } from "./translations";
import type {
  AreaBubbleOverviewCardConfig,
  OverviewAreaOverride,
  OverviewEntityOverride,
  OverviewQuickActionId,
  OverviewSectionId,
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
    .entity-fields { grid-column: 1 / -1; display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    .entity-flags { grid-column: 1 / -1; display: flex; flex-wrap: wrap; gap: 12px; }
    .check-label { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; }
    .empty { padding: 18px; color: var(--secondary-text-color); text-align: center; }
    .status { display: inline-flex; align-items: center; gap: 5px; min-height: 24px; padding: 0 8px; border-radius: 999px; background: color-mix(in srgb, var(--success-color, #4caf50) 14%, transparent); color: var(--success-color, #4caf50); font-size: 11px; font-weight: 700; }
    @media (max-width: 560px) {
      .inline-fields, .entity-toolbar, .entity-fields { grid-template-columns: 1fr; }
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
      ["remember_expanded_state", this.l("זכור מצב פתיחה", "Remember expansion", language), "", resolved.remember_expanded_state],
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
    const occupancyOptions = areaEntities.filter((item) => item.entity_id.startsWith("binary_sensor."));
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
                <div class="field"><label>${this.l("אייקון", "Icon", language)}</label><input type="text" .value=${override.icon ?? ""} placeholder=${area.icon} @change=${(event: Event) => this.updateAreaOverride(area.id, { icon: (event.target as HTMLInputElement).value || undefined })} /></div>
              </div>
              <div class="field">
                <label>${this.l("מקור טמפרטורה מועדף", "Preferred temperature source", language)}</label>
                <select .value=${override.temperature_entity ?? ""} @change=${(event: Event) => this.updateAreaOverride(area.id, { temperature_entity: (event.target as HTMLSelectElement).value || undefined })}>
                  <option value="">${this.l("אוטומטי", "Automatic", language)}</option>
                  ${temperatureOptions.map((entity) => html`<option value=${entity.entity_id}>${this.entityName(entity)}</option>`)}
                </select>
              </div>
              ${occupancyOptions.length
                ? html`<div class="field"><label>${this.l("חיישני נוכחות (ריק = אוטומטי)", "Occupancy sensors (empty = automatic)", language)}</label><div class="entity-flags">${occupancyOptions.map((entity) => {
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
    const discovered = new Map((area?.allEntities ?? []).map((item) => [item.entityId, item]));
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
                  return html`
                    <div class="entity-item ${item.active ? "active" : ""}">
                      <span class="order-icon"><ha-icon icon=${override.icon ?? item.icon}></ha-icon></span>
                      <div class="order-main"><div class="order-title">${override.name || item.name}</div><div class="meta">${item.entityId}</div></div>
                      <div class="entity-fields">
                        <div class="field"><label>${this.l("שם מותאם", "Custom name", language)}</label><input type="text" .value=${override.name ?? ""} placeholder=${item.name} @change=${(event: Event) => this.updateEntityOverride(item.entityId, { name: (event.target as HTMLInputElement).value || undefined })} /></div>
                        <div class="field"><label>${this.l("סעיף", "Section", language)}</label><select .value=${override.section ?? item.section} @change=${(event: Event) => this.updateEntityOverride(item.entityId, { section: (event.target as HTMLSelectElement).value as OverviewSectionId })}>${OVERVIEW_SECTIONS.map((section) => html`<option value=${section}>${this.sectionDefaultName(section, language)}</option>`)}</select></div>
                      </div>
                      <div class="entity-flags">
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
            <div class="field"><label>${this.l("צבע הדגשה", "Accent color", language)}</label><input type="text" .value=${resolved.style.accent_color} @change=${(event: Event) => this.setStyle("accent_color", (event.target as HTMLInputElement).value)} /></div>
            <div class="field"><label>${this.l("צבע פעיל", "Active color", language)}</label><input type="text" .value=${resolved.style.active_color} @change=${(event: Event) => this.setStyle("active_color", (event.target as HTMLInputElement).value)} /></div>
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

  private areaOptions(): AreaOption[] {
    return Object.entries(this.hass?.areas ?? {})
      .map(([key, area]) => ({ id: area.area_id ?? area.id ?? key, name: area.name, icon: area.icon ?? "mdi:floor-plan", floorId: area.floor_id ?? undefined }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  private floorOptions(): Array<{ id: string; name: string }> {
    return Object.entries(this.hass?.floors ?? {})
      .map(([key, floor]) => ({ id: floor.floor_id ?? floor.id ?? key, name: floor.name, level: floor.level ?? Number.MAX_SAFE_INTEGER }))
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

  private setStyle(key: string, value: unknown): void {
    this.commit({ ...this.config, style: { ...(this.config.style ?? {}), [key]: value } });
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
