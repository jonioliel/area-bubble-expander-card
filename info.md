# Area Bubble Cards

One HACS resource containing two Home Assistant Lovelace cards:

- `custom:area-bubble-expander-card` — active devices grouped by Area.
- `custom:area-bubble-overview-card` — complete Area or Floor overview with temperature, occupancy, climate, heating, covers, lights/switches, music, quick actions, and a visual editor.

Both cards support Hebrew/English, RTL, responsive layouts, automatic Home Assistant registry discovery, custom ordering, and protected group actions. Overview also includes complete per-entity hiding, visual parent/child Areas, editable quick-action icons, climate-aware temperature colors, transparent or custom card backgrounds, state-colored expanded Areas, single-row active-only mobile summaries, an optional Area chevron, category control popups, native HVAC/fan menus, brightness sliders for dimmable lights, adjustable Area-name typography, named device sub-groups, configurable category spacing/backgrounds/frames/action controls, and active-Floor room shutdown controls. Open covers remain controllable without coloring a room or Floor active.

Install through HACS as a Lovelace card and add the resource:

```yaml
url: /hacsfiles/area-bubble-expander-card/area-bubble-expander-card.js
type: module
```
