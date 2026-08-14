# Changelog

All notable changes to Area Bubble Expander Card will be documented in this file.

## 0.7.0 - 2026-08-15

- Made the Overview card surface transparent by default and added `style.card_transparent` plus `style.card_background` to YAML and the visual Appearance editor.
- Filled expanded Areas with their ON/OFF state surface, unified the summary and enclosing frame color, and joined their top edges so the expanded Area reads as one continuous card.
- Simplified the climate temperature tag to one attached A/C icon without a numeric count while preserving its climate-popup action.
- Corrected cover and media row direction so entity content follows the configured RTL/LTR layout while directional controls retain their stable order.

## 0.6.2 - 2026-08-14

- Restored a single accent frame only while an Area is expanded, enclosing its complete device content while collapsed Areas remain free of an outer frame.
- Stopped open covers from coloring an Area active; their powered count remains available on the cover quick action and in the cover section.
- Merged active climate quick actions into the temperature chip as a compact A/C icon-and-count tag. The tag remains the popup trigger for full climate controls.

## 0.6.1 - 2026-08-14

- Removed the outer Area outline in both collapsed and expanded states, leaving the summary capsule as the only room frame.
- Reserved a stable mobile width for the Area name, reduced active quick-action visuals to 34 px with preserved 44 px hit areas, and made the status strip horizontally scrollable only when its contents cannot fit.
- Removed the last legacy climate power-button styling and strengthened regression coverage so the HVAC mode menu is the only climate power control.

## 0.6.0 - 2026-08-14

- Removed the redundant outer Area frame from collapsed rooms and kept a single accent outline around expanded Area content.
- Replaced climate and fan dropdowns with native Home Assistant anchored control menus, and removed the duplicate climate power button because the HVAC mode menu already includes Off.
- Added automatic brightness sliders for dimmable lights. Brightness is committed on release with `brightness_pct`, while zero safely turns the light off.
- Added `style.area_name_size` (11–24 px, default 17) to YAML and the visual Appearance editor so long room names fit without sacrificing controls.
- Added climate-menu, light-capability, brightness mapping, typography, and frame regression coverage; the suite now contains 127 tests.

## 0.5.1 - 2026-08-14

- Changed collapsed Area quick actions to show only powered categories; off lights, off climate devices, and fully closed covers no longer consume summary space, while an active category popup still lists all of its members.
- Kept every collapsed Area on one physical row at mobile card widths, with 38 px quick-action visuals, preserved 44 px hit areas, compact occupancy/temperature chips, and contained horizontal scrolling only for extreme active-category counts.
- Added `show_area_expand_button` to YAML and the Home Assistant-style visual editor. Its backwards-compatible default is `true`; disabling it removes the redundant circular chevron while the Area name remains a fully accessible disclosure control.
- Added active-category, cover-state, single-row, touch-target, and expand-button regression coverage; the suite now contains 119 tests and the final layout was browser-verified at 320 px and 390 px in RTL.

## 0.5.0 - 2026-08-14

- Mirrored Floor and Area summary structure in RTL so icons, Hebrew names, status chips, quick actions, and disclosure controls follow the correct logical order at every card-width breakpoint.
- Changed collapsed-header quick actions into responsive category popups that show all included devices, current powered counts, individual controls, and safe all-on/all-off actions; covers use open/close.
- Kept quick-action categories available when all members are off, while unavailable and unsupported members remain visible as disabled rows and protected members remain excluded only from group actions.
- Added paired on/off controls to every expanded section heading, including open/close controls for cover sections.
- Serialized group and individual service calls through shared pending-entity locks, with Escape, backdrop, focus restoration, More Info handoff, mobile safe-area, and internal-scroll handling for the native dialog.
- Expanded directional-action and visual contract coverage to 110 tests and verified the complete flow in 320 px and 390 px RTL browser layouts.

## 0.4.2 - 2026-08-14

- Nested sub-Areas now render inside their parent disclosure and are hidden by default while the parent is collapsed.
- Added the per-child `show_when_parent_collapsed` option and a visual-editor switch for keeping selected sub-Areas visible inside a collapsed parent; sibling arrow order remains authoritative.
- Made Area-tree sizing use the exact visible hierarchy and trigger Lovelace remeasurement after Area expansion changes.
- Increased the contrast of vacant occupancy icons and numeric zero values on dark summary chips.
- Added cycle-safe hierarchy helpers and regression coverage for nested visibility, sibling order, deep ancestor gating, card size, and vacant-state contrast.

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
