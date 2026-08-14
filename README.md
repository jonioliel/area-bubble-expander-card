# Area Bubble Cards

A HACS-ready bundle of two Home Assistant Lovelace cards with automatic Area discovery, safe controls, visual editors, Hebrew/English support, and responsive RTL layouts.

| Card | Type | Purpose |
| --- | --- | --- |
| **What's on now** | `custom:area-bubble-expander-card` | Shows only active devices, grouped by Area, with protected turn-off actions. |
| **Area overview** | `custom:area-bubble-overview-card` | Shows a complete Area or Floor: temperature, occupancy, climate, floor heating, covers, lights/switches, and music. |

Both cards are delivered by the same JavaScript resource. Install it once, then add either card—or both—to any dashboard.

## Highlights

- Automatic Entity → Device → Area → Floor discovery from Home Assistant registries
- One-room or whole-floor Overview with a collapsible Floor and independently expandable Areas
- Temperature priority: configured source, HA Area source, median temperature sensors, then climate devices
- Numeric occupancy from a count entity, with active presence-sensor count as a fallback
- Active-only quick-action popups on collapsed Areas with live status, individual controls, and safe all-on/all-off actions
- Safe on/off controls on every expanded section heading; cover sections use open/close
- Tap controls directly and long-press an entity for Home Assistant More Info
- Dedicated climate, cover, light/switch, and media controls inside each expanded Area
- Floor-heating discovery using Labels, explicit entity lists, or per-entity section overrides
- Custom Floor/Area/entity icons, Area and section names, and stable priority ordering
- Visual parent/child Area nesting with independent child state and controls
- Editable quick-action icons and climate-aware room-temperature colors
- Per-Area entity exclusion that also removes the entity from activity, color, and summary calculations
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
target_icon: mdi:home-floor-1
title: קומה עליונה
language: he
rtl: true
floor_default_expanded: true
remember_expanded_state: true
show_area_expand_button: false
area_order:
  - kids_room
  - library
  - parents_room
```

Choose exactly one of `area` or `floor`. The visual editor exposes Home Assistant's real names while storing stable IDs.

### Floor collapse and entity interactions

In Floor mode, press the Floor header to collapse or reveal the complete Area list. This does not change the expanded/collapsed state of any individual Area. `floor_default_expanded` controls the initial state, and `remember_expanded_state: true` remembers the Floor and Area states independently for the card's stable `id`.

Each Area name is itself a complete disclosure button. Set `show_area_expand_button: false` to remove the separate circular chevron and give the name, temperature, occupancy, and active quick actions the full row width. The visual editor exposes the same option under the summary settings.

A normal tap keeps the control's primary behavior. Long-press an entity control for about half a second to open Home Assistant's More Info dialog without accidentally toggling it. Moving the pointer to scroll cancels the hold gesture; entity names remain directly accessible by mouse and keyboard.

### Visual sub-Areas

In Floor mode, one Area can be displayed beneath another Area. For example, this places the Parents bathroom under the Parents bedroom:

```yaml
area_overrides:
  parents_bathroom:
    parent_area: parents_bedroom
    show_when_parent_collapsed: false
