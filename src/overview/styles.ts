import { css } from "lit";

export const overviewCardStyles = css`
  :host {
    display: block;
    container-name: overview-card;
    container-type: inline-size;
    direction: var(--aboc-direction, ltr);
    text-align: start;
    color: var(--primary-text-color);
    --aboc-radius: var(--area-bubble-overview-border-radius, 26px);
    --aboc-blur: var(--area-bubble-overview-blur, 18px);
    --aboc-gap: var(--area-bubble-overview-gap, 12px);
    --aboc-row-height: var(--area-bubble-overview-row-height, 56px);
    --aboc-accent: var(--area-bubble-overview-accent, var(--primary-color));
    --aboc-active: var(--area-bubble-overview-active, var(--state-active-color, #ffd54f));
    --aboc-active-surface: var(--area-bubble-overview-active-surface, rgba(174, 215, 219, 0.94));
    --aboc-climate-surface: var(--area-bubble-overview-climate-surface, rgba(139, 181, 255, 0.94));
    --aboc-control-surface: var(--area-bubble-overview-control-surface, rgba(11, 28, 58, 0.94));
    --aboc-climate: var(--area-bubble-overview-climate-color, var(--state-climate-cool-color, #2196f3));
    --aboc-cover: var(--area-bubble-overview-cover-color, var(--state-cover-active-color, #00bcd4));
    --aboc-media: var(--area-bubble-overview-media-color, var(--state-media-player-active-color, #9c27b0));
    --aboc-row-bg: var(--area-bubble-overview-row-bg, rgba(74, 74, 74, 0.88));
    --aboc-shadow: var(--area-bubble-overview-shadow, 0 12px 30px rgba(0, 0, 0, 0.2));
    --aboc-dark-text: #111827;
    --aboc-light-text: #f4f3ec;
  }

  * {
    box-sizing: border-box;
  }

  button,
  select {
    font: inherit;
  }

  ha-card {
    overflow: hidden;
    border: 1px solid color-mix(in srgb, var(--divider-color) 58%, transparent);
    border-radius: var(--aboc-radius);
    background:
      linear-gradient(145deg, rgba(255, 255, 255, 0.075), rgba(255, 255, 255, 0.025)),
      var(--ha-card-background, var(--card-background-color));
    box-shadow: var(--aboc-shadow);
    backdrop-filter: blur(var(--aboc-blur));
    -webkit-backdrop-filter: blur(var(--aboc-blur));
  }

  .root {
    display: grid;
    gap: var(--aboc-gap);
    padding: 12px;
  }

  .overview-heading {
    direction: ltr;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 2px 4px 4px;
  }

  .overview-heading.floor-heading {
    padding: 0;
  }

  .floor-toggle {
    direction: ltr;
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) 44px;
    align-items: center;
    gap: 10px;
    width: 100%;
    min-height: 58px;
    padding: 6px 7px;
    border: 1px solid color-mix(in srgb, var(--divider-color) 70%, transparent);
    border-radius: calc(var(--aboc-radius) - 4px);
    background: color-mix(in srgb, var(--secondary-background-color) 78%, transparent);
    color: var(--primary-text-color);
    text-align: start;
    cursor: pointer;
  }

  .floor-toggle .heading-main {
    direction: var(--aboc-direction, ltr);
    display: grid;
    gap: 2px;
    min-width: 0;
  }

  .floor-title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 18px;
    font-weight: 760;
  }

  .floor-chevron {
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    border-radius: 999px;
    background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
    transition: transform 160ms ease;
  }

  .floor-chevron.expanded {
    transform: rotate(180deg);
  }

  .overview-heading .heading-main {
    direction: var(--aboc-direction, ltr);
    min-width: 0;
    flex: 1;
  }

  .overview-heading h2 {
    overflow: hidden;
    margin: 0;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 18px;
    font-weight: 750;
  }

  .overview-heading .subtitle,
  .secondary,
  .state-text,
  .active-summary {
    color: var(--secondary-text-color);
    font-size: 12px;
    line-height: 1.35;
  }

  .areas {
    display: grid;
    gap: var(--aboc-gap);
  }

  .area-panel {
    overflow: hidden;
    border: 1px solid color-mix(in srgb, var(--divider-color) 78%, transparent);
    border-radius: calc(var(--aboc-radius) + 4px);
    background: color-mix(in srgb, var(--secondary-background-color) 76%, transparent);
    transition: border-color 160ms ease, background-color 160ms ease;
  }

  .area-panel.expanded {
    background: color-mix(in srgb, var(--secondary-background-color) 88%, transparent);
  }

  .area-panel.expanded.has-active {
    border-color: color-mix(in srgb, var(--aboc-accent) 46%, var(--divider-color));
  }

  .area-panel.expanded.all-off {
    border-color: color-mix(in srgb, var(--divider-color) 82%, transparent);
  }

  .area-summary {
    direction: ltr;
    display: grid;
    grid-template-columns: minmax(0, 1fr) 44px;
    align-items: center;
    gap: 6px;
    padding: 8px;
  }

  .area-summary-pill {
    display: flex;
    align-items: center;
    gap: 6px;
    min-width: 0;
    min-height: 60px;
    padding: 5px 8px 5px 5px;
    border: 2px solid color-mix(in srgb, var(--divider-color) 72%, transparent);
    border-radius: 999px;
    background: var(--aboc-row-bg);
    color: var(--primary-text-color);
    transition: border-color 160ms ease, background-color 160ms ease, color 160ms ease;
  }

  .area-panel.has-active .area-summary-pill {
    border-color: color-mix(in srgb, var(--aboc-control-surface) 72%, var(--divider-color));
    background: var(--aboc-active-surface);
    color: var(--aboc-dark-text);
  }

  .area-summary-pill.dense-actions {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto auto;
    grid-template-areas:
      "area-toggle occupancy area-temperature"
      "quick-actions quick-actions quick-actions";
    border-radius: calc(var(--aboc-radius) - 2px);
  }

  .area-summary-pill.dense-actions .area-toggle {
    grid-area: area-toggle;
    width: 100%;
  }

  .area-summary-pill.dense-actions .area-statuses {
    display: contents;
  }

  .area-summary-pill.dense-actions .occupancy {
    grid-area: occupancy;
  }

  .area-summary-pill.dense-actions .area-temperature {
    grid-area: area-temperature;
  }

  .area-summary-pill.dense-actions .quick-actions {
    grid-area: quick-actions;
    justify-self: stretch;
    justify-content: flex-end;
    width: 100%;
    max-width: none;
    overflow: visible;
    flex-wrap: wrap;
  }

  .area-toggle {
    direction: ltr;
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    align-items: center;
    gap: 9px;
    min-width: 92px;
    flex: 1 1 132px;
    min-height: 48px;
    padding: 0;
    border: 0;
    border-radius: 999px;
    background: transparent;
    color: inherit;
    text-align: start;
    cursor: pointer;
  }

  .area-main,
  .entity-main {
    direction: var(--aboc-direction, ltr);
    min-width: 0;
    text-align: start;
  }

  .area-name {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 17px;
    font-weight: 780;
  }

  .active-summary {
    display: block;
    margin-top: 1px;
    color: color-mix(in srgb, var(--aboc-dark-text) 72%, transparent);
    font-weight: 650;
  }

  .area-statuses {
    direction: ltr;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 5px;
    min-width: 0;
  }

  .expand-button {
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    padding: 0;
    border: 0;
    border-radius: 999px;
    background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
    color: var(--primary-text-color);
    cursor: pointer;
  }

  .chevron {
    display: grid;
    place-items: center;
    transition: transform 160ms ease;
  }

  .expanded .chevron {
    transform: rotate(180deg);
  }

  .icon-bubble {
    display: inline-grid;
    place-items: center;
    width: 48px;
    height: 48px;
    flex: 0 0 auto;
    border-radius: 999px;
    background: color-mix(in srgb, var(--primary-text-color) 9%, transparent);
    color: var(--aboc-accent);
  }

  .area-panel.has-active .area-icon {
    background: color-mix(in srgb, var(--aboc-control-surface) 72%, transparent);
    color: var(--aboc-light-text);
  }

  .area-panel.all-off .area-icon {
    background: color-mix(in srgb, var(--primary-text-color) 9%, transparent);
    color: var(--secondary-text-color);
  }

  .icon-bubble.small {
    width: 44px;
    height: 44px;
  }

  .icon-bubble ha-icon {
    --mdc-icon-size: 25px;
  }

  .summary-chip,
  .quick-action,
  .control-button,
  .climate-mode-button {
    position: relative;
    display: inline-grid;
    place-items: center;
    width: 44px;
    height: 44px;
    flex: 0 0 44px;
    padding: 0;
    border: 0;
    border-radius: 999px;
    background: var(--aboc-control-surface);
    color: var(--aboc-light-text);
  }

  .summary-chip {
    gap: 4px;
    font-size: 11px;
    font-weight: 700;
  }

  .summary-chip.occupied {
    color: var(--success-color, #74d680);
  }

  .summary-chip.occupancy {
    grid-template-columns: auto auto;
    width: auto;
    min-width: 44px;
    padding-inline: 9px;
    font-variant-numeric: tabular-nums;
  }

  .summary-chip.occupancy.vacant {
    color: var(--secondary-text-color);
  }

  .summary-chip.occupancy.unknown {
    color: var(--warning-color, #ffb74d);
  }

  .occupancy-count {
    min-width: 1ch;
    font-size: 13px;
    font-weight: 820;
    line-height: 1;
  }

  .summary-chip ha-icon,
  .quick-action ha-icon {
    --mdc-icon-size: 21px;
  }

  .occupancy-label {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
  }

  .quick-actions {
    direction: ltr;
    display: flex;
    align-items: center;
    gap: 5px;
    width: max-content;
    flex: 0 0 auto;
    max-width: clamp(44px, 24cqi, 142px);
    overflow: visible;
  }

  .quick-action {
    cursor: pointer;
    transition: transform 120ms ease, filter 120ms ease;
  }

  .quick-action .count-badge {
    position: absolute;
    inset-block-start: -3px;
    inset-inline-end: -3px;
    display: grid;
    place-items: center;
    min-width: 17px;
    height: 17px;
    padding: 0 4px;
    border: 2px solid var(--aboc-active-surface);
    border-radius: 999px;
    background: var(--aboc-active);
    color: #111;
    font-size: 9px;
    font-weight: 850;
  }

  .temperature {
    direction: ltr;
    min-width: max-content;
    padding: 9px 12px;
    border-radius: 999px;
    background: var(--aboc-control-surface);
    color: var(--aboc-light-text);
    font-size: 14px;
    font-weight: 750;
    font-variant-numeric: tabular-nums;
    unicode-bidi: isolate;
  }

  .expanded-content {
    display: grid;
    gap: 13px;
    padding: 0 9px 10px;
    animation: overview-expand 170ms ease both;
  }

  .device-section {
    display: grid;
    gap: 7px;
    min-width: 0;
  }

  .section-heading {
    direction: ltr;
    display: flex;
    align-items: center;
    gap: 7px;
    min-height: 30px;
    margin: 0;
    padding: 0 7px;
    color: var(--secondary-text-color);
    font-size: 14px;
    font-weight: 680;
    letter-spacing: 0.01em;
  }

  .section-heading ha-icon {
    color: var(--aboc-accent);
    --mdc-icon-size: 18px;
  }

  .section-heading > span:not(.section-count) {
    direction: var(--aboc-direction, ltr);
    text-align: start;
  }

  .section-count {
    margin-inline-start: auto;
    font-size: 11px;
    font-variant-numeric: tabular-nums;
  }

  .section-entities {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 8px;
    min-width: 0;
  }

  .section-lights_switches .section-entities,
  .section-floor_heating .section-entities {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .full-span,
  .section-empty {
    grid-column: 1 / -1;
  }

  .entity-card {
    min-width: 0;
    border: 1px solid color-mix(in srgb, var(--divider-color) 64%, transparent);
    border-radius: calc(var(--aboc-radius) - 2px);
    background:
      linear-gradient(145deg, rgba(255, 255, 255, 0.055), transparent),
      var(--aboc-row-bg);
    color: var(--primary-text-color);
  }

  .entity-lead {
    direction: ltr;
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    align-items: center;
    gap: 9px;
    min-width: 0;
    min-height: 44px;
    padding: 0;
    border: 0;
    border-radius: calc(var(--aboc-radius) - 6px);
    background: transparent;
    color: inherit;
    text-align: start;
    cursor: pointer;
  }

  .entity-name {
    display: -webkit-box;
    overflow: hidden;
    font-size: 15px;
    font-weight: 720;
    line-height: 1.22;
    overflow-wrap: anywhere;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }

  .state-text {
    display: block;
    overflow: hidden;
    margin-top: 2px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .toggle-tile {
    direction: ltr;
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    align-items: center;
    gap: 9px;
    width: 100%;
    min-height: max(56px, var(--aboc-row-height));
    padding: 8px 10px;
    text-align: start;
    cursor: pointer;
    transition: transform 120ms ease, background-color 140ms ease, color 140ms ease;
  }

  .hold-target {
    touch-action: pan-y;
    user-select: none;
    -webkit-user-select: none;
  }

  .hold-target.holding {
    filter: brightness(1.08);
    transform: scale(0.98);
  }

  .toggle-tile.active {
    border-color: color-mix(in srgb, var(--aboc-control-surface) 62%, transparent);
    background: var(--aboc-active-surface);
    color: var(--aboc-dark-text);
  }

  .toggle-tile.active .icon-bubble {
    background: color-mix(in srgb, var(--aboc-control-surface) 78%, transparent);
    color: var(--aboc-light-text);
  }

  .toggle-tile.active .state-text {
    color: color-mix(in srgb, var(--aboc-dark-text) 70%, transparent);
  }

  .climate-card,
  .thermostat-card {
    display: grid;
    gap: 8px;
    min-height: 108px;
    padding: 9px;
  }

  .climate-card.active {
    border: 2px solid color-mix(in srgb, var(--aboc-climate) 66%, var(--aboc-control-surface));
    background: var(--aboc-climate-surface);
    color: var(--aboc-dark-text);
  }

  .climate-card.active .state-text,
  .thermostat-card.active .state-text {
    color: color-mix(in srgb, var(--aboc-dark-text) 70%, transparent);
  }

  .climate-card.active .icon-bubble,
  .thermostat-card.active .icon-bubble {
    background: color-mix(in srgb, var(--aboc-control-surface) 74%, transparent);
    color: var(--aboc-light-text);
  }

  .climate-primary {
    direction: ltr;
    display: grid;
    grid-template-columns: minmax(88px, 1fr) 44px auto;
    align-items: center;
    gap: 7px;
    min-width: 0;
  }

  .climate-mode-button,
  .control-button {
    border: 0;
    cursor: pointer;
    transition: transform 120ms ease, filter 120ms ease;
  }

  .climate-mode-button ha-icon,
  .control-button ha-icon {
    --mdc-icon-size: 23px;
  }

  .climate-secondary {
    direction: ltr;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
  }

  .temperature-range {
    direction: ltr;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
  }

  .range-stepper {
    width: 100%;
    min-width: 0;
  }

  .range-stepper small {
    display: block;
    margin-bottom: -2px;
    font-size: 9px;
    font-weight: 600;
    opacity: 0.72;
  }

  .select-pill {
    direction: ltr;
    display: grid;
    grid-template-columns: 26px minmax(0, 1fr) 22px;
    align-items: center;
    gap: 5px;
    min-width: 0;
    min-height: 44px;
    padding: 0 8px;
    border-radius: 999px;
    background: var(--aboc-control-surface);
    color: var(--aboc-light-text);
  }

  .select-pill > ha-icon {
    --mdc-icon-size: 21px;
  }

  .select-pill select {
    width: 100%;
    min-width: 0;
    height: 44px;
    padding: 0;
    border: 0;
    outline: 0;
    appearance: none;
    background: transparent;
    color: inherit;
    text-align: center;
    font-size: 13px;
    font-weight: 680;
    cursor: pointer;
  }

  .select-pill select option {
    background: var(--card-background-color);
    color: var(--primary-text-color);
  }

  .select-chevron {
    pointer-events: none;
  }

  .temperature-stepper {
    direction: ltr;
    display: grid;
    grid-template-columns: 44px minmax(52px, 1fr) 44px;
    align-items: center;
    min-width: 140px;
    min-height: 44px;
    border-radius: 999px;
    background: var(--aboc-control-surface);
    color: var(--aboc-light-text);
  }

  .temperature-stepper button {
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    padding: 0;
    border: 0;
    border-radius: 999px;
    background: transparent;
    color: inherit;
    cursor: pointer;
  }

  .temperature-stepper span {
    min-width: 0;
    text-align: center;
    font-size: 14px;
    font-weight: 750;
    font-variant-numeric: tabular-nums;
    unicode-bidi: isolate;
  }

  .current-temperature {
    align-self: center;
  }

  .thermostat-card.active {
    border-color: color-mix(in srgb, var(--aboc-control-surface) 52%, transparent);
    background: color-mix(in srgb, var(--aboc-active-surface) 74%, var(--aboc-row-bg));
    color: var(--aboc-dark-text);
  }

  .thermostat-primary {
    direction: ltr;
    display: grid;
    grid-template-columns: minmax(110px, 1fr) auto;
    align-items: center;
    gap: 8px;
    min-width: 0;
  }

  .thermostat-power {
    direction: ltr;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    width: 100%;
    min-height: 44px;
    border: 0;
    border-radius: 999px;
    background: var(--aboc-control-surface);
    color: var(--aboc-light-text);
    cursor: pointer;
  }

  .thermostat-power ha-icon {
    --mdc-icon-size: 22px;
  }

  .cover-card,
  .media-card {
    direction: ltr;
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
    gap: 8px;
    min-height: max(56px, var(--aboc-row-height));
    padding: 8px 10px;
  }

  .cover-card.active {
    border-color: color-mix(in srgb, var(--aboc-cover) 42%, var(--divider-color));
  }

  .media-card.active {
    border-color: color-mix(in srgb, var(--aboc-media) 42%, var(--divider-color));
  }

  .cover-controls,
  .media-controls {
    direction: ltr;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 3px;
  }

  .cover-control {
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    padding: 0;
    border: 0;
    border-radius: 999px;
    background: transparent;
    color: var(--primary-text-color);
    cursor: pointer;
  }

  .cover-control ha-icon {
    --mdc-icon-size: 27px;
  }

  .media-controls .secondary {
    min-width: 38px;
    text-align: center;
    font-variant-numeric: tabular-nums;
  }

  button[disabled],
  select[disabled] {
    cursor: not-allowed;
    opacity: 0.42;
  }

  .toggle-tile[aria-disabled="true"] {
    cursor: not-allowed;
    opacity: 0.56;
  }

  .entity-card.unavailable {
    border-style: dashed;
  }

  .entity-card.unavailable .entity-main {
    opacity: 0.72;
  }

  ha-icon[icon="mdi:loading"] {
    animation: overview-spin 0.9s linear infinite;
  }

  .area-toggle:hover,
  .floor-toggle:hover,
  .expand-button:hover,
  .entity-lead:hover,
  .quick-action:hover:not([disabled]),
  .control-button:hover:not([disabled]),
  .climate-mode-button:hover:not([disabled]),
  .cover-control:hover:not([disabled]),
  .temperature-stepper button:hover:not([disabled]),
  .thermostat-power:hover:not([disabled]) {
    filter: brightness(1.1);
  }

  .toggle-tile:hover:not([aria-disabled="true"]) {
    transform: translateY(-1px);
  }

  .quick-action:active:not([disabled]),
  .control-button:active:not([disabled]),
  .climate-mode-button:active:not([disabled]),
  .cover-control:active:not([disabled]),
  .temperature-stepper button:active:not([disabled]),
  .thermostat-power:active:not([disabled]),
  .toggle-tile:active:not([aria-disabled="true"]) {
    transform: scale(0.96);
  }

  button:focus-visible,
  select:focus-visible,
  .entity-lead:focus-visible {
    outline: 0;
    box-shadow: inset 0 0 0 2px var(--aboc-accent), 0 0 0 2px color-mix(in srgb, var(--aboc-accent) 34%, transparent);
  }

  .empty,
  .warning {
    display: grid;
    place-items: center;
    gap: 8px;
    min-height: 116px;
    padding: 22px;
    color: var(--secondary-text-color);
    text-align: center;
  }

  .warning {
    min-height: auto;
    padding: 10px;
    border-radius: 12px;
    background: color-mix(in srgb, var(--warning-color, #ff9800) 12%, transparent);
    color: var(--warning-color, #ff9800);
    font-size: 12px;
  }

  .debug {
    overflow: auto;
    margin: 0;
    padding: 10px;
    border-radius: 12px;
    background: rgba(0, 0, 0, 0.16);
    direction: ltr;
    color: var(--secondary-text-color);
    font: 11px/1.4 monospace;
    text-align: left;
    white-space: pre-wrap;
  }

  @keyframes overview-expand {
    from { opacity: 0; transform: translateY(-4px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes overview-spin {
    to { transform: rotate(360deg); }
  }

  @container overview-card (max-width: 430px) {
    .root {
      padding: 8px;
    }

    .area-summary {
      padding: 6px;
    }

    .area-summary-pill {
      min-height: 58px;
      padding-inline-end: 6px;
    }

    .area-toggle {
      min-width: 98px;
      flex-basis: 112px;
    }

    .active-summary {
      display: none;
    }

    .area-summary-pill:not(.dense-actions):not(.responsive-actions) .quick-actions {
      max-width: 93px;
    }

    .area-temperature {
      padding-inline: 10px;
      font-size: 13px;
    }

    .section-heading {
      padding-inline: 5px;
    }

    .expanded-content {
      padding-inline: 7px;
    }
  }

  @container overview-card (max-width: 380px) {
    .area-summary-pill.responsive-actions {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto auto;
      grid-template-areas:
        "area-toggle occupancy area-temperature"
        "quick-actions quick-actions quick-actions";
      border-radius: calc(var(--aboc-radius) - 2px);
    }

    .area-summary-pill.responsive-actions .area-toggle {
      grid-area: area-toggle;
      width: 100%;
    }

    .area-summary-pill.responsive-actions .area-statuses {
      display: contents;
    }

    .area-summary-pill.responsive-actions .occupancy {
      grid-area: occupancy;
    }

    .area-summary-pill.responsive-actions .area-temperature {
      grid-area: area-temperature;
    }

    .area-summary-pill.responsive-actions .quick-actions {
      grid-area: quick-actions;
      justify-self: stretch;
      justify-content: flex-end;
      width: 100%;
      max-width: none;
      overflow: visible;
      flex-wrap: wrap;
    }
  }

  @container overview-card (max-width: 360px) {
    .area-summary {
      grid-template-columns: minmax(0, 1fr) 40px;
      gap: 3px;
    }

    .area-summary-pill {
      gap: 4px;
    }

    .area-toggle {
      min-width: 84px;
      flex-basis: 96px;
      gap: 6px;
    }

    .area-name {
      font-size: 15px;
    }

    .area-summary-pill .area-icon,
    .area-summary-pill .summary-chip:not(.occupancy) {
      width: 40px;
      height: 40px;
      flex-basis: 40px;
    }

    .area-summary-pill .area-icon {
      width: 44px;
      height: 44px;
    }

    .area-summary-pill:not(.dense-actions):not(.responsive-actions) .quick-actions {
      max-width: 93px;
    }

    .area-summary-pill .occupancy {
      min-height: 40px;
      height: 40px;
      padding-inline: 7px;
    }
  }

  @container overview-card (max-width: 340px) {
    .area-summary-pill,
    .area-summary-pill.dense-actions,
    .area-summary-pill.responsive-actions {
      display: grid;
      grid-template-columns: auto minmax(0, 1fr);
      grid-template-areas:
        "area-toggle area-toggle"
        "occupancy area-temperature"
        "quick-actions quick-actions";
    }

    .area-summary-pill .area-toggle,
    .area-summary-pill.dense-actions .area-toggle,
    .area-summary-pill.responsive-actions .area-toggle {
      grid-area: area-toggle;
      width: 100%;
      min-width: 0;
    }

    .area-statuses {
      display: contents;
    }

    .area-temperature {
      grid-area: area-temperature;
      justify-self: end;
    }

    .occupancy {
      grid-area: occupancy;
      justify-self: start;
    }

    .quick-actions {
      grid-area: quick-actions;
      justify-self: stretch;
      justify-content: flex-end;
      width: 100%;
      max-width: 100%;
      flex-basis: auto;
      overflow: visible;
      flex-wrap: wrap;
    }

    .climate-primary {
      grid-template-columns: minmax(0, 1fr) 44px;
    }

    .climate-primary .temperature-stepper,
    .climate-primary .current-temperature {
      grid-column: 1 / -1;
      width: 100%;
    }

    .temperature-range {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  @container overview-card (max-width: 299px) {
    .section-lights_switches .section-entities,
    .section-floor_heating .section-entities {
      grid-template-columns: minmax(0, 1fr);
    }

    .climate-secondary,
    .thermostat-primary,
    .cover-card,
    .media-card {
      grid-template-columns: minmax(0, 1fr);
    }

    .thermostat-primary .temperature-stepper {
      width: 100%;
    }

    .cover-controls,
    .media-controls {
      justify-content: stretch;
    }

    .cover-controls > *,
    .media-controls > * {
      flex: 1 1 44px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .expanded-content,
    ha-icon[icon="mdi:loading"] {
      animation: none;
    }

    .chevron,
    .floor-chevron,
    .quick-action,
    .control-button,
    .climate-mode-button,
    .toggle-tile,
    .hold-target {
      transition: none;
    }
  }
`;
