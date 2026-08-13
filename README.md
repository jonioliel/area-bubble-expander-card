# Area Bubble Cards

A HACS-ready bundle of two Home Assistant Lovelace cards with automatic Area discovery, safe controls, visual editors, Hebrew/English support, and responsive RTL layouts.

| Card | Type | Purpose |
| --- | --- | --- |
| **What's on now** | `custom:area-bubble-expander-card` | Shows only active devices, grouped by Area, with protected turn-off actions. |
| **Area overview** | `custom:area-bubble-overview-card` | Shows a complete Area or Floor: temperature, occupancy, climate, floor heating, covers, lights/switches, and music. |

Both cards are delivered by the same JavaScript resource. Install it once, then add either card—or both—to any dashboard.

## Highlights

- Automatic Entity → Device → Area → Floor discovery from Home Assistant registries
- One-room or whole-floor Overview with independently expandable Areas
- Temperature priority: configured source, HA Area source, median temperature sensors, then climate devices
- Occupancy from `occupancy`, `presence`, and `motion` binary sensors
- Quick off/close actions available while an Area is collapsed
- Dedicated climate, cover, light/switch, and media controls inside each expanded Area
- Floor-heating discovery using Labels, explicit entity lists, or per-entity section overrides
- Custom Area, section, and entity names plus stable priority ordering
- Visual editors in a Home Assistant-style vertical layout
- Hebrew and English editors, automatic/forced RTL, mobile layouts, and keyboard accessibility
- Protected Labels/entities are excluded from grouped turn-off actions
- One committed, reproducible HACS bundle generated from the TypeScript source

## Installation

### HACS

1. Add this repository to HACS as a **Dashboard** custom repository.
2. Install **Area Bubble Cards**.
3. If HACS does not add the resource automatically, add:

```yaml
url: /hacsfiles/area-bubble-expander-card/area-bubble-expander-card.js
type: module
```

### Manual

```bash
pnpm install
pnpm run build
```

Copy `dist/area-bubble-expander-card.js` to `www/community/area-bubble-expander-card/`, then add:

```yaml
url: /local/community/area-bubble-expander-card/area-bubble-expander-card.js
type: module
```

After replacing the resource, refresh the Home Assistant frontend cache.

## Area Bubble Overview Card

### One Area

```yaml
type: custom:area-bubble-overview-card
id: kids-room-overview
area: kids_room
language: he
rtl: auto
```

### A complete Floor

```yaml
type: custom:area-bubble-overview-card
id: upper-floor-overview
floor: upper_floor
title: קומה עליונה
language: he
rtl: true
area_order:
  - kids_room
  - library
  - parents_room
```

Choose exactly one of `area` or `floor`. The visual editor exposes Home Assistant's real names while storing stable IDs.

### Default expanded order

1. Climate
2. Floor heating
3. Covers
4. Lights and switches
5. Music

Empty sections are hidden by default. Every discovered device remains visible inside an expanded Area even when it is off; activity is used for highlights, counts, and quick actions.

The expanded layout is intentionally compact: climate uses a dedicated two-row controller, covers and media keep full-width controls, and lights/switches use a two-column tile grid whenever the card is wide enough. Responsiveness follows the card's own width, so the same layout also works inside narrow desktop dashboard columns.

### Temperature

The displayed temperature is selected in this order:

1. `area_overrides.<area>.temperature_entity`
2. The preferred temperature entity configured on the Home Assistant Area
3. The median of Area sensors whose `device_class` is `temperature`
4. The median `current_temperature` of Area climate entities

Select the preferred source directly in the visual editor when automatic discovery is not the desired result.

### Occupancy

The card automatically considers binary sensors with these device classes:

- `occupancy`
- `presence`
- `motion`

Any sensor that is `on` means occupied; all `off` means vacant; only unavailable/unknown values mean unknown. Override the sensor selection per Area in the editor or YAML.

### Floor heating

Home Assistant does not have one universal Domain or Device Class for floor heating. The card therefore avoids unsafe guesswork and supports three explicit methods:

