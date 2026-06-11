# URS — Complaint Management

| Field | Value |
|---|---|
| Module | Complaint Management |
| Owner | Product (Hawkeye Platform) |
| Status | DRAFT (reverse-engineered from current code + planned wave-3 AI) |
| Version | 0.1 |
| Last updated | 2026-06-01 |
| Regulatory anchors | 21 CFR 820.198, ICH Q10 §3.2.1, EU GMP Ch.8, ISO 13485 §8.2.2, 21 CFR Part 11 |
| Source | Reverse-engineered from `backend/src/{routes,controllers,services,models}/complaint*.js` + `frontend/app/(console)/complaints/` |

---

## 1. Purpose and Scope

**Purpose.** Hawkeye Complaint Management is the **customer complaint lifecycle module** — intake from any channel (email, phone, web form, supplier report), structured triage (reportable vs non-reportable), investigation, resolution, and explicit cross-linkage to CAPA and Deviation modules when systemic issues are identified. Designed to meet 21 CFR 820.198 (medical device complaint handling) and equivalent ICH Q10 / EU GMP Ch.8 requirements.

**In scope:**
- Multi-channel intake: customer service portal, email ingestion (planned), phone log entry, web form, supplier-reported complaints
- Lifecycle: INTAKE → TRIAGE → INVESTIGATION → RESOLUTION → CAPA_LINK (if needed) → CLOSURE
- Triage classification: Reportable (regulator-notifiable), Non-reportable (internal only), Customer-service-only
- Investigation with cross-functional ownership (QA, Production, Reg Affairs)
- E-signature ceremony on regulator-notification approval
- Cross-module spawning: CAPA, Deviation, Change Control trigger paths
- Reportable-complaint regulator submission tracking
- AI features (wave-3): similarity finder, reportability classifier, root-cause hint generator

**Out of scope (handed off):**
- CAPA execution lifecycle → `06-modules/capa/` (Complaint spawns CAPA; CAPA owns it)
- Deviation investigation depth → `06-modules/deviation/`
- Change Control workflow → `06-modules/change-control/`
- Regulator submission portal integration (e.g., FDA eMDR, EU Eudamed) → infra integration backlog
- Customer portal (allowing customers to self-submit) → planned, separate module

---

## 2. Stakeholders and Personas

| Persona | Role | Goals | Pain points without this module |
|---|---|---|---|
| **Customer Service Rep** (e.g., Anika Rao) | Intakes complaints from email/phone/web | Quick log with structured fields; auto-classification suggestion | Tickets in Zendesk, lose context when escalated to QA |
| **QA Investigator** (e.g., Vikram Joshi) | Owns triage + investigation | Single queue; structured RCA capture; link to historical similar complaints | Spreadsheet log; root cause never connected back |
| **Production Owner** (when product issue) | Investigates manufacturing-side root causes | Notified for relevant complaints; can attach batch records, deviation refs | Email forwards; no formal handoff |
| **Regulatory Affairs (Reg)** (e.g., Sonal Mehta) | Decides regulator-reportability, prepares submission | Reportability decision support; submission tracking with deadline alarms | Manual MDR/eMDR forms; missed timelines |
| **QA Head** (e.g., Dr Rajiv Sen) | E-signs regulator-notification approval | Confidence in decision + audit trail | Decision lives in emails |
| **Customer** | External — supplies issue details | (read-only) status visibility (future portal) | No transparency post-complaint |
| **Tenant Admin** | Configures triage categories, regulator templates, escalation rules | Per-tenant tuning | Vendor rigidity |

---

## 3. Part A — Foundational Requirements

### A1. Intake Lifecycle

| ID | Requirement | Persona | Reg anchor | MoSCoW | Current state |
|---|---|---|---|---|---|
| URS-A-001 | System SHALL accept complaint intake from: web form, manual entry (CS rep), email ingestion (planned), supplier report API. | CS Rep | 21 CFR 820.198(a) | MUST | ✅ web form + manual entry; ⚠️ email ingestion planned |
| URS-A-002 | Each complaint SHALL receive a globally unique `complaintNumber` (e.g., `CMP-2026-00123`). | System | 21 CFR Part 11 §11.10 | MUST | ✅ `complaintNumberService` |
| URS-A-003 | Intake form SHALL capture: complainant info, product/lot/batch, date of issue, channel, narrative, attachments (photos, audio, docs). | CS Rep | 21 CFR 820.198(a) | MUST | ✅ `ComplaintIntakeForm` |
| URS-A-004 | If complainant supplies email, system SHALL auto-acknowledge receipt within 24h (configurable). | System | ICH Q10 §3.2.1 | SHOULD | ⚠️ template exists; mail send wired |
| URS-A-005 | Complaint SHALL be automatically routed to default triage owner (configurable per product line / region). | System | EU GMP Ch.8 §8.30 | MUST | ✅ routing rules engine |

