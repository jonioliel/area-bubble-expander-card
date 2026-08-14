import { OVERVIEW_CARD_TYPE, OVERVIEW_DEFAULT_CONFIG, OVERVIEW_DEFAULT_STYLE, OVERVIEW_SECTIONS, QUICK_ACTION_ICONS } from "./constants";
import type {
  AreaBubbleOverviewCardConfig,
  OverviewAreaOverride,
  OverviewEntityOverride,
  OverviewSectionId,
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
    result[areaId] = {
      ...(typeof raw.name === "string" && raw.name.trim() ? { name: raw.name.trim() } : {}),
      ...(typeof raw.icon === "string" && raw.icon.trim() ? { icon: raw.icon.trim() } : {}),
      ...(typeof raw.parent_area === "string" && raw.parent_area.trim() ? { parent_area: raw.parent_area.trim() } : {}),
      ...(typeof raw.show_when_parent_collapsed === "boolean"
        ? { show_when_parent_collapsed: raw.show_when_parent_collapsed }
        : {}),
      ...(typeof raw.hidden === "boolean" ? { hidden: raw.hidden } : {}),
      ...(typeof raw.default_expanded === "boolean" ? { default_expanded: raw.default_expanded } : {}),
      ...(typeof raw.temperature_entity === "string" && raw.temperature_entity.trim() ? { temperature_entity: raw.temperature_entity.trim() } : {}),
      ...(typeof raw.occupancy_count_entity === "string" && raw.occupancy_count_entity.trim()
        ? { occupancy_count_entity: raw.occupancy_count_entity.trim() }
        : {}),
      occupancy_entities: stringArray(raw.occupancy_entities),
      ...(Array.isArray(raw.section_order) ? { section_order: sectionArray(raw.section_order) } : {}),
      section_titles: sectionTitles(raw.section_titles),
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
  for (const [entityId, raw] of Object.entries(value)) {
    if (!isRecord(raw)) continue;
    result[entityId] = {
      ...(typeof raw.name === "string" && raw.name.trim() ? { name: raw.name.trim() } : {}),
      ...(typeof raw.icon === "string" && raw.icon.trim() ? { icon: raw.icon.trim() } : {}),
      ...(typeof raw.section === "string" && allowed.has(raw.section) ? { section: raw.section as OverviewSectionId } : {}),
      ...(typeof raw.hidden === "boolean" ? { hidden: raw.hidden } : {}),
      ...(typeof raw.protected === "boolean" ? { protected: raw.protected } : {}),
    };
  }
  return result;
};

export const resolveOverviewConfig = (config: AreaBubbleOverviewCardConfig): ResolvedOverviewConfig => {
  const merged = { ...OVERVIEW_DEFAULT_CONFIG, ...config };
  const customTitles = sectionTitles(config.section_titles);
  const customStyle = isRecord(config.style) ? config.style : {};
  const requestedAreaNameSize = customStyle.area_name_size;
  const areaNameSize = typeof requestedAreaNameSize === "number" && Number.isFinite(requestedAreaNameSize)
    ? Math.min(24, Math.max(11, requestedAreaNameSize))
    : OVERVIEW_DEFAULT_STYLE.area_name_size;
  return {
    ...merged,
    type: OVERVIEW_CARD_TYPE,
    id: typeof config.id === "string" ? config.id : "",
    area: typeof config.area === "string" && config.area ? config.area : undefined,
    floor: typeof config.floor === "string" && config.floor ? config.floor : undefined,
    title: typeof config.title === "string" ? config.title : "",
    target_icon: typeof config.target_icon === "string" ? config.target_icon.trim() : "",
    show_area_expand_button:
      typeof config.show_area_expand_button === "boolean"
        ? config.show_area_expand_button
        : (OVERVIEW_DEFAULT_CONFIG.show_area_expand_button ?? true),
    section_order: sectionArray(config.section_order),
    section_titles: Object.fromEntries(
      OVERVIEW_SECTIONS.map((section) => [section, typeof customTitles[section] === "string" ? customTitles[section] : ""]),
    ) as Record<OverviewSectionId, string>,
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
    style: { ...OVERVIEW_DEFAULT_STYLE, ...customStyle, area_name_size: areaNameSize },
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
