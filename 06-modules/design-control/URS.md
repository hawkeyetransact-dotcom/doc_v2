# URS — Design Control

| Field | Value |
|---|---|
| Module | Design Control |
| Vertical | Medical Device (primary); aerospace + automotive variants future |
| Owner | Product (S.M.A.R.T. Hawk Platform) |
| Status | DRAFT (med-device vertical pack) |
| Version | 0.1 |
| Last updated | 2026-06-01 |
| Regulatory anchors | **21 CFR 820.30** (FDA Design Controls), **ISO 13485 §7.3** (Design and development), **EU MDR 2017/745** Annex I + II (technical documentation), **FDA QMSR** (2026 harmonization with ISO 13485) |
| Source | `backend/src/{routes,controllers,services,models}/design*.js`; `frontend/app/(console)/design/` (in scope, partial code) |

---

## 1. Purpose and Scope

**Purpose.** S.M.A.R.T. Hawk Design Control manages the **Design History File (DHF)** for medical-device development from concept through transfer to manufacturing, with Part 11–grade e-signature gates on every design review, verification, and validation milestone. It is the **med-device vertical pack** — pharma tenants do not enable it; ISO-13485 / 820.30 customers do.

**In scope:**
- DHF lifecycle: planning → inputs → outputs → review → verification → validation → transfer → change
- Design inputs (user needs, intended use, regulatory requirements, performance specs)
- Design outputs (drawings, specs, manufacturing instructions, label/IFU, software-of-unknown-provenance assessments)
- Verification (did we build it right? — outputs ↔ inputs trace)
- Validation (did we build the right thing? — clinical/simulated-use evidence)
- Design reviews with multi-discipline reviewers + e-sig
- Design transfer to manufacturing
- Post-transfer design changes (linked to Change Control module)

**Out of scope (handed off):**
- DHF document storage/versioning → Document Control (HawkVault)
- Design FMEA / risk register → Risk Management module
- Design-issue CAPA execution → CAPA module
- Software lifecycle (IEC 62304) detail → future Software Design module
- Clinical evaluation (MDR Annex XIV) → future Clinical Evaluation module
- Post-market surveillance (PMS) → future Vigilance module

---

## 2. Stakeholders and Personas

| Persona | Role | Goals | Pain without module |
|---|---|---|---|
| **Design Engineer** (e.g., Hiro Tanaka) | Owns inputs/outputs of a sub-system; drafts verification protocols | Capture inputs traceably; auto-link verification to inputs | Spreadsheet trace matrices; manual re-work each cycle |
| **R&D Lead** (e.g., Sofia Rossi) | Owns DesignProject; chairs design reviews; signs gate approvals | Coordinate cross-discipline reviews; ensure phase-gate readiness | Email-chain reviews; missed prerequisites |
| **QA Reviewer — Design Control** (e.g., James Whitfield) | Independent QA verification of trace + records completeness | Confirm every input has output + verification + validation | Audit of paper records pre-submission |
| **Regulatory Affairs** (e.g., Mei-Lin Cheng) | Maps design records to 21 CFR 820.30 / ISO 13485 / MDR submission | Generate 510(k) / MDR technical-documentation extracts | Manual screenshot assembly for FDA / NB submission |
| **Manufacturing Engineering** | Receives design transfer; validates production-readiness | Clean handoff with verified outputs + tooling specs | Re-engineering at production scale |
| **Tenant Admin** | Configures phase gates, reviewer matrix, e-sig policy | Per-tenant tuning of design-review composition | Vendor controls everything |

---

## 3. Part A — Foundational Requirements

### A1. Design Project Lifecycle

| ID | Requirement | Persona | Reg anchor | MoSCoW | State |
|---|---|---|---|---|---|
| URS-A-001 | R&D Lead SHALL create a DesignProject linked to a product, with intended-use statement, target market(s), classification (Class I/II/III), and target submission pathway (510k / De Novo / PMA / MDR). | R&D Lead | 21 CFR 820.30(b) | MUST | ⏳ Scaffold |
| URS-A-002 | Each DesignProject SHALL receive a unique `designProjectId` (e.g., `DESN0000000001`) scoped to tenant. | System | 21 CFR 820.40 | MUST | ⏳ |
| URS-A-003 | System SHALL model the design lifecycle as 8 phases: **PLANNING → INPUTS_CAPTURED → OUTPUTS_PRODUCED → DESIGN_REVIEW → VERIFICATION → VALIDATION → TRANSFER → CHANGE (post-transfer)**. | System | 21 CFR 820.30(a)-(j); ISO 13485 §7.3.2-§7.3.10 | MUST | ⏳ |
| URS-A-004 | Phase transitions SHALL be **forward-only** unless explicit revert by R&D Lead + QA Reviewer dual e-sig. | System | ALCOA+ | MUST | ⏳ |
| URS-A-005 | Every transition SHALL write AuditTrail row with reasonForChange ≥10 chars. | System | 21 CFR Part 11 §11.10(e) | MUST | ⏳ (reuses cross-module service) |

