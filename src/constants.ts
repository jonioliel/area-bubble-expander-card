import type { AreaBubbleExpanderCardConfig, CardStyleConfig, StylePreset } from "./types";

export const CARD_TYPE = "custom:area-bubble-expander-card";
export const CARD_TAG = "area-bubble-expander-card";
export const EDITOR_TAG = "area-bubble-expander-card-editor";
export const STORAGE_PREFIX = "area-bubble-expander-card";

export const INCLUDED_DOMAINS = ["light", "switch", "fan", "climate", "media_player"];

export const DEFAULT_EXCLUDED_DOMAINS = [
  "sensor",
  "automation",
  "script",
  "scene",
  "input_number",
  "input_select",
  "button",
  "update",
  "device_tracker",
  "person",
  "camera",
  "alarm_control_panel",
];

export const DEFAULT_ACTIVE_STATES: Record<string, string[]> = {
  light: ["on"],
  switch: ["on"],
  fan: ["on"],
  media_player: ["playing", "buffering", "paused"],
  cover: ["open", "opening"],
  lock: ["unlocked"],
  binary_sensor: ["on"],
  input_boolean: ["on"],
};

export const DEFAULT_INACTIVE_STATES: Record<string, string[]> = {
  climate: ["off", "unavailable", "unknown"],
};

export const IGNORED_STATES = new Set(["unavailable", "unknown", "none", ""]);

export const DEFAULT_PROTECTED_LABELS = ["always_on", "critical", "infrastructure", "no_turn_off"];
export const DEFAULT_PROTECTED_ENTITIES = [
  "switch.router",
  "switch.server",
  "switch.nvr",
  "switch.home_assistant",
  "switch.main_network",
  "switch.alarm_bypass",
  "switch.irrigation_main_valve",
];

export const DEFAULT_SERVICE_MAPPING: Record<string, string> = {
  light: "light.turn_off",
  switch: "switch.turn_off",
  fan: "fan.turn_off",
  climate: "climate.turn_off",
  media_player: "media_player.turn_off",
  cover: "cover.close_cover",
  lock: "lock.lock",
  input_boolean: "input_boolean.turn_off",
};

export const DEFAULT_DOMAIN_ICONS: Record<string, string> = {
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

export const DEFAULT_STYLE: Required<CardStyleConfig> = {
  preset: "bubble_glass",
  glass: true,
  compact: false,
  border_radius: 26,
  blur: 18,
  section_gap: 12,
  row_height: 52,
  icon_size: 22,
  area_icon_size: 26,
  entity_icon_size: 22,
  background_opacity: 0.08,
  border_opacity: 0.12,
  show_shadows: true,
  shadow_intensity: 0.2,
  accent_color: "var(--primary-color)",
  danger_color: "#ff5252",
  header_background: "rgba(255,255,255,0.05)",
  expanded_background: "rgba(255,255,255,0.07)",
  collapsed_background: "rgba(255,255,255,0.06)",
  row_background: "rgba(255,255,255,0.08)",
  chip_background: "rgba(255,255,255,0.11)",
  text_size: 15,
  secondary_text_size: 12,
};

export const STYLE_PRESETS: Record<StylePreset, Partial<CardStyleConfig>> = {
  bubble_glass: {},
  bubble_solid: {
    glass: false,
    blur: 0,
    background_opacity: 1,
    row_background: "var(--secondary-background-color)",
    chip_background: "color-mix(in srgb, var(--primary-text-color) 9%, transparent)",
  },
  expander_minimal: {
    glass: false,
    blur: 0,
    border_radius: 16,
    section_gap: 8,
    show_shadows: false,
    header_background: "transparent",
    expanded_background: "transparent",
    collapsed_background: "transparent",
    row_background: "var(--secondary-background-color)",
  },
  home_assistant_native: {
    glass: false,
    blur: 0,
    border_radius: 12,
    section_gap: 8,
    show_shadows: false,
    header_background: "var(--card-background-color)",
    expanded_background: "var(--card-background-color)",
    collapsed_background: "var(--card-background-color)",
    row_background: "var(--secondary-background-color)",
    chip_background: "var(--secondary-background-color)",
  },
  dark_glass: {
    glass: true,
    header_background: "rgba(8, 12, 20, 0.6)",
    expanded_background: "rgba(8, 12, 20, 0.54)",
    collapsed_background: "rgba(8, 12, 20, 0.48)",
    row_background: "rgba(10, 15, 24, 0.58)",
    chip_background: "rgba(255,255,255,0.1)",
  },
  light_glass: {
    glass: true,
    header_background: "rgba(255,255,255,0.52)",
    expanded_background: "rgba(255,255,255,0.46)",
    collapsed_background: "rgba(255,255,255,0.38)",
    row_background: "rgba(255,255,255,0.5)",
    chip_background: "rgba(255,255,255,0.62)",
  },
  compact_mobile: {
    compact: true,
    border_radius: 18,
    section_gap: 7,
    row_height: 44,
    icon_size: 19,
    area_icon_size: 22,
    entity_icon_size: 19,
    text_size: 14,
    secondary_text_size: 11,
  },
};

export const DEFAULT_CONFIG: AreaBubbleExpanderCardConfig = {
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
  collapse_empty_areas: true,
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
  domains: INCLUDED_DOMAINS,
  exclude_domains: DEFAULT_EXCLUDED_DOMAINS,
  exclude_labels: [],
  exclude_entity_category: ["diagnostic", "config"],
  exclude_hidden_entities: true,
  exclude_unavailable: true,
  active_states: DEFAULT_ACTIVE_STATES,
  inactive_states: DEFAULT_INACTIVE_STATES,
  paused_media_players_active: true,
  protected_labels: DEFAULT_PROTECTED_LABELS,
  protected_entities: DEFAULT_PROTECTED_ENTITIES,
  protected_entity_behavior: "show_disabled",
  disable_turn_off_for_domains: [],
  dangerous_domains: ["switch", "lock", "cover"],
  safety_mode: "normal",
  service_mapping: DEFAULT_SERVICE_MAPPING,
  domain_icons: DEFAULT_DOMAIN_ICONS,
  tap_action: { action: "more-info" },
  hold_action: { action: "none" },
  double_tap_action: { action: "none" },
  area_sort: "count_desc",
  entity_sort: "domain",
  style: DEFAULT_STYLE,
  max_entities_per_area: 0,
  show_last_changed: false,
  show_brightness: true,
  show_temperature: true,
  show_media_title: true,
  show_entity_ids: false,
  show_area_ids: false,
  show_debug: false,
  debug: false,
  enable_animations: true,
  respect_reduced_motion: true,
};
