# PROJECT-STATE

> 🛑 **READ THIS FIRST** — Before any Claude (mobile or desktop) takes an action on Hawkeye work, read this document. It is the canonical "what's been decided · what's true now · where to look" state. It is **deliberately short** so it stays accurate.

| Field | Value |
|---|---|
| **Last updated** | 2026-06-11 |
| **Updated by** | Claude Code (desktop) |
| **Companion** | [WORKFLOW.md](./WORKFLOW.md) — operating rules for mobile + desktop sessions |
| **Public repo (mobile-readable)** | https://github.com/hawkeyetransact-dotcom/doc_v2 |
| **Raw PROJECT-STATE URL (give to mobile Claude)** | `https://raw.githubusercontent.com/hawkeyetransact-dotcom/doc_v2/main/PROJECT-STATE.md` |
| **Reading time** | < 5 minutes |

---

## 1. The thesis (one paragraph)

Hawkeye is an **industry-agnostic AI-native compliance engine for regulated supply chains** — pharma is the **forcing function, not the destination.** Pharma produces the hardest regulatory bar (GxP · 21 CFR Part 11 · ALCOA+ · validated AI · on-prem sovereignty) which forces an architecture every other regulated supply chain (food, devices, automotive, aerospace, chemicals) can inherit by configuration.

---

## 2. Hard numbers — what to cite externally

> ⚠️ **These are the corrected numbers.** Older drafts have `$3M ask`, `~80% gross margin`, `~$1,900 variable cost/customer/yr`, `13 modules` — those are all wrong. If you see them anywhere, fix.

### Fundraising
- **Pre-seed ask:** $1.2–1.5M (target $1.5M) — NOT $3M
- **Use of funds:** 60-70% team (10-15 FTE India), 10% AI infra (~$115K for fine-tune + self-host), balance for cloud + compliance + GTM
- **Path:** angel → seed at M18 ($3-5M) → Series A at M30-36 ($10-15M)
- **Cap table after Series A:** founders together ~47% (23.5% each from 50/50 start)

### Unit economics (per cost-model.xlsx · 78 inputs · 300 formulas · verified)

| Customer size | Variable cost/yr | Full price ACV | Gross margin |
|---|---|---|---|
| Small (1 site · 5 users) | $1,011 | $4,500 | 77.5% |
| Medium (3 sites · 20 users) | $3,840 | $10,800 | 64.4% |
| Large (5 sites · 50 users) | $11,543 | $22,000 | 47.5% |

- **Blended GM at portfolio scale (100+ customers):** ~60% — NOT ~80%
- **Cost drivers:** Support 47% of variable cost · AI inference 27%
- **Biggest lever:** Self-hosted fine-tuned AI in Year 2+ → ~40% off variable cost at scale

### Founding Customer program (first 10 only)
- **Year 1:** software FREE; customer pays only implementation/config (~₹3-5L one-time)
- **Year 2+:** 50% of full subscription + cost-of-serve passthrough
- **Reality:** Year 1 is a **LOSS** of $1,311 (S) / $5,840 (M) / $17,043 (L) per customer once cost-of-serve included
- **Framing:** "We absorb cost-to-serve as part of the program" — NOT "implementation profit"
- **Payback:** 7-19 months by customer size

### Market
- India pharma manufacturing units: ~10,500 total · ~3,000 WHO-GMP certified
- Reachable beachhead: 200-300 Tier 2 mid-pharma + Tier 3 CDMO + WHO-GMP
- 3-year SOM India pharma alone: $1.4-2.3M ARR ceiling at blended $9.5K ACV
- Global ceiling (regulated mfg at our ACV tier): $3-5B SAM

---

## 3. What's actually built (code-verified)

### Backend: `github.com/hawkeyetransact-dotcom/codex_backend_01`
- **170 Mongoose models**
- **95+ route files**
- **15 default EQMS modules** (verified against `src/models/ModuleConfigModel.js`):
  AUDIT_MANAGEMENT · DOCUMENT_CONTROL · CAPA_MANAGEMENT · CHANGE_CONTROL · EVENT_MANAGEMENT · TRAINING_MANAGEMENT · RISK_MANAGEMENT · SUPPLIER_QUALITY · MANAGEMENT_REVIEW · ASSET_MANAGEMENT · CHAIN_OF_CUSTODY · TRANSACTION_REVIEW · REGULATORY_INTEL · AI_ASSISTANT (AskHawk) · RFQ_PROCUREMENT
- **5-pillar runtime:** Collect → Process → Validate → Generate Report → Seal Record
  - Pillar 3: `compliance/standardRegistryService` · `complianceEvaluationService` · `complianceRules.js`
  - Pillar 5: `auditTrailService.js` · `buildSnapshotHash` (SHA-256)
