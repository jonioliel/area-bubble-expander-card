# Changelog

All notable changes to Area Bubble Expander Card will be documented in this file.

## 0.1.3 - 2026-06-11

- Improved Label display in the editor by loading Home Assistant Label Registry names through WebSocket when available.
- Label picker now prefers the real Label name, including Hebrew names, while still storing the stable Label ID in config.
- Added Badge / Template helper output with template sensor YAML for active entity count and active area count.
- Added example dashboard badge YAML that can navigate to the dashboard view containing the card.

## 0.1.2 - 2026-06-10

- Fixed editor picker search handling so Area, Entity, and Label searches update reliably while typing.
- Added Home Assistant Label picker in the editor for easy `exclude_labels` filtering.
- Added friendly Area display order controls with up/down buttons that set `area_sort: custom` and update `custom_area_order`.
- Improved custom Area sorting fallback so unordered areas still sort predictably by name.
- Included entity Labels in entity picker search text for easier discovery.

## 0.1.1 - 2026-06-10

- Fixed expand/collapse state so areas toggle with one click even when `default_expanded` is enabled.
- Added visual Area picker in the editor with real Home Assistant Area names and IDs for include/exclude filtering.
- Added visual Entity picker in the editor with friendly name, entity ID, Area, and domain for easy include/hide filtering.
- Polished card and editor styling with clearer focus states, softer section depth, improved row contrast, and better mobile editor layout.
- Updated published card metadata to point to the project repository.

## 0.1.0 - 2026-06-10

Initial release.

- Added HACS-ready Home Assistant Lovelace custom card structure.
- Added TypeScript source with active entity discovery, Area grouping, sorting, and safety helpers.
- Added safe per-area, per-entity, and optional global turn-off logic.
- Added Hebrew and English translations with RTL support.
- Added Bubble/Expander-inspired card UI and visual Lovelace editor.
- Added checked-in `dist/area-bubble-expander-card.js` resource for HACS/manual installation.
- Added README, HACS metadata, package configuration, license, and usage examples.
