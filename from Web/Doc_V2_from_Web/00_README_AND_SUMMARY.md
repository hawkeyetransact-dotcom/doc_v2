# Hawkeye — Conversation Summary & Document Index (V2)

**Generated:** 11 June 2026
**For:** Local filing at `C:\Users\debab\Code - Hawkeye\hawkeye-clean\Doc_V2\from Web`
**By:** Claude.ai chat sessions (curated)

---

## 1. What this bundle is

This zip contains the **current, canonical** set of Hawkeye strategy, product, and financial documents produced across multiple Claude.ai chat sessions ending June 11, 2026. It is **not** every draft ever produced — many earlier iterations were superseded by later versions, and only the latest is included here.

**Total: 46 files, 19MB, organized in 7 numbered folders.**

The bundle is designed to drop straight into your `Doc_V2/from Web/` directory and reflects the structure recommended for that location. The numbered prefixes are intentional — they're the reading order.

---

## 2. How to use this folder

| If you need to… | Open this first |
|---|---|
| Understand everything in one document | `01_canon/MASTER-REFERENCE.pdf` |
| Pitch an angel investor (deck + email) | `02_strategy_and_pitch/pitch/pitch-deck-angel-round.pdf` + `02_.../memo/founder-memo-2pp.pdf` |
| Run a customer meeting (product brochure) | `02_strategy_and_pitch/brochures/management-product-brochure-v2-LATEST.pdf` |
| Run a technical/IT meeting | `02_strategy_and_pitch/brochures/technical-user-deck.pdf` |
| Defend unit economics to a CFO | `05_financials/cost-model.xlsx` + companion PDF |
| Show the financial plan + cap table | `05_financials/business-and-funding-plan.pdf` |
| Demonstrate the architecture (verified) | `04_specs_and_research/pillars-architecture-VERIFIED.pdf` |
| Clean up your local docs folder | `07_cleanup_tools/claude-code-prompt-for-local-cleanup.md` |

---

## 3. The conversation in one page

The work spans many sessions but lands on a coherent thesis. Here it is.

### Strategic reframe (this matters more than anything else)

**Hawkeye is NOT** a pharma EQMS that might eventually expand to other industries.

**Hawkeye IS** an **industry-agnostic, AI-native compliance engine for regulated supply chains** — and pharma is the *forcing function*, not the destination. Pharma produces the hardest regulatory bar (GxP, 21 CFR Part 11, ALCOA+, validated AI, on-prem sovereignty), which forces an architecture every other regulated supply chain (food, devices, automotive, aerospace, chemicals) can inherit by configuration.

**Seven elements regulated rigor forces structurally:**
1. ALCOA+ data integrity
2. 21 CFR Part 11 e-signatures
3. Append-only audit trail
4. Tamper-evident hashing (SHA-256 — NOT blockchain)
5. Validated AI + per-call reproducibility
6. Model sovereignty / on-prem capability (validation-gated)
7. Separation of duties + RBAC + validation posture

### What's actually built (code-verified)

- **170 Mongoose models** in `codex_backend_01` (public GitHub: `github.com/hawkeyetransact-dotcom/codex_backend_01`)
- **Two runtimes:** Python data-platform (crawlers, parsers, PDF extraction, entity resolution) FEEDS Node application
- **15 default modules:** AUDIT_MGMT, DOC_CONTROL, CAPA, CHANGE, EVENT, TRAINING, RISK, SUPPLIER_QUALITY, MGMT_REVIEW, ASSET, CHAIN_OF_CUSTODY, TRANSACTION_REVIEW, REGULATORY_INTEL, AI_ASSISTANT, RFQ_PROCUREMENT
- **Five-pillar architecture:** Collect → Process → Validate → Generate Report → Seal Record. Pillar 3 is `compliance/standardRegistryService` + `complianceEvaluationService` + `complianceRules.js`. Pillar 5 is `auditTrailService.js` + `buildSnapshotHash` (SHA-256).
- **Configuration layer:** `vocabularyService`, `universalModuleConfigService` (industryProfile='PHARMA_GMP'), `defaultStandards.js`, `modulePacks.js`, `WorkflowDefinitionService.js` — real, not vaporware
- **AI:** multi-LLM gateway (Anthropic/OpenAI/Gemini/local-vLLM), grounded generation, redaction, governance, 6 audit-agents, wave 2 (multi-step agent, custom tool-calling runtime — NOT MCP), wave 3 (on-prem LLM deploy with frozen `ONPREM_VALIDATION_REQUIREMENTS` IQ/OQ/PQ passThreshold 0.95)
- **SupplierRiskSnapshot:** 12-dimensional, fused continuously from public + internal data
- **Cross-module wiring:** `crossModuleService.js` makes deviations auto-create CAPAs, changes auto-assign training, audit findings flow into supplier scorecards

