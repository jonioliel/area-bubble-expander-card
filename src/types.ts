import type { CSSResultGroup, TemplateResult } from "lit";

export type HassEntity = {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown>;
  last_changed: string;
  last_updated: string;
};

export type HassEntityRegistryEntry = {
  entity_id: string;
  area_id?: string | null;
  device_id?: string | null;
  hidden_by?: string | null;
  entity_category?: "config" | "diagnostic" | string | null;
  labels?: string[];
  platform?: string;
  translation_key?: string;
  name?: string | null;
};

export type HassDeviceRegistryEntry = {
  id: string;
  area_id?: string | null;
  labels?: string[];
  name?: string | null;
  name_by_user?: string | null;
};

export type HassAreaRegistryEntry = {
  area_id?: string;
  id?: string;
  name: string;
  icon?: string | null;
  labels?: string[];
};

export type HomeAssistant = {
  states: Record<string, HassEntity>;
  entities?: Record<string, HassEntityRegistryEntry>;
  devices?: Record<string, HassDeviceRegistryEntry>;
  areas?: Record<string, HassAreaRegistryEntry>;
  labels?: Record<string, { label_id?: string; name?: string; color?: string; icon?: string }>;
  language?: string;
  locale?: { language?: string };
  themes?: { darkMode?: boolean };
  callService(domain: string, service: string, data?: Record<string, unknown>, target?: Record<string, unknown>): Promise<unknown>;
  callWS?<T = unknown>(message: Record<string, unknown>): Promise<T>;
  localize?(key: string, ...args: unknown[]): string;
};

export type LovelaceCard = HTMLElement & {
  hass?: HomeAssistant;
  setConfig(config: AreaBubbleExpanderCardConfig): void;
  getCardSize?(): number | Promise<number>;
};

export type LovelaceCardEditor = HTMLElement & {
  hass?: HomeAssistant;
  setConfig(config: AreaBubbleExpanderCardConfig): void;
};

export type LovelaceAction =
  | { action: "more-info" | "toggle" | "turn-off" | "none" }
  | { action: "call-service"; service: string; service_data?: Record<string, unknown>; target?: Record<string, unknown> }
  | { action: "navigate"; navigation_path: string }
  | { action: "url"; url_path: string };

export type LanguageMode = "auto" | "he" | "en";
export type RtlMode = "auto" | boolean;
export type AreaTurnOffMode = "safe_displayed_entities" | "domain_grouped_services" | "homeassistant_area";
export type ProtectedEntityBehavior = "hide" | "show_disabled" | "show_with_lock_icon";
export type DomainChipMode = "icons" | "text" | "icons_and_text";
export type AreaSortMode = "name" | "count_desc" | "count_asc" | "custom" | "original";
export type EntitySortMode = "name" | "domain" | "state" | "last_changed" | "custom";
export type SafetyMode = "strict" | "normal" | "custom";
export type StylePreset =
  | "bubble_glass"
  | "bubble_solid"
  | "expander_minimal"
  | "home_assistant_native"
  | "dark_glass"
  | "light_glass"
  | "compact_mobile";

export type AreaOverride = {
  name?: string;
  icon?: string;
  accent_color?: string;
  default_expanded?: boolean;
  allow_turn_off?: boolean;
  confirm_turn_off?: boolean;
  hidden?: boolean;
};

export type EntityOverride = {
  name?: string;
  icon?: string;
  allow_turn_off?: boolean;
  hidden?: boolean;
  protected?: boolean;
  show_disabled?: boolean;
};

export type CardStyleConfig = {
  preset?: StylePreset;
  glass?: boolean;
  compact?: boolean;
  border_radius?: number;
  blur?: number;
  section_gap?: number;
  row_height?: number;
  icon_size?: number;
  area_icon_size?: number;
  entity_icon_size?: number;
  background_opacity?: number;
  border_opacity?: number;
  show_shadows?: boolean;
  shadow_intensity?: number;
  accent_color?: string;
  danger_color?: string;
  header_background?: string;
  expanded_background?: string;
  collapsed_background?: string;
  row_background?: string;
  chip_background?: string;
  text_size?: number;
  secondary_text_size?: number;
};

