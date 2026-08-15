import { OVERVIEW_CARD_TYPE, OVERVIEW_DEFAULT_CONFIG, OVERVIEW_DEFAULT_STYLE, OVERVIEW_SECTIONS, OVERVIEW_THEME_PRESETS, QUICK_ACTION_ICONS, SECTION_ACTION_ICONS } from "./constants";
import type {
  AreaBubbleOverviewCardConfig,
  OverviewAutomaticSubgroupId,
  OverviewAreaOverride,
  OverviewControlPresentation,
  OverviewEntityCardSize,
  OverviewEntityOverride,
  OverviewSectionActionIcons,
  OverviewSectionBorderStyle,
  OverviewSectionId,
  OverviewSectionStyle,
  OverviewStateLanguage,
  OverviewTileIconPosition,
  OverviewTileShape,
  OverviewThemePreset,
  ResolvedOverviewConfig,
} from "./types";
import type { OverviewQuickActionId } from "./types";

const isRecord = (value: unknown): value is Record<string, unknown> => Boolean(value) && typeof value === "object" && !Array.isArray(value);
const stringArray = (value: unknown): string[] =>
  Array.isArray(value) ? value.map(String).map((item) => item.trim()).filter(Boolean) : [];

const sectionArray = (value: unknown): OverviewSectionId[] => {
  const allowed = new Set<OverviewSectionId>(OVERVIEW_SECTIONS);
  const chosen = stringArray(value).filter((item): item is OverviewSectionId => allowed.has(item as OverviewSectionId));
  return [...new Set([...chosen, ...OVERVIEW_SECTIONS])];
};

const sectionLists = (value: unknown): Partial<Record<OverviewSectionId, string[]>> => {
  if (!isRecord(value)) return {};
  const result: Partial<Record<OverviewSectionId, string[]>> = {};
  for (const section of OVERVIEW_SECTIONS) {
    const values = stringArray(value[section]);
    if (values.length) result[section] = values;
  }
  return result;
};

const sectionTitles = (value: unknown): Partial<Record<OverviewSectionId, string>> => {
  if (!isRecord(value)) return {};
  const result: Partial<Record<OverviewSectionId, string>> = {};
  for (const section of OVERVIEW_SECTIONS) {
    if (typeof value[section] === "string") result[section] = value[section];
  }
  return result;
};

const subgroupTitles = (value: unknown): Partial<Record<OverviewAutomaticSubgroupId, string>> => {
  if (!isRecord(value)) return {};
  const result: Partial<Record<OverviewAutomaticSubgroupId, string>> = {};
  for (const key of ["fans", "heating_controls"] as const) {
    if (typeof value[key] === "string" && value[key].trim()) result[key] = value[key].trim();
  }
  return result;
};

const sectionStyles = (value: unknown): Partial<Record<OverviewSectionId, OverviewSectionStyle>> => {
  if (!isRecord(value)) return {};
  const result: Partial<Record<OverviewSectionId, OverviewSectionStyle>> = {};
  for (const section of OVERVIEW_SECTIONS) {
    const raw = value[section];
    if (!isRecord(raw)) continue;
    const background = typeof raw.background === "string" ? raw.background.trim() : "";
    const borderColor = typeof raw.border_color === "string" ? raw.border_color.trim() : "";
    const borderWidth = typeof raw.border_width === "number" && Number.isFinite(raw.border_width)
      ? Math.min(8, Math.max(0, raw.border_width))
      : undefined;
    const borderStyles = new Set<OverviewSectionBorderStyle>(["solid", "dashed", "dotted"]);
    const borderStyle = typeof raw.border_style === "string" && borderStyles.has(raw.border_style as OverviewSectionBorderStyle)
      ? raw.border_style as OverviewSectionBorderStyle
      : undefined;
    const columns = typeof raw.columns === "number" && Number.isFinite(raw.columns)
      ? Math.min(section === "covers" ? 2 : 3, Math.max(1, Math.round(raw.columns))) as 1 | 2 | 3
      : undefined;
    const entityHeight = typeof raw.entity_height === "number" && Number.isFinite(raw.entity_height)
      ? Math.min(140, Math.max(44, raw.entity_height))
      : undefined;
    const actionPresentations = new Set<OverviewControlPresentation>(["icon", "text", "both"]);
    const actionPresentation = typeof raw.action_presentation === "string" && actionPresentations.has(raw.action_presentation as OverviewControlPresentation)
      ? raw.action_presentation as OverviewControlPresentation
      : undefined;
    result[section] = {
      ...(background ? { background } : {}),
      ...(borderColor ? { border_color: borderColor } : {}),
      ...(borderWidth !== undefined ? { border_width: borderWidth } : {}),
      ...(borderStyle ? { border_style: borderStyle } : {}),
      ...(typeof raw.show_border === "boolean" ? { show_border: raw.show_border } : {}),
      ...(columns !== undefined ? { columns } : {}),
      ...(entityHeight !== undefined ? { entity_height: entityHeight } : {}),
      ...(actionPresentation ? { action_presentation: actionPresentation } : {}),
    };
  }
  return result;
};

