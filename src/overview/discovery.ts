import { SECTION_ICONS } from "./constants";
import { overviewSectionTitle } from "./translations";
import type { HassAreaRegistryEntry, HassEntity, HomeAssistant } from "../types";
import type {
  OverviewArea,
  OverviewDiscovery,
  OverviewEntity,
  OverviewSectionId,
  OccupancyState,
  ResolvedOverviewConfig,
} from "./types";

const domainOf = (entityId: string): string => entityId.split(".")[0] ?? "";
const finiteNumber = (value: unknown): number | undefined =>
  typeof value === "number" && Number.isFinite(value) ? value : typeof value === "string" && value.trim() && Number.isFinite(Number(value)) ? Number(value) : undefined;

const areaRegistry = (hass: HomeAssistant | undefined): Map<string, HassAreaRegistryEntry> => {
  const result = new Map<string, HassAreaRegistryEntry>();
  for (const [key, area] of Object.entries(hass?.areas ?? {})) result.set(area.area_id ?? area.id ?? key, area);
  return result;
};

const floorEntries = (hass: HomeAssistant | undefined) =>
  Object.entries(hass?.floors ?? {}).map(([key, floor]) => ({ ...floor, id: floor.floor_id ?? floor.id ?? key }));

export const overviewEntityAreaId = (hass: HomeAssistant | undefined, entityId: string): string | undefined => {
  const entry = hass?.entities?.[entityId];
  const device = entry?.device_id ? hass?.devices?.[entry.device_id] : undefined;
  return entry?.area_id ?? device?.area_id ?? undefined;
};

const labelsForEntity = (hass: HomeAssistant | undefined, entityId: string): string[] => {
  const entry = hass?.entities?.[entityId];
  const device = entry?.device_id ? hass?.devices?.[entry.device_id] : undefined;
  return [...new Set([...(entry?.labels ?? []), ...(device?.labels ?? [])])];
};

const forcedSection = (
  config: ResolvedOverviewConfig,
  areaId: string,
  areaName: string | undefined,
  entityId: string,
): OverviewSectionId | undefined => {
  const entityOverride = config.entity_overrides[entityId];
  if (entityOverride?.section) return entityOverride.section;
  const areaOverride = config.area_overrides[areaId] ?? config.area_overrides[areaName ?? ""];
  for (const section of config.section_order) {
    if (areaOverride?.include_entities?.[section]?.includes(entityId)) return section;
    if (config.include_entities[section]?.includes(entityId)) return section;
  }
  return undefined;
};

const classify = (
  config: ResolvedOverviewConfig,
  areaId: string,
  areaName: string | undefined,
  entityId: string,
  domain: string,
  labels: string[],
): OverviewSectionId | undefined => {
  const forced = forcedSection(config, areaId, areaName, entityId);
  if (forced) return forced;
  if (config.floor_heating_entities.includes(entityId) || labels.some((label) => config.floor_heating_labels.includes(label))) {
    return "floor_heating";
  }
  if (domain === "climate" || domain === "fan") return "climate";
  if (domain === "cover") return "covers";
  if (domain === "light" || domain === "switch") return "lights_switches";
  if (domain === "media_player") return "media";
  return undefined;
};

export const isOverviewEntityActive = (entity: HassEntity, domain = domainOf(entity.entity_id)): boolean => {
  const state = String(entity.state ?? "").toLowerCase();
  if (["", "unknown", "unavailable", "off", "closed", "idle", "standby"].includes(state)) return false;
  if (domain === "climate") return state !== "off";
  if (domain === "cover") return ["open", "opening", "closing"].includes(state);
  if (domain === "media_player") return ["on", "playing", "paused", "buffering"].includes(state);
  return state === "on";
};

const entityName = (hass: HomeAssistant | undefined, entity: HassEntity, override?: string): string =>
  override || hass?.formatEntityName?.(entity) || String(entity.attributes.friendly_name ?? entity.entity_id);

const entityIcon = (entity: HassEntity, domain: string, override?: string): string => {
  if (override) return override;
  if (typeof entity.attributes.icon === "string") return entity.attributes.icon;
  return {
    climate: "mdi:air-conditioner",
    fan: "mdi:fan",
    cover: "mdi:window-shutter",
    light: "mdi:lightbulb",
    switch: "mdi:toggle-switch",
    media_player: "mdi:speaker",
  }[domain] ?? "mdi:circle-outline";
};

const orderIndex = (order: string[] | undefined, entityId: string): number => {
  const index = order?.indexOf(entityId) ?? -1;
  return index < 0 ? Number.MAX_SAFE_INTEGER : index;
};

