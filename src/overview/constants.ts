import type {
  AreaBubbleOverviewCardConfig,
  OverviewQuickActionId,
  OverviewSectionActionIcons,
  OverviewSectionId,
  OverviewStyleConfig,
  OverviewThemeMode,
  OverviewThemePreset,
} from "./types";

export const OVERVIEW_CARD_TYPE = "custom:area-bubble-overview-card";
export const OVERVIEW_CARD_TAG = "area-bubble-overview-card";
export const OVERVIEW_EDITOR_TAG = "area-bubble-overview-card-editor";
export const OVERVIEW_STORAGE_PREFIX = "area-bubble-overview-card";
export const AUTO_FAN_GROUP = "__area_bubble_auto_fans__";
export const AUTO_FLOOR_HEATING_GROUP = "__area_bubble_auto_floor_heating_controls__";

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

export const COVER_FEATURES = {
  OPEN: 1,
  CLOSE: 2,
  SET_POSITION: 4,
  STOP: 8,
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
  on: "mdi:power",
  off: "mdi:power-off",
  open: "mdi:window-shutter-open",
  close: "mdi:window-shutter",
};

type ThemeFamilySpec = {
  accent: string;
  deep: string;
  secondary: string;
};

const mixHex = (foreground: string, background: string, weight: number): string => {
  const channels = (value: string) => [1, 3, 5].map((index) => Number.parseInt(value.slice(index, index + 2), 16));
  const foregroundChannels = channels(foreground);
  const backgroundChannels = channels(background);
  return `#${foregroundChannels.map((channel, index) => Math.round(channel * weight + backgroundChannels[index] * (1 - weight))
    .toString(16)
    .padStart(2, "0")).join("")}`;
};

const gradient = (first: string, second: string, angle = 135): string =>
  `linear-gradient(${angle}deg, ${first} 0%, ${second} 100%)`;

const themePalette = (family: ThemeFamilySpec, mode: Exclude<OverviewThemeMode, "recommended">): Partial<OverviewStyleConfig> => {
  const dark = mode === "dark";
  const controlSurface = dark
    ? mixHex(family.deep, "#070e1a", 0.12)
    : mixHex(family.deep, "#0a1424", 0.18);
  const activeFirst = dark
    ? mixHex(family.accent, "#132034", 0.2)
    : mixHex(family.accent, "#ffffff", 0.1);
  const activeSecond = dark
    ? mixHex(family.accent, "#18273d", 0.28)
    : mixHex(family.accent, "#ffffff", 0.2);
  const entitySurface = dark
    ? mixHex(family.accent, "#060d18", 0.67)
    : mixHex(family.accent, "#ffffff", 0.5);
  return {
    border_radius: dark ? 24 : 26,
    blur: dark ? 24 : 18,
    show_shadows: true,
    shadow_intensity: dark ? 0.32 : 0.15,
    card_transparent: false,
    card_background: dark
      ? gradient(mixHex(family.accent, "#080f1d", 0.07), mixHex(family.secondary, "#17243a", 0.13), 145)
      : gradient(mixHex(family.accent, "#ffffff", 0.04), mixHex(family.secondary, "#edf2f7", 0.1), 145),
    row_background: dark
      ? mixHex(family.accent, "#17243a", 0.11)
      : mixHex(family.accent, "#ffffff", 0.065),
    active_surface: gradient(activeFirst, activeSecond),
    entity_active_surface: entitySurface,
    area_frame_color: dark
      ? mixHex(family.accent, "#ffffff", 0.74)
      : mixHex(family.deep, "#334155", 0.72),
    active_color: dark ? "#f5c451" : "#e4ad2f",
    accent_color: dark ? mixHex(family.accent, "#ffffff", 0.78) : family.deep,
    control_surface: controlSurface,
    climate_surface: dark
      ? gradient(mixHex("#2f83bd", "#17243a", 0.38), mixHex(family.accent, "#1b2c44", 0.32))
      : gradient(mixHex("#4aa8db", "#ffffff", 0.3), mixHex(family.accent, "#ffffff", 0.24)),
    climate_color: dark ? "#78c9ef" : "#1d719e",
    cover_color: dark ? mixHex(family.secondary, "#ffffff", 0.72) : mixHex(family.secondary, "#1f5164", 0.68),
    media_color: dark ? mixHex(family.secondary, "#ffffff", 0.72) : family.secondary,
    temperature_off_surface: gradient(controlSurface, mixHex(family.deep, "#17243a", 0.18)),
    temperature_cool_surface: dark
      ? gradient("#1d5e8e", "#2f7fad")
      : gradient("#2f73ac", "#4797c5"),
    temperature_heat_surface: dark
      ? gradient("#8f4639", "#b4614d")
      : gradient("#aa543d", "#ce785a"),
    temperature_active_surface: dark
      ? gradient(mixHex(family.secondary, "#2b2440", 0.55), mixHex(family.secondary, "#4a3c64", 0.64))
      : gradient(mixHex(family.secondary, "#ffffff", 0.68), mixHex(family.secondary, "#ffffff", 0.82)),
    occupancy_active_color: dark ? "#91e7b7" : "#a7efc8",
    occupancy_vacant_color: dark ? "#e2e8f0" : "#f4f7fb",
    occupancy_unknown_color: dark ? "#f5cf78" : "#f4cd72",
    primary_text_color: dark ? "#f3f7fb" : "#172033",
    secondary_text_color: dark ? "#b6c4d4" : "#536174",
    active_text_color: dark ? "#f7fbff" : "#172033",
    control_text_color: "#f8fafc",
  };
};

