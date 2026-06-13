# URS — Audit Management

| Field | Value |
|---|---|
| Module | Audit Management |
| Owner | Product (S.M.A.R.T. Hawk Platform) |
| Status | DRAFT (reverse-engineered from current code) |
| Version | 0.1 |
| Last updated | 2026-05-31 |
| Regulatory anchors | 21 CFR Part 11, ICH Q7 §13/§19, ICH Q10 §2.7, EU GMP Annex 11, EU GMP Annex 16, EU GMP Ch.1/Ch.7, ISO 9001 §8.7/§9.2, USP, PIC/S |
| Source | Reverse-engineered from `backend/src/{routes,controllers,services,models}/audit*.js` + `frontend/app/(console)/{audits,auditor,supplier/audits}/` + `backend/src/services/ai/**` |

---

## 1. Purpose and Scope

**Purpose.** S.M.A.R.T. Hawk Audit Management is the platform's primary workflow module for **end-to-end supplier audits** in regulated industries (pharma, med-device, food, automotive, aerospace). It orchestrates the full lifecycle from audit request creation through closure certificate, with 21 CFR Part 11–grade audit trail and e-signature enforcement on every regulated action.

**In scope:**
- Audit request lifecycle (initiation → surveillance) across 8 phases
- Multi-persona workflow (buyer, auditor, supplier; co-auditor) with role-gated UIs
- E-signature ceremony on intimation, observation, closure (Part 11 / Annex 11)
- AI-assisted observation drafting, supplier intel, auditor coaching, real-time follow-up suggestions
- Remote-audit cockpit (Zoom/Teams session + recording capture)
- Per-observation CAPA generation (handed off to CAPA module)
- Cross-tenant auditor affiliation model (a third-party auditor can serve multiple buyer tenants without leak)

**Out of scope (handed off):**
- CAPA execution lifecycle → `06-modules/capa/`
- Document Control vault (HawkVault) → `06-modules/document-control/`
- Supplier prequalification scoring → `06-modules/supplier-prequalification/`
- Marketplace listing of auditors → `06-modules/marketplace/`
- AskHawk Q&A / regulations corpus → `06-modules/askhawk/`

---

## 2. Stakeholders and Personas

| Persona | Role | Goals | Pain points without this module |
|---|---|---|---|
| **Buyer / Audit Program Manager** (e.g., Priya Nair, Karan Mehta) | Initiates audits, assigns auditors, approves closure | Run an audit programme across 200–1,200 suppliers; only 30–60 onsite/year today; rest paper-screened, late | CAPAs run in email; findings re-litigated every cycle |
| **Lead Auditor** (e.g., Maria Santos) | Plans, executes, drafts findings, signs report | Draft regulator-grade observations w/ citations; reuse prior findings; consistent severity calls | Manual report drafting in Word; inconsistent language; no citation tooling |
| **Co-Auditor** (e.g., Rahul Kapoor) | Adds notes, witnesses report (view + comment) | Contribute observations without signing authority | No shared audit workspace; pass docs via email |
| **Supplier QA Head** (e.g., Asha Sharma) | Accepts/rejects intimation, signs e-sig, owns PAQ + CAPA response | Single inbox; auditable acceptance ceremony; structured PAQ response | Multiple email threads; lost evidence; CAPA tracking in spreadsheets |
| **Supplier Operations** (Amit, Deepa, Raj, Meera) | Section owners filling questionnaire responses | Assignable per section; can attach evidence | Whole questionnaire handled by one bottleneck |
| **VP Quality / Audit Chair** (e.g., Dr Elena Vasquez) | Final approver on closure; reviews compliance dashboard | Roll-up of audit programme health; risk surveillance | Annual board reviews built from spreadsheets |
| **Tenant Admin** (platform side) | Configures audit types, RBAC, e-sig policy | Per-tenant tuning of templates, severity rubrics, notification matrix | Vendor controls everything |

---

## 3. Part A — Foundational Requirements

These are the **must-meet** requirements derived from regulatory baselines + table-stakes industry expectations. Each tagged with the live route/code path implementing it (if any) and the primary regulatory anchor.

### A1. Audit Request Lifecycle

