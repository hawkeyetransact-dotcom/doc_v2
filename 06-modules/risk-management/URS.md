# URS — Risk Management

| Field | Value |
|---|---|
| Module | Risk Management |
| Owner | Product (S.M.A.R.T. Hawk Platform) |
| Status | DRAFT (reverse-engineered from current code + planned wave) |
| Version | 0.1 |
| Last updated | 2026-06-01 |
| Regulatory anchors | ICH Q9 (R1 2023), ISO 9001 §6.1, ISO 31000, ICH Q10 §2.3, 21 CFR Part 11 |
| Source | Reverse-engineered from `backend/src/{routes,controllers,services,models}/risk*.js` + `frontend/app/(console)/risks/` |

---

## 1. Purpose and Scope

**Purpose.** S.M.A.R.T. Hawk Risk Management is the **enterprise risk register + FMEA engine** for regulated quality systems. It manages identification, assessment (Severity × Occurrence × Detectability = RPN), control (mitigation planning), periodic review, and closure (or ongoing monitoring) for all five risk categories (Product, Process, Supplier, Regulatory, Operational). Risk scores feed cross-module prioritization (Audit scope weighting, CAPA prioritization, Change Control impact assessment, Doc Control review cadence).

**In scope:**
- Risk register CRUD with five risk types: Product, Process, Supplier, Regulatory, Operational
- FMEA assessment with structured Severity (1-10), Occurrence (1-10), Detectability (1-10) → RPN
- Mitigation plan: control actions with owner + due date, residual risk reassessment
- Periodic review cycle (annual + event-triggered)
- High-RPN risk acceptance with QA Head e-signature
- Cross-module data feeds: Audit (scope weighting), CAPA (prioritization), Change Control (impact)
- Cross-module triggers: Complaint resolution can trigger risk reassessment; Change Control completion can trigger risk reassessment
- Per-tenant configurable RPN thresholds (acceptable / acceptable-with-control / unacceptable)

**Out of scope (handed off):**
- Specific industry FMEA templates (e.g., dFMEA for design, pFMEA for process) → templates ship per vertical pack
- HAZOP / HACCP specialized assessment workflows → planned as overlays in future
- Audit finding lifecycle → Audit module (Risk module reads audit-driven risk scores)
- CAPA execution → CAPA module
- Regulatory horizon scanning → AskHawk module surface

---

## 2. Stakeholders and Personas

| Persona | Role | Goals | Pain points without this module |
|---|---|---|---|
| **QA Risk Manager** (e.g., Kavita Desai) | Owns the risk register; orchestrates assessments; tracks mitigation | Single source of truth; auto-recalc RPN on inputs change; cross-module visibility | Spreadsheet register; outdated FMEAs; no link to actual quality events |
| **Process Owner** (e.g., Plant Manager, R&D Lead) | Provides risk input for their area; reviews periodic | Quick input UX; risk-weighted task queue; understand why their process is high-risk | Asked annually for FMEA refresh; no feedback loop |
| **QA Head** (e.g., Dr Rajiv Sen) | Approver on high-RPN risks; signs acceptance | E-sig on risk acceptance; aggregate view of unacceptable risks; trend over time | Risk acceptance lives in email; no traceability |
| **Management Review Meeting (MRM) Chair** | Reviews risk landscape quarterly | Roll-up dashboard; periodic-review compliance % | Stale FMEAs presented at MRM |
| **Tenant Admin** | Configures risk types, RPN thresholds, review cadence per type | Per-tenant tuning of scoring rubrics, thresholds, review periods | Vendor-rigid scoring |
| **Cross-module consumers** (auto) | Audit (scope), CAPA (priority), Change Control (impact), Doc Control (review cadence) | Read risk scores to weight their own workflows | Risk lives in silo |

---

## 3. Part A — Foundational Requirements

### A1. Risk Register CRUD