const temperatureFromEntity = (entity: HassEntity | undefined): { value?: number; unit?: string } => {
  if (!entity) return {};
  const current = finiteNumber(entity.attributes.current_temperature);
  const state = finiteNumber(entity.state);
  const value = current ?? state;
  const unit = typeof entity.attributes.unit_of_measurement === "string" ? entity.attributes.unit_of_measurement : undefined;
  return { value, unit };
};

const median = (values: number[]): number | undefined => {
  if (!values.length) return undefined;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
};

const resolveTemperature = (
  hass: HomeAssistant | undefined,
  areaId: string,
  area: HassAreaRegistryEntry | undefined,
  entityIds: string[],
  config: ResolvedOverviewConfig,
): { temperature?: number; unit?: string } => {
  const override = config.area_overrides[areaId] ?? config.area_overrides[area?.name ?? ""];
  const configuredCandidates = [...new Set([override?.temperature_entity, area?.temperature_entity_id].filter((item): item is string => Boolean(item)))];
  for (const configured of configuredCandidates) {
    const selected = temperatureFromEntity(hass?.states[configured]);
    if (selected.value !== undefined) return { temperature: selected.value, unit: selected.unit };
  }

  const sensors = entityIds
    .map((entityId) => hass?.states[entityId])
    .filter((entity): entity is HassEntity => Boolean(entity))
    .filter((entity) => domainOf(entity.entity_id) === "sensor" && entity.attributes.device_class === "temperature")
    .map(temperatureFromEntity)
    .filter((item): item is { value: number; unit?: string } => item.value !== undefined);
  if (sensors.length) return { temperature: median(sensors.map((item) => item.value)), unit: sensors.find((item) => item.unit)?.unit };

  const climates = entityIds
    .map((entityId) => hass?.states[entityId])
    .filter((entity): entity is HassEntity => entity !== undefined && domainOf(entity.entity_id) === "climate")
    .map(temperatureFromEntity)
    .filter((item): item is { value: number; unit?: string } => item.value !== undefined);
  return { temperature: median(climates.map((item) => item.value)), unit: climates.find((item) => item.unit)?.unit };
};

const resolveOccupancy = (
  hass: HomeAssistant | undefined,
  areaId: string,
  areaName: string | undefined,
  areaEntityIds: string[],
  config: ResolvedOverviewConfig,
): { occupancy: OccupancyState; entities: string[] } => {
  const explicit = (config.area_overrides[areaId] ?? config.area_overrides[areaName ?? ""])?.occupancy_entities ?? [];
  const candidates = explicit.length
    ? explicit
    : areaEntityIds.filter((entityId) => {
        const entity = hass?.states[entityId];
        return domainOf(entityId) === "binary_sensor" && config.occupancy_device_classes.includes(String(entity?.attributes.device_class ?? ""));
      });
  if (!candidates.length) return { occupancy: "none", entities: [] };
  const states = candidates.map((entityId) => String(hass?.states[entityId]?.state ?? "unknown").toLowerCase());
  if (states.some((state) => state === "on")) return { occupancy: "occupied", entities: candidates };
  if (states.every((state) => state === "off")) return { occupancy: "vacant", entities: candidates };
  return { occupancy: "unknown", entities: candidates };
};