### A2. Triage + Classification

| ID | Requirement | Persona | Reg anchor | MoSCoW | Current state |
|---|---|---|---|---|---|
| URS-A-010 | QA Investigator SHALL classify each complaint as one of: **Reportable** (regulator-notifiable), **Non-reportable** (internal only), **Customer-service-only**. | QA Investigator | 21 CFR 803 (MDR) | MUST | ✅ `complaintTriageController` |
| URS-A-011 | Triage SHALL capture: severity (low/medium/high/critical), defect type, affected lot, customer harm flag, complaint nature codes. | QA Investigator | ISO 13485 §8.2.2 | MUST | ✅ structured triage form |
| URS-A-012 | A **Reportable** classification SHALL trigger downstream regulator-notification approval workflow (separate e-sig). | System | 21 CFR 803.20 (MDR timelines) | MUST | ✅ workflow trigger |
| URS-A-013 | Triage decision SHALL be revisable with reasonForChange logged; reclassification SHALL be audit-trailed. | QA Investigator | 21 CFR Part 11 §11.10(e) | MUST | ✅ audit trail |
| URS-A-014 | System SHALL surface **historically similar complaints** (same product, similar narrative) at triage time to detect trending. | QA Investigator | 21 CFR 820.198(e) trending | SHOULD | ⏳ Similarity AI planned (wave-3) |
| URS-A-015 | System SHALL count and surface complaint volume per product per period to support trending decisions. | QA Head | 21 CFR 820.198(e) | MUST | ✅ trending widget |

### A3. Investigation

| ID | Requirement | Persona | Reg anchor | MoSCoW | Current state |
|---|---|---|---|---|---|
| URS-A-020 | QA Investigator SHALL conduct investigation: define scope, assign cross-functional owners (Production, Reg, R&D), collect evidence. | QA Investigator | 21 CFR 820.198(c) | MUST | ✅ `ComplaintInvestigation` entity |
| URS-A-021 | Investigation SHALL support attachment of: batch records (linked), test data, photos, customer correspondence. | QA Investigator | Evidence completeness | MUST | ✅ attachment service |
| URS-A-022 | RCA SHALL capture structured root cause (5-Why, Fishbone categories) with free-text narrative. | QA Investigator | EU GMP Ch.8 §8.32 | SHOULD | ✅ structured RCA form |
| URS-A-023 | Investigation SHALL have target completion date (default by severity); overdue surfaces escalation. | System | 21 CFR 820.198(c) timeliness | MUST | ✅ deadline + escalation |
| URS-A-024 | System SHALL link to historical CAPAs, deviations, audits for the same product to inform investigation. | QA Investigator | 21 CFR 820.198(e) trending | SHOULD | ✅ cross-module reference panel |

### A4. Resolution + CAPA/Deviation Linkage

| ID | Requirement | Persona | Reg anchor | MoSCoW | Current state |
|---|---|---|---|---|---|
| URS-A-030 | Investigator SHALL resolve complaint with one of: **No action needed** (justified), **Corrective action only**, **CAPA required**, **Deviation linkage**, **Recall consideration**. | QA Investigator | 21 CFR 820.198(c) | MUST | ✅ resolution decision |
| URS-A-031 | "CAPA required" SHALL spawn a CAPA record (linked back via `ComplaintLink`); CAPA module owns the lifecycle. | System | 21 CFR 820.100 | MUST | ✅ `POST /api/complaints/:id/link-capa` |
| URS-A-032 | "Deviation linkage" SHALL link to existing or new Deviation record. | System | EU GMP Ch.8 | MUST | ✅ deviation-link path |
| URS-A-033 | "Recall consideration" SHALL flag complaint for VP Quality review; out-of-scope downstream (recall handled outside module). | System | 21 CFR 806 | SHOULD | ✅ flag + notification |
| URS-A-034 | Resolution SHALL require justification text (≥50 chars) regardless of decision. | System | ALCOA+ | MUST | ✅ form validation |

### A5. Reportable Complaint → Regulator Notification