### A2. Design Inputs

| ID | Requirement | Persona | Reg anchor | MoSCoW | State |
|---|---|---|---|---|---|
| URS-A-010 | Design Engineer SHALL capture inputs by category: **user needs, intended use, performance, safety, regulatory, interoperability, environmental, packaging/labeling**. | Design Engineer | 21 CFR 820.30(c); ISO 13485 §7.3.3 | MUST | ⏳ |
| URS-A-011 | Each input SHALL be: identifiable (`inputId`), unambiguous, verifiable, traceable to a source (user-research artifact / standard / regulation clause). | System | 21 CFR 820.30(c) | MUST | ⏳ |
| URS-A-012 | Inputs SHALL be reviewed + approved by R&D Lead with e-sig (signatureMeaning=APPROVED) before transition to OUTPUTS_PRODUCED. | R&D Lead | 21 CFR 820.30(c) | MUST | ⏳ |
| URS-A-013 | System SHALL detect duplicate / conflicting / ambiguous inputs and surface to the Engineer for resolution. | System | ISO 13485 §7.3.3 review | SHOULD | ⏳ (AI-assist planned) |

### A3. Design Outputs

| ID | Requirement | Persona | Reg anchor | MoSCoW | State |
|---|---|---|---|---|---|
| URS-A-020 | Design Engineer SHALL capture outputs in forms that allow adequate evaluation against inputs (drawings, specs, software releases, label/IFU, manufacturing instructions). | Design Engineer | 21 CFR 820.30(d); ISO 13485 §7.3.4 | MUST | ⏳ |
| URS-A-021 | Each output SHALL link to ≥1 design input via `outputInputLinks[]`; orphan outputs SHALL block phase transition. | System | 21 CFR 820.30(d) | MUST | ⏳ |
| URS-A-022 | Critical outputs (acceptance criteria, those essential for proper functioning) SHALL be flagged with `isCritical=true`. | Design Engineer | 21 CFR 820.30(d) | MUST | ⏳ |
| URS-A-023 | Outputs SHALL reference HawkVault `documentId` for the actual file (drawing, spec PDF, etc.). | System | DC integration | MUST | ⏳ |

### A4. Design Reviews

| ID | Requirement | Persona | Reg anchor | MoSCoW | State |
|---|---|---|---|---|---|
| URS-A-030 | System SHALL support DesignReview records at planned milestones with composition: R&D Lead (chair) + independent reviewer (not directly involved) + relevant discipline reps. | R&D Lead | 21 CFR 820.30(e); ISO 13485 §7.3.5 | MUST | ⏳ |
| URS-A-031 | Each reviewer SHALL e-sign their disposition (APPROVED / APPROVED_WITH_ACTIONS / REJECTED). | All reviewers | 21 CFR Part 11 §11.50 | MUST | ⏳ |
| URS-A-032 | Action items raised in review SHALL be tracked to closure before the design can transition further. | R&D Lead | ISO 13485 §7.3.5 | MUST | ⏳ |
| URS-A-033 | Review minutes SHALL be captured (free-text + attached docs) and locked after dispositions signed. | System | ALCOA+ | MUST | ⏳ |

### A5. Design Verification (G-VV1)

| ID | Requirement | Persona | Reg anchor | MoSCoW | State |
|---|---|---|---|---|---|
| URS-A-040 | Design Engineer SHALL author Verification Protocols mapped to inputs; each protocol declares method (test / inspection / analysis / demonstration), acceptance criteria, sample size. | Design Engineer | 21 CFR 820.30(f); ISO 13485 §7.3.6 | MUST | ⏳ |
| URS-A-041 | Verification Reports SHALL capture results (pass/fail per criterion), deviations, attached raw-data assets. | Design Engineer | 21 CFR 820.30(f) | MUST | ⏳ |
| URS-A-042 | QA Reviewer SHALL e-sign verification completion (signatureMeaning=APPROVED) confirming "outputs meet inputs"; this is **gate G-VV1**. | QA Reviewer | 21 CFR Part 11 §11.50 | MUST | ⏳ |
| URS-A-043 | Verification SHALL produce a **traceability matrix** auto-generated from input ↔ output ↔ verification links. | System | 21 CFR 820.30(f) | MUST | ⏳ |

