import { css } from "lit";

export const cardStyles = css`
  :host {
    display: block;
    direction: var(--abec-direction, ltr);
    text-align: start;
    color: var(--primary-text-color);
    --abec-radius: var(--area-bubble-expander-card-border-radius, 26px);
    --abec-bg: var(--area-bubble-expander-card-background, rgba(255, 255, 255, 0.06));
    --abec-bg-expanded: var(--area-bubble-expander-card-background-expanded, rgba(255, 255, 255, 0.07));
    --abec-blur: var(--area-bubble-expander-card-glass-blur, 18px);
    --abec-accent: var(--area-bubble-expander-card-accent-color, var(--primary-color));
    --abec-danger: var(--area-bubble-expander-card-danger-color, #ff5252);
    --abec-icon-bg: var(--area-bubble-expander-card-icon-background, rgba(var(--rgb-primary-color, 3, 169, 244), 0.16));
    --abec-gap: var(--area-bubble-expander-card-section-gap, 12px);
    --abec-row-height: var(--area-bubble-expander-card-row-height, 52px);
    --abec-shadow: var(--area-bubble-expander-card-shadow, 0 12px 30px rgba(0, 0, 0, 0.2));
    --abec-header-size: var(--area-bubble-expander-card-header-font-size, 15px);
    --abec-secondary-size: var(--area-bubble-expander-card-secondary-font-size, 12px);
    --abec-chip-bg: var(--area-bubble-expander-card-chip-background, rgba(255, 255, 255, 0.11));
    --abec-row-bg: var(--area-bubble-expander-card-row-background, rgba(255, 255, 255, 0.08));
  }

  ha-card {
    overflow: hidden;
    border-radius: var(--abec-radius);
    background:
      linear-gradient(145deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.035)),
      var(--abec-bg);
    border: 1px solid rgba(255, 255, 255, 0.12);
    box-shadow: var(--abec-shadow);
    backdrop-filter: blur(var(--abec-blur));
    -webkit-backdrop-filter: blur(var(--abec-blur));
  }

  .root {
    padding: 14px;
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 4px 4px 12px;
  }

  .title {
    min-width: 0;
    font-size: 18px;
    font-weight: 700;
    line-height: 1.25;
  }

  .subtitle,
  .secondary,
  .preview,
  .debug {
    color: var(--secondary-text-color);
    font-size: var(--abec-secondary-size);
    line-height: 1.35;
  }

  .sections {
    display: grid;
    gap: var(--abec-gap);
  }

  .area-section {
    overflow: hidden;
    border-radius: var(--abec-radius);
    background:
      linear-gradient(145deg, rgba(255, 255, 255, 0.07), rgba(255, 255, 255, 0.025)),
      var(--abec-bg);
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition:
      background-color 160ms ease,
      border-color 160ms ease,
      transform 160ms ease;
  }

  .area-section.expanded {
    background: var(--abec-bg-expanded);
    border-color: rgba(var(--rgb-primary-color, 3, 169, 244), 0.24);
  }

  .area-header {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto auto;
    align-items: center;
    gap: 10px;
    width: 100%;
    min-height: 66px;
    padding: 10px;
    border: 0;
    color: inherit;
    background: transparent;
    text-align: start;
    cursor: pointer;
    font: inherit;
  }

  :host([dir="rtl"]) .area-header {
    grid-template-columns: auto auto minmax(0, 1fr) auto;
  }

  .icon-bubble {
    display: inline-grid;
    place-items: center;
    width: 42px;
    height: 42px;
    flex: 0 0 auto;
    border-radius: 999px;
    background:
      radial-gradient(circle at 35% 25%, rgba(255, 255, 255, 0.22), transparent 45%),
      var(--abec-icon-bg);
    color: var(--abec-accent);
  }

  .area-icon ha-icon {
    --mdc-icon-size: 26px;
  }

  .entity-icon ha-icon {
    --mdc-icon-size: 22px;
  }

  .area-main,
  .entity-main {
    min-width: 0;
  }

  .area-line,
  .entity-line {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
  }

  .area-name,
  .entity-name {
    overflow: hidden;
    min-width: 0;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: var(--abec-header-size);
    font-weight: 650;
  }

  .count {
    flex: 0 0 auto;
    color: var(--secondary-text-color);
    font-size: 12px;
    font-weight: 600;
  }

  .chips {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 6px;
  }

  .chip {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    max-width: 150px;
    min-height: 22px;
    padding: 0 8px;
    border-radius: 999px;
    background: var(--abec-chip-bg);
    color: var(--secondary-text-color);
    font-size: 11px;
    line-height: 1;
  }

  .chip ha-icon {
    --mdc-icon-size: 14px;
  }

  .controls {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .icon-button {
    display: inline-grid;
    place-items: center;
    width: 40px;
    height: 40px;
    border: 0;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.08);
    color: var(--primary-text-color);
    cursor: pointer;
    transition:
      background-color 140ms ease,
      color 140ms ease,
      transform 140ms ease;
  }

  .icon-button:hover,
  .area-header:hover,
  .entity-row:hover {
    background-color: rgba(255, 255, 255, 0.08);
  }

  .icon-button:active,
  .entity-row:active {
    transform: scale(0.985);
  }

  .area-header:focus-visible,
  .entity-row:focus-visible,
  .icon-button:focus-visible {
    outline: 2px solid var(--abec-accent);
    outline-offset: 2px;
  }

  .icon-button.danger {
    color: var(--abec-danger);
  }

  .icon-button[disabled] {
    cursor: not-allowed;
    opacity: 0.45;
  }

  .chevron {
    transition: transform 160ms ease;
  }

  .expanded .chevron {
    transform: rotate(180deg);
  }

  .entities {
    display: grid;
    gap: 8px;
    padding: 0 10px 10px;
    animation: abec-expand 160ms ease both;
  }

  .entity-row {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;
    gap: 10px;
    min-height: var(--abec-row-height);
    padding: 7px 8px;
    border: 0;
    border-radius: calc(var(--abec-radius) - 10px);
    background:
      linear-gradient(145deg, rgba(255, 255, 255, 0.075), rgba(255, 255, 255, 0.035)),
      var(--abec-row-bg);
    color: inherit;
    text-align: start;
    font: inherit;
    cursor: pointer;
  }

  .protected-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    color: var(--warning-color, #f6a623);
    font-size: 11px;
  }

  .protected-badge ha-icon {
    --mdc-icon-size: 14px;
  }

  .empty {
    display: grid;
    place-items: center;
    gap: 8px;
    min-height: 128px;
    padding: 22px;
    text-align: center;
  }

  .empty ha-icon {
    color: var(--abec-accent);
    --mdc-icon-size: 44px;
  }

  .empty-title {
    font-size: 18px;
    font-weight: 700;
  }

  .debug {
    margin-top: 12px;
    padding: 10px;
    border-radius: 14px;
    background: rgba(0, 0, 0, 0.16);
    direction: ltr;
    text-align: left;
    white-space: pre-wrap;
  }

  @keyframes abec-expand {
    from {
      opacity: 0;
      transform: translateY(-4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .entities,
    .chevron {
      animation: none;
      transition: none;
    }
  }

  @media (max-width: 420px) {
    .root {
      padding: 10px;
    }

    .area-header {
      gap: 8px;
      padding: 9px;
    }

    .icon-button {
      width: 38px;
      height: 38px;
    }

    .chip {
      max-width: 112px;
    }
  }
`;