| ID | Requirement | Persona | Reg anchor | MoSCoW | Current state |
|---|---|---|---|---|---|
| URS-A-001 | Buyer SHALL create an audit request for a supplier + site + product scope, with assessment type and target compliance date. | Buyer | ICH Q10 §2.7 | MUST | ✅ `POST /api/audit-requests` |
| URS-A-002 | Each audit request SHALL receive a globally unique `internalRequestId` (e.g., `HAWK0000000001`) AND a tenant-scoped `supplierRequestId`. | System | 21 CFR Part 11 §11.10 | MUST | ✅ `requestIdService` |
| URS-A-003 | Buyer SHALL assign one lead auditor + zero-or-more co-auditors, filtered by qualification + active affiliation + COI declarations + availability windows. | Buyer | ICH Q7 §13.20 | MUST | ✅ `POST /api/audit-requests/:id/assign-auditors`, `GET /api/auditors/available` |
| URS-A-004 | Auditor SHALL accept or reject assignment (auditorDecision: PENDING → ACCEPTED \| REJECTED); a rejection SHALL block downstream phase progression. | Auditor | ICH Q7 §13.20 | MUST | ✅ phaseService.canTransition() |
| URS-A-005 | Supplier SHALL accept, reject, or propose alternative dates (supplierDecision). | Supplier | ISO 9001 §8.4 | MUST | ✅ `POST /api/audit-requests/:id/supplier-decision` |
| URS-A-006 | System SHALL surface a "Phase 0 deficiency validation" gate where supplier disputes/accepts pre-audit findings before formal audit begins. | Supplier | ICH Q7 §13.21 | MUST | ✅ `POST /api/audit-requests/:id/deficiency-validation` |

### A2. Audit Phases (8-Phase State Machine)

| ID | Requirement | Persona | Reg anchor | MoSCoW | Current state |
|---|---|---|---|---|---|
| URS-A-010 | The system SHALL model the audit lifecycle as 8 phases: **INITIATED → PREP → PLANNING → EXECUTION → FINDINGS → CAPA → CLOSURE → SURVEILLANCE**. | System | ICH Q10 §2.7 | MUST | ✅ `auditPhaseService` + `auditPhases.js` constants |
| URS-A-011 | Each phase SHALL track: currentPhase, status (NOT_STARTED / IN_PROGRESS / COMPLETED / BLOCKED), ownerRole, startedAt, completedAt, blockers[]. | System | 21 CFR Part 11 §11.10(e) | MUST | ✅ embedded `phaseState` in AuditRequestsMaster |
| URS-A-012 | Phase transitions SHALL be **forward-only** unless explicit revert authorized by tenant_admin/superadmin. | System | ALCOA+ "Original" | MUST | ✅ enforced in `canTransition()` |
| URS-A-013 | Every phase transition SHALL write an AuditTrail row with actor, reasonForChange, before/after, timestamp. | System | 21 CFR Part 11 §11.10(e) | MUST | ✅ `writeAuditTrail()` called from `auditPhaseController` |
| URS-A-014 | The UI SHALL render the current phase + completed/upcoming phases via `AuditPhaseStepper` accessible to all personas with read access. | All | UX baseline | MUST | ✅ frontend component |
| URS-A-015 | Tab access in the audit detail view SHALL be gated by phase state (e.g., Report tab disabled until questionnaire released). | All | UX safety | SHOULD | ✅ `AuditRequestTabs` guards |

### A3. Intimation Letter + E-Signature (G1 Gate)

| ID | Requirement | Persona | Reg anchor | MoSCoW | Current state |
|---|---|---|---|---|---|
| URS-A-020 | System SHALL produce an INTIMATION_LETTER artifact when buyer initiates an audit, with auditor + supplier + scope + tentative dates. | System | ICH Q7 §13.20, ISO 19011 §6.3 | MUST | ✅ `POST /api/audits/:id/artifacts` (type=INTIMATION_LETTER) |
| URS-A-021 | Supplier SHALL sign the intimation letter with 21 CFR Part 11 e-signature ceremony (password + reason for signing) before PREP phase can start. | Supplier | 21 CFR Part 11 §11.50 + §11.200 | MUST | ✅ `POST /api/audits/:auditId/intimation/sign` + SignatureDialog UI |
| URS-A-022 | The e-signature record SHALL capture: signerId, signerRole, signatureMeaning (APPROVED), authMethod, reasonForChange, IP address, user agent, timestamp. | System | 21 CFR Part 11 §11.200 | MUST | ✅ ElectronicSignature model |
| URS-A-023 | Without a valid intimation signature, the system SHALL block transition to PREP phase. | System | 21 CFR Part 11 §11.10(j) | MUST | ⚠️ Soft-mode by default; hard mode requires `ENFORCE_ESIG=hard` env var |