const THEME_FAMILIES: Record<OverviewThemePreset, ThemeFamilySpec> = {
  classic: { accent: "#5b7c9c", deep: "#2b4968", secondary: "#7a668f" },
  elegant: { accent: "#55799f", deep: "#304e70", secondary: "#725e91" },
  light: { accent: "#2d8db5", deep: "#176b91", secondary: "#7c64a8" },
  dark: { accent: "#4f8da3", deep: "#315d71", secondary: "#7768a3" },
  modern: { accent: "#557f73", deep: "#365e54", secondary: "#806a8f" },
  ocean: { accent: "#0ea5c6", deep: "#076d8a", secondary: "#2f7fb0" },
  emerald: { accent: "#20a66a", deep: "#146a48", secondary: "#318f82" },
  violet: { accent: "#8067d8", deep: "#5541a8", secondary: "#a45896" },
  coral: { accent: "#df705b", deep: "#9f493d", secondary: "#a85d75" },
  amber: { accent: "#d69b27", deep: "#8f620e", secondary: "#a36e48" },
  rose: { accent: "#d65f89", deep: "#963c61", secondary: "#9365a9" },
  champagne_emerald: { accent: "#3d806d", deep: "#173d35", secondary: "#b58b4e" },
  arctic_cobalt: { accent: "#3f79c9", deep: "#183f75", secondary: "#4a91aa" },
  sage_jade: { accent: "#4d876f", deep: "#244c3d", secondary: "#78906b" },
  violet_indigo: { accent: "#765fc5", deep: "#3f3479", secondary: "#9b6c9e" },
  coral_teal: { accent: "#cf6e63", deep: "#723d3a", secondary: "#348b88" },
};

export const OVERVIEW_LEGACY_THEME_NAMES: OverviewThemePreset[] = [
  "classic",
  "elegant",
  "light",
  "dark",
  "modern",
  "ocean",
  "emerald",
  "violet",
  "coral",
  "amber",
  "rose",
];

export const OVERVIEW_NEW_THEME_NAMES: OverviewThemePreset[] = [
  "champagne_emerald",
  "arctic_cobalt",
  "sage_jade",
  "violet_indigo",
  "coral_teal",
];

export const OVERVIEW_THEME_NAMES: OverviewThemePreset[] = [
  ...OVERVIEW_LEGACY_THEME_NAMES,
  ...OVERVIEW_NEW_THEME_NAMES,
];

const COMPACT_THEME_LAYOUT: Partial<OverviewStyleConfig> = {
  border_radius: 22,
  blur: 22,
  section_gap: 6,
  category_gap: 9,
  row_height: 48,
  area_name_size: 15,
  quick_action_size: 32,
  quick_action_icon_size: 17,
  area_frame_width: 1,
  entity_frame_width: 1,
  show_shadows: true,
  shadow_intensity: 0.11,
};

