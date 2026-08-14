import { describe, expect, it } from "vitest";

import { overviewCardStyles } from "../src/overview/styles";

const cssText = overviewCardStyles.cssText;
const firstContainerIndex = cssText.indexOf("@container overview-card");
const regularWidthCss = firstContainerIndex >= 0 ? cssText.slice(0, firstContainerIndex) : cssText;

const declarationBodiesFor = (selector: string, source = cssText): string[] =>
  Array.from(source.matchAll(/([^{}]+)\{([^{}]*)\}/g))
    .filter((match) =>
      match[1]
        .split(",")
        .map((entry) => entry.trim())
        .includes(selector),
    )
    .map((match) => match[2]);

const containerCssAt = (maxWidth: number): string => {
  const marker = `@container overview-card (max-width: ${maxWidth}px)`;
  const start = cssText.indexOf(marker);
  if (start < 0) return "";
  const openingBrace = cssText.indexOf("{", start + marker.length);
  if (openingBrace < 0) return "";

  let depth = 0;
  for (let index = openingBrace; index < cssText.length; index += 1) {
    if (cssText[index] === "{") depth += 1;
    if (cssText[index] === "}") depth -= 1;
    if (depth === 0) return cssText.slice(start, index + 1);
  }
  return "";
};

const expectCircularActionTarget = (selector: string, sizePattern = "44px"): void => {
  expect(declarationBodiesFor(selector)).toEqual(
    expect.arrayContaining([
      expect.stringMatching(new RegExp(`width:\\s*${sizePattern};[\\s\\S]*height:\\s*${sizePattern};`)),
    ]),
  );
};

