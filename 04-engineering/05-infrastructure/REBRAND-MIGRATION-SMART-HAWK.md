# Rebrand Migration — S.M.A.R.T. Hawk + HawkVault

| Field | Value |
|---|---|
| Owner | Platform Engineering |
| Status | Planning — application changes NOT yet executed |
| Last updated | 2026-06-13 |
| Scope | Application code (`codex_backend_01`, `codex_frontend_01`). Documentation (`doc_v2`) is **already rebranded** — see §9. |
| Companion | `codex_backend_01/scripts/rename-digilocker-to-hawkvault.mjs` (existing, frontend display-only) |

---

## 0. The two rebrands

| Old | New | Kind |
|---|---|---|
| **Hawkeye** (product) | **S.M.A.R.T. Hawk** | Brand wordmark |
| **Hawkeye Transact Pvt. Ltd.** (entity) | **S.M.A.R.T. Hawk Transact Pvt. Ltd.** | Legal entity |
| **DigiLocker** (internal vault feature name) | **HawkVault** | Feature brand |

**S.M.A.R.T.** is an acronym for the five-pillar runtime pipeline: **S**ource · **M**odel · **A**ssess · **R**eport · **T**race (formerly Collect · Process · Validate · Report · Seal).

### Guiding strategy — **display-only rebrand**

Mirror the convention already established in `scripts/rename-digilocker-to-hawkvault.mjs`: **change user-visible strings; leave internal identifiers intact** (TypeScript types, variable/function names, model class names, MongoDB collection names, field names, file names, import paths, URL slugs). This keeps the rebrand a low-risk, non-breaking change with no data migration.

### Scope decisions (confirmed)
- **Change:** product name + legal entity name in user-visible text.
- **Keep (for now):** domains/emails/handles — `hawkeye.io`, `@hawkeye.local`, `hawkeyetransact-dotcom` GitHub org/repos. Infra and legal DNS lag a brand change; treat as a separate cutover (§7).

---

## 1. ⚠️ CRITICAL — DigiLocker disambiguation (read before any rename)

**"DigiLocker" means two different things in this codebase. Only ONE is being rebranded.**

| Sense | Example | Action |
|---|---|---|
| **(a) The internal document-vault feature** the team branded "DigiLocker" | nav item, page titles, "Upload to DigiLocker", `components/hawkvault/DigiLocker*.tsx` user text | **RENAME → HawkVault** (user-visible only) |
| **(b) The actual Indian Government DigiLocker service** integrated for evidence import | "Import from DigiLocker", OAuth consent with the government wallet, `profileImportController`, source tags `source = DigiLocker` | **KEEP "DigiLocker"** — it is a real external proper noun; renaming it would be factually wrong and break user comprehension |

> 🚩 Before bulk-replacing any "DigiLocker" string, classify it as (a) or (b). The government-integration strings, OAuth labels, and "source: DigiLocker" provenance tags **must remain "DigiLocker."** This is why a blind find-replace is unsafe and the scoped script approach is required.

(For this reason, the 10 "DigiLocker" mentions in `doc_v2` were intentionally **left unchanged** — they all refer to sense (b) or to code paths.)

---

## 2. Backend (`codex_backend_01`) — change list

### 2.1 User-visible strings (display-only)
- [ ] Replace user-visible **"Hawkeye" → "S.M.A.R.T. Hawk"** in: API response messages, email templates, PDF/report headers & footers, seed data labels, Swagger/OpenAPI `info.title`, log banners, `README.md`.
- [ ] Replace user-visible **"DigiLocker" → "HawkVault"** only for sense (a) (§1) — vault feature labels in responses, report sections, seed data.
- [ ] `package.json` `name`: currently `sample-backend` → set to `smart-hawk-backend` (cosmetic; verify nothing pins the old name).