### A4. Pre-Audit Questionnaire (PAQ) + Supplier Response

| ID | Requirement | Persona | Reg anchor | MoSCoW | Current state |
|---|---|---|---|---|---|
| URS-A-030 | System SHALL provide a PRE_AUDIT_QUESTIONNAIRE artifact type with structured questions (radio/checkbox/text/attachment/date), risk categories, regulatory references. | System | ICH Q7 §13.20 | MUST | ✅ AuditArtifact + SmartQuestion component |
| URS-A-031 | Supplier QA Head SHALL be able to **assign individual sections** to department heads (Production, Maintenance, QC) for parallel response. | Supplier | UX baseline | MUST | ✅ `/supplier/audits/[id]/assign-sections` page |
| URS-A-032 | Each response field SHALL accept free-text + structured value + attachments (PDF, image, audio). | Supplier | Evidence completeness | MUST | ✅ SmartQuestion |
| URS-A-033 | System SHALL support **OCR + LLM auto-fill** of questionnaire fields from supplier-uploaded source documents (with per-field confidence + source citation). | System | UX accelerator | SHOULD | ✅ `aiPrefillController` + `auditAutofillAgent` (partial; doc-pipeline not fully wired) |
| URS-A-034 | Submission status SHALL flow: draft → in_progress → supplier_submitted → auditor_review_pending → followup_requested \| approved. | System | Audit-trail completeness | MUST | ✅ workflow milestone codes |

### A5. Audit Execution + Scope Curation (G5 Gate)

| ID | Requirement | Persona | Reg anchor | MoSCoW | Current state |
|---|---|---|---|---|---|
| URS-A-040 | Lead auditor SHALL build an EXECUTION_QUESTIONNAIRE by curating in-scope questions from the PAQ pool (with category/subcategory filtering). | Auditor | ICH Q7 §13.20 | MUST | ✅ `POST /api/audits/:auditId/execution/scope`, `/execution-builder` page |
| URS-A-041 | The execution scope SHALL be **lockable** (`/execution/finalize`) after which no questions can be added or removed without revert+re-sign. | Auditor | Audit-trail integrity | MUST | ✅ executionScopeController |
| URS-A-042 | During execution, system SHALL support per-response live evidence: notes (text), photos, audio recordings with transcript. | Auditor | Evidence completeness | SHOULD | ✅ AuditNote model (text/photo/audio); transcript field present |
| URS-A-043 | For REMOTE / HYBRID audits, system SHALL provision a video session (Zoom or Teams) with recording capture stored to HawkVault. | All | Remote-audit reality | MUST | ✅ RemoteSession model + `/api/audits/:id/remote-sessions` (provider/meetingUrl/recordingAssetId) |

### A6. Findings + Observation Drafting (G12 Gate — AI-Assisted)

