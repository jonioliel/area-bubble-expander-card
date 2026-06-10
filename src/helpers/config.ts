import { DEFAULT_CONFIG, DEFAULT_STYLE } from "../constants";
import type { AreaBubbleExpanderCardConfig, ResolvedConfig } from "../types";

const arrayValue = <T>(value: T[] | undefined): T[] => (Array.isArray(value) ? [...value] : []);

export const resolveConfig = (config: AreaBubbleExpanderCardConfig): ResolvedConfig => {
  const merged = {
    ...DEFAULT_CONFIG,
    ...config,
    style: {
      ...DEFAULT_STYLE,
      ...(config.style ?? {}),
    },
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
    active_states: { ...(DEFAULT_CONFIG.active_states ?? {}), ...(config.active_states ?? {}) },
    inactive_states: { ...(DEFAULT_CONFIG.inactive_states ?? {}), ...(config.inactive_states ?? {}) },
    protected_entities: arrayValue(merged.protected_entities),
    disable_turn_off_for_domains: arrayValue(merged.disable_turn_off_for_domains),
    dangerous_domains: arrayValue(merged.dangerous_domains),
    service_mapping: { ...(DEFAULT_CONFIG.service_mapping ?? {}), ...(config.service_mapping ?? {}) },
    custom_area_order: arrayValue(merged.custom_area_order),
    custom_entity_order: arrayValue(merged.custom_entity_order),
    areas: { ...(merged.areas ?? {}) },
    entity_overrides: { ...(merged.entity_overrides ?? {}) },
    labels: { ...(merged.labels ?? {}) },
    domain_labels: { ...(merged.domain_labels ?? {}) },
    domain_icons: { ...(DEFAULT_CONFIG.domain_icons ?? {}), ...(merged.domain_icons ?? {}) },
    style: { ...DEFAULT_STYLE, ...(merged.style ?? {}) },
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
