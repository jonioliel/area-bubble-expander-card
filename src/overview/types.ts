import type { CardStyleConfig, HassEntity, LanguageMode, RtlMode } from "../types";

export type OverviewSectionId = "climate" | "floor_heating" | "covers" | "lights_switches" | "media";
export type OverviewQuickActionId = "lights" | "climate" | "floor_heating" | "switches" | "covers" | "media";

export type OverviewEntityOverride = {
  name?: string;
  icon?: string;
  section?: OverviewSectionId;
  hidden?: boolean;
  protected?: boolean;
};

export type OverviewAreaOverride = {
  name?: string;
  icon?: string;
  parent_area?: string;
  show_when_parent_collapsed?: boolean;
  hidden?: boolean;
  default_expanded?: boolean;
  temperature_entity?: string;
  occupancy_count_entity?: string;
  occupancy_entities?: string[];
  section_order?: OverviewSectionId[];
  section_titles?: Partial<Record<OverviewSectionId, string>>;
  entity_order?: Partial<Record<OverviewSectionId, string[]>>;
  include_entities?: Partial<Record<OverviewSectionId, string[]>>;
  exclude_entities?: string[];
};

export type OverviewStyleConfig = Pick<
  CardStyleConfig,
  "border_radius" | "blur" | "section_gap" | "row_height" | "show_shadows" | "shadow_intensity" | "accent_color" | "row_background"
> & {
  area_name_size?: number;
  active_color?: string;
  active_surface?: string;
  climate_surface?: string;
  control_surface?: string;
  climate_color?: string;
  cover_color?: string;
  media_color?: string;
  temperature_off_surface?: string;
  temperature_cool_surface?: string;
  temperature_heat_surface?: string;
  temperature_active_surface?: string;
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
  show_header?: boolean;
  show_floor_header?: boolean;
  show_temperature?: boolean;
  show_occupancy?: boolean;
  show_quick_actions?: boolean;
  show_area_expand_button?: boolean;
  show_empty_sections?: boolean;
  default_expanded?: boolean;
  floor_default_expanded?: boolean;
  remember_expanded_state?: boolean;
  section_order?: OverviewSectionId[];
  section_titles?: Partial<Record<OverviewSectionId, string>>;
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