### A6. Design Validation (G-VV2)

| ID | Requirement | Persona | Reg anchor | MoSCoW | State |
|---|---|---|---|---|---|
| URS-A-050 | Design Engineer + R&D Lead SHALL author Validation Protocols using initial-production-equivalent units, in actual or simulated use environments. | Design Engineer, R&D Lead | 21 CFR 820.30(g); ISO 13485 §7.3.7 | MUST | ⏳ |
| URS-A-051 | Validation SHALL include risk-analysis output review (link to Risk module FMEA), software validation (where applicable), and human-factors / usability (per IEC 62366). | R&D Lead | 21 CFR 820.30(g); MDR Annex I §5 | MUST | ⏳ |
| URS-A-052 | QA Reviewer + R&D Lead SHALL **dual e-sign** validation completion confirming "user needs met" — gate **G-VV2**. | QA Reviewer, R&D Lead | 21 CFR Part 11 §11.50 | MUST | ⏳ |

### A7. Design Transfer (G-T)

| ID | Requirement | Persona | Reg anchor | MoSCoW | State |
|---|---|---|---|---|---|
| URS-A-060 | R&D Lead SHALL execute a Transfer event marking production-readiness, with checklist: outputs locked, validation complete, mfg specs released, training delivered to production. | R&D Lead | 21 CFR 820.30(h); ISO 13485 §7.3.8 | MUST | ⏳ |
| URS-A-061 | Manufacturing Engineering SHALL counter-sign acceptance (signatureMeaning=APPROVED) — gate **G-T**. | Mfg Eng | 21 CFR Part 11 §11.50 | MUST | ⏳ |
| URS-A-062 | Post-transfer, the DesignProject SHALL transition to CHANGE phase; new design changes route through the Change Control module with bidirectional link. | System | 21 CFR 820.30(i); ISO 13485 §7.3.9 | MUST | ⏳ |

### A8. DHF Compilation + Regulatory Export

| ID | Requirement | Persona | Reg anchor | MoSCoW | State |
|---|---|---|---|---|---|
| URS-A-070 | System SHALL maintain a real-time DHF Index listing every record (input, output, review, verification, validation, transfer, change) with state + signatures + timestamps. | System | 21 CFR 820.30(j); ISO 13485 §7.3.10 | MUST | ⏳ |
| URS-A-071 | Regulatory Affairs SHALL export DHF as a structured bundle (PDF binder + JSON manifest) for 510(k) / MDR submission. | Reg Affairs | FDA submission norms | MUST | ⏳ |
| URS-A-072 | Export SHALL include integrity hash (SHA-256) of every file in the bundle. | System | ALCOA+ Enduring | MUST | ⏳ |

### A9. RBAC + Tenant Isolation

| ID | Requirement | Persona | Reg anchor | MoSCoW | State |
|---|---|---|---|---|---|
| URS-A-080 | System SHALL enforce role-based access on every endpoint; minimum roles: design_engineer, rd_lead, qa_reviewer, reg_affairs, mfg_eng, tenant_admin, admin, superadmin. | System | 21 CFR Part 11 §11.10(d) | MUST | ⏳ |
| URS-A-081 | Independent reviewer constraint: the QA Reviewer who signs verification/validation SHALL NOT be a member of the project team. | System | 21 CFR 820.30(e) | MUST | ⏳ |

---

## 4. Part B — Differentiator (White-Space) Requirements

| ID | Requirement | Rationale | MoSCoW | State |
|---|---|---|---|---|
| URS-B-001 | **AI Design-Input Gap Analysis** SHALL compare a draft input set against (a) similar past DesignProjects on the same product class and (b) regulatory clauses for that class, surfacing missing categories before review. | Cuts pre-review re-work; differentiator over MasterControl/Greenlight | SHOULD | ⏳ Planned (AskHawk-backed) |
| URS-B-002 | **Regulatory-Requirement Extractor** SHALL parse a target regulation (e.g., MDR Annex I) and propose candidate design inputs auto-categorized + cited. | Reg Affairs time-saver; defensible AI moat | SHOULD | ⏳ Planned (AskHawk-backed) |
| URS-B-003 | **Auto-Trace Matrix Health Score** SHALL compute completeness (% inputs with linked output + verification + validation) in real-time; below 100% blocks Transfer. | Inspector-readiness as feature | MUST | ⏳ |
| URS-B-004 | **Combination-Product Awareness** — for drug-device combinations, system SHALL coordinate Design Control (820.30) with the pharma CMC equivalent. | Combination products are growing; no incumbent unifies | COULD | 🚫 TBD (scoping) |
| URS-B-005 | **Cross-tenant pattern detection (with consent)** — surface "other med-device customers in your class encountered failure mode X at validation" — anonymized, opt-in. | Network effects | COULD | 🚫 Deferred (consent UI TBD) |
| URS-B-006 | **Pre-submission readiness checker** SHALL audit the DHF against the target pathway (510k / MDR) and produce a gap report with cited clauses. | Differentiator vs paper checklists | SHOULD | ⏳ |

