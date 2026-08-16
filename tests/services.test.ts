import { readFileSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";

import { resolveConfig } from "../src/helpers/config";
import {
  turnOffAreaViaHomeAssistant,
  turnOffEntitiesByDomain,
  turnOffEntity,
} from "../src/helpers/services";
import type { DiscoveredEntity, HomeAssistant } from "../src/types";

const item = (entityId: string, overrides: Partial<DiscoveredEntity> = {}): DiscoveredEntity => {
  const domain = entityId.split(".")[0];
  return {
    entity: {
      entity_id: entityId,
      state: "on",
      attributes: {},
      last_changed: "2026-01-01T00:00:00Z",
      last_updated: "2026-01-01T00:00:00Z",
    },
    entityId,
    domain,
    name: entityId,
    icon: "mdi:circle",
    areaId: "room",
    areaName: "Room",
    labels: [],
    hidden: false,
    active: true,
    protected: false,
    controllable: true,
    secondary: "on",
    skipReasons: [],
    ...overrides,
  };
};

const homeAssistant = (callService = vi.fn(async () => undefined)): HomeAssistant => ({ states: {}, callService });

describe("Existing active-device card services", () => {
  it("uses the configured domain service for a single entity, including cover close", async () => {
    const callService = vi.fn(async () => undefined);
    const config = resolveConfig({ type: "custom:area-bubble-expander-card" });
    await turnOffEntity(homeAssistant(callService), item("cover.shade"), config);
    expect(callService).toHaveBeenCalledWith("cover", "close_cover", undefined, {
      entity_id: "cover.shade",
    });
  });

  it("groups safe entities by their configured service and omits protected targets", async () => {
    const callService = vi.fn(async () => undefined);
    const config = resolveConfig({ type: "custom:area-bubble-expander-card" });
    await turnOffEntitiesByDomain(homeAssistant(callService), [
      item("light.ceiling"),
      item("light.bedside"),
      item("fan.ceiling"),
      item("switch.protected", { protected: true }),
    ], config);
    expect(callService).toHaveBeenCalledTimes(2);
    expect(callService).toHaveBeenCalledWith("light", "turn_off", undefined, {
      entity_id: ["light.ceiling", "light.bedside"],
    });
    expect(callService).toHaveBeenCalledWith("fan", "turn_off", undefined, {
      entity_id: ["fan.ceiling"],
    });
  });

  it("rejects a malformed custom service mapping before calling Home Assistant", async () => {
    const callService = vi.fn(async () => undefined);
    const config = resolveConfig({
      type: "custom:area-bubble-expander-card",
      service_mapping: { light: "not-a-service" },
    });
    await expect(turnOffEntity(homeAssistant(callService), item("light.ceiling"), config)).rejects.toThrow(
      "Invalid service mapping",
    );
    expect(callService).not.toHaveBeenCalled();
  });

  it("validates every grouped service before making the first call", async () => {
    const callService = vi.fn(async () => undefined);
    const config = resolveConfig({
      type: "custom:area-bubble-expander-card",
      service_mapping: { fan: "invalid" },
    });
    await expect(turnOffEntitiesByDomain(homeAssistant(callService), [
      item("light.ceiling"),
      item("fan.ceiling"),
    ], config)).rejects.toThrow("Invalid service mapping");
    expect(callService).not.toHaveBeenCalled();
  });

  it("uses Home Assistant's area target for the explicit area mode", async () => {
    const callService = vi.fn(async () => undefined);
    await turnOffAreaViaHomeAssistant(homeAssistant(callService), "bedroom");
    expect(callService).toHaveBeenCalledWith("homeassistant", "turn_off", undefined, { area_id: "bedroom" });
  });

  it("reports rejected custom toggle and call-service actions instead of leaking promises", () => {
    const source = readFileSync(new URL("../src/area-bubble-expander-card.ts", import.meta.url), "utf8");
    expect(source).toMatch(/callService\("homeassistant", "toggle"[\s\S]*?\.catch\(\(error\) => this\.reportError\(error\)\)/);
    expect(source).toMatch(/Invalid action service:[\s\S]*?callService\(domain, service[\s\S]*?\.catch\(\(error\) => this\.reportError\(error\)\)/);
  });
});
