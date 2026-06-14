# Doc_V2 — INDEX

| Field | Value |
|---|---|
| Generated | 2026-06-11 (regenerated to reflect current state) |
| Folders | 95+ · numbered prefixes are intentional (reading order) |
| Markdown files | 133+ |
| Read first | [PROJECT-STATE.md](./PROJECT-STATE.md) · [WORKFLOW.md](./WORKFLOW.md) |

---

## Root-level documents

| File | Purpose |
|---|---|
| [PROJECT-STATE.md](./PROJECT-STATE.md) | **Read first.** Canonical state: corrected numbers · honesty register · canonical docs per topic · open work items · change log. |
| [WORKFLOW.md](./WORKFLOW.md) | **Read second.** Mobile + desktop operating rules. Prevents redundant instructions. |
| [README.md](./README.md) | Repo intro for new readers. |
| [SMART-HAWK-STORY.md](./SMART-HAWK-STORY.md) | Long-form narrative version of the company's story (strategic, not operational). |
| [INDEX.md](./INDEX.md) | This file. |

---

## 00-company/
- `mission-and-vision/` — company purpose, vision statement, values
- `org-chart/` — current team, reporting lines, planned hires
- `hiring/` — open roles, JD library, interview rubrics
- `culture/` — operating principles, rituals, handbook
- **`onboarding/`** — `TEAM-ONBOARDING.md` (new team members · 3 paths) · `COMPLIANCE-TEST-GUIDE.md` (38 verification scenarios for QA/Compliance) · `TEST-USERS-AND-AUDIT-WALKTHROUGH.md` (31 seeded test users · 60-min audit playbook)

## 01-strategy/
- `vision-and-positioning/` — `VISION.md` (canonical strategic + 5-layer architecture)
- `market-analysis/` — TAM · sectors · competitive landscape
- `gtm-strategy/` — GTM plan · target segments · motion
- `pricing-and-packaging/` — `PRICING.md` (canonical pricing · 5-rung Sandbox→PoC→Starter→Growth→Enterprise ladder)
- `partnerships/` — channel · integration · technology

## 02-fundraising/
- `pitch-deck/` — `PITCH-DECK.md` (12 slides · $1.5M ask) · `INVESTOR-DECK.md` (extended version)
- `business-plan/` — `BUSINESS-PLAN.md` (bottom-up TAM + team build + 36-month plan)
- `financial-model/` — `FINANCIAL-MODEL.md` (corrected unit economics per cost-model.xlsx)
- `data-room/` — `DATA-ROOM.md` (diligence-ready index)
- `investor-updates/` — monthly/quarterly cadence

## 03-product/
- `00-overview/` — `PRODUCT-OVERVIEW.md`
- `01-personas-and-research/` — `PERSONAS.md` · `RESEARCH-FINDINGS.md` (n=24 discovery interviews)
- `02-urs/` — `URS-INDEX.md` (master catalog) — per-module URS lives in [06-modules/](./06-modules/)
- `03-prd/` — `CORE-PRD.md` (canonical platform PRD · 15 modules) · `PRD-INDEX.md` (feature PRD catalog)
- `04-roadmap/` — `ROADMAP.md`
- `05-decisions/` — `DECISIONS-INDEX.md` · PDR-001 (no-freemium) · PDR-002 (GAMP Cat 4 commitment)

## 04-engineering/
- `00-overview/` — `PLATFORM-OVERVIEW.md` (canonical engineering) · `PLATFORM-EXECUTIVE.md` (1-pager exec) · `PLATFORM-ENGINEERING.md` (1-pager engineer) · `PLATFORM-USER-FLOWS.md` (persona flows)
- `01-architecture/` — `ARCHITECTURE.md` (backend system architecture · 7 patterns)
- `02-data-model/` — `DATA-MODEL.md`
- `03-api-contracts/` — `API-CONTRACTS.md`
- `04-frontend/` — `FRONTEND.md` (Next.js 15 · MUI 6 · architecture)
- `05-infrastructure/` — `INFRASTRUCTURE.md` (Vercel + Atlas + R2 + ops) · `AWS-DECOMMISSION.md` (migration runbook)
- `06-security/` — `SECURITY.md`
- `07-ai/` — `AI-ARCHITECTURE.md` (Layer 3 · multi-LLM gateway · grounded gen · cite-or-fallback)
- `08-adrs/` — `ADR-INDEX.md` · ADR-001 (5-layer architecture) · ADR-002 (multi-LLM gateway) · ADR-003 (cite-or-fallback)

