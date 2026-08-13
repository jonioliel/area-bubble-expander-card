import { DEFAULT_CONFIG, DEFAULT_STYLE, STYLE_PRESETS } from "../constants";
import type { AreaBubbleExpanderCardConfig, ResolvedConfig } from "../types";

const arrayValue = <T>(value: T[] | undefined): T[] => (Array.isArray(value) ? [...value] : []);
const objectValue = <T extends Record<string, unknown>>(value: unknown): Partial<T> =>
  value && typeof value === "object" && !Array.isArray(value) ? (value as Partial<T>) : {};

export const resolveConfig = (config: AreaBubbleExpanderCardConfig): ResolvedConfig => {
  const configuredStyle = objectValue(config.style);
  const presetName = typeof configuredStyle.preset === "string" ? configuredStyle.preset : DEFAULT_STYLE.preset;
  const presetStyle = STYLE_PRESETS[presetName as keyof typeof STYLE_PRESETS] ?? {};
  const resolvedStyle = { ...DEFAULT_STYLE, ...presetStyle, ...configuredStyle };
  const merged = {
    ...DEFAULT_CONFIG,
    ...config,
    style: resolvedStyle,
  };

  return {
    ...merged,
    type: "custom:area-bubble-expander-card",
    title: merged.title ?? "",
    empty_title: merged.empty_title ?? "",
    empty_subtitle: merged.empty_subtitle ?? "",
    include_entities: arrayValue(merged.include_entities),
    exclude_entities: arrayValue(merged.exclude_entities),
    include_areas: arrayValue(merged.include_areas),
    exclude_areas: arrayValue(merged.exclude_areas),
    exclude_labels: arrayValue(merged.exclude_labels),
    exclude_entity_category: arrayValue(merged.exclude_entity_category),
    exclude_by_regex: arrayValue(merged.exclude_by_regex),
    active_states: { ...(DEFAULT_CONFIG.active_states ?? {}), ...objectValue<Record<string, string[]>>(config.active_states) },
    inactive_states: { ...(DEFAULT_CONFIG.inactive_states ?? {}), ...objectValue<Record<string, string[]>>(config.inactive_states) },
    protected_entities: arrayValue(merged.protected_entities),
    disable_turn_off_for_domains: arrayValue(merged.disable_turn_off_for_domains),
    dangerous_domains: arrayValue(merged.dangerous_domains),
    service_mapping: { ...(DEFAULT_CONFIG.service_mapping ?? {}), ...objectValue<Record<string, string>>(config.service_mapping) },
    custom_area_order: arrayValue(merged.custom_area_order),
    custom_entity_order: arrayValue(merged.custom_entity_order),
    areas: { ...objectValue(merged.areas) },
    entity_overrides: { ...objectValue(merged.entity_overrides) },
    labels: { ...objectValue(merged.labels) },
    domain_labels: { ...objectValue(merged.domain_labels) },
    domain_icons: { ...(DEFAULT_CONFIG.domain_icons ?? {}), ...objectValue<Record<string, string>>(merged.domain_icons) },
    style: resolvedStyle,
  } as ResolvedConfig;
};

export const validateConfig = (config: AreaBubbleExpanderCardConfig): void => {
  if (!config || typeof config !== "object") {
    throw new Error("Invalid Area Bubble Expander Card configuration.");
  }
  if (config.type && config.type !== "custom:area-bubble-expander-card") {
    throw new Error("Card type must be custom:area-bubble-expander-card.");
  }
};

export const splitList = (value: unknown): string[] => {
  if (Array.isArray(value)) return value.map(String).map((item) => item.trim()).filter(Boolean);
  if (typeof value !== "string") return [];
  return value
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);
};

export const listToText = (value: unknown): string => (Array.isArray(value) ? value.join("\n") : "");