describe("overview header presentation contracts", () => {
  it("shares one theme-aware neutral surface between floor headers and powered-off rows", () => {
    expect(regularWidthCss).toMatch(
      /--aboc-row-bg:\s*var\(\s*--area-bubble-overview-row-bg,\s*color-mix\(in srgb,\s*var\(--secondary-background-color\)\s+\d+%,\s*transparent\)\s*\);/s,
    );
    expect(regularWidthCss).toMatch(/\.floor-summary-pill\s*\{[^}]*background:\s*var\(--aboc-row-bg\)/s);
    expect(regularWidthCss).toMatch(/\.floor-toggle\s*\{[^}]*background:\s*transparent/s);
    expect(cssText).toMatch(/\.area-summary-pill\s*\{[^}]*background:\s*var\(--aboc-row-bg\)/s);
    expect(cssText).toMatch(
      /\.entity-card:not\(\.active\)\s*\{[^}]*background:\s*var\(--aboc-row-bg\)/s,
    );
    expect(cssText).toMatch(
      /\.area-panel\.has-active\s*>\s*\.area-summary\s*>\s*\.area-summary-pill\s*\{[^}]*background:\s*var\(--aboc-active-surface\)/s,
    );
  });

  it("keeps every collapsed Area summary on one physical row at every container width", () => {
    expect(regularWidthCss).toMatch(
      /\.area-summary-pill\s*\{[^}]*display:\s*flex/s,
    );
    expect(declarationBodiesFor(".quick-actions", regularWidthCss).join("\n")).toMatch(/flex-wrap:\s*nowrap/);
    expect(cssText).not.toMatch(/--aboc-summary-display:\s*grid/);
    expect(cssText).not.toMatch(/--aboc-quick-wrap:\s*wrap/);
    expect(cssText).not.toMatch(/\.area-summary-pill(?:\.responsive-actions)?\s*\{[^}]*display:\s*grid/s);
    expect(cssText).not.toMatch(/\.quick-actions\s*\{[^}]*flex-wrap:\s*wrap/s);
  });

  it("uses configurable quick-action visuals while preserving a 44px hit target", () => {
    const mobileCss = containerCssAt(430);
    expect(regularWidthCss).toMatch(/--aboc-quick-action-size:\s*var\(--area-bubble-overview-quick-action-size,\s*38px\)/);
    expect(declarationBodiesFor(".quick-action", mobileCss)).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/width:\s*var\(--aboc-quick-action-size\);[\s\S]*height:\s*var\(--aboc-quick-action-size\);[\s\S]*flex-basis:\s*var\(--aboc-quick-action-size\);/),
      ]),
    );
    expect(declarationBodiesFor(".quick-action::before").join("\n")).toMatch(
      /content:\s*["']{2};[\s\S]*position:\s*absolute;[\s\S]*inset:\s*calc\(\(var\(--aboc-quick-action-size\) - 44px\) \/ 2\)/,
    );
    expect(declarationBodiesFor(".quick-actions", regularWidthCss).join("\n")).toMatch(
      /padding-inline:\s*3px;[\s\S]*scroll-padding-inline:\s*3px;/,
    );
  });

  it("preserves 44px touch targets for the remaining controls", () => {
    expectCircularActionTarget(".control-button");
    expectCircularActionTarget(".light-power");
    expectCircularActionTarget(".expand-button");
    expect(regularWidthCss).toMatch(/--aboc-section-action-size:\s*var\(--area-bubble-overview-section-action-size,\s*44px\)/);
    expectCircularActionTarget(".section-off-button", "var\\(--aboc-section-action-size\\)");
    expectCircularActionTarget(".section-on-button", "var\\(--aboc-section-action-size\\)");
    expectCircularActionTarget(".quick-popup-close");
    expectCircularActionTarget(".quick-popup-entity-toggle");
    expectCircularActionTarget(".cover-control");
    expectCircularActionTarget(".temperature-stepper button");
  });

  it("mirrors structural room controls in RTL while keeping numeric chips isolated", () => {
    for (const selector of [".overview-heading", ".floor-toggle", ".area-summary", ".area-summary-pill", ".area-toggle", ".area-statuses", ".quick-actions", ".section-heading"]) {
      const declarations = declarationBodiesFor(selector, regularWidthCss).join("\n");
      expect(declarations, `${selector} must follow the card direction`).toMatch(/direction:\s*var\(--aboc-direction,\s*ltr\)/);
      expect(declarations, `${selector} must not force a physical LTR layout`).not.toMatch(/direction:\s*ltr/);
    }
    expect(declarationBodiesFor(".temperature", regularWidthCss).join("\n")).toMatch(/direction:\s*ltr/);
    expect(declarationBodiesFor(".temperature", regularWidthCss).join("\n")).toMatch(/unicode-bidi:\s*isolate/);
  });

  it("provides a viewport-safe modal quick-action surface with internal scrolling", () => {
    const dialog = declarationBodiesFor(".quick-action-dialog").join("\n");
    expect(dialog).toMatch(/width:\s*min\(/);
    expect(dialog).toMatch(/max-height:\s*min\([^;]*100dvh/);
    expect(dialog).toMatch(/direction:\s*var\(--aboc-direction,\s*ltr\)/);
    expect(cssText).toMatch(/\.quick-action-dialog::backdrop\s*\{[^}]*background:/s);
    expect(cssText).toMatch(/\.quick-popup-list\s*\{[^}]*overflow:\s*auto/s);
    expect(cssText).toMatch(/\.quick-popup-group-actions\s*\{[^}]*grid-template-columns:\s*repeat\(2/s);
    expect(cssText).toMatch(/@media \(max-width:\s*480px\)[\s\S]*safe-area-inset-bottom/);
  });

  it("scopes active colors and chevrons to each nested Area panel", () => {
    expect(cssText).toMatch(/\.area-panel\.has-active\s*>\s*\.area-summary\s+\.area-icon\s*\{/);
    expect(cssText).toMatch(/\.area-panel\.all-off\s*>\s*\.area-summary\s+\.area-icon\s*\{/);
    expect(cssText).toMatch(/\.area-panel\.expanded\s*>\s*\.area-summary\s+\.chevron\s*\{/);
    expect(cssText).not.toMatch(/\.expanded\s+\.chevron\s*\{/);
  });

  it("shows no outer frame while collapsed and one enclosing frame while expanded", () => {
    expect(cssText).toMatch(/\.area-panel\s*\{[^}]*overflow:\s*visible;[^}]*border:\s*0;[^}]*background:\s*transparent/s);
    expect(cssText).toMatch(/\.area-panel:not\(\.expanded\)\s*>\s*\.area-summary\s*\{[^}]*padding:\s*0/s);
    expect(cssText).toMatch(/\.area-panel\.expanded\s*\{[^}]*overflow:\s*hidden;[^}]*border:\s*2px solid var\(--aboc-area-frame-color\);[^}]*background:\s*var\(--aboc-row-bg\)/s);
    expect(cssText).toMatch(/\.area-panel\.expanded\s*>\s*\.area-summary\s*\{[^}]*margin-block:\s*-2px 0;[^}]*margin-inline:\s*-2px;[^}]*padding:\s*0/s);
    expect(cssText).toMatch(/\.area-summary-pill\s*\{[^}]*border:\s*2px solid var\(--aboc-area-frame-color\)/s);
    expect(cssText).toMatch(/\.area-panel\.expanded\.has-active\s*\{[^}]*background:\s*var\(--aboc-active-surface\)/s);
  });

  it("styles the climate count as a compact tag attached to temperature", () => {
    expect(cssText).toMatch(/\.temperature-climate-tag\s*\{[^}]*display:\s*inline-flex;[^}]*width:\s*26px;[^}]*height:\s*26px/s);
    expect(cssText).toMatch(/\.temperature-climate-tag::before\s*\{[^}]*inset:\s*-9px/s);
  });

  it("supports a transparent card surface and mirrors cover rows in RTL", () => {
    expect(cssText).toMatch(/--aboc-card-bg:\s*var\(--area-bubble-overview-card-bg,\s*transparent\)/s);
    expect(cssText).toMatch(/ha-card\s*\{[^}]*background:\s*var\(--aboc-card-bg\)/s);
    expect(cssText).toMatch(/\.cover-card,[\s\S]*?\.media-card\s*\{[^}]*direction:\s*var\(--aboc-direction,\s*ltr\)/s);
  });

  it("uses configurable Area-name typography at regular and mobile widths", () => {
    expect(regularWidthCss).toMatch(/--aboc-area-name-size:\s*var\(--area-bubble-overview-area-name-size,\s*17px\)/);
    expect(regularWidthCss).toMatch(/\.area-name\s*\{[^}]*font-size:\s*var\(--aboc-area-name-size\)/s);
    expect(containerCssAt(430)).toMatch(/\.area-name\s*\{[^}]*font-size:\s*min\(var\(--aboc-area-name-size\),\s*14px\)/s);
    expect(containerCssAt(340)).toMatch(/\.area-summary-pill \.area-toggle\s*\{[^}]*min-width:\s*112px/s);
  });

  it("styles the floor header as an accessible full-width disclosure target", () => {
    expect(cssText).toMatch(/\.floor-summary-pill\s*\{[^}]*width:\s*100%/s);
    expect(cssText).toMatch(/\.floor-toggle\s*\{[^}]*min-width:\s*0;[^}]*flex:\s*1 1 auto/s);
    expect(cssText).toMatch(/\.floor-toggle\s*\{[^}]*min-height:\s*(?:4[4-9]|[5-9]\d)px/s);
    expect(cssText).toMatch(/\.floor-chevron[^}]*transition:\s*transform/s);
    expect(cssText).toMatch(/\.floor-chevron\.expanded\s*\{[^}]*transform:\s*rotate\(180deg\)/s);
  });

  it("keeps the numeric occupancy chip visible in narrow layouts", () => {
    expect(cssText).toMatch(/\.summary-chip\.occupancy\s*\{[^}]*font-variant-numeric:\s*tabular-nums/s);
    expect(cssText).toMatch(/\.occupancy-count\s*\{[^}]*font-weight:\s*\d+/s);
    expect(cssText).not.toMatch(/\.area-statuses\s+\.occupancy\s*\{[^}]*display:\s*none/s);
    expect(containerCssAt(340)).not.toMatch(/grid-template-areas:\s*[\s\S]*?quick-actions quick-actions/);
    expect(cssText).toMatch(/\.mode-select\s*\{[^}]*--control-select-menu-height:\s*44px/s);
  });

  it("styles native Home Assistant mode menus and brightness sliders", () => {
    expect(cssText).toMatch(/\.mode-select\s*\{[^}]*--control-select-menu-border-radius:\s*999px/s);
    expect(cssText).toMatch(/\.brightness-slider\s*\{[^}]*min-height:\s*44px;[^}]*--control-slider-thickness:\s*38px/s);
    expect(cssText).toMatch(/\.brightness-control\s*\{[^}]*direction:\s*ltr/s);
  });

  it("gives long-press targets touch-safe feedback without blocking vertical scroll", () => {
    expect(cssText).toMatch(/\.hold-target\s*\{[^}]*touch-action:\s*pan-y/s);
    expect(cssText).toMatch(/\.hold-target\.holding\s*\{[^}]*transform:\s*scale\(/s);
  });
});