export type AreaBubbleExpanderCardConfig = {
  type: "custom:area-bubble-expander-card";
  title?: string;
  language?: LanguageMode;
  rtl?: RtlMode;
  show_header?: boolean;
  show_total_count?: boolean;
  show_active_area_count?: boolean;
  show_empty?: boolean;
  empty_title?: string;
  empty_subtitle?: string;
  default_expanded?: boolean;
  remember_expanded_state?: boolean;
  expand_on_header_tap?: boolean;
  collapse_empty_areas?: boolean;
  show_area_icons?: boolean;
  show_entity_icons?: boolean;
  show_entity_secondary_info?: boolean;
  show_domain_chips?: boolean;
  domain_chip_mode?: DomainChipMode;
  show_preview_entities?: boolean;
  preview_entity_count?: number;
  show_area_turn_off?: boolean;
  show_entity_turn_off?: boolean;
  show_global_turn_off?: boolean;
  confirm_area_turn_off?: boolean;
  confirm_entity_turn_off?: boolean;
  confirm_global_turn_off?: boolean;
  area_turn_off_mode?: AreaTurnOffMode;
  domains?: string[];
  exclude_domains?: string[];
  include_entities?: string[];
  exclude_entities?: string[];
  include_areas?: string[];
  exclude_areas?: string[];
  exclude_labels?: string[];
  exclude_entity_category?: string[];
  exclude_by_regex?: string[];
  exclude_hidden_entities?: boolean;
  exclude_unavailable?: boolean;
  active_states?: Record<string, string[]>;
  inactive_states?: Record<string, string[]>;
  paused_media_players_active?: boolean;
  protected_labels?: string[];
  protected_entities?: string[];
  protected_entity_behavior?: ProtectedEntityBehavior;
  disable_turn_off_for_domains?: string[];
  dangerous_domains?: string[];
  safety_mode?: SafetyMode;
  service_mapping?: Record<string, string>;
  tap_action?: LovelaceAction;
  hold_action?: LovelaceAction;
  double_tap_action?: LovelaceAction;
  area_sort?: AreaSortMode;
  entity_sort?: EntitySortMode;
  custom_area_order?: string[];
  custom_entity_order?: string[];
  areas?: Record<string, AreaOverride>;
  entity_overrides?: Record<string, EntityOverride>;
  labels?: Record<string, string>;
  domain_labels?: Record<string, string>;
  domain_icons?: Record<string, string>;
  style?: CardStyleConfig;
  max_entities_per_area?: number;
  show_last_changed?: boolean;
  show_brightness?: boolean;
  show_temperature?: boolean;
  show_media_title?: boolean;
  show_entity_ids?: boolean;
  show_area_ids?: boolean;
  show_debug?: boolean;
  debug?: boolean;
  enable_animations?: boolean;
  respect_reduced_motion?: boolean;
};

export type ResolvedConfig = Required<
  Omit<
    AreaBubbleExpanderCardConfig,
    | "include_entities"
    | "exclude_entities"
    | "include_areas"
    | "exclude_areas"
    | "exclude_labels"
    | "exclude_entity_category"
    | "exclude_by_regex"
    | "active_states"
    | "inactive_states"
    | "protected_entities"
    | "disable_turn_off_for_domains"
    | "dangerous_domains"
    | "service_mapping"
    | "custom_area_order"
    | "custom_entity_order"
    | "areas"
    | "entity_overrides"
    | "labels"
    | "domain_labels"
    | "domain_icons"
    | "style"
  >
> & {
  include_entities: string[];
  exclude_entities: string[];
  include_areas: string[];
  exclude_areas: string[];
  exclude_labels: string[];
  exclude_entity_category: string[];
  exclude_by_regex: string[];
  active_states: Record<string, string[]>;
  inactive_states: Record<string, string[]>;
  protected_entities: string[];
  disable_turn_off_for_domains: string[];
  dangerous_domains: string[];
  service_mapping: Record<string, string>;
  custom_area_order: string[];
  custom_entity_order: string[];
  areas: Record<string, AreaOverride>;
  entity_overrides: Record<string, EntityOverride>;
  labels: Record<string, string>;
  domain_labels: Record<string, string>;
  domain_icons: Record<string, string>;
  style: Required<CardStyleConfig>;
};

export type DiscoveredEntity = {
  entity: HassEntity;
  entityId: string;
  domain: string;
  name: string;
  icon: string;
  areaId: string;
  areaName: string;
  areaIcon?: string;
  labels: string[];
  category?: string | null;
  hidden: boolean;
  active: boolean;
  protected: boolean;
  controllable: boolean;
  disabledReason?: string;
  secondary: string;
  skipReasons: string[];
};

export type AreaGroup = {
  id: string;
  name: string;
  icon: string;
  entities: DiscoveredEntity[];
  domainCounts: Record<string, number>;
  protectedCount: number;
};

export type EditorSchemaItem = {
  section: string;
  key: keyof AreaBubbleExpanderCardConfig | string;
  label: string;
  type: "boolean" | "text" | "number" | "select" | "multi-text" | "textarea" | "color";
  options?: Array<{ value: string; label: string }>;
  min?: number;
  max?: number;
  step?: number;
};

declare global {
  interface Window {
    customCards?: Array<Record<string, unknown>>;
    loadCardHelpers?: () => Promise<unknown>;
  }

  interface HTMLElementTagNameMap {
    "area-bubble-expander-card": LovelaceCard;
    "area-bubble-expander-card-editor": LovelaceCardEditor;
  }
}

export type Constructor<T = object> = new (...args: unknown[]) => T;
export type StaticStyles = { styles?: CSSResultGroup };
export type Renderable = TemplateResult | string | number | null | undefined;
