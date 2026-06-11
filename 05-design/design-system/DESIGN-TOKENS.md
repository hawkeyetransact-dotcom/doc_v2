# Design Tokens

## Hawkeye Design System — Color · Typography · Spacing · Elevation · Motion

| Field | Value |
|---|---|
| Owner | Design · Frontend Engineering |
| Status | v1.0 — 2026-06-05 |
| Scope | The authoritative token spec used across all Hawkeye UI surfaces |
| Pairs with | [DESIGN-PRINCIPLES.md](./DESIGN-PRINCIPLES.md) · [COMPONENT-INVENTORY.md](../wireframes/COMPONENT-INVENTORY.md) · [ACCESSIBILITY.md](../accessibility/ACCESSIBILITY.md) · [FRONTEND.md](../../04-engineering/04-frontend/FRONTEND.md) |
| Code home | `frontend/lib/theme.ts` |

---

## 1. Token philosophy

> 💡 **Tokens are the single source of truth.** No component hard-codes colors, spacing, or font sizes. Every design value flows from `theme.ts` (which mirrors this document). Updates here cascade everywhere.

Two principles govern token design:

1. **Semantic over literal.** Token names describe purpose (`status.success.background`), not appearance (`green-100`). Renaming the appearance never breaks consumers.
2. **Density over delight** (per [DESIGN-PRINCIPLES.md §1](./DESIGN-PRINCIPLES.md)). Compact scale; generous data-density; minimal whitespace ornamentation.

---

## 2. Color tokens

### 2.1 Brand

| Token | Hex | RGB | Used for |
|---|---|---|---|
| `brand.primary` | `#1E3A6E` | `30, 58, 110` | Primary actions · key brand surfaces · `Seal` pillar |
| `brand.primaryHover` | `#172E58` | — | Primary button hover state |
| `brand.primaryActive` | `#0F2042` | — | Primary button active state |
| `brand.accent` | `#7C3AED` | — | Secondary highlights · AI-touched UI · AskHawk |
| `brand.accentHover` | `#6D28D9` | — | Accent button hover |

### 2.2 Semantic — status colors

Per [DESIGN-PRINCIPLES.md §4 — Status always visible](./DESIGN-PRINCIPLES.md). Status uses color + icon + label (never color alone, per [ACCESSIBILITY.md §6](../accessibility/ACCESSIBILITY.md)).

| Token | Hex | Contrast on white | Used for |
|---|---|---|---|
| `status.success.fg` | `#15803D` | 5.3 : 1 ✅ | "Approved" "Closed" "Effective" text |
| `status.success.bg` | `#DCFCE7` | n/a | Status chip background |
| `status.success.border` | `#15803D` | n/a | Status chip border |
| `status.info.fg` | `#1E40AF` | 7.2 : 1 ✅ | "In progress" "Draft" "In review" |
| `status.info.bg` | `#DBEAFE` | n/a | |
| `status.warning.fg` | `#92400E` | 6.1 : 1 ✅ | "Pending" "Awaiting approval" "Blocked" |
| `status.warning.bg` | `#FEF3C7` | n/a | |
| `status.danger.fg` | `#B91C1C` | 5.8 : 1 ✅ | "Failed" "Rejected" "Overdue" |
| `status.danger.bg` | `#FEE2E2` | n/a | |
| `status.neutral.fg` | `#475569` | 7.1 : 1 ✅ | "Not started" "Inactive" "Obsolete" |
| `status.neutral.bg` | `#F1F5F9` | n/a | |
| `status.ai.fg` | `#581C87` | 8.0 : 1 ✅ | "AI-drafted" "AI-assisted" — purple denotes AI provenance |
| `status.ai.bg` | `#F3E8FF` | n/a | |

### 2.3 Text

| Token | Hex | Contrast on white | Used for |
|---|---|---|---|
| `text.primary` | `#0F172A` | 17.4 : 1 ✅ | Default body text |
| `text.secondary` | `#475569` | 7.1 : 1 ✅ | Secondary/supporting text |
| `text.tertiary` | `#64748B` | 5.0 : 1 ✅ | Captions · timestamps · metadata |
| `text.disabled` | `#94A3B8` | 2.9 : 1 ⚠️ | Disabled — exempt per WCAG; paired with explicit "disabled" label |
| `text.inverse` | `#FFFFFF` | — | Text on dark surfaces |
| `text.link` | `#1E40AF` | 7.2 : 1 ✅ | Hyperlinks |
| `text.linkHover` | `#1E3A8A` | — | Hyperlink hover |

### 2.4 Surface (background)

| Token | Hex | Used for |
|---|---|---|
| `surface.page` | `#F8FAFC` | App background |
| `surface.card` | `#FFFFFF` | Cards · modals · drawers |
| `surface.cardHover` | `#F1F5F9` | Card hover state |
| `surface.muted` | `#F1F5F9` | Sub-sections · table-header backgrounds |
| `surface.divider` | `#E2E8F0` | Dividers · table-cell borders |
| `surface.border` | `#CBD5E1` | Input borders · card borders |
| `surface.borderFocus` | `#1E40AF` | Focused input borders |