const sectionActionIcons = (value: unknown): Required<OverviewSectionActionIcons> => {
  const raw = isRecord(value) ? value : {};
  return Object.fromEntries(
    (Object.keys(SECTION_ACTION_ICONS) as Array<keyof OverviewSectionActionIcons>).map((key) => {
      const custom = typeof raw[key] === "string" ? raw[key].trim() : "";
      return [key, custom || SECTION_ACTION_ICONS[key]];
    }),
  ) as Required<OverviewSectionActionIcons>;
};

const quickActionArray = (value: unknown): OverviewQuickActionId[] => {
  const allowed = new Set<OverviewQuickActionId>(["lights", "climate", "floor_heating", "switches", "covers", "media"]);
  return [...new Set(stringArray(value).filter((item): item is OverviewQuickActionId => allowed.has(item as OverviewQuickActionId)))];
};

const quickActionIcons = (value: unknown): Record<OverviewQuickActionId, string> => {
  const raw = isRecord(value) ? value : {};
  return Object.fromEntries(
    (Object.keys(QUICK_ACTION_ICONS) as OverviewQuickActionId[]).map((action) => {
      const custom = typeof raw[action] === "string" ? raw[action].trim() : "";
      return [action, custom || QUICK_ACTION_ICONS[action]];
    }),
  ) as Record<OverviewQuickActionId, string>;
};

const areaOverrides = (value: unknown): Record<string, OverviewAreaOverride> => {
  if (!isRecord(value)) return {};
  const result: Record<string, OverviewAreaOverride> = {};
  for (const [areaId, raw] of Object.entries(value)) {
    if (!isRecord(raw)) continue;
    const entityCardSizes = new Set<OverviewEntityCardSize>(["compact", "medium", "wide"]);
    result[areaId] = {
      ...(typeof raw.name === "string" && raw.name.trim() ? { name: raw.name.trim() } : {}),
      ...(typeof raw.icon === "string" && raw.icon.trim() ? { icon: raw.icon.trim() } : {}),
      ...(typeof raw.parent_area === "string" && raw.parent_area.trim() ? { parent_area: raw.parent_area.trim() } : {}),
      ...(typeof raw.show_when_parent_collapsed === "boolean"
        ? { show_when_parent_collapsed: raw.show_when_parent_collapsed }
        : {}),
      ...(typeof raw.hidden === "boolean" ? { hidden: raw.hidden } : {}),
      ...(typeof raw.default_expanded === "boolean" ? { default_expanded: raw.default_expanded } : {}),
      ...(raw.open_mode === "expander" || raw.open_mode === "popup" ? { open_mode: raw.open_mode } : {}),
      ...(typeof raw.temperature_entity === "string" && raw.temperature_entity.trim() ? { temperature_entity: raw.temperature_entity.trim() } : {}),
      ...(typeof raw.occupancy_count_entity === "string" && raw.occupancy_count_entity.trim()
        ? { occupancy_count_entity: raw.occupancy_count_entity.trim() }
        : {}),
      occupancy_entities: stringArray(raw.occupancy_entities),
      ...(Array.isArray(raw.section_order) ? { section_order: sectionArray(raw.section_order) } : {}),
      ...(Array.isArray(raw.subarea_order) ? { subarea_order: stringArray(raw.subarea_order) } : {}),
      subgroup_titles: subgroupTitles(raw.subgroup_titles),
      ...(typeof raw.entity_card_size === "string" && entityCardSizes.has(raw.entity_card_size as OverviewEntityCardSize)
        ? { entity_card_size: raw.entity_card_size as OverviewEntityCardSize }
        : {}),
      section_titles: sectionTitles(raw.section_titles),
      section_styles: sectionStyles(raw.section_styles),
      entity_order: sectionLists(raw.entity_order),
      include_entities: sectionLists(raw.include_entities),
      exclude_entities: stringArray(raw.exclude_entities),
    };
  }
  return result;
};

