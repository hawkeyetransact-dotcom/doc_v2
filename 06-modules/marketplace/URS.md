# URS — Marketplace

| Field | Value |
|---|---|
| Module | Marketplace (v2 — two-sided: auditors + suppliers) |
| Owner | Product (S.M.A.R.T. Hawk Platform) |
| Status | **PLAN STAGE** — design + partial backend scaffolding; most features TBD |
| Version | 0.1 |
| Last updated | 2026-06-01 |
| Regulatory anchors | Limited direct regulatory anchor. Supplier listings reference **ICH Q7 §16** (contract mfg); commercial terms reference platform MSA |
| Source | `backend/docs/marketplace-v2/IMPLEMENTATION_PLAN.md`; `backend/src/{models/orgDiscoveryModels,routes/marketplaceCatalog*,app/(console)/supplier-marketplace}` (partial scaffolding) |

> ⚠️ **Major scope honesty.** Marketplace is the youngest module. Backend scaffolding exists for catalog + org-discovery; most differentiator features (auditor matching algorithm, network economics, cross-buyer sharing) are **plan-stage**. Expect ⏳ TBD markers throughout.

---

## 1. Purpose and Scope

**Purpose.** S.M.A.R.T. Hawk Marketplace is a **two-sided platform** connecting:
- **Buyers** seeking qualified **auditors** (engagement-based; pay-per-audit) and/or **suppliers** (directory-based discovery)
- **Auditors** offering services (listing fee or transaction fee on engagement)
- **Suppliers** (prequalified via S.M.A.R.T. Hawk) appearing in a discoverable directory (free listing; premium tier planned)

**In scope (planned):**
- Auditor side: profile, credential verification, availability, listings, booking, reviews
- Supplier side: directory listing (auto-populated from Supplier Prequalification), capability search, geography filter
- Marketplace transactions (auditor engagement contracts via platform MSA)
- Reviews + ratings for both sides
- Recommendation engine ("auditors others used", "similar suppliers")
- Network economics (planned post-Series-A): matching fees, premium tier, cross-buyer audit sharing

**In scope (live today, partial):**
- Catalog v2 backend models (`productCatalogV2Models`) — scaffolded
- Buyer-side supplier discovery page (`/supplier-marketplace`) — basic
- Org directory + engagement layer (`orgDirectoryRoutes`, `engagementRoutes`) — additive

**Out of scope:**
- Supplier prequalification scoring → Supplier Prequalification module
- Auditor qualification (credentials, COI) → Auditor Affiliation (separate)
- Audit execution → Audit Management module
- Payment processing (planned via Stripe Connect; not built)
- Tax / VAT handling per geography (TBD)
- Dispute resolution workflow (TBD)

---

## 2. Stakeholders and Personas

| Persona | Role | Goals | Pain without module |
|---|---|---|---|
| **Buyer / Audit Program Manager** (e.g., Priya Nair) | Discovers + books auditors; browses suppliers | Find the right auditor fast; pre-vetted; transparent reviews | Email networks; reputation by word of mouth |
| **Auditor (third-party)** (e.g., Maria Santos) | Lists services; manages availability; receives engagements | Steady deal flow; visibility; reputation | Cold outreach; underutilized capacity |
| **Supplier QA Head** (e.g., Asha Sharma) | Manages directory listing; opt-in to discovery | Visibility to potential buyers without bespoke marketing | Marketing in trade pubs / conferences |
| **Marketplace Admin** (platform side) | Vets auditors; resolves disputes; manages listings | Quality control; trust + safety | n/a (platform role) |
| **Tenant Admin** (buyer side) | Configures discovery rules, default filters | Per-tenant defaults | Vendor controls |

---

## 3. Part A — Foundational Requirements

> 💡 Many Part A items are scaffolded but not full-stack live; we mark **⏳ Plan** vs **⚠️ Partial** vs **✅ Live** honestly.

### A1. Auditor Profile Lifecycle

