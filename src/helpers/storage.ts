import { STORAGE_PREFIX } from "../constants";

export const storageKey = (cardId: string): string => `${STORAGE_PREFIX}:${cardId}:expanded`;

export const readExpandedState = (cardId: string): Record<string, boolean> => {
  try {
    const raw = localStorage.getItem(storageKey(cardId));
    return raw ? (JSON.parse(raw) as Record<string, boolean>) : {};
  } catch {
    return {};
  }
};

export const writeExpandedState = (cardId: string, state: Record<string, boolean>): void => {
  try {
    localStorage.setItem(storageKey(cardId), JSON.stringify(state));
  } catch {
    // Storage may be unavailable in kiosk modes or hardened browsers.
  }
};