```yaml
floor_heating_labels:
  - floor_heating
  - underfloor_heating

floor_heating_entities:
  - climate.kids_floor_heating
  - switch.parents_floor_heating

entity_overrides:
  switch.library_heating:
    section: floor_heating
    name: חימום רצפתי
    icon: mdi:heating-coil
```

The visual editor can move an automatically discovered switch or climate entity into the Floor heating section. It can also add supported unclassified `input_boolean` and `water_heater` entities.

### Quick actions

Quick actions are shown beside the Area header, so lights, climate, heating, covers, switches, or music can be turned off without drilling down.

```yaml
show_quick_actions: true
quick_actions:
  - lights
  - climate
  - floor_heating
  - switches
  - covers
  - media
```

Safety behavior:

- Quick actions are off-only; pressing an inactive group never turns it on.
- Cover actions close active/open covers.
- Calls are grouped by Domain and target only discovered Entity IDs.
- Hidden, excluded, unavailable, and protected entities are omitted.
- Buttons are disabled while an action is in flight, and partial failures produce a Home Assistant notification.
- `protected` applies to group actions; direct controls remain available after intentionally expanding the Area.

### Full example

```yaml
type: custom:area-bubble-overview-card
id: upper-floor-overview
floor: upper_floor
title: קומה עליונה
language: he
rtl: auto
show_header: true
show_temperature: true
show_occupancy: true
show_quick_actions: true
show_empty_sections: false
default_expanded: false
remember_expanded_state: true

section_order:
  - climate
  - floor_heating
  - covers
  - lights_switches
  - media

section_titles:
  climate: מיזוג אוויר
  floor_heating: חימום רצפתי
  covers: תריסים
  lights_switches: מפסקים ותאורה
  media: מוזיקה

area_order:
  - kids_room
  - library
  - parents_room

floor_heating_labels:
  - floor_heating

protected_labels:
  - always_on
  - critical
  - infrastructure
  - no_turn_off

area_overrides:
  kids_room:
    name: חדר ילדים
    icon: mdi:teddy-bear
    default_expanded: true
    temperature_entity: sensor.kids_temperature
    occupancy_entities:
      - binary_sensor.kids_occupancy
    section_titles:
      lights_switches: תאורה ומפסקים
    entity_order:
      climate:
        - climate.kids_ac
      covers:
        - cover.kids_window
      lights_switches:
        - light.kids_ceiling
        - switch.kids_night_light

entity_overrides:
  switch.kids_floor_heating:
    section: floor_heating
    name: חימום רצפתי
    icon: mdi:heating-coil
  switch.router:
    protected: true
  light.decorative:
    hidden: true

style:
  border_radius: 26
  blur: 18
  row_height: 56
  section_gap: 12
  accent_color: var(--primary-color)
  active_surface: rgba(174, 215, 219, 0.94)
  climate_surface: rgba(139, 181, 255, 0.94)
  control_surface: rgba(11, 28, 58, 0.94)
```

### Overview configuration reference

| Key | Default | Notes |
| --- | --- | --- |
| `id` | target-derived | Stable key for remembered expansion; recommended for repeated targets. |
| `area` / `floor` | none | One target is required. IDs and names are accepted; IDs are recommended. |
| `title` | none | Optional overall title; Floor mode still shows the Floor name by default. |
| `language` / `rtl` | `auto` | `he`, `en`; RTL may be `auto`, `true`, or `false`. |
| `show_temperature` | `true` | Shows the preferred/automatic current temperature. |
| `show_occupancy` | `true` | Shows occupied, vacant, or unknown when sensors exist. |
| `show_quick_actions` | `true` | Shows safe group controls on the collapsed header. |
| `show_empty_sections` | `false` | Keeps the layout compact when a category is absent. |
| `default_expanded` | `false` | Initial Area expansion. |
| `remember_expanded_state` | `true` | Stores expansion locally per stable card ID. |
| `section_order` | standard five sections | Priority order; missing built-in sections are appended safely. |
| `section_titles` | localized | Global section headings. |
| `quick_actions` | all six | Enabled actions in display order. |
| `area_order` | Area name | Priority list; newly discovered Areas append automatically. |
| `floor_heating_labels` | common labels | Labels used for explicit heating classification. |
| `floor_heating_entities` | `[]` | Explicit floor-heating entities. |
| `occupancy_device_classes` | occupancy/presence/motion | Automatic presence classes. |
| `exclude_entities` | `[]` | Completely removes entities from Overview. |
| `protected_labels` / `protected_entities` | safe defaults / `[]` | Excluded from quick group actions. |
| `area_overrides` | `{}` | Area-specific name, icon, sensors, headings, inclusion, exclusion, and order. |
| `entity_overrides` | `{}` | Entity name, icon, section, visibility, and group-action protection. |
| `style.active_surface` | pale cyan | Active light/switch tile background. |
| `style.climate_surface` | soft blue | Active climate-controller background. |
| `style.control_surface` | dark navy | Temperature, mode, fan, and thermostat control pills. |