| ID | Requirement | Persona | Reg anchor | MoSCoW | State |
|---|---|---|---|---|---|
| URS-A-001 | Auditor SHALL create a marketplace profile (bio, qualifications, language, geography, service types, day rate). | Auditor | n/a | MUST | ⏳ Plan |
| URS-A-002 | System SHALL verify auditor credentials (ISO 19011 lead-auditor cert, industry certs) via document upload + admin review. | Marketplace Admin | n/a | MUST | ⏳ Plan |
| URS-A-003 | Auditor lifecycle: **PROFILE_CREATED → CREDENTIALS_VERIFIED → LISTED → BOOKED → SERVICE_DELIVERED → REVIEWED**. | System | n/a | MUST | ⏳ Plan |
| URS-A-004 | Auditor SHALL maintain availability calendar (reused from Audit Mgmt `AvailabilityBlock`). | Auditor | UX | MUST | ✅ AvailabilityBlock model exists in Audit Mgmt |
| URS-A-005 | Auditor SHALL declare COI (conflict of interest) with buyer tenants; COI'd auditors not surfaced in their searches. | Auditor | ICH Q7 §13.20 independence | MUST | ⚠️ Partial (Affiliation model exists; COI declaration field TBD) |

### A2. Supplier Directory

| ID | Requirement | Persona | Reg anchor | MoSCoW | State |
|---|---|---|---|---|---|
| URS-A-010 | Suppliers qualified via Supplier Prequalification module SHALL be eligible for public directory listing (opt-in). | Supplier | n/a | MUST | ⏳ Plan |
| URS-A-011 | Supplier directory listing SHALL include: legal name, country, sites, products, certifications, qualification tier (if buyer consents to share). | System | n/a | MUST | ⏳ Plan |
| URS-A-012 | Supplier SHALL control which fields are public vs private. | Supplier | privacy default | MUST | ⏳ Plan |
| URS-A-013 | Supplier lifecycle: **PROFILE → PUBLIC_DIRECTORY_LISTED → DISCOVERABLE**. | System | n/a | MUST | ⏳ Plan |

### A3. Buyer Discovery + Search

| ID | Requirement | Persona | Reg anchor | MoSCoW | State |
|---|---|---|---|---|---|
| URS-A-020 | Buyer SHALL search **auditors** by: qualification, language, geography, date availability, COI clearance, day-rate range. | Buyer | n/a | MUST | ⏳ Plan |
| URS-A-021 | Buyer SHALL search **suppliers** by: product (CAS, INN, name), capability, certification, geography, qualification tier (if accessible). | Buyer | n/a | MUST | ⚠️ Partial (`/supplier-marketplace` basic browse) |
| URS-A-022 | Search results SHALL support sort by relevance / rating / price / distance. | System | n/a | SHOULD | ⏳ Plan |
| URS-A-023 | Search SHALL be **persona-aware** — show fields relevant to the searching persona (e.g., regulatory affairs vs procurement). | System | UX | SHOULD | ⏳ Plan |

### A4. Auditor Engagement (Booking)

| ID | Requirement | Persona | Reg anchor | MoSCoW | State |
|---|---|---|---|---|---|
| URS-A-030 | Buyer SHALL request engagement with an auditor (scope, target dates, rate negotiation). | Buyer | n/a | MUST | ⏳ Plan |
| URS-A-031 | Auditor SHALL accept / decline / counter-propose. | Auditor | n/a | MUST | ⏳ Plan |
| URS-A-032 | On acceptance, system SHALL produce a Marketplace Engagement Contract (platform MSA + scope addendum) for both-party e-signature. | System | Commercial | MUST | ⏳ Plan |
| URS-A-033 | Signed engagement SHALL automatically create an Audit Request in Audit Management module with the auditor pre-assigned. | System | Cross-module | MUST | ⏳ Plan |

### A5. Reviews + Ratings

| ID | Requirement | Persona | Reg anchor | MoSCoW | State |
|---|---|---|---|---|---|
| URS-A-040 | Post-engagement, buyer SHALL leave a review for auditor (rating 1-5 + free-text); auditor SHALL leave a review for buyer (work environment, payment promptness, scope clarity). | Buyer + Auditor | UX trust | MUST | ⏳ Plan |
| URS-A-041 | Reviews SHALL be public on profiles (after a moderation period). | Marketplace Admin | UX trust | SHOULD | ⏳ Plan |
| URS-A-042 | Disputes (alleged unfair review) SHALL route to Marketplace Admin. | All | UX trust | MUST | ⏳ Plan |

### A6. Marketplace Admin Operations

