# Changelog

All notable changes to Area Bubble Expander Card will be documented in this file.

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
