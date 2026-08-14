import type { HomeAssistant } from "../types";
import { entityPowerService, supportsEntityFeature, type EntityServicePlan } from "./features";
import type { OverviewArea, OverviewEntity, OverviewQuickActionId, OverviewSection } from "./types";

type GroupedService = {
  domain: string;
  service: string;
  data?: Record<string, unknown>;
  entityIds: string[];
};

type ServicePlan = Omit<GroupedService, "entityIds">;

type PlannedEntityService = {
  entity: OverviewEntity;
  service: ServicePlan;
};

const COVER_CLOSE_FEATURE = 2;
const COVER_OPEN_FEATURE = 1;

const isQuickActionMember = (item: OverviewEntity, action: OverviewQuickActionId): boolean => {
  if (action === "lights") return item.domain === "light";
  if (action === "switches") return item.domain === "switch" && item.section === "lights_switches";
  if (action === "climate") return item.section === "climate";
  if (action === "floor_heating") return item.section === "floor_heating";
  if (action === "covers") return item.domain === "cover";
  return item.domain === "media_player";
};

/** Every member displayed by a quick-action category, regardless of its state or safety flags. */
export const quickActionMembers = (area: OverviewArea, action: OverviewQuickActionId): OverviewEntity[] =>
  area.allEntities.filter((item) => isQuickActionMember(item, action));

export type ActiveQuickActionSummary = {
  action: OverviewQuickActionId;
  entities: OverviewEntity[];
};

/**
 * Categories shown in the collapsed Area summary. A category is useful there
 * only while at least one of its members is powered; the popup still receives
 * the complete member list once the active category is opened.
 */
export const activeQuickActionSummaries = (
  area: OverviewArea,
  actions: OverviewQuickActionId[],
): ActiveQuickActionSummary[] =>
  actions
    .map((action) => ({ action, entities: quickActionMembers(area, action) }))
    .filter(({ entities }) => entities.some((item) => item.powered && item.ignoreActivity !== true));

/** Directional service for an individual quick-action member. */
export const quickActionEntityService = (
  action: OverviewQuickActionId,
  item: OverviewEntity,
  turnOn: boolean,
): EntityServicePlan | undefined => {
  if (!isQuickActionMember(item, action)) return undefined;
  if (action === "covers") {
    const feature = turnOn ? COVER_OPEN_FEATURE : COVER_CLOSE_FEATURE;
    if (item.domain !== "cover" || !supportsEntityFeature(item.entity, feature)) return undefined;
    return { service: turnOn ? "open_cover" : "close_cover" };
  }
  return entityPowerService(item, turnOn);
};