```

`parent_area` is a visual relationship only. The child Area keeps its own entity discovery, active color, summaries, expansion state, and actions, and it does not make the parent Area active. Sub-Areas are rendered inside the parent and are hidden with it by default. Set `show_when_parent_collapsed: true` on an individual child if it should remain visible inside a collapsed parent.

The Area arrows in the visual editor order roots relative to roots and children relative to siblings that share the same parent. That order is stored in `area_order`; newly discovered Areas still append automatically. The editor stores stable Area IDs and prevents self-parenting and cycles. A missing, hidden, out-of-target, or cycle-detached parent safely leaves the Area at the Floor root, where `show_when_parent_collapsed` has no effect.

### Default expanded order

1. Climate
2. Floor heating
3. Covers
4. Lights and switches
5. Music

Empty sections are hidden by default. Every discovered device remains visible inside an expanded Area even when it is off; activity is used for highlights and active-count badges. A collapsed-header quick-action category is shown only while at least one of its devices is powered.

The expanded layout is intentionally compact: climate uses a dedicated two-row controller, covers and media keep full-width controls, and lights/switches use a two-column tile grid whenever the card is wide enough. Collapsed Area summaries always remain one physical row. Mobile quick-action circles become visually smaller while retaining a 44 px hit area, and an extreme number of simultaneous active categories scrolls within the action strip instead of increasing the room height. Responsiveness follows the card's own width, so the same layout also works inside narrow desktop dashboard columns.

Collapsed Areas use only their summary capsule. Opening an Area adds one surrounding accent frame that encloses the complete expanded content. An open cover is counted on the cover quick action but does not make the Area itself active. Active climate devices are folded into a compact A/C icon-and-count tag attached to the climate-colored temperature chip instead of consuming a separate quick-action circle; pressing the tag still opens the climate popup. Climate mode and fan controls use Home Assistant's native anchored menus, and the mode menu is the single climate power control.

Dimmable lights are detected automatically from Home Assistant's light capabilities and receive a compact brightness slider. Dragging updates the visual value immediately and sends one `light.turn_on` action with `brightness_pct` when released; releasing at zero turns the light off. The separate power button remains available for a fast toggle.

### Temperature

The displayed temperature is selected in this order:

1. `area_overrides.<area>.temperature_entity`
2. The preferred temperature entity configured on the Home Assistant Area
3. The median of Area sensors whose `device_class` is `temperature`
4. The median `current_temperature` of Area climate entities

Select the preferred source directly in the visual editor when automatic discovery is not the desired result.

The temperature chip also reflects the state of an available climate entity in the Area. It uses a neutral surface while the climate is off, blue while cooling, warm orange while heating, and a separate active surface for fan, dry, mixed, or otherwise active HVAC operation. These colors can be changed in the Appearance editor or YAML:

```yaml
style:
  area_name_size: 14
  temperature_off_surface: rgba(11, 28, 58, 0.94)
  temperature_cool_surface: rgba(34, 113, 196, 0.96)
  temperature_heat_surface: rgba(198, 83, 47, 0.96)
  temperature_active_surface: rgba(91, 86, 168, 0.96)
```

Unavailable climate entities do not produce an active temperature color. When several climate entities are active in different modes, the general active surface is used instead of presenting one mode as authoritative.

### Occupancy

For a real people count, select a numeric entity for each Area:

```yaml
area_overrides:
  kids_room:
    occupancy_count_entity: sensor.kids_room_people_count
```

The value is rounded to the nearest whole number and clamped to zero. `0` is vacant and any positive value is occupied. The Area header shows the number beside the occupancy icon (`9+` for values above nine). An unavailable or non-numeric configured count is shown as unknown instead of pretending that the room is empty.

When no numeric count entity is configured, the card counts active binary sensors with these device classes:

- `occupancy`
- `presence`
- `motion`

Any active sensor means occupied; all inactive sensors means vacant; only unavailable/unknown values mean unknown. In this fallback mode the displayed number is the count of active presence sensors, not an inferred number of people. Override the sensor selection per Area in the editor or YAML with `occupancy_entities`.

### Icons

Floor, Area, and individual entity icons can all be changed from the visual editor or YAML:

```yaml
target_icon: mdi:home-floor-1
area_overrides:
  kids_room:
    icon: mdi:teddy-bear
entity_overrides:
  climate.kids_ac:
    icon: mdi:air-conditioner
```

`target_icon` controls the top-level Area/Floor header. `area_overrides.<area>.icon` controls the Area row, and `entity_overrides.<entity>.icon` controls that device. When an override is empty, the Home Assistant registry icon and then the card fallback icon are used.

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

Quick actions are shown beside the Area header only when their category currently has a powered device. Tapping one opens a responsive Home Assistant-style popup for that category without expanding the Area. The popup shows every included device in that active category, including its currently off members, allows individual on/off control, and provides safe **Turn all on** and **Turn all off** actions. Covers use **Open all** and **Close all**; a fully closed cover category is hidden from the collapsed header.

The badge on an action icon is the number currently powered. When a complete category is off it is omitted from the collapsed header; expand the Area and use the section-wide **Turn all on** or **Open all** control to start it. Tapping a device name opens Home Assistant More Info after safely closing the category popup; Escape, the close button, and tapping outside the popup all close it.

```yaml
show_quick_actions: true
show_area_expand_button: false
quick_actions:
  - lights
  - climate
  - floor_heating
  - switches
  - covers
  - media

quick_action_icons:
  lights: mdi:lightbulb-group
  switches: mdi:lightbulb
  climate: mdi:air-conditioner
  floor_heating: mdi:heating-coil
  covers: mdi:window-shutter
  media: mdi:music
