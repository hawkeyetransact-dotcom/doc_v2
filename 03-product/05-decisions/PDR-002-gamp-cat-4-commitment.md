# PDR-002 — GAMP Category 4 Classification as a Product Commitment

| Field | Value |
|---|---|
| Status | **Accepted** — 2026-06-05 |
| Owner | Product · Founders · Compliance |
| Approver | Founder Lead |
| Supersedes | n/a |
| Superseded by | n/a |
| Pairs with | [GAMP-CAT-4-COMPLIANCE.md](../../08-compliance-regulatory/GAMP-CAT-4-COMPLIANCE.md) · [GAMP-CAT-4-BRIEF.md](../../09-sales-marketing/pitch-materials/GAMP-CAT-4-BRIEF.md) |

---

## 1. Context

ISPE GAMP 5 (2nd Edition, July 2022) classifies pharma software into five categories. Cat 3 = non-configured COTS; Cat 4 = configured products (EQMS, ERP, LIMS, EDMS); Cat 5 = custom/bespoke. The customer's validation burden depends directly on this classification — Cat 5 requires full SDLC + source-code review; Cat 4 leverages vendor SDLC evidence under the supplier-leverage clause.

User research (RESEARCH-FINDINGS Insight 3) shows that **GAMP categorization is the procurement gate** at most customer organizations. The IT Compliance team will not start vendor evaluation until "what GAMP category are they?" is answered.

This PDR formalizes the product commitment that S.M.A.R.T. Hawk is — and will remain — a GAMP 5 Category 4 product, with all the consequences that follow.

## 2. Decision