| ID | Requirement | Persona | Reg anchor | MoSCoW | Current state |
|---|---|---|---|---|---|
| URS-A-001 | Risk Manager SHALL create a risk record with: title, description, risk type (Product/Process/Supplier/Regulatory/Operational), owner, identification source (audit, complaint, deviation, change, proactive). | Risk Manager | ICH Q9 §I.4 | MUST | ✅ `POST /api/risks` |
| URS-A-002 | Each risk SHALL receive a globally unique `riskNumber` (e.g., `RISK-2026-00045`). | System | 21 CFR Part 11 §11.10 | MUST | ✅ `riskNumberService` |
| URS-A-003 | Risks SHALL be linkable to source records (audit observation, complaint, deviation, change). | Risk Manager | ICH Q9 §I.4 | MUST | ✅ `RiskLink` model |
| URS-A-004 | Risks SHALL move through states: IDENTIFICATION → ASSESSMENT → CONTROL → REVIEW → CLOSED (or continued REVIEW if ongoing monitoring). | System | ICH Q9 §I.5 | MUST | ✅ `riskLifecycleService` |
| URS-A-005 | Risks SHALL be tenant-scoped; no cross-tenant read. | System | Multi-tenant safety | MUST | ✅ tenant scope query |

### A2. FMEA Assessment

| ID | Requirement | Persona | Reg anchor | MoSCoW | Current state |
|---|---|---|---|---|---|
| URS-A-010 | Risk Manager + Process Owner SHALL assess risk using FMEA scoring: Severity (1-10), Occurrence (1-10), Detectability (1-10). | Risk Manager | ICH Q9 §I.5.4 | MUST | ✅ `RiskAssessment` model |
| URS-A-011 | System SHALL compute RPN = Severity × Occurrence × Detectability and surface band (acceptable / acceptable-with-control / unacceptable) per per-tenant thresholds. | System | ICH Q9 §I.5.4 | MUST | ✅ `rpnCalculatorService` |
| URS-A-012 | Per-tenant configuration SHALL set RPN thresholds (default: acceptable < 60, acceptable-with-control 60-150, unacceptable > 150) — overridable per risk type. | Tenant Admin | ISO 31000 §6.5 | MUST | ✅ `RiskConfig` model + admin UI |
| URS-A-013 | Each scoring axis SHALL have per-tenant scoring rubric (e.g., what does Severity=7 mean for this tenant — descriptive text). | Tenant Admin | ICH Q9 §I.5.4 | SHOULD | ✅ `RiskRubric` model |
| URS-A-014 | Multiple assessments per risk SHALL be retained (initial + post-mitigation + periodic-review snapshots) showing residual risk evolution. | System | ICH Q9 §I.5.6 | MUST | ✅ `RiskAssessment` versioned per risk |
| URS-A-015 | Assessment SHALL capture justification text per axis (≥30 chars) — score alone insufficient. | System | ALCOA+ | MUST | ✅ form validation |

### A3. Mitigation / Control

| ID | Requirement | Persona | Reg anchor | MoSCoW | Current state |
|---|---|---|---|---|---|
| URS-A-020 | Risk Manager SHALL author a mitigation plan with one or more control actions: action description, owner, due date, type (preventive/detective/corrective). | Risk Manager | ICH Q9 §I.5.5 | MUST | ✅ `RiskMitigation` model |
| URS-A-021 | Each control action SHALL be linkable to a Doc Control SOP / Training record / CAPA / Change Control as the implementation vehicle. | Risk Manager | ICH Q9 §I.5.5 | MUST | ✅ `MitigationLink` model |
| URS-A-022 | Post-mitigation, system SHALL require a new RiskAssessment capturing residual risk (post-control RPN). | System | ICH Q9 §I.5.6 | MUST | ✅ enforced in `riskLifecycleService` |
| URS-A-023 | Control actions SHALL have status (planned / in-progress / verified / overdue); overdue surfaces escalation. | Risk Manager | UX baseline | MUST | ✅ status enum + scheduler |
| URS-A-024 | Effectiveness of each control SHALL be reviewable; ineffective controls trigger reassessment. | Risk Manager | ICH Q9 §I.5.6 | SHOULD | ✅ effectiveness field; auto-trigger partial |

