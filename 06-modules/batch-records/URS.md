# URS — Batch Records

| Field | Value |
|---|---|
| Module | Batch Records (Pharma Manufacturing) |
| Owner | Product (Hawkeye Platform) |
| Status | DRAFT (forward-spec; partial code present) |
| Version | 0.1 |
| Last updated | 2026-06-01 |
| Regulatory anchors | 21 CFR 211.188, 21 CFR 211.194, EU GMP Annex 16 (QP certification), EU GMP Annex 15 (qualification + validation), ICH Q7 §6, 21 CFR Part 11 |
| Source | Forward-spec for pharma vertical pack; cross-refs `06-modules/equipment-management/`, `06-modules/training/`, `06-modules/deviation/`, `06-modules/capa/` |

---

## 1. Purpose and Scope

**Purpose.** Hawkeye Batch Records is the pharma manufacturing workflow module for **end-to-end electronic batch records (eBR)** — from formulation through packaging through QA review and Qualified Person (QP) release. Implements 21 CFR 211.188/194 and EU GMP Annex 16 with Part-11-grade audit trail and e-signature gates at every regulated step.

**In scope:**
- Batch record lifecycle (initiation → release/disposition) across 8 states
- Multi-persona workflow (operator, production manager, QA, QP) with role-gated UIs
- Per-step electronic data entry with parameter tolerance checking
- E-signature on QA Review approval, QP Release sign-off (Annex 16), and Disposition
- Real-time equipment-status check against Equipment Management module (calibration valid?)
- Real-time personnel-eligibility check against Training module (trained on this SOP?)
- Automatic deviation creation when parameter values fall out of tolerance
- Batch release certificate generation (QP-signed PDF, immutable, SHA-256 anchored)

**Out of scope (handed off):**
- Deviation investigation lifecycle → `06-modules/deviation/`
- CAPA actions arising from batch deviations → `06-modules/capa/`
- Equipment calibration records → `06-modules/equipment-management/`
- Personnel training records → `06-modules/training/`
- Master Batch Record (MBR) template authoring → `06-modules/document-control/`
- PAT (Process Analytical Technology) sensor streams (planned future)
- Real-time release testing (RTRT) extension (planned future)

---

## 2. Stakeholders and Personas

| Persona | Role | Goals | Pain points without this module |
|---|---|---|---|
| **Production Operator** (e.g., Ramesh Kumar) | Records per-step parameters, weights, times, equipment IDs during execution | Capture data once, on-line, in-sequence; no transcription | Paper batch records re-typed into LIMS; errors at the keyboard |
| **Production Manager** (e.g., Sunita Rao) | Reviews completed batch for procedure adherence + step completeness before handoff to QA | Catch missing steps before QA does | Surprise rejections after weeks of QA backlog |
| **QA Reviewer** (e.g., Kavita Joshi) | Line-by-line review; signs APPROVED or rejects with reason | Single-screen review of all attributes + linked deviations + linked equipment cal status | Paper review takes 4-8 hours per batch; can't see linked records |
| **Qualified Person / QP** (e.g., Dr Anand Iyer) | EU-regulated batch release sign-off per Annex 16 — legally personally liable | Annex-16-readiness checklist completed before sign; cannot release if any disqualifier present | Sign in good faith with no system-enforced checks |
| **Production Lead** | Defines master batch record template (out of module — Doc Control) | Versioned MBR template | Templates copied via email; lose track of which version was run |

---

## 3. Part A — Foundational Requirements

### A1. Batch Record Initiation + Master Batch Record (MBR) Selection

| ID | Requirement | Persona | Reg anchor | MoSCoW | Current state |
|---|---|---|---|---|---|
| URS-A-001 | Production Manager SHALL initiate a Batch Record from an approved Master Batch Record template, selecting product + batch size + planned start date. | Production Manager | 21 CFR 211.188(a) | MUST | ⏳ planned |
| URS-A-002 | Each batch record SHALL receive a globally unique `batchId` (e.g., `BR0000000123`) AND a tenant-scoped batch number per product. | System | 21 CFR 211.188(b)(1) | MUST | ⏳ planned |
| URS-A-003 | System SHALL pin the exact MBR version used; later MBR revisions SHALL NOT retroactively alter open batches. | System | 21 CFR 211.188(a), ALCOA+ | MUST | ⏳ planned |
| URS-A-004 | At initiation, system SHALL verify the BOM (bill of materials) against approved raw-material lots; expired/quarantined lots block initiation. | System | 21 CFR 211.84 | MUST | ⏳ planned |

### A2. Per-Step Data Entry

