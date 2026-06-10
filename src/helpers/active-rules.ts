import { IGNORED_STATES } from "../constants";
import type { HassEntity, ResolvedConfig } from "../types";

export const isActiveEntity = (entity: HassEntity, domain: string, config: ResolvedConfig): boolean => {
  const state = String(entity.state ?? "").toLowerCase();
  if (IGNORED_STATES.has(state)) return false;

  if (domain === "media_player" && !config.paused_media_players_active && state === "paused") {
    return false;
  }

  const inactiveStates = config.inactive_states[domain]?.map((item) => item.toLowerCase());
  if (inactiveStates?.includes(state)) return false;

  const activeStates = config.active_states[domain]?.map((item) => item.toLowerCase());
  if (activeStates?.length) return activeStates.includes(state);

  return state === "on";
};