### A4. Risk Acceptance (High-RPN)

| ID | Requirement | Persona | Reg anchor | MoSCoW | Current state |
|---|---|---|---|---|---|
| URS-A-030 | A risk with post-mitigation RPN > acceptance threshold SHALL require explicit acceptance with QA Head e-signature (signatureMeaning=ACCEPTED) before CLOSED state. | System | **21 CFR Part 11 §11.50 + §11.200**, ICH Q9 §I.5.7 | MUST | ✅ `requireESignature` middleware |
| URS-A-031 | Acceptance SHALL capture justification (≥100 chars) explaining why residual risk is accepted. | QA Head | ALCOA+ | MUST | ✅ form validation |
| URS-A-032 | Acceptance SHALL be revocable (with reasonForChange logged); revocation reopens risk to CONTROL state. | QA Head | ICH Q9 §I.5.7 | MUST | ✅ revocation path |

### A5. Periodic Review

| ID | Requirement | Persona | Reg anchor | MoSCoW | Current state |
|---|---|---|---|---|---|
| URS-A-040 | Each risk SHALL have `nextReviewDue` date (default annual; per-tenant per-type configurable). | System | ICH Q9 §I.5.6 | MUST | ✅ `riskReviewService` |
| URS-A-041 | T-30 days before due, system SHALL notify owner + Risk Manager. | System | UX baseline | MUST | ✅ scheduler hook |
| URS-A-042 | Review SHALL produce a new RiskAssessment (even if scores unchanged) with reviewer e-signature (signatureMeaning=REVIEWED). | Risk Manager | ICH Q9 §I.5.6 | MUST | ✅ `POST /api/risks/:id/review` |
| URS-A-043 | MRM Chair SHALL see quarterly roll-up of overdue reviews + risk landscape changes. | MRM Chair | ICH Q10 §2.7 MRM | SHOULD | ✅ MRM dashboard widget |

### A6. Cross-Module Triggers + Feeds

| ID | Requirement | Persona | Reg anchor | MoSCoW | Current state |
|---|---|---|---|---|---|
| URS-A-050 | Complaint resolution flagged "new risk identified" SHALL create a new IDENTIFICATION-state risk linked back to the complaint. | System | ICH Q9 §I.4 | MUST | ✅ cross-module hook |
| URS-A-051 | Change Control approval SHALL trigger reassessment of any risks linked to the affected SOP / process / product. | System | ICH Q9 §I.4 | MUST | ✅ cross-module hook |
| URS-A-052 | System SHALL expose risk scores via API for Audit module scope weighting (high-RPN suppliers → more frequent audits). | System | Cross-module integration | MUST | ✅ `GET /api/risks/by-entity` |
| URS-A-053 | System SHALL expose risk scores via API for CAPA prioritization (CAPA linked to high-RPN risk → priority bump). | System | Cross-module integration | MUST | ✅ same API |
| URS-A-054 | System SHALL expose risk scores via API for Doc Control review cadence (high-RPN docs → shorter review window). | System | Cross-module integration | SHOULD | ⚠️ API exists; Doc Control cadence consumption planned |

### A7. Audit Trail + Data Integrity

| ID | Requirement | Persona | Reg anchor | MoSCoW | Current state |
|---|---|---|---|---|---|
| URS-A-060 | Every state change, assessment, mitigation update, acceptance signature, and AI suggestion SHALL write an AuditTrail row. | System | 21 CFR Part 11 §11.10(e) | MUST | ✅ `auditTrailService` |
| URS-A-061 | Audit trail SHALL be immutable and queryable cross-module. | System | ALCOA+ | MUST | ✅ `GET /api/audit-trail/by-entity` |
| URS-A-062 | RiskAssessment history SHALL show side-by-side comparison (initial vs post-mitigation vs periodic). | Risk Manager | ICH Q9 §I.5.6 | MUST | ✅ AssessmentHistoryView component |

