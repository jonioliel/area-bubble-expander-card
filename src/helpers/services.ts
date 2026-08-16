import type { DiscoveredEntity, HomeAssistant, ResolvedConfig } from "../types";
import { safeTurnOffCandidates } from "./safety";

const splitService = (service: string): { domain: string; service: string } => {
  const parts = service.split(".");
  const [domain, name] = parts;
  if (parts.length !== 2 || !domain?.trim() || !name?.trim()) {
    throw new Error(`Invalid service mapping: ${service}`);
  }
  return { domain, service: name };
};

export const turnOffEntity = async (
  hass: HomeAssistant,
  item: DiscoveredEntity,
  config: ResolvedConfig,
): Promise<void> => {
  const mapping = config.service_mapping[item.domain];
  if (!mapping) throw new Error(`No turn-off service configured for ${item.domain}`);
  const service = splitService(mapping);
  await hass.callService(service.domain, service.service, undefined, { entity_id: item.entityId });
};

export const turnOffEntitiesByDomain = async (
  hass: HomeAssistant,
  items: DiscoveredEntity[],
  config: ResolvedConfig,
): Promise<void> => {
  const grouped = new Map<string, string[]>();
  for (const item of safeTurnOffCandidates(items, config)) {
    const mapping = config.service_mapping[item.domain];
    if (!mapping) continue;
    const list = grouped.get(mapping) ?? [];
    list.push(item.entityId);
    grouped.set(mapping, list);
  }

  // Validate the complete plan before the first service call. A malformed
  // custom mapping must never leave a room only partially switched off.
  const planned = [...grouped.entries()].map(([mapping, entityIds]) => ({
    service: splitService(mapping),
    entityIds,
  }));
  await Promise.all(planned.map(({ service, entityIds }) =>
    hass.callService(service.domain, service.service, undefined, { entity_id: entityIds })));
};

export const turnOffAreaViaHomeAssistant = async (hass: HomeAssistant, areaId: string): Promise<void> => {
  await hass.callService("homeassistant", "turn_off", undefined, { area_id: areaId });
};
