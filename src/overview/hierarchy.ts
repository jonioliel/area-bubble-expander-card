import type { OverviewArea } from "./types";

export type OverviewAreaHierarchy = {
  roots: OverviewArea[];
  children: Map<string, OverviewArea[]>;
};

/** Builds a cycle-safe Area tree while preserving the discovery/area_order order. */
export const buildOverviewAreaHierarchy = (areas: OverviewArea[]): OverviewAreaHierarchy => {
  const byId = new Map(areas.map((area) => [area.id, area]));
  const parentById = new Map<string, string>();
  for (const area of areas) {
    if (area.parentAreaId && area.parentAreaId !== area.id && byId.has(area.parentAreaId)) {
      parentById.set(area.id, area.parentAreaId);
    }
  }

  const cyclic = new Set<string>();
  for (const area of areas) {
    const path: string[] = [];
    const positions = new Map<string, number>();
    let current: string | undefined = area.id;
    while (current) {
      const cycleStart = positions.get(current);
      if (cycleStart !== undefined) {
        for (const member of path.slice(cycleStart)) cyclic.add(member);
        break;
      }
      positions.set(current, path.length);
      path.push(current);
      current = parentById.get(current);
    }
  }

  const children = new Map<string, OverviewArea[]>();
  const roots: OverviewArea[] = [];
  for (const area of areas) {
    const parentId = cyclic.has(area.id) ? undefined : parentById.get(area.id);
    if (!parentId) {
      roots.push(area);
      continue;
    }
    const siblings = children.get(parentId) ?? [];
    siblings.push(area);
    children.set(parentId, siblings);
  }
  return { roots, children };
};

/** Returns the exact pre-order list currently visible in the card. */
export const visibleOverviewAreas = (
  areas: OverviewArea[],
  isExpanded: (area: OverviewArea) => boolean,
): OverviewArea[] => {
  const { roots, children } = buildOverviewAreaHierarchy(areas);
  const visible: OverviewArea[] = [];
  const visited = new Set<string>();

  const visit = (area: OverviewArea): void => {
    if (visited.has(area.id)) return;
    visited.add(area.id);
    visible.push(area);
    const parentExpanded = isExpanded(area);
    for (const child of children.get(area.id) ?? []) {
      if (parentExpanded || child.showWhenParentCollapsed) visit(child);
    }
  };

  for (const root of roots) visit(root);
  return visible;
};