| ID | Requirement | Persona | Reg anchor | MoSCoW | Current state |
|---|---|---|---|---|---|
| URS-A-040 | Reportable complaint SHALL trigger Reg Affairs review with regulator timeline calculator (e.g., MDR: 30 calendar days for serious injury). | Reg Affairs | 21 CFR 803.20, EU MDR Art.87 | MUST | ✅ timeline calculator |
| URS-A-041 | Reg Affairs SHALL draft regulator notification using templated forms (MDR / eMDR / vigilance report). | Reg Affairs | 21 CFR 803.20 | MUST | ✅ form templates (MDR + Vigilance) |
| URS-A-042 | QA Head SHALL approve notification with e-signature (signatureMeaning=APPROVED) before submission. | QA Head | **21 CFR Part 11 §11.50 + §11.200** | MUST | ✅ `requireESignature` middleware |
| URS-A-043 | System SHALL track submission status: drafted → reg-head-approved → submitted-to-regulator → acknowledged. | System | 21 CFR 803.20 traceability | MUST | ✅ status enum |
| URS-A-044 | Submission deadline SHALL surface countdown + escalation T-7, T-3, T-1 days. | System | 21 CFR 803.20 | MUST | ✅ scheduler + notification |

### A6. Closure

| ID | Requirement | Persona | Reg anchor | MoSCoW | Current state |
|---|---|---|---|---|---|
| URS-A-050 | Complaint SHALL close only when: investigation complete, resolution decision applied, linked CAPA/deviation in progress (closure not gated on CAPA closure), regulator notified (if reportable) and acknowledged. | System | 21 CFR 820.198 | MUST | ✅ closure controller |
| URS-A-051 | Closure SHALL require complainant communication record (acknowledgment letter sent, optional satisfaction rating). | CS Rep | ICH Q10 §3.2.1 | SHOULD | ✅ comms log |
| URS-A-052 | Closure decision SHALL be audit-trailed with reasonForChange. | System | 21 CFR Part 11 §11.10(e) | MUST | ✅ audit trail |

### A7. Audit Trail + Data Integrity

| ID | Requirement | Persona | Reg anchor | MoSCoW | Current state |
|---|---|---|---|---|---|
| URS-A-060 | Every state change, classification revision, signature, and cross-module link SHALL write an AuditTrail row. | System | 21 CFR Part 11 §11.10(e) | MUST | ✅ `auditTrailService` |
| URS-A-061 | Audit trail SHALL be immutable and queryable cross-module. | System | ALCOA+ | MUST | ✅ `GET /api/audit-trail/by-entity` |

### A8. RBAC + Tenant Isolation

| ID | Requirement | Persona | Reg anchor | MoSCoW | Current state |
|---|---|---|---|---|---|
| URS-A-070 | System SHALL enforce role-based access on every complaint endpoint. | System | 21 CFR Part 11 §11.10(d) | MUST | ✅ `permit(...roles)` |
| URS-A-071 | Complaints SHALL be tenant-scoped; no cross-tenant read. | System | Multi-tenant safety | MUST | ✅ tenant scope query |

---

## 4. Part B — Differentiator (White-Space) Requirements

| ID | Requirement | Strategic rationale | MoSCoW | Current state |
|---|---|---|---|---|
| URS-B-001 | Hawkeye SHALL provide **AI similarity finder** that surfaces historically similar complaints at triage time (same product + similar narrative) to enable trending detection. | Trending is regulator-required (820.198(e)) but no tool ships it well | SHOULD | ⏳ Planned wave-3 |
| URS-B-002 | Hawkeye SHALL provide **AI reportability classifier** that suggests Reportable / Non-reportable / CS-only based on narrative + product class + jurisdiction, with confidence + citations to 21 CFR 803 / EU MDR articles. | Reportability decision is high-risk, often delayed; AI suggestion accelerates triage | SHOULD | ⏳ Planned wave-3 |
| URS-B-003 | Hawkeye SHALL provide **AI root-cause hint generator** that proposes RCA paths (5-Why starting points) based on complaint narrative + linked batch/lot data. | Investigator accelerator; reduces blank-page paralysis | SHOULD | ⏳ Planned wave-3 |
| URS-B-004 | Every AI output SHALL be **grounded + cited + confidence-scored + auditor-reviewable** with full reproducibility. | Part-11-grade AI traceability (canonical Hawkeye posture) | MUST | ✅ `groundedGenerationService` foundation |
| URS-B-005 | A **single-pane complaint cockpit** SHALL show intake + triage + investigation + linkages + comms history in one screen (no tab-hopping). | UX wedge vs Veeva/MasterControl multi-screen flows | MUST | ✅ `ComplaintDetail` hub |
| URS-B-006 | A **trending dashboard** SHALL roll up complaints per product per period with severity weighting; auto-flag emerging trends (>2σ above baseline). | Regulator-required (820.198(e)) and a real differentiator vs spreadsheet trending | SHOULD | ⚠️ Basic trending widget; auto-flag planned |
| URS-B-007 | System SHALL **cross-link Complaint → Risk reassessment** when complaint reveals new risk or invalidates existing risk control. | Risk module integration; closes the QMS loop | SHOULD | ⚠️ Manual link today; auto-suggest planned |
| URS-B-008 | An **email ingestion pipeline** SHALL convert customer-emailed complaints into structured intake records with AI-extracted fields. | Reduces manual entry burden for CS reps | SHOULD | ⏳ Planned (mailbox webhook + AI extractor) |