## 05-design/
- `design-system/` — `DESIGN-PRINCIPLES.md` (8 principles) · `DESIGN-TOKENS.md` (color · type · spacing canon)
- `flows/` — `USER-FLOWS.md` (10 key journeys)
- `wireframes/` — `COMPONENT-INVENTORY.md`
- `accessibility/` — `ACCESSIBILITY.md` (WCAG 2.2 AA)

## 06-modules/
Per-module deep specs (URS · DESIGN · ARCHITECTURE · STORYBOOK per module).
- `_module-template/` — canonical scaffold (copy for new modules)
- `audit-management/` — ✅ filled · also has `UNS.md` (150 user needs) · `URS.xlsx`
- `capa/` · `deviation/` · `change-control/` · `document-control/` · `training/` · `risk-management/` · `supplier-prequalification/` · `equipment-management/` · `complaint-management/` · `batch-records/` · `design-control/` · `management-review/` · `marketplace/` · `askhawk/` — placeholders
- See [PROJECT-STATE.md §3](./PROJECT-STATE.md) for the 15 default modules and code-key mapping.

## 07-operations/
- `runbooks/` — `OPERATIONS-CHARTER.md` · `RUNBOOK-TEMPLATE.md`
- `on-call/` — rotation · paging · escalation
- `incident-response/` — IR playbooks · post-mortems
- `disaster-recovery/` — DR plan · RTO/RPO · drills

## 08-compliance-regulatory/
- `GAMP-CAT-4-COMPLIANCE.md` — **canonical 25-page reference**
- `frameworks/` — `PART-11.md` · `EU-GMP.md` · `ICH-Q-SERIES.md` · `ISO-9001.md`
- `validation/` — `DESIGN-AND-DEVELOPMENT-PLAN.md` (GAMP Cat 4 · 820.30 · IEC 62304 · Part 11) · `AI-VALIDATION-PLAN.md` (false-negatives · black-box · GMLP/Annex 22) · `DESIGN-CONTROL-SUMMARY-REPORT.md` (IP-safe, auditor-facing DCSR) · CSV/CSA · IQ/OQ/PQ · VSR
- `sdlc/` — `SDLC-PROCESS-AND-DOCUMENTATION-STANDARD.md` (controlled SDLC for SOX ITGC · SOC 1/2 · GAMP/CSA · Part 11; per-step input→output document map)
- `qms/` — `QUALITY-MANUAL.md` (apex QMS doc · ISO 9001 · roles/org) · `QMS-READINESS-GAP-ANALYSIS-AND-PLAN.md` (advisor-session gap analysis → owned, phased plan to a v1.0-credible QMS)
- `data-integrity/` — ALCOA+ controls · audit-trail design
- `platform-controls/` — `PLATFORM-CONTROLS.md` (S.M.A.R.T. Hawk control matrix)

## 09-sales-marketing/
- `pitch-materials/` — `GAMP-CAT-4-BRIEF.md` (customer 8-page summary) · `CFO-DECK.md` · `CTO-DECK.md` · `QA-HEAD-DECK.md` · `POC-PROPOSAL.md` · `POC-PITCH-DECK.md` · `POC-IMPLEMENTATION-PLAN.md` · `POC-AGREEMENT.md` · `SALES-PLAYBOOK.md`
- `demo-scripts/` — `DEMO-INDEX.md`
- `content/` — `CONTENT-STRATEGY.md`
- `case-studies/` — (empty · post-customer)
- `customer-pitches/` — per-prospect tailored (none committed yet)