const groupServices = (planned: PlannedEntityService[]): GroupedService[] => {
  const grouped = new Map<string, GroupedService>();
  for (const { entity, service } of planned) {
    const key = `${service.domain}.${service.service}:${JSON.stringify(service.data ?? {})}`;
    const group = grouped.get(key) ?? { ...service, entityIds: [] };
    group.entityIds.push(entity.entityId);
    grouped.set(key, group);
  }
  return [...grouped.values()];
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

const planQuickAction = (
  area: OverviewArea,
  action: OverviewQuickActionId,
  turnOn: boolean,
): PlannedEntityService[] => {
  const planned: PlannedEntityService[] = [];
  for (const entity of quickActionMembers(area, action)) {
    if (!entity.available || entity.protected || entity.powered === turnOn) continue;
    const service = quickActionEntityService(action, entity, turnOn);
    if (service) planned.push({ entity, service: { domain: entity.domain, ...service } });
  }
  return planned;
};

/** Safe, controllable quick-action members that still need the requested state. */
export const quickActionActionEntities = (
  area: OverviewArea,
  action: OverviewQuickActionId,
  turnOn: boolean,
): OverviewEntity[] => planQuickAction(area, action, turnOn).map(({ entity }) => entity);

/** Backward-compatible selection for a quick-action OFF operation. */
export const quickActionEntities = (area: OverviewArea, action: OverviewQuickActionId): OverviewEntity[] =>
  quickActionActionEntities(area, action, false);

export const runQuickActionAction = async (
  hass: HomeAssistant,
  area: OverviewArea,
  action: OverviewQuickActionId,
  turnOn: boolean,
): Promise<void> => {
  const planned = planQuickAction(area, action, turnOn);
  await runGroupedServices(hass, groupServices(planned), "area actions");
};

/** Backward-compatible wrapper for the original quick-action OFF operation. */
export const runQuickAction = (
  hass: HomeAssistant,
  area: OverviewArea,
  action: OverviewQuickActionId,
): Promise<void> => runQuickActionAction(hass, area, action, false);

const planAreaAction = (area: OverviewArea, turnOn: boolean): PlannedEntityService[] => {
  const planned: PlannedEntityService[] = [];
  for (const entity of area.allEntities) {
    // A cover is informational at room/floor level. Open covers are controlled
    // from their category but never make a room active or join room-wide power.
    if (entity.domain === "cover" || !entity.available || entity.protected || entity.powered === turnOn) continue;
    const service = entityPowerService(entity, turnOn);
    if (service) planned.push({ entity, service: { domain: entity.domain, ...service } });
  }
  return planned;
};

/** Safe entities controlled by a room-wide action; covers are intentionally excluded. */
export const areaActionEntities = (area: OverviewArea, turnOn = false): OverviewEntity[] =>
  planAreaAction(area, turnOn).map(({ entity }) => entity);

/** Turns a room on/off without changing covers or protected/unavailable devices. */
export const runAreaAction = async (
  hass: HomeAssistant,
  area: OverviewArea,
  turnOn: boolean,
): Promise<void> => {
  await runGroupedServices(hass, groupServices(planAreaAction(area, turnOn)), "room actions");
};

const sectionService = (
  section: OverviewSection,
  item: OverviewEntity,
  turnOn: boolean,
): ServicePlan | undefined => {
  if (section.id === "covers") {
    const feature = turnOn ? COVER_OPEN_FEATURE : COVER_CLOSE_FEATURE;
    if (item.domain !== "cover" || !supportsEntityFeature(item.entity, feature)) return undefined;
    return { domain: "cover", service: turnOn ? "open_cover" : "close_cover" };
  }
  const plan = entityPowerService(item, turnOn);
  return plan ? { domain: item.domain, ...plan } : undefined;
};

const planSectionAction = (section: OverviewSection, turnOn: boolean): PlannedEntityService[] => {
  const planned: PlannedEntityService[] = [];
  for (const entity of section.entities) {
    if (!entity.available || entity.protected || entity.powered === turnOn) continue;
    const service = sectionService(section, entity, turnOn);
    if (service) planned.push({ entity, service });
  }
  return planned;
};

/** Entities that a section-wide on/off action can safely control. */
export const sectionActionEntities = (section: OverviewSection, turnOn = false): OverviewEntity[] =>
  planSectionAction(section, turnOn).map(({ entity }) => entity);

/** Safely turns every controllable entity in a section on or off. */
export const runSectionAction = async (
  hass: HomeAssistant,
  section: OverviewSection,
  turnOn: boolean,
): Promise<void> => {
  const planned = planSectionAction(section, turnOn);
  // Build and validate the complete service plan before the first HA call. This
  // keeps unsupported entities out without risking a partially planned action.
  await runGroupedServices(hass, groupServices(planned), "section actions");
};

/** Backward-compatible wrapper for the original section-wide off action. */
export const runSectionOffAction = (hass: HomeAssistant, section: OverviewSection): Promise<void> =>
  runSectionAction(hass, section, false);

export const callEntityService = (
  hass: HomeAssistant,
  entityId: string,
  service: string,
  data?: Record<string, unknown>,
): Promise<unknown> => {
  const domain = entityId.split(".")[0] ?? "homeassistant";
  return hass.callService(domain, service, data, { entity_id: entityId });
};
