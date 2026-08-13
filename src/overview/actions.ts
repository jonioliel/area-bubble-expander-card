import type { HomeAssistant } from "../types";
import { entityPowerService } from "./features";
import type { OverviewArea, OverviewEntity, OverviewQuickActionId } from "./types";

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
): { domain: string; service: string; data?: Record<string, unknown> } | undefined => {
  if (action === "covers" && item.domain === "cover") return { domain: "cover", service: "close_cover" };
  const plan = entityPowerService(item, false);
  return plan ? { domain: item.domain, ...plan } : undefined;
};

export const runQuickAction = async (
  hass: HomeAssistant,
  area: OverviewArea,
  action: OverviewQuickActionId,
): Promise<void> => {
  const targets = quickActionEntities(area, action);
  const grouped = new Map<string, { domain: string; service: string; data?: Record<string, unknown>; entityIds: string[] }>();
  const unsupported: string[] = [];
  for (const entity of targets) {
    const service = serviceFor(action, entity);
    if (!service) {
      unsupported.push(entity.entityId);
      continue;
    }
    const key = `${service.domain}.${service.service}:${JSON.stringify(service.data ?? {})}`;
    const group = grouped.get(key) ?? { ...service, entityIds: [] };
    group.entityIds.push(entity.entityId);
    grouped.set(key, group);
  }
  if (unsupported.length > 0) {
    throw new Error(`Unsupported entities for the ${action} area action: ${unsupported.join(", ")}.`);
  }
  const results = await Promise.allSettled(
    [...grouped.values()].map((group) => hass.callService(group.domain, group.service, group.data, { entity_id: group.entityIds })),
  );
  const failed = results.filter((result) => result.status === "rejected");
  if (failed.length) throw new Error(`${failed.length} of ${results.length} area actions failed.`);
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