| ID | Requirement | Persona | Reg anchor | MoSCoW | State |
|---|---|---|---|---|---|
| URS-A-050 | Marketplace Admin SHALL approve/reject auditor profiles after credential review. | Marketplace Admin | Trust + safety | MUST | ⏳ Plan |
| URS-A-051 | Marketplace Admin SHALL be able to delist an auditor or supplier for policy violation. | Marketplace Admin | Trust + safety | MUST | ⏳ Plan |
| URS-A-052 | Marketplace Admin SHALL view + moderate disputed reviews. | Marketplace Admin | Trust + safety | MUST | ⏳ Plan |
| URS-A-053 | All admin actions SHALL write AuditTrail rows. | System | 21 CFR Part 11 §11.10(e) | MUST | ✅ shared service available |

### A7. RBAC + Tenant Boundary

| ID | Requirement | Persona | Reg anchor | MoSCoW | State |
|---|---|---|---|---|---|
| URS-A-060 | Roles: buyer, auditor, supplier (listed), marketplace_admin, tenant_admin. | System | 21 CFR Part 11 §11.10(d) | MUST | ⏳ Plan |
| URS-A-061 | A buyer SHALL see only their own engagements + suppliers in their qualified directory + auditors visible to them. | System | Multi-tenant safety | MUST | ⏳ Plan |
| URS-A-062 | Marketplace_admin is **platform-scoped** (not tenant-scoped); operates across the entire marketplace. | System | n/a | MUST | ⏳ Plan |

---

## 4. Part B — Differentiator (White-Space) Requirements

> 💡 These are the moat. None are live today.

| ID | Requirement | Rationale | MoSCoW | State |
|---|---|---|---|---|
| URS-B-001 | **AI Auditor-Matching Algorithm** SHALL rank auditors for a given buyer request by qualification fit + availability + COI clearance + past-success-rate (Bayesian) + price. | Differentiator vs Qualifyze (basic matching only); enables cold-start | MUST (post-MVP) | ⏳ Plan |
| URS-B-002 | **AI Supplier Semantic Search** SHALL match natural-language buyer queries ("API supplier for cardiovascular generics, EU GMP, sub-$X/kg") to supplier listings via embeddings. | Differentiator over keyword filter | SHOULD | ⏳ Plan |
| URS-B-003 | **Recommendation Engine** ("auditors others used for similar audits") SHALL surface peer-buyer choices anonymized. | Network effect | SHOULD | ⏳ Plan |
| URS-B-004 | **Cross-Buyer Audit Sharing (with consent)** SHALL allow one buyer's audit report to be shared with another buyer (supplier-consented + revenue-shared) — reduces redundant audits. | Largest network economics lever | COULD (post-Series-A) | 🚫 Long-term plan |
| URS-B-005 | **Premium Supplier Discovery Tier** SHALL offer suppliers paid visibility boost + analytics dashboard. | Revenue stream | COULD | 🚫 Long-term plan |
| URS-B-006 | **Auditor Reputation Score** SHALL aggregate review ratings + on-time delivery + report quality (auditorCoach metrics from Audit module) into a public score. | Differentiator over star-ratings only | SHOULD | ⏳ Plan |
| URS-B-007 | **Two-sided cold-start solution** — S.M.A.R.T. Hawk SHALL seed the marketplace with: (a) auditors recruited from PoC partners; (b) suppliers auto-populated from Supplier Prequalification module qualified lists (opt-in). | Two-sided liquidity problem | MUST | ⏳ Plan |

---

## 5. Out-of-Scope

- **Auditor qualification logic** (credentials, COI declarations, qualification expiry) → Auditor Affiliation module
- **Supplier prequalification scoring** → Supplier Prequalification module (marketplace consumes the output)
- **Audit execution** → Audit Management module (marketplace creates the audit request, then hands off)
- **Payment processing + escrow** → planned Stripe Connect integration; not in current scope
- **Tax / VAT / invoicing** → TBD per geography
- **Dispute resolution beyond review moderation** → TBD
- **Procurement workflow** → external ERP

---

## 6. Assumptions and Dependencies

- **Two-sided liquidity assumption:** auditor side seeded from PoC; supplier side auto-populated from Prequal module qualified list (opt-in)
- **Identity unification:** an auditor's marketplace profile maps 1:1 to their User in Audit Mgmt (shared user identity); a supplier's listing maps 1:1 to their Supplier record in Prequal
- **Multi-tenant:** marketplace is **platform-scoped** but discovery is tenant-aware (buyer sees their own qualified suppliers + cross-buyer suppliers per consent + all listed auditors per COI)
- **AskHawk:** groundedGen pipeline available for matching + semantic search
- **Storage:** profile + credential files in HawkVault
- **Payments:** future Stripe Connect integration

