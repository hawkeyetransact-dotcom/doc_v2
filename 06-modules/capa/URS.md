# URS — CAPA (Corrective + Preventive Action)

| Field | Value |
|---|---|
| Module | CAPA |
| Owner | Product (Hawkeye Platform) |
| Status | DRAFT (reverse-engineered from current code + canon) |
| Version | 0.1 |
| Last updated | 2026-06-01 |
| Regulatory anchors | 21 CFR Part 11, 21 CFR 820.100 (Quality System Regulation — CAPA), ICH Q10 §3.2.2, EU GMP Ch.1 §1.4, ISO 9001 §10.2, ISO 13485 §8.5.2 |
| Source | Reverse-engineered from `backend/src/{routes,controllers,services,models}/capa*.js` + `frontend/components/capa/` + `backend/src/services/ai/**/capa*` |

---

## 1. Purpose and Scope

**Purpose.** Hawkeye CAPA manages the end-to-end **corrective and preventive action lifecycle** — from initial intake (triggered by an audit observation, deviation, complaint, change-control review, or internal QMS review) through triage, investigation, root-cause analysis, action planning, execution, effectiveness verification, and signed closure. Every regulated action carries 21 CFR Part 11 e-signature + immutable audit trail.

**In scope:**
- CAPA intake from all upstream trigger types (Audit, Deviation, Complaint, Change Control, Management Review)
- Triage classification (No-CAPA / Correction-only / Formal CAPA) with documented rationale
- Investigation workspace (problem statement, scope, immediate containment)
- Root-cause analysis (5-Why, fishbone, fault tree) with AI scaffolding
- Action plan (multiple actions, each with owner + due date + verification method)
- Action execution tracking
- Effectiveness check (planned + executed verification, evidence required)
- Signed closure (Buyer / QA Head e-signature, dual where required)
- Full cross-module trace (link back to triggering record)

**Out of scope (handed off):**
- Audit findings drafting (CAPA consumes them) → [audit-management](../audit-management/URS.md)
- Deviation classification / RCA upstream of CAPA creation → [deviation](../deviation/URS.md)
- Change-control workflow → [change-control](../change-control/URS.md)
- Complaint intake + triage → `06-modules/complaint-management/`
- Document Control vault → `06-modules/document-control/`
- Risk register updates → `06-modules/risk-management/`

---

## 2. Stakeholders and Personas

| Persona | Role | Goals | Pain points without this module |
|---|---|---|---|
| **QA Head** | CAPA owner + final approver | Run a defensible CAPA programme; close on time; show inspector "effectiveness verified" | CAPAs run in spreadsheets; no effectiveness loop; re-finds same issue audit-after-audit |
| **Investigator** (CAPA Lead) | Owns RCA + action plan drafting | Structured RCA with citations to prior cases; reuse known-good corrective actions | Free-text Word docs; inconsistent RCA depth; no historical pattern surfacing |
| **Action Owner** (Production / Engineering / QA) | Executes assigned actions | Clear deadline + evidence requirement | Email assignments; missed deadlines; lost evidence |
| **Supplier QA** (for supplier-side CAPAs) | Responds to externally-triggered CAPA | Single inbox; structured response back to buyer | Email ping-pong; buyer can't see progress |
| **Buyer / QA Head Approver** | Signs CAPA closure (e-sig) | 21 CFR Part 11 ceremony; evidence package available at one click | No signed closure; no audit-ready package |
| **Tenant Admin** | Configures triage matrix, severity rubric, approval routing | Per-tenant tuning of who must sign what | Vendor controls everything |

---

## 3. Part A — Foundational Requirements

### A1. CAPA Intake + Trigger Linkage

| ID | Requirement | Persona | Reg anchor | MoSCoW | Current state |
|---|---|---|---|---|---|
| URS-A-001 | System SHALL accept CAPA intake from 5 trigger types: AUDIT_OBSERVATION, DEVIATION, COMPLAINT, CHANGE_CONTROL, INTERNAL_REVIEW. | All | 21 CFR 820.100(a)(1) | MUST | ✅ `CAPATrigger` model + `POST /api/capa` |
| URS-A-002 | Each CAPA SHALL receive a tenant-scoped unique ID (e.g., `CAPA-2026-000123`). | System | 21 CFR Part 11 §11.10 | MUST | ✅ `requestIdService.generateCapaId()` |
| URS-A-003 | Each CAPA SHALL link to its triggering record (auditId, deviationId, complaintId, changeControlId) with bidirectional reference. | System | ICH Q10 §3.2.2 | MUST | ✅ `CAPA.triggers[]` + back-references on source modules |
| URS-A-004 | The intake form SHALL capture: problem statement, immediate containment taken, severity hint, requested-by, requested-due-date. | Initiator | ISO 9001 §10.2 | MUST | ✅ `CapaIntakeForm` component |

