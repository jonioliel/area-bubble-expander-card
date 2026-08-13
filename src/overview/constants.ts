import type {
  AreaBubbleOverviewCardConfig,
  OverviewQuickActionId,
  OverviewSectionId,
  OverviewStyleConfig,
} from "./types";

export const OVERVIEW_CARD_TYPE = "custom:area-bubble-overview-card";
export const OVERVIEW_CARD_TAG = "area-bubble-overview-card";
export const OVERVIEW_EDITOR_TAG = "area-bubble-overview-card-editor";
export const OVERVIEW_STORAGE_PREFIX = "area-bubble-overview-card";

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

export const OVERVIEW_DEFAULT_STYLE: Required<OverviewStyleConfig> = {
  border_radius: 26,
  blur: 18,
  section_gap: 12,
  row_height: 56,
  show_shadows: true,
  shadow_intensity: 0.2,
  accent_color: "var(--primary-color)",
  row_background: "rgba(255,255,255,0.075)",
  active_color: "var(--state-active-color, #ffc107)",
  climate_color: "var(--state-climate-cool-color, #2196f3)",
  cover_color: "var(--state-cover-active-color, #00bcd4)",
  media_color: "var(--state-media-player-active-color, #9c27b0)",
};

export const OVERVIEW_DEFAULT_CONFIG: AreaBubbleOverviewCardConfig = {
  type: OVERVIEW_CARD_TYPE,
  language: "auto",
  rtl: "auto",
  show_header: true,
  show_floor_header: true,
  show_temperature: true,
  show_occupancy: true,
  show_quick_actions: true,
  show_empty_sections: false,
  default_expanded: false,
  remember_expanded_state: true,
  section_order: OVERVIEW_SECTIONS,
  quick_actions: OVERVIEW_QUICK_ACTIONS,
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
