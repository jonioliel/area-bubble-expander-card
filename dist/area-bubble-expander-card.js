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
    if (config.area_sort === "custom") {
      const ai = config.custom_area_order.includes(a.id) ? config.custom_area_order.indexOf(a.id) : config.custom_area_order.includes(a.name) ? config.custom_area_order.indexOf(a.name) : 999999;
      const bi = config.custom_area_order.includes(b.id) ? config.custom_area_order.indexOf(b.id) : config.custom_area_order.includes(b.name) ? config.custom_area_order.indexOf(b.name) : 999999;
      return ai - bi || a.name.localeCompare(b.name);
    }
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
      ha-card{overflow:hidden;border-radius:${s.border_radius}px;background:linear-gradient(145deg,rgba(255,255,255,.08),rgba(255,255,255,.035)),rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);box-shadow:${s.show_shadows ? `0 12px 30px rgba(0,0,0,${s.shadow_intensity})` : "none"};backdrop-filter:blur(${s.blur}px)}
      .root{padding:14px}.header{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:4px 4px 12px}.title{font-size:18px;font-weight:700}.sub,.preview,.secondary{color:var(--secondary-text-color);font-size:12px;line-height:1.35}.sections{display:grid;gap:${s.section_gap}px}.area{overflow:hidden;border-radius:${s.border_radius}px;background:linear-gradient(145deg,rgba(255,255,255,.07),rgba(255,255,255,.025)),rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);transition:background-color .16s ease,border-color .16s ease,transform .16s ease}.area.expanded{background:rgba(255,255,255,.075);border-color:rgba(var(--rgb-primary-color,3,169,244),.24)}
      .area-header{display:grid;grid-template-columns:auto minmax(0,1fr) auto;align-items:center;gap:10px;min-height:66px;padding:10px;cursor:pointer}.area-header:focus-visible,.entity:focus-visible,.btn:focus-visible{outline:2px solid ${s.accent_color};outline-offset:2px}.icon{display:inline-grid;place-items:center;width:42px;height:42px;border-radius:999px;background:radial-gradient(circle at 35% 25%,rgba(255,255,255,.22),transparent 45%),rgba(var(--rgb-primary-color,3,169,244),.16);color:${s.accent_color}}.name{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:650}.line{display:flex;gap:8px;align-items:center;min-width:0}.count{color:var(--secondary-text-color);font-size:12px;font-weight:600}.chips{display:flex;flex-wrap:wrap;gap:6px;margin-top:6px}.chip{display:inline-flex;align-items:center;gap:4px;min-height:22px;padding:0 8px;border-radius:999px;background:rgba(255,255,255,.11);color:var(--secondary-text-color);font-size:11px}.chip ha-icon{--mdc-icon-size:14px}.controls{display:flex;gap:4px}.btn{display:inline-grid;place-items:center;width:40px;height:40px;border:0;border-radius:999px;background:rgba(255,255,255,.08);color:var(--primary-text-color);cursor:pointer;transition:background-color .14s ease,color .14s ease,transform .14s ease}.btn:active,.entity:active{transform:scale(.985)}.btn.danger{color:${s.danger_color}}.btn[disabled]{opacity:.45;cursor:not-allowed}.entities{display:grid;gap:8px;padding:0 10px 10px}.entity{display:grid;grid-template-columns:auto minmax(0,1fr) auto;align-items:center;gap:10px;min-height:${s.row_height}px;padding:7px 8px;border-radius:${Math.max(8, s.border_radius - 10)}px;background:linear-gradient(145deg,rgba(255,255,255,.075),rgba(255,255,255,.035)),rgba(255,255,255,.08);cursor:pointer}.protected{color:var(--warning-color,#f6a623);font-size:11px}.empty{display:grid;place-items:center;gap:8px;min-height:128px;padding:22px;text-align:center}.debug{margin-top:12px;padding:10px;border-radius:14px;background:rgba(0,0,0,.16);direction:ltr;text-align:left;white-space:pre-wrap;color:var(--secondary-text-color);font-size:12px}
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
    const group = discover(this._hass, this._config).groups.find((candidate) => candidate.id === id);
    const current = group ? this.isExpanded(group) : Boolean(this._expanded[id]);
    this._expanded = { ...this._expanded, [id]: !current };
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
    this._registryLabels = [];
    this._labelsLoaded = false;
  }
  setConfig(config) { this._config = { ...config }; this.render(); }
  set hass(value) { this._hass = value; this.loadLabels(); this.render(); }
  get hass() { return this._hass; }
  async loadLabels() {
    if (this._labelsLoaded || !this._hass?.callWS) return;
    try {
      this._registryLabels = await this._hass.callWS({ type: "config/label_registry/list" });
      this._labelsLoaded = true;
      this.render();
    } catch {
      this._registryLabels = [];
    }
  }
  render() {
    if (!this.shadowRoot) return;
    const c = mergeConfig(this._config);
    const list = (value) => Array.isArray(value) ? value.join("\n") : "";
    const areaPicker = this.areaPicker(c);
    const areaOrder = this.areaOrder(c);
    const entityPicker = this.entityPicker(c);
    const labelPicker = this.labelPicker(c);
    const badgeTemplates = this.badgeTemplates(c);
    this.shadowRoot.innerHTML = `<style>:host{display:block}.grid{display:grid;gap:14px}.section{display:grid;gap:10px;padding:14px;border:1px solid var(--divider-color);border-radius:12px}.field{display:grid;gap:5px}label{font-weight:600}input,select,textarea{box-sizing:border-box;width:100%;min-height:40px;padding:8px;border:1px solid var(--divider-color);border-radius:8px;background:var(--card-background-color);color:var(--primary-text-color);font:inherit}textarea{min-height:82px}.yaml{direction:ltr;font-family:var(--code-font-family,monospace);font-size:12px}.template-output{min-height:420px;white-space:pre}.template-output.small{min-height:150px}.row{display:flex;align-items:center;justify-content:space-between;gap:12px}.picker{display:grid;gap:10px;padding:10px;border-radius:12px;background:color-mix(in srgb,var(--secondary-background-color) 82%,transparent);border:1px solid var(--divider-color)}.picker-head{display:grid;grid-template-columns:minmax(0,1fr) minmax(180px,280px);gap:10px;align-items:center}.picker-head.single{grid-template-columns:minmax(0,1fr) auto}.picker-head span{display:block;color:var(--secondary-text-color);font-size:12px;margin-top:2px}.picker-list{display:grid;gap:8px;max-height:360px;overflow:auto}.picker-list.compact{max-height:280px}.picker-item{display:grid;grid-template-columns:auto minmax(0,1fr) auto auto;align-items:center;gap:10px;padding:8px;border-radius:10px;background:var(--card-background-color);border:1px solid var(--divider-color)}.picker-item.is-hidden{display:none!important}.picker-item.order-item{grid-template-columns:auto minmax(0,1fr) auto auto}.picker-item ha-icon{color:var(--primary-color);--mdc-icon-size:22px}.picker-title{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:650}.picker-meta{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--secondary-text-color);font-size:12px}.pill{min-height:32px;border:1px solid var(--divider-color);border-radius:999px;padding:0 10px;background:transparent;color:var(--primary-text-color);cursor:pointer;font:inherit;font-size:12px;font-weight:650}.pill[disabled]{cursor:not-allowed;opacity:.45}.pill.active{border-color:var(--primary-color);background:color-mix(in srgb,var(--primary-color) 18%,transparent);color:var(--primary-color)}.pill.danger.active{border-color:var(--error-color,#ff5252);background:color-mix(in srgb,var(--error-color,#ff5252) 18%,transparent);color:var(--error-color,#ff5252)}@media(max-width:560px){.picker-head,.picker-head.single{grid-template-columns:1fr}.picker-item,.picker-item.order-item{grid-template-columns:auto minmax(0,1fr)}.pill{width:100%}}</style><div class="grid">
      ${this.bool("show_header", "Show header", c.show_header)}
      ${this.text("title", "Card title", c.title || "")}
      ${this.select("language", "Language", c.language, [["auto","Auto"],["he","Hebrew"],["en","English"]])}
      ${this.select("rtl", "RTL", String(c.rtl), [["auto","Auto"],["true","Enabled"],["false","Disabled"]])}
      <div class="section"><strong>Display</strong>${this.bool("default_expanded","Default expanded",c.default_expanded)}${this.bool("show_domain_chips","Show domain chips",c.show_domain_chips)}${this.bool("show_preview_entities","Show preview entities",c.show_preview_entities)}${this.number("preview_entity_count","Preview entity count",c.preview_entity_count)}</div>
      <div class="section"><strong>Areas</strong>${areaPicker}${areaOrder}${this.area("include_areas","Included areas",list(c.include_areas))}${this.area("exclude_areas","Excluded areas",list(c.exclude_areas))}${this.area("custom_area_order","Custom area order",list(c.custom_area_order))}</div>
      <div class="section"><strong>Entities</strong>${entityPicker}${labelPicker}${this.area("domains","Included domains",list(c.domains))}${this.area("exclude_domains","Excluded domains",list(c.exclude_domains))}${this.area("include_entities","Include entities",list(c.include_entities))}${this.area("exclude_entities","Hide entities",list(c.exclude_entities))}${this.area("exclude_labels","Exclude labels",list(c.exclude_labels))}</div>
      <div class="section"><strong>Actions and Safety</strong>${this.bool("show_area_turn_off","Show area turn-off",c.show_area_turn_off)}${this.bool("show_entity_turn_off","Show entity turn-off",c.show_entity_turn_off)}${this.bool("confirm_area_turn_off","Confirm area turn-off",c.confirm_area_turn_off)}${this.area("protected_labels","Protected labels",list(c.protected_labels))}${this.area("protected_entities","Protected entities",list(c.protected_entities))}</div>
      <div class="section"><strong>Advanced JSON</strong>${this.area("active_states","Active states JSON",JSON.stringify(c.active_states,null,2),true)}${this.area("inactive_states","Inactive states JSON",JSON.stringify(c.inactive_states,null,2),true)}${this.area("service_mapping","Service mapping JSON",JSON.stringify(c.service_mapping,null,2),true)}</div>
      <div class="section"><strong>Debug</strong>${this.bool("debug","Debug logging",c.debug)}${this.bool("show_debug","Show diagnostics",c.show_debug)}<textarea readonly>${escapeHtml(JSON.stringify(this._config,null,2))}</textarea></div>
      <div class="section"><strong>Badge / Template helper</strong><div class="picker"><div class="picker-head single"><div><strong>${badgeTemplates.activeCount} active entities · ${badgeTemplates.activeAreaCount} active areas</strong><span>Copy these into Home Assistant if you want a badge with active counts.</span></div></div><div class="field"><label>Template sensors YAML</label><textarea class="yaml template-output" readonly>${escapeHtml(badgeTemplates.templateYaml)}</textarea></div><div class="field"><label>Dashboard badge YAML</label><textarea class="yaml template-output small" readonly>${escapeHtml(badgeTemplates.badgeYaml)}</textarea></div></div></div>
    </div>`;
    this.shadowRoot.querySelectorAll("[data-key]").forEach((el) => el.addEventListener("change", () => this.changed(el)));
    this.shadowRoot.querySelectorAll("[data-list-key]").forEach((el) => el.addEventListener("click", () => this.toggleListValue(el.dataset.listKey, el.dataset.value)));
    this.shadowRoot.querySelectorAll("[data-filter]").forEach((input) => input.addEventListener("input", (ev) => { ev.stopPropagation(); this.filterList(input.dataset.filter, input.value); }));
    this.shadowRoot.querySelectorAll("[data-area-sort-custom]").forEach((button) => button.addEventListener("click", () => this.setAreaSortCustom()));
    this.shadowRoot.querySelectorAll("[data-move-area]").forEach((button) => button.addEventListener("click", () => this.moveArea(button.dataset.moveArea, Number(button.dataset.direction))));
  }
  areaPicker(c) {
    const areas = this.areaOptions(c);
    return `<div class="picker"><div class="picker-head"><div><strong>Areas from Home Assistant</strong><span>${areas.length} areas</span></div><input data-filter="areas" type="search" placeholder="Search area name or ID"></div><div class="picker-list">${areas.map((area) => `<div class="picker-item" data-filter-target="areas" data-search="${escapeHtml(`${area.name} ${area.id}`.toLowerCase())}"><ha-icon icon="${escapeHtml(area.icon)}"></ha-icon><div><div class="picker-title">${escapeHtml(area.name)}</div><div class="picker-meta">${escapeHtml(area.id)}</div></div><button type="button" class="pill ${c.include_areas.includes(area.id) || c.include_areas.includes(area.name) ? "active" : ""}" data-list-key="include_areas" data-value="${escapeHtml(area.id)}">Include</button><button type="button" class="pill danger ${c.exclude_areas.includes(area.id) || c.exclude_areas.includes(area.name) ? "active" : ""}" data-list-key="exclude_areas" data-value="${escapeHtml(area.id)}">Exclude</button></div>`).join("")}</div></div>`;
  }
  entityPicker(c) {
    const entities = this.entityOptions(c);
    return `<div class="picker"><div class="picker-head"><div><strong>Entities from Home Assistant</strong><span>${entities.length} entities</span></div><input data-filter="entities" type="search" placeholder="Search entity, area, domain, or label"></div><div class="picker-list">${entities.map((entity) => `<div class="picker-item" data-filter-target="entities" data-search="${escapeHtml(`${entity.name} ${entity.entityId} ${entity.domain} ${entity.areaName} ${entity.labels}`.toLowerCase())}"><ha-icon icon="${escapeHtml(entity.icon)}"></ha-icon><div><div class="picker-title">${escapeHtml(entity.name)}</div><div class="picker-meta">${escapeHtml(entity.entityId)} · ${escapeHtml(entity.areaName)} · ${escapeHtml(entity.domain)}${entity.labels ? ` · labels: ${escapeHtml(entity.labels)}` : ""}</div></div><button type="button" class="pill ${c.include_entities.includes(entity.entityId) ? "active" : ""}" data-list-key="include_entities" data-value="${escapeHtml(entity.entityId)}">Include</button><button type="button" class="pill danger ${c.exclude_entities.includes(entity.entityId) ? "active" : ""}" data-list-key="exclude_entities" data-value="${escapeHtml(entity.entityId)}">Hide</button></div>`).join("")}</div></div>`;
  }
  labelPicker(c) {
    const labels = this.labelOptions();
    return `<div class="picker"><div class="picker-head"><div><strong>Labels from Home Assistant</strong><span>${labels.length} labels</span></div><input data-filter="labels" type="search" placeholder="Search label name or ID"></div><div class="picker-list compact">${labels.map((label) => `<div class="picker-item" data-filter-target="labels" data-search="${escapeHtml(`${label.name} ${label.id}`.toLowerCase())}"><ha-icon icon="${escapeHtml(label.icon)}"></ha-icon><div><div class="picker-title">${escapeHtml(label.name)}</div><div class="picker-meta">${escapeHtml(label.id)}</div></div><button type="button" class="pill danger ${c.exclude_labels.includes(label.id) ? "active" : ""}" data-list-key="exclude_labels" data-value="${escapeHtml(label.id)}">Exclude</button></div>`).join("")}</div></div>`;
  }
  areaOrder(c) {
    const areas = this.orderedAreaOptions(c);
    return `<div class="picker"><div class="picker-head single"><div><strong>Active area display order</strong><span>Use arrows to set a custom order for active areas.</span></div><button type="button" class="pill ${c.area_sort === "custom" ? "active" : ""}" data-area-sort-custom>Use custom order</button></div><div class="picker-list compact">${areas.map((area, index) => `<div class="picker-item order-item"><ha-icon icon="${escapeHtml(area.icon)}"></ha-icon><div><div class="picker-title">${escapeHtml(area.name)}</div><div class="picker-meta">${escapeHtml(area.id)}</div></div><button type="button" class="pill" ${index === 0 ? "disabled" : ""} data-move-area="${escapeHtml(area.id)}" data-direction="-1">Up</button><button type="button" class="pill" ${index === areas.length - 1 ? "disabled" : ""} data-move-area="${escapeHtml(area.id)}" data-direction="1">Down</button></div>`).join("")}</div></div>`;
  }
  areaOptions(c) {
    const byId = new Map();
    Object.entries(this._hass?.areas || {}).forEach(([key, area]) => byId.set(area.area_id || area.id || key, { id: area.area_id || area.id || key, name: area.name, icon: area.icon || "mdi:floor-plan" }));
    Object.keys(this._hass?.states || {}).forEach((entityId) => {
      const area = resolveArea(this._hass, c, entityId);
      if (!byId.has(area.id)) byId.set(area.id, { id: area.id, name: area.name, icon: area.icon });
    });
    return [...byId.values()].sort((a, b) => a.name.localeCompare(b.name));
  }
  orderedAreaOptions(c) {
    const order = c.custom_area_order || [];
    return this.areaOptions(c).sort((a, b) => this.orderIndex(order, a.id, a.name) - this.orderIndex(order, b.id, b.name) || a.name.localeCompare(b.name));
  }
  entityOptions(c) {
    return Object.values(this._hass?.states || {}).map((entity) => {
      const domain = domainOf(entity.entity_id);
      const area = resolveArea(this._hass, c, entity.entity_id);
      return { entityId: entity.entity_id, domain, areaName: area.name, name: entity.attributes.friendly_name || entity.entity_id, icon: entity.attributes.icon || c.domain_icons[domain] || "mdi:toggle-switch-outline", labels: labelsFor(this._hass, entity.entity_id).join(" ") };
    }).sort((a, b) => a.areaName.localeCompare(b.areaName) || String(a.name).localeCompare(String(b.name)));
  }
  labelOptions() {
    const byId = new Map();
    (this._registryLabels || []).forEach((label) => {
      const id = label.label_id || label.id;
      if (id) byId.set(id, { id, name: label.name || id, icon: label.icon || "mdi:label-outline" });
    });
    Object.entries(this._hass?.labels || {}).forEach(([key, label]) => {
      const id = label.label_id || key;
      if (!byId.has(id)) byId.set(id, { id, name: label.name || id, icon: label.icon || "mdi:label-outline" });
    });
    Object.keys(this._hass?.states || {}).forEach((entityId) => {
      labelsFor(this._hass, entityId).forEach((label) => {
        if (!byId.has(label)) byId.set(label, { id: label, name: label, icon: "mdi:label-outline" });
      });
    });
    return [...byId.values()].sort((a, b) => a.name.localeCompare(b.name));
  }
  badgeTemplates(c) {
    const { groups } = discover(this._hass, c);
    const activeCount = groups.reduce((sum, group) => sum + group.entities.length, 0);
    const activeAreaCount = groups.length;
    const templateYaml = this.templateSensorYaml(c);
    const badgeYaml = `type: entity
entity: sensor.area_bubble_active_entities
name: דלוקים
show_name: true
show_state: true
tap_action:
  action: navigate
  navigation_path: /lovelace/0`;
    return { activeCount, activeAreaCount, templateYaml, badgeYaml };
  }
  templateSensorYaml(c) {
    const domains = JSON.stringify(c.domains);
    const excludeDomains = JSON.stringify(c.exclude_domains);
    const excludeEntities = JSON.stringify(c.exclude_entities);
    const excludeAreas = JSON.stringify(c.exclude_areas);
    const excludeLabels = JSON.stringify(c.exclude_labels);
    const activeStates = JSON.stringify(c.active_states);
    const inactiveStates = JSON.stringify(c.inactive_states);
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
  filterList(name, value) {
    const needle = String(value || "").trim().toLowerCase();
    this.shadowRoot.querySelectorAll(`[data-filter-target="${name}"]`).forEach((item) => {
      item.classList.toggle("is-hidden", Boolean(needle) && !String(item.dataset.search || "").includes(needle));
    });
  }
  moveArea(areaId, direction) {
    const c = mergeConfig(this._config);
    const order = this.orderedAreaOptions(c).map((area) => area.id);
    const current = order.indexOf(areaId);
    const nextIndex = current + direction;
    if (current < 0 || nextIndex < 0 || nextIndex >= order.length) return;
    const next = [...order];
    [next[current], next[nextIndex]] = [next[nextIndex], next[current]];
    this._config = { ...this._config, area_sort: "custom", custom_area_order: next };
    this.dispatchEvent(new CustomEvent("config-changed", { bubbles: true, composed: true, detail: { config: this._config } }));
    this.render();
  }
  setAreaSortCustom() {
    const c = mergeConfig(this._config);
    this._config = { ...this._config, area_sort: "custom", custom_area_order: c.custom_area_order?.length ? c.custom_area_order : this.orderedAreaOptions(c).map((area) => area.id) };
    this.dispatchEvent(new CustomEvent("config-changed", { bubbles: true, composed: true, detail: { config: this._config } }));
    this.render();
  }
  orderIndex(order, id, name) {
    if (order.includes(id)) return order.indexOf(id);
    if (name && order.includes(name)) return order.indexOf(name);
    return 999999;
  }
  toggleListValue(key, value) {
    const current = Array.isArray(this._config[key]) ? [...this._config[key]] : [];
    const next = current.includes(value) ? current.filter((item) => item !== value) : [...current, value];
    this._config = { ...this._config, [key]: next };
    this.dispatchEvent(new CustomEvent("config-changed", { bubbles: true, composed: true, detail: { config: this._config } }));
    this.render();
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
window.customCards.push({ type: "area-bubble-expander-card", name: "Area Bubble Expander Card", description: "Active entities grouped by Area with safe controls and Hebrew/RTL support.", preview: true, documentationURL: "https://github.com/jonioliel/area-bubble-expander-card" });
console.info("%c AREA-BUBBLE-EXPANDER-CARD %c 0.1.3", "color:white;background:#03a9f4;font-weight:700", "color:#03a9f4;font-weight:700");