const compactThemeVariant = (
  family: ThemeFamilySpec,
  mode: Exclude<OverviewThemeMode, "recommended">,
): Partial<OverviewStyleConfig> => ({
  ...themePalette(family, mode),
  entity_active_surface: mode === "dark"
    ? mixHex(family.accent, "#060d18", 0.72)
    : mixHex(family.accent, "#ffffff", 0.58),
  ...COMPACT_THEME_LAYOUT,
});

export const OVERVIEW_THEME_PRESETS: Record<OverviewThemePreset, Partial<OverviewStyleConfig>> = {
  classic: {},
  elegant: {
    border_radius: 26,
    blur: 20,
    show_shadows: true,
    shadow_intensity: 0.18,
    card_transparent: false,
    card_background: "linear-gradient(145deg, rgba(249,251,253,0.98) 0%, rgba(232,238,246,0.97) 55%, rgba(219,229,241,0.95) 100%)",
    row_background: "rgba(242,245,249,0.96)",
    active_surface: "linear-gradient(135deg, #edf3f8 0%, #dbe7f0 100%)",
    entity_active_surface: "#8fb7d2",
    area_frame_color: "#526b86",
    active_color: "#d8a62c",
    accent_color: "#55799f",
    control_surface: "#182a43",
    climate_surface: "linear-gradient(135deg, #bfd7f3 0%, #a9c6ea 100%)",
    climate_color: "#2f6fa7",
    cover_color: "#397f8c",
    media_color: "#725e91",
    temperature_off_surface: "linear-gradient(135deg, #182a43 0%, #243d5b 100%)",
    temperature_cool_surface: "linear-gradient(135deg, #2f6fa7 0%, #438cc0 100%)",
    temperature_heat_surface: "linear-gradient(135deg, #a9573e 0%, #c97658 100%)",
    temperature_active_surface: "linear-gradient(135deg, #62547f 0%, #7c6c9e 100%)",
    occupancy_active_color: "#b9e8cf",
    occupancy_vacant_color: "#f4f6f8",
    occupancy_unknown_color: "#f3cc78",
    primary_text_color: "#172033",
    secondary_text_color: "#526174",
    active_text_color: "#172033",
    control_text_color: "#f8fafc",
  },
  light: {
    border_radius: 28,
    blur: 16,
    show_shadows: true,
    shadow_intensity: 0.12,
    card_transparent: false,
    card_background: "linear-gradient(145deg, rgba(255,255,255,0.99) 0%, rgba(240,248,253,0.98) 58%, rgba(227,241,249,0.96) 100%)",
    row_background: "rgba(248,251,253,0.98)",
    active_surface: "linear-gradient(135deg, #eefbfe 0%, #d8f0f7 100%)",
    entity_active_surface: "#73c7df",
    area_frame_color: "#5b8fa3",
    active_color: "#e6ad25",
    accent_color: "#2d8db5",
    control_surface: "#12324a",
    climate_surface: "linear-gradient(135deg, #cde8ff 0%, #afd8f5 100%)",
    climate_color: "#2482b4",
    cover_color: "#238fa0",
    media_color: "#7c64a8",
    temperature_off_surface: "linear-gradient(135deg, #12324a 0%, #1b4b66 100%)",
    temperature_cool_surface: "linear-gradient(135deg, #2789bd 0%, #46a6d2 100%)",
    temperature_heat_surface: "linear-gradient(135deg, #ce6545 0%, #e48a64 100%)",
    temperature_active_surface: "linear-gradient(135deg, #7365ad 0%, #9185c7 100%)",
    occupancy_active_color: "#aeeac6",
    occupancy_vacant_color: "#ffffff",
    occupancy_unknown_color: "#f6c968",
    primary_text_color: "#10233c",
    secondary_text_color: "#53677c",
    active_text_color: "#10233c",
    control_text_color: "#ffffff",
  },
  dark: {
    border_radius: 24,
    blur: 24,
    show_shadows: true,
    shadow_intensity: 0.34,
    card_transparent: false,
    card_background: "linear-gradient(145deg, rgba(12,20,34,0.98) 0%, rgba(23,34,51,0.97) 56%, rgba(31,44,63,0.96) 100%)",
    row_background: "rgba(34,47,65,0.96)",
    active_surface: "linear-gradient(135deg, #263e50 0%, #315066 100%)",
    entity_active_surface: "#1c667b",
    area_frame_color: "#65a9bd",
    active_color: "#f0bd4f",
    accent_color: "#70b7cf",
    control_surface: "#080f1d",
    climate_surface: "linear-gradient(135deg, #244f78 0%, #355f8d 100%)",
    climate_color: "#69b8e6",
    cover_color: "#62c5cf",
    media_color: "#b39ae5",
    temperature_off_surface: "linear-gradient(135deg, #080f1d 0%, #17253b 100%)",
    temperature_cool_surface: "linear-gradient(135deg, #1f6597 0%, #2f82b2 100%)",
    temperature_heat_surface: "linear-gradient(135deg, #934b3e 0%, #b7634f 100%)",
    temperature_active_surface: "linear-gradient(135deg, #574a7e 0%, #7664a2 100%)",
    occupancy_active_color: "#8ee0b1",
    occupancy_vacant_color: "#d3dde8",
    occupancy_unknown_color: "#f0c66b",
    primary_text_color: "#f1f5f9",
    secondary_text_color: "#aebdcd",
    active_text_color: "#f3fbff",
    control_text_color: "#f8fafc",
  },
  modern: {
    border_radius: 22,
    blur: 18,
    show_shadows: true,
    shadow_intensity: 0.16,
    card_transparent: false,
    card_background: "linear-gradient(145deg, rgba(250,249,245,0.99) 0%, rgba(237,242,236,0.97) 55%, rgba(225,234,228,0.96) 100%)",
    row_background: "rgba(244,246,241,0.97)",
    active_surface: "linear-gradient(135deg, #ebf3ef 0%, #d7e5de 100%)",
    entity_active_surface: "#8cb9aa",
    area_frame_color: "#5c7b72",
    active_color: "#d6a43a",
    accent_color: "#557f73",
    control_surface: "#263b37",
    climate_surface: "linear-gradient(135deg, #c9e2df 0%, #afcfcc 100%)",
    climate_color: "#3b7d83",
    cover_color: "#4a8990",
    media_color: "#806a8f",
    temperature_off_surface: "linear-gradient(135deg, #263b37 0%, #36534c 100%)",
    temperature_cool_surface: "linear-gradient(135deg, #3c7e91 0%, #5599a8 100%)",
    temperature_heat_surface: "linear-gradient(135deg, #a85e45 0%, #c47a5d 100%)",
    temperature_active_surface: "linear-gradient(135deg, #6c5d7c 0%, #89749a 100%)",
    occupancy_active_color: "#a8e0bd",
    occupancy_vacant_color: "#f2f1eb",
    occupancy_unknown_color: "#e8bd67",
    primary_text_color: "#183029",
    secondary_text_color: "#5a6d65",
    active_text_color: "#183029",
    control_text_color: "#f7faf8",
  },
  ocean: themePalette(THEME_FAMILIES.ocean, "light"),
  emerald: themePalette(THEME_FAMILIES.emerald, "light"),
  violet: themePalette(THEME_FAMILIES.violet, "light"),
  coral: themePalette(THEME_FAMILIES.coral, "light"),
  amber: themePalette(THEME_FAMILIES.amber, "light"),
  rose: themePalette(THEME_FAMILIES.rose, "light"),
  champagne_emerald: {
    ...compactThemeVariant(THEME_FAMILIES.champagne_emerald, "light"),
    card_background: "linear-gradient(145deg, rgba(255,255,252,0.82) 0%, rgba(247,242,231,0.76) 56%, rgba(232,240,234,0.72) 100%)",
    row_background: "rgba(252,250,245,0.82)",
    active_surface: "linear-gradient(125deg, #edf4ee 0%, #dceadf 100%)",
    entity_active_surface: "#8fc9b0",
    area_frame_color: "#607f71",
    accent_color: "#3d806d",
    control_surface: "#173d35",
    climate_surface: "linear-gradient(125deg, #c9e5df 0%, #acd5cb 100%)",
    climate_color: "#397d80",
    cover_color: "#4a8580",
    media_color: "#8a6a91",
    temperature_off_surface: "linear-gradient(125deg, #e7e9e5 0%, #d8ded9 100%)",
    temperature_cool_surface: "linear-gradient(125deg, #4e91ad 0%, #6cadc3 100%)",
    temperature_heat_surface: "linear-gradient(125deg, #bb654f 0%, #d6876e 100%)",
    temperature_active_surface: "linear-gradient(125deg, #4e796f 0%, #6c988c 100%)",
    primary_text_color: "#142720",
    secondary_text_color: "#5b6962",
    active_text_color: "#142720",
    control_text_color: "#f8fbf9",
  },
  arctic_cobalt: {
    ...compactThemeVariant(THEME_FAMILIES.arctic_cobalt, "light"),
    card_background: "linear-gradient(145deg, rgba(252,254,255,0.84) 0%, rgba(239,246,252,0.78) 58%, rgba(224,236,248,0.72) 100%)",
    row_background: "rgba(247,251,255,0.84)",
    active_surface: "linear-gradient(125deg, #e7f1fa 0%, #d4e5f5 100%)",
    entity_active_surface: "#91bce2",
    area_frame_color: "#55789f",
    accent_color: "#3f79c9",
    control_surface: "#183f75",
    climate_surface: "linear-gradient(125deg, #c8e1fa 0%, #a9d0f2 100%)",
    climate_color: "#347dc1",
    cover_color: "#398a9b",
    media_color: "#6d68a7",
    temperature_off_surface: "linear-gradient(125deg, #e5eaf0 0%, #d5dde6 100%)",
    temperature_cool_surface: "linear-gradient(125deg, #397fbe 0%, #5b9fd5 100%)",
    temperature_heat_surface: "linear-gradient(125deg, #bb604b 0%, #da8265 100%)",
    temperature_active_surface: "linear-gradient(125deg, #5e6fb1 0%, #7d8dc9 100%)",
    primary_text_color: "#102640",
    secondary_text_color: "#52677e",
    active_text_color: "#102640",
    control_text_color: "#f8fbff",
  },
  sage_jade: {
    ...compactThemeVariant(THEME_FAMILIES.sage_jade, "light"),
    card_background: "linear-gradient(145deg, rgba(253,253,248,0.84) 0%, rgba(240,244,236,0.78) 56%, rgba(226,236,228,0.72) 100%)",
    row_background: "rgba(248,249,243,0.84)",
    active_surface: "linear-gradient(125deg, #eef3e9 0%, #dce8dd 100%)",
    entity_active_surface: "#9fcdb5",
    area_frame_color: "#667f70",
    accent_color: "#4d876f",
    control_surface: "#244c3d",
    climate_surface: "linear-gradient(125deg, #cce5db 0%, #b2d5c7 100%)",
    climate_color: "#4c8482",
    cover_color: "#548b86",
    media_color: "#7d728e",
    temperature_off_surface: "linear-gradient(125deg, #e8ebe5 0%, #d9dfd8 100%)",
    temperature_cool_surface: "linear-gradient(125deg, #4e899c 0%, #6ca8b4 100%)",
    temperature_heat_surface: "linear-gradient(125deg, #ae644e 0%, #cc8268 100%)",
    temperature_active_surface: "linear-gradient(125deg, #5f806e 0%, #7b9d89 100%)",
    primary_text_color: "#1b2e25",
    secondary_text_color: "#5d6d63",
    active_text_color: "#1b2e25",
    control_text_color: "#f8fbf9",
  },
  violet_indigo: {
    ...compactThemeVariant(THEME_FAMILIES.violet_indigo, "light"),
    card_background: "linear-gradient(145deg, rgba(254,252,255,0.84) 0%, rgba(244,240,250,0.78) 56%, rgba(232,228,245,0.72) 100%)",
    row_background: "rgba(250,248,253,0.84)",
    active_surface: "linear-gradient(125deg, #f1eef9 0%, #e3def2 100%)",
    entity_active_surface: "#b8a9e2",
    area_frame_color: "#6f6498",
    accent_color: "#765fc5",
    control_surface: "#3f3479",
    climate_surface: "linear-gradient(125deg, #d8d0f1 0%, #c1b5e6 100%)",
    climate_color: "#6571b9",
    cover_color: "#5c8e9a",
    media_color: "#8e5d99",
    temperature_off_surface: "linear-gradient(125deg, #e9e7ed 0%, #dcd8e4 100%)",
    temperature_cool_surface: "linear-gradient(125deg, #557db7 0%, #7499cb 100%)",
    temperature_heat_surface: "linear-gradient(125deg, #b45f55 0%, #d07e70 100%)",
    temperature_active_surface: "linear-gradient(125deg, #725fa8 0%, #9281c0 100%)",
    primary_text_color: "#251e43",
    secondary_text_color: "#625b75",
    active_text_color: "#251e43",
    control_text_color: "#fbf9ff",
  },
  coral_teal: {
    ...compactThemeVariant(THEME_FAMILIES.coral_teal, "light"),
    card_background: "linear-gradient(145deg, rgba(255,253,251,0.84) 0%, rgba(253,241,237,0.78) 56%, rgba(235,245,243,0.72) 100%)",
    row_background: "rgba(253,249,247,0.84)",
    active_surface: "linear-gradient(125deg, #fff0eb 0%, #f8ded6 100%)",
    entity_active_surface: "#efad9f",
    area_frame_color: "#957069",
    accent_color: "#cf6e63",
    control_surface: "#254f4e",
    climate_surface: "linear-gradient(125deg, #cae7e3 0%, #a9d7d2 100%)",
    climate_color: "#348b88",
    cover_color: "#3f9291",
    media_color: "#916178",
    temperature_off_surface: "linear-gradient(125deg, #ece8e6 0%, #dfd9d6 100%)",
    temperature_cool_surface: "linear-gradient(125deg, #438c9d 0%, #64aab5 100%)",
    temperature_heat_surface: "linear-gradient(125deg, #c96859 0%, #e28975 100%)",
    temperature_active_surface: "linear-gradient(125deg, #4f8582 0%, #6fa29d 100%)",
    primary_text_color: "#3a211d",
    secondary_text_color: "#735f5a",
    active_text_color: "#3a211d",
    control_text_color: "#fbfafa",
  },
};

