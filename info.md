# Area Bubble Cards

One HACS resource containing two Home Assistant Lovelace cards:

- `custom:area-bubble-expander-card` — active devices grouped by Area.
- `custom:area-bubble-overview-card` — complete Area or Floor overview with temperature, occupancy, climate, heating, covers, lights/switches, music, quick actions, and a visual editor.

Both cards support Hebrew/English, RTL, responsive layouts, automatic Home Assistant registry discovery, custom ordering, and protected group actions. Overview also includes four professional coordinated themes with restrained gradients and accessible text colors, complete per-entity hiding, visible-but-activity-ignored devices, visual parent/child Areas, searchable icon pickers, climate-aware temperature colors, configurable presence colors, transparent or custom card backgrounds, independent active-room and active-device surfaces, configurable Area/category/device frames, state-colored expanded Areas, selectable quick-action placement, attached climate/fan tags, automatic but manually overridable fan/floor-heating mapping (while bathroom vents remain with lights and switches), compact fan/heating-control sub-groups with powered duration, one-to-three-column light grids, one-or-two-column cover grids, adjustable device heights, icon/text category actions and HVAC/fan modes, per-device tile shape/icon/state-language controls, optional Floor and Area chevrons, full free-summary click targets, per-room inline Expander or modal Popup opening, category control popups, native HVAC/fan menus, brightness sliders for dimmable lights, adjustable Area-name typography, named device sub-groups, active-Floor room shutdown controls, and a Floor climate popup. Open covers remain controllable without coloring a room or Floor active.

Install through HACS as a Lovelace card and add the resource:

```yaml
url: /hacsfiles/area-bubble-expander-card/area-bubble-expander-card.js
type: module
```
