# URS — Supplier Prequalification

| Field | Value |
|---|---|
| Module | Supplier Prequalification |
| Owner | Product (Hawkeye Platform) |
| Status | DRAFT |
| Version | 0.1 |
| Last updated | 2026-06-01 |
| Regulatory anchors | **ICH Q7 §17** (agents, brokers, traders, distributors, repackers, relabellers), **EU GMP Ch.7** (outsourced activities), **ISO 9001 §8.4** (externally provided processes/products/services), **ISO 13485 §7.4.1** (purchasing process — med-device) |
| Source | `backend/src/{routes,controllers,services,models}/supplier*.js`, `prequal*.js`; `frontend/app/(console)/suppliers/` |

---

## 1. Purpose and Scope

**Purpose.** Hawkeye Supplier Prequalification onboards, evaluates, scores, and maintains the **Qualified Supplier List (QSL)** before any supplier can participate in audits, batches, or marketplace listings. It is the gatekeeper module — nothing flows downstream from an unqualified supplier.

**In scope:**
- Supplier nomination + initiation
- Structured data collection (regulatory certifications, manufacturing scope, financial/legal, ESG, sites + products)
- Desk review + (optional) on-site verification
- Risk-weighted scoring (geography + cert + history + product class)
- E-sig approval gate to QUALIFIED status
- Periodic requalification (annual default; configurable)
- Disqualification + reactivation flows
- Supplier-product + supplier-site association

**Out of scope (handed off):**
- Supplier audits (post-qualification) → Audit Management module
- Supplier marketplace listings → Marketplace module
- CAPA execution for supplier issues → CAPA module
- Procurement / PO workflow → not in Hawkeye scope (read-only via ERP integration future)
- Quality agreement document storage → Document Control (HawkVault)

---

## 2. Stakeholders and Personas

| Persona | Role | Goals | Pain without module |
|---|---|---|---|
| **Procurement Officer** (e.g., Karan Mehta) | Nominates new supplier; needs them qualified to issue PO | Fast turnaround; visibility into qualification status | Email chains; "where is this stuck?" |
| **QA Prequalification Specialist** (e.g., Anita Desai) | Owns the prequal case; collects data; conducts desk review; recommends decision | Single workspace; templated data collection; consistent scoring | Spreadsheets per supplier; lost evidence |
| **Supplier QA Head** (provides info) (e.g., Asha Sharma) | Responds to prequalification questionnaire | Single inbox; structured submission; reuse across customers | Re-answers same questions for every buyer |
| **QA Approver / QA Head** (e.g., Dr Elena Vasquez) | Final e-sig approval to qualified status | Auditable decision record; risk-score transparency | "Why did we qualify them?" — no record |
| **Tenant Admin** | Configures questionnaire templates, scoring rubric, periodic-requal cadence | Per-tenant tuning | Vendor controls everything |

---

## 3. Part A — Foundational Requirements

### A1. Supplier Lifecycle

| ID | Requirement | Persona | Reg anchor | MoSCoW | State |
|---|---|---|---|---|---|
| URS-A-001 | Procurement SHALL nominate a supplier (legal name, country, product scope) creating a SupplierQualification case in NOMINATED state. | Procurement | ISO 9001 §8.4.1 | MUST | ✅ `POST /api/suppliers/nominate` |
| URS-A-002 | Each Supplier SHALL receive a stable `supplierId` (tenant-scoped); SupplierQualification cases SHALL receive a `qualificationId`. | System | 21 CFR Part 11 §11.10 | MUST | ✅ |
| URS-A-003 | System SHALL model lifecycle as 8 states: **NOMINATED → DATA_COLLECTION → DESK_REVIEW → ON_SITE_VISIT (optional) → SCORING → APPROVAL → APPROVED → PERIODIC_REQUAL (recurring) → DISQUALIFIED (terminal-recoverable)**. | System | ICH Q7 §17, ISO 13485 §7.4.1 | MUST | ✅ enum + service |
| URS-A-004 | Forward-only state transitions; reverts require tenant_admin + reason. | System | ALCOA+ | MUST | ✅ |
| URS-A-005 | Every transition SHALL write AuditTrail row. | System | 21 CFR Part 11 §11.10(e) | MUST | ✅ shared service |

### A2. Data Collection (Supplier-Side Submission)