const entityOverrides = (value: unknown): Record<string, OverviewEntityOverride> => {
  if (!isRecord(value)) return {};
  const allowed = new Set<string>(OVERVIEW_SECTIONS);
  const result: Record<string, OverviewEntityOverride> = {};
  const tileShapes = new Set<OverviewTileShape>(["rectangle", "square"]);
  const iconPositions = new Set<OverviewTileIconPosition>(["start", "left", "right", "center"]);
  const stateLanguages = new Set<OverviewStateLanguage>(["auto", "he", "en"]);
  for (const [entityId, raw] of Object.entries(value)) {
    if (!isRecord(raw)) continue;
    result[entityId] = {
      ...(typeof raw.name === "string" && raw.name.trim() ? { name: raw.name.trim() } : {}),
      ...(typeof raw.strip_area_name === "boolean" ? { strip_area_name: raw.strip_area_name } : {}),
      ...(typeof raw.icon === "string" && raw.icon.trim() ? { icon: raw.icon.trim() } : {}),
      ...(typeof raw.section === "string" && allowed.has(raw.section) ? { section: raw.section as OverviewSectionId } : {}),
      ...(typeof raw.group === "string" && raw.group.trim() ? { group: raw.group.trim() } : {}),
      ...(typeof raw.hidden === "boolean" ? { hidden: raw.hidden } : {}),
      ...(typeof raw.protected === "boolean" ? { protected: raw.protected } : {}),
      ...(typeof raw.ignore_activity === "boolean" ? { ignore_activity: raw.ignore_activity } : {}),
      ...(typeof raw.tile_shape === "string" && tileShapes.has(raw.tile_shape as OverviewTileShape) ? { tile_shape: raw.tile_shape as OverviewTileShape } : {}),
      ...(typeof raw.icon_position === "string" && iconPositions.has(raw.icon_position as OverviewTileIconPosition) ? { icon_position: raw.icon_position as OverviewTileIconPosition } : {}),
      ...(typeof raw.show_state === "boolean" ? { show_state: raw.show_state } : {}),
      ...(typeof raw.state_language === "string" && stateLanguages.has(raw.state_language as OverviewStateLanguage) ? { state_language: raw.state_language as OverviewStateLanguage } : {}),
    };
  }
  return result;
};

