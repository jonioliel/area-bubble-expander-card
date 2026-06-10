import type { DiscoveredEntity, HomeAssistant, ResolvedConfig } from "../types";
import { t } from "../translations";

export const labelsForEntity = (hass: HomeAssistant | undefined, entityId: string): string[] => {
  const entityEntry = hass?.entities?.[entityId];
  const deviceEntry = entityEntry?.device_id ? hass?.devices?.[entityEntry.device_id] : undefined;
  return [...(entityEntry?.labels ?? []), ...(deviceEntry?.labels ?? [])];
};

export const isProtected = (entityId: string, labels: string[], config: ResolvedConfig): boolean => {
  const override = config.entity_overrides[entityId];
  if (override?.protected) return true;
  if (config.protected_entities.includes(entityId)) return true;
  return labels.some((label) => config.protected_labels.includes(label));
};

export const isTurnOffDisabled = (item: DiscoveredEntity, config: ResolvedConfig): string | undefined => {
  const override = config.entity_overrides[item.entityId];
  if (override?.allow_turn_off === false) return "Entity override disabled turn-off";
  if (item.protected) return t(config, undefined, "locked_by_safety");
  if (config.disable_turn_off_for_domains.includes(item.domain)) return "Domain disabled for turn-off";
  if (!config.service_mapping[item.domain]) return "Unsupported turn-off service";
  if (config.safety_mode === "strict" && item.domain === "switch") return "Strict safety mode protects switches";
  return undefined;
};

export const visibleByProtection = (item: DiscoveredEntity, config: ResolvedConfig): boolean => {
  if (!item.protected) return true;
  return config.protected_entity_behavior !== "hide";
};

export const safeTurnOffCandidates = (items: DiscoveredEntity[], config: ResolvedConfig): DiscoveredEntity[] =>
  items.filter((item) => !isTurnOffDisabled(item, config));
