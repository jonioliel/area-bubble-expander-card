import type { HomeAssistant } from "../types";
import type { OverviewQuickActionKind, OverviewSectionId, ResolvedOverviewConfig } from "./types";

type OverviewLanguage = "he" | "en";
type OverviewTextKey =
  | "card_name"
  | "choose_target"
  | "no_areas"
  | "occupied"
  | "vacant"
  | "unknown"
  | "on"
  | "off"
  | "unavailable"
  | "current"
  | "target"
  | "open"
  | "closed"
  | "playing"
  | "turn_off"
  | "expand"
  | "collapse";

const TEXT: Record<OverviewLanguage, Record<OverviewTextKey, string>> = {
  he: {
    card_name: "סקירת אזור",
    choose_target: "בחרו אזור או קומה בהגדרות הכרטיס",
    no_areas: "לא נמצאו אזורים להצגה",
    occupied: "מאוכלס",
    vacant: "ריק",
    unknown: "לא ידוע",
    on: "פועל",
    off: "כבוי",
    unavailable: "לא זמין",
    current: "כעת",
    target: "יעד",
    open: "פתוח",
    closed: "סגור",
    playing: "מתנגן",
    turn_off: "כיבוי",
    expand: "פתיחת אזור",
    collapse: "סגירת אזור",
  },
  en: {
    card_name: "Area overview",
    choose_target: "Choose an area or floor in the card settings",
    no_areas: "No areas found to display",
    occupied: "Occupied",
    vacant: "Vacant",
    unknown: "Unknown",
    on: "On",
    off: "Off",
    unavailable: "Unavailable",
    current: "Now",
    target: "Target",
    open: "Open",
    closed: "Closed",
    playing: "Playing",
    turn_off: "Turn off",
    expand: "Expand area",
    collapse: "Collapse area",
  },
};

const SECTIONS: Record<OverviewLanguage, Record<OverviewSectionId, string>> = {
  he: {
    climate: "מיזוג אוויר",
    floor_heating: "חימום רצפתי",
    covers: "תריסים",
    lights_switches: "מפסקים ותאורה",
    media: "מוזיקה",
  },
  en: {
    climate: "Climate",
    floor_heating: "Floor heating",
    covers: "Covers",
    lights_switches: "Lights and switches",
    media: "Music",
  },
};

const QUICK_ACTIONS: Record<OverviewLanguage, Record<OverviewQuickActionKind, string>> = {
  he: {
    lights: "תאורה",
    climate: "מיזוג אוויר",
    floor_heating: "חימום רצפתי",
    switches: "מפסקים",
    covers: "תריסים",
    media: "מוזיקה",
    fans: "מאווררים",
  },
  en: {
    lights: "Lights",
    climate: "Climate",
    floor_heating: "Floor heating",
    switches: "Switches",
    covers: "Covers",
    media: "Music",
    fans: "Fans",
  },
};

export const overviewLanguage = (hass: HomeAssistant | undefined, config: Pick<ResolvedOverviewConfig, "language">): OverviewLanguage => {
  if (config.language === "he" || config.language === "en") return config.language;
  const language = hass?.locale?.language ?? hass?.language ?? document.documentElement.lang;
  return language?.toLowerCase().startsWith("he") ? "he" : "en";
};

export const overviewRtl = (hass: HomeAssistant | undefined, config: Pick<ResolvedOverviewConfig, "language" | "rtl">): boolean => {
  if (typeof config.rtl === "boolean") return config.rtl;
  return overviewLanguage(hass, config) === "he" || document.documentElement.dir === "rtl";
};

export const overviewText = (
  hass: HomeAssistant | undefined,
  config: Pick<ResolvedOverviewConfig, "language">,
  key: OverviewTextKey,
): string => TEXT[overviewLanguage(hass, config)][key];

export const overviewSectionTitle = (
  hass: HomeAssistant | undefined,
  config: Pick<ResolvedOverviewConfig, "language" | "section_titles">,
  section: OverviewSectionId,
  areaTitle?: string,
): string => areaTitle || config.section_titles[section] || SECTIONS[overviewLanguage(hass, config)][section];

export const quickActionLabel = (
  hass: HomeAssistant | undefined,
  config: Pick<ResolvedOverviewConfig, "language">,
  action: OverviewQuickActionKind,
): string => QUICK_ACTIONS[overviewLanguage(hass, config)][action];