export const editorStyles = css`
  :host {
    display: block;
  }

  .editor {
    display: grid;
    gap: 16px;
  }

  .tabs {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .tab {
    border: 0;
    border-radius: 999px;
    padding: 8px 12px;
    background: var(--secondary-background-color);
    color: var(--primary-text-color);
    cursor: pointer;
    transition:
      background-color 140ms ease,
      transform 140ms ease;
  }

  .tab.active {
    background: var(--primary-color);
    color: var(--text-primary-color);
  }

  .tab:active {
    transform: scale(0.98);
  }

  .section {
    display: grid;
    gap: 12px;
    padding: 14px;
    border: 1px solid var(--divider-color);
    border-radius: 12px;
  }

  .field {
    display: grid;
    gap: 6px;
  }

  label {
    font-weight: 600;
  }

  input,
  select,
  textarea {
    box-sizing: border-box;
    width: 100%;
    min-height: 40px;
    padding: 8px 10px;
    border: 1px solid var(--divider-color);
    border-radius: 8px;
    background: var(--card-background-color);
    color: var(--primary-text-color);
    font: inherit;
  }

  textarea {
    min-height: 88px;
    resize: vertical;
  }

  .row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .yaml {
    direction: ltr;
    font-family: var(--code-font-family, monospace);
    font-size: 12px;
  }

  .template-output {
    min-height: 420px;
    white-space: pre;
  }

  .template-output.small {
    min-height: 150px;
  }

  .picker-panel {
    display: grid;
    gap: 10px;
    padding: 12px;
    border-radius: 12px;
    background: color-mix(in srgb, var(--secondary-background-color) 82%, transparent);
    border: 1px solid var(--divider-color);
  }

  .picker-heading {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(180px, 280px);
    align-items: center;
    gap: 10px;
  }

  .picker-heading.single {
    grid-template-columns: minmax(0, 1fr) auto;
  }

  .picker-heading strong,
  .picker-heading span {
    display: block;
  }

  .picker-heading span {
    color: var(--secondary-text-color);
    font-size: 12px;
    margin-top: 2px;
  }

  .search {
    min-height: 38px;
  }

  .picker-list {
    display: grid;
    gap: 8px;
    max-height: 360px;
    overflow: auto;
    padding-inline-end: 2px;
  }

  .picker-list.entities-picker {
    max-height: 460px;
  }

  .picker-list.compact-picker {
    max-height: 280px;
  }

  .picker-item {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto auto;
    align-items: center;
    gap: 10px;
    min-height: 50px;
    padding: 8px;
    border-radius: 10px;
    background: var(--card-background-color);
    border: 1px solid color-mix(in srgb, var(--divider-color) 72%, transparent);
  }

  .picker-item.order-item {
    grid-template-columns: auto minmax(0, 1fr) auto auto;
  }

  .picker-item ha-icon {
    color: var(--primary-color);
    --mdc-icon-size: 22px;
  }

  .picker-main {
    min-width: 0;
  }

  .picker-title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: 650;
  }

  .picker-meta {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--secondary-text-color);
    font-size: 12px;
  }

  .pill {
    min-height: 32px;
    border: 1px solid var(--divider-color);
    border-radius: 999px;
    padding: 0 10px;
    background: transparent;
    color: var(--primary-text-color);
    cursor: pointer;
    font: inherit;
    font-size: 12px;
    font-weight: 650;
  }

  .pill[disabled] {
    cursor: not-allowed;
    opacity: 0.45;
  }

  .pill.active {
    border-color: var(--primary-color);
    background: color-mix(in srgb, var(--primary-color) 18%, transparent);
    color: var(--primary-color);
  }

  .pill.danger.active {
    border-color: var(--error-color, #ff5252);
    background: color-mix(in srgb, var(--error-color, #ff5252) 18%, transparent);
    color: var(--error-color, #ff5252);
  }

  @media (max-width: 560px) {
    .picker-heading {
      grid-template-columns: 1fr;
    }

    .picker-item {
      grid-template-columns: auto minmax(0, 1fr);
    }

    .pill {
      grid-column: span 1;
      width: 100%;
    }
  }
`;
