# Changelog

All notable changes to Area Bubble Expander Card will be documented in this file.

## 0.2.0 - 2026-08-14

- Added a second card, `custom:area-bubble-overview-card`, to the existing HACS bundle.
- Added Area and Floor targets with automatic Entity → Device → Area → Floor discovery.
- Added current temperature resolution, occupancy status, and independently expandable Areas.
- Added climate, floor-heating, cover, light/switch, and media sections with dedicated controls.
- Added safe quick actions on collapsed Area headers; grouped actions exclude protected and unavailable entities.
- Added priority ordering and per-Area/per-entity titles, icons, sensors, sections, inclusion, exclusion, and protection.
- Added a Hebrew/English Home Assistant-style visual editor for Overview.
- Rebuilt the existing card editor with stable Lit lifecycle behavior, local validated JSON drafts, accessible reordering, registry retry handling, and complete config coverage.
- Fixed the existing editor's `LitElement.update` collision that broke type checking and could break editor rendering.
- Added stable expansion IDs, current Home Assistant Floor/Area registry fields, hidden/disabled entity handling, and documented `getStubConfig` behavior.
- Activated previously inert style presets, compact/glass settings, animation preferences, icon sizing, background options, and dangerous-domain confirmations.
- Added 30 Overview unit tests, a locked pnpm dependency graph, GitHub Actions CI, and committed-bundle drift verification.
- Updated Vite and Vitest to audited patched releases; the full production and development dependency graph has no known vulnerabilities.
- Replaced the previously divergent hand-written `dist` artifact with the production bundle generated from `src`.

## 0.1.5 - 2026-06-11

- Fixed climate / air conditioner active detection so HVAC modes like `cool`, `heat`, `dry`, `fan_only`, and other non-inactive states are shown as active.
- Climate entities with `hvac_action` values like `cooling`, `heating`, `drying`, or `fan` are now treated as active even when the main state is ambiguous.
- Corrected generic `inactive_states` handling so domains configured only with inactive states work as intended.

## 0.1.4 - 2026-06-11

- Fixed mobile header/grid layout so Area titles no longer compete with action buttons in narrow RTL views.
- Long card, Area, and entity titles now wrap on mobile instead of being clipped with ellipsis.
- Reduced mobile icon/button sizes slightly and aligned controls to the top for cleaner stacked titles.

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