```

`quick_action_icons` is optional and may contain only the actions you want to customize. Empty or invalid values fall back to the card's built-in icon. The visual editor provides an icon picker and reset action for every enabled quick action.

Safety behavior:

- Quick-action group controls are directional; covers open or close instead of toggling.
- Calls are grouped by Domain and target only discovered Entity IDs.
- Hidden and excluded entities are absent. Unavailable or unsupported members remain visible but disabled.
- Protected entities are omitted from group actions but retain deliberate individual control in the popup and expanded Area.
- Buttons are disabled while an action is in flight, and partial failures produce a Home Assistant notification.
- Group and individual operations share pending locks, preventing conflicting service calls to the same category.

### Section-wide on and off actions

Every expanded section heading has two group controls, so a complete category can be started or stopped without operating each tile. Climate, floor heating, lights/switches, and media use their safe on/off services; covers use open/close. Each direction is disabled when no device needs that state and both controls are locked while a request is running.

Section actions follow the same safety boundary as header quick actions: hidden or Area-excluded entities never participate, and unavailable, protected, or unsupported entities are skipped. Service calls are grouped by Domain and target only the remaining discovered Entity IDs; one unsupported device does not prevent other valid devices in the section from being controlled.

### Excluding an entity from one Area

Use an Area exclusion for an always-on or irrelevant entity that should not participate in this card:

```yaml
area_overrides:
  kids_room:
    exclude_entities:
      - switch.kids_room_always_on
```

An excluded entity is removed from the Area tiles, active count, active/inactive Area color, section and header quick actions, and automatic temperature/occupancy summaries. This prevents a permanently-on switch or main floor-heating relay from making the room look active. The visual editor gives every discovered device a complete hide action and keeps locally hidden devices as muted, restorable entries so they can be restored without editing YAML.

Hiding from one Area changes only that Area's `exclude_entities` list and preserves configured temperature and occupancy references for later restoration. Top-level `exclude_entities` and `entity_overrides.<entity>.hidden: true` remain available for deliberate global removal; an Area-level restore does not silently override those global safety rules.

### On/off colors

The Appearance panel provides color swatches, editable CSS values, reset buttons, and a live on/off preview. The main state mapping is:

| State | Style key | Used for |
| --- | --- | --- |
| Off / neutral | `style.row_background` | Floor headers, powered-off Area summaries, and inactive entity tiles. |
| On / active | `style.active_surface` | Active entity tiles and active Area summaries. |
| Active indicator | `style.active_color` | Quick-action count badges and active accents. |

The text value can still use Home Assistant CSS variables or `rgba(...)` when a plain picker color is not sufficient.

### Full example

```yaml
type: custom:area-bubble-overview-card
id: upper-floor-overview
floor: upper_floor
target_icon: mdi:home-floor-1
title: קומה עליונה
language: he
rtl: auto
show_header: true
show_temperature: true
show_occupancy: true
show_quick_actions: true
show_area_expand_button: false
show_empty_sections: false
default_expanded: false
floor_default_expanded: true
remember_expanded_state: true

quick_actions:
  - lights
  - climate
  - floor_heating
  - switches
  - covers
  - media
