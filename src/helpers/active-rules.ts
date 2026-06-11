import { IGNORED_STATES } from "../constants";
import type { HassEntity, ResolvedConfig } from "../types";

const ACTIVE_CLIMATE_ACTIONS = new Set(["cooling", "heating", "drying", "fan"]);

export const isActiveEntity = (entity: HassEntity, domain: string, config: ResolvedConfig): boolean => {
  const state = String(entity.state ?? "").toLowerCase();
  if (IGNORED_STATES.has(state)) return false;

  if (domain === "media_player" && !config.paused_media_players_active && state === "paused") {
    return false;
  }

  if (domain === "climate") {
    const hvacAction = String(entity.attributes.hvac_action ?? "").toLowerCase();
    if (ACTIVE_CLIMATE_ACTIONS.has(hvacAction)) return true;
  }

  const inactiveStates = config.inactive_states[domain]?.map((item) => item.toLowerCase());
  if (inactiveStates?.includes(state)) return false;

  const activeStates = config.active_states[domain]?.map((item) => item.toLowerCase());
  if (activeStates?.length) return activeStates.includes(state);

  if (inactiveStates?.length) return true;

  return state === "on";
};
