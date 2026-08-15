import type { CardStyleConfig, HassEntity, LanguageMode, RtlMode } from "../types";

export type OverviewSectionId = "climate" | "floor_heating" | "covers" | "lights_switches" | "media";
export type OverviewQuickActionId = "lights" | "climate" | "floor_heating" | "switches" | "covers" | "media";
/** Runtime-only popup kinds may extend the user-configurable quick actions. */
export type OverviewQuickActionKind = OverviewQuickActionId | "fans";
export type OverviewSectionActionMode = "toggle" | "dual";
export type OverviewControlPresentation = "icon" | "text" | "both";
export type OverviewSectionBorderStyle = "solid" | "dashed" | "dotted";
export type OverviewQuickActionsPosition = "near_name" | "opposite";
export type OverviewClimateTagPosition = "left" | "right" | "top" | "bottom";
export type OverviewAreaOpenMode = "expander" | "popup";
export type OverviewThemePreset =
  | "classic"
  | "elegant"
  | "light"
  | "dark"
  | "modern"
  | "ocean"
  | "emerald"
  | "violet"
  | "coral"
  | "amber"
  | "rose";
export type OverviewThemeMode = "recommended" | "light" | "dark";
export type OverviewStateLanguage = "auto" | "he" | "en";
export type OverviewTileShape = "rectangle" | "square";
export type OverviewTileIconPosition = "start" | "left" | "right" | "center";
export type OverviewEntityCardSize = "compact" | "medium" | "wide";
export type OverviewAutomaticSubgroupId = "fans" | "heating_controls";

export type OverviewSectionStyle = {
  background?: string;
  border_color?: string;
  border_width?: number;
  border_style?: OverviewSectionBorderStyle;
  show_border?: boolean;
  columns?: 1 | 2 | 3;
  entity_height?: number;
  action_presentation?: OverviewControlPresentation;
};

export type OverviewSectionActionIcons = {
  on?: string;
  off?: string;
  open?: string;
  close?: string;
};

export type OverviewEntityOverride = {
  name?: string;
  strip_area_name?: boolean;
  icon?: string;
  section?: OverviewSectionId;
  group?: string;
  hidden?: boolean;
  protected?: boolean;
  ignore_activity?: boolean;
  tile_shape?: OverviewTileShape;
  icon_position?: OverviewTileIconPosition;
  show_state?: boolean;
  state_language?: OverviewStateLanguage;
};

export type OverviewAreaOverride = {
  name?: string;
  icon?: string;
  parent_area?: string;
  show_when_parent_collapsed?: boolean;
  hidden?: boolean;
  default_expanded?: boolean;
  open_mode?: OverviewAreaOpenMode;
  temperature_entity?: string;
  occupancy_count_entity?: string;
  occupancy_entities?: string[];
  section_order?: OverviewSectionId[];
  subarea_order?: string[];
  subgroup_titles?: Partial<Record<OverviewAutomaticSubgroupId, string>>;
  entity_card_size?: OverviewEntityCardSize;
  section_titles?: Partial<Record<OverviewSectionId, string>>;
  section_styles?: Partial<Record<OverviewSectionId, OverviewSectionStyle>>;
  entity_order?: Partial<Record<OverviewSectionId, string[]>>;
  include_entities?: Partial<Record<OverviewSectionId, string[]>>;
  exclude_entities?: string[];
};

export type OverviewStyleConfig = Pick<
  CardStyleConfig,
  "border_radius" | "blur" | "section_gap" | "row_height" | "show_shadows" | "shadow_intensity" | "accent_color" | "row_background"
> & {
  area_name_size?: number;
  card_background?: string;
  card_transparent?: boolean;
  primary_text_color?: string;
  secondary_text_color?: string;
  active_text_color?: string;
  control_text_color?: string;
  active_color?: string;
  active_surface?: string;
  entity_active_surface?: string;
  area_frame_color?: string;
  area_frame_width?: number;
  entity_frame_color?: string;
  entity_frame_width?: number;
  climate_tag_gap?: number;
  link_section_frame_color?: boolean;
  section_frame_brightness?: number;
  climate_surface?: string;
  control_surface?: string;
  climate_color?: string;
  cover_color?: string;
  media_color?: string;
  temperature_off_surface?: string;
  temperature_cool_surface?: string;
  temperature_heat_surface?: string;
  temperature_active_surface?: string;
  occupancy_active_color?: string;
  occupancy_vacant_color?: string;
  occupancy_unknown_color?: string;
  quick_action_size?: number;
  quick_action_icon_size?: number;
  section_action_size?: number;
  section_action_icon_size?: number;
  category_gap?: number;
};

