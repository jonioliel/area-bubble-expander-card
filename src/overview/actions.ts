import type { HomeAssistant } from "../types";
import { entityPowerService, supportsEntityFeature } from "./features";
import type { OverviewArea, OverviewEntity, OverviewQuickActionId, OverviewSection } from "./types";

type GroupedService = {
  domain: string;
  service: string;
  data?: Record<string, unknown>;
  entityIds: string[];
};

type ServicePlan = Omit<GroupedService, "entityIds">;

const COVER_CLOSE_FEATURE = 2;

export const quickActionEntities = (area: OverviewArea, action: OverviewQuickActionId): OverviewEntity[] => {
  const available = area.allEntities.filter((item) => item.available && item.powered && !item.protected);
  const hasPowerAction = (item: OverviewEntity): boolean =>
    !["climate", "media_player", "water_heater"].includes(item.domain) || entityPowerService(item, false) !== undefined;
  if (action === "lights") return available.filter((item) => item.domain === "light");
  if (action === "switches") return available.filter((item) => item.domain === "switch" && item.section === "lights_switches");
  if (action === "climate") return available.filter((item) => item.section === "climate" && hasPowerAction(item));
  if (action === "floor_heating") return available.filter((item) => item.section === "floor_heating" && hasPowerAction(item));
  if (action === "covers") {
    return available.filter((item) => {
      if (item.domain !== "cover") return false;
      const features = item.entity.attributes.supported_features;
      return typeof features !== "number" || (features & 2) !== 0;
    });
  }
  return available.filter((item) => item.domain === "media_player" && entityPowerService(item, false) !== undefined);
};

const serviceFor = (
  action: OverviewQuickActionId,
  item: OverviewEntity,
): ServicePlan | undefined => {
  if (action === "covers" && item.domain === "cover") return { domain: "cover", service: "close_cover" };
  const plan = entityPowerService(item, false);
  return plan ? { domain: item.domain, ...plan } : undefined;
};

const groupServices = (
  entities: OverviewEntity[],
  serviceForEntity: (item: OverviewEntity) => ServicePlan | undefined,
): { groups: GroupedService[]; unsupported: string[] } => {
  const grouped = new Map<string, GroupedService>();
  const unsupported: string[] = [];
  for (const entity of entities) {
    const service = serviceForEntity(entity);
    if (!service) {
      unsupported.push(entity.entityId);
      continue;
    }
    const key = `${service.domain}.${service.service}:${JSON.stringify(service.data ?? {})}`;
    const group = grouped.get(key) ?? { ...service, entityIds: [] };
    group.entityIds.push(entity.entityId);
    grouped.set(key, group);
  }
  return { groups: [...grouped.values()], unsupported };
};

const runGroupedServices = async (
  hass: HomeAssistant,
  groups: GroupedService[],
  failureLabel: string,
): Promise<void> => {
  const results = await Promise.allSettled(
    groups.map((group) => hass.callService(group.domain, group.service, group.data, { entity_id: group.entityIds })),
  );
  const failed = results.filter((result) => result.status === "rejected");
  if (failed.length) throw new Error(`${failed.length} of ${results.length} ${failureLabel} failed.`);
};

export const runQuickAction = async (
  hass: HomeAssistant,
  area: OverviewArea,
  action: OverviewQuickActionId,
): Promise<void> => {
  const targets = quickActionEntities(area, action);
  const { groups, unsupported } = groupServices(targets, (item) => serviceFor(action, item));
  if (unsupported.length > 0) {
    throw new Error(`Unsupported entities for the ${action} area action: ${unsupported.join(", ")}.`);
  }
  await runGroupedServices(hass, groups, "area actions");
};

/** Entities that a section-wide off action is allowed to control. */
export const sectionActionEntities = (section: OverviewSection): OverviewEntity[] =>
  section.entities.filter((item) => item.available && item.powered && !item.protected && sectionOffService(section, item) !== undefined);

const sectionOffService = (section: OverviewSection, item: OverviewEntity): ServicePlan | undefined => {
  if (section.id === "covers") {
    if (item.domain !== "cover" || !supportsEntityFeature(item.entity, COVER_CLOSE_FEATURE)) return undefined;
    return { domain: "cover", service: "close_cover" };
  }
  const plan = entityPowerService(item, false);
  return plan ? { domain: item.domain, ...plan } : undefined;
};

/** Safely turns off every controllable powered entity in a section. */
export const runSectionOffAction = async (hass: HomeAssistant, section: OverviewSection): Promise<void> => {
  const targets = sectionActionEntities(section);
  const { groups, unsupported } = groupServices(targets, (item) => sectionOffService(section, item));
  if (unsupported.length > 0) {
    throw new Error(`Unsupported entities for the ${section.id} section action: ${unsupported.join(", ")}.`);
  }
  await runGroupedServices(hass, groups, "section actions");
};

export const callEntityService = (
  hass: HomeAssistant,
  entityId: string,
  service: string,
  data?: Record<string, unknown>,
): Promise<unknown> => {
  const domain = entityId.split(".")[0] ?? "homeassistant";
  return hass.callService(domain, service, data, { entity_id: entityId });
};
