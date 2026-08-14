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
});
