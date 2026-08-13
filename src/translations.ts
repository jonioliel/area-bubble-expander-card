import type { HomeAssistant, LanguageMode, ResolvedConfig } from "./types";

export type TranslationKey =
  | "title"
  | "empty_title"
  | "empty_subtitle"
  | "turn_off_area"
  | "turn_off_entity"
  | "turn_off_all"
  | "expand_area"
  | "collapse_area"
  | "active_entities"
  | "active_areas"
  | "no_area"
  | "confirm_area_turn_off"
  | "confirm_entity_turn_off"
  | "confirm_global_turn_off"
  | "protected"
  | "protected_entity"
  | "protected_will_remain"
  | "not_available"
  | "no_active_entities"
  | "show_more"
  | "show_less"
  | "locked_by_safety"
  | "area"
  | "entities"
  | "debug_skipped";

export const TRANSLATIONS: Record<"he" | "en", Record<TranslationKey, string>> = {
  he: {
    title: "מה דלוק בבית",
    empty_title: "הכל כבוי",
    empty_subtitle: "אין מכשירים דלוקים כרגע",
    turn_off_area: "כבה אזור",
    turn_off_entity: "כבה",
    turn_off_all: "כבה הכל",
    expand_area: "פתח אזור",
    collapse_area: "סגור אזור",
    active_entities: "דלוקים",
    active_areas: "אזורים פעילים",
    no_area: "ללא אזור",
    confirm_area_turn_off: "לכבות {count} מכשירים דלוקים באזור {area}?",
    confirm_entity_turn_off: "לכבות את {entity}?",
    confirm_global_turn_off: "לכבות את כל המכשירים הדלוקים?",
    protected: "מוגן",
    protected_entity: "ישות מוגנת",
    protected_will_remain: "ישויות מוגנות לא יכבו.",
    not_available: "לא זמין",
    no_active_entities: "אין ישויות פעילות",
    show_more: "הצג עוד",
    show_less: "הצג פחות",
    locked_by_safety: "נעול על ידי הגנת בטיחות",
    area: "אזור",
    entities: "ישויות",
    debug_skipped: "דילוגים",
  },
  en: {
    title: "What's on at home",
    empty_title: "Everything is off",
    empty_subtitle: "No active devices right now",
    turn_off_area: "Turn off area",
    turn_off_entity: "Turn off",
    turn_off_all: "Turn off all",
    expand_area: "Expand area",
    collapse_area: "Collapse area",
    active_entities: "active",
    active_areas: "active areas",
    no_area: "No Area",
    confirm_area_turn_off: "Turn off {count} active devices in {area}?",
    confirm_entity_turn_off: "Turn off {entity}?",
    confirm_global_turn_off: "Turn off all active devices?",
    protected: "Protected",
    protected_entity: "Protected entity",
    protected_will_remain: "Protected entities will not be turned off.",
    not_available: "Not available",
    no_active_entities: "No active entities",
    show_more: "Show more",
    show_less: "Show less",
    locked_by_safety: "Locked by safety rules",
    area: "Area",
    entities: "entities",
    debug_skipped: "Skipped",
  },
};

export const DOMAIN_LABELS: Record<"he" | "en", Record<string, string>> = {
  he: {
    light: "תאורה",
    switch: "מתגים",
    fan: "מאווררים",
    climate: "מיזוג",
    media_player: "מדיה",
    cover: "תריסים",
    lock: "מנעולים",
    binary_sensor: "חיישנים",
    input_boolean: "בוליאנים",
  },
  en: {
    light: "Lights",
    switch: "Switches",
    fan: "Fans",
    climate: "Climate",
    media_player: "Media",
    cover: "Covers",
    lock: "Locks",
    binary_sensor: "Binary sensors",
    input_boolean: "Booleans",
  },
};

export const resolveLanguage = (hass: HomeAssistant | undefined, language: LanguageMode): "he" | "en" => {
  if (language === "he" || language === "en") return language;
  const detected = hass?.locale?.language ?? hass?.language ?? document.documentElement.lang;
  return detected?.toLowerCase().startsWith("he") ? "he" : "en";
};

export const resolveRtl = (hass: HomeAssistant | undefined, config: ResolvedConfig): boolean => {
  if (typeof config.rtl === "boolean") return config.rtl;
  const language = resolveLanguage(hass, config.language);
  const documentDir = document.documentElement.dir;
  return language === "he" || documentDir === "rtl";
};

export const t = (
  config: ResolvedConfig,
  hass: HomeAssistant | undefined,
  key: TranslationKey,
  replacements: Record<string, string | number> = {},
): string => {
  const language = resolveLanguage(hass, config.language);
  const custom = config.labels[key];
  let text = custom ?? TRANSLATIONS[language][key] ?? TRANSLATIONS.en[key] ?? key;
  for (const [name, value] of Object.entries(replacements)) {
    text = text.replace(new RegExp(`\\{${name}\\}`, "g"), String(value));
  }
  return text;
};

export const domainLabel = (config: ResolvedConfig, hass: HomeAssistant | undefined, domain: string): string => {
  const language = resolveLanguage(hass, config.language);
  return config.domain_labels[domain] ?? DOMAIN_LABELS[language][domain] ?? domain.replace(/_/g, " ");
};
