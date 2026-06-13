# URS — Change Control

| Field | Value |
|---|---|
| Module | Change Control |
| Owner | Product (S.M.A.R.T. Hawk Platform) |
| Status | DRAFT (reverse-engineered from current code + canon) |
| Version | 0.1 |
| Last updated | 2026-06-01 |
| Regulatory anchors | 21 CFR Part 11, **ICH Q7 §13** (the most-cited change-control section), EU GMP Annex 11 §10, ISO 9001 §6.3 + §8.5.6, ICH Q10 §3.2.3 |
| Source | Reverse-engineered from `backend/src/{routes,controllers,services,models}/changeControl*.js` + `frontend/components/changeControl/` |

---

## 1. Purpose and Scope

**Purpose.** S.M.A.R.T. Hawk Change Control manages the **formal change request workflow** in regulated quality systems — from initiation through classification, impact assessment, multi-step approval, implementation, and post-implementation review. Every regulated change carries 21 CFR Part 11 e-signature + immutable audit trail. The module is the keystone of cross-module change propagation (Doc Control, Risk, CAPA).

**In scope:**
- Change request initiation (any role can initiate)
- Classification (Routine / Minor / Major) with documented rationale
- Impact assessment (per impacted area: documents, equipment, suppliers, risk, training)
- Multi-step approval workflow (configurable per classification)
- Implementation tracking
- Post-implementation review (PIR) with sign-off
- Cross-module spawn: Doc Control updates, Risk reassessment, CAPA generation
- Full audit trail with field-level diffs

**Out of scope (handed off):**
- Document Control vault + SOP revisioning → `06-modules/document-control/`. Change Control raises the doc-update request; doc-control owns versioning.
- CAPA lifecycle after PIR-triggered spawn → [capa](../capa/URS.md)
- Risk register updates → `06-modules/risk-management/`
- Training assignment for impacted users → `06-modules/training/`
- Deviation that triggered the change → [deviation](../deviation/URS.md)
- Audit findings that triggered the change → [audit-management](../audit-management/URS.md)

---

## 2. Stakeholders and Personas

| Persona | Role | Goals | Pain points without this module |
|---|---|---|---|
| **Change Initiator** (anyone) | Files the change request | Low-friction intake; clear "what happens next" | Email-driven; no traceability; gets lost |
| **Reviewer** (subject-matter expert) | Reviews + comments on classification + impact | Structured review with citations to impacted records | Word doc circulating in email |
| **Affected-Area Owner** (per area: Quality, Engineering, Production, Supplier QA) | Assesses impact in their area | Single inbox; impact template per area | Manually invited to meetings; no record |
| **QA Approver** | Final approver per step (often Multi-step for Major) | Signed approval per step; clear audit trail | Wet-signed paper; no Part 11 ceremony |
| **Implementer** | Executes the approved change | Clear scope + evidence requirement | Lost change scope; "what exactly was approved?" |
| **PIR Reviewer** (often QA Head) | Post-implementation review sign-off | Verify intended outcome achieved | Often skipped entirely |
| **Tenant Admin** | Configures approval matrix per classification | Per-tenant tuning of approval routing | Vendor controls everything |

---

## 3. Part A — Foundational Requirements

### A1. Initiation

| ID | Requirement | Persona | Reg anchor | MoSCoW | Current state |
|---|---|---|---|---|---|
| URS-A-001 | System SHALL accept change request initiation from any authenticated user with: change description, justification, requested classification hint, target effective date. | Initiator | **ICH Q7 §13.10** | MUST | ✅ `POST /api/changes` + `ChangeInitiationForm` |
| URS-A-002 | Each change SHALL receive a tenant-scoped unique ID (e.g., `CC-2026-000123`). | System | 21 CFR Part 11 §11.10 | MUST | ✅ `requestIdService.generateChangeId()` |
| URS-A-003 | Initiation SHALL allow attachments (supporting docs, prior records). | Initiator | Evidence completeness | MUST | ✅ multi-attachment upload |
| URS-A-004 | Initiation SHALL accept upstream-trigger linkage (deviation ID, audit observation ID, CAPA ID, regulatory update ref). | Initiator | ICH Q10 §3.2.3 | MUST | ✅ `ChangeControl.triggers[]` |