### Honest gaps (the things NOT yet true)

- **Pre-customer.** No paying pharma logo references yet. The platform is real; the commercial proof is being built.
- **"Immutable" = tamper-evident** (SHA-256 + append-only audit trail), NOT blockchain. Important distinction for any technical conversation.
- **Live shared-audit marketplace** is a THIN module — framework built, network liquidity is the roadmap bet.
- **On-prem LLM deployment** has real scaffold + validation requirements but is NOT yet proven end-to-end in production.
- **SOC 2** is in flight (target Q4 2026); not certified today.
- **Some modules are partial:** Training, complaint, management review are functional but less mature than the core EQMS modules. RFQ-procurement is THIN.

---

## 4. The fundraising thesis (current)

### The ask

- **Pre-seed / angel round: $1.2-1.5M** (revised down from the original $3M after building the proper business plan)
- **Use of funds (18 months):** 60-70% team build (10-15 FTE India), 10% AI infrastructure (~$115K for fine-tune compute + self-host), balance for cloud, compliance, marketing, ops
- **Path:** angel → seed at month 18 ($3-5M) → Series A at month 30-36 ($10-15M)
- **Cap table after Series A:** founders together hold ~47% (23.5% each from 50/50 start)

### Market

- **India pharma manufacturing units:** ~10,500 total, ~3,000 WHO-GMP certified
- **Reachable beachhead:** 200-300 Tier 2 mid-pharma + Tier 3 CDMO + WHO-GMP-certified accounts
- **3-year SOM India pharma alone:** $1.4-2.3M ARR ceiling at blended $9.5K ACV
- **Ring 1 expansion:** Food & Beverage (architecturally near-identical), cosmetics, devices, blood/tissue
- **Global ceiling:** $3-5B SAM (regulated mfg at our ACV tier)

### Unit economics (the corrected version)

The cost model showed prior documents understated cost-to-serve. The honest numbers:

| Customer size | Variable cost/yr | Full price ACV | Gross margin |
|---|---|---|---|
| Small (1 site, 5 users) | $1,011 | $4,500 | 77.5% |
| Medium (3 sites, 20 users) | $3,840 | $10,800 | 64.4% |
| Large (5 sites, 50 users) | $11,543 | $22,000 | 47.5% |

**Where the cost goes:** Support (47% of variable cost) + AI inference (27%) dominate. Cloud infra is < 10%. Self-hosted AI in Year 2+ is the single biggest cost-reduction lever (~40% off variable cost).

**Blended gross margin at scale (100+ customers):** ~60% — *not the "~80%" cited in earlier documents*. This needs updating across the pitch deck, business plan, and management deck.

### The Founding Customer offer

- **Year 1:** Software FREE; customer pays only implementation/config (~₹3-5L one-time)
- **Year 2+:** 50% of full software subscription + cost-of-serve passthrough (cloud + AI usage)
- **Sandbox:** lifetime access, separate from production, survives subscription end
- **Limit:** First 10 customers only, time-limited framing — so the discount is a program, not market price