| ID | Requirement | Persona | Reg anchor | MoSCoW | Current state |
|---|---|---|---|---|---|
| URS-A-050 | Auditor SHALL be able to draft an observation manually OR invoke AI-assisted drafting from selected interview excerpts + evidence + response quotes. | Auditor | UX accelerator | MUST | ✅ `POST /api/audits/:id/observations/draft` + `ObservationDrafterButton` |
| URS-A-051 | AI-drafted observation SHALL include: title, observation text, classification (GMP_OBSERVATION_CLASSIFICATIONS enum), severity, recommendedCAPA, citations[], confidence score. | System | UX safety | MUST | ✅ groundedGenerationService output schema |
| URS-A-052 | AI draft SHALL be rejected if confidence < 0.6 OR if no citations are produced (skeleton fallback preserves citations only). | System | Grounding requirement | MUST | ✅ DEFAULT_MIN_CONFIDENCE = 0.6, requireCitations=true |
| URS-A-053 | All AI drafts SHALL be REVIEWED by the auditor before persistence; UI presents draft + auditorCoach feedback (clarity/regulatory/evidence-coverage scores) for editing. | Auditor | Human-in-loop | MUST | ✅ AuditorCoachPanel, ObservationDrafterButton modal preview |
| URS-A-054 | Each AI invocation SHALL produce an AuditTrail row with: feature, modelVersion, promptHash, promptVersion, retrievalSet[], confidence, tokensInput, tokensOutput, latencyMs. | System | 21 CFR Part 11 + reproducibility | MUST | ✅ `recordAiDecision()` |
| URS-A-055 | User disposition of AI draft (USER_ACCEPTED / USER_EDITED / USER_REJECTED / SUPERSEDED) SHALL be captured and feed the active-learning loop. | System | Reproducible AI | SHOULD | ✅ `POST /api/ai/decisions/outcome`; active-learning loop scaffolded |

### A7. Audit Report + Closure Certificate (G8 Gate)

| ID | Requirement | Persona | Reg anchor | MoSCoW | Current state |
|---|---|---|---|---|---|
| URS-A-060 | System SHALL assemble a FINAL_REPORT artifact from findings + observations + CAPAs + evidence, with integrity hash (SHA-256). | System | ALCOA+ "Enduring" | MUST | ✅ `POST /api/audits/:id/report/draft` + `AuditReportGenerator` (anchor incomplete) |
| URS-A-061 | Auditor SHALL sign the report with e-signature (signatureMeaning=AUTHORED); buyer SHALL counter-sign (signatureMeaning=APPROVED); optionally supplier signs as WITNESSED. | Auditor, Buyer | 21 CFR Part 11 §11.50 | MUST | ✅ `POST /api/audits/:id/report/sign` (multi-role) |
| URS-A-062 | An AUDIT_CLOSURE_CERTIFICATE artifact SHALL be created with outcome (APPROVED \| REJECTED), validUntil, findings summary. | Auditor | ICH Q7 §13.20 | MUST | ✅ `POST /api/audits/:id/closure-certificate` |
| URS-A-063 | Buyer SHALL approve the closure certificate (e-sig); only on dual signature does the audit transition to CLOSURE phase. | Buyer | ICH Q7 §13.20 | MUST | ✅ `POST /api/audits/:id/closure-certificate/approve` |
| URS-A-064 | A REJECTED outcome SHALL block the supplier from progressing to qualified status; SHALL trigger CAPA recommendation flow. | System | Risk control | MUST | ✅ outcome enum + downstream CAPA hand-off |

### A8. RBAC, Tenant Isolation, COI

| ID | Requirement | Persona | Reg anchor | MoSCoW | Current state |
|---|---|---|---|---|---|
| URS-A-070 | System SHALL enforce role-based access via middleware on every audit endpoint; minimum role set: buyer, auditor, supplier, supplierUser, tenant_admin, admin, superadmin. | System | 21 CFR Part 11 §11.10(d) | MUST | ✅ `authenticate` + `permit(...roles)` middleware |
| URS-A-071 | A third-party auditor working with multiple buyer tenants SHALL only see audits where they have active affiliation (no cross-tenant leak). | System | Multi-tenant safety | MUST | ✅ `canAuditorAccessAudit()` + `buildAuditTenantScopeQuery()` |
| URS-A-072 | Auditor selection dropdown SHALL filter by: active affiliation, qualification, COI declarations, date availability (AvailabilityBlock). | Buyer | ICH Q7 §13.20 (auditor independence) | MUST | ✅ `GET /api/auditors/available` |
| URS-A-073 | Auditors SHALL be able to mark unavailable periods (blackout) which are honored by the availability filter. | Auditor | Scheduling reality | MUST | ✅ AvailabilityBlock model + auditor self-service routes |

### A9. Audit Trail + Data Integrity (ALCOA+)