### 2.2 Routes (keep slugs; alias already exists)
- [x] `app.js` already mounts **both** `app.use("/api/hawkvault", digilockerRoutes)` and `app.use("/api/digilocker", digilockerRoutes)` — HawkVault alias is live.
- [ ] Decide deprecation policy for `/api/digilocker`: keep as a permanent alias (recommended — external integrations may use it), or sunset on a published date with a `Deprecation` header.
- [ ] Keep internal route **file** name `digilockerRoutes.js` (identifier) unless doing a full identifier rename (§6).

### 2.3 Models & MongoDB collections — **DO NOT rename collections**
- [ ] **Keep** collection name `digilocker_documents` (and all `digilocker*` collections). Renaming collections is a data migration with downtime/rollback risk and zero user-facing benefit (display-only strategy).
- [ ] Class/export names (`DigiLockerDocument`, `digilocker*Model.js` files) — keep as identifiers, OR include in the optional full-identifier rename (§6).
- [ ] Provenance field values like `source: "DigiLocker"` → **keep** (sense (b), §1).

### 2.4 Services / controllers (identifiers — keep)
`digilockerController.js`, `services/digilocker/digilockerService.js`, `digilockerStorageService.js`, `services/ai/digilockerAiService.js` — file/identifier names stay under display-only. Only edit **user-visible strings inside** them.

### 2.5 Config / env / ops
- [ ] `.env`, `apprunner.yaml`: values containing `hawkeyetransact` / `hawkeye` — **keep** (infra/DNS cutover is §7). Inventory them so the cutover is a known set.
- [ ] Email "from" name / sender display → "S.M.A.R.T. Hawk" (keep sending domain until §7).
- [ ] Any DigiLocker (government) OAuth client config → **keep** (sense (b)).

---

## 3. Frontend (`codex_frontend_01`) — change list

### 3.1 Run / extend the existing script
- [ ] Run `node scripts/rename-digilocker-to-hawkvault.mjs --apply` (frontend, display-only DigiLocker→HawkVault). **First** apply the §1 guard: audit its output to ensure no sense-(b) government strings were changed.
- [ ] Author a sibling **`rename-hawkeye-to-smart-hawk.mjs`** using the same safe regex approach (replace standalone "Hawkeye" in JSX text / string literals / md; preserve identifiers and `hawkeye.*` domains).

### 3.2 Components (folder already moved; files still DigiLocker-named)
- [ ] `components/hawkvault/DigiLockerUpload.tsx`, `DigiLockerLibrary.tsx`, `DigiLockerEvidencePanel.tsx` — folder is already `hawkvault/`. **User-visible text** → HawkVault. File/component **identifier** rename (→ `HawkVaultUpload` etc.) is optional (§6); if done, update all imports.

### 3.3 Routes (URL slugs — keep, add alias if desired)
- [ ] `app/(console)/digilocker/` and `app/(console)/digilocker/upload/` — keep the slug (bookmarks/links), or add a `hawkvault` route that renders the same page and redirect `digilocker → hawkvault`. Note `app/(console)/qms/vault/page.tsx` and `app/(console)/document-control/page.tsx` already exist.
- [ ] `app/api/next/digilocker/[...slug]/route.ts` — keep slug to match backend alias, or mirror `/hawkvault`.

### 3.4 i18n / config / chrome (user-visible — change)
- [ ] `locales/en.json` and `locales/hi.json` — replace user-visible "Hawkeye"→"S.M.A.R.T. Hawk" and vault-feature "DigiLocker"→"HawkVault" (NOT government-service strings).
- [ ] `constant/app-config.ts` and `constant/routes.ts` — app/display name, nav labels.
- [ ] `components/layout/Drawer/SidebarNav.tsx`, `BreadcrumbBar.tsx`, `megaMenuConfig.original.ts` — nav/menu labels.
- [ ] `package.json` `name`: `hawkeye-dashboard` → `smart-hawk-dashboard`.
- [ ] `<title>` / metadata, manifest, favicon, og-image, login/register screens (`components/auth/register.tsx`).

