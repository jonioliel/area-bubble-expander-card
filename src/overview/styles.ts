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
    --aboc-section-gap: var(--area-bubble-overview-section-gap, 12px);
    --aboc-row-height: var(--area-bubble-overview-row-height, 56px);
    --aboc-area-name-size: var(--area-bubble-overview-area-name-size, 17px);
    --aboc-quick-action-size: var(--area-bubble-overview-quick-action-size, 38px);
    --aboc-quick-action-icon-size: var(--area-bubble-overview-quick-action-icon-size, 20px);
    --aboc-section-action-size: var(--area-bubble-overview-section-action-size, 44px);
    --aboc-section-action-icon-size: var(--area-bubble-overview-section-action-icon-size, 22px);
    --aboc-accent: var(--area-bubble-overview-accent, var(--primary-color));
    --aboc-active: var(--area-bubble-overview-active, var(--state-active-color, #ffd54f));
    --aboc-active-surface: var(--area-bubble-overview-active-surface, rgba(174, 215, 219, 0.94));
    --aboc-climate-surface: var(--area-bubble-overview-climate-surface, rgba(139, 181, 255, 0.94));
    --aboc-control-surface: var(--area-bubble-overview-control-surface, rgba(11, 28, 58, 0.94));
    --aboc-climate: var(--area-bubble-overview-climate-color, var(--state-climate-cool-color, #2196f3));
    --aboc-cover: var(--area-bubble-overview-cover-color, var(--state-cover-active-color, #00bcd4));
    --aboc-media: var(--area-bubble-overview-media-color, var(--state-media-player-active-color, #9c27b0));
    --aboc-temperature-off: var(--area-bubble-overview-temperature-off-surface, rgba(11, 28, 58, 0.94));
    --aboc-temperature-cool: var(--area-bubble-overview-temperature-cool-surface, rgba(34, 113, 196, 0.96));
    --aboc-temperature-heat: var(--area-bubble-overview-temperature-heat-surface, rgba(198, 83, 47, 0.96));
    --aboc-temperature-active: var(--area-bubble-overview-temperature-active-surface, rgba(91, 86, 168, 0.96));
    --aboc-row-bg: var(
      --area-bubble-overview-row-bg,
      color-mix(in srgb, var(--secondary-background-color) 78%, transparent)
    );
    --aboc-card-bg: var(--area-bubble-overview-card-bg, transparent);
    --aboc-card-border: var(--area-bubble-overview-card-border, transparent);
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
    border: 1px solid var(--aboc-card-border);
    border-radius: var(--aboc-radius);
    background: var(--aboc-card-bg);
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
    direction: var(--aboc-direction, ltr);
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 2px 4px 4px;
  }

  .overview-heading.floor-heading {
    padding: 0;
  }

  .floor-summary-pill {
    direction: var(--aboc-direction, ltr);
    display: flex;
    align-items: center;
    gap: 6px;
    width: 100%;
    padding: 5px;
    border: 2px solid color-mix(in srgb, var(--divider-color) 70%, transparent);
    border-radius: calc(var(--aboc-radius) - 4px);
    background: var(--aboc-row-bg);
    color: var(--primary-text-color);
  }

  .floor-heading.has-active .floor-summary-pill {
    border-color: color-mix(in srgb, var(--aboc-control-surface) 72%, var(--divider-color));
    background: var(--aboc-active-surface);
    color: var(--aboc-dark-text);
  }

  .floor-toggle {
    direction: var(--aboc-direction, ltr);
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) 44px;
    align-items: center;
    gap: 10px;
    width: auto;
    min-width: 0;
    flex: 1 1 auto;
    min-height: 58px;
    padding: 1px 2px;
    border: 0;
    border-radius: calc(var(--aboc-radius) - 8px);
    background: transparent;
    color: inherit;
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

  .floor-active-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 3px;
    min-width: 44px;
    height: 44px;
    padding-inline: 7px;
    border: 0;
    border-radius: 999px;
    background: var(--aboc-control-surface);
    color: var(--aboc-light-text);
    font-size: 12px;
    font-weight: 820;
    cursor: pointer;
  }

  .floor-active-badge ha-icon {
    --mdc-icon-size: 19px;
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

  .area-tree-node,
  .subareas {
    display: grid;
    gap: var(--aboc-gap);
    min-width: 0;
  }

  .subareas {
    margin-block-end: 8px;
    margin-inline-end: 8px;
    margin-inline-start: 22px;
    padding-block-start: 2px;
    padding-inline-start: 9px;
    border-inline-start: 2px solid color-mix(in srgb, var(--aboc-accent) 38%, var(--divider-color));
  }

  .subareas .subareas {
    margin-inline-start: 14px;
    padding-inline-start: 7px;
  }

  .subareas .subareas .subareas {
    margin-inline-start: 8px;
    padding-inline-start: 4px;
  }

  .area-panel {
    --aboc-area-frame-color: color-mix(
      in srgb,
      var(--divider-color, rgba(127, 127, 127, 0.45)) 72%,
      transparent
    );
    overflow: visible;
    border: 0;
    border-radius: 0;
    background: transparent;
  }

  .area-panel.expanded {
    overflow: hidden;
    border: 2px solid var(--aboc-area-frame-color);
    border-radius: calc(var(--aboc-radius) + 4px);
    background: var(--aboc-row-bg);
  }

  .area-panel.has-active {
    --aboc-area-frame-color: color-mix(
      in srgb,
      var(--aboc-control-surface) 72%,
      var(--divider-color, rgba(127, 127, 127, 0.45))
    );
  }

  .area-panel.expanded.has-active {
    background: var(--aboc-active-surface);
  }

  .area-panel.expanded > .area-summary {
    width: calc(100% + 4px);
    margin-block: -2px 0;
    margin-inline: -2px;
    padding: 0;
  }

  .area-panel:not(.expanded) > .area-summary {
    padding: 0;
  }

  .area-summary {
    direction: var(--aboc-direction, ltr);
    display: grid;
    grid-template-columns: minmax(0, 1fr) 44px;
    align-items: center;
    gap: 6px;
    padding: 8px;
  }

  .area-summary.without-expand-button {
    grid-template-columns: minmax(0, 1fr);
  }

  .area-summary-pill {
    display: flex;
    direction: var(--aboc-direction, ltr);
    align-items: center;
    gap: 6px;
    min-width: 0;
    min-height: 60px;
    padding-block: 5px;
    padding-inline: 5px 8px;
    border: 2px solid var(--aboc-area-frame-color);
    overflow: hidden;
    border-radius: 999px;
    background: var(--aboc-row-bg);
    color: var(--primary-text-color);
    transition: border-color 160ms ease, background-color 160ms ease, color 160ms ease;
  }

  .area-panel.has-active > .area-summary > .area-summary-pill {
    border-color: var(--aboc-area-frame-color);
    background: var(--aboc-active-surface);
    color: var(--aboc-dark-text);
  }

  .area-summary-pill.compact-statuses {
    gap: 4px;
    padding-inline-end: 6px;
  }

  .area-summary-pill.compact-statuses .area-toggle {
    gap: 6px;
    min-width: 72px;
    flex-basis: 96px;
  }

  .area-summary-pill.compact-statuses .area-icon {
    width: 40px;
    height: 40px;
  }

  .area-summary-pill.compact-statuses .area-statuses,
  .area-summary-pill.compact-statuses .quick-actions {
    gap: 3px;
  }

  .area-summary-pill.compact-statuses .occupancy {
    min-width: 40px;
    height: 40px;
    padding-inline: 6px;
  }

  .area-summary-pill.compact-statuses .area-temperature {
    padding-inline: 7px;
    font-size: 13px;
  }

  .area-summary-pill .area-toggle {
    width: auto;
  }

  .area-summary-pill .occupancy {
    grid-area: occupancy;
  }

  .area-summary-pill .area-temperature {
    grid-area: area-temperature;
  }

  .area-toggle {
    direction: var(--aboc-direction, ltr);
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
    font-size: var(--aboc-area-name-size);
    font-weight: 780;
  }

  .active-summary {
    display: block;
    margin-top: 1px;
    color: color-mix(in srgb, var(--aboc-dark-text) 72%, transparent);
    font-weight: 650;
  }

  .area-statuses {
    direction: var(--aboc-direction, ltr);
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 5px;
    min-width: 0;
    flex: 0 1 auto;
    overflow: hidden;
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

  .area-panel.expanded > .area-summary .chevron {
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

  .area-panel.has-active > .area-summary .area-icon {
    background: color-mix(in srgb, var(--aboc-control-surface) 72%, transparent);
    color: var(--aboc-light-text);
  }

  .area-panel.all-off > .area-summary .area-icon {
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
  .control-button {
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

  .quick-action {
    width: var(--aboc-quick-action-size);
    height: var(--aboc-quick-action-size);
    flex-basis: var(--aboc-quick-action-size);
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
    color: var(--aboc-light-text);
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

  .summary-chip ha-icon {
    --mdc-icon-size: 21px;
  }

  .quick-action ha-icon {
    --mdc-icon-size: var(--aboc-quick-action-icon-size);
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
    direction: var(--aboc-direction, ltr);
    display: flex;
    align-items: center;
    gap: 5px;
    width: max-content;
    min-width: 0;
    max-width: 100%;
    flex: 0 1 auto;
    flex-wrap: nowrap;
    padding-inline: 3px;
    justify-content: flex-end;
    padding-block: 3px;
    overflow-x: auto;
    overflow-y: hidden;
    overscroll-behavior-inline: contain;
    scroll-padding-inline: 3px;
    scrollbar-width: none;
  }

  .quick-actions::-webkit-scrollbar {
    display: none;
  }

  .quick-action {
    cursor: pointer;
    transition: transform 120ms ease, filter 120ms ease;
  }

  .quick-action::before {
    content: "";
    position: absolute;
    inset: calc((var(--aboc-quick-action-size) - 44px) / 2);
    border-radius: inherit;
  }

  .quick-action.inactive {
    filter: saturate(0.35);
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

  .quick-action-dialog {
    inset: 0;
    width: min(520px, calc(100vw - 24px));
    max-width: none;
    max-height: min(720px, calc(100dvh - 24px));
    margin: auto;
    padding: 0;
    overflow: hidden;
    border: 1px solid color-mix(in srgb, var(--divider-color) 72%, transparent);
    border-radius: calc(var(--aboc-radius) + 2px);
    outline: 0;
    background: var(--ha-card-background, var(--card-background-color));
    color: var(--primary-text-color);
    box-shadow: 0 24px 72px rgba(0, 0, 0, 0.42);
    direction: var(--aboc-direction, ltr);
  }

  .quick-action-dialog::backdrop {
    background: rgba(0, 0, 0, 0.54);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
  }

  .quick-popup {
    display: grid;
    grid-template-rows: auto auto minmax(0, 1fr);
    max-height: min(720px, calc(100dvh - 24px));
    overflow: hidden;
    background:
      linear-gradient(145deg, rgba(255, 255, 255, 0.065), transparent),
      var(--ha-card-background, var(--card-background-color));
    direction: var(--aboc-direction, ltr);
  }

  .quick-popup-header {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) 44px;
    align-items: center;
    gap: 10px;
    min-width: 0;
    padding: 14px 14px 10px;
    border-bottom: 1px solid color-mix(in srgb, var(--divider-color) 64%, transparent);
  }

  .popup-icon {
    width: 44px;
    height: 44px;
    background: var(--aboc-control-surface);
    color: var(--aboc-light-text);
  }

  .quick-popup-heading {
    display: grid;
    gap: 2px;
    min-width: 0;
    text-align: start;
  }

  .quick-popup-title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 19px;
    font-weight: 800;
  }

  .quick-popup-summary {
    color: var(--secondary-text-color);
    font-size: 12px;
    font-weight: 650;
  }

  .quick-popup-close,
  .quick-popup-entity-toggle {
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    padding: 0;
    border: 0;
    border-radius: 999px;
    background: color-mix(in srgb, var(--primary-text-color) 9%, transparent);
    color: var(--primary-text-color);
    cursor: pointer;
  }

  .quick-popup-group-actions {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
    padding: 10px 14px;
    border-bottom: 1px solid color-mix(in srgb, var(--divider-color) 58%, transparent);
    direction: var(--aboc-direction, ltr);
  }

  .quick-popup-group-button {
    display: grid;
    grid-template-columns: 24px minmax(0, 1fr) auto;
    align-items: center;
    gap: 7px;
    min-width: 0;
    min-height: 48px;
    padding: 0 12px;
    border: 0;
    border-radius: 999px;
    background: var(--aboc-control-surface);
    color: var(--aboc-light-text);
    text-align: start;
    cursor: pointer;
  }

  .quick-popup-group-button.turn-on {
    background: color-mix(in srgb, var(--success-color, #4caf50) 24%, var(--aboc-control-surface));
  }

  .quick-popup-group-button span {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 13px;
    font-weight: 760;
  }

  .quick-popup-group-button small {
    min-width: 20px;
    padding: 2px 6px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.14);
    text-align: center;
    font-size: 10px;
    font-weight: 800;
  }

  .quick-popup-list {
    display: grid;
    align-content: start;
    gap: 8px;
    min-height: 0;
    padding: 12px 14px 16px;
    overflow: auto;
    overscroll-behavior: contain;
  }

  .floor-all-off {
    direction: var(--aboc-direction, ltr);
    display: grid;
    grid-template-columns: 24px minmax(0, 1fr) auto;
    align-items: center;
    gap: 8px;
    min-height: 50px;
    margin: 10px 14px 0;
    padding-inline: 14px;
    border: 0;
    border-radius: 999px;
    background: var(--aboc-control-surface);
    color: var(--aboc-light-text);
    text-align: start;
    cursor: pointer;
  }

  .floor-all-off span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: 760;
  }

  .floor-all-off small {
    min-width: 24px;
    padding: 3px 7px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.14);
    text-align: center;
  }

  .floor-room-list {
    display: grid;
    align-content: start;
    gap: 8px;
    min-height: 0;
    padding: 12px 14px 16px;
    overflow: auto;
  }

  .floor-room-row {
    direction: var(--aboc-direction, ltr);
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) 44px;
    align-items: center;
    gap: 9px;
    min-height: 60px;
    padding: 7px 9px;
    border: 1px solid color-mix(in srgb, var(--divider-color) 64%, transparent);
    border-radius: calc(var(--aboc-radius) - 7px);
    background: var(--aboc-active-surface);
    color: var(--aboc-dark-text);
  }

  .floor-room-main {
    display: grid;
    gap: 2px;
    min-width: 0;
    text-align: start;
  }

  .floor-room-main strong {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .floor-room-main small {
    color: color-mix(in srgb, var(--aboc-dark-text) 70%, transparent);
  }

  .floor-room-off {
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    padding: 0;
    border: 0;
    border-radius: 999px;
    background: var(--aboc-control-surface);
    color: var(--aboc-light-text);
    cursor: pointer;
  }

  .quick-popup-entity {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 44px;
    align-items: center;
    gap: 8px;
    min-width: 0;
    min-height: 62px;
    padding: 7px 8px;
    border: 1px solid color-mix(in srgb, var(--divider-color) 64%, transparent);
    border-radius: calc(var(--aboc-radius) - 4px);
    background: var(--aboc-row-bg);
    direction: var(--aboc-direction, ltr);
  }

  .quick-popup-entity.active {
    border-color: color-mix(in srgb, var(--aboc-control-surface) 56%, transparent);
    background: var(--aboc-active-surface);
    color: var(--aboc-dark-text);
  }

  .quick-popup-entity.active .state-text {
    color: color-mix(in srgb, var(--aboc-dark-text) 70%, transparent);
  }

  .quick-popup-entity-main {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    align-items: center;
    gap: 9px;
    min-width: 0;
    min-height: 48px;
    padding: 0;
    border: 0;
    border-radius: calc(var(--aboc-radius) - 8px);
    background: transparent;
    color: inherit;
    direction: var(--aboc-direction, ltr);
    text-align: start;
    cursor: pointer;
  }

  .quick-popup-entity.active .quick-popup-entity-main .icon-bubble {
    background: color-mix(in srgb, var(--aboc-control-surface) 74%, transparent);
    color: var(--aboc-light-text);
  }

  .quick-popup-entity-toggle {
    background: var(--aboc-control-surface);
    color: var(--aboc-light-text);
  }

  .quick-popup-entity-toggle.active {
    color: var(--aboc-active);
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
    transition: background-color 180ms ease, box-shadow 180ms ease;
  }

  .temperature-climate-tag {
    position: relative;
    z-index: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 26px;
    height: 26px;
    margin-inline-start: -13px;
    padding: 0;
    border: 0;
    border-radius: 999px;
    background: var(--aboc-temperature-active);
    color: var(--aboc-light-text);
    cursor: pointer;
  }

  .temperature-climate-tag::before {
    content: "";
    position: absolute;
    inset: -9px;
    border-radius: inherit;
  }

  .temperature-climate-tag ha-icon {
    --mdc-icon-size: 15px;
  }

  .temperature-climate-tag.temperature-off {
    background: var(--aboc-temperature-off);
  }

  .temperature-climate-tag.temperature-cool {
    background: var(--aboc-temperature-cool);
  }

  .temperature-climate-tag.temperature-heat {
    background: var(--aboc-temperature-heat);
  }

  .temperature.temperature-none {
    background: var(--aboc-control-surface);
  }

  .temperature.temperature-off {
    background: var(--aboc-temperature-off);
  }

  .temperature.temperature-cool {
    background: var(--aboc-temperature-cool);
    box-shadow: 0 0 0 1px color-mix(in srgb, #64b5f6 55%, transparent);
  }

  .temperature.temperature-heat {
    background: var(--aboc-temperature-heat);
    box-shadow: 0 0 0 1px color-mix(in srgb, #ffab91 55%, transparent);
  }

  .temperature.temperature-active {
    background: var(--aboc-temperature-active);
  }

  .expanded-content {
    display: grid;
    gap: var(--aboc-section-gap);
    padding: 0 9px 10px;
    animation: overview-expand 170ms ease both;
  }

  .area-disclosure[hidden] {
    display: none;
  }

  .device-section {
    display: grid;
    gap: 7px;
    min-width: 0;
    padding: 7px;
    border: 1px solid transparent;
    border-radius: calc(var(--aboc-radius) - 5px);
    background: var(--aboc-section-background, transparent);
  }

  .device-section.section-framed {
    border-color: var(--aboc-section-border-color);
  }

  .section-heading {
    direction: var(--aboc-direction, ltr);
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
    gap: 7px;
    min-height: max(44px, var(--aboc-section-action-size));
    margin: 0;
    padding: 3px 5px;
    color: var(--secondary-text-color);
    font-size: 14px;
    font-weight: 680;
    letter-spacing: 0.01em;
    min-width: 0;
  }

  .section-heading-main {
    display: flex;
    align-items: center;
    gap: 7px;
    min-width: 0;
  }

  .section-heading ha-icon {
    color: var(--aboc-accent);
    --mdc-icon-size: 18px;
  }

  .section-title {
    flex: 1 1 auto;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    direction: var(--aboc-direction, ltr);
    text-align: start;
  }

  .section-count {
    margin-inline-start: auto;
    font-size: 11px;
    font-variant-numeric: tabular-nums;
  }

  .section-actions {
    display: flex;
    align-items: center;
    gap: 4px;
    flex: 0 0 auto;
    direction: var(--aboc-direction, ltr);
  }

  .section-on-button,
  .section-off-button,
  .section-toggle-button {
    display: grid;
    place-items: center;
    width: var(--aboc-section-action-size);
    height: var(--aboc-section-action-size);
    flex: 0 0 var(--aboc-section-action-size);
    padding: 0;
    border: 0;
    border-radius: 999px;
    background: color-mix(in srgb, var(--aboc-control-surface) 92%, transparent);
    color: var(--aboc-light-text);
    cursor: pointer;
  }

  .section-on-button {
    background: color-mix(in srgb, var(--success-color, #4caf50) 24%, var(--aboc-control-surface));
  }

  .section-toggle-button.turn-on {
    background: color-mix(in srgb, var(--success-color, #4caf50) 24%, var(--aboc-control-surface));
  }

  .section-on-button ha-icon,
  .section-off-button ha-icon,
  .section-toggle-button ha-icon {
    --mdc-icon-size: var(--aboc-section-action-icon-size);
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

  .entity-subgroup {
    display: grid;
    gap: 7px;
    min-width: 0;
    padding: 7px;
    border: 1px dashed color-mix(in srgb, var(--aboc-accent) 28%, var(--divider-color));
    border-radius: calc(var(--aboc-radius) - 8px);
    background: color-mix(in srgb, var(--aboc-row-bg) 54%, transparent);
  }

  .entity-subgroup-heading {
    direction: var(--aboc-direction, ltr);
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;
    gap: 7px;
    min-height: 28px;
    color: var(--secondary-text-color);
    font-size: 12px;
    font-weight: 720;
  }

  .entity-subgroup-heading ha-icon {
    color: var(--aboc-accent);
    --mdc-icon-size: 17px;
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

  .entity-card:not(.active) {
    background: var(--aboc-row-bg);
  }

  .entity-lead {
    direction: var(--aboc-direction, ltr);
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
    direction: var(--aboc-direction, ltr);
    display: grid;
    grid-template-columns: minmax(88px, 1fr) auto;
    align-items: center;
    gap: 7px;
    min-width: 0;
  }

  .control-button {
    border: 0;
    cursor: pointer;
    transition: transform 120ms ease, filter 120ms ease;
  }

  .control-button ha-icon {
    --mdc-icon-size: 23px;
  }

  .climate-secondary {
    direction: var(--aboc-direction, ltr);
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

  .mode-select {
    direction: var(--aboc-direction, ltr);
    display: block;
    width: 100%;
    min-width: 0;
    --control-select-menu-height: 44px;
    --control-select-menu-border-radius: 999px;
    --control-select-menu-padding: 5px 10px;
    --control-select-menu-background-color: var(--secondary-background-color);
    --control-select-menu-background-opacity: 1;
    --control-select-menu-focus-color: var(--aboc-accent);
    --mdc-icon-size: 21px;
  }

  .light-card {
    display: grid;
    gap: 7px;
    min-height: max(92px, var(--aboc-row-height));
    padding: 8px 10px;
  }

  .light-card.active {
    border-color: color-mix(in srgb, var(--aboc-control-surface) 62%, transparent);
    background: var(--aboc-active-surface);
    color: var(--aboc-dark-text);
  }

  .light-card.active .state-text {
    color: color-mix(in srgb, var(--aboc-dark-text) 70%, transparent);
  }

  .light-card.active .icon-bubble {
    background: color-mix(in srgb, var(--aboc-control-surface) 78%, transparent);
    color: var(--aboc-light-text);
  }

  .light-primary {
    direction: var(--aboc-direction, ltr);
    display: grid;
    grid-template-columns: minmax(0, 1fr) 44px;
    align-items: center;
    gap: 6px;
    min-width: 0;
  }

  .light-power {
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    padding: 0;
    border: 0;
    border-radius: 999px;
    background: var(--aboc-control-surface);
    color: var(--aboc-light-text);
    cursor: pointer;
  }

  .brightness-control {
    direction: ltr;
    display: grid;
    grid-template-columns: minmax(0, 1fr) 42px;
    align-items: center;
    gap: 6px;
    min-width: 0;
  }

  .brightness-slider {
    min-width: 0;
    min-height: 44px;
    --control-slider-thickness: 38px;
    --control-slider-border-radius: 999px;
    --control-slider-color: var(--aboc-accent);
    --control-slider-background: var(--aboc-control-surface);
    --control-slider-background-opacity: 0.22;
  }

  .brightness-value {
    color: inherit;
    text-align: center;
    font-size: 12px;
    font-weight: 760;
    font-variant-numeric: tabular-nums;
    unicode-bidi: isolate;
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
    direction: var(--aboc-direction, ltr);
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
  .quick-popup-close:hover:not([disabled]),
  .quick-popup-group-button:hover:not([disabled]),
  .quick-popup-entity-main:hover,
  .quick-popup-entity-toggle:hover:not([disabled]),
  .section-on-button:hover:not([disabled]),
  .section-off-button:hover:not([disabled]),
  .section-toggle-button:hover:not([disabled]),
  .floor-active-badge:hover:not([disabled]),
  .floor-all-off:hover:not([disabled]),
  .floor-room-off:hover:not([disabled]),
  .control-button:hover:not([disabled]),
  .cover-control:hover:not([disabled]),
  .temperature-stepper button:hover:not([disabled]),
  .thermostat-power:hover:not([disabled]) {
    filter: brightness(1.1);
  }

  .toggle-tile:hover:not([aria-disabled="true"]) {
    transform: translateY(-1px);
  }

  .quick-action:active:not([disabled]),
  .quick-popup-close:active:not([disabled]),
  .quick-popup-group-button:active:not([disabled]),
  .quick-popup-entity-toggle:active:not([disabled]),
  .section-on-button:active:not([disabled]),
  .section-off-button:active:not([disabled]),
  .section-toggle-button:active:not([disabled]),
  .floor-active-badge:active:not([disabled]),
  .floor-all-off:active:not([disabled]),
  .floor-room-off:active:not([disabled]),
  .control-button:active:not([disabled]),
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
      gap: 4px;
    }

    .area-summary-pill .area-toggle,
    .area-summary-pill.compact-statuses .area-toggle {
      min-width: 120px;
      flex: 1 0 120px;
      gap: 5px;
    }

    .area-statuses {
      gap: 3px;
      max-width: calc(100% - 124px);
      flex: 0 1 auto;
      padding-block: 5px;
      overflow-x: auto;
      overflow-y: hidden;
      overscroll-behavior-inline: contain;
      scrollbar-width: none;
    }

    .area-statuses::-webkit-scrollbar {
      display: none;
    }

    .quick-actions {
      gap: 6px;
      flex: 0 0 auto;
      padding-block: 0;
      overflow: visible;
    }

    .area-summary-pill.compact-statuses .quick-actions {
      gap: 6px;
    }

    .quick-action {
      width: var(--aboc-quick-action-size);
      height: var(--aboc-quick-action-size);
      flex-basis: var(--aboc-quick-action-size);
    }

    .quick-action::before {
      inset: calc((var(--aboc-quick-action-size) - 44px) / 2);
    }

    .quick-action ha-icon {
      --mdc-icon-size: var(--aboc-quick-action-icon-size);
    }

    .quick-action .count-badge {
      inset-block-start: -2px;
      inset-inline-end: -2px;
    }

    .active-summary {
      display: none;
    }

    .area-name {
      font-size: min(var(--aboc-area-name-size), 14px);
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

  @container overview-card (min-width: 341px) and (max-width: 430px) {
    .area-summary-pill.summary-load-5 .area-temperature {
      padding-inline: 5px;
    }
  }

  @container overview-card (max-width: 360px) {
    .subareas {
      margin-inline-start: 10px;
      padding-inline-start: 6px;
    }

    .subareas .subareas {
      margin-inline-start: 8px;
      padding-inline-start: 4px;
    }

    .subareas .subareas .subareas {
      margin-inline-start: 6px;
      padding-inline-start: 3px;
    }
    .area-summary {
      grid-template-columns: minmax(0, 1fr) 40px;
      gap: 3px;
    }

    .area-summary-pill {
      gap: 4px;
    }

    .area-summary-pill .area-icon,
    .area-summary-pill .summary-chip:not(.occupancy) {
      width: 40px;
      height: 40px;
      flex-basis: 40px;
    }

    .area-summary-pill .area-icon {
      width: 40px;
      height: 40px;
    }

    .area-summary-pill .occupancy {
      min-height: 40px;
      height: 40px;
      padding-inline: 7px;
    }
  }

  @container overview-card (max-width: 340px) {
    .area-summary-pill {
      display: flex;
      min-height: 52px;
      padding-block: 4px;
      padding-inline: 4px 5px;
      border-radius: 999px;
    }

    .area-summary-pill .area-toggle {
      width: auto;
      min-width: 112px;
      flex: 1 0 112px;
      gap: 4px;
    }

    .area-summary-pill .area-icon,
    .area-summary-pill.compact-statuses .area-icon {
      width: 36px;
      height: 36px;
    }

    .area-summary-pill .occupancy,
    .area-summary-pill.compact-statuses .occupancy {
      min-width: 36px;
      width: 36px;
      height: 36px;
      min-height: 36px;
      flex-basis: 36px;
      padding-inline: 4px;
      gap: 2px;
    }

    .area-summary-pill .occupancy ha-icon {
      --mdc-icon-size: 18px;
    }

    .area-summary-pill .occupancy-count {
      font-size: 12px;
    }

    .area-summary-pill .area-temperature,
    .area-summary-pill.compact-statuses .area-temperature {
      padding-inline: 5px;
      font-size: 12px;
    }

    .area-statuses {
      display: flex;
      min-width: 0;
      max-width: calc(100% - 116px);
      overflow-x: auto;
      overflow-y: hidden;
    }

    .quick-actions {
      width: max-content;
      min-width: 0;
      max-width: 100%;
      flex: 0 1 auto;
      flex-wrap: nowrap;
      overflow: visible;
    }

    .area-summary.without-expand-button .area-toggle {
      min-width: 112px;
      flex: 1 0 112px;
    }

    .area-summary.without-expand-button .area-statuses {
      max-width: calc(100% - 116px);
      flex: 0 1 auto;
    }

    .area-summary.without-expand-button .quick-actions {
      flex: 0 0 auto;
    }

    .climate-primary {
      grid-template-columns: minmax(0, 1fr);
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

  @media (max-width: 480px) {
    .quick-action-dialog {
      width: calc(100vw - 12px);
      max-height: calc(100dvh - 12px - env(safe-area-inset-top) - env(safe-area-inset-bottom));
      margin-block: auto max(6px, env(safe-area-inset-bottom));
      margin-inline: auto;
    }

    .quick-popup {
      max-height: calc(100dvh - 12px - env(safe-area-inset-top) - env(safe-area-inset-bottom));
    }

    .quick-popup-header {
      padding: 12px 10px 9px;
    }

    .quick-popup-group-actions {
      padding: 9px 10px;
    }

    .quick-popup-list {
      padding: 10px 10px max(14px, env(safe-area-inset-bottom));
    }

    .floor-room-list {
      padding: 10px 10px max(14px, env(safe-area-inset-bottom));
    }

    .floor-all-off {
      margin-inline: 10px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .expanded-content,
    ha-icon[icon="mdi:loading"] {
      animation: none;
    }

    .chevron,
    .floor-chevron,
    .section-off-button,
    .section-on-button,
    .section-toggle-button,
    .quick-action,
    .quick-popup-close,
    .quick-popup-group-button,
    .quick-popup-entity-toggle,
    .control-button,
    .toggle-tile,
    .hold-target {
      transition: none;
    }
  }
`;