### A2. Triage + Classification

| ID | Requirement | Persona | Reg anchor | MoSCoW | Current state |
|---|---|---|---|---|---|
| URS-A-010 | QA Head SHALL triage each CAPA into one of: **No-CAPA** (with rationale), **Correction-only** (no formal CAPA), **Formal CAPA** (full lifecycle). | QA Head | 21 CFR 820.100(a)(2), ICH Q10 §3.2.2 | MUST | ✅ `POST /api/capa/:id/triage` |
| URS-A-011 | Triage decision SHALL require a documented rationale ≥10 characters; the decision SHALL be audit-trailed with reasonForChange. | System | 21 CFR Part 11 §11.10(e) | MUST | ✅ `auditTrailService` row on triage |
| URS-A-012 | "No-CAPA" closure SHALL still write a closure record + AuditTrail row (no orphaned triggers). | System | ALCOA+ "Complete" | MUST | ✅ `CAPA.status=CLOSED_NO_ACTION` path |

### A3. Investigation + Root Cause Analysis

| ID | Requirement | Persona | Reg anchor | MoSCoW | Current state |
|---|---|---|---|---|---|
| URS-A-020 | System SHALL provide an investigation workspace with: problem statement, scope, timeline, evidence attachments, witnesses. | Investigator | 21 CFR 820.100(a)(3) | MUST | ✅ `CAPAInvestigation` embedded sub-doc |
| URS-A-021 | System SHALL offer at least one structured RCA method: **5-Why** (with AI scaffolding via `capaRcaDrafter`). | Investigator | ICH Q10 §3.2.2 | MUST | ✅ `CapaRcaDrafter` component + `POST /api/capa/:id/rca/draft` |
| URS-A-022 | AI-drafted RCA SHALL include: each "why" step, supporting evidence, confidence score, suggested root cause. | System | UX accelerator | SHOULD | ✅ `capaRcaDrafter` Wave 2 agent |
| URS-A-023 | RCA SHALL be reviewable + editable by the investigator before persistence (human-in-loop). | Investigator | UX safety | MUST | ✅ `CapaRcaDrafter` review modal |
| URS-A-024 | RCA approval SHALL require QA-Head sign-off (no e-sig today; planned). | QA Head | ICH Q10 §3.2.2 | SHOULD | ⚠️ Approval step exists; e-sig wrapper deferred |

### A4. Action Plan

| ID | Requirement | Persona | Reg anchor | MoSCoW | Current state |
|---|---|---|---|---|---|
| URS-A-030 | System SHALL support multiple `CAPAAction` records per CAPA, each with: type (Corrective/Preventive), owner, due date, verification method, status. | System | 21 CFR 820.100(a)(4)(5) | MUST | ✅ `CAPAAction` model |
| URS-A-031 | Each action SHALL be assignable to a user (in-tenant) or external party (supplier user). | Investigator | ISO 9001 §10.2 | MUST | ✅ `CAPAAction.assigneeId` |
| URS-A-032 | Each action SHALL surface to the assignee's dashboard with overdue indicator. | All | UX baseline | MUST | ✅ `/my-tasks` page + dashboard widget |

### A5. Execution + Evidence

| ID | Requirement | Persona | Reg anchor | MoSCoW | Current state |
|---|---|---|---|---|---|
| URS-A-040 | Action owner SHALL be able to mark action complete + upload evidence (PDF, image, text). | Action Owner | 21 CFR 820.100(b) | MUST | ✅ `POST /api/capa/:id/actions/:actionId/complete` |
| URS-A-041 | Action completion SHALL require a description of what was done + evidence ref. | Action Owner | ALCOA+ "Complete" | MUST | ✅ form validation |

### A6. Effectiveness Verification

| ID | Requirement | Persona | Reg anchor | MoSCoW | Current state |
|---|---|---|---|---|---|
| URS-A-050 | System SHALL require an effectiveness check after all actions complete: planned verification method + execution window + result. | QA Head | **21 CFR 820.100(a)(6)** | MUST | ✅ `CAPAEffectivenessCheck` model + `POST /api/capa/:id/effectiveness-check` |
| URS-A-051 | Effectiveness check SHALL record: criteria, evidence reviewed, outcome (EFFECTIVE / NOT_EFFECTIVE / PARTIAL), reviewer, date. | QA Head | 21 CFR 820.100(a)(6) | MUST | ✅ Model fields |
| URS-A-052 | NOT_EFFECTIVE outcome SHALL trigger a re-open path: spawn a new linked CAPA OR add additional actions. | System | ICH Q10 §3.2.2 | MUST | ✅ re-open controller logic |