const createArea = (
  hass: HomeAssistant | undefined,
  config: ResolvedOverviewConfig,
  areaId: string,
  registryArea: HassAreaRegistryEntry | undefined,
  assignedIds: string[],
): OverviewArea | undefined => {
  const override = config.area_overrides[areaId] ?? config.area_overrides[registryArea?.name ?? ""];
  if (override?.hidden) return undefined;
  const forcedIds = Object.values(override?.include_entities ?? {}).flat();
  const candidateIds = [...new Set([...assignedIds, ...forcedIds])];
  const excluded = new Set([...config.exclude_entities, ...(override?.exclude_entities ?? [])]);
  const entities: OverviewEntity[] = [];

  for (const entityId of candidateIds) {
    const entity = hass?.states[entityId];
    if (!entity || excluded.has(entityId)) continue;
    const registryEntity = hass?.entities?.[entityId];
    const device = registryEntity?.device_id ? hass?.devices?.[registryEntity.device_id] : undefined;
    const entityOverride = config.entity_overrides[entityId];
    if (entityOverride?.hidden || registryEntity?.hidden || registryEntity?.hidden_by || registryEntity?.disabled_by || device?.disabled_by) continue;
    if (registryEntity?.entity_category === "config" || registryEntity?.entity_category === "diagnostic") continue;
    const domain = domainOf(entityId);
    const labels = labelsForEntity(hass, entityId);
    const section = classify(config, areaId, registryArea?.name, entityId, domain, labels);
    if (!section) continue;
    entities.push({
      entity,
      entityId,
      domain,
      name: entityName(hass, entity, entityOverride?.name),
      icon: entityIcon(entity, domain, entityOverride?.icon),
      areaId,
      section,
      labels,
      available: !["unavailable", "unknown"].includes(entity.state),
      active: isOverviewEntityActive(entity, domain),
      protected:
        entityOverride?.protected === true ||
        config.protected_entities.includes(entityId) ||
        labels.some((label) => config.protected_labels.includes(label)),
    });
  }

  const sectionOrder = override?.section_order?.length ? override.section_order : config.section_order;
  const sections = sectionOrder
    .map((sectionId) => {
      const sectionEntities = entities
        .filter((item) => item.section === sectionId)
        .sort(
          (a, b) =>
            orderIndex(override?.entity_order?.[sectionId], a.entityId) - orderIndex(override?.entity_order?.[sectionId], b.entityId) ||
            a.name.localeCompare(b.name),
        );
      return {
        id: sectionId,
        title: overviewSectionTitle(hass, config, sectionId, override?.section_titles?.[sectionId]),
        icon: SECTION_ICONS[sectionId],
        entities: sectionEntities,
        activeCount: sectionEntities.filter((item) => item.active).length,
      };
    })
    .filter((section) => config.show_empty_sections || section.entities.length > 0);

  const temperature = resolveTemperature(hass, areaId, registryArea, assignedIds, config);
  const occupancy = resolveOccupancy(hass, areaId, registryArea?.name, assignedIds, config);
  return {
    id: areaId,
    name: override?.name ?? registryArea?.name ?? areaId,
    icon: override?.icon ?? registryArea?.icon ?? "mdi:floor-plan",
    floorId: registryArea?.floor_id ?? undefined,
    sections,
    allEntities: entities,
    temperature: temperature.temperature,
    temperatureUnit: temperature.unit ?? hass?.config?.unit_system?.temperature ?? "°C",
    occupancy: occupancy.occupancy,
    occupancyEntities: occupancy.entities,
  };
};

const targetAreaIds = (
  hass: HomeAssistant | undefined,
  config: ResolvedOverviewConfig,
  registry: Map<string, HassAreaRegistryEntry>,
): { ids: string[]; targetName: string; targetIcon: string; kind: OverviewDiscovery["targetKind"]; warnings: string[] } => {
  if (config.area) {
    const match = [...registry.entries()].find(([id, area]) => id === config.area || area.name === config.area);
    if (!match) return { ids: [], targetName: config.area, targetIcon: "mdi:map-marker-alert", kind: "area", warnings: [`Area not found: ${config.area}`] };
    return { ids: [match[0]], targetName: match[1].name, targetIcon: match[1].icon ?? "mdi:floor-plan", kind: "area", warnings: [] };
  }
  if (config.floor) {
    const floor = floorEntries(hass).find((item) => item.id === config.floor || item.name === config.floor);
    if (!floor) return { ids: [], targetName: config.floor, targetIcon: "mdi:home-floor-0", kind: "floor", warnings: [`Floor not found: ${config.floor}`] };
    const ids = [...registry.entries()].filter(([, area]) => area.floor_id === floor.id).map(([id]) => id);
    return { ids, targetName: floor.name, targetIcon: floor.icon ?? "mdi:home-floor-0", kind: "floor", warnings: ids.length ? [] : [`Floor has no areas: ${floor.name}`] };
  }
  return { ids: [], targetName: "", targetIcon: "mdi:floor-plan", kind: "none", warnings: ["No area or floor configured"] };
};

export const discoverOverview = (hass: HomeAssistant | undefined, config: ResolvedOverviewConfig): OverviewDiscovery => {
  const registry = areaRegistry(hass);
  const target = targetAreaIds(hass, config, registry);
  const entitiesByArea = new Map<string, string[]>();
  for (const entityId of Object.keys(hass?.states ?? {})) {
    const areaId = overviewEntityAreaId(hass, entityId);
    if (!areaId) continue;
    const areaEntities = entitiesByArea.get(areaId) ?? [];
    areaEntities.push(entityId);
    entitiesByArea.set(areaId, areaEntities);
  }
  const areaOrderIndex = (id: string, name: string): number => {
    const index = config.area_order.findIndex((item) => item === id || item === name);
    return index < 0 ? Number.MAX_SAFE_INTEGER : index;
  };
  const areas = target.ids
    .map((areaId) => createArea(hass, config, areaId, registry.get(areaId), entitiesByArea.get(areaId) ?? []))
    .filter((area): area is OverviewArea => Boolean(area))
    .sort((a, b) => areaOrderIndex(a.id, a.name) - areaOrderIndex(b.id, b.name) || a.name.localeCompare(b.name));
  return {
    areas,
    targetName: config.title || target.targetName,
    targetIcon: target.targetIcon,
    targetKind: target.kind,
    warnings: target.warnings,
  };
};