### A2. Classification

| ID | Requirement | Persona | Reg anchor | MoSCoW | Current state |
|---|---|---|---|---|---|
| URS-A-010 | System SHALL classify each change into one of: **Routine** (no approval needed, audit-trailed), **Minor** (single approver), **Major** (multi-step approval). | Reviewer / QA | **ICH Q7 §13.13** | MUST | ✅ `ChangeControl.classification` enum |
| URS-A-011 | Classification SHALL be reviewable + adjustable by Reviewer/QA before impact assessment begins; classification changes audit-trailed with rationale. | Reviewer | 21 CFR Part 11 §11.10(e) | MUST | ✅ `classifyController` + AuditTrail row |
| URS-A-012 | Per-tenant configurable approval matrix SHALL map classification → required approver roles + sequence. | Tenant Admin | ICH Q7 §13.13 | SHOULD | ⚠️ Default matrix in code; per-tenant config UX deferred |

### A3. Impact Assessment

| ID | Requirement | Persona | Reg anchor | MoSCoW | Current state |
|---|---|---|---|---|---|
| URS-A-020 | System SHALL collect impact assessment per impacted area: Documents/SOPs, Equipment, Suppliers, Risk, Training, Validation. | Affected-Area Owners | **ICH Q7 §13.13** | MUST | ✅ `ChangeImpactAssessment` model |
| URS-A-021 | Each area SHALL be assignable to a different owner; each owner SHALL provide: scope of impact, mitigations, residual risk. | Affected-Area Owners | ICH Q10 §3.2.3 | MUST | ✅ per-area assignment |
| URS-A-022 | All impact assessments SHALL be complete before approval workflow can start. | System | ALCOA+ "Complete" | MUST | ✅ enforced in `approvalController` |
| URS-A-023 | Impact assessment SHALL trigger Doc Control review request for impacted SOPs (cross-module). | System | EU GMP Annex 11 §10 | SHOULD | ⚠️ Backend hook in place; Doc Control consumer wiring partial |

### A4. Approval Workflow (Multi-Step)

| ID | Requirement | Persona | Reg anchor | MoSCoW | Current state |
|---|---|---|---|---|---|
| URS-A-030 | System SHALL execute the approval workflow defined by classification: Routine = none, Minor = single, Major = multi-step (sequential). | System | ICH Q7 §13.13 | MUST | ✅ `ChangeControlStep` model |
| URS-A-031 | Each approval step SHALL require e-signature (signatureMeaning=APPROVED) with password + reasonForChange. | Approver | **21 CFR Part 11 §11.50 + §11.200** | MUST | ✅ `requireESignature` middleware on step approval endpoint |
| URS-A-032 | An approver SHALL be able to REJECT a step with mandatory rationale; rejection returns change to Initiator for revision. | Approver | ICH Q7 §13.13 | MUST | ✅ reject path with rationale |
| URS-A-033 | Step progression SHALL be sequential by default; parallel steps configurable per matrix. | System | ICH Q7 §13.13 | SHOULD | ⚠️ Sequential implemented; parallel TBD |
| URS-A-034 | Each step SHALL have a stated SLA; overdue steps trigger escalation. | System | UX baseline | SHOULD | ⚠️ SLA fields exist; escalation notification partial |

### A5. Implementation

| ID | Requirement | Persona | Reg anchor | MoSCoW | Current state |
|---|---|---|---|---|---|
| URS-A-040 | After all approvals, the change SHALL transition to IMPLEMENTATION; Implementer assigned. | System | ICH Q7 §13.13 | MUST | ✅ `implementationController` |
| URS-A-041 | Implementer SHALL upload implementation evidence + mark complete. | Implementer | 21 CFR Part 11 §11.10 | MUST | ✅ evidence upload + completion endpoint |
| URS-A-042 | Implementation SHALL block until ALL impacted records (docs, risk) confirm propagation (cross-module check). | System | EU GMP Annex 11 §10 | SHOULD | ⚠️ Cross-module callback design pending |

### A6. Post-Implementation Review (PIR)

