import { LitElement, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { EDITOR_TAG } from "./constants";
import { editorStyles } from "./editor-styles";
import { listToText, resolveConfig, splitList } from "./helpers/config";
import { resolveArea } from "./helpers/area";
import { discoverActiveEntities } from "./helpers/entity";
import { resolveLanguage, resolveRtl } from "./translations";
import type { AreaBubbleExpanderCardConfig, EditorSchemaItem, HomeAssistant } from "./types";

type EditorLanguage = "he" | "en";
type EditorSection = {
  id: string;
  icon: string;
  title: Record<EditorLanguage, string>;
  description: Record<EditorLanguage, string>;
};

const sections: EditorSection[] = [
  { id: "General", icon: "mdi:tune", title: { en: "General", he: "כללי" }, description: { en: "Title and summary behavior.", he: "כותרת והתנהגות הסיכום של הכרטיס." } },
  { id: "Display", icon: "mdi:card-outline", title: { en: "Display", he: "תצוגה" }, description: { en: "Expansion, icons, previews, and row limits.", he: "פתיחה, סמלים, תצוגה מקדימה ומגבלות שורות." } },
  { id: "Areas", icon: "mdi:floor-plan", title: { en: "Areas", he: "אזורים" }, description: { en: "Choose, hide, rename, and order Home Assistant Areas.", he: "בחירה, הסתרה, שינוי שם וסידור אזורים מ־Home Assistant." } },
  { id: "Entities", icon: "mdi:devices", title: { en: "Entities", he: "ישויות" }, description: { en: "Choose entities, domains, labels, and overrides.", he: "בחירת ישויות, תחומים, תוויות ודריסות." } },
  { id: "Active Rules", icon: "mdi:list-status", title: { en: "Active rules", he: "כללי פעילות" }, description: { en: "Define which entity states count as active.", he: "הגדרה אילו מצבי ישות נחשבים לפעילים." } },
  { id: "Actions", icon: "mdi:gesture-tap-button", title: { en: "Actions", he: "פעולות" }, description: { en: "Turn-off controls, confirmations, and tap actions.", he: "פקדי כיבוי, אישורים ופעולות לחיצה." } },
  { id: "Safety", icon: "mdi:shield-check-outline", title: { en: "Safety", he: "בטיחות" }, description: { en: "Protect critical entities and domains.", he: "הגנה על ישויות ותחומים קריטיים." } },
  { id: "Sorting", icon: "mdi:sort", title: { en: "Sorting", he: "מיון" }, description: { en: "Control Area and entity display order.", he: "שליטה בסדר התצוגה של אזורים וישויות." } },
  { id: "Style", icon: "mdi:palette-outline", title: { en: "Style", he: "עיצוב" }, description: { en: "Appearance, spacing, typography, and colors.", he: "מראה, מרווחים, טיפוגרפיה וצבעים." } },
  { id: "Hebrew / RTL", icon: "mdi:translate", title: { en: "Language & RTL", he: "שפה ו־RTL" }, description: { en: "Language, direction, and custom labels.", he: "שפה, כיוון ותוויות מותאמות." } },
  { id: "Advanced", icon: "mdi:cog-outline", title: { en: "Advanced", he: "מתקדם" }, description: { en: "Secondary data and animation preferences.", he: "מידע משני והעדפות הנפשה." } },
  { id: "Debug", icon: "mdi:bug-outline", title: { en: "Debug", he: "ניפוי שגיאות" }, description: { en: "Diagnostics and the resulting raw configuration.", he: "אבחון והתצורה הגולמית המתקבלת." } },
  { id: "Badge", icon: "mdi:counter", title: { en: "Badge helper", he: "עזר לתג" }, description: { en: "Generate optional template sensors and badge YAML.", he: "יצירת חיישני Template ו־YAML אופציונלי לתג." } },
];

const schema: EditorSchemaItem[] = [
  { section: "General", key: "id", label: "Stable card ID", type: "text" },
  { section: "General", key: "title", label: "Card title", type: "text" },
  { section: "General", key: "show_header", label: "Show header", type: "boolean" },
  { section: "General", key: "show_total_count", label: "Show total active count", type: "boolean" },
  { section: "General", key: "show_active_area_count", label: "Show active area count", type: "boolean" },
  { section: "General", key: "show_empty", label: "Show empty state", type: "boolean" },
  { section: "General", key: "empty_title", label: "Empty title", type: "text" },
  { section: "General", key: "empty_subtitle", label: "Empty subtitle", type: "text" },
  { section: "Display", key: "default_expanded", label: "Default expanded", type: "boolean" },
  { section: "Display", key: "remember_expanded_state", label: "Remember expanded state", type: "boolean" },
  { section: "Display", key: "expand_on_header_tap", label: "Expand on header tap", type: "boolean" },
  { section: "Display", key: "collapse_empty_areas", label: "Collapse empty areas", type: "boolean" },
  { section: "Display", key: "show_area_icons", label: "Show area icons", type: "boolean" },
  { section: "Display", key: "show_entity_icons", label: "Show entity icons", type: "boolean" },
  { section: "Display", key: "show_entity_secondary_info", label: "Show secondary info", type: "boolean" },
  { section: "Display", key: "show_domain_chips", label: "Show domain chips", type: "boolean" },
  {
    section: "Display",
    key: "domain_chip_mode",
    label: "Domain chip mode",
    type: "select",
    options: [
      { value: "icons", label: "Icons" },
      { value: "text", label: "Text" },
      { value: "icons_and_text", label: "Icons and text" },
    ],
  },
  { section: "Display", key: "show_preview_entities", label: "Show preview entities", type: "boolean" },
  { section: "Display", key: "preview_entity_count", label: "Preview entity count", type: "number", min: 0, max: 10, step: 1 },
  { section: "Display", key: "max_entities_per_area", label: "Max entities per area (0 = unlimited)", type: "number", min: 0, max: 200, step: 1 },
  { section: "Areas", key: "include_areas", label: "Include areas (IDs or names)", type: "multi-text" },
  { section: "Areas", key: "exclude_areas", label: "Exclude areas (IDs or names)", type: "multi-text" },
  { section: "Areas", key: "custom_area_order", label: "Custom area order", type: "multi-text" },
  { section: "Areas", key: "areas", label: "Area overrides JSON", type: "textarea" },
  { section: "Entities", key: "domains", label: "Included domains", type: "multi-text" },
  { section: "Entities", key: "exclude_domains", label: "Excluded domains", type: "multi-text" },
  { section: "Entities", key: "include_entities", label: "Include entities", type: "multi-text" },
  { section: "Entities", key: "exclude_entities", label: "Exclude entities", type: "multi-text" },
  { section: "Entities", key: "exclude_labels", label: "Exclude labels", type: "multi-text" },
  { section: "Entities", key: "exclude_entity_category", label: "Exclude entity categories", type: "multi-text" },
  { section: "Entities", key: "exclude_by_regex", label: "Exclude by regex", type: "multi-text" },
  { section: "Entities", key: "exclude_hidden_entities", label: "Exclude hidden entities", type: "boolean" },
  { section: "Entities", key: "exclude_unavailable", label: "Exclude unavailable", type: "boolean" },
  { section: "Entities", key: "entity_overrides", label: "Entity overrides JSON", type: "textarea" },
  { section: "Entities", key: "domain_icons", label: "Domain icons JSON", type: "textarea" },
  { section: "Active Rules", key: "paused_media_players_active", label: "Paused media players count as active", type: "boolean" },
  { section: "Active Rules", key: "active_states", label: "Active states JSON", type: "textarea" },
  { section: "Active Rules", key: "inactive_states", label: "Inactive states JSON", type: "textarea" },
  { section: "Actions", key: "show_area_turn_off", label: "Show area turn-off", type: "boolean" },
  { section: "Actions", key: "show_entity_turn_off", label: "Show entity turn-off", type: "boolean" },
  { section: "Actions", key: "show_global_turn_off", label: "Show global turn-off", type: "boolean" },
  { section: "Actions", key: "confirm_area_turn_off", label: "Confirm area turn-off", type: "boolean" },
  { section: "Actions", key: "confirm_entity_turn_off", label: "Confirm entity turn-off", type: "boolean" },
  { section: "Actions", key: "confirm_global_turn_off", label: "Confirm global turn-off", type: "boolean" },
  {
    section: "Actions",
    key: "area_turn_off_mode",
    label: "Area turn-off mode",
    type: "select",
    options: [
      { value: "safe_displayed_entities", label: "Safe displayed entities" },
      { value: "domain_grouped_services", label: "Domain grouped services" },
      { value: "homeassistant_area", label: "Home Assistant area target" },
    ],
  },
  { section: "Actions", key: "service_mapping", label: "Service mapping JSON", type: "textarea" },
  { section: "Actions", key: "tap_action", label: "Tap action JSON", type: "textarea" },
  { section: "Actions", key: "hold_action", label: "Hold action JSON", type: "textarea" },
  { section: "Actions", key: "double_tap_action", label: "Double-tap action JSON", type: "textarea" },
  { section: "Safety", key: "protected_labels", label: "Protected labels", type: "multi-text" },
  { section: "Safety", key: "protected_entities", label: "Protected entities", type: "multi-text" },
  { section: "Safety", key: "disable_turn_off_for_domains", label: "Disable turn-off for domains", type: "multi-text" },
  { section: "Safety", key: "dangerous_domains", label: "Dangerous domains", type: "multi-text" },
  {
    section: "Safety",
    key: "protected_entity_behavior",
    label: "Protected entity behavior",
    type: "select",
    options: [
      { value: "hide", label: "Hide" },
      { value: "show_disabled", label: "Show disabled" },
      { value: "show_with_lock_icon", label: "Show with lock icon" },
    ],
  },
  {
    section: "Safety",
    key: "safety_mode",
    label: "Safety mode",
    type: "select",
    options: [
      { value: "strict", label: "Strict" },
      { value: "normal", label: "Normal" },
      { value: "custom", label: "Custom" },
    ],
  },
  {
    section: "Sorting",
    key: "area_sort",
    label: "Area sort",
    type: "select",
    options: [
      { value: "count_desc", label: "Count descending" },
      { value: "count_asc", label: "Count ascending" },
      { value: "name", label: "Name" },
      { value: "custom", label: "Custom" },
      { value: "original", label: "Original" },
    ],
  },
  {
    section: "Sorting",
    key: "entity_sort",
    label: "Entity sort",
    type: "select",
    options: [
      { value: "domain", label: "Domain" },
      { value: "name", label: "Name" },
      { value: "state", label: "State" },
      { value: "last_changed", label: "Last changed" },
      { value: "custom", label: "Custom" },
    ],
  },
  { section: "Sorting", key: "custom_entity_order", label: "Custom entity order", type: "multi-text" },
  {
    section: "Style",
    key: "style.preset",
    label: "Theme preset",
    type: "select",
    options: [
      { value: "bubble_glass", label: "Bubble Glass" },
      { value: "bubble_solid", label: "Bubble Solid" },
      { value: "expander_minimal", label: "Expander Minimal" },
      { value: "home_assistant_native", label: "Home Assistant Native" },
      { value: "dark_glass", label: "Dark Glass" },
      { value: "light_glass", label: "Light Glass" },
      { value: "compact_mobile", label: "Compact Mobile" },
    ],
  },
  { section: "Style", key: "style.glass", label: "Glass mode", type: "boolean" },
  { section: "Style", key: "style.compact", label: "Compact mode", type: "boolean" },
  { section: "Style", key: "style.border_radius", label: "Border radius", type: "number", min: 4, max: 40, step: 1 },
  { section: "Style", key: "style.blur", label: "Blur", type: "number", min: 0, max: 40, step: 1 },
  { section: "Style", key: "style.section_gap", label: "Section gap", type: "number", min: 4, max: 30, step: 1 },
  { section: "Style", key: "style.row_height", label: "Row height", type: "number", min: 40, max: 80, step: 1 },
  { section: "Style", key: "style.icon_size", label: "Base icon size", type: "number", min: 12, max: 48, step: 1 },
  { section: "Style", key: "style.area_icon_size", label: "Area icon size", type: "number", min: 12, max: 52, step: 1 },
  { section: "Style", key: "style.entity_icon_size", label: "Entity icon size", type: "number", min: 12, max: 48, step: 1 },
  { section: "Style", key: "style.background_opacity", label: "Background opacity", type: "number", min: 0, max: 1, step: 0.05 },
  { section: "Style", key: "style.border_opacity", label: "Border opacity", type: "number", min: 0, max: 1, step: 0.05 },
  { section: "Style", key: "style.show_shadows", label: "Show shadows", type: "boolean" },
  { section: "Style", key: "style.shadow_intensity", label: "Shadow intensity", type: "number", min: 0, max: 1, step: 0.05 },
  { section: "Style", key: "style.accent_color", label: "Accent color", type: "color" },
  { section: "Style", key: "style.danger_color", label: "Danger color", type: "color" },
  { section: "Style", key: "style.header_background", label: "Header background", type: "text" },
  { section: "Style", key: "style.expanded_background", label: "Expanded background", type: "text" },
  { section: "Style", key: "style.collapsed_background", label: "Collapsed background", type: "text" },
  { section: "Style", key: "style.row_background", label: "Row background", type: "text" },
  { section: "Style", key: "style.chip_background", label: "Chip background", type: "text" },
  { section: "Style", key: "style.text_size", label: "Primary text size", type: "number", min: 10, max: 28, step: 1 },
  { section: "Style", key: "style.secondary_text_size", label: "Secondary text size", type: "number", min: 8, max: 22, step: 1 },
  {
    section: "Hebrew / RTL",
    key: "language",
    label: "Language",
    type: "select",
    options: [
      { value: "auto", label: "Auto" },
      { value: "he", label: "Hebrew" },
      { value: "en", label: "English" },
    ],
  },
  {
    section: "Hebrew / RTL",
    key: "rtl",
    label: "RTL",
    type: "select",
    options: [
      { value: "auto", label: "Auto" },
      { value: "true", label: "Enabled" },
      { value: "false", label: "Disabled" },
    ],
  },
  { section: "Hebrew / RTL", key: "labels", label: "Custom labels JSON", type: "textarea" },
  { section: "Hebrew / RTL", key: "domain_labels", label: "Custom domain labels JSON", type: "textarea" },
  { section: "Advanced", key: "show_last_changed", label: "Show last changed", type: "boolean" },
  { section: "Advanced", key: "show_brightness", label: "Show light brightness", type: "boolean" },
  { section: "Advanced", key: "show_temperature", label: "Show climate temperature", type: "boolean" },
  { section: "Advanced", key: "show_media_title", label: "Show media title", type: "boolean" },
  { section: "Advanced", key: "enable_animations", label: "Enable animations", type: "boolean" },
  { section: "Advanced", key: "respect_reduced_motion", label: "Respect reduced motion", type: "boolean" },
  { section: "Debug", key: "debug", label: "Debug logging", type: "boolean" },
  { section: "Debug", key: "show_debug", label: "Show skipped/protected diagnostics", type: "boolean" },
  { section: "Debug", key: "show_entity_ids", label: "Show entity IDs", type: "boolean" },
  { section: "Debug", key: "show_area_ids", label: "Show area IDs", type: "boolean" },
];

const HEBREW_FIELD_LABELS: Record<string, string> = {
  id: "מזהה קבוע לכרטיס",
  title: "כותרת הכרטיס",
  show_header: "הצגת כותרת",
  show_total_count: "הצגת מספר הישויות הפעילות",
  show_active_area_count: "הצגת מספר האזורים הפעילים",
  show_empty: "הצגת מצב ריק",
  empty_title: "כותרת למצב ריק",
  empty_subtitle: "כותרת משנה למצב ריק",
  default_expanded: "פתוח כברירת מחדל",
  remember_expanded_state: "זכירת מצב הפתיחה",
  expand_on_header_tap: "פתיחה בלחיצה על כותרת האזור",
  collapse_empty_areas: "כיווץ אזורים ריקים",
  show_area_icons: "הצגת סמלי אזורים",
  show_entity_icons: "הצגת סמלי ישויות",
  show_entity_secondary_info: "הצגת מידע משני",
  show_domain_chips: "הצגת תגיות תחום",
  domain_chip_mode: "תצוגת תגיות תחום",
  show_preview_entities: "הצגת ישויות בתצוגה מקדימה",
  preview_entity_count: "מספר ישויות בתצוגה מקדימה",
  max_entities_per_area: "מספר מרבי של ישויות באזור (0 = ללא הגבלה)",
  include_areas: "אזורים להצגה (מזהה או שם)",
  exclude_areas: "אזורים להסתרה (מזהה או שם)",
  custom_area_order: "סדר אזורים מותאם",
  areas: "דריסות אזור — JSON",
  domains: "תחומים להצגה",
  exclude_domains: "תחומים להסתרה",
  include_entities: "ישויות להצגה",
  exclude_entities: "ישויות להסתרה",
  exclude_labels: "תוויות להסתרה",
  exclude_entity_category: "קטגוריות ישות להסתרה",
  exclude_by_regex: "הסתרה לפי ביטוי רגולרי",
  exclude_hidden_entities: "הסתרת ישויות מוסתרות",
  exclude_unavailable: "הסתרת ישויות לא זמינות",
  entity_overrides: "דריסות ישות — JSON",
  domain_icons: "סמלי תחומים — JSON",
  paused_media_players_active: "נגן מושהה נחשב פעיל",
  active_states: "מצבים פעילים — JSON",
  inactive_states: "מצבים לא פעילים — JSON",
  show_area_turn_off: "הצגת כיבוי לאזור",
  show_entity_turn_off: "הצגת כיבוי לישות",
  show_global_turn_off: "הצגת כיבוי כללי",
  confirm_area_turn_off: "אישור לפני כיבוי אזור",
  confirm_entity_turn_off: "אישור לפני כיבוי ישות",
  confirm_global_turn_off: "אישור לפני כיבוי כללי",
  area_turn_off_mode: "אופן כיבוי אזור",
  service_mapping: "מיפוי שירותים — JSON",
  tap_action: "פעולת לחיצה — JSON",
  hold_action: "פעולת לחיצה ארוכה — JSON",
  double_tap_action: "פעולת לחיצה כפולה — JSON",
  protected_labels: "תוויות מוגנות",
  protected_entities: "ישויות מוגנות",
  disable_turn_off_for_domains: "תחומים ללא אפשרות כיבוי",
  dangerous_domains: "תחומים מסוכנים",
  protected_entity_behavior: "תצוגת ישות מוגנת",
  safety_mode: "מצב בטיחות",
  area_sort: "מיון אזורים",
  entity_sort: "מיון ישויות",
  custom_entity_order: "סדר ישויות מותאם",
  "style.preset": "ערכת עיצוב",
  "style.glass": "אפקט זכוכית",
  "style.compact": "מצב קומפקטי",
  "style.border_radius": "רדיוס פינות",
  "style.blur": "טשטוש",
  "style.section_gap": "מרווח בין אזורים",
  "style.row_height": "גובה שורה",
  "style.icon_size": "גודל סמל בסיסי",
  "style.area_icon_size": "גודל סמל אזור",
  "style.entity_icon_size": "גודל סמל ישות",
  "style.background_opacity": "אטימות רקע",
  "style.border_opacity": "אטימות מסגרת",
  "style.show_shadows": "הצגת צללים",
  "style.shadow_intensity": "עוצמת צל",
  "style.accent_color": "צבע הדגשה",
  "style.danger_color": "צבע אזהרה",
  "style.header_background": "רקע כותרת",
  "style.expanded_background": "רקע אזור פתוח",
  "style.collapsed_background": "רקע אזור סגור",
  "style.row_background": "רקע שורה",
  "style.chip_background": "רקע תגית",
  "style.text_size": "גודל טקסט ראשי",
  "style.secondary_text_size": "גודל טקסט משני",
  language: "שפה",
  rtl: "כיוון RTL",
  labels: "תוויות מותאמות — JSON",
  domain_labels: "שמות תחומים מותאמים — JSON",
  show_last_changed: "הצגת זמן שינוי אחרון",
  show_brightness: "הצגת בהירות תאורה",
  show_temperature: "הצגת טמפרטורת מיזוג",
  show_media_title: "הצגת שם המדיה",
  enable_animations: "הפעלת הנפשות",
  respect_reduced_motion: "כיבוד העדפת הפחתת תנועה",
  debug: "רישום אבחון למסוף",
  show_debug: "הצגת אבחון ישויות שסוננו",
  show_entity_ids: "הצגת מזהי ישויות",
  show_area_ids: "הצגת מזהי אזורים",
};

const HEBREW_OPTION_LABELS: Record<string, string> = {
  icons: "סמלים",
  text: "טקסט",
  icons_and_text: "סמלים וטקסט",
  safe_displayed_entities: "ישויות מוצגות ובטוחות",
  domain_grouped_services: "שירותים מקובצים לפי תחום",
  homeassistant_area: "יעד אזור של Home Assistant",
  hide: "הסתרה",
  show_disabled: "הצגה מושבתת",
  show_with_lock_icon: "הצגה עם סמל מנעול",
  strict: "מחמיר",
  normal: "רגיל",
  custom: "מותאם",
  count_desc: "כמות — מהגבוה לנמוך",
  count_asc: "כמות — מהנמוך לגבוה",
  name: "שם",
  original: "סדר מקורי",
  domain: "תחום",
  state: "מצב",
  last_changed: "שינוי אחרון",
  bubble_glass: "Bubble Glass",
  bubble_solid: "Bubble Solid",
  expander_minimal: "Expander Minimal",
  home_assistant_native: "Home Assistant Native",
  dark_glass: "Dark Glass",
  light_glass: "Light Glass",
  compact_mobile: "Compact Mobile",
  auto: "אוטומטי",
  he: "עברית",
  en: "אנגלית",
  true: "מופעל",
  false: "מושבת",
};

const EDITOR_TEXT = {
  en: {
    title: "Card settings",
    subtitle: "Changes are reflected in the Home Assistant preview.",
    chooseSection: "Settings section",
    searchAreas: "Search area name or ID",
    searchEntities: "Search entity, area, domain, or label",
    searchLabels: "Search label name or ID",
    areasFromHa: "Areas from Home Assistant",
    entitiesFromHa: "Entities from Home Assistant",
    labelsFromHa: "Labels from Home Assistant",
    include: "Include",
    exclude: "Exclude",
    hide: "Hide",
    noResults: "No matching items",
    areaOrder: "Area display order",
    areaOrderHelp: "Drag the handle or use the arrow buttons. A custom order is saved automatically.",
    customOrder: "Use custom order",
    moveUp: "Move up",
    moveDown: "Move down",
    drag: "Drag to reorder",
    apply: "Apply",
    reset: "Reset",
    jsonValid: "Valid JSON — apply to save.",
    jsonInvalid: "Invalid JSON",
    jsonObject: "A JSON object is required.",
    configKey: "Configuration key",
    labelsFallback: "Live Label registry is unavailable; showing labels already present in Home Assistant data.",
    retry: "Retry",
    badgeHelper: "Badge / Template helper",
    templateSensors: "Template sensors YAML",
    dashboardBadge: "Dashboard badge YAML",
    currentConfig: "Resulting config JSON",
    activeNow: "active entities",
    activeAreas: "active areas right now",
  },
  he: {
    title: "הגדרות הכרטיס",
    subtitle: "השינויים משתקפים בתצוגה המקדימה של Home Assistant.",
    chooseSection: "קטגוריית הגדרות",
    searchAreas: "חיפוש לפי שם אזור או מזהה",
    searchEntities: "חיפוש ישות, אזור, תחום או תווית",
    searchLabels: "חיפוש לפי שם תווית או מזהה",
    areasFromHa: "אזורים מ־Home Assistant",
    entitiesFromHa: "ישויות מ־Home Assistant",
    labelsFromHa: "תוויות מ־Home Assistant",
    include: "הצגה",
    exclude: "החרגה",
    hide: "הסתרה",
    noResults: "לא נמצאו פריטים תואמים",
    areaOrder: "סדר תצוגת האזורים",
    areaOrderHelp: "ניתן לגרור את הידית או להשתמש בחיצים. סדר מותאם נשמר אוטומטית.",
    customOrder: "שימוש בסדר מותאם",
    moveUp: "הזזה למעלה",
    moveDown: "הזזה למטה",
    drag: "גרירה לשינוי סדר",
    apply: "החלה",
    reset: "איפוס",
    jsonValid: "ה־JSON תקין — יש להחיל כדי לשמור.",
    jsonInvalid: "JSON לא תקין",
    jsonObject: "נדרש אובייקט JSON.",
    configKey: "מפתח תצורה",
    labelsFallback: "רישום התוויות החי אינו זמין; מוצגות תוויות שכבר קיימות בנתוני Home Assistant.",
    retry: "ניסיון חוזר",
    badgeHelper: "עזר לתג / Template",
    templateSensors: "YAML לחיישני Template",
    dashboardBadge: "YAML לתג בלוח הבקרה",
    currentConfig: "תצורת JSON המתקבלת",
    activeNow: "ישויות פעילות",
    activeAreas: "אזורים פעילים כעת",
  },
} satisfies Record<EditorLanguage, Record<string, string>>;

@customElement(EDITOR_TAG)
export class AreaBubbleExpanderCardEditor extends LitElement {
  static override styles = editorStyles;

  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private config: AreaBubbleExpanderCardConfig = { type: "custom:area-bubble-expander-card" };
  @state() private activeSection = "General";
  @state() private areaSearch = "";
  @state() private entitySearch = "";
  @state() private labelSearch = "";
  @state() private registryLabels: Array<{ label_id?: string; id?: string; name?: string; icon?: string }> = [];
  @state() private labelRegistryStatus: "idle" | "loading" | "loaded" | "failed" = "idle";
  @state() private jsonDrafts: Record<string, string> = {};
  @state() private jsonErrors: Record<string, string> = {};
  @state() private draggedAreaId?: string;
  @state() private dragOverAreaId?: string;

  private readonly jsonDraftBaselines: Record<string, string> = {};
  private labelRegistryHass?: HomeAssistant;

  public setConfig(config: AreaBubbleExpanderCardConfig): void {
    const next = this.cloneConfig(config) as AreaBubbleExpanderCardConfig;

    // Preserve an invalid in-progress JSON draft when HA re-sends the same
    // committed value after another field changes. If the committed JSON value
    // changed externally, the external value wins and the stale draft is reset.
    for (const key of Object.keys(this.jsonDrafts)) {
      const committed = this.jsonCommittedText(key, next);
      if (this.jsonDraftBaselines[key] !== committed) this.clearJsonDraft(key);
    }

    this.config = next;
  }

  protected override shouldUpdate(changedProperties: Map<PropertyKey, unknown>): boolean {
    if (changedProperties.size !== 1 || !changedProperties.has("hass")) return true;
    if (this.activeSection === "Badge") return true;

    const previous = changedProperties.get("hass") as HomeAssistant | undefined;
    if (!previous || !this.hass) return true;

    // HA replaces `hass` for every state update. Most settings pages do not use
    // live state values, so avoid rebuilding a potentially very large editor on
    // every sensor tick. Registry changes and entity additions still re-render.
    if (previous.areas !== this.hass.areas || previous.entities !== this.hass.entities || previous.devices !== this.hass.devices || previous.labels !== this.hass.labels) {
      return true;
    }
    if (this.activeSection === "Areas" || this.activeSection === "Entities") {
      return Object.keys(previous.states ?? {}).length !== Object.keys(this.hass.states ?? {}).length;
    }
    return false;
  }

  protected override updated(changedProperties: Map<PropertyKey, unknown>): void {
    if (changedProperties.has("hass") && this.labelRegistryStatus === "idle") void this.loadLabelRegistry();
  }

  protected override render() {
    const resolved = resolveConfig(this.config);
    const language = resolveLanguage(this.hass, resolved.language);
    const rtl = resolveRtl(this.hass, resolved);
    const section = sections.find((item) => item.id === this.activeSection) ?? sections[0];
    const visibleSchema = schema.filter((item) => item.section === this.activeSection);
    return html`
      <div class="editor" dir=${rtl ? "rtl" : "ltr"} lang=${language}>
        <header class="editor-heading">
          <ha-icon icon="mdi:card-bulleted-settings-outline"></ha-icon>
          <div class="editor-heading-text">
            <div class="editor-title">${EDITOR_TEXT[language].title}</div>
            <div class="editor-subtitle">${EDITOR_TEXT[language].subtitle}</div>
          </div>
        </header>

        <div class="mobile-navigation">
          <label class="field-label" for="abec-section-select">${EDITOR_TEXT[language].chooseSection}</label>
          <select id="abec-section-select" .value=${this.activeSection} @change=${this.changeSectionFromSelect}>
            ${sections.map((item) => html`<option value=${item.id}>${item.title[language]}</option>`)}
          </select>
        </div>

        <div class="editor-layout">
          <nav class="section-nav" role="tablist" aria-label=${EDITOR_TEXT[language].chooseSection} aria-orientation="vertical">
            ${sections.map(
              (item, index) => html`
                <button
                  type="button"
                  id=${`abec-editor-tab-${index}`}
                  class="section-tab"
                  role="tab"
                  aria-selected=${this.activeSection === item.id ? "true" : "false"}
                  aria-controls="abec-editor-panel"
                  tabindex=${this.activeSection === item.id ? "0" : "-1"}
                  @click=${() => this.selectSection(item.id)}
                  @keydown=${(ev: KeyboardEvent) => this.navigateSections(ev, index)}
                >
                  <ha-icon icon=${item.icon}></ha-icon>
                  <span>${item.title[language]}</span>
                  <ha-icon class="chevron" icon="mdi:chevron-right"></ha-icon>
                </button>
              `,
            )}
          </nav>

          <section
            id="abec-editor-panel"
            class="section-panel"
            role="tabpanel"
            aria-labelledby=${`abec-editor-tab-${Math.max(0, sections.findIndex((item) => item.id === section.id))}`}
          >
            <div class="section-heading">
              <ha-icon icon=${section.icon}></ha-icon>
              <div>
                <div class="section-title">${section.title[language]}</div>
                <div class="section-description">${section.description[language]}</div>
              </div>
            </div>

          ${this.activeSection === "Areas" ? this.renderAreaPicker(resolved) : nothing}
          ${this.activeSection === "Areas" ? this.renderAreaOrder(resolved) : nothing}
          ${this.activeSection === "Entities" ? this.renderEntityPicker(resolved) : nothing}
          ${this.activeSection === "Entities" ? this.renderLabelPicker(resolved) : nothing}
          ${this.activeSection === "Badge" ? this.renderBadgeTemplates(resolved) : nothing}
            ${visibleSchema.map((item) => this.renderField(item, resolved))}
          ${this.activeSection === "Debug"
              ? html`<div class="field"><label class="field-label" for="abec-resulting-config">${EDITOR_TEXT[language].currentConfig}</label><textarea id="abec-resulting-config" class="yaml" readonly .value=${JSON.stringify(this.config, null, 2)}></textarea></div>`
            : nothing}
          </section>
        </div>
      </div>
    `;
  }

  private async loadLabelRegistry(): Promise<void> {
    const callWS = this.hass?.callWS?.bind(this.hass);
    if (this.labelRegistryStatus !== "idle" || !callWS) return;
    this.labelRegistryStatus = "loading";
    const requestedHass = this.hass;
    this.labelRegistryHass = requestedHass;
    try {
      const labels = await callWS<Array<{ label_id?: string; id?: string; name?: string; icon?: string }>>({
        type: "config/label_registry/list",
      });
      if (this.labelRegistryHass !== requestedHass) return;
      this.registryLabels = Array.isArray(labels) ? labels : [];
      this.labelRegistryStatus = "loaded";
    } catch {
      if (this.labelRegistryHass !== requestedHass) return;
      this.registryLabels = [];
      // Do not retry on every HA state update (which can otherwise create a WS
      // request storm for non-admin users). A visible retry action is provided.
      this.labelRegistryStatus = "failed";
    }
  }

  private retryLabelRegistry(): void {
    this.labelRegistryHass = undefined;
    this.labelRegistryStatus = "idle";
    void this.loadLabelRegistry();
  }

  private renderAreaPicker(resolved: ReturnType<typeof resolveConfig>) {
    const language = this.editorLanguage(resolved);
    const text = EDITOR_TEXT[language];
    const areas = this.areaOptions(resolved);
    const filtered = areas.filter((area) => this.matchesSearch(`${area.name} ${area.id}`, this.areaSearch));
    return html`
      <div class="picker-panel">
        <div class="picker-heading">
          <div>
            <strong>${text.areasFromHa}</strong>
            <span>${filtered.length} / ${areas.length}</span>
          </div>
          <label class="visually-hidden" for="abec-area-search">${text.searchAreas}</label>
          <input
            id="abec-area-search"
            class="search"
            type="search"
            placeholder=${text.searchAreas}
            .value=${this.areaSearch}
            @input=${(ev: Event) => this.updateSearch(ev, "area")}
          />
        </div>
        <div class="picker-list">
          ${filtered.length
            ? filtered.map(
                (area) => html`
              <div class="picker-item">
                <ha-icon icon=${area.icon}></ha-icon>
                <div class="picker-main">
                  <div class="picker-title">${area.name}</div>
                  <div class="picker-meta">${area.id}</div>
                </div>
                <div class="picker-actions">
                  <button
                    type="button"
                    class="pill ${resolved.include_areas.includes(area.id) || resolved.include_areas.includes(area.name) ? "active" : ""}"
                    aria-pressed=${resolved.include_areas.includes(area.id) || resolved.include_areas.includes(area.name) ? "true" : "false"}
                    @click=${() => this.toggleListValue("include_areas", area.id, "exclude_areas", [area.id, area.name])}
                  >${text.include}</button>
                  <button
                    type="button"
                    class="pill danger ${resolved.exclude_areas.includes(area.id) || resolved.exclude_areas.includes(area.name) ? "active" : ""}"
                    aria-pressed=${resolved.exclude_areas.includes(area.id) || resolved.exclude_areas.includes(area.name) ? "true" : "false"}
                    @click=${() => this.toggleListValue("exclude_areas", area.id, "include_areas", [area.id, area.name])}
                  >${text.exclude}</button>
                </div>
              </div>
            `,
              )
            : html`<div class="empty-picker">${text.noResults}</div>`}
        </div>
      </div>
    `;
  }

  private renderEntityPicker(resolved: ReturnType<typeof resolveConfig>) {
    const language = this.editorLanguage(resolved);
    const text = EDITOR_TEXT[language];
    const entities = this.entityOptions(resolved);
    const filtered = entities.filter((entity) =>
      this.matchesSearch(`${entity.name} ${entity.entityId} ${entity.domain} ${entity.areaName} ${entity.labels}`, this.entitySearch),
    );
    return html`
      <div class="picker-panel">
        <div class="picker-heading">
          <div>
            <strong>${text.entitiesFromHa}</strong>
            <span>${filtered.length} / ${entities.length}</span>
          </div>
          <label class="visually-hidden" for="abec-entity-search">${text.searchEntities}</label>
          <input
            id="abec-entity-search"
            class="search"
            type="search"
            placeholder=${text.searchEntities}
            .value=${this.entitySearch}
            @input=${(ev: Event) => this.updateSearch(ev, "entity")}
          />
        </div>
        <div class="picker-list entities-picker">
          ${filtered.length
            ? filtered.map(
                (entity) => html`
              <div class="picker-item">
                <ha-icon icon=${entity.icon}></ha-icon>
                <div class="picker-main">
                  <div class="picker-title">${entity.name}</div>
                  <div class="picker-meta">
                    ${entity.entityId} · ${entity.areaName} · ${entity.domain}${entity.labels ? ` · labels: ${entity.labels}` : ""}
                  </div>
                </div>
                <div class="picker-actions">
                  <button
                    type="button"
                    class="pill ${resolved.include_entities.includes(entity.entityId) ? "active" : ""}"
                    aria-pressed=${resolved.include_entities.includes(entity.entityId) ? "true" : "false"}
                    @click=${() => this.toggleListValue("include_entities", entity.entityId, "exclude_entities")}
                  >${text.include}</button>
                  <button
                    type="button"
                    class="pill danger ${resolved.exclude_entities.includes(entity.entityId) ? "active" : ""}"
                    aria-pressed=${resolved.exclude_entities.includes(entity.entityId) ? "true" : "false"}
                    @click=${() => this.toggleListValue("exclude_entities", entity.entityId, "include_entities")}
                  >${text.hide}</button>
                </div>
              </div>
            `,
              )
            : html`<div class="empty-picker">${text.noResults}</div>`}
        </div>
      </div>
    `;
  }

  private renderLabelPicker(resolved: ReturnType<typeof resolveConfig>) {
    const language = this.editorLanguage(resolved);
    const text = EDITOR_TEXT[language];
    const labels = this.labelOptions();
    const filtered = labels.filter((label) => this.matchesSearch(`${label.id} ${label.name}`, this.labelSearch));
    return html`
      <div class="picker-panel">
        <div class="picker-heading">
          <div>
            <strong>${text.labelsFromHa}</strong>
            <span>${filtered.length} / ${labels.length}</span>
          </div>
          <label class="visually-hidden" for="abec-label-search">${text.searchLabels}</label>
          <input
            id="abec-label-search"
            class="search"
            type="search"
            placeholder=${text.searchLabels}
            .value=${this.labelSearch}
            @input=${(ev: Event) => this.updateSearch(ev, "label")}
          />
        </div>
        ${this.labelRegistryStatus === "failed"
          ? html`
              <div class="status-banner" role="status">
                <span class="status-text">${text.labelsFallback}</span>
                <button type="button" class="action-button" @click=${this.retryLabelRegistry}>${text.retry}</button>
              </div>
            `
          : nothing}
        <div class="picker-list compact-picker">
          ${filtered.length
            ? filtered.map(
                (label) => html`
              <div class="picker-item">
                <ha-icon icon=${label.icon}></ha-icon>
                <div class="picker-main">
                  <div class="picker-title">${label.name}</div>
                  <div class="picker-meta">${label.id}</div>
                </div>
                <div class="picker-actions">
                  <button
                    type="button"
                    class="pill danger ${resolved.exclude_labels.includes(label.id) ? "active" : ""}"
                    aria-pressed=${resolved.exclude_labels.includes(label.id) ? "true" : "false"}
                    @click=${() => this.toggleListValue("exclude_labels", label.id)}
                  >${text.exclude}</button>
                </div>
              </div>
            `,
              )
            : html`<div class="empty-picker">${text.noResults}</div>`}
        </div>
      </div>
    `;
  }

  private renderAreaOrder(resolved: ReturnType<typeof resolveConfig>) {
    const language = this.editorLanguage(resolved);
    const text = EDITOR_TEXT[language];
    const areas = this.orderedAreaOptions(resolved);
    return html`
      <div class="picker-panel">
        <div class="picker-heading single">
          <div>
            <strong>${text.areaOrder}</strong>
            <span>${text.areaOrderHelp}</span>
          </div>
          <button
            type="button"
            class="pill ${resolved.area_sort === "custom" ? "active" : ""}"
            aria-pressed=${resolved.area_sort === "custom" ? "true" : "false"}
            @click=${() => this.enableCustomAreaOrder(areas)}
          >
            ${text.customOrder}
          </button>
        </div>
        <div class="picker-list compact-picker">
          ${areas.map(
            (area, index) => html`
              <div
                class="picker-item order-item ${this.draggedAreaId === area.id ? "dragging" : ""} ${this.dragOverAreaId === area.id ? "drag-over" : ""}"
                @dragover=${(ev: DragEvent) => this.dragAreaOver(ev, area.id)}
                @drop=${(ev: DragEvent) => this.dropArea(ev, area.id)}
              >
                <span
                  class="drag-handle"
                  draggable="true"
                  title=${text.drag}
                  aria-hidden="true"
                  @dragstart=${(ev: DragEvent) => this.startAreaDrag(ev, area.id)}
                  @dragend=${this.endAreaDrag}
                ><ha-icon icon="mdi:drag-vertical"></ha-icon></span>
                <ha-icon icon=${area.icon}></ha-icon>
                <div class="picker-main">
                  <div class="picker-title">${area.name}</div>
                  <div class="picker-meta">${area.id}</div>
                </div>
                <div class="order-actions">
                  <button type="button" class="icon-action" title=${text.moveUp} aria-label=${`${text.moveUp}: ${area.name}`} ?disabled=${index === 0} @click=${() => this.moveArea(area.id, -1)}>
                    <ha-icon icon="mdi:arrow-up"></ha-icon>
                  </button>
                  <button type="button" class="icon-action" title=${text.moveDown} aria-label=${`${text.moveDown}: ${area.name}`} ?disabled=${index === areas.length - 1} @click=${() => this.moveArea(area.id, 1)}>
                    <ha-icon icon="mdi:arrow-down"></ha-icon>
                  </button>
                </div>
              </div>
            `,
          )}
        </div>
      </div>
    `;
  }

  private renderBadgeTemplates(resolved: ReturnType<typeof resolveConfig>) {
    const language = this.editorLanguage(resolved);
    const text = EDITOR_TEXT[language];
    const { groups } = discoverActiveEntities(this.hass, resolved);
    const activeCount = groups.reduce((sum, group) => sum + group.entities.length, 0);
    const activeAreaCount = groups.length;
    return html`
      <div class="picker-panel">
        <div class="picker-heading single">
          <div>
            <strong>${text.badgeHelper}</strong>
            <span>${activeCount} ${text.activeNow} · ${activeAreaCount} ${text.activeAreas}</span>
          </div>
        </div>
        <div class="field">
          <label class="field-label" for="abec-template-sensors">${text.templateSensors}</label>
          <textarea id="abec-template-sensors" class="yaml template-output" readonly .value=${this.templateSensorYaml(resolved)}></textarea>
        </div>
        <div class="field">
          <label class="field-label" for="abec-badge-yaml">${text.dashboardBadge}</label>
          <textarea id="abec-badge-yaml" class="yaml template-output small" readonly .value=${this.badgeYaml()}></textarea>
        </div>
      </div>
    `;
  }

  private areaOptions(resolved: ReturnType<typeof resolveConfig>) {
    const registryAreas = Object.entries(this.hass?.areas ?? {}).map(([key, area]) => ({
      id: area.area_id ?? area.id ?? key,
      name: area.name,
      icon: area.icon ?? "mdi:floor-plan",
    }));

    const fromEntities = new Map<string, { id: string; name: string; icon: string }>();
    for (const entityId of Object.keys(this.hass?.states ?? {})) {
      const area = resolveArea(this.hass, resolved, entityId);
      fromEntities.set(area.id, { id: area.id, name: area.name, icon: area.icon });
    }

    return [...registryAreas, ...fromEntities.values()]
      .filter((area, index, list) => list.findIndex((item) => item.id === area.id) === index)
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  private orderedAreaOptions(resolved: ReturnType<typeof resolveConfig>) {
    const areas = this.areaOptions(resolved);
    const order = resolved.custom_area_order;
    return areas.sort((a, b) => {
      const aIndex = this.orderIndex(order, a.id, a.name);
      const bIndex = this.orderIndex(order, b.id, b.name);
      return aIndex - bIndex || a.name.localeCompare(b.name);
    });
  }

  private entityOptions(resolved: ReturnType<typeof resolveConfig>) {
    return Object.values(this.hass?.states ?? {})
      .map((entity) => {
        const domain = entity.entity_id.split(".")[0] ?? "";
        const area = resolveArea(this.hass, resolved, entity.entity_id);
        return {
          entityId: entity.entity_id,
          domain,
          areaName: area.name,
          name: String(entity.attributes.friendly_name ?? entity.entity_id),
          icon: String(entity.attributes.icon ?? resolved.domain_icons[domain] ?? "mdi:toggle-switch-outline"),
          labels: this.labelsForEntity(entity.entity_id).join(" "),
        };
      })
      .sort((a, b) => a.areaName.localeCompare(b.areaName) || a.name.localeCompare(b.name));
  }

  private labelOptions() {
    const byId = new Map<string, { id: string; name: string; icon: string }>();

    for (const label of this.registryLabels) {
      const id = label.label_id ?? label.id;
      if (!id) continue;
      byId.set(id, {
        id,
        name: label.name ?? id,
        icon: label.icon ?? "mdi:label-outline",
      });
    }

    for (const [key, label] of Object.entries(this.hass?.labels ?? {})) {
      const id = label.label_id ?? key;
      if (byId.has(id)) continue;
      byId.set(id, {
        id,
        name: label.name ?? id,
        icon: label.icon ?? "mdi:label-outline",
      });
    }

    for (const entityId of Object.keys(this.hass?.states ?? {})) {
      for (const label of this.labelsForEntity(entityId)) {
        if (!byId.has(label)) byId.set(label, { id: label, name: label, icon: "mdi:label-outline" });
      }
    }

    return [...byId.values()].sort((a, b) => a.name.localeCompare(b.name));
  }

  private templateSensorYaml(resolved: ReturnType<typeof resolveConfig>): string {
    const domains = JSON.stringify(resolved.domains);
    const excludeDomains = JSON.stringify(resolved.exclude_domains);
    const excludeEntities = JSON.stringify(resolved.exclude_entities);
    const excludeAreas = JSON.stringify(resolved.exclude_areas);
    const excludeLabels = JSON.stringify(resolved.exclude_labels);
    const activeStates = JSON.stringify(resolved.active_states);
    const inactiveStates = JSON.stringify(resolved.inactive_states);
    return `template:
  - sensor:
      - name: Area Bubble Active Entities
        unique_id: area_bubble_active_entities
        icon: mdi:power-plug
        state: >
          {% set domains = ${domains} %}
          {% set exclude_domains = ${excludeDomains} %}
          {% set exclude_entities = ${excludeEntities} %}
          {% set exclude_areas = ${excludeAreas} %}
          {% set exclude_labels = ${excludeLabels} %}
          {% set active_states = ${activeStates} %}
          {% set inactive_states = ${inactiveStates} %}
          {% set blocked = namespace(entities=[]) %}
          {% for label in exclude_labels %}
            {% set blocked.entities = blocked.entities + label_entities(label) %}
          {% endfor %}
          {% set ns = namespace(count=0) %}
          {% for s in states %}
            {% set domain = s.entity_id.split('.')[0] %}
            {% set state = s.state | lower %}
            {% set area = area_name(s.entity_id) or 'No Area' %}
            {% set area_identifier = area_id(s.entity_id) or '' %}
            {% set allowed = domain in domains and domain not in exclude_domains and s.entity_id not in exclude_entities and s.entity_id not in blocked.entities and area not in exclude_areas and area_identifier not in exclude_areas and state not in ['unavailable', 'unknown', 'none', ''] %}
            {% set is_active = false %}
            {% if active_states.get(domain) is not none %}
              {% set is_active = state in active_states.get(domain) %}
            {% elif inactive_states.get(domain) is not none %}
              {% set is_active = state not in inactive_states.get(domain) %}
            {% else %}
              {% set is_active = state == 'on' %}
            {% endif %}
            {% if allowed and is_active %}
              {% set ns.count = ns.count + 1 %}
            {% endif %}
          {% endfor %}
          {{ ns.count }}
      - name: Area Bubble Active Areas
        unique_id: area_bubble_active_areas
        icon: mdi:floor-plan
        state: >
          {% set domains = ${domains} %}
          {% set exclude_domains = ${excludeDomains} %}
          {% set exclude_entities = ${excludeEntities} %}
          {% set exclude_areas = ${excludeAreas} %}
          {% set exclude_labels = ${excludeLabels} %}
          {% set active_states = ${activeStates} %}
          {% set inactive_states = ${inactiveStates} %}
          {% set blocked = namespace(entities=[]) %}
          {% for label in exclude_labels %}
            {% set blocked.entities = blocked.entities + label_entities(label) %}
          {% endfor %}
          {% set ns = namespace(areas=[]) %}
          {% for s in states %}
            {% set domain = s.entity_id.split('.')[0] %}
            {% set state = s.state | lower %}
            {% set area = area_name(s.entity_id) or 'No Area' %}
            {% set area_identifier = area_id(s.entity_id) or '' %}
            {% set allowed = domain in domains and domain not in exclude_domains and s.entity_id not in exclude_entities and s.entity_id not in blocked.entities and area not in exclude_areas and area_identifier not in exclude_areas and state not in ['unavailable', 'unknown', 'none', ''] %}
            {% set is_active = false %}
            {% if active_states.get(domain) is not none %}
              {% set is_active = state in active_states.get(domain) %}
            {% elif inactive_states.get(domain) is not none %}
              {% set is_active = state not in inactive_states.get(domain) %}
            {% else %}
              {% set is_active = state == 'on' %}
            {% endif %}
            {% if allowed and is_active and area not in ns.areas %}
              {% set ns.areas = ns.areas + [area] %}
            {% endif %}
          {% endfor %}
          {{ ns.areas | count }}`;
  }

  private badgeYaml(): string {
    return `type: entity
entity: sensor.area_bubble_active_entities
name: דלוקים
show_name: true
show_state: true
tap_action:
  action: navigate
  navigation_path: /lovelace/0`;
  }

  private labelsForEntity(entityId: string): string[] {
    const entity = this.hass?.entities?.[entityId];
    const device = entity?.device_id ? this.hass?.devices?.[entity.device_id] : undefined;
    return [...new Set([...(entity?.labels ?? []), ...(device?.labels ?? [])])];
  }

  private editorLanguage(resolved: ReturnType<typeof resolveConfig> = resolveConfig(this.config)): EditorLanguage {
    return resolveLanguage(this.hass, resolved.language);
  }

  private fieldLabel(item: EditorSchemaItem, language: EditorLanguage): string {
    return language === "he" ? HEBREW_FIELD_LABELS[item.key] ?? item.label : item.label;
  }

  private optionLabel(value: string, fallback: string, language: EditorLanguage): string {
    return language === "he" ? HEBREW_OPTION_LABELS[value] ?? fallback : fallback;
  }

  private fieldId(key: string): string {
    return `abec-field-${key.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
  }

  private selectSection(sectionId: string): void {
    if (!sections.some((item) => item.id === sectionId)) return;
    this.activeSection = sectionId;
  }

  private changeSectionFromSelect(ev: Event): void {
    this.selectSection((ev.target as HTMLSelectElement).value);
  }

  private navigateSections(ev: KeyboardEvent, currentIndex: number): void {
    let nextIndex: number | undefined;
    if (ev.key === "ArrowDown" || ev.key === "ArrowRight") nextIndex = (currentIndex + 1) % sections.length;
    if (ev.key === "ArrowUp" || ev.key === "ArrowLeft") nextIndex = (currentIndex - 1 + sections.length) % sections.length;
    if (ev.key === "Home") nextIndex = 0;
    if (ev.key === "End") nextIndex = sections.length - 1;
    if (nextIndex === undefined) return;

    ev.preventDefault();
    this.selectSection(sections[nextIndex].id);
    void this.updateComplete.then(() => this.renderRoot.querySelector<HTMLElement>(`#abec-editor-tab-${nextIndex}`)?.focus());
  }

  private matchesSearch(text: string, search: string): boolean {
    const needle = search.trim().toLowerCase();
    return !needle || text.toLowerCase().includes(needle);
  }

  private updateSearch(ev: Event, type: "area" | "entity" | "label"): void {
    ev.stopPropagation();
    const value = (ev.target as HTMLInputElement).value;
    if (type === "area") this.areaSearch = value;
    if (type === "entity") this.entitySearch = value;
    if (type === "label") this.labelSearch = value;
  }

  private moveArea(areaId: string, direction: -1 | 1): void {
    const resolved = resolveConfig(this.config);
    const order = this.orderedAreaOptions(resolved).map((area) => area.id);
    const currentIndex = order.indexOf(areaId);
    const nextIndex = currentIndex + direction;
    if (currentIndex < 0 || nextIndex < 0 || nextIndex >= order.length) return;
    const next = [...order];
    [next[currentIndex], next[nextIndex]] = [next[nextIndex], next[currentIndex]];
    this.updateKeys({ area_sort: "custom", custom_area_order: next });
  }

  private enableCustomAreaOrder(areas: Array<{ id: string }>): void {
    const current = splitList(this.readPath("custom_area_order"));
    this.updateKeys({
      area_sort: "custom",
      custom_area_order: current.length ? current : areas.map((area) => area.id),
    });
  }

  private startAreaDrag(ev: DragEvent, areaId: string): void {
    this.draggedAreaId = areaId;
    this.dragOverAreaId = undefined;
    if (ev.dataTransfer) {
      ev.dataTransfer.effectAllowed = "move";
      ev.dataTransfer.setData("text/plain", areaId);
    }
  }

  private dragAreaOver(ev: DragEvent, areaId: string): void {
    if (!this.draggedAreaId || this.draggedAreaId === areaId) return;
    ev.preventDefault();
    if (ev.dataTransfer) ev.dataTransfer.dropEffect = "move";
    if (this.dragOverAreaId !== areaId) this.dragOverAreaId = areaId;
  }

  private dropArea(ev: DragEvent, targetAreaId: string): void {
    ev.preventDefault();
    const sourceAreaId = this.draggedAreaId ?? ev.dataTransfer?.getData("text/plain");
    this.endAreaDrag();
    if (!sourceAreaId || sourceAreaId === targetAreaId) return;

    const order = this.orderedAreaOptions(resolveConfig(this.config)).map((area) => area.id);
    const sourceIndex = order.indexOf(sourceAreaId);
    const targetIndex = order.indexOf(targetAreaId);
    if (sourceIndex < 0 || targetIndex < 0) return;

    const next = [...order];
    next.splice(sourceIndex, 1);
    const insertionIndex = next.indexOf(targetAreaId) + (sourceIndex < targetIndex ? 1 : 0);
    next.splice(insertionIndex, 0, sourceAreaId);
    this.updateKeys({ area_sort: "custom", custom_area_order: next });
  }

  private endAreaDrag(): void {
    this.draggedAreaId = undefined;
    this.dragOverAreaId = undefined;
  }

  private orderIndex(order: string[], id: string, name?: string): number {
    const byId = order.indexOf(id);
    if (byId >= 0) return byId;
    if (name) {
      const byName = order.indexOf(name);
      if (byName >= 0) return byName;
    }
    return Number.MAX_SAFE_INTEGER;
  }

  private toggleListValue(key: string, value: string, oppositeKey?: string, aliases: string[] = [value]): void {
    const current = splitList(this.readPath(key));
    const selected = aliases.some((alias) => current.includes(alias));
    const next = selected ? current.filter((item) => !aliases.includes(item)) : [...current.filter((item) => !aliases.includes(item)), value];
    const updates: Record<string, unknown> = { [key]: next };
    if (!selected && oppositeKey) {
      updates[oppositeKey] = splitList(this.readPath(oppositeKey)).filter((item) => !aliases.includes(item));
    }
    this.updateKeys(updates);
  }

  private renderField(item: EditorSchemaItem, resolved: ReturnType<typeof resolveConfig>) {
    const language = this.editorLanguage(resolved);
    const text = EDITOR_TEXT[language];
    const value = this.readPath(item.key);
    const id = this.fieldId(item.key);
    const label = this.fieldLabel(item, language);
    if (item.type === "boolean") {
      return html`
        <div class="row">
          <div class="row-text">
            <label class="row-label" for=${id}>${label}</label>
            <span class="field-helper"><code>${item.key}</code></span>
          </div>
          <input
            id=${id}
            class="native-switch"
            type="checkbox"
            role="switch"
            .checked=${Boolean(value ?? this.readResolvedPath(resolved, item.key))}
            @change=${(ev: Event) => this.updateField(item, (ev.target as HTMLInputElement).checked)}
          />
        </div>
      `;
    }
    if (item.type === "select") {
      const current = this.stringifySelectValue(value ?? this.readResolvedPath(resolved, item.key));
      return html`
        <div class="field">
          <label class="field-label" for=${id}>${label}</label>
          <select id=${id} .value=${current} @change=${(ev: Event) => this.updateField(item, this.parseSelectValue(item.key, (ev.target as HTMLSelectElement).value))}>
            ${item.options?.map((option) => html`<option value=${option.value}>${this.optionLabel(option.value, option.label, language)}</option>`)}
          </select>
          <span class="field-helper">${text.configKey}: <code>${item.key}</code></span>
        </div>
      `;
    }
    if (item.type === "number") {
      return html`
        <div class="field">
          <label class="field-label" for=${id}>${label}</label>
          <input
            id=${id}
            type="number"
            min=${item.min ?? ""}
            max=${item.max ?? ""}
            step=${item.step ?? 1}
            .value=${String(value ?? this.readResolvedPath(resolved, item.key) ?? "")}
            @change=${(ev: Event) => this.updateNumberField(item, ev.target as HTMLInputElement)}
          />
          <span class="field-helper">${text.configKey}: <code>${item.key}</code></span>
        </div>
      `;
    }
    if (item.type === "multi-text") {
      return html`
        <div class="field">
          <label class="field-label" for=${id}>${label}</label>
          <textarea id=${id} .value=${listToText(value ?? this.readResolvedPath(resolved, item.key))} @change=${(ev: Event) => this.updateField(item, splitList((ev.target as HTMLTextAreaElement).value))}></textarea>
          <span class="field-helper">${text.configKey}: <code>${item.key}</code></span>
        </div>
      `;
    }
    if (item.type === "textarea") {
      const committed = this.jsonCommittedText(item.key);
      const draft = this.jsonDrafts[item.key] ?? committed;
      const error = this.jsonErrors[item.key] ?? this.validateJson(draft);
      const dirty = draft !== committed;
      return html`
        <div class="field">
          <label class="field-label" for=${id}>${label}</label>
          <textarea
            id=${id}
            class="yaml"
            spellcheck="false"
            aria-invalid=${error ? "true" : "false"}
            aria-describedby=${`${id}-status`}
            .value=${draft}
            @input=${(ev: Event) => this.updateJsonDraft(item, (ev.target as HTMLTextAreaElement).value)}
            @keydown=${(ev: KeyboardEvent) => this.handleJsonKeydown(ev, item)}
          ></textarea>
          <div class="json-footer">
            <span id=${`${id}-status`} class="json-status ${error ? "error" : ""}" role="status" aria-live="polite">
              ${error ?? (dirty ? text.jsonValid : `${text.configKey}: ${item.key}`)}
            </span>
            <div class="json-actions">
              <button type="button" class="action-button" ?disabled=${!dirty} @click=${() => this.resetJsonDraft(item.key)}>${text.reset}</button>
              <button type="button" class="action-button primary" ?disabled=${!dirty || Boolean(error)} @click=${() => this.applyJsonDraft(item)}>${text.apply}</button>
            </div>
          </div>
        </div>
      `;
    }
    return html`
      <div class="field">
        <label class="field-label" for=${id}>${label}</label>
        <input
          id=${id}
          type="text"
          autocomplete="off"
          .value=${String(value ?? this.readResolvedPath(resolved, item.key) ?? "")}
          @change=${(ev: Event) => this.updateField(item, (ev.target as HTMLInputElement).value)}
        />
        <span class="field-helper">${text.configKey}: <code>${item.key}</code></span>
      </div>
    `;
  }

  private updateNumberField(item: EditorSchemaItem, input: HTMLInputElement): void {
    if (!input.value.trim()) {
      this.updateField(item, undefined);
      return;
    }
    const parsed = Number(input.value);
    if (!Number.isFinite(parsed)) return;
    const minimum = item.min ?? -Infinity;
    const maximum = item.max ?? Infinity;
    this.updateField(item, Math.min(maximum, Math.max(minimum, parsed)));
  }

  private updateJsonDraft(item: EditorSchemaItem, raw: string): void {
    if (!(item.key in this.jsonDraftBaselines)) this.jsonDraftBaselines[item.key] = this.jsonCommittedText(item.key);
    const error = this.validateJson(raw);
    this.jsonDrafts = { ...this.jsonDrafts, [item.key]: raw };
    const nextErrors = { ...this.jsonErrors };
    if (error) nextErrors[item.key] = error;
    else delete nextErrors[item.key];
    this.jsonErrors = nextErrors;
  }

  private validateJson(raw: string): string | undefined {
    if (!raw.trim()) return undefined;
    const language = this.editorLanguage();
    try {
      const value: unknown = JSON.parse(raw);
      if (!value || typeof value !== "object" || Array.isArray(value)) return EDITOR_TEXT[language].jsonObject;
      return undefined;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return `${EDITOR_TEXT[language].jsonInvalid}: ${message}`;
    }
  }

  private applyJsonDraft(item: EditorSchemaItem): void {
    const raw = this.jsonDrafts[item.key];
    if (raw === undefined) return;
    const error = this.validateJson(raw);
    if (error) {
      this.jsonErrors = { ...this.jsonErrors, [item.key]: error };
      return;
    }

    const value = raw.trim() ? (JSON.parse(raw) as Record<string, unknown>) : undefined;
    this.clearJsonDraft(item.key);
    this.updateField(item, value);
  }

  private handleJsonKeydown(ev: KeyboardEvent, item: EditorSchemaItem): void {
    if ((ev.ctrlKey || ev.metaKey) && ev.key === "Enter") {
      ev.preventDefault();
      this.applyJsonDraft(item);
    }
    if (ev.key === "Escape") {
      ev.preventDefault();
      this.resetJsonDraft(item.key);
    }
  }

  private resetJsonDraft(key: string): void {
    this.clearJsonDraft(key);
  }

  private clearJsonDraft(key: string): void {
    if (!(key in this.jsonDrafts) && !(key in this.jsonErrors) && !(key in this.jsonDraftBaselines)) return;
    const nextDrafts = { ...this.jsonDrafts };
    const nextErrors = { ...this.jsonErrors };
    delete nextDrafts[key];
    delete nextErrors[key];
    delete this.jsonDraftBaselines[key];
    this.jsonDrafts = nextDrafts;
    this.jsonErrors = nextErrors;
  }

  private jsonCommittedText(key: string, config: AreaBubbleExpanderCardConfig = this.config): string {
    const resolved = resolveConfig(config);
    const raw = this.readResolvedPath(config as Record<string, unknown>, key);
    const value = raw ?? this.readResolvedPath(resolved as unknown as Record<string, unknown>, key);
    return this.textareaValue(value);
  }

  private updateField(item: EditorSchemaItem, value: unknown): void {
    this.updateKey(item.key, value);
  }

  private updateKey(key: string, value: unknown): void {
    this.updateKeys({ [key]: value });
  }

  private updateKeys(updates: Record<string, unknown>): void {
    const next = this.cloneConfig(this.config) as Record<string, unknown>;
    for (const [key, value] of Object.entries(updates)) this.writePath(next, key, value);
    this.config = next as AreaBubbleExpanderCardConfig;
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        bubbles: true,
        composed: true,
        detail: { config: this.config },
      }),
    );
  }

  private cloneConfig<T extends object>(source: T): T {
    if (typeof structuredClone === "function") return structuredClone(source);
    return JSON.parse(JSON.stringify(source)) as T;
  }

  private readPath(path: string): unknown {
    return this.readResolvedPath(this.config as Record<string, unknown>, path);
  }

  private readResolvedPath(source: Record<string, unknown>, path: string): unknown {
    return path.split(".").reduce<unknown>((value, segment) => {
      if (value && typeof value === "object") return (value as Record<string, unknown>)[segment];
      return undefined;
    }, source);
  }

  private writePath(source: Record<string, unknown>, path: string, value: unknown): void {
    const parts = path.split(".");
    let cursor = source;
    for (const part of parts.slice(0, -1)) {
      const existing = cursor[part];
      if (existing && typeof existing === "object" && !Array.isArray(existing)) {
        cursor = existing as Record<string, unknown>;
        continue;
      }
      if (value === undefined || value === "") return;
      cursor[part] = {};
      cursor = cursor[part] as Record<string, unknown>;
    }
    const last = parts[parts.length - 1];
    if (value === undefined || value === "") delete cursor[last];
    else cursor[last] = value;
  }

  private textareaValue(value: unknown): string {
    if (typeof value === "string") return value;
    return JSON.stringify(value ?? {}, null, 2) ?? "{}";
  }

  private stringifySelectValue(value: unknown): string {
    if (typeof value === "boolean") return String(value);
    return String(value ?? "");
  }

  private parseSelectValue(key: string, value: string): unknown {
    if (key === "rtl") {
      if (value === "true") return true;
      if (value === "false") return false;
      return "auto";
    }
    return value;
  }
}