### A7. Closure + E-Signature

| ID | Requirement | Persona | Reg anchor | MoSCoW | Current state |
|---|---|---|---|---|---|
| URS-A-060 | CAPA closure SHALL require an e-signature by Buyer/QA Head (signatureMeaning=APPROVED), with password ceremony + reasonForChange. | QA Head | **21 CFR Part 11 §11.50 + §11.200** | MUST | ✅ `POST /api/capa/:id/close` + `requireESignature` middleware |
| URS-A-061 | Without a valid closure signature, status SHALL stay PENDING_CLOSURE. | System | 21 CFR Part 11 §11.10(j) | MUST | ✅ Soft-mode default; hard via `ENFORCE_ESIG=hard` |
| URS-A-062 | Closure SHALL assemble an evidence package (triggering record + investigation + RCA + actions + effectiveness check + signatures) as a single retrievable artifact. | System | ALCOA+ "Enduring" | SHOULD | ⚠️ Bundle export exists; packaging UX partial |

### A8. RBAC + Tenant Isolation

| ID | Requirement | Persona | Reg anchor | MoSCoW | Current state |
|---|---|---|---|---|---|
| URS-A-070 | CAPA records SHALL be scoped to `tenantOrgId`; cross-tenant reads SHALL be blocked at service layer. | System | 21 CFR Part 11 §11.10(d) | MUST | ✅ `buildCapaTenantScopeQuery()` |
| URS-A-071 | Supplier-side CAPAs SHALL be visible to the supplier-tenant assignee only (not to other suppliers of the same buyer). | System | Multi-tenant safety | MUST | ✅ supplier-scoped read path |

### A9. Audit Trail (ALCOA+)

| ID | Requirement | Persona | Reg anchor | MoSCoW | Current state |
|---|---|---|---|---|---|
| URS-A-080 | Every state change, signature, and AI decision SHALL write an immutable AuditTrail row with actor, reasonForChange, before/after. | System | **21 CFR Part 11 §11.10(e)** | MUST | ✅ shared `auditTrailService` |
| URS-A-081 | AuditTrail rows SHALL be queryable cross-module (trigger ↔ CAPA ↔ effectiveness). | System | ALCOA+ | MUST | ✅ `GET /api/audit-trail/by-entity?entityType=capa` |

---

## 4. Part B — Differentiator (White-Space) Requirements

| ID | Requirement | Strategic rationale | MoSCoW | Current state |
|---|---|---|---|---|
| URS-B-001 | **AI-scaffolded RCA** (`capaRcaDrafter`) SHALL propose a 5-Why chain with citations to prior cases + suggested root cause + confidence, all reviewable by the investigator. | Incumbents (MasterControl, Veeva) treat RCA as a free-text field — no guidance | MUST | ✅ live in Wave 2 |
| URS-B-002 | **Predictive effectiveness model** SHALL flag low-likelihood-of-success CAPA proposals at draft time (before commit). | Reduces re-litigation; reduces inspector exposure to repeat findings | SHOULD | ⚠️ Model scaffolded (Wave 3); not yet wired to drafter UI |
| URS-B-003 | **Cross-trigger pattern surfacing** SHALL show "this is the 4th CAPA against this supplier for the same root cause" at intake time. | Network effect of multi-tenant + multi-trigger data | SHOULD | ⚠️ Trend surfacing exists in Deviation module; CAPA wiring partial |
| URS-B-004 | **Closure evidence bundle export** SHALL produce a single PDF + ZIP for an inspector with all linked records + signatures, in < 5 seconds. | Inspector-readiness as product feature | MUST | ⚠️ Backend assembles bundle; UX one-click button deferred |
| URS-B-005 | **Cross-tenant CAPA chain** (marketplace) — a supplier-side CAPA SHALL be visible to multiple buyer tenants who share that supplier (with explicit consent + redaction). | Network effect for marketplace; "we already fixed this for buyer X" | COULD | 🚫 Not started; consent model TBD |

---

## 5. Out-of-Scope (Explicitly Hand-Off)