---

## 5. Out-of-Scope

- **Document storage** → Document Control / HawkVault
- **FMEA / risk register** → Risk Management module
- **CAPA execution** → CAPA module (design-issue CAPAs link back to DesignProject)
- **Change Control workflow** → Change Control module (post-transfer changes routed there)
- **IEC 62304 software lifecycle detail** → future Software Design module
- **Clinical evaluation (MDR Annex XIV) detail** → future Clinical Evaluation module
- **Post-market surveillance** → future Vigilance module

---

## 6. Assumptions and Dependencies

- Multi-tenant: each DesignProject scoped to `tenantOrgId`
- Vertical pack: enabled only for tenants with `vertical=med_device` in tenant config
- Time/timezone: dates stored UTC; UI renders in user pref
- E-sig: password-based (reuses platform `ElectronicSignature` model)
- Storage: design output files in HawkVault (S3-backed); metadata in MongoDB
- Cross-module: AuditTrail, CAPA, Risk, Document Control, Change Control all production-grade

---

## 7. Acceptance Criteria

| URS range | Verification approach |
|---|---|
| A1–A4 (lifecycle + reviews) | E2E `frontend/e2e/design-control-lifecycle.spec.ts` (TBD) |
| A5–A6 (V&V) | Backend test on dual-signature gate; trace-matrix completeness unit test |
| A7 (Transfer) | E2E with mfg-eng counter-sign + change-module link assertion |
| A8 (DHF export) | Snapshot test on PDF + JSON manifest hash stability |
| A9 (RBAC) | `tests/middlewares/permit.test.js` extended for design roles |
| B1–B6 (AI white-space) | AskHawk eval suite (gap-analysis precision/recall on canned corpus) |

---

## 8. Open Questions

1. **Vertical-pack activation UI** — should med-device be a tenant-config toggle or a per-product toggle? Current assumption: tenant-level.
2. **Combination products** — full scoping (URS-B-004) — for what % of med-device customers is this critical?
3. **IEC 62304 split** — when do we ship the dedicated Software Design module vs absorbing into Design Control?
4. **Independent reviewer enforcement** — soft-warn vs hard-block when picker offers someone in the project team?
5. **MDR vs 820.30 template divergence** — do we ship two DHF export templates, or one unified with conditional sections?
6. **Cross-tenant pattern detection** (URS-B-005) — consent model; legal review needed.

---

## 9. Traceability Index (URS ↔ Code)

| URS section | Primary code (planned/scaffold) | Primary UI (planned) |
|---|---|---|
| A1 lifecycle | `services/designProjectService.js`, `constants/designPhases.js` | `/design/projects/[id]` |
| A2 inputs | `controllers/designInputController.js`, `models/DesignInput.js` | `/design/projects/[id]/inputs` |
| A3 outputs | `controllers/designOutputController.js`, `models/DesignOutput.js` | `/design/projects/[id]/outputs` |
| A4 reviews | `controllers/designReviewController.js`, `models/DesignReview.js` | `/design/projects/[id]/reviews` |
| A5 verification | `controllers/designVerificationController.js` | `/design/projects/[id]/verification` |
| A6 validation | `controllers/designValidationController.js` | `/design/projects/[id]/validation` |
| A7 transfer | `controllers/designTransferController.js` | `/design/projects/[id]/transfer` |
| A8 DHF export | `services/dhfExportService.js` | `/design/projects/[id]/dhf` |
| B1–B2 (AI) | `services/ai/designGapAgent.js`, `regRequirementExtractorAgent.js` (delegates to AskHawk groundedGenerationService) | `DesignInputAssistant` (planned) |
| B3 trace matrix | `services/designTraceMatrixService.js` | trace-matrix viewer component |
