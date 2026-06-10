import { DEFAULT_DOMAIN_ICONS } from "../constants";
import { formatSecondary, friendlyName } from "./format";
import { isAreaIncluded, resolveArea } from "./area";
import { isActiveEntity } from "./active-rules";
import { isProtected, isTurnOffDisabled, labelsForEntity, visibleByProtection } from "./safety";
import { sortAreas, sortEntities } from "./sorting";
import type { AreaGroup, DiscoveredEntity, HassEntity, HomeAssistant, ResolvedConfig } from "../types";

const domainFromEntityId = (entityId: string): string => entityId.split(".")[0] ?? "";

const regexes = (patterns: string[]): RegExp[] =>
  patterns.flatMap((pattern) => {
    try {
      return [new RegExp(pattern)];
    } catch {
      return [];
    }
  });

const matchesAny = (value: string, patterns: RegExp[]): boolean => patterns.some((pattern) => pattern.test(value));

export const discoverActiveEntities = (
  hass: HomeAssistant | undefined,
  config: ResolvedConfig,
): { groups: AreaGroup[]; skipped: Array<{ entity_id: string; reasons: string[] }> } => {
  if (!hass?.states) return { groups: [], skipped: [] };

  const grouped = new Map<string, AreaGroup>();
  const skipped: Array<{ entity_id: string; reasons: string[] }> = [];
  const excludeRegexes = regexes(config.exclude_by_regex);
  const includedDomainSet = new Set(config.domains);
  const excludedDomainSet = new Set(config.exclude_domains);
  const includeEntitySet = new Set(config.include_entities);

  for (const entity of Object.values(hass.states)) {
    const entityId = entity.entity_id;
    const domain = domainFromEntityId(entityId);
    const entityEntry = hass.entities?.[entityId];
    const override = config.entity_overrides[entityId];
    const labels = labelsForEntity(hass, entityId);
    const reasons: string[] = [];

    if (override?.hidden) reasons.push("hidden by entity override");
    if (config.exclude_entities.includes(entityId)) reasons.push("excluded entity");
    if (config.exclude_unavailable && entity.state === "unavailable") reasons.push("unavailable");
    if (config.exclude_hidden_entities && entityEntry?.hidden_by) reasons.push("hidden entity");
    if (entityEntry?.entity_category && config.exclude_entity_category.includes(entityEntry.entity_category)) reasons.push("excluded entity category");
    if (excludedDomainSet.has(domain)) reasons.push("excluded domain");
    if (!includedDomainSet.has(domain) && !includeEntitySet.has(entityId)) reasons.push("domain not included");
    if (labels.some((label) => config.exclude_labels.includes(label))) reasons.push("excluded label");
    if (matchesAny(entityId, excludeRegexes)) reasons.push("excluded by regex");

    const area = resolveArea(hass, config, entityId);
    if (!isAreaIncluded(area.id, area.name, config)) reasons.push("excluded area");
    if (!isActiveEntity(entity as HassEntity, domain, config)) reasons.push("inactive state");

    if (reasons.length) {
      skipped.push({ entity_id: entityId, reasons });
      continue;
    }

    const protectedEntity = isProtected(entityId, labels, config);
    const discovered: DiscoveredEntity = {
      entity,
      entityId,
      domain,
      name: friendlyName(entity, override?.name),
      icon: override?.icon ?? String(entity.attributes.icon ?? config.domain_icons[domain] ?? DEFAULT_DOMAIN_ICONS[domain] ?? "mdi:toggle-switch-outline"),
      areaId: area.id,
      areaName: area.name,
      areaIcon: area.icon,
      labels,
      category: entityEntry?.entity_category,
      hidden: Boolean(entityEntry?.hidden_by),
      active: true,
      protected: protectedEntity,
      controllable: true,
      secondary: formatSecondary(entity, domain, config, hass),
      skipReasons: [],
    };
    discovered.disabledReason = isTurnOffDisabled(discovered, config);
    discovered.controllable = !discovered.disabledReason;

    if (!visibleByProtection(discovered, config)) {
      skipped.push({ entity_id: entityId, reasons: ["protected hidden"] });
      continue;
    }

    const existing = grouped.get(area.id) ?? {
      id: area.id,
      name: area.name,
      icon: area.icon,
      entities: [],
      domainCounts: {},
      protectedCount: 0,
    };
    existing.entities.push(discovered);
    existing.domainCounts[domain] = (existing.domainCounts[domain] ?? 0) + 1;
    if (protectedEntity) existing.protectedCount += 1;
    grouped.set(area.id, existing);
  }

  const groups = [...grouped.values()].map((group) => ({ ...group, entities: sortEntities(group.entities, config) }));
  return { groups: sortAreas(groups, config), skipped };
};