## 10-customer-success/
- `onboarding-guides/` — `CUSTOMER-ONBOARDING.md` (paid-customer Day-0 to Day-30; renamed from ONBOARDING.md 2026-06-11)
- `user-manuals/` — role-based user manuals
- `training-materials/` — videos · tutorials · certification paths
- `support-runbooks/` — `SUPPORT-MODEL.md`
- `customer-accounts/` — **per-customer engagement records · gitignored from public repo**
  - `sanpras-healthcare/` — Sanpras profile · demo playbook · POC proposal (customer + sales versions)

## 11-research-domain/
- `industry-research/` — `RESEARCH-INDEX.md`
- `pharma-domain/` — SOPs · regulatory specifics · audit playbooks
- `competitive-intelligence/` — competitor analysis · win/loss
- `kb-content/` — AskHawk KB source material (regulatory corpus · SOP templates · workflow playbooks)

## 12-legal/
- `customer-contracts/` — MSA · SOW · DPA templates
- `employee-contracts/` — offer letters · IP assignment · NDA
- `ip-and-trademarks/` — patent strategy · trademark registry
- `data-protection/` — GDPR · DPDP · HIPAA mapping

## from Web/Doc_V2_from_Web/
Bundle delivered by web-Claude sessions through 11 June 2026. Treat as **canonical artifacts** for the topics they cover; reconciled with rest of Doc_V2 per PROJECT-STATE.md.
- `01_canon/MASTER-REFERENCE.pdf` (30 pp) — definitive document; send to anyone wanting "everything"
- `02_strategy_and_pitch/` — pitch-deck-angel-round.pdf (12 slides) · founder-memo-2pp.pdf · management-product-brochure-v2-LATEST.pdf · technical-user-deck.pdf
- `04_specs_and_research/` — URS-v1.0-DRAFT · audit-management-module-spec · pillars-architecture-VERIFIED · industry study · sector-market-analysis · quality-software research paper
- `05_financials/` — **cost-model.xlsx** (78 inputs · 300 formulas · the unit-economics spine) · cost-model-companion.pdf · business-and-funding-plan.pdf (11 pp)
- `06_diagrams/` — pillars-asbuilt · sector-rings · audit-lifecycle · audit-admin-map · audit-data-model · 6 module-pillars walkthroughs · 6 v2 management visuals (PNG + SVG)
- `07_cleanup_tools/` — earlier cleanup artifacts (gitignored)

## _assets/
- `hero-svgs/` — original S.M.A.R.T. Hawk SVG artwork

## _archive/
Anything moved aside. Currently empty.

## _scripts/
- `render-docs.mjs` — Markdown → HTML + PDF rendering pipeline · run via `node _scripts/render-docs.mjs "<path>"`

---

## How this folder grows

| Adding a new doc? | Do this |
|---|---|
| Cross-cutting strategic doc | Put in `01-strategy/<sub>/` · add to PROJECT-STATE.md §5 if canonical |
| Engineering reference | Put in `04-engineering/<sub>/` · add an ADR if architectural |
| Customer-facing artifact | Put in `09-sales-marketing/pitch-materials/` or `10-customer-success/customer-accounts/<customer>/` (gitignored) |
| Module-specific | Put in `06-modules/<module>/` per the template structure |
| Compliance reference | Put in `08-compliance-regulatory/` |
| Operational runbook | Put in `07-operations/<sub>/` |
| Customer onboarding | Put in `10-customer-success/onboarding-guides/` |

If you don't know where it goes, **default to `00-company/`** as a holding area and Claude can move it later.

---

## See also

- [PROJECT-STATE.md](./PROJECT-STATE.md) — current corrected state · open items · canonical doc registry
- [WORKFLOW.md](./WORKFLOW.md) — mobile + desktop operating rules
- [README.md](./README.md) — repo intro

---

*Doc_V2 · INDEX · regenerated 2026-06-11*