### A8. RBAC + Tenant Isolation

| ID | Requirement | Persona | Reg anchor | MoSCoW | Current state |
|---|---|---|---|---|---|
| URS-A-070 | System SHALL enforce role-based access on every risk endpoint. | System | 21 CFR Part 11 §11.10(d) | MUST | ✅ `permit(...roles)` |
| URS-A-071 | Process Owners SHALL only see risks where they are owner or in the linked process scope. | System | UX/privilege | MUST | ✅ scoped query |

---

## 4. Part B — Differentiator (White-Space) Requirements

| ID | Requirement | Strategic rationale | MoSCoW | Current state |
|---|---|---|---|---|
| URS-B-001 | S.M.A.R.T. Hawk SHALL provide an **AI risk scenario brainstormer** (`riskScenarioAgent`) that generates risk scenarios for a new process / product / supplier from regulatory corpus + historical cross-tenant patterns. | Blank-page paralysis killer; net-new value vs spreadsheet FMEA | SHOULD | ⏳ Planned Q1 2027 |
| URS-B-002 | **Risk-weighted decision support** SHALL be exposed across modules: Audit scope weighting, CAPA prioritization, Change Control impact, Doc Control review cadence — all sourced from this module's RPN scores. | The risk register becomes the strategic nervous system of the QMS | MUST | ✅ API live; partial consumer wiring |
| URS-B-003 | Every AI output SHALL be **grounded + cited + confidence-scored + reviewable** with full reproducibility. | Part-11-grade AI traceability (canonical S.M.A.R.T. Hawk posture) | MUST | ✅ `groundedGenerationService` |
| URS-B-004 | A **risk heat map** SHALL visualize all active risks on Severity × Occurrence axes with Detectability as bubble size, color-coded by band. | Inspector and exec-friendly visualization (no incumbent ships well) | MUST | ✅ `RiskHeatMap` component |
| URS-B-005 | A **risk trend dashboard** SHALL show RPN evolution over time per risk, surfacing risks where residual RPN is increasing despite mitigation. | Indicates failing controls; high-signal management view | SHOULD | ⚠️ Per-risk trend live; aggregate trend dashboard partial |
| URS-B-006 | System SHALL **auto-suggest** mitigation actions from a library of proven controls (per risk type + per industry) using AI matching. | Accelerator; reduces reliance on tribal knowledge | SHOULD | ⏳ Planned Q2 2027 |
| URS-B-007 | A **cross-tenant benchmarking** view SHALL (with consent) show how this tenant's risk landscape compares to peers (e.g., "your supplier-risk RPN average is 80; peer median is 50"). | Network-effect value; cross-tenant signal | SHOULD | ⏳ Roadmap (consent model TBD) |
| URS-B-008 | **Per-tenant configurable thresholds** + rubrics SHALL be tunable without code change — supports vertical packs (pharma vs auto vs aerospace use different rubrics). | Industry-agnostic engine; one platform many verticals (canon strategy) | MUST | ✅ `RiskConfig` + `RiskRubric` models |

---

## 5. Out-of-Scope (Explicitly Hand-Off)

- **Specialized assessment workflows** (HAZOP, HACCP, BowTie) → planned as overlays/templates in future
- **Audit observation lifecycle** → Audit module
- **CAPA execution** → CAPA module
- **Change Control workflow** → Change Control module
- **Regulatory horizon scanning** (new regs, emerging risks) → AskHawk module surface
- **Insurance/financial risk modeling** → out-of-scope (not a QMS surface)

---

## 6. Assumptions and Dependencies