Entity and Area order lists are priority lists, not frozen inventories. New Home Assistant entities that are not yet listed are appended automatically.

## Area Bubble Expander Card — What's on now

The original card remains available and backward compatible:

```yaml
type: custom:area-bubble-expander-card
id: whats-on-now
title: מה דלוק עכשיו
language: he
rtl: auto
show_area_turn_off: true
show_entity_turn_off: true
domains:
  - light
  - switch
  - fan
  - climate
  - media_player
  - cover
```

It displays only active entities and groups them by Area. Climate activity considers both HVAC mode and `hvac_action`; protected Labels and entities remain excluded from turn-off actions.

### Existing-card safety

The default Area action calls only safe, displayed entities. Add critical infrastructure to `protected_entities` or apply one of the default protected Labels:

```yaml
protected_labels:
  - always_on
  - critical
  - infrastructure
  - no_turn_off
protected_entity_behavior: show_disabled
```

`dangerous_domains` require confirmation even when the general confirmation option is disabled. Area overrides can explicitly change `confirm_turn_off`.

## Visual editors

Both cards expose `getConfigElement()` and work with Home Assistant's dashboard card editor.

The Overview editor provides:

- Area/Floor target selection
- Summary, temperature, occupancy, and quick-action settings
- Section title and order editing
- Floor Area order and per-Area overrides
- Preferred temperature and occupancy entity selection
- Entity section assignment, names, protection, and priority order
- Hebrew/English, RTL, responsive appearance, and advanced safety lists

The What's-on-now editor provides a Home Assistant-style vertical navigation layout with live Area/Entity/Label pickers, accessible reordering, and local JSON drafts. Invalid JSON is never emitted to Home Assistant; it remains an editor draft with an inline error until corrected or reset.

## Troubleshooting

- Make sure devices or entities are assigned to a Home Assistant Area.
- For Floor mode, assign each Area to a Floor in **Settings → Areas, labels & zones**.
- Prefer stable Area/Floor IDs in YAML; the visual editor stores them automatically.
- Use a preferred temperature entity if an Area contains unrelated numeric sensors.
- Apply a `floor_heating` Label or section override instead of relying on device names.
- Enable `debug: true` temporarily on the Overview card to inspect its discovery model.
- On the What's-on-now card, use `show_debug: true` to see why entities were filtered.

## Development

```bash
pnpm install --frozen-lockfile
pnpm run typecheck
pnpm run test
pnpm run build
```

Or run the complete verification pipeline:

```bash
pnpm run check
```

The bundle is written to `dist/area-bubble-expander-card.js`. CI runs type checking, the Overview test suite, a production build, and verifies that the committed HACS artifact matches source.

## Design and compatibility notes

The cards use the documented [Home Assistant custom-card/editor contract](https://developers.home-assistant.io/docs/frontend/custom-ui/custom-card/) and standard `hass.callService` behavior. The visual language is inspired by Bubble-style controls and expandable Area layouts; no source code is copied from other cards.

Home Assistant's built-in frontend components are not a stable public API, so the editors use self-contained HA-themed controls instead of depending on private component internals.