---

## 7. Acceptance Criteria

> ⚠️ Acceptance criteria are aspirational — most features still ⏳ Plan.

| URS range | Verification |
|---|---|
| A1 (auditor profile lifecycle) | E2E `frontend/e2e/marketplace-auditor-profile.spec.ts` (TBD) |
| A2 (supplier directory) | Integration with Prequal opt-in flow |
| A3 (search) | Unit test on search service; UI snapshot |
| A4 (engagement) | E2E for booking → engagement contract → audit-request creation |
| A5 (reviews) | Moderation flow E2E |
| A6 (admin ops) | Admin console E2E |
| A7 (RBAC) | Cross-tenant guard tests |
| B1 (matching) | AI eval suite on canned buyer queries → ranked auditor list |
| B2 (semantic search) | Recall@K on canned supplier corpus |
| B7 (cold-start) | KPI: # auditors live at GTM; # suppliers opted-in by month 3 |

---

## 8. Open Questions

1. **MVP scope** — what's the smallest two-sided live experience that produces a useful demo? (Working hypothesis: 10 auditors + 50 suppliers + basic search + engagement booking)
2. **Auditor onboarding incentive** — list fee, transaction fee, or free during cold-start?
3. **Supplier consent model** — opt-in vs opt-out for directory listing? Granularity (which fields public)?
4. **Cross-buyer audit sharing (URS-B-004)** — revenue split between S.M.A.R.T. Hawk / original auditor / original buyer / supplier? Legal review needed.
5. **COI declaration depth** — self-declared vs verified (calls to disclose past engagements)?
6. **Geography expansion order** — start US / EU / India?
7. **Stripe Connect timing** — payments live at MVP, or post-MVP with manual invoicing?
8. **Dispute SLA** — Marketplace Admin response time for disputed reviews?
9. **Auditor Reputation Score formula** (URS-B-006) — what weights for review-rating vs on-time-delivery vs auditorCoach metrics?
10. **Two-sided cold-start economics** — chicken-and-egg; what's the bootstrap budget for auditor recruitment?
11. **Cross-module data leakage risk** — when a supplier is on a "qualified" list for buyer A, can buyer B see they are qualified anywhere? Consent UI design needed.
12. **Pricing for buyers** — flat marketplace fee vs per-booking commission?

---

## 9. Traceability Index (URS ↔ Code, mostly planned)

| URS section | Primary code (planned/scaffold) | Primary UI (planned/scaffold) |
|---|---|---|
| A1 auditor lifecycle | `services/marketplaceAuditorService.js` (⏳), reuses `AvailabilityBlock` model | `/marketplace/auditors/profile/[id]` (⏳) |
| A2 supplier directory | `services/marketplaceSupplierDirectoryService.js` (⏳), reads from Supplier Prequal | `/marketplace/suppliers/[id]` (⏳); `/supplier-marketplace` basic (⚠️ Partial) |
| A3 search | `services/marketplaceSearchService.js` (⏳) | `/marketplace/search` (⏳) |
| A4 engagement | `services/marketplaceEngagementService.js` (⏳), reuses `engagementRoutes` (⚠️ Partial) | `/marketplace/engagement/[id]` (⏳) |
| A5 reviews | `models/MarketplaceReview.js` (⏳) | review modal + profile review section (⏳) |
| A6 admin | `controllers/marketplaceAdminController.js` (⏳) | `/marketplace-admin/*` (⏳) |
| A7 RBAC | shared `permit()` middleware + new `canAccessMarketplace*()` guards (⏳) | role-gated routes |
| B1 matching | `services/ai/auditorMatchingAgent.js` (⏳, delegates to AskHawk groundedGen) | `MatchingResultsPanel` (⏳) |
| B2 semantic search | `services/ai/supplierSemanticSearchAgent.js` (⏳) | search bar enhanced (⏳) |
| B7 cold-start | seed scripts in `backend/scripts/seedMarketplace.js` (⏳) | demo data |

Backend scaffolding **does** exist for:
- Catalog v2 models (`backend/src/models/productCatalogV2Models.js`)
- Org directory + engagements (`orgDirectoryRoutes.js`, `engagementRoutes.js`)
- Basic supplier-marketplace browse (`frontend/app/(console)/supplier-marketplace/`)

See `backend/docs/marketplace-v2/IMPLEMENTATION_PLAN.md` for the full pre-code analysis.
