import { t } from "../translations";
import type { HassAreaRegistryEntry, HomeAssistant, ResolvedConfig } from "../types";

export const areaEntries = (hass: HomeAssistant | undefined): Map<string, HassAreaRegistryEntry> => {
  const map = new Map<string, HassAreaRegistryEntry>();
  for (const [key, area] of Object.entries(hass?.areas ?? {})) {
    const id = area.area_id ?? area.id ?? key;
    map.set(id, area);
  }
  return map;
};

export const resolveArea = (
  hass: HomeAssistant | undefined,
  config: ResolvedConfig,
  entityId: string,
): { id: string; name: string; icon: string } => {
  const areas = areaEntries(hass);
  const entityEntry = hass?.entities?.[entityId];
  const deviceEntry = entityEntry?.device_id ? hass?.devices?.[entityEntry.device_id] : undefined;
  const areaId = entityEntry?.area_id ?? deviceEntry?.area_id ?? "no_area";
  const area = areaId ? areas.get(areaId) : undefined;
  const override = config.areas[areaId] ?? config.areas[area?.name ?? ""];
  const fallbackName = area?.name ?? t(config, hass, "no_area");
  const name = override?.name ?? fallbackName;
  return {
    id: areaId || "no_area",
    name,
    icon: override?.icon ?? area?.icon ?? (areaId === "no_area" ? "mdi:home-question" : "mdi:floor-plan"),
  };
};

export const isAreaIncluded = (areaId: string, areaName: string, config: ResolvedConfig): boolean => {
  const override = config.areas[areaId] ?? config.areas[areaName];
  if (override?.hidden) return false;
  if (config.include_areas.length && !config.include_areas.includes(areaId) && !config.include_areas.includes(areaName)) {
    return false;
  }
  return !config.exclude_areas.includes(areaId) && !config.exclude_areas.includes(areaName);
};