**Reality check:** Year 1 is a LOSS of $1,311 (S) / $5,840 (M) / $17,043 (L) per customer once cost-of-serve is included. Frame it as "we absorb cost-to-serve as part of the program." Year 2+ rebuilds to 49-69% gross margin; payback 7-19 months by size.

---

## 5. File-by-file inventory

### `01_canon/`
**MASTER-REFERENCE.pdf** (30 pp, 2.7MB) — *The definitive document.* Nine parts: vision, industry-agnostic engine reframe, regulated-rigor architecture, pharma domain depth, market reckoning, pharma plug-in spec, GTM, URS, honesty register. If anyone asks for "everything you have," send this.

### `02_strategy_and_pitch/pitch/`
**pitch-deck-angel-round.pdf** (12 slides) — Angel-round pitch deck. ⚠ **NEEDS UPDATING:** currently asks $3M; the business plan now revises this to $1.5M. Same fix applies to unit economics claims ("80% margin" should be "60-78% by size").

### `02_strategy_and_pitch/memo/`
**founder-memo-2pp.pdf** (2 pp) — Email companion to the pitch deck. Founder-voice. Reads like a real person wrote it, not a deck.

### `02_strategy_and_pitch/brochures/`
- **management-product-brochure-v2-LATEST.pdf** (9 pp, 1.1MB) — *Latest, post-feedback rebuild.* Mobile-readable typography, six custom-generated infographics, quantitative value props with dual sourcing (industry benchmark + Hawkeye-modeled), NO commercials. Use this for management/exec conversations.
- **technical-user-deck.pdf** (11 slides) — Technical deck for QA/IT/CSV teams. No pricing. Pure product/architecture.
- **_archive_management-deck-v1.pdf** — Previous management deck. Kept because it has the Founding Customer offer details now removed from v2; useful as reference. Don't send.

### `03_proposals/`
**Currently empty** — the POC and Commercial proposals were drafted in conversation but not all rendered to files in time. See "Pending work" below.

### `04_specs_and_research/`
- **pillars-architecture-VERIFIED.pdf** (8 pp, 1.3MB) — Verified-against-code architecture document. The most defensible single thing we have for a technical due-diligence conversation.
- **URS-v1.0-DRAFT.pdf** (8 pp) — User Requirements Specification, Part A (foundational) + Part B (white-space).
- **audit-management-module-spec.pdf** (10 pp) — Detailed module spec for audit management.
- **quality-software-research-paper.pdf + .md** (4 pp) — Vendor-neutral industry research paper. Markdown source included for editing.
- **eqms-supplier-audit-industry-study.pdf** (8 pp) — Industry study with current SaaS landscape and six white spaces identified.
- **sector-market-analysis.pdf** (8 pp) — Per-sector market analysis with rings diagram and expansion sequence. Includes the "horizontal trap" honest reckoning.

### `05_financials/`
- **cost-model.xlsx** — 6 sheets, 78 inputs, 300 formulas, zero errors. The unit-economics model. Edit blue cells; everything else recalculates. *Open `0_README` sheet first.*
- **cost-model-companion.pdf** (7 pp) — Narrative explanation of the model. The page-7 "honesty implications" table is where the corrections to prior documents are documented.
- **business-and-funding-plan.pdf** (11 pp) — Bottom-up market sizing, team build (Indian salary bands cited), native AI strategy (recommends fine-tune open-source over train-from-scratch), ROI-based pricing, 36-month financial model, two-round dilution to Series A.

