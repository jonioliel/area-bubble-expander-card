# Area Bubble Expander Card

A production-ready Home Assistant Lovelace custom card that shows what is currently active in your home, grouped by Home Assistant Areas.

It combines an expandable area layout inspired by [Expander Card](https://github.com/MelleD/lovelace-expander-card) with a soft Bubble-style visual language inspired by [Bubble Card](https://github.com/Clooos/Bubble-Card), while adding automatic Area grouping, safe turn-off logic, Hebrew/RTL support, and a full visual editor.

Screenshot placeholders: collapsed area view, expanded area view, Hebrew RTL dashboard, and visual editor.

## Features

- Automatically discovers entities from `hass.states`
- Groups active entities by Home Assistant Area
- Resolves Areas from entity registry, then device registry, then fallback
- Expand/collapse per Area
- Area active counts, previews, and domain chips
- Per-Area and per-entity turn-off actions
- Protected labels and entities are never turned off
- Hebrew and English translations
- Automatic or forced RTL layout
- Complete Lovelace visual editor
- HACS-ready package metadata
- Mobile-first glass/Bubble-inspired styling

## Installation

### HACS

1. Add this repository as a custom repository in HACS.
2. Select category: Lovelace.
3. Install **Area Bubble Expander Card**.
4. Add the Lovelace resource if HACS did not add it automatically:

```yaml
url: /hacsfiles/area-bubble-expander-card/area-bubble-expander-card.js
type: module
```

### Manual

1. Run `npm install` and `npm run build`.
2. Copy `dist/area-bubble-expander-card.js` to `www/community/area-bubble-expander-card/`.
3. Add this resource:

```yaml
url: /local/community/area-bubble-expander-card/area-bubble-expander-card.js
type: module
```

## Basic YAML

```yaml
type: custom:area-bubble-expander-card
title: מה דלוק בבית
language: he
rtl: auto
show_empty: true
default_expanded: false
show_area_turn_off: true
show_entity_turn_off: true
domains:
  - light
  - switch
  - fan
  - climate
  - media_player
```

## Advanced YAML

```yaml
type: custom:area-bubble-expander-card
title: מה דלוק בבית
language: he
rtl: auto
show_header: true
show_total_count: true
show_active_area_count: true
show_empty: true
empty_title: הכל כבוי
empty_subtitle: אין מכשירים דלוקים כרגע
default_expanded: false
remember_expanded_state: true
expand_on_header_tap: true
show_area_icons: true
show_entity_icons: true
show_entity_secondary_info: true
show_domain_chips: true
domain_chip_mode: icons
show_preview_entities: true
preview_entity_count: 3
show_area_turn_off: true
show_entity_turn_off: true
show_global_turn_off: false
confirm_area_turn_off: true
confirm_entity_turn_off: false
confirm_global_turn_off: true
area_turn_off_mode: safe_displayed_entities
domains:
  - light
  - switch
  - fan
  - climate
  - media_player
  - cover
  - lock
active_states:
  media_player:
    - playing
    - buffering
  cover:
    - open
    - opening
  lock:
    - unlocked
inactive_states:
  climate:
    - off
    - unavailable
    - unknown
exclude_labels:
  - always_on
  - critical
  - infrastructure
  - no_turn_off
exclude_entity_category:
  - diagnostic
  - config
exclude_hidden_entities: true
exclude_unavailable: true
protected_labels:
  - always_on
  - critical
  - infrastructure
  - no_turn_off
protected_entity_behavior: show_disabled
area_sort: count_desc
entity_sort: domain
style:
  preset: bubble_glass
  glass: true
  compact: false
  border_radius: 26
  blur: 18
  show_shadows: true
  accent_color: var(--primary-color)
  danger_color: "#ff5252"
```

## Hebrew / RTL

```yaml
type: custom:area-bubble-expander-card
language: he
rtl: true
title: מה דלוק בבית
empty_title: הכל כבוי
empty_subtitle: אין מכשירים דלוקים כרגע
```

Use `language: auto` and `rtl: auto` to follow Home Assistant language and document direction. Hebrew Area and entity names are rendered natively and controls are mirrored for RTL dashboards.

## Safety Model

The default area turn-off mode is `safe_displayed_entities`. It only turns off active, displayed, controllable entities in that Area.

Protected entities are excluded from turn-off actions when:

- Their entity ID is in `protected_entities`
- They have a protected label such as `always_on`, `critical`, `infrastructure`, or `no_turn_off`
- Their domain is listed in `disable_turn_off_for_domains`
- Safety mode blocks that action

Protected display behavior:

```yaml
protected_entity_behavior: show_disabled
```

Options are `hide`, `show_disabled`, and `show_with_lock_icon`.

## UI Editor

The visual editor is available from the Lovelace card editor and includes these sections:

- General
- Display
- Areas
- Entities
- Active Rules
- Actions
- Safety
- Sorting
- Style
- Hebrew / RTL
- Advanced
- Debug

Most common settings use simple inputs, toggles, and selects. Advanced maps such as `areas`, `entity_overrides`, `active_states`, `inactive_states`, and `service_mapping` are edited as JSON for reliability across Home Assistant frontend versions.

The Areas and Entities sections include searchable pickers from your live Home Assistant data. You can include/exclude Areas, hide specific entities, exclude entities by Label, and set the active Area display order with up/down controls.

## Styling

The card supports style config and CSS variables:

```yaml
style:
  preset: bubble_glass
  border_radius: 26
  blur: 18
  row_height: 52
  accent_color: var(--primary-color)
  danger_color: "#ff5252"
```

Useful CSS variables:

- `--area-bubble-expander-card-border-radius`
- `--area-bubble-expander-card-background`
- `--area-bubble-expander-card-background-expanded`
- `--area-bubble-expander-card-glass-blur`
- `--area-bubble-expander-card-accent-color`
- `--area-bubble-expander-card-danger-color`
- `--area-bubble-expander-card-section-gap`
- `--area-bubble-expander-card-row-height`
- `--area-bubble-expander-card-chip-background`
- `--area-bubble-expander-card-row-background`

## Active Rules

Default active states:

- `light`, `switch`, `fan`: `on`
- `climate`: any state except `off`, `unavailable`, `unknown`
- `media_player`: `playing`, `buffering`, `paused`
- `cover`: `open`, `opening`
- `lock`: `unlocked`

Override with:

```yaml
active_states:
  media_player:
    - playing
inactive_states:
  climate:
    - off
    - unavailable
    - unknown
```

## Troubleshooting

Enable diagnostics:

```yaml
debug: true
show_debug: true
show_entity_ids: true
show_area_ids: true
```

The card will show skipped entities and reasons such as inactive state, excluded domain, excluded label, hidden entity, unavailable, excluded entity category, or protected hidden.

## Development

```bash
npm install
npm run typecheck
npm run build
```

The built HACS resource is written to:

```text
dist/area-bubble-expander-card.js
```

## Credits

Design and behavior inspiration:

- [Bubble Card](https://github.com/Clooos/Bubble-Card)
- [Expander Card](https://github.com/MelleD/lovelace-expander-card)

No source code is copied from those projects.