export const OVERVIEW_THEME_VARIANTS: Record<
  OverviewThemePreset,
  Record<Exclude<OverviewThemeMode, "recommended">, Partial<OverviewStyleConfig>>
> = Object.fromEntries(
  OVERVIEW_THEME_NAMES.map((preset) => [preset, {
    light: OVERVIEW_NEW_THEME_NAMES.includes(preset)
      ? compactThemeVariant(THEME_FAMILIES[preset], "light")
      : themePalette(THEME_FAMILIES[preset], "light"),
    dark: OVERVIEW_NEW_THEME_NAMES.includes(preset)
      ? compactThemeVariant(THEME_FAMILIES[preset], "dark")
      : themePalette(THEME_FAMILIES[preset], "dark"),
  }]),
) as Record<OverviewThemePreset, Record<"light" | "dark", Partial<OverviewStyleConfig>>>;

export const overviewThemePalette = (
  preset: OverviewThemePreset,
  mode: OverviewThemeMode,
): Partial<OverviewStyleConfig> => mode === "recommended"
  ? OVERVIEW_THEME_PRESETS[preset]
  : OVERVIEW_THEME_VARIANTS[preset][mode];

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
  primary_text_color: "var(--primary-text-color)",
  secondary_text_color: "var(--secondary-text-color)",
  active_text_color: "#111827",
  control_text_color: "#f4f3ec",
  active_color: "var(--state-active-color, #ffd54f)",
  active_surface: "rgba(174, 215, 219, 0.94)",
  entity_active_surface: "#7fb8c1",
  area_frame_color: "",
  area_frame_width: 2,
  entity_frame_color: "",
  entity_frame_width: 1,
  climate_tag_gap: 0,
  link_section_frame_color: false,
  section_frame_brightness: 12,
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
  theme_preset: "classic",
  theme_mode: "recommended",
  show_header: true,
  show_floor_header: true,
  show_temperature: true,
  hide_temperature_when_climate_off: false,
  show_occupancy: true,
  show_quick_actions: true,
  show_area_expand_button: true,
  show_floor_expand_button: true,
  area_open_mode: "expander",
  quick_actions_position: "opposite",
  climate_tag_position: "left",
  show_fan_tag: true,
  strip_area_name_from_entity_names: true,
  entity_state_language: "auto",
  light_tile_shape: "rectangle",
  light_icon_position: "start",
  light_show_state: true,
  entity_card_size: "medium",
  subgroup_titles: {},
  fan_display_mode: "subgroup",
  heating_controls_display_mode: "subgroup",
  show_empty_sections: false,
  default_expanded: false,
  floor_default_expanded: true,
  remember_expanded_state: true,
  section_order: OVERVIEW_SECTIONS,
  section_styles: {},
  section_action_mode: "dual",
  section_action_presentation: "icon",
  climate_mode_presentation: "both",
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