| ID | Requirement | Persona | Reg anchor | MoSCoW | State |
|---|---|---|---|---|---|
| URS-A-010 | Supplier QA Head SHALL receive a Prequalification Questionnaire (PQQ) — sections: company info, certifications (ISO 9001, GMP, FDA registration), manufacturing sites, products, financial/legal, ESG, references. | Supplier | ICH Q7 §17.40, ISO 9001 §8.4.2 | MUST | ✅ PrequalQuestionnaire template + supplier portal |
| URS-A-011 | Supplier SHALL upload certifications + supporting docs (per question) with HawkVault storage + expiry tracking. | Supplier | EU GMP Ch.7 | MUST | ✅ HawkVault integration |
| URS-A-012 | Supplier SHALL be able to clone responses from a previous prequal (their own, with consent on cross-buyer reuse). | Supplier | UX accelerator | SHOULD | ⚠️ Same-buyer clone live; cross-buyer requires consent UI (URS-B-006) |
| URS-A-013 | System SHALL validate certificate authenticity (where machine-verifiable: FDA registration #, EMA EUDAMED, ISO cert via cert-body API). | System | ICH Q7 §17.40 | SHOULD | ⚠️ FDA registration lookup live; ISO cert-body APIs partial |

### A3. Desk Review + On-Site Visit

| ID | Requirement | Persona | Reg anchor | MoSCoW | State |
|---|---|---|---|---|---|
| URS-A-020 | QA Prequal Specialist SHALL review submitted data in a Desk Review workspace with per-section disposition (PASS / FAIL / NEEDS_INFO). | QA Prequal | ICH Q7 §17.42 | MUST | ✅ `/suppliers/[id]/desk-review` |
| URS-A-021 | System SHALL auto-determine On-Site Visit requirement based on: product class (sterile, cytotoxic, controlled substances), risk score, geography (high-risk countries). | System | ICH Q7 §17.42, EU GMP Ch.7 §7.14 | MUST | ✅ `siteVisitTriggerService` |
| URS-A-022 | When required, an Audit Request SHALL be created in the Audit Management module (cross-module link) for the on-site visit. | System | ICH Q7 §17.42 | MUST | ✅ cross-module hand-off |
| URS-A-023 | Desk review SHALL be lockable; subsequent changes require revert + reason. | System | ALCOA+ Original | MUST | ✅ |

### A4. Risk Scoring

| ID | Requirement | Persona | Reg anchor | MoSCoW | State |
|---|---|---|---|---|---|
| URS-A-030 | System SHALL compute a SupplierScore (0–100) from weighted factors: geography risk (15%), certifications (25%), audit history (20%), product criticality (20%), financial/legal (10%), ESG (10%). Weights configurable per tenant. | System | ICH Q7 §17.40 risk-based | MUST | ✅ `supplierScoreService` |
| URS-A-031 | System SHALL display sub-scores transparently (each factor contribution); no black-box. | System | UX trust | MUST | ✅ |
| URS-A-032 | Scoring tier SHALL map: 80-100 LOW risk (annual requal); 60-79 MEDIUM (semi-annual); 40-59 HIGH (quarterly); <40 BLOCK (cannot proceed to approval). | System | Internal policy + ICH Q7 risk-based | MUST | ✅ |

### A5. Approval Gate (E-Sig)

| ID | Requirement | Persona | Reg anchor | MoSCoW | State |
|---|---|---|---|---|---|
| URS-A-040 | QA Approver SHALL e-sign the qualification decision (APPROVED / REJECTED) with reasonForChange ≥10 chars. | QA Approver | 21 CFR Part 11 §11.50 | MUST | ✅ `POST /api/suppliers/:id/qualification/approve` |
| URS-A-041 | On APPROVED, the Supplier SHALL transition to QUALIFIED status and become eligible for Audit and Marketplace listing. | System | ICH Q7 §17.40 | MUST | ✅ |
| URS-A-042 | On REJECTED, the Supplier SHALL remain in DISQUALIFIED (or NOT_QUALIFIED) state with rejection rationale visible to Procurement. | System | UX honesty | MUST | ✅ |

### A6. Periodic Requalification

| ID | Requirement | Persona | Reg anchor | MoSCoW | State |
|---|---|---|---|---|---|
| URS-A-050 | System SHALL schedule periodic requalification based on risk tier (LOW=annual, MED=semi-annual, HIGH=quarterly). | System | ICH Q7 §17.40 ongoing | MUST | ✅ `requalScheduler` cron |
| URS-A-051 | System SHALL notify Supplier + QA Prequal Specialist 60/30/7 days before due. | System | UX baseline | MUST | ✅ NotificationOrchestrator |
| URS-A-052 | Overdue requal SHALL flag the supplier as AT_RISK and (configurably) block new POs / audits / marketplace bookings. | System | ISO 9001 §8.4.2 | MUST | ✅ |
| URS-A-053 | Requalification SHALL reuse last submission as baseline; supplier only updates changed fields + recerts. | Supplier | UX accelerator | SHOULD | ✅ |

### A7. Disqualification + Reactivation

| ID | Requirement | Persona | Reg anchor | MoSCoW | State |
|---|---|---|---|---|---|
| URS-A-060 | QA Approver SHALL disqualify a supplier with e-sig + rationale (e.g., recurring CAPA, cert lapse, regulatory action). | QA Approver | EU GMP Ch.7 §7.16 | MUST | ✅ `POST /qualification/disqualify` |
| URS-A-061 | Disqualified suppliers SHALL be flagged in all downstream views (Audit list, Marketplace, Procurement dropdowns). | System | Risk control | MUST | ✅ |
| URS-A-062 | A disqualified supplier MAY be reactivated via new prequalification case (no "undelete"). | System | Audit trail integrity | MUST | ✅ |

### A8. Supplier-Site + Supplier-Product Linkage

| ID | Requirement | Persona | Reg anchor | MoSCoW | State |
|---|---|---|---|---|---|
| URS-A-070 | Each Supplier SHALL have ≥1 SupplierSite with address, GPS, regulatory registrations per site. | System | ICH Q7 §17.40 site-level | MUST | ✅ |
| URS-A-071 | Each Supplier SHALL have a SupplierProduct list, each linked to one or more sites where it is manufactured. | System | ICH Q7 §17.40 product-level | MUST | ✅ |
| URS-A-072 | Qualification scope SHALL be **per (site, product)** — a supplier may be qualified for product A at site 1 but not site 2. | System | EU GMP Ch.7 | MUST | ✅ |

### A9. RBAC + Tenant Isolation

| ID | Requirement | Persona | Reg anchor | MoSCoW | State |
|---|---|---|---|---|---|
| URS-A-080 | System SHALL enforce role-based access; minimum roles: procurement, qa_prequal_specialist, qa_approver, supplier, supplierUser, tenant_admin. | System | 21 CFR Part 11 §11.10(d) | MUST | ✅ |
| URS-A-081 | A supplier SHALL only see their own prequal cases — no cross-buyer leak. | System | Multi-tenant safety | MUST | ✅ `canSupplierAccessPrequal()` guard |

---

## 4. Part B — Differentiator Requirements

| ID | Requirement | Rationale | MoSCoW | State |
|---|---|---|---|---|
| URS-B-001 | **supplierIntelAgent** SHALL fuse public regulator data (FDA Establishment Registration + Inspections + Warning Letters; EMA EudraGMDP; WHO-PQ) into a supplier risk dossier — auto-augmenting the score. | Reduces buyer effort; no incumbent does FDA+EMA+WHO fusion | MUST | ✅ live (`supplierIntelAgent.js`) |
| URS-B-002 | **One-Pass Supplier Profile (cross-buyer)** — a supplier completes the PQQ once; updates propagate to all consenting buyer tenants. Reduces supplier burden by 70%. | Supplier-side liquidity moat | SHOULD | ⏳ Same-buyer reuse live; cross-buyer requires consent UI |
| URS-B-003 | **AI cert-expiry watchdog** SHALL extract expiration dates from uploaded certs (OCR + LLM) and remind both parties at 90/60/30/7 days. | Prevents lapses; small but high-value | SHOULD | ⚠️ OCR pipeline partial |
| URS-B-004 | **Predictive supplier risk** model SHALL forecast 12-month failure probability from history + public signals; flag pre-emptively. | Differentiator; not in incumbents | COULD | 🚫 Not built |
| URS-B-005 | **Tier-1 / Tier-N supplier map** SHALL visualize multi-tier supply chain dependencies (your supplier's suppliers) for ESG / conflict-minerals / single-source risk. | Strategic risk feature | COULD | 🚫 Not built |
| URS-B-006 | **Cross-tenant findings surfacing (with consent)** — surface "another buyer found CAPA-relevant issue X at this supplier in last 12 months" — anonymized. | Network effects | COULD | ⏳ Deferred (consent UI) |
| URS-B-007 | **Industry-agnostic** — same engine SHALL serve pharma (ICH Q7), med-device (ISO 13485 §7.4.1), food (FSSC 22000 supplier control), auto (IATF 16949 §8.4) via configurable PQQ templates. | One platform, many verticals | MUST | ✅ template-driven |

---

## 5. Out-of-Scope

- **Supplier audits** → Audit Management module (qualified supplier becomes eligible for audit workflow)
- **Marketplace listings** → Marketplace module (qualified supplier becomes listable)
- **CAPA for supplier issues** → CAPA module (link from supplier record to CAPA)
- **Procurement / PO workflow** → external ERP (read-only ingestion future)
- **Quality agreement document signing** → Document Control workflow (supplier-prequal references the QA agreement docId)

---

## 6. Assumptions and Dependencies

- Multi-tenant: every Supplier scoped to `tenantOrgId` (the buyer); a supplier entity may exist across multiple buyer tenants
- Storage: certifications + supporting docs in HawkVault
- E-sig: password-based via shared `ElectronicSignature`
- Notification: email primary; in-app dashboard secondary
- AskHawk: groundedGen pipeline available for `supplierIntelAgent`
- Public-data sources: FDA, EMA, WHO-PQ APIs (rate-limited; cached)

---

## 7. Acceptance Criteria

| URS range | Verification |
|---|---|
| A1–A2 (lifecycle + data collection) | E2E `frontend/e2e/supplier-prequal.spec.ts` |
| A3 (desk review / on-site trigger) | Unit test on `siteVisitTriggerService`; integration with Audit module |
| A4 (scoring) | Unit test on `supplierScoreService` with canned input matrix |
| A5 (approval e-sig) | Backend test on signature ceremony |
| A6 (periodic requal) | Cron-trigger test + notification assertion |
| A7 (disqualification) | E2E asserting downstream block (audit + marketplace) |
| A8 (site/product linkage) | DB integrity test |
| B1 (supplierIntelAgent) | AI eval suite (recall on known regulatory actions) |
| B2 (cross-buyer reuse) | Consent flow E2E (TBD) |

---

## 8. Open Questions

1. **Cross-buyer reuse consent UI** (URS-B-002, URS-B-006) — supplier-side opt-in granularity (per-buyer? per-field? blanket?)
2. **Predictive risk model** (URS-B-004) — feature signals + training-data availability at our scale
3. **Tier-N map** (URS-B-005) — data sourcing strategy (self-reported vs public datasets)
4. **Score weights default** — current defaults are platform-set; should we ship vertical-pack presets (pharma vs med-device vs food)?
5. **Hard-block tier (<40)** — should it block approval or just warn? Current = hard block.
6. **Certificate OCR accuracy** (URS-B-003) — what's the acceptable false-negative rate before customer trust erodes?
7. **Disqualification appeals process** — UI for supplier to dispute? Today none.

---

## 9. Traceability Index (URS ↔ Code)

| URS section | Primary code | Primary UI |
|---|---|---|
| A1 lifecycle | `services/supplierQualificationService.js`, `constants/supplierStates.js` | `/suppliers`, `/suppliers/[id]` |
| A2 data collection | `controllers/prequalQuestionnaireController.js`, `models/PrequalQuestionnaire.js` | `/suppliers/[id]/pqq` (buyer view), `/supplier/prequal` (supplier portal) |
| A3 desk review | `controllers/deskReviewController.js`, `services/siteVisitTriggerService.js` | `/suppliers/[id]/desk-review` |
| A4 scoring | `services/supplierScoreService.js`, `models/SupplierScore.js` | `SupplierScorePanel` component |
| A5 approval | `controllers/qualificationApprovalController.js`, `middlewares/requireESignature.js` | `SignatureDialog` |
| A6 periodic requal | `cron/requalScheduler.js`, `NotificationOrchestratorService` | `/suppliers/requal-due` |
| A7 disqualification | `controllers/qualificationApprovalController.js` (disqualify path) | `/suppliers/[id]` action |
| A8 site/product | `models/{Supplier,SupplierSite,SupplierProduct,ProductSiteMapping}.js` | `/suppliers/[id]/sites`, `/products` |
| B1 supplierIntelAgent | `services/ai/supplierIntelAgent.js` (delegates to groundedGen) | `SupplierIntelPanel` component |
| B7 industry-agnostic | template registry in `constants/pqqTemplates.js` | template picker in tenant admin |
