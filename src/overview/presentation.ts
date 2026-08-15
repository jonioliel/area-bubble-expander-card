import { AUTO_FAN_GROUP, AUTO_FLOOR_HEATING_GROUP } from "./constants";
import type { OverviewArea, OverviewEntity, OverviewSection } from "./types";

export type OverviewRoomSubarea = {
  name: string;
  sections: OverviewSection[];
  entities: OverviewEntity[];
};

export type OverviewAreaContentLayout = {
  generalSections: OverviewSection[];
  subareas: OverviewRoomSubarea[];
};

export const isAutomaticEntityGroup = (group: string | undefined): boolean =>
  group === AUTO_FAN_GROUP || group === AUTO_FLOOR_HEATING_GROUP;

const withEntities = (section: OverviewSection, entities: OverviewEntity[]): OverviewSection => ({
  ...section,
  entities,
  activeCount: entities.filter((item) => item.powered).length,
});

const existingSections = (sections: OverviewSection[], showEmptySections: boolean): OverviewSection[] =>
  sections.filter((section) => showEmptySections || section.entities.length > 0);

/**
 * Pivots manual entity groups above category sections: general room categories
 * come first, then each named room sub-area with its own category sections.
 * Automatic implementation groups (Fans/Heating controls) stay inside their category.
 */
export const buildOverviewAreaContentLayout = (
  area: OverviewArea,
  configuredOrder: string[] = [],
  showEmptySections = false,
): OverviewAreaContentLayout => {
  const discoveredNames: string[] = [];
  for (const section of area.sections) {
    for (const item of section.entities) {
      if (!item.group || isAutomaticEntityGroup(item.group) || discoveredNames.includes(item.group)) continue;
      discoveredNames.push(item.group);
    }
  }
  const orderedNames = [
    ...configuredOrder.filter((name, index) => discoveredNames.includes(name) && configuredOrder.indexOf(name) === index),
    ...discoveredNames.filter((name) => !configuredOrder.includes(name)),
  ];
  const generalSections = existingSections(
    area.sections.map((section) => withEntities(
      section,
      section.entities.filter((item) => !item.group || isAutomaticEntityGroup(item.group)),
    )),
    showEmptySections,
  );
  const subareas = orderedNames.map((name) => {
    const sections = existingSections(
      area.sections.map((section) => withEntities(
        section,
        section.entities
          .filter((item) => item.group === name)
          .map((item) => ({ ...item, group: undefined })),
      )),
      showEmptySections,
    );
    return { name, sections, entities: sections.flatMap((section) => section.entities) };
  });
  return { generalSections, subareas };
};