export const resolveOverviewConfig = (config: AreaBubbleOverviewCardConfig): ResolvedOverviewConfig => {
  const merged = { ...OVERVIEW_DEFAULT_CONFIG, ...config };
  const customTitles = sectionTitles(config.section_titles);
  const customStyle = isRecord(config.style) ? config.style : {};
  const themePresets = new Set<OverviewThemePreset>(["classic", "elegant", "light", "dark", "modern"]);
  const themePreset = themePresets.has(config.theme_preset as OverviewThemePreset) ? config.theme_preset! : "classic";
  const themedStyle: Record<string, unknown> = { ...OVERVIEW_THEME_PRESETS[themePreset], ...customStyle };
  const requestedAreaNameSize = themedStyle.area_name_size;
  const areaNameSize = typeof requestedAreaNameSize === "number" && Number.isFinite(requestedAreaNameSize)
    ? Math.min(24, Math.max(11, requestedAreaNameSize))
    : OVERVIEW_DEFAULT_STYLE.area_name_size;
  const cardBackground = typeof themedStyle.card_background === "string" && themedStyle.card_background.trim()
    ? themedStyle.card_background.trim()
    : OVERVIEW_DEFAULT_STYLE.card_background;
  const cardTransparent = typeof themedStyle.card_transparent === "boolean"
    ? themedStyle.card_transparent
    : OVERVIEW_DEFAULT_STYLE.card_transparent;
  const colorStyle = (key: "entity_active_surface" | "area_frame_color" | "entity_frame_color" | "occupancy_active_color" | "occupancy_vacant_color" | "occupancy_unknown_color" | "primary_text_color" | "secondary_text_color" | "active_text_color" | "control_text_color"): string => {
    const value = themedStyle[key];
    return typeof value === "string" ? value.trim() || OVERVIEW_DEFAULT_STYLE[key] : OVERVIEW_DEFAULT_STYLE[key];
  };
  const numberStyle = (key: "quick_action_size" | "quick_action_icon_size" | "section_action_size" | "section_action_icon_size" | "category_gap", min: number, max: number): number => {
    const value = themedStyle[key];
    return typeof value === "number" && Number.isFinite(value)
      ? Math.min(max, Math.max(min, value))
      : OVERVIEW_DEFAULT_STYLE[key];
  };
  const stateLanguages = new Set<OverviewStateLanguage>(["auto", "he", "en"]);
  const tileShapes = new Set<OverviewTileShape>(["rectangle", "square"]);
  const iconPositions = new Set<OverviewTileIconPosition>(["start", "left", "right", "center"]);
  const controlPresentations = new Set<OverviewControlPresentation>(["icon", "text", "both"]);
  const entityCardSizes = new Set<OverviewEntityCardSize>(["compact", "medium", "wide"]);
  return {
    ...merged,
    type: OVERVIEW_CARD_TYPE,
    id: typeof config.id === "string" ? config.id : "",
    area: typeof config.area === "string" && config.area ? config.area : undefined,
    floor: typeof config.floor === "string" && config.floor ? config.floor : undefined,
    title: typeof config.title === "string" ? config.title : "",
    target_icon: typeof config.target_icon === "string" ? config.target_icon.trim() : "",
    theme_preset: themePreset,
    show_area_expand_button:
      typeof config.show_area_expand_button === "boolean"
        ? config.show_area_expand_button
        : (OVERVIEW_DEFAULT_CONFIG.show_area_expand_button ?? true),
    show_floor_expand_button:
      typeof config.show_floor_expand_button === "boolean"
        ? config.show_floor_expand_button
        : (OVERVIEW_DEFAULT_CONFIG.show_floor_expand_button ?? true),
    area_open_mode: config.area_open_mode === "popup" ? "popup" : "expander",
    quick_actions_position: config.quick_actions_position === "near_name" ? "near_name" : "opposite",
    climate_tag_position: ["left", "right", "top", "bottom"].includes(String(config.climate_tag_position))
      ? config.climate_tag_position!
      : "left",
    show_fan_tag: typeof config.show_fan_tag === "boolean" ? config.show_fan_tag : true,
    strip_area_name_from_entity_names:
      typeof config.strip_area_name_from_entity_names === "boolean"
        ? config.strip_area_name_from_entity_names
        : (OVERVIEW_DEFAULT_CONFIG.strip_area_name_from_entity_names ?? true),
    entity_state_language: stateLanguages.has(config.entity_state_language as OverviewStateLanguage)
      ? config.entity_state_language!
      : "auto",
    light_tile_shape: tileShapes.has(config.light_tile_shape as OverviewTileShape) ? config.light_tile_shape! : "rectangle",
    light_icon_position: iconPositions.has(config.light_icon_position as OverviewTileIconPosition) ? config.light_icon_position! : "start",
    light_show_state: typeof config.light_show_state === "boolean" ? config.light_show_state : true,
    entity_card_size: entityCardSizes.has(config.entity_card_size as OverviewEntityCardSize) ? config.entity_card_size! : "medium",
    section_order: sectionArray(config.section_order),
    section_titles: Object.fromEntries(
      OVERVIEW_SECTIONS.map((section) => [section, typeof customTitles[section] === "string" ? customTitles[section] : ""]),
    ) as Record<OverviewSectionId, string>,
    section_styles: Object.fromEntries(
      OVERVIEW_SECTIONS.map((section) => [section, sectionStyles(config.section_styles)[section] ?? {}]),
    ) as Record<OverviewSectionId, OverviewSectionStyle>,
    section_action_mode: config.section_action_mode === "toggle" ? "toggle" : "dual",
    section_action_presentation: controlPresentations.has(config.section_action_presentation as OverviewControlPresentation)
      ? config.section_action_presentation!
      : "icon",
    climate_mode_presentation: controlPresentations.has(config.climate_mode_presentation as OverviewControlPresentation)
      ? config.climate_mode_presentation!
      : "both",
    section_action_icons: sectionActionIcons(config.section_action_icons),
    subgroup_titles: {
      fans: subgroupTitles(config.subgroup_titles).fans ?? "",
      heating_controls: subgroupTitles(config.subgroup_titles).heating_controls ?? "",
    },
    quick_actions: quickActionArray(config.quick_actions ?? merged.quick_actions),
    quick_action_icons: quickActionIcons(config.quick_action_icons),
    area_order: stringArray(config.area_order),
    floor_heating_labels: stringArray(merged.floor_heating_labels),
    floor_heating_entities: stringArray(merged.floor_heating_entities),
    occupancy_device_classes: stringArray(merged.occupancy_device_classes),
    include_entities: sectionLists(config.include_entities),
    exclude_entities: stringArray(merged.exclude_entities),
    protected_labels: stringArray(merged.protected_labels),
    protected_entities: stringArray(merged.protected_entities),
    area_overrides: areaOverrides(config.area_overrides),
    entity_overrides: entityOverrides(config.entity_overrides),
    style: {
      ...OVERVIEW_DEFAULT_STYLE,
      ...OVERVIEW_THEME_PRESETS[themePreset],
      ...customStyle,
      area_name_size: areaNameSize,
      card_background: cardBackground,
      card_transparent: cardTransparent,
      primary_text_color: colorStyle("primary_text_color"),
      secondary_text_color: colorStyle("secondary_text_color"),
      active_text_color: colorStyle("active_text_color"),
      control_text_color: colorStyle("control_text_color"),
      entity_active_surface: colorStyle("entity_active_surface"),
      area_frame_color: colorStyle("area_frame_color"),
      area_frame_width: typeof themedStyle.area_frame_width === "number" && Number.isFinite(themedStyle.area_frame_width)
        ? Math.min(8, Math.max(0, themedStyle.area_frame_width))
        : OVERVIEW_DEFAULT_STYLE.area_frame_width,
      entity_frame_color: colorStyle("entity_frame_color"),
      entity_frame_width: typeof themedStyle.entity_frame_width === "number" && Number.isFinite(themedStyle.entity_frame_width)
        ? Math.min(6, Math.max(0, themedStyle.entity_frame_width))
        : OVERVIEW_DEFAULT_STYLE.entity_frame_width,
      climate_tag_gap: typeof themedStyle.climate_tag_gap === "number" && Number.isFinite(themedStyle.climate_tag_gap)
        ? Math.min(20, Math.max(0, themedStyle.climate_tag_gap))
        : OVERVIEW_DEFAULT_STYLE.climate_tag_gap,
      link_section_frame_color: typeof themedStyle.link_section_frame_color === "boolean"
        ? themedStyle.link_section_frame_color
        : OVERVIEW_DEFAULT_STYLE.link_section_frame_color,
      section_frame_brightness: typeof themedStyle.section_frame_brightness === "number" && Number.isFinite(themedStyle.section_frame_brightness)
        ? Math.min(100, Math.max(-100, themedStyle.section_frame_brightness))
        : OVERVIEW_DEFAULT_STYLE.section_frame_brightness,
      occupancy_active_color: colorStyle("occupancy_active_color"),
      occupancy_vacant_color: colorStyle("occupancy_vacant_color"),
      occupancy_unknown_color: colorStyle("occupancy_unknown_color"),
      quick_action_size: numberStyle("quick_action_size", 28, 52),
      quick_action_icon_size: numberStyle("quick_action_icon_size", 14, 34),
      section_action_size: numberStyle("section_action_size", 36, 56),
      section_action_icon_size: numberStyle("section_action_icon_size", 16, 36),
      category_gap: numberStyle("category_gap", 0, 40),
    },
  } as ResolvedOverviewConfig;
};

export const validateOverviewConfig = (config: AreaBubbleOverviewCardConfig): void => {
  if (!isRecord(config)) throw new Error("Invalid Area Bubble Overview Card configuration.");
  if (config.type && config.type !== OVERVIEW_CARD_TYPE) throw new Error(`Card type must be ${OVERVIEW_CARD_TYPE}.`);
  if (config.area && config.floor) throw new Error("Choose either an area or a floor, not both.");
  if (config.section_order && new Set(config.section_order).size !== config.section_order.length) {
    throw new Error("section_order cannot contain duplicates.");
  }
};