export type AreaBubbleOverviewCardConfig = {
  type: "custom:area-bubble-overview-card";
  id?: string;
  area?: string;
  floor?: string;
  title?: string;
  target_icon?: string;
  language?: LanguageMode;
  rtl?: RtlMode;
  theme_preset?: OverviewThemePreset;
  theme_mode?: OverviewThemeMode;
  show_header?: boolean;
  show_floor_header?: boolean;
  show_temperature?: boolean;
  show_occupancy?: boolean;
  show_quick_actions?: boolean;
  show_area_expand_button?: boolean;
  show_floor_expand_button?: boolean;
  area_open_mode?: OverviewAreaOpenMode;
  quick_actions_position?: OverviewQuickActionsPosition;
  climate_tag_position?: OverviewClimateTagPosition;
  show_fan_tag?: boolean;
  strip_area_name_from_entity_names?: boolean;
  entity_state_language?: OverviewStateLanguage;
  light_tile_shape?: OverviewTileShape;
  light_icon_position?: OverviewTileIconPosition;
  light_show_state?: boolean;
  entity_card_size?: OverviewEntityCardSize;
  subgroup_titles?: Partial<Record<OverviewAutomaticSubgroupId, string>>;
  show_empty_sections?: boolean;
  default_expanded?: boolean;
  floor_default_expanded?: boolean;
  remember_expanded_state?: boolean;
  section_order?: OverviewSectionId[];
  section_titles?: Partial<Record<OverviewSectionId, string>>;
  section_styles?: Partial<Record<OverviewSectionId, OverviewSectionStyle>>;
  section_action_mode?: OverviewSectionActionMode;
  section_action_presentation?: OverviewControlPresentation;
  climate_mode_presentation?: OverviewControlPresentation;
  section_action_icons?: OverviewSectionActionIcons;
  quick_actions?: OverviewQuickActionId[];
  quick_action_icons?: Partial<Record<OverviewQuickActionId, string>>;
  area_order?: string[];
  floor_heating_labels?: string[];
  floor_heating_entities?: string[];
  occupancy_device_classes?: string[];
  include_entities?: Partial<Record<OverviewSectionId, string[]>>;
  exclude_entities?: string[];
  protected_labels?: string[];
  protected_entities?: string[];
  area_overrides?: Record<string, OverviewAreaOverride>;
  entity_overrides?: Record<string, OverviewEntityOverride>;
  style?: OverviewStyleConfig;
  debug?: boolean;
};

export type ResolvedOverviewConfig = Required<
  Omit<
    AreaBubbleOverviewCardConfig,
    | "area"
    | "floor"
    | "section_titles"
    | "section_styles"
    | "section_action_icons"
    | "subgroup_titles"
    | "quick_action_icons"
    | "include_entities"
    | "area_overrides"
    | "entity_overrides"
    | "style"
  >
> & {
  area?: string;
  floor?: string;
  section_titles: Record<OverviewSectionId, string>;
  section_styles: Record<OverviewSectionId, OverviewSectionStyle>;
  section_action_icons: Required<OverviewSectionActionIcons>;
  subgroup_titles: Record<OverviewAutomaticSubgroupId, string>;
  quick_action_icons: Record<OverviewQuickActionId, string>;
  include_entities: Partial<Record<OverviewSectionId, string[]>>;
  area_overrides: Record<string, OverviewAreaOverride>;
  entity_overrides: Record<string, OverviewEntityOverride>;
  style: Required<OverviewStyleConfig>;
};

export type OverviewEntity = {
  entity: HassEntity;
  entityId: string;
  domain: string;
  name: string;
  icon: string;
  areaId: string;
  section: OverviewSectionId;
  labels: string[];
  available: boolean;
  active: boolean;
  powered: boolean;
  protected: boolean;
  ignoreActivity?: boolean;
  group?: string;
};

export type OverviewSection = {
  id: OverviewSectionId;
  title: string;
  icon: string;
  entities: OverviewEntity[];
  activeCount: number;
};

export type OccupancyState = "occupied" | "vacant" | "unknown" | "none";
export type OccupancyCountSource = "entity" | "sensors" | "none";
export type OverviewTemperatureMode = "none" | "off" | "cool" | "heat" | "active";

export type OverviewArea = {
  id: string;
  name: string;
  icon: string;
  floorId?: string;
  parentAreaId?: string;
  showWhenParentCollapsed: boolean;
  sections: OverviewSection[];
  allEntities: OverviewEntity[];
  temperature?: number;
  temperatureUnit?: string;
  temperatureMode: OverviewTemperatureMode;
  occupancy: OccupancyState;
  occupancyCount?: number;
  occupancyCountSource: OccupancyCountSource;
  occupancyEntities: string[];
};

export type OverviewDiscovery = {
  areas: OverviewArea[];
  targetName: string;
  targetIcon: string;
  targetKind: "area" | "floor" | "none";
  warnings: string[];
};