| ID | Requirement | Persona | Reg anchor | MoSCoW | Current state |
|---|---|---|---|---|---|
| URS-A-050 | System SHALL schedule a PIR after implementation (timing per classification: e.g., Major = 90 days). | System | **ICH Q10 §3.2.3** | MUST | ✅ scheduled task |
| URS-A-051 | PIR SHALL capture: intended outcome achieved (Y/N), evidence, unintended consequences, required CAPA. | PIR Reviewer | ICH Q10 §3.2.3 | MUST | ✅ `PIRForm` + endpoint |
| URS-A-052 | PIR SHALL require e-signature sign-off (signatureMeaning=APPROVED). | PIR Reviewer | **21 CFR Part 11 §11.50** | MUST | ✅ `requireESignature` on PIR endpoint |
| URS-A-053 | A PIR identifying issues SHALL be able to spawn a CAPA with one click (cross-module). | PIR Reviewer | ICH Q10 §3.2.3 | MUST | ✅ `POST /api/changes/:id/spawn-capa` |

### A7. Closure

| ID | Requirement | Persona | Reg anchor | MoSCoW | Current state |
|---|---|---|---|---|---|
| URS-A-060 | Closure SHALL occur on: PIR signed + (no CAPA spawned OR spawned CAPA acknowledged). | System | ICH Q7 §13.13 | MUST | ✅ `closureController` |
| URS-A-061 | A closed change SHALL be readable but no longer mutable. | System | ALCOA+ "Original" | MUST | ✅ enforced at controller layer |

### A8. RBAC + Tenant Isolation + Audit Trail

| ID | Requirement | Persona | Reg anchor | MoSCoW | Current state |
|---|---|---|---|---|---|
| URS-A-070 | Changes SHALL be tenant-scoped; cross-tenant reads blocked at service layer. | System | 21 CFR Part 11 §11.10(d) | MUST | ✅ `buildChangeTenantScopeQuery()` |
| URS-A-071 | Every state change, signature, and impact-assessment edit SHALL write an immutable AuditTrail row with field-level diffs. | System | **21 CFR Part 11 §11.10(e), §11.10(k)** | MUST | ✅ shared `auditTrailService` + `meta.changeBrief.fields[]` |

---

## 4. Part B — Differentiator (White-Space) Requirements

| ID | Requirement | Strategic rationale | MoSCoW | Current state |
|---|---|---|---|---|
| URS-B-001 | **AI change impact predictor** SHALL surface similar past changes + their actual implementation effort + side effects, helping the Initiator scope realistically. | No competitor does this; reduces under-scoping that causes re-work | SHOULD | 🚫 Planned; not started |
| URS-B-002 | **AI classification assist** SHALL suggest a classification (Routine/Minor/Major) at initiation, with rationale + confidence; reviewer overrides as needed. | Compresses time-to-classification; reduces under-classification risk (the most common compliance gap) | SHOULD | 🚫 Planned; not started |
| URS-B-003 | **Cross-module impact graph** SHALL render the propagation tree (this change → these SOPs → these training assignments → these risk records) at impact-assessment time. | Inspector-readiness; reduces missed-impact risk | MUST | ⚠️ Backend computes graph; UI rendering deferred |
| URS-B-004 | **One-click PIR-to-CAPA spawn** SHALL pre-fill the CAPA module with PIR context (intended outcome, gap, suggested actions). | Compresses post-implementation feedback loop | MUST | ✅ live |
| URS-B-005 | **Cross-tenant change notifications** (marketplace) — when a supplier files a change that affects multiple buyer tenants, notify all affected buyers with consent + redaction. | Network effect for marketplace customers | COULD | 🚫 Not started; consent model TBD |
| URS-B-006 | **Per-tenant approval-matrix configurability** SHALL let Tenant Admin design approval routing per classification + per change category (e.g., Equipment-major vs Process-major). | Customers' approval matrices vary; no-code config is table-stakes | MUST | ⚠️ Default matrix in code; per-tenant config UX deferred |

---

## 5. Out-of-Scope (Explicitly Hand-Off)