### 2.5 Dark mode (planned Q4 2026)

Dark-mode tokens defined symmetrically. Status colors swap to higher-luminance variants; surfaces flip; text inverts. Tokens follow same naming with `dark.` prefix.

---

## 3. Typography tokens

### 3.1 Font family

| Token | Value | Used for |
|---|---|---|
| `font.sans` | `'Inter', -apple-system, BlinkMacSystemFont, sans-serif` | All UI text |
| `font.mono` | `'JetBrains Mono', 'SF Mono', monospace` | Code · IDs · audit-trail timestamps · technical references |
| `font.serif` | n/a — not used in product UI | — |

### 3.2 Type scale

Compact scale matching "density over delight":

| Token | Size | Line-height | Used for |
|---|---|---|---|
| `text.xs` | 11px | 16px | Captions · table-cell metadata · status-chip text |
| `text.sm` | 13px | 18px | Body text in dense tables · secondary text |
| `text.base` | 14px | 20px | Default body text · form labels |
| `text.lg` | 16px | 24px | Section headings · primary buttons |
| `text.xl` | 20px | 28px | Page subheadings |
| `text.2xl` | 24px | 32px | Page headings |
| `text.3xl` | 30px | 36px | Marketing pages only (not in-app) |

### 3.3 Font weight

| Token | Value | Used for |
|---|---|---|
| `weight.normal` | 400 | Body text |
| `weight.medium` | 500 | Emphasized body · table headers · button labels |
| `weight.semibold` | 600 | Section headings · status-chip text |
| `weight.bold` | 700 | Page headings · key calls-to-action |

### 3.4 Letter-spacing

| Token | Value | Used for |
|---|---|---|
| `tracking.tight` | -0.02em | Headings |
| `tracking.normal` | 0 | Body text |
| `tracking.wide` | 0.05em | All-caps labels (e.g., "AUDIT TRAIL", "DRAFT") |

---

## 4. Spacing tokens (4px scale)

Spacing is on a 4-pixel base scale. Use semantic spacing tokens for layout intent.

| Token | Value | Common use |
|---|---|---|
| `space.0` | 0 | Zero |
| `space.1` | 4px | Tight gap (chip + icon) |
| `space.2` | 8px | Inline gap |
| `space.3` | 12px | Component-internal padding |
| `space.4` | 16px | Default padding · stack gap |
| `space.5` | 20px | Form field gap |
| `space.6` | 24px | Card padding · section gap |
| `space.8` | 32px | Page padding · row separators |
| `space.10` | 40px | Major section separators |
| `space.12` | 48px | Page-section gaps |
| `space.16` | 64px | Hero spacing (rare) |

### 4.1 Semantic spacing

| Token | Maps to | Used for |
|---|---|---|
| `space.field` | `space.5` (20px) | Vertical gap between form fields |
| `space.section` | `space.10` (40px) | Vertical gap between page sections |
| `space.card.padding` | `space.6` (24px) | Standard card inner padding |
| `space.table.cell` | `space.3` 12px vertical / `space.4` 16px horizontal | Table cell padding |
| `space.button.x` | `space.4` 16px | Horizontal padding inside buttons |
| `space.button.y` | `space.2` 8px | Vertical padding inside buttons |

---

## 5. Radius tokens

| Token | Value | Used for |
|---|---|---|
| `radius.none` | 0 | Hard edges (rare) |
| `radius.sm` | 4px | Form inputs · status chips |
| `radius.md` | 6px | Buttons · cards |
| `radius.lg` | 8px | Modals · drawers |
| `radius.xl` | 12px | Hero cards (rare) |
| `radius.full` | 9999px | Pills · avatars · circular badges |

---

## 6. Elevation (shadow)

| Token | Box-shadow | Used for |
|---|---|---|
| `elevation.0` | none | Flat surfaces |
| `elevation.1` | `0 1px 2px rgba(0,0,0,0.05)` | Resting cards |
| `elevation.2` | `0 4px 6px rgba(0,0,0,0.07)` | Hovered cards · dropdowns |
| `elevation.3` | `0 10px 15px rgba(0,0,0,0.10)` | Modals · drawers |
| `elevation.4` | `0 20px 25px rgba(0,0,0,0.10)` | Toast notifications · floating overlays |

Hawkeye uses elevation sparingly — density over delight means most surfaces are flat with subtle dividers, not layered with shadows.

---

## 7. Motion / animation

| Token | Value | Used for |
|---|---|---|
| `duration.fast` | 100ms | Hover transitions · focus rings |
| `duration.base` | 200ms | Most UI transitions (dropdown open, modal fade) |
| `duration.slow` | 350ms | Drawer slide · page transitions |
| `duration.slowest` | 500ms | Loading states · skeletons |
| `easing.standard` | `cubic-bezier(0.4, 0.0, 0.2, 1)` | Most transitions |
| `easing.decelerate` | `cubic-bezier(0.0, 0.0, 0.2, 1)` | Entering elements |
| `easing.accelerate` | `cubic-bezier(0.4, 0.0, 1, 1)` | Exiting elements |