- **Multi-tenant model:** every risk belongs to a `tenantOrgId`
- **Storage:** risk metadata in MongoDB; supporting evidence attachments in S3-backed HawkVault
- **E-signature method:** password-based today
- **LLM availability:** AI features degrade gracefully (manual brainstorming if `riskScenarioAgent` unavailable)
- **Notification channels:** email default; in-app banner for periodic review T-30
- **Cross-module dependency:** Audit / CAPA / Change Control / Doc Control / Complaint modules must be operational for triggers to fire

---

## 7. Acceptance Criteria

| URS ID range | Verification approach |
|---|---|
| A1 (register CRUD) | E2E test `frontend/e2e/risk-crud.spec.ts` |
| A2 (FMEA) | Unit tests on `rpnCalculatorService`; E2E on assessment flow |
| A3 (mitigation) | E2E + cross-module link tests |
| A4 (acceptance + e-sig) | E2E + `requireESignature` middleware tests |
| A5 (periodic review) | Scheduler unit test; E2E `risk-periodic-review.spec.ts` |
| A6 (cross-module triggers) | Integration tests Complaint→Risk, Change→Risk, Risk→Audit/CAPA/Doc |
| A7 (audit trail) | Cross-module trail query test |
| A8 (RBAC) | Permit middleware tests + Process Owner scope query test |
| B1–B8 (white-space) | AI eval suite (when shipped); heat map demo; benchmarking design doc |

---

## 8. Open Questions

1. **Risk scenario AI (URS-B-001)** — Q1 2027 commit; what's the eval criterion (precision/recall on labeled regulatory observations)?
2. **Mitigation suggestion AI (URS-B-006)** — Q2 2027; what's the control library data source?
3. **Cross-tenant benchmarking (URS-B-007)** — what's the consent UI? Anonymization model (k-anonymity)?
4. **HAZOP / HACCP overlays** — when do specialized workflows ship?
5. **Doc Control review cadence consumption (URS-A-054)** — when does Doc Control start consuming risk-weighted cadence?
6. **MRM dashboard depth** — current widget shows roll-up; do we add narrative export for MRM packet?
7. **Auto-trigger reassessment policy** — every Change Control auto-fires reassessment? Or only "major" changes?
8. **Risk owner notifications** — do we want SMS for critical (RPN>200) risks beyond email?

---

## 9. Traceability Index (URS ↔ Code)

| URS section | Primary code | Primary UI |
|---|---|---|
| A1 register CRUD | `controllers/riskController.js`, `services/riskLifecycleService.js` | `/risks`, `/risks/[id]` |
| A2 FMEA | `controllers/riskAssessmentController.js`, `services/rpnCalculatorService.js` | `/risks/[id]/assess`, `AssessmentForm` |
| A3 mitigation | `controllers/riskMitigationController.js`, `services/mitigationLinkService.js` | `/risks/[id]/mitigate`, `MitigationPlanPanel` |
| A4 acceptance | `controllers/riskAcceptanceController.js`, `middlewares/requireESignature.js` | `/risks/[id]/accept`, `SignatureDialog` |
| A5 periodic review | `services/riskReviewService.js` | `/risks/[id]/review` |
| A6 cross-module | `services/riskCrossModuleService.js`, exposed `GET /api/risks/by-entity` | (consumed by other modules) |
| A7 audit trail | `services/auditTrailService.js` | `/risks/[id]/audit-log` |
| A8 RBAC | `middlewares/{authMiddleware,roleMiddleware}.js` | route-level page guards |
| B1 scenario AI | `services/ai/riskScenarioAgent.js` (planned) | `/risks/new` brainstorm panel |
| B4 heat map | `frontend/components/risks/RiskHeatMap.tsx` | `/risks/heatmap` |
| B5 trend dashboard | `frontend/components/risks/RiskTrendChart.tsx` | `/risks/[id]` trend tab |
| B8 config | `controllers/riskConfigController.js`, `models/{RiskConfig,RiskRubric}.js` | `/admin/risk-config` |
