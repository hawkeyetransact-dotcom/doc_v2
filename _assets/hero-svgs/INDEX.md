# Hero SVGs — The Canonical Visuals

| Field | Value |
|---|---|
| Owner | Founders + Design |
| Status | v1.0 |
| Last updated | 2026-05-31 |
| Audience | Anyone presenting / pitching / explaining Hawkeye |

> 💡 **What these are.** Five hand-crafted SVG diagrams that get used across decks, docs, and presentations. AWS-architecture-poster style — layered, annotated, code-traced. Each one is the canonical visual for its concept and should be reused (not redrawn in Mermaid each time).

---

## The Five

| # | File | Use it for | Used in |
|---|---|---|---|
| 1 | [`01-platform-architecture.svg`](01-platform-architecture.svg) | The 3-layer engine (Config + 5 pillars + AI Gateway) | HAWKEYE-STORY · PLATFORM-EXECUTIVE · VISION · Investor deck · CTO deck |
| 2 | [`02-audit-lifecycle.svg`](02-audit-lifecycle.svg) | Audit Management 8-phase swim-lane | Audit STORYBOOK · QA Head deck · Demo materials |
| 3 | [`03-askhawk-3-phase.svg`](03-askhawk-3-phase.svg) | AskHawk Regulations + SOPs + Wizard | AskHawk STORYBOOK · Investor deck · CTO deck |
| 4 | [`04-chain-of-evidence.svg`](04-chain-of-evidence.svg) | Cross-module record flow (FDA-483 traversing 7 modules) | HAWKEYE-STORY · Regulator collateral · CTO deck |
| 5 | [`05-market-positioning.svg`](05-market-positioning.svg) | Competitive quadrant | VISION · MARKET-ANALYSIS · Investor deck |

---

## How to embed

In any markdown doc rendered through `Doc_V2/_scripts/render-docs.mjs`, reference like this:

```markdown
![Platform Architecture](../_assets/hero-svgs/01-platform-architecture.svg)
```

The renderer inlines the SVG content directly (no `<img>` tag in the rendered HTML), so:
- PDFs render with the SVG baked in (no external dependency)
- Standalone HTML works offline
- Browser viewing scales the SVG natively

## Design principles followed

1. **Layered + grouped** — config layer / pipeline / AI gateway each have their own band
2. **Numbered callouts** — pillar numbers in solid circles, top-left of each card
3. **Code-traced** — every box has the actual file name from the codebase
4. **Honest** — gates labeled, gaps marked, governance guarantees explicit
5. **Print-safe** — A4-friendly proportions, readable at 100% zoom on 720p displays

## Edit / re-render

These are hand-crafted SVG (raw XML). To edit:
- Open the `.svg` in VS Code (text edit) OR Inkscape / Figma (visual edit)
- Re-save in place
- No re-generation step needed — markdown re-render picks up the new file

If you create a 6th hero diagram, add it to this index and link from wherever it's used.

---

## Open in browser

```
file:///C:/Users/debab/Code - Hawkeye/hawkeye-clean/Doc_V2/_assets/hero-svgs/01-platform-architecture.svg
file:///C:/Users/debab/Code - Hawkeye/hawkeye-clean/Doc_V2/_assets/hero-svgs/02-audit-lifecycle.svg
file:///C:/Users/debab/Code - Hawkeye/hawkeye-clean/Doc_V2/_assets/hero-svgs/03-askhawk-3-phase.svg
file:///C:/Users/debab/Code - Hawkeye/hawkeye-clean/Doc_V2/_assets/hero-svgs/04-chain-of-evidence.svg
file:///C:/Users/debab/Code - Hawkeye/hawkeye-clean/Doc_V2/_assets/hero-svgs/05-market-positioning.svg
```