| ID | Requirement | Persona | Reg anchor | MoSCoW | Current state |
|---|---|---|---|---|---|
| URS-A-010 | System SHALL enforce in-sequence step execution per the MBR; out-of-order entry blocked with a deviation prompt. | System | 21 CFR 211.188(b) | MUST | ⏳ planned |
| URS-A-011 | Each step SHALL capture: actor, equipment used, raw material lot(s), parameter values (with tolerance), start/end timestamps, attached evidence (photo/scan). | Operator | 21 CFR 211.188(b)(11) | MUST | ⏳ planned |
| URS-A-012 | Parameter values outside tolerance SHALL automatically create a linked Deviation record AND set batch state to `DEVIATION_PENDING`. | System | 21 CFR 211.192 | MUST | ⏳ planned |
| URS-A-013 | System SHALL verify equipment calibration is valid at the moment of step execution; out-of-cal equipment blocks step entry. | System | 21 CFR 211.68 | MUST | ⏳ planned |
| URS-A-014 | System SHALL verify the operator is trained on the SOP referenced by the step; untrained operator blocks step entry. | System | 21 CFR 211.25 | MUST | ⏳ planned |

### A3. Batch State Lifecycle

| ID | Requirement | Persona | Reg anchor | MoSCoW | Current state |
|---|---|---|---|---|---|
| URS-A-020 | The system SHALL model batch lifecycle as 8 states: **BATCH_INITIATED → IN_PRODUCTION → PRODUCTION_COMPLETE → QA_REVIEW → DEVIATION_RESOLUTION → QP_RELEASE → RELEASED → DISPOSITION**. | System | EU GMP Ch.5 | MUST | ⏳ planned |
| URS-A-021 | Every state transition SHALL write an AuditTrail row with actor, reasonForChange, before/after, timestamp. | System | 21 CFR Part 11 §11.10(e) | MUST | ⏳ planned |
| URS-A-022 | Transitions SHALL be **forward-only**; revert only by tenant_admin/superadmin with reason. | System | ALCOA+ "Original" | MUST | ⏳ planned |

### A4. QA Review Gate (E-Signature)

| ID | Requirement | Persona | Reg anchor | MoSCoW | Current state |
|---|---|---|---|---|---|
| URS-A-030 | QA Reviewer SHALL be presented a single-screen review with all attributes, deviations, equipment-cal status, and operator-training links. | QA | 21 CFR 211.194 | MUST | ⏳ planned |
| URS-A-031 | QA approval SHALL require a 21 CFR Part 11 e-signature (password + reason, signatureMeaning=APPROVED). | QA | 21 CFR Part 11 §11.50/§11.200 | MUST | ⏳ planned |
| URS-A-032 | QA can mark `QA_REJECTED` with reason; batch moves to DISPOSITION. | QA | 21 CFR 211.165 | MUST | ⏳ planned |

### A5. QP Release Gate (Annex 16 — Highest Assurance)

| ID | Requirement | Persona | Reg anchor | MoSCoW | Current state |
|---|---|---|---|---|---|
| URS-A-040 | System SHALL present the QP with an **Annex 16 Readiness Checklist** covering all 21 Annex-16 disqualifiers (e.g., open deviations resolved, all OOS investigated, equipment qualified, MA conditions met). | QP | EU GMP Annex 16 | MUST | ⏳ planned |
| URS-A-041 | QP release SHALL require an e-signature with elevated assurance (re-authentication within session); signatureMeaning=CERTIFIED. | QP | EU GMP Annex 16 §1.7 + 21 CFR Part 11 §11.50 | MUST | ⏳ planned |
| URS-A-042 | System SHALL produce a **Batch Release Certificate** PDF with QP name, license number, batch ID, manufacturer, MA holder, integrity hash (SHA-256). | System | EU GMP Annex 16 §1.10 | MUST | ⏳ planned |
| URS-A-043 | Without all Annex-16 checklist items green, the system SHALL block QP release in hard mode (`ENFORCE_ESIG=hard` per tenant). | System | EU GMP Annex 16 | MUST | ⏳ planned |

### A6. Audit Trail + Data Integrity (ALCOA+)

| ID | Requirement | Persona | Reg anchor | MoSCoW | Current state |
|---|---|---|---|---|---|
| URS-A-050 | System SHALL maintain an AuditTrail row for every state change, parameter entry, signature, and equipment-cal check with mandatory reasonForChange. | System | 21 CFR Part 11 §11.10(e), 21 CFR 211.194 | MUST | ⏳ planned |
| URS-A-051 | Audit trail rows SHALL be immutable and queryable cross-module (batch ↔ deviation ↔ equipment ↔ training). | System | ALCOA+ | MUST | ⏳ planned |
| URS-A-052 | Reason-for-change SHALL be required ≥10 characters; never auto-defaulted. | System | ALCOA+ "Contemporaneous" | MUST | ⏳ planned |

### A7. RBAC + Segregation of Duties

| ID | Requirement | Persona | Reg anchor | MoSCoW | Current state |
|---|---|---|---|---|---|
| URS-A-060 | The Operator who entered data SHALL NOT be the QA Reviewer who approves the batch (segregation of duties). | System | 21 CFR 211.22 | MUST | ⏳ planned |
| URS-A-061 | The QA Reviewer SHALL NOT be the QP for the same batch (independent assurance). | System | EU GMP Annex 16 §1.5 | MUST | ⏳ planned |

---