| ID | Requirement | Persona | Reg anchor | MoSCoW | Current state |
|---|---|---|---|---|---|
| URS-A-080 | System SHALL maintain an AuditTrail row for **every state change, signature, and AI decision** with: tenantId, actorId, actorRole, action, reasonForChange (mandatory), before/after, timestamp. | System | 21 CFR Part 11 §11.10(e) | MUST | ✅ `auditTrailService.writeAuditTrail()` cross-module |
| URS-A-081 | Audit trail rows SHALL be **immutable** (no UPDATE or DELETE) and queryable cross-module by entity. | System | ALCOA+ | MUST | ✅ `GET /api/audit-trail/by-entity` |
| URS-A-082 | Reason-for-change SHALL be required ≥10 characters and never auto-defaulted. | System | ALCOA+ "Contemporaneous" | MUST | ✅ SignatureDialog validation |
| URS-A-083 | System SHALL support data integrity field-level diffs (changeBrief.fields[]) so auditors can answer "what changed and why". | System | ALCOA+ "Attributable" | MUST | ✅ meta.changeBrief in AuditTrail |

### A10. Notifications + Reminders

| ID | Requirement | Persona | Reg anchor | MoSCoW | Current state |
|---|---|---|---|---|---|
| URS-A-090 | System SHALL notify stakeholders on key events: intimation signed, schedule confirmed, PAQ released, observations drafted, closure approved. | All | UX baseline | MUST | ✅ NotificationOrchestratorService |
| URS-A-091 | Overdue tasks SHALL surface reminders to the responsible persona's dashboard. | All | UX baseline | SHOULD | ⚠️ Partial |

---

## 4. Part B — Differentiator (White-Space) Requirements

Where S.M.A.R.T. Hawk **competes and wins** beyond the regulatory baseline. Anchored to the strategic positioning in `00-strategy-and-pitch/MASTER-REFERENCE.pdf`.

| ID | Requirement | Strategic rationale | MoSCoW | Current state |
|---|---|---|---|---|
| URS-B-001 | S.M.A.R.T. Hawk SHALL bundle **video session + screen-share + in-tool evidence annotation** in a single remote-audit cockpit (no incumbent does this). | Wedge vs Veeva/MasterControl ($30K+ floor, no remote tooling) and Qualifyze (marketplace, no annotation) | MUST | ⚠️ Foundation present (RemoteSession + recordingAssetId); cockpit UI deferred (gap G7) |
| URS-B-002 | S.M.A.R.T. Hawk SHALL provide a **supplier-first portal** with single-inbox audit acceptance + section assignment + CAPA response (only Qualifyze advertises this; ours goes deeper). | Supplier-first is uncontested in incumbents | MUST | ✅ `/supplier/audits/*` pages |
| URS-B-003 | Every AI output SHALL be **grounded + cited + confidence-scored + auditor-reviewable** with full reproducibility (modelVersion, promptHash, retrievalSet, confidence captured in audit trail). | No competitor offers Part-11-grade AI traceability today | MUST | ✅ groundedGenerationService + AuditTrail.ai.* fields |
| URS-B-004 | An **active-learning loop** SHALL capture user disposition of every AI draft, compute acceptance rates by feature, and propose prompt/retrieval variants for A/B testing (human-approved). | Compounding moat: every customer improves the model | SHOULD | ⚠️ Scaffolded in `activeLearningLoop.js`; auto-tuning not wired |
| URS-B-005 | An **auditor coach panel** SHALL privately review draft observations (clarity / regulatory-alignment / evidence-coverage scores) + offer growth-plan trends across audits. | Career-development moat; auditor retention tool | MUST | ✅ AuditorCoachPanel + `/api/ai/coach/auditors/:id/growth-plan` |
| URS-B-006 | **Cross-company audit intel** SHALL surface (with consent) when the same supplier was audited by another buyer tenant — flagging known-recurring findings. | Network effects of multi-tenant data | SHOULD | ⚠️ supplierIntelAgent fuses tenant + public; cross-tenant findings not yet surfaced |
| URS-B-007 | A **predictive CAPA-effectiveness** model SHALL flag low-likelihood-of-success CAPA proposals at draft time. | Reduces re-litigation cycles | SHOULD | ⚠️ Exists in Wave 3; not yet wired to observation drafter |
| URS-B-008 | A **plan-then-execute App Wizard** SHALL allow a buyer to express an audit goal in natural language ("Create an audit for Sanpras with Maria as lead auditor on Aug 15") and the system produces a reviewable plan that creates AuditRequest + assigns auditor + drafts intimation, gated by single e-signature. | Co-worker UX, not just Q&A | MUST | ✅ `wizard.create_audit` tool + `multiStepAgent.js` + WizardStepper UI |
| URS-B-009 | A **cross-module audit-trail browser** SHALL let a regulator inspect "every change to every record" with field-level diffs in <2 sec across CAPA/Deviation/Change/Doc Control/Audit. | Inspector-readiness as a product feature | MUST | ✅ `GET /api/audit-trail/by-entity` cross-module |
| URS-B-010 | S.M.A.R.T. Hawk SHALL price for SMB pharma (<$30K floor) — feature-complete, not stripped — to capture the white-space below Veeva. | Below-Veeva floor is uncontested | MUST | 🚫 Business model (not module feature) |
| URS-B-011 | An **observation drafter "honest fallback"** SHALL be invoked when retrieval/confidence is insufficient, producing a deterministic skeleton WITH citations rather than a hallucinated draft. | Anti-hallucination posture | MUST | ✅ groundedGenerationService skeleton path |
| URS-B-012 | All audit-trail entries SHALL be **anchorable to a cryptographic timestamp authority** (TSA) for tamper-evidence beyond DB integrity. | Inspector trust beyond "we promise" | SHOULD | ⚠️ SHA-256 hash on reports exists; TSA integration not wired |
| URS-B-013 | **Industry-agnostic engine** — same lifecycle/state-machine/RBAC SHALL serve med-device (ISO 13485), food (FSSC 22000), auto (IATF 16949), aerospace (AS9100) audits via configurable templates + clause libraries, not forking the code. | One platform, many vertical packs (canon strategy) | MUST | ✅ Core engine generic; vertical packs via `assessment-types` + clause libraries |

