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

  it("keeps summaries on one row until their measured load reaches a suitable container threshold", () => {
    expect(regularWidthCss).toMatch(
      /\.area-summary-pill\s*\{[^}]*--aboc-summary-display:\s*flex;[^}]*--aboc-quick-wrap:\s*nowrap;[^}]*display:\s*var\(--aboc-summary-display\)/s,
    );
    expect(regularWidthCss).not.toMatch(/\.area-summary-pill\s*\{[^}]*display:\s*grid/s);
    expect(regularWidthCss).not.toMatch(/\.area-summary-pill\.summary-load-[5-8]/s);
    expect(cssText).not.toContain("dense-actions");

    const adaptiveThresholds = [
      { maxWidth: 400, load: 5 },
      { maxWidth: 470, load: 6 },
      { maxWidth: 520, load: 7 },
      { maxWidth: 620, load: 8 },
    ];

    for (const { maxWidth, load } of adaptiveThresholds) {
      const containerCss = containerCssAt(maxWidth);
      expect(containerCss, `missing ${maxWidth}px adaptive container`).not.toBe("");
      expect(declarationBodiesFor(`.area-summary-pill.summary-load-${load}`, containerCss)).toEqual(
        expect.arrayContaining([
          expect.stringMatching(
            /--aboc-summary-display:\s*grid;[\s\S]*--aboc-status-display:\s*contents;[\s\S]*--aboc-quick-width:\s*100%;[\s\S]*--aboc-quick-wrap:\s*wrap;/,
          ),
        ]),
      );
    }

    const narrowContainerCss = containerCssAt(400);
    expect(declarationBodiesFor(".area-summary-pill.responsive-actions", narrowContainerCss)).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/--aboc-summary-display:\s*grid;[\s\S]*--aboc-quick-wrap:\s*wrap;/),
      ]),
    );
  });

  it("preserves 44px touch targets while compacting dense rows", () => {
    expectCircularActionTarget(".quick-action");
    expectCircularActionTarget(".control-button");
    expectCircularActionTarget(".climate-mode-button");
    expectCircularActionTarget(".expand-button");
    expectCircularActionTarget(".section-off-button");
    expectCircularActionTarget(".cover-control");
    expectCircularActionTarget(".temperature-stepper button");
  });

  it("scopes active colors and chevrons to each nested Area panel", () => {
    expect(cssText).toMatch(/\.area-panel\.has-active\s*>\s*\.area-summary\s+\.area-icon\s*\{/);
    expect(cssText).toMatch(/\.area-panel\.all-off\s*>\s*\.area-summary\s+\.area-icon\s*\{/);
    expect(cssText).toMatch(/\.area-panel\.expanded\s*>\s*\.area-summary\s+\.chevron\s*\{/);
    expect(cssText).not.toMatch(/\.expanded\s+\.chevron\s*\{/);
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
    expect(cssText).toMatch(
      /@container overview-card \(max-width:\s*340px\)[\s\S]*?grid-template-areas:\s*[^;]*area-toggle area-toggle[^;]*occupancy area-temperature/s,
    );
    expect(cssText).toMatch(/\.select-pill select\s*\{[^}]*height:\s*44px/s);
  });

  it("gives long-press targets touch-safe feedback without blocking vertical scroll", () => {
    expect(cssText).toMatch(/\.hold-target\s*\{[^}]*touch-action:\s*pan-y/s);
    expect(cssText).toMatch(/\.hold-target\.holding\s*\{[^}]*transform:\s*scale\(/s);
  });
});