**Reduced-motion respect:** if `@media (prefers-reduced-motion: reduce)` matches, all transitions are reduced to `duration.fast` or skipped entirely. Enforced via global CSS rule.

---

## 8. Breakpoints

| Token | min-width | Common device |
|---|---|---|
| `bp.sm` | 640px | Large phones · small tablets |
| `bp.md` | 768px | Tablets |
| `bp.lg` | 1024px | Small laptops |
| `bp.xl` | 1280px | Desktops |
| `bp.2xl` | 1536px | Large desktops · QA work stations |

Hawkeye web is responsive from 360px upward. Most QA work happens at ≥1280px (data density is the priority); mobile companion app (M9) handles smaller form factors natively.

---

## 9. Z-index scale

| Token | Value | Used for |
|---|---|---|
| `z.base` | 0 | Default page content |
| `z.dropdown` | 1000 | Dropdowns · select menus |
| `z.sticky` | 1100 | Sticky headers |
| `z.drawer` | 1200 | Slide-in drawers (AskHawk) |
| `z.modal` | 1300 | Modal dialogs |
| `z.popover` | 1400 | Popovers · tooltips |
| `z.toast` | 1500 | Toast notifications |

---

## 10. Iconography

| Aspect | Spec |
|---|---|
| Library | Material Icons (via `@mui/icons-material`) + custom Hawkeye-specific icons |
| Standard size | 20px (matches `text.lg` line-height) |
| Inline-in-text size | 14px (matches `text.base`) |
| Always paired with text label for status semantics | per [ACCESSIBILITY.md §6](../accessibility/ACCESSIBILITY.md) |
| Stroke / fill | Material default (filled for primary actions, outlined for secondary) |
| Custom Hawkeye icons | `frontend/components/ui/icons/` — Phase stepper · Pillar markers · Confidence badge · AI sparkle |

---

## 11. Token enforcement

| Mechanism | Detail |
|---|---|
| Single source of truth | `frontend/lib/theme.ts` — all components read from here |
| MUI theme integration | Tokens applied via MUI `ThemeProvider` |
| Tailwind config | Tailwind tokens mirror the MUI theme (auto-synced via build script) |
| Linting | Custom ESLint rule rejects hex colors / pixel values in component files (forces token usage) — in development |
| Storybook | Each token group visible in Storybook with usage examples (forthcoming) |
| Code review | Reviewers flag any token bypass |

---

## 12. Examples — composition

A few worked examples of how tokens compose into a finished UI element:

### Primary button

```css
background: var(--color-brand-primary);          /* #1E3A6E */
color: var(--color-text-inverse);                /* #FFFFFF */
padding: var(--space-button-y) var(--space-button-x);  /* 8px 16px */
border-radius: var(--radius-md);                 /* 6px */
font-size: var(--text-base);                     /* 14px */
font-weight: var(--weight-medium);               /* 500 */
transition: background var(--duration-fast) var(--easing-standard);
/* hover */
background: var(--color-brand-primary-hover);    /* #172E58 */
/* focus-visible */
outline: 2px solid var(--color-surface-border-focus);  /* #1E40AF */
outline-offset: 2px;
```

### Status chip (Success)

```css
background: var(--color-status-success-bg);      /* #DCFCE7 */
color: var(--color-status-success-fg);           /* #15803D */
border: 1px solid var(--color-status-success-fg);
padding: 2px var(--space-2);                     /* 2px 8px */
border-radius: var(--radius-full);
font-size: var(--text-xs);                       /* 11px */
font-weight: var(--weight-semibold);             /* 600 */
text-transform: uppercase;
letter-spacing: var(--tracking-wide);            /* 0.05em */
/* + leading icon "check" (Material Icon, 14px) */
/* + text label "Done" */
```

### AI confidence badge

```css
background: var(--color-status-ai-bg);           /* #F3E8FF */
color: var(--color-status-ai-fg);                /* #581C87 */
border: 1px solid var(--color-status-ai-fg);
padding: 2px var(--space-2);
border-radius: var(--radius-full);
font-size: var(--text-xs);
font-weight: var(--weight-medium);
/* + sparkle icon (custom) */
/* + confidence value e.g. "92%" */
/* + label e.g. "AI-drafted" */
```

---

## 13. See also

- [DESIGN-PRINCIPLES.md](./DESIGN-PRINCIPLES.md) — UI philosophy
- [COMPONENT-INVENTORY.md](../wireframes/COMPONENT-INVENTORY.md) — components that consume these tokens
- [ACCESSIBILITY.md](../accessibility/ACCESSIBILITY.md) — contrast ratios + non-color signaling rules
- [USER-FLOWS.md](../flows/USER-FLOWS.md) — flows that use these components
- [FRONTEND.md](../../04-engineering/04-frontend/FRONTEND.md) — frontend architecture (MUI + Tailwind integration)
- `frontend/lib/theme.ts` — the canonical code home

---

*Doc_V2 · Design · Design Tokens v1.0 · 2026-06-05*