## 4. Part B — Differentiator Requirements

| ID | Requirement | Strategic rationale | MoSCoW | Current state |
|---|---|---|---|---|
| URS-B-001 | An **AI Batch Deviation Predictor** SHALL flag batches at elevated risk of deviation at step time, based on historical patterns of equipment, lot, operator, and parameter drift. | Catch deviations before they happen — no incumbent does this | SHOULD | ⏳ planned (Q3 2027) |
| URS-B-002 | A **QP Decision Support panel** SHALL pre-populate the Annex 16 checklist by pulling status from all linked records (deviations, equipment, training, MA conditions) and surface gaps with one click. | QPs save hours per release; reduces legal liability | MUST | ⏳ planned |
| URS-B-003 | The batch record SHALL be **inspector-readable** — a regulator opening any batch SHALL see linked records (deviations, CAPAs, equipment cal certs, operator training records) in < 2 sec from a single page. | Inspector-readiness as a product feature | MUST | ⏳ planned |
| URS-B-004 | Every AI prediction SHALL be **grounded + cited + confidence-scored + audit-trailed** with full reproducibility (modelVersion, promptHash, confidence, retrievalSet). | Part-11-grade AI traceability | MUST | ✅ (reuses platform `groundedGenerationService`) |
| URS-B-005 | Hawkeye SHALL price batch-record functionality within the SMB pharma envelope (<$30K floor) — feature-complete with Annex 16 support, not stripped. | Below-Veeva white-space | MUST | 🚫 business model |

---

## 5. Out-of-Scope (Explicit Hand-Off)

- **Deviation investigation lifecycle** — Batch Records creates the deviation; Deviation module owns RCA + impact assessment + closure
- **CAPA actions** — handed to CAPA module
- **MBR authoring + version control** — Document Control / HawkVault
- **PAT real-time sensor integration** — future vertical pack (no commitment date)
- **Stability testing** — separate Stability module (future)
- **Distribution / serialization (DSCSA)** — out of scope for v1

---

## 6. Assumptions and Dependencies

- **Equipment Management module** is the source of truth for calibration status; Batch Records reads, never writes
- **Training module** is the source of truth for personnel eligibility; Batch Records reads
- **Document Control** owns the MBR template; Batch Records pins the version at initiation
- **E-sig method** — password-based (bcrypt-verified) for QA; elevated re-auth for QP
- **Storage** — batch records in MongoDB; release certificates in S3-backed HawkVault
- **Timezone** — manufacturing site local time stored alongside UTC

---

## 7. Acceptance Criteria

| URS ID range | Verification approach |
|---|---|
| A1 (initiation) | E2E test: create batch from MBR; confirm version pin |
| A2 (data entry) | E2E: enter out-of-tolerance param → confirm auto-deviation; enter step with expired equipment cal → confirm block |
| A3 (lifecycle) | State-machine unit tests; forward-only enforcement |
| A4 (QA review) | E-sig integration test; SoD violation test (same user as operator) |
| A5 (QP release) | Annex 16 checklist completeness test; hard-mode block test |
| A6 (audit trail) | Sample batch → query `/api/audit-trail/by-entity` → confirm row per event |
| B2 (QP decision support) | UX walkthrough with pharma SME (Dr Anand persona) |

---

## 8. Open Questions

1. **PAT integration** — when do we ship sensor stream ingest for real-time release testing?
2. **Multi-site batch transfer** — does v1 support batches spanning two manufacturing sites (formulation at site A, packaging at site B)?
3. **MBR amendment during open batch** — what if MBR is corrected mid-production? Today: block. Should we allow with elevated approval?
4. **QP delegation** — can a QP designate a deputy QP per Annex 16? Today: no. Annex 16 §3 allows; design decision pending.
5. **Reduced QP confirmation (Annex 16 Part II)** — for MIA holders with established quality agreements; scope deferred.
6. **Continuous manufacturing** — batch boundaries fluid; design deferred to vertical pack.

---

## 9. Traceability Index (URS ↔ Code)

| URS section | Primary code (planned) | Primary UI (planned) |
|---|---|---|
| A1 initiation | `controllers/batchRecordController.js` | `/batches`, `/batches/[id]/new` |
| A2 data entry | `controllers/batchStepController.js` | `/batches/[id]/steps` |
| A3 lifecycle | `services/batchPhaseService.js` | `BatchPhaseStepper` |
| A4 QA review | `controllers/batchReviewController.js`, `middlewares/requireESignature.js` | `/batches/[id]/qa-review`, `SignatureDialog` |
| A5 QP release | `controllers/batchReleaseController.js` | `/batches/[id]/qp-release`, `Annex16Checklist` |
| A6 audit trail | `services/auditTrailService.js` (cross-module) | `/batches/[id]/audit-log` |
| B1 deviation predictor | `services/ai/batchDeviationPredictor.js` (planned) | inline step-entry hint |
| B2 QP decision support | `services/ai/qpReleaseChecklistAgent.js` (planned) | `Annex16Checklist` |
