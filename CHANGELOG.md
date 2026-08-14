# Changelog

All notable changes to Area Bubble Expander Card will be documented in this file.

## 0.4.1 - 2026-08-14

- Unified the Floor header, powered-off Area summaries, and inactive entity tiles on one theme-aware neutral surface. The visual editor's OFF color now controls all three consistently.
- Kept loaded Area summaries on a compact single row whenever the card has enough room, with smaller decorative icons and spacing but unchanged 44 px action targets.
- Added load-aware container breakpoints so status chips and quick actions wrap only when their actual combination needs more room, without clipping or overlap.
- Expanded responsive style coverage for neutral surfaces, adaptive summary loads, and accessible control sizes.

## 0.4.0 - 2026-08-14

- Added a complete per-entity hide/restore control to every Area editor. A hidden entity is omitted from the layout and no longer affects Area color, active counts, summaries, quick actions, temperature, or occupancy.
- Added visual sub-Areas with cycle-safe `area_overrides.<area>.parent_area` configuration. Nesting changes presentation only: a child Area keeps independent state, summaries, expansion, and actions.
- Added editable quick-action icons through the visual editor and the `quick_action_icons` YAML map, with built-in fallbacks for every action type.
- Added climate-aware room-temperature surfaces for off, cooling, heating, and other active HVAC states, including four independently configurable Appearance colors.
- Added safe off/close controls to every section heading. Group actions omit hidden, unavailable, protected, and unsupported entities, and covers use close instead of toggle.

## 0.3.0 - 2026-08-14

- Added a collapsible Floor header with active/occupied Area summaries, independent remembered state, and responsive Lovelace remeasurement.
- Added safe 500 ms long-press More Info gestures with movement cancellation, click suppression, keyboard fallbacks, and availability-safe access.
- Added Home Assistant-style icon pickers with previews and reset controls for the target, every Area, and every entity.
- Added visual ON/OFF color controls with native color swatches, CSS value input, live previews, and one-click reset to theme-aware defaults.
- Added per-Area entity removal and restore controls; removed entities no longer affect Area color, counts, temperature, occupancy, or quick actions.
- Added numeric occupancy-count sources with a visible `0`, compact `9+`, unknown handling, and an explicit active-presence-sensor fallback.
- Expanded Overview regression coverage to 49 tests, including exclusions, occupancy, icon precedence, floor disclosure, long-press feedback, and narrow RTL layouts.

## 0.2.2 - 2026-08-14

- Fixed Area summary colors so the cyan active surface is shown only when at least one entity is powered; fully off Areas now remain neutral even while expanded.
- Reflowed three or more quick actions into a dedicated wrapping row so every 44 px control and count badge stays visible without clipping or overlap.
- Added visual contract tests for powered/off Area surfaces and dense quick-action headers.

## 0.2.1 - 2026-08-14

- Redesigned Overview around the compact Bubble-style composition: a capsule Area summary, dedicated climate controller, full-width cover/media controls, and two-column light/switch tiles.
- Added a two-level climate controller with temperature stepping, HVAC mode, and fan-mode controls, plus a dedicated floor-heating thermostat layout.
- Added 33 Overview unit tests covering discovery, ordering, temperature, occupancy, safe actions, powered-state handling, and capability-aware services.
- Replaced viewport-only mobile rules with card-width container queries so narrow dashboard columns stay responsive on both phones and desktop layouts.
- Improved direct-control accessibility with 44 px targets, localized labels, busy/disabled states, keyboard focus, and no nested interactive controls.
- Made climate, water-heater, cover, and media controls capability-aware, including range targets, safe HVAC mode fallback, and state-aware cover buttons.
- Added configurable active-tile, climate, and control-pill surfaces to the Overview visual editor.

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
