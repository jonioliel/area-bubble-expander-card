import type { AreaGroup, DiscoveredEntity, ResolvedConfig } from "../types";

const orderIndex = (order: string[], id: string, name?: string): number => {
  const byId = order.indexOf(id);
  if (byId >= 0) return byId;
  if (name) {
    const byName = order.indexOf(name);
    if (byName >= 0) return byName;
  }
  return Number.MAX_SAFE_INTEGER;
};

export const sortAreas = (groups: AreaGroup[], config: ResolvedConfig): AreaGroup[] => {
  const sorted = [...groups];
  if (config.area_sort === "original") return sorted;
  if (config.area_sort === "name") return sorted.sort((a, b) => a.name.localeCompare(b.name));
  if (config.area_sort === "count_asc") return sorted.sort((a, b) => a.entities.length - b.entities.length || a.name.localeCompare(b.name));
  if (config.area_sort === "custom") {
    return sorted.sort(
      (a, b) => orderIndex(config.custom_area_order, a.id, a.name) - orderIndex(config.custom_area_order, b.id, b.name) || a.name.localeCompare(b.name),
    );
  }
  return sorted.sort((a, b) => b.entities.length - a.entities.length || a.name.localeCompare(b.name));
};

export const sortEntities = (items: DiscoveredEntity[], config: ResolvedConfig): DiscoveredEntity[] => {
  const sorted = [...items];
  if (config.entity_sort === "name") return sorted.sort((a, b) => a.name.localeCompare(b.name));
  if (config.entity_sort === "state") return sorted.sort((a, b) => a.entity.state.localeCompare(b.entity.state) || a.name.localeCompare(b.name));
  if (config.entity_sort === "last_changed") {
    return sorted.sort((a, b) => new Date(b.entity.last_changed).getTime() - new Date(a.entity.last_changed).getTime());
  }
  if (config.entity_sort === "custom") {
    return sorted.sort((a, b) => orderIndex(config.custom_entity_order, a.entityId) - orderIndex(config.custom_entity_order, b.entityId));
  }
  return sorted.sort((a, b) => a.domain.localeCompare(b.domain) || a.name.localeCompare(b.name));
};