---

## 5. Out-of-Scope (Explicitly Hand-Off)

- **CAPA execution** → CAPA module (Complaint spawns CAPA via `ComplaintLink`)
- **Deviation investigation depth** → Deviation module
- **Change Control workflow** → Change Control module
- **Recall management** → out-of-scope this release (flagged for VP review only)
- **Regulator submission portal integration** (FDA eMDR API, EU Eudamed) → infra backlog
- **Customer-facing portal** for self-submission and status visibility → planned, separate module

---

## 6. Assumptions and Dependencies

- **Multi-tenant model:** every complaint belongs to a `tenantOrgId`
- **Storage:** attachments in S3-backed HawkVault; complaint metadata in MongoDB
- **E-signature:** password-based today
- **LLM availability:** AI features degrade to manual workflow if down
- **Notification channels:** email default; in-app banner for escalations
- **Regulator timeline calculator:** jurisdiction config drives day-count rules (calendar vs business days)

---

## 7. Acceptance Criteria

| URS ID range | Verification approach |
|---|---|
| A1 (intake) | E2E test `frontend/e2e/complaint-intake.spec.ts` |
| A2 (triage) | E2E + similarity AI eval (when shipped) |
| A3 (investigation) | E2E + RCA form unit tests |
| A4 (resolution + linkage) | Cross-module integration test (Complaint → CAPA) |
| A5 (reportable + regulator) | E2E + deadline-calculator unit tests; e-sig E2E |
| A6 (closure) | E2E `complaint-closure.spec.ts` |
| A7 (audit trail) | Cross-module trail query test |
| A8 (RBAC) | Permit middleware tests |
| B1–B8 (white-space) | AI eval suites + trending dashboard KPIs |

---

## 8. Open Questions

1. **Reportability AI** — when does wave-3 ship? What's the eval criterion (precision/recall on labeled history)?
2. **Email ingestion (URS-B-008)** — which mailbox provider (Gmail API, IMAP, M365 Graph)? Per-tenant config?
3. **Trending auto-flag thresholds** — fixed at >2σ, or per-tenant configurable?
4. **Regulator portal integration priority** — FDA eMDR first, EU Eudamed second, or parallel?
5. **Customer-facing portal scope** — read-only status, or full re-submission ability?
6. **Closure gating on linked CAPA** — current design closes complaint independently; should we offer per-tenant config to require CAPA closure?
7. **Multi-jurisdiction reporting** — if same complaint requires MDR + EU MIR + Health Canada, how to manage parallel submissions?
8. **PII handling in narrative** — auto-redact customer PII before AI processing? Today: redact + un-redact on receipt (via `groundedGenerationService`).

---

## 9. Traceability Index (URS ↔ Code)

| URS section | Primary code | Primary UI |
|---|---|---|
| A1 intake | `controllers/complaintIntakeController.js`, `services/complaintIntakeService.js` | `/complaints/new`, `/complaints` |
| A2 triage | `controllers/complaintTriageController.js` | `/complaints/[id]/triage` |
| A3 investigation | `controllers/complaintInvestigationController.js` | `/complaints/[id]/investigation` |
| A4 resolution + linkage | `controllers/complaintResolutionController.js`, `services/complaintLinkService.js` | `/complaints/[id]/resolve` |
| A5 reportable | `controllers/complaintRegulatorController.js` | `/complaints/[id]/regulator` |
| A6 closure | `controllers/complaintClosureController.js` | `/complaints/[id]/closure` |
| A7 audit trail | `services/auditTrailService.js` | `/complaints/[id]/audit-log` |
| A8 RBAC | `middlewares/{authMiddleware,roleMiddleware}.js` | route-level page guards |
| B1 similarity AI | `services/ai/complaintSimilarityAgent.js` (planned) | triage panel |
| B2 reportability AI | `services/ai/reportabilityClassifier.js` (planned) | triage panel |
| B3 RCA AI | `services/ai/rootCauseHintAgent.js` (planned) | investigation panel |
| B5 cockpit | `frontend/components/complaints/ComplaintDetail.tsx` | `/complaints/[id]` |
| B8 email ingestion | `services/complaintEmailIngestService.js` (planned) | mailbox webhook |
