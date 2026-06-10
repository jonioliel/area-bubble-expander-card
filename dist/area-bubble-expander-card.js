const CARD_TYPE = "custom:area-bubble-expander-card";
const CARD_TAG = "area-bubble-expander-card";
const EDITOR_TAG = "area-bubble-expander-card-editor";
const DEFAULT_DOMAINS = ["light", "switch", "fan", "climate", "media_player"];
const DEFAULT_EXCLUDED_DOMAINS = ["sensor", "automation", "script", "scene", "input_number", "input_select", "button", "update", "device_tracker", "person", "camera", "alarm_control_panel"];
const DEFAULT_ACTIVE_STATES = {
  light: ["on"],
  switch: ["on"],
  fan: ["on"],
  media_player: ["playing", "buffering", "paused"],
  cover: ["open", "opening"],
  lock: ["unlocked"],
  binary_sensor: ["on"],
  input_boolean: ["on"],
};
const DEFAULT_INACTIVE_STATES = { climate: ["off", "unavailable", "unknown"] };
const DEFAULT_DOMAIN_ICONS = {
  light: "mdi:lightbulb",
  switch: "mdi:toggle-switch",
  fan: "mdi:fan",
  climate: "mdi:air-conditioner",
  media_player: "mdi:play-circle",
  cover: "mdi:window-shutter",
  lock: "mdi:lock-open",
  binary_sensor: "mdi:motion-sensor",
  input_boolean: "mdi:toggle-switch-outline",
};
const DEFAULT_SERVICE_MAPPING = {
  light: "light.turn_off",
  switch: "switch.turn_off",
  fan: "fan.turn_off",
  climate: "climate.turn_off",
  media_player: "media_player.turn_off",
  cover: "cover.close_cover",
  lock: "lock.lock",
  input_boolean: "input_boolean.turn_off",
};
const TRANSLATIONS = {
  he: {
    title: "מה דלוק בבית",
    empty_title: "הכל כבוי",
    empty_subtitle: "אין מכשירים דלוקים כרגע",
    turn_off_area: "כבה אזור",
    turn_off_entity: "כבה",
    turn_off_all: "כבה הכל",
    active_entities: "דלוקים",
    active_areas: "אזורים פעילים",
    no_area: "ללא אזור",
    confirm_area_turn_off: "לכבות {count} מכשירים דלוקים באזור {area}?",
    confirm_entity_turn_off: "לכבות את {entity}?",
    confirm_global_turn_off: "לכבות את כל המכשירים הדלוקים?",
    protected: "מוגן",
    protected_will_remain: "ישויות מוגנות לא יכבו.",
    not_available: "לא זמין",
    show_more: "הצג עוד",
  },
  en: {
    title: "What's on at home",
    empty_title: "Everything is off",
    empty_subtitle: "No active devices right now",
    turn_off_area: "Turn off area",
    turn_off_entity: "Turn off",
    turn_off_all: "Turn off all",
    active_entities: "active",
    active_areas: "active areas",
    no_area: "No Area",
    confirm_area_turn_off: "Turn off {count} active devices in {area}?",
    confirm_entity_turn_off: "Turn off {entity}?",
    confirm_global_turn_off: "Turn off all active devices?",
    protected: "Protected",
    protected_will_remain: "Protected entities will not be turned off.",
    not_available: "Not available",
    show_more: "Show more",
  },
};
const DOMAIN_LABELS = {
  he: { light: "תאורה", switch: "מתגים", fan: "מאווררים", climate: "מיזוג", media_player: "מדיה", cover: "תריסים", lock: "מנעולים", binary_sensor: "חיישנים", input_boolean: "בוליאנים" },
  en: { light: "Lights", switch: "Switches", fan: "Fans", climate: "Climate", media_player: "Media", cover: "Covers", lock: "Locks", binary_sensor: "Binary sensors", input_boolean: "Booleans" },
};
const DEFAULT_CONFIG = {
  type: CARD_TYPE,
  language: "auto",
  rtl: "auto",
  show_header: true,
  show_total_count: true,
  show_active_area_count: true,
  show_empty: true,
  default_expanded: false,
  remember_expanded_state: true,
  expand_on_header_tap: true,
  show_area_icons: true,
  show_entity_icons: true,
  show_entity_secondary_info: true,
  show_domain_chips: true,
  domain_chip_mode: "icons",
  show_preview_entities: true,
  preview_entity_count: 3,
  show_area_turn_off: true,
  show_entity_turn_off: true,
  show_global_turn_off: false,
  confirm_area_turn_off: true,
  confirm_entity_turn_off: false,
  confirm_global_turn_off: true,
  area_turn_off_mode: "safe_displayed_entities",
  domains: DEFAULT_DOMAINS,
  exclude_domains: DEFAULT_EXCLUDED_DOMAINS,
  exclude_labels: [],
  exclude_entity_category: ["diagnostic", "config"],
  exclude_hidden_entities: true,
  exclude_unavailable: true,
  active_states: DEFAULT_ACTIVE_STATES,
  inactive_states: DEFAULT_INACTIVE_STATES,
  paused_media_players_active: true,
  protected_labels: ["always_on", "critical", "infrastructure", "no_turn_off"],
  protected_entities: ["switch.router", "switch.server", "switch.nvr", "switch.home_assistant", "switch.main_network", "switch.alarm_bypass", "switch.irrigation_main_valve"],
  protected_entity_behavior: "show_disabled",
  disable_turn_off_for_domains: [],
  dangerous_domains: ["switch", "lock", "cover"],
  safety_mode: "normal",
  service_mapping: DEFAULT_SERVICE_MAPPING,
  tap_action: { action: "more-info" },
  hold_action: { action: "none" },
  double_tap_action: { action: "none" },
  area_sort: "count_desc",
  entity_sort: "domain",
  style: { border_radius: 26, blur: 18, section_gap: 12, row_height: 52, accent_color: "var(--primary-color)", danger_color: "#ff5252", show_shadows: true, shadow_intensity: 0.2 },
  show_last_changed: false,
  show_brightness: true,
  show_temperature: true,
  show_media_title: true,
  max_entities_per_area: 0,
  debug: false,
  show_debug: false,
};
const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[char]);
const domainOf = (entityId) => entityId.split(".")[0] || "";
const languageOf = (hass, config) => {
  if (config.language === "he" || config.language === "en") return config.language;
  const detected = hass?.locale?.language || hass?.language || document.documentElement.lang || "en";
  return detected.toLowerCase().startsWith("he") ? "he" : "en";
};
const isRtl = (hass, config) => {
  if (typeof config.rtl === "boolean") return config.rtl;
  return languageOf(hass, config) === "he" || document.documentElement.dir === "rtl";
};
const tr = (hass, config, key, vars = {}) => {
  const lang = languageOf(hass, config);
  let text = config.labels?.[key] || TRANSLATIONS[lang][key] || TRANSLATIONS.en[key] || key;
  Object.entries(vars).forEach(([name, value]) => {
    text = text.replace(new RegExp(`\\{${name}\\}`, "g"), String(value));
  });
  return text;
};
const domainLabel = (hass, config, domain) => config.domain_labels?.[domain] || DOMAIN_LABELS[languageOf(hass, config)][domain] || domain.replaceAll("_", " ");
const mergeConfig = (config) => ({
  ...DEFAULT_CONFIG,
  ...config,
  domains: [...(config.domains || DEFAULT_CONFIG.domains)],
  exclude_domains: [...(config.exclude_domains || DEFAULT_CONFIG.exclude_domains)],
  exclude_labels: [...(config.exclude_labels || DEFAULT_CONFIG.exclude_labels)],
  exclude_entity_category: [...(config.exclude_entity_category || DEFAULT_CONFIG.exclude_entity_category)],
  exclude_entities: [...(config.exclude_entities || [])],
  include_entities: [...(config.include_entities || [])],
  include_areas: [...(config.include_areas || [])],
  exclude_areas: [...(config.exclude_areas || [])],
  exclude_by_regex: [...(config.exclude_by_regex || [])],
  protected_labels: [...(config.protected_labels || DEFAULT_CONFIG.protected_labels)],
  protected_entities: [...(config.protected_entities || DEFAULT_CONFIG.protected_entities)],
  disable_turn_off_for_domains: [...(config.disable_turn_off_for_domains || [])],
  custom_area_order: [...(config.custom_area_order || [])],
  custom_entity_order: [...(config.custom_entity_order || [])],
  active_states: { ...DEFAULT_ACTIVE_STATES, ...(config.active_states || {}) },
  inactive_states: { ...DEFAULT_INACTIVE_STATES, ...(config.inactive_states || {}) },
  service_mapping: { ...DEFAULT_SERVICE_MAPPING, ...(config.service_mapping || {}) },
  domain_icons: { ...DEFAULT_DOMAIN_ICONS, ...(config.domain_icons || {}) },
  style: { ...DEFAULT_CONFIG.style, ...(config.style || {}) },
  areas: { ...(config.areas || {}) },
  entity_overrides: { ...(config.entity_overrides || {}) },
});
const areaMap = (hass) => {
  const map = new Map();
  Object.entries(hass?.areas || {}).forEach(([key, area]) => map.set(area.area_id || area.id || key, area));
  return map;
};
const resolveArea = (hass, config, entityId) => {
  const entity = hass?.entities?.[entityId];
  const device = entity?.device_id ? hass?.devices?.[entity.device_id] : undefined;
  const id = entity?.area_id || device?.area_id || "no_area";
  const area = areaMap(hass).get(id);
  const override = config.areas?.[id] || config.areas?.[area?.name || ""];
  return { id, name: override?.name || area?.name || tr(hass, config, "no_area"), icon: override?.icon || area?.icon || (id === "no_area" ? "mdi:home-question" : "mdi:floor-plan") };
};
const labelsFor = (hass, entityId) => {
  const entity = hass?.entities?.[entityId];
  const device = entity?.device_id ? hass?.devices?.[entity.device_id] : undefined;
  return [...(entity?.labels || []), ...(device?.labels || [])];
};
const isActive = (stateObj, domain, config) => {
  const state = String(stateObj.state || "").toLowerCase();
  if (["unavailable", "unknown", "none", ""].includes(state)) return false;
  if (domain === "media_player" && !config.paused_media_players_active && state === "paused") return false;
  if ((config.inactive_states[domain] || []).map((x) => x.toLowerCase()).includes(state)) return false;
  const active = (config.active_states[domain] || []).map((x) => x.toLowerCase());
  return active.length ? active.includes(state) : state === "on";
};
const secondary = (entity, domain, config, hass) => {
  if (entity.state === "unavailable") return tr(hass, config, "not_available");
  if (domain === "light" && config.show_brightness && typeof entity.attributes.brightness === "number") return `${Math.round(entity.attributes.brightness / 2.55)}%`;
  if (domain === "fan" && typeof entity.attributes.percentage === "number") return `${entity.attributes.percentage}%`;
  if (domain === "climate") {
    const parts = [entity.attributes.hvac_action || entity.state];
    if (config.show_temperature && typeof entity.attributes.current_temperature === "number") parts.push(`${entity.attributes.current_temperature}°`);
    if (config.show_temperature && typeof entity.attributes.temperature === "number") parts.push(`→ ${entity.attributes.temperature}°`);
    return parts.join(" ");
  }
  if (domain === "media_player" && config.show_media_title) return entity.attributes.media_title || entity.attributes.source || entity.state;
  if (domain === "cover" && typeof entity.attributes.current_position === "number") return `${entity.attributes.current_position}%`;
  return entity.state;
};
const isProtected = (entityId, labels, config) => config.entity_overrides?.[entityId]?.protected || config.protected_entities.includes(entityId) || labels.some((label) => config.protected_labels.includes(label));
const disabledReason = (item, config) => {
  if (config.entity_overrides?.[item.entityId]?.allow_turn_off === false) return "Entity override disabled";
  if (item.protected) return "Protected";
  if (config.disable_turn_off_for_domains.includes(item.domain)) return "Domain disabled";
  if (!config.service_mapping[item.domain]) return "Unsupported service";
  if (config.safety_mode === "strict" && item.domain === "switch") return "Strict safety protects switches";
  return "";
};
const discover = (hass, config) => {
  const grouped = new Map();
  const skipped = [];
  const includedDomains = new Set(config.domains);
  const excludedDomains = new Set(config.exclude_domains);
  const includeEntities = new Set(config.include_entities || []);
  const regexes = (config.exclude_by_regex || []).flatMap((pattern) => {
    try { return [new RegExp(pattern)]; } catch { return []; }
  });
  Object.values(hass?.states || {}).forEach((entity) => {
    const entityId = entity.entity_id;
    const domain = domainOf(entityId);
    const registry = hass?.entities?.[entityId] || {};
    const labels = labelsFor(hass, entityId);
    const area = resolveArea(hass, config, entityId);
    const reasons = [];
    if (config.entity_overrides?.[entityId]?.hidden) reasons.push("hidden override");
    if (config.exclude_entities.includes(entityId)) reasons.push("excluded entity");
    if (config.exclude_unavailable && entity.state === "unavailable") reasons.push("unavailable");
    if (config.exclude_hidden_entities && registry.hidden_by) reasons.push("hidden");
    if (registry.entity_category && config.exclude_entity_category.includes(registry.entity_category)) reasons.push("entity category");
    if (excludedDomains.has(domain)) reasons.push("excluded domain");
    if (!includedDomains.has(domain) && !includeEntities.has(entityId)) reasons.push("domain not included");
    if (labels.some((label) => config.exclude_labels.includes(label))) reasons.push("excluded label");
    if (regexes.some((regex) => regex.test(entityId))) reasons.push("regex");
    if (config.include_areas.length && !config.include_areas.includes(area.id) && !config.include_areas.includes(area.name)) reasons.push("area not included");
    if (config.exclude_areas.includes(area.id) || config.exclude_areas.includes(area.name)) reasons.push("area excluded");
    if (!isActive(entity, domain, config)) reasons.push("inactive");
    if (reasons.length) { skipped.push({ entity_id: entityId, reasons }); return; }
    const protectedEntity = isProtected(entityId, labels, config);
    if (protectedEntity && config.protected_entity_behavior === "hide") { skipped.push({ entity_id: entityId, reasons: ["protected hidden"] }); return; }
    const item = {
      entity,
      entityId,
      domain,
      name: config.entity_overrides?.[entityId]?.name || entity.attributes.friendly_name || entityId,
      icon: config.entity_overrides?.[entityId]?.icon || entity.attributes.icon || config.domain_icons[domain] || "mdi:toggle-switch-outline",
      areaId: area.id,
      areaName: area.name,
      areaIcon: area.icon,
      labels,
      protected: protectedEntity,
      secondary: secondary(entity, domain, config, hass),
    };
    item.disabledReason = disabledReason(item, config);
    item.controllable = !item.disabledReason;
    const group = grouped.get(area.id) || { id: area.id, name: area.name, icon: area.icon, entities: [], domainCounts: {}, protectedCount: 0 };
    group.entities.push(item);
    group.domainCounts[domain] = (group.domainCounts[domain] || 0) + 1;
    if (protectedEntity) group.protectedCount += 1;
    grouped.set(area.id, group);
  });
  const entitySort = (items) => [...items].sort((a, b) => {
    if (config.entity_sort === "name") return String(a.name).localeCompare(String(b.name));
    if (config.entity_sort === "state") return a.entity.state.localeCompare(b.entity.state) || String(a.name).localeCompare(String(b.name));
    if (config.entity_sort === "last_changed") return new Date(b.entity.last_changed) - new Date(a.entity.last_changed);
    if (config.entity_sort === "custom") return (config.custom_entity_order.indexOf(a.entityId) + 1 || 999999) - (config.custom_entity_order.indexOf(b.entityId) + 1 || 999999);
    return a.domain.localeCompare(b.domain) || String(a.name).localeCompare(String(b.name));
  });
  let groups = [...grouped.values()].map((group) => ({ ...group, entities: entitySort(group.entities) }));
  groups = groups.sort((a, b) => {
    if (config.area_sort === "name") return a.name.localeCompare(b.name);
    if (config.area_sort === "count_asc") return a.entities.length - b.entities.length || a.name.localeCompare(b.name);
    if (config.area_sort === "custom") return (config.custom_area_order.indexOf(a.id) + 1 || config.custom_area_order.indexOf(a.name) + 1 || 999999) - (config.custom_area_order.indexOf(b.id) + 1 || config.custom_area_order.indexOf(b.name) + 1 || 999999);
    if (config.area_sort === "original") return 0;
    return b.entities.length - a.entities.length || a.name.localeCompare(b.name);
  });
  return { groups, skipped };
};
const storageKey = (id) => `area-bubble-expander-card:${id}:expanded`;
class AreaBubbleExpanderCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._expanded = {};
    this._id = Math.random().toString(36).slice(2);
  }
  static getConfigElement() { return document.createElement(EDITOR_TAG); }
  static getStubConfig() { return { type: CARD_TYPE, language: "auto", rtl: "auto" }; }
  set hass(value) { this._hass = value; this.render(); }
  get hass() { return this._hass; }
  setConfig(config) {
    if (!config || typeof config !== "object") throw new Error("Invalid Area Bubble Expander Card configuration.");
    this._config = mergeConfig(config);
    this._id = config.title || this._id;
    if (this._config.remember_expanded_state) {
      try { this._expanded = JSON.parse(localStorage.getItem(storageKey(this._id)) || "{}"); } catch { this._expanded = {}; }
    }
    this.render();
  }
  getCardSize() {
    const { groups } = discover(this._hass, this._config || DEFAULT_CONFIG);
    return Math.max(2, groups.reduce((sum, group) => sum + (this.isExpanded(group) ? group.entities.length + 1 : 1), 1));
  }
  styles() {
    const s = this._config?.style || DEFAULT_CONFIG.style;
    return `<style>
      :host{display:block;direction:${isRtl(this._hass, this._config) ? "rtl" : "ltr"};text-align:start;color:var(--primary-text-color)}
      ha-card{overflow:hidden;border-radius:${s.border_radius}px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);box-shadow:${s.show_shadows ? `0 12px 30px rgba(0,0,0,${s.shadow_intensity})` : "none"};backdrop-filter:blur(${s.blur}px)}
      .root{padding:14px}.header{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:4px 4px 12px}.title{font-size:18px;font-weight:700}.sub,.preview,.secondary{color:var(--secondary-text-color);font-size:12px;line-height:1.35}.sections{display:grid;gap:${s.section_gap}px}.area{overflow:hidden;border-radius:${s.border_radius}px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1)}.area.expanded{background:rgba(255,255,255,.075)}
      .area-header{display:grid;grid-template-columns:auto minmax(0,1fr) auto;align-items:center;gap:10px;min-height:66px;padding:10px;cursor:pointer}.icon{display:inline-grid;place-items:center;width:42px;height:42px;border-radius:999px;background:rgba(var(--rgb-primary-color,3,169,244),.16);color:${s.accent_color}}.name{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:650}.line{display:flex;gap:8px;align-items:center;min-width:0}.count{color:var(--secondary-text-color);font-size:12px;font-weight:600}.chips{display:flex;flex-wrap:wrap;gap:6px;margin-top:6px}.chip{display:inline-flex;align-items:center;gap:4px;min-height:22px;padding:0 8px;border-radius:999px;background:rgba(255,255,255,.11);color:var(--secondary-text-color);font-size:11px}.chip ha-icon{--mdc-icon-size:14px}.controls{display:flex;gap:4px}.btn{display:inline-grid;place-items:center;width:40px;height:40px;border:0;border-radius:999px;background:rgba(255,255,255,.08);color:var(--primary-text-color);cursor:pointer}.btn.danger{color:${s.danger_color}}.btn[disabled]{opacity:.45;cursor:not-allowed}.entities{display:grid;gap:8px;padding:0 10px 10px}.entity{display:grid;grid-template-columns:auto minmax(0,1fr) auto;align-items:center;gap:10px;min-height:${s.row_height}px;padding:7px 8px;border-radius:${Math.max(8, s.border_radius - 10)}px;background:rgba(255,255,255,.08);cursor:pointer}.protected{color:var(--warning-color,#f6a623);font-size:11px}.empty{display:grid;place-items:center;gap:8px;min-height:128px;padding:22px;text-align:center}.debug{margin-top:12px;padding:10px;border-radius:14px;background:rgba(0,0,0,.16);direction:ltr;text-align:left;white-space:pre-wrap;color:var(--secondary-text-color);font-size:12px}
      @media(max-width:420px){.root{padding:10px}.area-header{padding:9px}.btn{width:38px;height:38px}}
    </style>`;
  }
  render() {
    if (!this.shadowRoot || !this._config) return;
    const config = this._config;
    const { groups, skipped } = discover(this._hass, config);
    const total = groups.reduce((sum, group) => sum + group.entities.length, 0);
    const header = config.show_header ? `<div class="header"><div class="title">${escapeHtml(config.title || tr(this._hass, config, "title"))}<div class="sub">${config.show_total_count ? `${total} ${tr(this._hass, config, "active_entities")}` : ""}${config.show_total_count && config.show_active_area_count ? " · " : ""}${config.show_active_area_count ? `${groups.length} ${tr(this._hass, config, "active_areas")}` : ""}</div></div>${config.show_global_turn_off ? `<button class="btn danger" data-global title="${escapeHtml(tr(this._hass, config, "turn_off_all"))}"><ha-icon icon="mdi:power"></ha-icon></button>` : ""}</div>` : "";
    const body = groups.length ? `<div class="sections">${groups.map((group) => this.renderGroup(group)).join("")}</div>` : (config.show_empty ? `<div class="empty"><ha-icon icon="mdi:home-check-outline"></ha-icon><div class="title">${escapeHtml(config.empty_title || tr(this._hass, config, "empty_title"))}</div><div class="sub">${escapeHtml(config.empty_subtitle || tr(this._hass, config, "empty_subtitle"))}</div></div>` : "");
    const debug = config.debug || config.show_debug ? `<div class="debug">${escapeHtml(JSON.stringify(skipped.slice(0, 80), null, 2))}</div>` : "";
    this.shadowRoot.innerHTML = `${this.styles()}<ha-card><div class="root">${header}${body}${debug}</div></ha-card>`;
    this.bindEvents(groups);
  }
  renderGroup(group) {
    const config = this._config;
    const expanded = this.isExpanded(group);
    const preview = group.entities.slice(0, config.preview_entity_count).map((item) => item.name).join(" · ");
    const chips = config.show_domain_chips ? `<div class="chips">${Object.entries(group.domainCounts).map(([domain, count]) => `<span class="chip"><ha-icon icon="${escapeHtml(config.domain_icons[domain] || "mdi:circle")}"></ha-icon>${config.domain_chip_mode === "icons" ? count : `${count} ${escapeHtml(domainLabel(this._hass, config, domain))}`}</span>`).join("")}</div>` : "";
    const entities = config.max_entities_per_area > 0 ? group.entities.slice(0, config.max_entities_per_area) : group.entities;
    return `<section class="area ${expanded ? "expanded" : ""}" data-area="${escapeHtml(group.id)}"><div class="area-header" role="button" tabindex="0" data-toggle="${escapeHtml(group.id)}">${config.show_area_icons ? `<span class="icon"><ha-icon icon="${escapeHtml(group.icon)}"></ha-icon></span>` : ""}<span><span class="line"><span class="name">${escapeHtml(group.name)}</span><span class="count">${group.entities.length} ${escapeHtml(tr(this._hass, config, "active_entities"))}</span></span>${config.show_preview_entities && !expanded && preview ? `<div class="preview">${escapeHtml(preview)}</div>` : ""}${chips}</span><span class="controls">${config.show_area_turn_off ? `<button class="btn danger" data-turn-area="${escapeHtml(group.id)}" title="${escapeHtml(tr(this._hass, config, "turn_off_area"))}"><ha-icon icon="mdi:power"></ha-icon></button>` : ""}<span class="btn"><ha-icon icon="mdi:chevron-${expanded ? "up" : "down"}"></ha-icon></span></span></div>${expanded ? `<div class="entities">${entities.map((item) => this.renderEntity(item)).join("")}</div>` : ""}</section>`;
  }
  renderEntity(item) {
    const config = this._config;
    return `<div class="entity" role="button" tabindex="0" data-entity="${escapeHtml(item.entityId)}">${config.show_entity_icons ? `<span class="icon"><ha-icon icon="${escapeHtml(item.icon)}"></ha-icon></span>` : ""}<span><span class="line"><span class="name">${escapeHtml(item.name)}</span>${item.protected ? `<span class="protected"><ha-icon icon="mdi:lock"></ha-icon> ${escapeHtml(tr(this._hass, config, "protected"))}</span>` : ""}</span>${config.show_entity_secondary_info ? `<div class="secondary">${escapeHtml(item.secondary)}</div>` : ""}</span>${config.show_entity_turn_off ? `<button class="btn danger" data-turn-entity="${escapeHtml(item.entityId)}" ${item.controllable ? "" : "disabled"} title="${escapeHtml(item.disabledReason || tr(this._hass, config, "turn_off_entity"))}"><ha-icon icon="${item.protected ? "mdi:lock" : "mdi:power"}"></ha-icon></button>` : ""}</div>`;
  }
  bindEvents(groups) {
    this.shadowRoot.querySelectorAll("[data-toggle]").forEach((el) => el.addEventListener("click", () => this.toggle(el.dataset.toggle)));
    this.shadowRoot.querySelectorAll("[data-turn-area]").forEach((el) => el.addEventListener("click", (ev) => { ev.stopPropagation(); this.turnOffArea(groups.find((group) => group.id === el.dataset.turnArea)); }));
    this.shadowRoot.querySelectorAll("[data-turn-entity]").forEach((el) => el.addEventListener("click", (ev) => { ev.stopPropagation(); const item = groups.flatMap((g) => g.entities).find((x) => x.entityId === el.dataset.turnEntity); if (item) this.turnOffEntity(item); }));
    this.shadowRoot.querySelectorAll("[data-entity]").forEach((el) => el.addEventListener("click", () => this.moreInfo(el.dataset.entity)));
    const global = this.shadowRoot.querySelector("[data-global]");
    if (global) global.addEventListener("click", () => this.turnOffGlobal(groups));
  }
  isExpanded(group) {
    const override = this._config.areas?.[group.id] || this._config.areas?.[group.name];
    return this._expanded[group.id] ?? override?.default_expanded ?? this._config.default_expanded;
  }
  toggle(id) {
    if (!this._config.expand_on_header_tap) return;
    this._expanded = { ...this._expanded, [id]: !this._expanded[id] };
    if (this._config.remember_expanded_state) try { localStorage.setItem(storageKey(this._id), JSON.stringify(this._expanded)); } catch {}
    this.render();
  }
  safeCandidates(items) { return items.filter((item) => !disabledReason(item, this._config)); }
  async turnOffEntity(item) {
    if (!this._hass || !this._config || !item.controllable) return;
    if (this._config.confirm_entity_turn_off && !confirm(tr(this._hass, this._config, "confirm_entity_turn_off", { entity: item.name }))) return;
    const [domain, service] = this._config.service_mapping[item.domain].split(".");
    try { await this._hass.callService(domain, service, undefined, { entity_id: item.entityId }); } catch (err) { this.notify(err); }
  }
  async turnOffArea(group) {
    if (!this._hass || !group) return;
    const candidates = this.safeCandidates(group.entities);
    if (!candidates.length) return;
    const msg = `${tr(this._hass, this._config, "confirm_area_turn_off", { area: group.name, count: candidates.length })}\n${tr(this._hass, this._config, "protected_will_remain")}`;
    if ((this._config.confirm_area_turn_off || this._config.area_turn_off_mode === "homeassistant_area") && !confirm(msg)) return;
    try {
      if (this._config.area_turn_off_mode === "homeassistant_area") await this._hass.callService("homeassistant", "turn_off", undefined, { area_id: group.id });
      else await this.turnOffGrouped(candidates);
    } catch (err) { this.notify(err); }
  }
  async turnOffGlobal(groups) {
    const candidates = this.safeCandidates(groups.flatMap((group) => group.entities));
    if (!candidates.length) return;
    if (this._config.confirm_global_turn_off && !confirm(tr(this._hass, this._config, "confirm_global_turn_off"))) return;
    try { await this.turnOffGrouped(candidates); } catch (err) { this.notify(err); }
  }
  async turnOffGrouped(items) {
    const grouped = new Map();
    items.forEach((item) => grouped.set(this._config.service_mapping[item.domain], [...(grouped.get(this._config.service_mapping[item.domain]) || []), item.entityId]));
    await Promise.all([...grouped.entries()].map(([mapping, ids]) => { const [domain, service] = mapping.split("."); return this._hass.callService(domain, service, undefined, { entity_id: ids }); }));
  }
  moreInfo(entityId) {
    this.dispatchEvent(new CustomEvent("hass-more-info", { bubbles: true, composed: true, detail: { entityId } }));
  }
  notify(err) {
    const message = err?.message || String(err);
    if (this._config.debug) console.warn("[area-bubble-expander-card]", err);
    this.dispatchEvent(new CustomEvent("hass-notification", { bubbles: true, composed: true, detail: { message } }));
  }
}
class AreaBubbleExpanderCardEditor extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._config = { type: CARD_TYPE };
  }
  setConfig(config) { this._config = { ...config }; this.render(); }
  set hass(value) { this._hass = value; this.render(); }
  get hass() { return this._hass; }
  render() {
    if (!this.shadowRoot) return;
    const c = mergeConfig(this._config);
    const list = (value) => Array.isArray(value) ? value.join("\n") : "";
    this.shadowRoot.innerHTML = `<style>:host{display:block}.grid{display:grid;gap:14px}.section{display:grid;gap:10px;padding:14px;border:1px solid var(--divider-color);border-radius:12px}.field{display:grid;gap:5px}label{font-weight:600}input,select,textarea{box-sizing:border-box;width:100%;min-height:40px;padding:8px;border:1px solid var(--divider-color);border-radius:8px;background:var(--card-background-color);color:var(--primary-text-color);font:inherit}textarea{min-height:82px}.row{display:flex;align-items:center;justify-content:space-between;gap:12px}</style><div class="grid">
      ${this.bool("show_header", "Show header", c.show_header)}
      ${this.text("title", "Card title", c.title || "")}
      ${this.select("language", "Language", c.language, [["auto","Auto"],["he","Hebrew"],["en","English"]])}
      ${this.select("rtl", "RTL", String(c.rtl), [["auto","Auto"],["true","Enabled"],["false","Disabled"]])}
      <div class="section"><strong>Display</strong>${this.bool("default_expanded","Default expanded",c.default_expanded)}${this.bool("show_domain_chips","Show domain chips",c.show_domain_chips)}${this.bool("show_preview_entities","Show preview entities",c.show_preview_entities)}${this.number("preview_entity_count","Preview entity count",c.preview_entity_count)}</div>
      <div class="section"><strong>Entities</strong>${this.area("domains","Included domains",list(c.domains))}${this.area("exclude_domains","Excluded domains",list(c.exclude_domains))}${this.area("exclude_entities","Exclude entities",list(c.exclude_entities))}${this.area("exclude_labels","Exclude labels",list(c.exclude_labels))}</div>
      <div class="section"><strong>Actions and Safety</strong>${this.bool("show_area_turn_off","Show area turn-off",c.show_area_turn_off)}${this.bool("show_entity_turn_off","Show entity turn-off",c.show_entity_turn_off)}${this.bool("confirm_area_turn_off","Confirm area turn-off",c.confirm_area_turn_off)}${this.area("protected_labels","Protected labels",list(c.protected_labels))}${this.area("protected_entities","Protected entities",list(c.protected_entities))}</div>
      <div class="section"><strong>Advanced JSON</strong>${this.area("active_states","Active states JSON",JSON.stringify(c.active_states,null,2),true)}${this.area("inactive_states","Inactive states JSON",JSON.stringify(c.inactive_states,null,2),true)}${this.area("service_mapping","Service mapping JSON",JSON.stringify(c.service_mapping,null,2),true)}</div>
      <div class="section"><strong>Debug</strong>${this.bool("debug","Debug logging",c.debug)}${this.bool("show_debug","Show diagnostics",c.show_debug)}<textarea readonly>${escapeHtml(JSON.stringify(this._config,null,2))}</textarea></div>
    </div>`;
    this.shadowRoot.querySelectorAll("[data-key]").forEach((el) => el.addEventListener("change", () => this.changed(el)));
  }
  bool(key, label, value) { return `<div class="row"><label>${label}</label><input type="checkbox" data-key="${key}" ${value ? "checked" : ""}></div>`; }
  text(key, label, value) { return `<div class="field"><label>${label}</label><input data-key="${key}" value="${escapeHtml(value)}"></div>`; }
  number(key, label, value) { return `<div class="field"><label>${label}</label><input type="number" data-key="${key}" value="${escapeHtml(value)}"></div>`; }
  select(key, label, value, options) { return `<div class="field"><label>${label}</label><select data-key="${key}">${options.map(([v,l]) => `<option value="${v}" ${String(value)===v?"selected":""}>${l}</option>`).join("")}</select></div>`; }
  area(key, label, value, json = false) { return `<div class="field"><label>${label}</label><textarea data-key="${key}" ${json ? "data-json" : ""}>${escapeHtml(value)}</textarea></div>`; }
  changed(el) {
    const key = el.dataset.key;
    let value = el.type === "checkbox" ? el.checked : el.value;
    if (key === "rtl") value = value === "true" ? true : value === "false" ? false : "auto";
    if (el.tagName === "TEXTAREA" && !el.dataset.json) value = value.split(/[\n,]/).map((x) => x.trim()).filter(Boolean);
    if (el.dataset.json) { try { value = JSON.parse(value || "{}"); } catch {} }
    if (el.type === "number") value = Number(value);
    this._config = { ...this._config, [key]: value };
    this.dispatchEvent(new CustomEvent("config-changed", { bubbles: true, composed: true, detail: { config: this._config } }));
  }
}
customElements.define(CARD_TAG, AreaBubbleExpanderCard);
customElements.define(EDITOR_TAG, AreaBubbleExpanderCardEditor);
window.customCards = window.customCards || [];
window.customCards.push({ type: "area-bubble-expander-card", name: "Area Bubble Expander Card", description: "Active entities grouped by Area with safe controls and Hebrew/RTL support.", preview: true });
console.info("%c AREA-BUBBLE-EXPANDER-CARD %c 0.1.0", "color:white;background:#03a9f4;font-weight:700", "color:#03a9f4;font-weight:700");
