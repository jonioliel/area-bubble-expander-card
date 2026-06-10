import type { DiscoveredEntity, HassEntity, HomeAssistant, ResolvedConfig } from "../types";
import { t } from "../translations";

const numberAttr = (entity: HassEntity, key: string): number | undefined => {
  const value = entity.attributes[key];
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
};

export const friendlyName = (entity: HassEntity, overrideName?: string): string =>
  overrideName ?? String(entity.attributes.friendly_name ?? entity.entity_id);

export const formatSecondary = (
  entity: HassEntity,
  domain: string,
  config: ResolvedConfig,
  hass: HomeAssistant | undefined,
): string => {
  if (entity.state === "unavailable") return t(config, hass, "not_available");
  if (domain === "light" && config.show_brightness) {
    const brightness = numberAttr(entity, "brightness");
    if (brightness !== undefined) return `${Math.round((brightness / 255) * 100)}%`;
  }
  if (domain === "fan") {
    const percentage = numberAttr(entity, "percentage");
    if (percentage !== undefined) return `${percentage}%`;
  }
  if (domain === "climate") {
    const mode = String(entity.attributes.hvac_action ?? entity.state);
    const current = numberAttr(entity, "current_temperature");
    const target = numberAttr(entity, "temperature");
    if (config.show_temperature && (current !== undefined || target !== undefined)) {
      return [mode, current !== undefined ? `${current}°` : "", target !== undefined ? `→ ${target}°` : ""].filter(Boolean).join(" ");
    }
    return mode;
  }
  if (domain === "media_player" && config.show_media_title) {
    return String(entity.attributes.media_title ?? entity.attributes.source ?? entity.state);
  }
  if (domain === "cover") {
    const position = numberAttr(entity, "current_position");
    return position !== undefined ? `${position}%` : entity.state;
  }
  return String(entity.state);
};

export const relativeLastChanged = (entity: HassEntity): string => {
  const changed = new Date(entity.last_changed).getTime();
  if (!Number.isFinite(changed)) return "";
  const minutes = Math.max(0, Math.round((Date.now() - changed) / 60000));
  if (minutes < 1) return "now";
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.round(hours / 24)}d`;
};

export const displaySecondary = (item: DiscoveredEntity, config: ResolvedConfig): string => {
  const pieces = [item.secondary];
  if (item.protected) pieces.push(t(config, undefined, "protected"));
  if (config.show_entity_ids) pieces.push(item.entityId);
  if (config.show_last_changed) pieces.push(relativeLastChanged(item.entity));
  return pieces.filter(Boolean).join(" · ");
};
