import type {
  AreaBubbleOverviewCardConfig,
  OverviewQuickActionId,
  OverviewSectionActionIcons,
  OverviewSectionId,
  OverviewStyleConfig,
} from "./types";

export const OVERVIEW_CARD_TYPE = "custom:area-bubble-overview-card";
export const OVERVIEW_CARD_TAG = "area-bubble-overview-card";
export const OVERVIEW_EDITOR_TAG = "area-bubble-overview-card-editor";
export const OVERVIEW_STORAGE_PREFIX = "area-bubble-overview-card";

export const CLIMATE_FEATURES = {
  TARGET_TEMPERATURE: 1,
  TARGET_TEMPERATURE_RANGE: 2,
  FAN_MODE: 8,
  TURN_OFF: 128,
  TURN_ON: 256,
} as const;

export const MEDIA_FEATURES = {
  PAUSE: 1,
  VOLUME_SET: 4,
  TURN_ON: 128,
  TURN_OFF: 256,
  PLAY: 16_384,
} as const;

export const WATER_HEATER_FEATURES = {
  TARGET_TEMPERATURE: 1,
  ON_OFF: 8,
} as const;

export const OVERVIEW_SECTIONS: OverviewSectionId[] = ["climate", "floor_heating", "covers", "lights_switches", "media"];
export const OVERVIEW_QUICK_ACTIONS: OverviewQuickActionId[] = ["lights", "climate", "floor_heating", "switches", "covers", "media"];

export const SECTION_ICONS: Record<OverviewSectionId, string> = {
  climate: "mdi:air-conditioner",
  floor_heating: "mdi:heating-coil",
  covers: "mdi:window-shutter",
  lights_switches: "mdi:lightbulb-group",
  media: "mdi:music-circle",
};

export const QUICK_ACTION_ICONS: Record<OverviewQuickActionId, string> = {
  lights: "mdi:lightbulb-group",
  climate: "mdi:air-conditioner",
  floor_heating: "mdi:heating-coil",
  switches: "mdi:toggle-switch",
  covers: "mdi:window-shutter",
  media: "mdi:music",
};

export const SECTION_ACTION_ICONS: Required<OverviewSectionActionIcons> = {
  on: "mdi:toggle-switch",
  off: "mdi:toggle-switch-off-outline",
  open: "mdi:arrow-up-bold-circle-outline",
  close: "mdi:arrow-down-bold-circle-outline",
};

export const OVERVIEW_DEFAULT_STYLE: Required<OverviewStyleConfig> = {
  border_radius: 26,
  blur: 18,
  section_gap: 12,
  row_height: 56,
  area_name_size: 17,
  show_shadows: true,
  shadow_intensity: 0.2,
  accent_color: "var(--primary-color)",
  row_background: "color-mix(in srgb, var(--secondary-background-color) 78%, transparent)",
  card_background: "var(--ha-card-background, var(--card-background-color))",
  card_transparent: true,
  active_color: "var(--state-active-color, #ffd54f)",
  active_surface: "rgba(174, 215, 219, 0.94)",
  entity_active_surface: "rgba(174, 215, 219, 0.94)",
  area_frame_color: "",
  area_frame_width: 2,
  climate_surface: "rgba(139, 181, 255, 0.94)",
  control_surface: "rgba(11, 28, 58, 0.94)",
  climate_color: "var(--state-climate-cool-color, #2196f3)",
  cover_color: "var(--state-cover-active-color, #00bcd4)",
  media_color: "var(--state-media-player-active-color, #9c27b0)",
  temperature_off_surface: "rgba(11, 28, 58, 0.94)",
  temperature_cool_surface: "rgba(34, 113, 196, 0.96)",
  temperature_heat_surface: "rgba(198, 83, 47, 0.96)",
  temperature_active_surface: "rgba(91, 86, 168, 0.96)",
  occupancy_active_color: "#b8f5c2",
  occupancy_vacant_color: "#f4f3ec",
  occupancy_unknown_color: "#ffcc80",
  quick_action_size: 38,
  quick_action_icon_size: 20,
  section_action_size: 44,
  section_action_icon_size: 22,
  category_gap: 12,
};

export const OVERVIEW_DEFAULT_CONFIG: AreaBubbleOverviewCardConfig = {
  type: OVERVIEW_CARD_TYPE,
  target_icon: "",
  language: "auto",
  rtl: "auto",
  show_header: true,
  show_floor_header: true,
  show_temperature: true,
  show_occupancy: true,
  show_quick_actions: true,
  show_area_expand_button: true,
  show_empty_sections: false,
  default_expanded: false,
  floor_default_expanded: true,
  remember_expanded_state: true,
  section_order: OVERVIEW_SECTIONS,
  section_styles: {},
  section_action_mode: "dual",
  section_action_icons: SECTION_ACTION_ICONS,
  quick_actions: OVERVIEW_QUICK_ACTIONS,
  quick_action_icons: {},
  area_order: [],
  floor_heating_labels: ["floor_heating", "underfloor_heating"],
  floor_heating_entities: [],
  occupancy_device_classes: ["occupancy", "presence", "motion"],
  include_entities: {},
  exclude_entities: [],
  protected_labels: ["always_on", "critical", "infrastructure", "no_turn_off"],
  protected_entities: [],
  area_overrides: {},
  entity_overrides: {},
  style: OVERVIEW_DEFAULT_STYLE,
  debug: false,
};