quick_action_icons:
  lights: mdi:lightbulb-group
  switches: mdi:lightbulb
  climate: mdi:air-conditioner

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
  - parents_bathroom

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
    occupancy_count_entity: sensor.kids_room_people_count
    occupancy_entities:
      - binary_sensor.kids_occupancy
    exclude_entities:
      - switch.kids_room_always_on
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
  parents_bathroom:
    parent_area: parents_room
    show_when_parent_collapsed: false
    icon: mdi:shower

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
  row_background: color-mix(in srgb, var(--secondary-background-color) 78%, transparent)
  active_color: var(--state-active-color, #ffd54f)
  active_surface: rgba(174, 215, 219, 0.94)
  climate_surface: rgba(139, 181, 255, 0.94)
  control_surface: rgba(11, 28, 58, 0.94)
  temperature_off_surface: rgba(11, 28, 58, 0.94)
  temperature_cool_surface: rgba(34, 113, 196, 0.96)
  temperature_heat_surface: rgba(198, 83, 47, 0.96)
  temperature_active_surface: rgba(91, 86, 168, 0.96)
```

### Overview configuration reference

| Key | Default | Notes |
| --- | --- | --- |
| `id` | target-derived | Stable key for remembered expansion; recommended for repeated targets. |
| `area` / `floor` | none | One target is required. IDs and names are accepted; IDs are recommended. |
| `title` | none | Optional overall title; Floor mode still shows the Floor name by default. |
| `target_icon` | registry/fallback icon | Overrides the top-level Area or Floor icon. |
| `language` / `rtl` | `auto` | `he`, `en`; RTL may be `auto`, `true`, or `false`. |
| `show_temperature` | `true` | Shows the preferred/automatic current temperature. |
| `show_occupancy` | `true` | Shows a numeric occupancy/count-sensor badge, including zero and unknown. |
| `show_quick_actions` | `true` | Shows popup triggers only for categories that currently have a powered member. |
| `show_area_expand_button` | `true` | Shows the separate Area chevron. Set `false` to use the Area name as the sole disclosure control and reclaim row width. |
| `show_empty_sections` | `false` | Keeps the layout compact when a category is absent. |
| `default_expanded` | `false` | Initial Area expansion. |
| `floor_default_expanded` | `true` | Initial visibility of all Areas under a Floor header. |
| `remember_expanded_state` | `true` | Stores Floor and Area expansion independently per stable card ID. |
| `section_order` | standard five sections | Priority order; missing built-in sections are appended safely. |
| `section_titles` | localized | Global section headings. |
| `quick_actions` | all six | Enabled actions in display order. |
| `quick_action_icons` | built-in action icons | Optional icon map for `lights`, `switches`, `climate`, `floor_heating`, `covers`, and `media`. |
| `area_order` | Area name | Priority list; newly discovered Areas append automatically. |
| `floor_heating_labels` | common labels | Labels used for explicit heating classification. |
| `floor_heating_entities` | `[]` | Explicit floor-heating entities. |
| `occupancy_device_classes` | occupancy/presence/motion | Automatic presence classes. |
| `exclude_entities` | `[]` | Completely removes entities from Overview. |
| `protected_labels` / `protected_entities` | safe defaults / `[]` | Excluded from quick group actions. |
| `area_overrides` | `{}` | Area name/icon, temperature source, numeric occupancy source, headings, inclusion/exclusion, and order. |
| `area_overrides.<area>.icon` | registry/fallback icon | Overrides one Area row icon. |
| `area_overrides.<area>.parent_area` | none | Visually nests one Floor Area under another without combining state, summaries, or actions. |
| `area_overrides.<area>.show_when_parent_collapsed` | `false` | Keeps this child visible inside its parent while the parent is collapsed. |
| `area_overrides.<area>.occupancy_count_entity` | none | Authoritative numeric people-count entity; zero is vacant. |
| `area_overrides.<area>.occupancy_entities` | automatic | Presence sensors to count when no numeric count entity is selected. |
| `area_overrides.<area>.exclude_entities` | `[]` | Removes entities from display and every Area state/summary calculation. |
| `entity_overrides` | `{}` | Entity name, icon, section, visibility, and group-action protection. |
| `entity_overrides.<entity>.icon` | registry/fallback icon | Overrides one device icon. |
| `style.row_background` | theme-aware neutral | Shared Floor-header, powered-off Area, and inactive-entity background. |
| `style.area_name_size` | `17` | Area-name font size in pixels, clamped to 11–24; also editable in Appearance. |
| `style.active_color` | HA active color | Active badge and indicator color. |
| `style.active_surface` | pale cyan | Active light/switch tile background. |
| `style.climate_surface` | soft blue | Active climate-controller background. |
| `style.control_surface` | dark navy | Temperature, mode, fan, and thermostat control pills. |
| `style.temperature_off_surface` | dark navy | Room-temperature chip when every climate device is off. |
| `style.temperature_cool_surface` | blue | Room-temperature chip while cooling. |
| `style.temperature_heat_surface` | warm orange | Room-temperature chip while heating. |
| `style.temperature_active_surface` | violet | Room-temperature chip for another active or mixed HVAC mode. |

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
- Collapsible Floor defaults plus independently remembered Floor/Area expansion
- Summary, temperature, numeric occupancy, sensor fallback, active quick-action, and Area-chevron settings
- Section title and order editing
- Floor Area order, cycle-safe parent/child nesting, and per-Area overrides
- Floor/Area/entity icon pickers with registry fallbacks
- Quick-action icon pickers with built-in fallbacks and one-click reset
- Preferred temperature, occupancy-count, and occupancy sensor selection
- Complete per-Area entity hiding/restoration that also excludes hidden devices from state, color, summaries, and group actions
- Entity section assignment, names, icons, protection, and priority order
- Convenient on/off and HVAC temperature-state color pickers with CSS-value inputs, reset actions, and live previews
- Adjustable Area-name size, native Home Assistant HVAC/fan menus, and automatic brightness sliders for dimmable lights
- Safe popup and section-heading on/off/open/close controls that honor exclusion, availability, capability, and protection rules
- Hebrew/English, RTL, responsive appearance, long-press More Info, and advanced safety lists

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
