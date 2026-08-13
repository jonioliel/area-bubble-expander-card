import type { HomeAssistant } from "../types";
import type { OverviewArea, OverviewEntity, OverviewQuickActionId } from "./types";

export const quickActionEntities = (area: OverviewArea, action: OverviewQuickActionId): OverviewEntity[] => {
  const available = area.allEntities.filter((item) => item.available && item.active && !item.protected);
  if (action === "lights") return available.filter((item) => item.domain === "light");
  if (action === "switches") return available.filter((item) => item.domain === "switch" && item.section === "lights_switches");
  if (action === "climate") return available.filter((item) => item.section === "climate");
  if (action === "floor_heating") return available.filter((item) => item.section === "floor_heating");
  if (action === "covers") {
    return available.filter((item) => {
      if (item.domain !== "cover") return false;
      const features = item.entity.attributes.supported_features;
      return typeof features !== "number" || (features & 2) !== 0;
    });
  }
  return available.filter((item) => item.domain === "media_player");
};

const serviceFor = (action: OverviewQuickActionId, domain: string): { domain: string; service: string } | undefined => {
  if (action === "covers" && domain === "cover") return { domain: "cover", service: "close_cover" };
  if (domain === "light") return { domain: "light", service: "turn_off" };
  if (domain === "switch") return { domain: "switch", service: "turn_off" };
  if (domain === "climate") return { domain: "climate", service: "turn_off" };
  if (domain === "fan") return { domain: "fan", service: "turn_off" };
  if (domain === "media_player") return { domain: "media_player", service: "turn_off" };
  if (domain === "input_boolean") return { domain: "input_boolean", service: "turn_off" };
  if (domain === "water_heater") return { domain: "water_heater", service: "turn_off" };
  return undefined;
};

export const runQuickAction = async (
  hass: HomeAssistant,
  area: OverviewArea,
  action: OverviewQuickActionId,
): Promise<void> => {
  const targets = quickActionEntities(area, action);
  const grouped = new Map<string, { domain: string; service: string; entityIds: string[] }>();
  const unsupported: string[] = [];
  for (const entity of targets) {
    const service = serviceFor(action, entity.domain);
    if (!service) {
      unsupported.push(entity.entityId);
      continue;
    }
    const key = `${service.domain}.${service.service}`;
    const group = grouped.get(key) ?? { ...service, entityIds: [] };
    group.entityIds.push(entity.entityId);
    grouped.set(key, group);
  }
  if (unsupported.length > 0) {
    throw new Error(`Unsupported entities for the ${action} area action: ${unsupported.join(", ")}.`);
  }
  const results = await Promise.allSettled(
    [...grouped.values()].map((group) => hass.callService(group.domain, group.service, undefined, { entity_id: group.entityIds })),
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
