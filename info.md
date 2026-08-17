# Area Bubble Cards

One HACS resource containing two Home Assistant Lovelace cards:

- `custom:area-bubble-expander-card` — active devices grouped by Area.
- `custom:area-bubble-overview-card` — complete Area or Floor overview with temperature, occupancy, climate, heating, covers, lights/switches, music, quick actions, and a visual editor.

Both cards support Hebrew/English, RTL, responsive layouts, automatic Home Assistant registry discovery, custom ordering, and protected group actions. Overview also includes ten professional color families with selectable light/dark variants, restrained gradients and accessible text colors, complete per-entity hiding, visible-but-activity-ignored devices, visual parent/child Areas, searchable icon pickers, climate-aware temperature colors, configurable presence colors, transparent or custom card backgrounds, independent active-room and active-device surfaces, configurable Area/category/device frames, state-colored expanded Areas, selectable quick-action placement, attached climate/fan tags, smart Area-name removal with per-device overrides, automatic but manually overridable fan/floor-heating mapping (while bathroom vents remain with lights and switches), editable fan/heating-control sub-group titles with powered duration, general-room-first named sub-areas with nested categories and configurable order, adaptive one-to-three-column light grids, one-or-two-column cover grids with lone-cover full-width behavior, compact/medium/wide device-card presets, adjustable device heights, icon/text category actions and HVAC/fan modes, per-device tile shape/icon/state-language controls, optional Floor and Area chevrons, full free-summary click targets, per-room inline Expander or modal Popup opening, category control popups, native HVAC/fan menus, single-row conditional brightness sliders for dimmable lights, adjustable Area-name typography, active-Floor room shutdown controls, and a Floor climate popup. Open covers remain controllable without coloring a room or Floor active.

Room Popups also support independently collapsible real child Areas, and automatic Climate fans may be shown either as the full subgroup or as a compact oval button that opens the fan-only control Popup.

Multi-column device grids now contract to their real item count. Automatic Floor-heating relays may likewise use full-width subgroup tiles or a compact oval button that opens a relay-only control Popup.

The Overview editor follows a global-first workflow: room, category, and device exceptions remain fully editable but stay behind explicit nested edit controls. The compact Floor-heating relay button defaults to the short `מפסק` / `Switch` label and can still be renamed globally or per room.

All professional light and dark palettes now keep active rooms visually quieter than active entity tiles, with independent editor preview swatches and automated room/device separation plus accessible text-contrast checks. The Classic fallback follows the same clear hierarchy.

Thermostat controls use optimistic, server-reconciled targets for reliable repeated adjustments and follow Home Assistant's capability bits, Celsius/Fahrenheit step defaults, bounds, and distinct single/range temperature payloads. Cover controls are position-, movement-, capability-, and assumed-state-aware in expanded rows, Popups, and group actions; Stop and reversal remain available even when an integration reports movement late. HVAC mode, fan mode, Floor-heating ranges, dimmers, covers, media, legacy service mappings, and rejected actions are covered by direct runtime regression tests.

Install through HACS as a Lovelace card and add the resource:

```yaml
url: /hacsfiles/area-bubble-expander-card/area-bubble-expander-card.js
type: module
```