---

## 5. Out-of-Scope (Explicitly Hand-Off)

- **CAPA execution workflow** beyond initial CAPA creation → handed to CAPA module. Audit module creates linked CAPA records; CAPA module owns the lifecycle (intake / triage / investigation / RCA / action / effectiveness / closure).
- **Document Control vault** (storage, version control, retention) → HawkVault / Document Control module. Audit module references documents by `assetId`.
- **Supplier prequalification scoring** → Supplier Prequalification module. Audit module reads supplier risk score; doesn't compute it.
- **Auditor marketplace listings** (matching, pricing, contracts) → Marketplace module.
- **AskHawk Q&A surface** (regulations corpus, SOP library, workflow playbooks) → AskHawk module. Audit module's AI components consume some of the same corpus but are domain-specific.
- **AskHawk App Wizard tools themselves** (registration, RBAC, e-sig wrapper) → AskHawk + AI runtime modules. Audit module is the consumer.
- **Risk Management module** (FMEA, risk register) → Risk module. Audit findings can link to risk records.

---

## 6. Assumptions and Dependencies

- **Multi-tenant model:** every audit belongs to a `tenantOrgId`; cross-tenant access is by explicit `Affiliation` records (auditor ↔ buyer-tenant).
- **Time/timezone:** schedules stored UTC; UI renders in user timezone preference.
- **E-signature method:** password-based today (user's own password, bcrypt-verified). Token-based + biometric are future paths.
- **LLM availability:** AI features degrade gracefully if LLM provider down (skeleton fallback for observations; manual paths always available).
- **Storage:** evidence/recordings in S3-backed HawkVault; metadata in MongoDB.
- **Notification channels:** email by default; SMS/push are configurable.

---

## 7. Acceptance Criteria

| URS ID range | Verification approach |
|---|---|
| A1–A2 (lifecycle + state machine) | E2E test in `frontend/e2e/audit-lifecycle.spec.ts` |
| A3 (intimation + e-sig) | Manual test per `09-test-reports/walkthrough-report.pdf`; backend test in `backend/__tests__/intimationSignature.test.js` (TODO if missing) |
| A4 (PAQ) | E2E in `frontend/e2e/persona-demo-walk.spec.ts` (supplier persona); unit tests in autoFillController |
| A5 (execution) | Manual demo path in `00-strategy-and-pitch/demo-assets/07-pharma-demo-script.md` §execution |
| A6 (observation AI) | Eval suite in `backend/src/services/ai/evals/` per-feature; manual auditor review per AskHawk decisions runbook |
| A7 (closure) | E2E `audit-closure.spec.ts`; manual reg-walkthrough checklist |
| A8 (RBAC) | `tests/middlewares/permit.test.js` + cross-tenant guard tests |
| A9 (audit trail) | E2E sample audit → query `/api/audit-trail/by-entity` → confirm row per state change |
| B1–B13 (white-space) | Demo script (B1, B2, B5, B8, B9); active-learning dashboard (B4); KPIs in operational dashboards |

---

## 8. Open Questions

1. **Hard vs soft e-sig mode** — should the default flip from `soft` (warn + allow) to `hard` (block) for production tenants? Currently controlled by `ENFORCE_ESIG` env var.
2. **Legacy `trackStatus` deprecation** — when do we sunset the text-string status field in favor of `phaseState` only? Sync logic in `auditWorkflowSyncService` is bridging today.
3. **Closure certificate template** — should we ship per-vertical templates (pharma vs med-device vs food) at launch, or one generic template?
4. **Auditor coach privacy boundary** — coach feedback is private to the auditor today; should buyer/tenant-admin have aggregate visibility (without per-auditor identification) for programme health?
5. **TSA integration** (URS-B-012) — which TSA provider? Cost/regulatory considerations.
6. **Co-auditor signing** — co-auditors are read-only today; do regulators expect them to also sign as WITNESSED?
7. **Remote-audit cockpit UI (G7)** — deferred gap; when do we ship the consolidated video + annotation + evidence UX?
8. **Cross-tenant supplier intel** (URS-B-006) — what's the consent model for surfacing "another buyer found X at this supplier"?

---

## 9. Traceability Index (URS ↔ Code)

| URS section | Primary code | Primary UI |
|---|---|---|
| A1 lifecycle | `controllers/auditRequestController.js`, `services/auditPhaseService.js` | `/audits`, `/audits/[id]` |
| A2 phases | `services/auditPhaseService.js`, `constants/auditPhases.js` | `AuditPhaseStepper`, `AuditRequestTabs` |
| A3 intimation + e-sig | `controllers/intimationSignatureController.js`, `middlewares/requireESignature.js` | `SignatureDialog`, `/audits/[id]/closure` (similar pattern) |
| A4 PAQ | `controllers/auditPhaseController.js` (artifacts), `controllers/autoFillController.js` | `/audits/[id]/questionnaire`, `/audits/[id]/artifacts`, `SmartQuestion` |
| A5 execution | `controllers/executionScopeController.js` | `/audits/[id]/execution-builder` |
| A6 observations | `controllers/observationDrafterController.js`, `services/ai/wave2/observationDrafter.js`, `services/groundedGenerationService.js` | `ObservationDrafterButton`, `AuditorCoachPanel` |
| A7 closure | `controllers/auditClosureController.js`, `controllers/reportController.js` | `/audits/[id]/closure`, `/audits/[id]/report` |
| A8 RBAC | `middlewares/authMiddleware.js`, `roleMiddleware.js`, `utils/auditAccess.js` | All page-level role guards |
| A9 audit trail | `services/auditTrailService.js`, `models/AuditTrail.js` | `/audits/[id]/audit-log` |
| B1 remote cockpit | `controllers/remoteAuditController.js`, `models/RemoteSession.js` | (cockpit UI deferred) |
| B3 grounded AI | `services/groundedGenerationService.js`, `services/ai/audit-trail/recordAiDecision.js` | `AuditorCoachPanel`, `ObservationDrafterButton` |
| B8 App Wizard | `services/ai/wave2/{wizardTools,multiStepAgent,toolCallingRuntime}.js` | `WizardStepper` (in AskHawkDrawer + ComplianceCopilot) |
| B9 cross-module trail | `services/auditTrailService.js`, `controllers/auditTrailController.js` | `/audits/[id]/audit-log` (could be cross-module browser in future) |