### 3.5 Onboarding / profile / audit surfaces with brand text
- [ ] `components/onboard/*`, `components/onboarding/RoleOnboardingCoach.tsx`, `components/profile/*`, `components/audits/*`, `components/compliance/ComplianceCopilot.tsx` — sweep for user-visible brand strings.

---

## 4. Visual assets / brand collateral (both repos + doc_v2)
- [ ] Logo, wordmark, favicon, app icons, OG/social images → new S.M.A.R.T. Hawk identity.
- [ ] Hero SVGs in `doc_v2/_assets/hero-svgs/` contain embedded "Hawkeye" text and the pillar names — these need **design rework**, not find-replace (text boxes will overflow with the longer name). Tracked here, not auto-edited.
- [ ] Email/PDF letterhead templates, report cover pages.
- [ ] Demo/marketing HTML in `codex_backend_01/docs/_archive/...` (low priority; archived).

---

## 5. "AskHawk", "HawkVault" — keep (brand family)
"**AskHawk**" (module) and "**HawkVault**" both retain "Hawk" and are part of the S.M.A.R.T. Hawk family. **No change** to these names. Do not strip "Hawk".

---

## 6. OPTIONAL — full identifier rename (deferred, higher risk)
If a later, dedicated pass wants identifiers (not just display) renamed `Hawkeye→SmartHawk`, `DigiLocker→HawkVault`:
- Rename files, classes, types, imports across both repos (large diff; touch ~2,800 occurrences).
- **Still keep** MongoDB collection names and the government-DigiLocker references.
- Requires full regression + E2E (Playwright) run.
- **Recommendation:** do NOT bundle with the display rebrand. Ship display-only first; schedule identifier cleanup separately if desired.

---

## 7. Domain / DNS / repo / legal cutover (separate program)
Out of scope for the display rebrand; track as a cutover checklist:
- [ ] Register/redirect new domain; migrate `@hawkeye.*` email; update OAuth redirect URIs (incl. government DigiLocker callback if domain-bound).
- [ ] GitHub org/repo rename `hawkeyetransact-dotcom/*` (breaks remotes, CI, badges, deep links — coordinate).
- [ ] Legal entity name change in contracts, DPA, invoices, footer "© S.M.A.R.T. Hawk Transact Pvt. Ltd.".
- [ ] App Store / cloud account / billing display names.

---

## 8. The S.M.A.R.T. five-pillar pipeline (conceptual)
Docs now relabel the pipeline **Source · Model · Assess · Report · Trace** (was Collect · Process · Validate · Report · Seal). In code these are largely **conceptual stage names**, not literal identifiers, so usually no code change is needed. If any service/log explicitly prints the old pillar names to users, update the string only. Internal service names (`auditTrailService`, etc.) are unaffected.

---

## 9. Already done — documentation (`doc_v2`)
For reference, the documentation rebrand is **complete** on branch `claude/documentation-coverage-review-dv820k`:
- 959 "Hawkeye → S.M.A.R.T. Hawk" replacements across 105 `.md` files (incl. legal entity).
- `HAWKEYE-STORY.md` → `SMART-HAWK-STORY.md` (+ all links fixed).
- Five-pillar pipeline relabelled to S.M.A.R.T. (Source·Model·Assess·Report·Trace) across 15 files; acronym defined in `PLATFORM-OVERVIEW.md`.
- "DigiLocker" left unchanged in docs (all references are sense (b) / code paths — §1).
- Domains/emails/handles preserved.

---

## 10. Suggested sequence
1. Apply §1 classification guard to the existing DigiLocker script; run it (frontend display).
2. Author + run `rename-hawkeye-to-smart-hawk.mjs` (both repos, display-only).
3. Hand-fix config/i18n/nav/package/title/auth screens (§2.1, §3.4).
4. Swap brand assets (§4).
5. QA: full E2E + visual review; confirm government-DigiLocker flows still read "DigiLocker".
6. Schedule §6 (identifier cleanup) and §7 (domain/legal cutover) as separate programs.
