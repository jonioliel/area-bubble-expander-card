import { css } from "lit";

export const overviewCardStyles = css`
  :host {
    display: block;
    direction: var(--aboc-direction, ltr);
    text-align: start;
    color: var(--primary-text-color);
    --aboc-radius: var(--area-bubble-overview-border-radius, 26px);
    --aboc-blur: var(--area-bubble-overview-blur, 18px);
    --aboc-gap: var(--area-bubble-overview-gap, 12px);
    --aboc-row-height: var(--area-bubble-overview-row-height, 56px);
    --aboc-accent: var(--area-bubble-overview-accent, var(--primary-color));
    --aboc-active: var(--area-bubble-overview-active, var(--state-active-color, #ffc107));
    --aboc-row-bg: var(--area-bubble-overview-row-bg, rgba(255, 255, 255, 0.075));
    --aboc-shadow: var(--area-bubble-overview-shadow, 0 12px 30px rgba(0, 0, 0, 0.2));
  }

  * {
    box-sizing: border-box;
  }

  ha-card {
    overflow: hidden;
    border: 1px solid color-mix(in srgb, var(--divider-color) 55%, transparent);
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
    padding: 14px;
  }

  .overview-heading {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 2px 4px 4px;
  }

  .overview-heading .heading-main {
    min-width: 0;
    flex: 1;
  }

  .overview-heading h2 {
    overflow: hidden;
    margin: 0;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 18px;
    font-weight: 700;
  }

  .overview-heading .subtitle,
  .secondary,
  .state-text {
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
    border: 1px solid color-mix(in srgb, var(--divider-color) 72%, transparent);
    border-radius: var(--aboc-radius);
    background: color-mix(in srgb, var(--secondary-background-color) 68%, transparent);
    transition: border-color 160ms ease, background-color 160ms ease;
  }

  .area-panel.expanded {
    border-color: color-mix(in srgb, var(--aboc-accent) 42%, var(--divider-color));
    background: color-mix(in srgb, var(--secondary-background-color) 84%, transparent);
  }

  .area-summary {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
    gap: 8px;
    padding: 9px;
  }

  .area-toggle {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto auto;
    align-items: center;
    gap: 10px;
    width: 100%;
    min-width: 0;
    min-height: 54px;
    padding: 2px;
    border: 0;
    border-radius: calc(var(--aboc-radius) - 10px);
    background: transparent;
    color: inherit;
    text-align: start;
    font: inherit;
    cursor: pointer;
  }

  .area-toggle:hover,
  .entity-row:hover,
  .control-button:hover:not([disabled]),
  .quick-action:hover:not([disabled]) {
    background-color: color-mix(in srgb, var(--primary-text-color) 7%, transparent);
  }

  .area-toggle:focus-visible,
  .entity-row:focus-visible,
  button:focus-visible,
  select:focus-visible,
  input:focus-visible {
    outline: 2px solid var(--aboc-accent);
    outline-offset: 2px;
  }

  .icon-bubble {
    display: inline-grid;
    place-items: center;
    width: 44px;
    height: 44px;
    flex: 0 0 auto;
    border-radius: 999px;
    background:
      radial-gradient(circle at 35% 25%, rgba(255, 255, 255, 0.22), transparent 45%),
      color-mix(in srgb, var(--aboc-accent) 16%, transparent);
    color: var(--aboc-accent);
  }

  .icon-bubble.small {
    width: 40px;
    height: 40px;
  }

  .icon-bubble ha-icon {
    --mdc-icon-size: 24px;
  }

  .area-main,
  .entity-main {
    min-width: 0;
  }

  .area-name,
  .entity-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: 650;
  }

  .area-name {
    font-size: 16px;
  }

  .summary-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 5px;
  }

  .summary-chip {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    min-height: 24px;
    padding: 0 8px;
    border-radius: 999px;
    background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
    color: var(--secondary-text-color);
    font-size: 11px;
    font-weight: 600;
  }

  .summary-chip.occupied {
    background: color-mix(in srgb, var(--success-color, #4caf50) 18%, transparent);
    color: var(--success-color, #4caf50);
  }

  .summary-chip ha-icon {
    --mdc-icon-size: 14px;
  }

  .temperature {
    min-width: max-content;
    padding: 7px 10px;
    border-radius: 999px;
    background: color-mix(in srgb, var(--aboc-accent) 15%, transparent);
    color: var(--primary-text-color);
    font-size: 14px;
    font-weight: 700;
  }

  .chevron {
    display: inline-grid;
    place-items: center;
    width: 36px;
    height: 36px;
    transition: transform 160ms ease;
  }

  .expanded .chevron {
    transform: rotate(180deg);
  }

  .quick-actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 5px;
  }

  .quick-action,
  .control-button {
    position: relative;
    display: inline-grid;
    place-items: center;
    width: 40px;
    height: 40px;
    flex: 0 0 auto;
    border: 0;
    border-radius: 999px;
    background: color-mix(in srgb, var(--primary-text-color) 7%, transparent);
    color: var(--secondary-text-color);
    font: inherit;
    cursor: pointer;
    transition: transform 120ms ease, color 120ms ease, background-color 120ms ease;
  }

  .quick-action.active,
  .control-button.active {
    background: color-mix(in srgb, var(--aboc-active) 20%, transparent);
    color: var(--aboc-active);
  }

  .quick-action[disabled],
  .control-button[disabled] {
    cursor: not-allowed;
    opacity: 0.42;
  }

  .quick-action:active:not([disabled]),
  .control-button:active:not([disabled]) {
    transform: scale(0.94);
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
    border: 2px solid var(--ha-card-background, var(--card-background-color));
    border-radius: 999px;
    background: var(--aboc-active);
    color: #111;
    font-size: 9px;
    font-weight: 800;
  }

  .expanded-content {
    display: grid;
    gap: 12px;
    padding: 0 10px 10px;
    animation: overview-expand 160ms ease both;
  }

  .device-section {
    display: grid;
    gap: 8px;
  }

  .section-heading {
    display: flex;
    align-items: center;
    gap: 7px;
    min-height: 30px;
    padding: 0 4px;
    color: var(--secondary-text-color);
    font-size: 12px;
    font-weight: 750;
    letter-spacing: 0.02em;
  }

  .section-heading ha-icon {
    color: var(--aboc-accent);
    --mdc-icon-size: 18px;
  }

  .section-count {
    margin-inline-start: auto;
    font-variant-numeric: tabular-nums;
  }

  .entity-row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
    gap: 10px;
    min-height: var(--aboc-row-height);
    padding: 8px;
    border: 1px solid color-mix(in srgb, var(--divider-color) 56%, transparent);
    border-radius: calc(var(--aboc-radius) - 10px);
    background:
      linear-gradient(145deg, rgba(255, 255, 255, 0.05), transparent),
      var(--aboc-row-bg);
    color: inherit;
    text-align: start;
  }

  .entity-lead {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    align-items: center;
    gap: 10px;
    min-width: 0;
    min-height: 40px;
    padding: 0;
    border: 0;
    border-radius: calc(var(--aboc-radius) - 12px);
    background: transparent;
    color: inherit;
    text-align: start;
    font: inherit;
    cursor: pointer;
  }

  .entity-row.active .icon-bubble {
    background: color-mix(in srgb, var(--aboc-active) 20%, transparent);
    color: var(--aboc-active);
  }

  .entity-row.unavailable {
    opacity: 0.58;
  }

  .entity-controls {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 6px;
  }

  .wide-row { grid-template-columns: minmax(110px, 1fr) auto; }

  .climate-controls,
  .media-controls {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-end;
    gap: 6px;
  }

  .temperature-stepper {
    display: inline-flex;
    align-items: center;
    min-height: 40px;
    border-radius: 999px;
    background: color-mix(in srgb, var(--primary-text-color) 7%, transparent);
  }

  .temperature-stepper button {
    display: grid;
    place-items: center;
    width: 36px;
    height: 36px;
    border: 0;
    border-radius: 999px;
    background: transparent;
    color: inherit;
    cursor: pointer;
  }

  .temperature-stepper span {
    min-width: 64px;
    text-align: center;
    font-size: 13px;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
  }

  select {
    max-width: 140px;
    min-height: 38px;
    padding: 0 10px;
    border: 1px solid var(--divider-color);
    border-radius: 999px;
    background: var(--card-background-color);
    color: var(--primary-text-color);
    font: inherit;
    font-size: 12px;
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

  @media (max-width: 560px) {
    .root { padding: 10px; }
    .area-summary { grid-template-columns: 1fr; }
    .quick-actions { justify-content: flex-start; padding-inline: 4px; }
    .area-toggle { grid-template-columns: auto minmax(0, 1fr) auto; }
    .area-toggle .temperature { grid-column: 2; justify-self: start; }
    .area-toggle .chevron { grid-column: 3; grid-row: 1 / span 2; }
    .entity-row,
    .wide-row { grid-template-columns: 1fr; }
    .entity-controls,
    .climate-controls,
    .media-controls { grid-column: 1 / -1; justify-content: stretch; }
    .entity-controls > *,
    .climate-controls > *,
    .media-controls > * { flex: 1 1 auto; }
    .control-button { flex: 0 0 40px; }
    select { max-width: none; }
  }

  @media (prefers-reduced-motion: reduce) {
    .expanded-content { animation: none; }
    .chevron,
    .quick-action,
    .control-button { transition: none; }
  }
`;