### `06_diagrams/`
The full visual canon. PNG + SVG for each.
- **pillars-asbuilt** — verified five-pillar architecture diagram
- **sector-rings** — pharma core to outer rings (food, devices, automotive, aerospace)
- **module-pillars-audit/capa/change/deviation/doc/supplier** — five-pillar walkthrough per module
- **audit-lifecycle, audit-admin-map, audit-data-model** — audit module specifics
- **v2_management_visuals/** — six new infographics generated for the v2 management brochure: audit-time bar chart, CAPA cycle comparison, time-allocation donuts, digital-thread flow, supplier-risk radial, four-numbers value summary

### `07_cleanup_tools/`
- **hawkeye-chat-artifacts.zip** (6.9MB) — The earlier-built zip with 33 canonical files + MANIFEST.json, for merging into `backend/docs/` via the Claude Code prompt below
- **claude-code-prompt-for-local-cleanup.md** (166 lines) — Instructions for Claude Code to clean up your local `backend/docs/` folder hash-aware, with dry-run + safety rails. Use this if you want to consolidate older docs in `backend/docs/`.

---

## 6. Important corrections to prior documents

Several earlier-built documents contain claims that the cost model later showed were wrong or overstated. **Before sending any of these externally, fix:**

### Pitch deck
- ❌ "~$1,900 variable cost / customer / yr" → ✅ "$1-12K depending on size"
- ❌ "~80% gross margin" → ✅ "60-78% gross margin depending on customer size"
- ❌ "Raising $3M" → ✅ "Raising $1.5M (per business plan derivation)"

### Management deck (v1, archived)
- ❌ Founding Customer Year 1 framed as "implementation profit" → ✅ "We absorb cost-to-serve as part of the program; first 10 customers only" (the v2 brochure has this right)
- ❌ "4.5× ROI in 3-4 months" applies to *customer's* ROI on their savings, not the platform's margin — clarify which when speaking

### Business plan
- ❌ The "~$1,900 / 80%" reference numbers — the bottom-up TAM and team build are fine, but unit economics should be updated to the cost-model numbers

---

## 7. What's still pending (not in this bundle)

These were discussed and partially drafted in conversation but not rendered to files by the time of bundling:

1. **Executive POC Proposal v2** — rebuild in the new mobile-readable style. The v1 content was good; needs typography refresh.
2. **User POC Proposal v1** — entirely pending. The "deep version" with full feature list, per-process and per-role depth, full market matrix.
3. **Commercial Proposal v1** — entirely pending. ROI math from cost model, Founding Customer offer detail, payback, TCO comparison.
4. **Updated pitch deck** with corrected $1.5M ask and corrected margin language.
5. **Updated business plan** with corrected unit economics.
6. **Filled-in founder credentials.** Every doc has `[ Founder name ]` placeholders. *Most important thing to fix before sending anything externally.* Generic team slides kill pre-seed deals.

---

## 8. The honesty discipline (preserved throughout)

This phrase keeps coming up in the documents — it's the through-line:

- Tamper-evident, **NOT** blockchain
- Custom tool runtime, **NOT** MCP
- On-prem LLM "available, validation-gated, **NOT** proven e2e"
- Industry-agnostic *by design*, pharma proven, other verticals = config roadmap
- AI presence is table stakes — the edge is the *combination*
- Live shared-audit marketplace = roadmap bet, **NOT** built network
- Pre-customer status acknowledged in every document

This isn't humility for its own sake. It's that investors do diligence, customers run PoCs, and inspectors verify. Naming what's real vs roadmap *first* is what makes the rest of what's claimed defensible.

---

## 9. How this was produced

This documentation was generated across roughly 6-8 hours of work in Claude.ai chat sessions between May 7 and June 11, 2026. The codebase verification used the public repositories `codex_backend_01` and `codex_frontend_01` cloned from `github.com/hawkeyetransact-dotcom/`. Industry benchmarks were web-searched in real-time and cited where used. Financial assumptions in the cost model come from public AWS Mumbai pricing (April 2026), published Anthropic/OpenAI/Gemini rates, 2026 India SaaS engineering salary benchmarks (Scaler, Glassdoor, ClarUP), and standard SaaS industry support-load assumptions.

Every number in this bundle is auditable. Every claim is sourced. Every limitation is named.

---

*End of summary. Read the master reference document next, then the cost model, then everything else as needed.*