- **Document Control vault + version control** → `06-modules/document-control/`. Change Control raises the doc-update request; doc-control owns the SOP revision.
- **CAPA execution lifecycle** after PIR spawn → [capa](../capa/URS.md). PIR module spawns; CAPA module owns.
- **Risk register updates** → `06-modules/risk-management/`. Impact assessment flags risk; risk module owns the reassessment.
- **Training assignment** for impacted users on revised SOPs → `06-modules/training/`.
- **Deviation that triggered the change** → [deviation](../deviation/URS.md). Change Control consumes the deviation ref; doesn't manage deviation lifecycle.
- **Audit observation that triggered the change** → [audit-management](../audit-management/URS.md).

---

## 6. Assumptions and Dependencies

- **Multi-tenant model:** every change belongs to a `tenantOrgId`.
- **Approval matrix:** default matrix in code today; per-tenant override planned.
- **Cross-module hooks:** Doc Control review request, Risk reassessment, Training assignment, CAPA spawn — depend on those modules being live.
- **E-signature method:** password-based (bcrypt-verified) today.
- **Storage:** evidence in S3-backed HawkVault; metadata in MongoDB.

---

## 7. Acceptance Criteria

| URS ID range | Verification approach |
|---|---|
| A1 (initiation) | E2E `change-initiation.spec.ts`; unit tests on ChangeControl model |
| A2 (classification) | Unit tests on `classifyController`; AuditTrail row check |
| A3 (impact assessment) | E2E per-area assignment; cross-module hook tests (Doc Control stub) |
| A4 (approval workflow) | Manual sign per step + cross-check AuditTrail; reject path test |
| A5 (implementation) | E2E implementation completion |
| A6 (PIR) | Scheduled-task test + manual PIR sign + CAPA spawn test |
| A7 (closure) | E2E closure path; mutability test (read-only after close) |
| A8 (RBAC + trail) | Cross-tenant guard tests + field-level diff in AuditTrail |
| B1–B6 | Demo script (B3, B4); roadmap KPIs (B1, B2, B6); product strategy (B5) |

---

## 8. Open Questions

1. **Per-tenant approval matrix UX** (URS-A-012, URS-B-006) — no-code form vs config-file vs SuperAdmin script?
2. **Parallel approval steps** (URS-A-033) — when do customers need this? Common for cross-functional Major changes.
3. **PIR scheduling** (URS-A-050) — fixed per classification or configurable per change?
4. **AI classification confidence** (URS-B-002) — what's the floor? Under-classification is the most common compliance gap.
5. **Cross-module impact graph UX** (URS-B-003) — interactive tree view or static report?
6. **Change-to-CAPA bidirectional** — today PIR can spawn CAPA; should a CAPA's effectiveness check ever spawn a Change Control?
7. **Cross-tenant change notifications** (URS-B-005) — what's the consent model?
8. **Routine-class audit trail depth** — do Routine changes need the same field-level diff fidelity as Major?

---

## 9. Traceability Index (URS ↔ Code)

| URS section | Primary code | Primary UI |
|---|---|---|
| A1 initiation | `controllers/changeControlController.js`, `models/ChangeControl.js` | `ChangeInitiationForm`, `/changes` |
| A2 classification | `controllers/classifyController.js` | `/changes/[id]/classify` |
| A3 impact assessment | `models/ChangeImpactAssessment.js`, `controllers/impactAssessmentController.js` | `/changes/[id]/impact-assessment` |
| A4 approval | `models/ChangeControlStep.js`, `controllers/approvalController.js`, `middlewares/requireESignature.js` | `/changes/[id]/approve/[stepId]`, `SignatureDialog` |
| A5 implementation | `controllers/implementationController.js` | `/changes/[id]/implement` |
| A6 PIR | `controllers/pirController.js` | `/changes/[id]/pir` |
| A7 closure | `controllers/changeClosureController.js` | `/changes/[id]/close` |
| A8 RBAC + trail | `utils/changeAccess.js`, shared `auditTrailService` | `/changes/[id]/audit-log` |
| B3 impact graph | `services/changeImpactGraphService.js` (backend) | (UI deferred) |
| B4 PIR-to-CAPA | `controllers/pirController.js → spawnCapa()` | spawn-CAPA button |
