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

const expectCircularActionTarget = (selector: string): void => {
  expect(declarationBodiesFor(selector)).toEqual(
    expect.arrayContaining([
      expect.stringMatching(/width:\s*44px;[\s\S]*height:\s*44px;/),
    ]),
  );
};

describe("overview header presentation contracts", () => {
  it("shares one theme-aware neutral surface between floor headers and powered-off rows", () => {
    expect(regularWidthCss).toMatch(
      /--aboc-row-bg:\s*var\(\s*--area-bubble-overview-row-bg,\s*color-mix\(in srgb,\s*var\(--secondary-background-color\)\s+\d+%,\s*transparent\)\s*\);/s,
    );
    expect(regularWidthCss).toMatch(/\.floor-toggle\s*\{[^}]*background:\s*var\(--aboc-row-bg\)/s);
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

  it("uses smaller mobile quick-action visuals while preserving a 44px hit target", () => {
    const mobileCss = containerCssAt(430);
    expect(declarationBodiesFor(".quick-action", mobileCss)).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/width:\s*34px;[\s\S]*height:\s*34px;[\s\S]*flex-basis:\s*34px;/),
      ]),
    );
    expect(declarationBodiesFor(".quick-action::before").join("\n")).toMatch(
      /content:\s*["']{2};[\s\S]*position:\s*absolute;[\s\S]*inset:\s*-5px;/,
    );
    expect(declarationBodiesFor(".quick-actions", regularWidthCss).join("\n")).toMatch(
      /padding-inline:\s*3px;[\s\S]*scroll-padding-inline:\s*3px;/,
    );
  });

  it("preserves 44px touch targets for the remaining controls", () => {
    expectCircularActionTarget(".control-button");
    expectCircularActionTarget(".light-power");
    expectCircularActionTarget(".expand-button");
    expectCircularActionTarget(".section-off-button");
    expectCircularActionTarget(".section-on-button");
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

  it("removes the outer Area frame in both collapsed and expanded states", () => {
    expect(cssText).toMatch(/\.area-panel\s*\{[^}]*overflow:\s*visible;[^}]*border:\s*0;[^}]*background:\s*transparent/s);
    expect(cssText).toMatch(/\.area-panel:not\(\.expanded\)\s*>\s*\.area-summary\s*\{[^}]*padding:\s*0/s);
    expect(cssText).not.toMatch(/\.area-panel\.expanded(?:\.has-active|\.all-off)\s*\{[^}]*border-color:/s);
  });

  it("uses configurable Area-name typography at regular and mobile widths", () => {
    expect(regularWidthCss).toMatch(/--aboc-area-name-size:\s*var\(--area-bubble-overview-area-name-size,\s*17px\)/);
    expect(regularWidthCss).toMatch(/\.area-name\s*\{[^}]*font-size:\s*var\(--aboc-area-name-size\)/s);
    expect(containerCssAt(430)).toMatch(/\.area-name\s*\{[^}]*font-size:\s*min\(var\(--aboc-area-name-size\),\s*14px\)/s);
    expect(containerCssAt(340)).toMatch(/\.area-summary-pill \.area-toggle\s*\{[^}]*min-width:\s*112px/s);
  });

  it("styles the floor header as an accessible full-width disclosure target", () => {
    expect(cssText).toMatch(/\.floor-toggle\s*\{[^}]*width:\s*100%/s);
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