- **Audit observation drafting** → [audit-management](../audit-management/URS.md). CAPA consumes signed observations.
- **Deviation classification + RCA upstream** → [deviation](../deviation/URS.md). The Deviation `capaRecommender` AI is the most common entry point into this module.
- **Change Control workflow** → [change-control](../change-control/URS.md). Change Control can spawn a CAPA from post-implementation review.
- **Complaint intake** → `06-modules/complaint-management/`. Complaint module triages and can spawn CAPA.
- **Document Control updates** triggered by a corrective action → `06-modules/document-control/`. CAPA module raises the request; doc-control owns the SOP revision.

---

## 6. Assumptions and Dependencies

- **Multi-tenant model:** every CAPA belongs to a `tenantOrgId`; supplier-side CAPAs belong to the supplier tenant + are linked back to the buyer tenant via an affiliation record.
- **E-signature method:** password-based (bcrypt-verified) today.
- **LLM availability:** `capaRcaDrafter` degrades to a deterministic 5-Why template if LLM provider down.
- **Storage:** evidence in S3-backed HawkVault; metadata in MongoDB.
- **Notification channels:** email default; dashboard surfacing always on.

---

## 7. Acceptance Criteria

| URS ID range | Verification approach |
|---|---|
| A1 (intake) | E2E test in `frontend/e2e/capa-intake.spec.ts` (TODO if missing); unit tests on `CAPATrigger` model |
| A2 (triage) | Unit + controller tests on `triageController` |
| A3 (RCA + AI) | Eval suite in `backend/src/services/ai/evals/capaRcaDrafter.eval.js`; manual review per AskHawk decisions runbook |
| A4–A5 (actions + execution) | E2E `capa-action-flow.spec.ts` |
| A6 (effectiveness) | Backend test on `effectivenessCheckController`; manual reg-walkthrough |
| A7 (closure + e-sig) | Manual sign + retrieve evidence bundle |
| A8 (RBAC) | Cross-tenant guard tests |
| A9 (audit trail) | Query `/api/audit-trail/by-entity?entityType=capa` after lifecycle test |
| B1–B5 | Demo script (B1, B4); roadmap KPIs (B2, B3); product strategy (B5) |

---

## 8. Open Questions

1. **Hard vs soft e-sig mode** on closure — same default question as audit module (URS-A-023 in audit).
2. **Predictive effectiveness wiring** — when do we surface the Wave-3 model in the drafter UI? Currently scaffolded but invisible.
3. **Cross-tenant CAPA chain** (URS-B-005) — what's the consent UX? Per-CAPA opt-in vs supplier-level standing consent?
4. **RCA approval e-sig** (URS-A-024) — wrap the existing approval step in `requireESignature`?
5. **Repeat-issue detection threshold** — at what point does "3rd CAPA against same root cause" trigger a hard escalation (not just an info banner)?
6. **Bundle export packaging** — single PDF? ZIP-of-PDFs? Inspector-friendly index?

---

## 9. Traceability Index (URS ↔ Code)

| URS section | Primary code | Primary UI |
|---|---|---|
| A1 intake | `controllers/capaController.js`, `models/CAPA.js`, `models/CAPATrigger.js` | `CapaIntakeForm`, `/capa` |
| A2 triage | `controllers/capaTriageController.js` | `/capa/[id]/triage` |
| A3 RCA + AI | `services/ai/wave2/capaRcaDrafter.js`, `services/groundedGenerationService.js` | `CapaRcaDrafter`, `/capa/[id]/rca` |
| A4 actions | `models/CAPAAction.js`, `controllers/capaActionController.js` | `/capa/[id]/actions` |
| A5 execution | `controllers/capaActionController.js` (complete handler) | action detail modal |
| A6 effectiveness | `models/CAPAEffectivenessCheck.js`, `controllers/effectivenessCheckController.js` | `/capa/[id]/effectiveness-check` |
| A7 closure + e-sig | `controllers/capaClosureController.js`, `middlewares/requireESignature.js` | `/capa/[id]/close`, `SignatureDialog` |
| A8 RBAC | `utils/capaAccess.js`, `middlewares/{authMiddleware,roleMiddleware}.js` | page-level role guards |
| A9 audit trail | `services/auditTrailService.js`, `models/AuditTrail.js` | `/capa/[id]/audit-log` |
| B1 RCA AI | `services/ai/wave2/capaRcaDrafter.js` | `CapaRcaDrafter` |
| B4 evidence bundle | `services/capaBundleService.js` (partial) | `/capa/[id]/export` (deferred) |
