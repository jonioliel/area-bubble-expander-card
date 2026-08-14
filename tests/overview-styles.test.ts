import { describe, expect, it } from "vitest";

import { overviewCardStyles } from "../src/overview/styles";

const cssText = overviewCardStyles.cssText;

describe("overview header presentation contracts", () => {
  it("uses a neutral surface by default and reserves the active surface for powered areas", () => {
    expect(cssText).toMatch(/\.area-summary-pill\s*\{[^}]*background:\s*var\(--aboc-row-bg\)/s);
    expect(cssText).toMatch(
      /\.area-panel\.has-active\s+\.area-summary-pill\s*\{[^}]*background:\s*var\(--aboc-active-surface\)/s,
    );
  });

  it("reflows dense quick actions without clipping or shrinking their touch targets", () => {
    expect(cssText).toMatch(/\.area-summary-pill\.dense-actions\s*\{[^}]*grid-template-areas:/s);
    expect(cssText).toMatch(/\.area-summary-pill\.dense-actions\s+\.quick-actions\s*\{[^}]*flex-wrap:\s*wrap/s);
    expect(cssText).toMatch(/\.area-summary-pill\.dense-actions\s+\.quick-actions\s*\{[^}]*overflow:\s*visible/s);
    expect(cssText).toMatch(/@container overview-card \(max-width:\s*380px\)[\s\S]*?\.area-summary-pill\.responsive-actions\s*\{/);
    expect(cssText).toMatch(/\.quick-action[\s\S]*?width:\s*44px;[\s\S]*?height:\s*44px;/);
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