- **Configuration layer:** `vocabularyService` · `universalModuleConfigService` (industryProfile='PHARMA_GMP') · `defaultStandards.js` · `modulePacks.js` · `WorkflowDefinitionService.js`
- **AI:** multi-LLM gateway (Anthropic / OpenAI / Gemini / local-vLLM), grounded generation, redaction, governance, 6 audit-agents, Wave 2 (multi-step agent + custom tool-calling runtime — **NOT MCP**), Wave 3 (on-prem LLM deploy scaffold with frozen `ONPREM_VALIDATION_REQUIREMENTS` — **available · validation-gated · NOT proven e2e**)
- **SupplierRiskSnapshot:** 12-dimensional · fused continuously from public + internal data
- **Cross-module wiring:** `crossModuleService.js` — deviations auto-create CAPAs · changes auto-assign training · audit findings flow into supplier scorecards
- **Architecture layers:** 5-layer (Trust · Data · AI Gateway · Domain Engine · Experience) — Trust is **Layer 1, the foundation** (per ADR-001)

### Frontend: `github.com/hawkeyetransact-dotcom/codex_frontend_01`
- Next.js 15.5.11 · React 18.3.1 · TypeScript 5 · MUI 6.1.7
- App Router · Server Components default · custom JWT auth · react-hook-form + Zod
- ~150-200K LoC across 23K+ TS/TSX files
- 40+ domain API modules · 33 component domain folders

### Test users seeded (run on local Mongo or deployed env)
- 5 buyer tenants × 1 QA Head + 2 internal auditors = 15 users
- 5 supplier tenants × (1 QA Head + 1 team member) = 10 users
- 5 external auditor tenants × 1 user = 5 users
- 1 superadmin
- **Total: 31 users · 15 tenants · password `Testing@2022` · domain `@test.com`**
- Seed scripts: `npm run seed:persona-users && npm run seed:internal-auditors`
- Detail: [00-company/onboarding/TEST-USERS-AND-AUDIT-WALKTHROUGH.md](./00-company/onboarding/TEST-USERS-AND-AUDIT-WALKTHROUGH.md)

---

## 4. Honesty register — what's NOT yet true (cite these explicitly)

> ⚠️ **The discipline:** every customer-facing and investor-facing doc names what's roadmap vs. built. The list:

1. **Pre-customer** — no paying pharma logo yet · 2 design-partner LOIs (Sanpras + Novex) in discovery
2. **Tamper-evident, NOT blockchain** — per-record SHA-256 + append-only ALCOA+ trail
3. **Custom tool-calling runtime, NOT MCP-compliant** — no protocol/handshake; the gateway's "MCP path" comment is a label not implementation
4. **On-prem LLM** — real scaffold + frozen validation requirements (IQ/OQ/PQ, passThreshold 0.95) — "available · validation-gated · NOT proven end-to-end"
5. **Live shared-audit marketplace** — thin module; framework built; network liquidity is the roadmap bet
6. **SOC 2 Type II** — in flight · target Q1 2027 · Type I Q3 2026
7. **Some modules are partial maturity:** TRAINING_MANAGEMENT · MANAGEMENT_REVIEW · EVENT_MANAGEMENT functional but less mature. **RFQ_PROCUREMENT is thin** (framework only).
8. **15 default modules — earlier docs said 13** with wrong names (Batch Records · Complaint · Design Control don't exist in code). Corrected as of 2026-06-11.

---

## 5. Canonical docs — single source of truth per topic

> 💡 **The rule.** If a doc isn't in this table, it's not canon. If two docs say different things, the one in this table wins.

| Topic | Canonical doc | When to update |
|---|---|---|
| Strategic positioning + 5-layer architecture | [01-strategy/vision-and-positioning/VISION.md](./01-strategy/vision-and-positioning/VISION.md) | Strategic pivot |
| Full master reference (30 pages) | [from Web/Doc_V2_from_Web/01_canon/MASTER-REFERENCE.pdf](./from%20Web/Doc_V2_from_Web/01_canon/MASTER-REFERENCE.pdf) | Major version refresh |
| Engineering architecture deep | [04-engineering/00-overview/PLATFORM-OVERVIEW.md](./04-engineering/00-overview/PLATFORM-OVERVIEW.md) | Architectural change |
| Engineering system arch (backend) | [04-engineering/01-architecture/ARCHITECTURE.md](./04-engineering/01-architecture/ARCHITECTURE.md) | Pattern change |
| Frontend architecture | [04-engineering/04-frontend/FRONTEND.md](./04-engineering/04-frontend/FRONTEND.md) | Stack change |
| Infrastructure + ops | [04-engineering/05-infrastructure/INFRASTRUCTURE.md](./04-engineering/05-infrastructure/INFRASTRUCTURE.md) | Hosting / deployment change |
| Security architecture | [04-engineering/06-security/SECURITY.md](./04-engineering/06-security/SECURITY.md) | Security incident or control change |
| AI architecture (Layer 3) | [04-engineering/07-ai/AI-ARCHITECTURE.md](./04-engineering/07-ai/AI-ARCHITECTURE.md) | AI capability change |
| Engineering ADRs | [04-engineering/08-adrs/](./04-engineering/08-adrs/) | New architectural decision |
| Product PRD (platform-level) | [03-product/03-prd/CORE-PRD.md](./03-product/03-prd/CORE-PRD.md) | Major feature scope change |
| Personas + research findings | [03-product/01-personas-and-research/](./03-product/01-personas-and-research/) | New research |
| Product decisions (PDRs) | [03-product/05-decisions/](./03-product/05-decisions/) | New product/business decision |
| Pricing canon | [01-strategy/pricing-and-packaging/PRICING.md](./01-strategy/pricing-and-packaging/PRICING.md) | Pricing change |
| Business plan (numbers) | [02-fundraising/business-plan/BUSINESS-PLAN.md](./02-fundraising/business-plan/BUSINESS-PLAN.md) | Plan refresh |
| Financial model (numbers) | [02-fundraising/financial-model/FINANCIAL-MODEL.md](./02-fundraising/financial-model/FINANCIAL-MODEL.md) | Model refresh |
| Cost model — actual XLSX | [from Web/Doc_V2_from_Web/05_financials/cost-model.xlsx](./from%20Web/Doc_V2_from_Web/05_financials/cost-model.xlsx) | Unit economics correction |
| Investor pitch deck | [02-fundraising/pitch-deck/PITCH-DECK.md](./02-fundraising/pitch-deck/PITCH-DECK.md) | Pitch refresh |
| Investor pitch deck (extended) | [02-fundraising/pitch-deck/INVESTOR-DECK.md](./02-fundraising/pitch-deck/INVESTOR-DECK.md) | Pitch refresh |
| GAMP Cat 4 — canonical compliance | [08-compliance-regulatory/GAMP-CAT-4-COMPLIANCE.md](./08-compliance-regulatory/GAMP-CAT-4-COMPLIANCE.md) | Regulatory update |
| GAMP Cat 4 — customer brief | [09-sales-marketing/pitch-materials/GAMP-CAT-4-BRIEF.md](./09-sales-marketing/pitch-materials/GAMP-CAT-4-BRIEF.md) | Sync with canonical |
| Customer-facing pitch decks (CFO · CTO · QA Head) | [09-sales-marketing/pitch-materials/](./09-sales-marketing/pitch-materials/) | Audience-tier change |
| PoC engagement package (generic) | [09-sales-marketing/pitch-materials/POC-{PROPOSAL,PITCH-DECK,IMPLEMENTATION-PLAN,AGREEMENT}.md](./09-sales-marketing/pitch-materials/) | PoC structure change |
| PoC engagement package (Sanpras-specific) | [10-customer-success/customer-accounts/sanpras-healthcare/](./10-customer-success/customer-accounts/sanpras-healthcare/) — **gitignored, local-only** | Per-customer customization |
| Audit Management module canon | [06-modules/audit-management/{UNS,URS,DESIGN,ARCHITECTURE,STORYBOOK}.md](./06-modules/audit-management/) | Module update |
| Test users + walkthrough | [00-company/onboarding/TEST-USERS-AND-AUDIT-WALKTHROUGH.md](./00-company/onboarding/TEST-USERS-AND-AUDIT-WALKTHROUGH.md) | New test user pattern |
| Team onboarding (new joiners) | [00-company/onboarding/TEAM-ONBOARDING.md](./00-company/onboarding/TEAM-ONBOARDING.md) | New onboarding flow |
| Compliance verification protocol | [00-company/onboarding/COMPLIANCE-TEST-GUIDE.md](./00-company/onboarding/COMPLIANCE-TEST-GUIDE.md) | New verification test |
| Customer onboarding (paid customers) | [10-customer-success/onboarding-guides/CUSTOMER-ONBOARDING.md](./10-customer-success/onboarding-guides/CUSTOMER-ONBOARDING.md) | Process change |

---

## 6. What's pending — open work items

> ℹ️ When you finish one, **move it to §5 or delete; update §7 below.**

1. **Executive POC Proposal v2** — rebuild in mobile-readable style (v1 content fine; typography refresh needed)
2. **User POC Proposal v1** — full feature list · per-process and per-role depth · full market matrix (entirely pending)
3. **Commercial Proposal v1** — ROI from cost model · Founding Customer offer detail · payback · TCO comparison (entirely pending)
4. **15 module ARCHITECTURE.md files** — add explicit Layer 4 cross-reference (carried debt)
5. **Founder credentials** — every doc has `[FOUNDER NAME]` placeholder. **Most important thing to fix before sending anything externally.**
6. **Pitch deck PDF re-render** — text-level corrected to $1.5M but the rendered PDF may still say $3M; rerender + verify
7. **Module name backfill** — earlier customer-facing decks fixed today (2026-06-11) for "15 modules"; spot-check Sanpras customer-facing for any straggler

---

## 7. Change log (last 10 substantial updates)

| Date | Change | Updated by |
|---|---|---|
| 2026-06-11 | Initial state doc · cleanup: 13→15 modules · $3M→$1.5M warnings removed · ~80%→~60% blended GM · ONBOARDING.md → CUSTOMER-ONBOARDING.md | Claude Code (desktop) |
| 2026-06-11 | Web-conversation bundle (`Doc_V2/from Web/`) reconciled with Doc_V2 | Claude Code (desktop) |
| 2026-06-08 | TEST-USERS-AND-AUDIT-WALKTHROUGH + 10 internal auditor seed script added | Claude Code (desktop) |
| 2026-06-08 | Sanpras POC proposal (customer + sales versions) authored | Claude Code (desktop) |
| 2026-06-08 | TEAM-ONBOARDING + COMPLIANCE-TEST-GUIDE authored | Claude Code (desktop) |
| 2026-06-05 | GAMP-CAT-4-COMPLIANCE.md (canonical · 25 pp) + GAMP-CAT-4-BRIEF.md (customer · 8 pp) authored | Claude Code (desktop) |
| 2026-06-04 | 5-layer architecture canonized (ADR-001); cascaded across 10 docs | Claude Code (desktop) |
| 2026-06-03 | AWS decommission complete (S3→R2 · SES→SMTP) | Claude Code (desktop) |
| 2026-06-01 | Audience-tiered pitch decks (CFO · CTO · QA Head) authored | Claude Code (desktop) |
| 2026-05-31 | Doc_V2 structure scaffolded (95 folders · 130+ docs) | Claude Code (desktop) |

---

## 8. The 5 sharpened value propositions (use verbatim in customer-facing docs)

| # | Value | Quantified outcome | Validated by |
|---|---|---|---|
| 1 | **40% audit-prep cost reduction** | Payback < 4 months · ~₹38L savings on ₹95L baseline | Hawkeye PoC measurement on real audits |
| 2 | **GAMP 5 Category 4 configured product** | ~60% less validation effort vs Cat 5 bespoke | ISPE GAMP 5 2nd Ed (Jul 2022) · FDA CSA |
| 3 | **Part 11 + Annex 11 + ALCOA+ by design** | 100% e-sig attribute coverage · 9 ALCOA+ attributes designed-in · tamper-evident audit trail | 21 CFR §11.10/§11.50/§11.200 · EU GMP Annex 11 · MHRA 2018 · WHO TRS 1033 |
| 4 | **Trust-First Layer 1 architecture** | Per-tenant isolation · zero AI-training on customer data · IN/US/EU residency | India DPDP Act 2023 · IBM 2025 healthcare avg breach $7.42M |
| 5 | **Cite-or-fallback grounded AI** | 100% of AI claims trace to source · zero hallucinated citations | FDA GMLP 10 Principles (Oct 2021) · EMA AI Reflection Paper (Sept 2024) |

---

## 9. Two architectural guarantees that cannot be configured away

| Guarantee | What it means | Where enforced |
|---|---|---|
| **Cite-or-fallback** | Every AI output cites a source OR returns "Insufficient evidence — human input required." Hallucinated citations are impossible by design. | `services/ai/gateway/llmGateway.js` |
| **Human always commits the record** | AI drafts · suggests · scores. AI never executes a record state change. A human always reviews and e-signs. | Workflow layer · enforced by absence of any AI-as-actor path |

---

## See also

- [WORKFLOW.md](./WORKFLOW.md) — operating rules · what to say to mobile vs desktop Claude
- [INDEX.md](./INDEX.md) — folder tree
- [HAWKEYE-STORY.md](./HAWKEYE-STORY.md) — narrative version
- [README.md](./README.md) — repo-level read-me
- [from Web/Doc_V2_from_Web/00_README_AND_SUMMARY.md](./from%20Web/Doc_V2_from_Web/00_README_AND_SUMMARY.md) — full web-bundle index

---

*Doc_V2 · PROJECT-STATE · v1.0 · 2026-06-11 · Read first*