> 📜 **S.M.A.R.T. Hawk is a GAMP 5 Category 4 — Configured Product.** This is a load-bearing product commitment that shapes architecture, customization policy, vendor SDLC evidence production, change management, and customer-facing documentation. Customer-requested modifications that would push a workflow to Cat 5 (custom code outside S.M.A.R.T. Hawk's configuration surface) trigger a separate customization engagement and are explicitly out of standard Cat 4 scope.

## 3. Alternatives considered

### Option A: Stay silent on GAMP category
- **Pros:** No commitment to live up to
- **Cons:** **Fails the procurement gate.** Cannot be evaluated by IT Compliance teams. Lost deals.

### Option B: Position as Cat 3 (simpler classification)
- **Pros:** Even less customer validation effort claimed
- **Cons:** **Inaccurate.** Every customer deployment requires meaningful configuration (vocabulary, workflows, role mapping, standards selection). Cat 3 is for genuinely non-configured products. Claiming Cat 3 falsely would fail the first supplier audit.

### Option C: Position as Cat 5 (custom)
- **Pros:** Allows aggressive per-customer customization
- **Cons:** **~60% MORE customer validation effort** (full SDLC + source review + V-model). Eliminates the Validation Accelerator Package leverage story. Pricing model breaks (custom-priced engagements vs predictable SaaS ACV).

### Option D: Selected — Cat 4 with formal commitment
- **Pros:** Accurate; matches peer products (Veeva Vault QMS, MasterControl, TrackWise, ETQ); enables Validation Accelerator Package; ~60% customer validation effort savings is the value pitch
- **Cons:** Commits S.M.A.R.T. Hawk to maintaining vendor SDLC evidence at Cat 4 standards forever; constrains customization policy (Configuration vs Customization rule book — see [GAMP-CAT-4-COMPLIANCE.md §3](../../08-compliance-regulatory/GAMP-CAT-4-COMPLIANCE.md))

## 4. Rationale

| Criterion | Verdict |
|---|---|
| Accuracy vs the actual product | Cat 4 is correct — every deployment requires configuration but no source-code modification |
| Procurement-gate fit | Cat 4 is the answer customer IT Compliance teams expect |
| Industry peer alignment | All comparable EQMS products (Veeva, MasterControl, TrackWise, ETQ) are Cat 4 |
| Validation effort story | Cat 4 enables the ~60% effort-reduction value prop (vs Cat 5) |
| Operational sustainability | We can maintain Cat 4 evidence with our engineering practices |
| Customization flexibility | We accept the Cat 4 constraint: no per-customer code modifications |
| Pricing model | Cat 4 supports the per-site + per-user + AI credits SaaS pricing model |

## 5. Consequences

### Positive
- We pass the procurement gate at IT Compliance teams.
- We can ship the Validation Accelerator Package as a competitive differentiator (saves customer ₹30–120L on validation).
- All product-level evidence (Vendor QM, SDLC, IQ/OQ, security testing, VAQ) becomes a standard deliverable, not an upsell.
- We compete head-to-head with Veeva/MasterControl on category, not on price-cuts.
- Customer change-control integration is straightforward (release classification → re-validation decision matrix).

### Negative
- We cannot accept customer-paid customization that requires S.M.A.R.T. Hawk source-code modification (would push that workflow to Cat 5 for them and create maintenance burden for us).
- Engineering must maintain Cat 4 SDLC discipline forever: peer review · automated testing · security scanning · release classification · documentation.
- Annual external pentest is mandatory (cannot defer to cut cost).
- Vendor Quality Manual must be maintained and reviewed annually.
- New engineer onboarding must include Cat 4 + Part 11 + Annex 11 + ALCOA+ basics.

### Customer-facing
- Every customer receives the Validation Accelerator Package at PoC kickoff or contract signing — no upsell.
- Annual right-to-audit is contractual (DPA + this commitment).
- Configuration vs Customization rule book is published ([GAMP-CAT-4-COMPLIANCE.md §3](../../08-compliance-regulatory/GAMP-CAT-4-COMPLIANCE.md)).
- Periodic Vendor Audit Pack maintained annually for the customer's auditor.

## 6. Compliance + commercial implications

| Area | Impact |
|---|---|
| [GAMP-CAT-4-COMPLIANCE.md](../../08-compliance-regulatory/GAMP-CAT-4-COMPLIANCE.md) | The canonical ~25-page Cat 4 reference document is the operational expression of this PDR |
| [GAMP-CAT-4-BRIEF.md](../../09-sales-marketing/pitch-materials/GAMP-CAT-4-BRIEF.md) | Customer-facing 8-page summary bundled with PoC package |
| [PART-11.md](../../08-compliance-regulatory/frameworks/PART-11.md) | Part 11 compliance evidence is part of the Cat 4 validation deliverables |
| [PLATFORM-CONTROLS.md](../../08-compliance-regulatory/platform-controls/PLATFORM-CONTROLS.md) | Control matrix maps to Cat 4 evidence |
| [POC-PROPOSAL.md §5.1](../../09-sales-marketing/pitch-materials/POC-PROPOSAL.md) | GAMP Cat 4 framing in every customer proposal |
| All pitch decks | "GAMP 5 Cat 4 configured product" appears as value prop #2 |
| Engineering SDLC | Cannot relax peer-review, testing, or security-scanning practices |
| Customer contracts | Annual right-to-audit clause becomes standard |

## 7. When to revisit

| Signal | Action |
|---|---|
| ISPE issues GAMP 6 (or a major revision) | Re-classify per the new framework; re-issue [GAMP-CAT-4-COMPLIANCE.md](../../08-compliance-regulatory/GAMP-CAT-4-COMPLIANCE.md) |
| FDA CSA evolves to a category-agnostic framework | Re-examine whether GAMP classification remains the procurement gate |
| 3+ customers ask for Cat 5 per-customer customization that we cannot meet within Cat 4 boundaries | Reopen — consider whether to create a separate Cat 5 product line or decline the segment |
| Internal audit finds we are NOT maintaining Cat 4 SDLC discipline | Reopen — either restore discipline or relinquish the claim |
| Reaching 100 paid customers — re-examine whether vendor SDLC evidence package needs to scale | Standard review |

## 8. References

- ISPE *GAMP 5 Guide, 2nd Edition* (Jul 2022)
- FDA *Computer Software Assurance for Production and Quality System Software* — Final Guidance (Sep 2025; re-issued Feb 2026)
- ISPE Pharmaceutical Engineering (Jan–Feb 2023) — GAMP 5 2nd Edition overview
- Discovery interviews (RESEARCH-FINDINGS Insight 3) — GAMP classification is the procurement gate
- Competitor analysis: Veeva Vault QMS, MasterControl, TrackWise, ETQ — all confirmed Cat 4
- [GAMP-CAT-4-COMPLIANCE.md](../../08-compliance-regulatory/GAMP-CAT-4-COMPLIANCE.md)

---

*Doc_V2 · Product Decision Record · PDR-002 · Accepted 2026-06-05*
