# URS — Training

| Field | Value |
|---|---|
| Module | Training |
| Owner | Product (Hawkeye Platform) |
| Status | DRAFT (forward-spec) |
| Version | 0.1 |
| Last updated | 2026-06-01 |
| Regulatory anchors | 21 CFR 211.25 (personnel qualifications), 21 CFR Part 11 §11.10(i), ICH Q10 §3.2.4, EU GMP Ch.2, ISO 9001 §7.2 + §7.3, ISO 13485 §6.2 |
| Source | Forward-spec; cross-refs `06-modules/document-control/`, `06-modules/batch-records/`, `06-modules/capa/`, `06-modules/deviation/` |

---

## 1. Purpose and Scope

**Purpose.** Hawkeye Training is the QMS module for **per-user training records, effectiveness verification, and the training matrix** that maps required training per role/persona. It is the source of truth for "is this person trained on this SOP?" — consumed real-time by Batch Records (step-entry gate) and Audit Management (auditor qualification).

**In scope:**
- Training course catalog (linked to SOPs/policies in Doc Control)
- Training Matrix — required training per role/persona/job-function
- Per-user training records (assigned, enrolled, completed)
- Effectiveness verification — typically 90 days post-completion
- E-signature on trainee completion attestation + effectiveness verifier sign-off
- Auto-assignment triggers (new SOP → training assigned; new hire → onboarding training)
- Cross-module gates: untrained personnel blocked from Batch step entry; QP must have current Annex-16 training

**Out of scope (handed off):**
- SOP/policy authoring + versioning → `06-modules/document-control/`
- CAPA action items requiring training → CAPA module passes assignments to this module
- External LMS integration (planned future)
- SCORM-compatible content (deferred)
- Live in-person training scheduling (calendar/room booking — future)
- Training cost / budget tracking (out of scope v1)

---

## 2. Stakeholders and Personas

| Persona | Role | Goals | Pain points without this module |
|---|---|---|---|
| **HR / Training Coordinator** (e.g., Neha Joshi) | Manages catalog, assigns matrix, runs reports | Single source of training truth; auto-assign on SOP revision | Excel matrix; manual chase-emails; lose track on SOP rev |
| **Trainee** (any employee) | Enrolls, completes training, attests | Single inbox; quick attestation; clear due dates | Email-based assignments; forgotten until audit |
| **Trainer / SME** | Delivers training; may author quiz | Reusable content; track who attended | Paper sign-in sheets; lost attendance |
| **QA / Effectiveness Verifier** | Verifies effectiveness 90 days post | Structured questions; pass/fail clear | Subjective sign-off without rubric |
| **Manager** | Sees team training compliance | Roll-up: % of team current on required training | No visibility until audit panic |
| **Tenant Admin** | Configures roles, matrix, cadences | Per-tenant tuning | Vendor-controlled |

---

## 3. Part A — Foundational Requirements

### A1. Training Catalog

| ID | Requirement | Persona | Reg anchor | MoSCoW | Current state |
|---|---|---|---|---|---|
| URS-A-001 | System SHALL maintain a training course catalog with: courseId, title, type (SOP-read / classroom / online / OJT / quiz), linked SOPs, duration, recertification cadence. | Coordinator | 21 CFR 211.25 | MUST | ⏳ planned |
| URS-A-002 | Each course SHALL be linkable to one-or-more Doc Control documents; SOP-read courses auto-mark "needs reassignment" when underlying SOP is revised. | Coordinator | ICH Q10 §3.2.4 | MUST | ⏳ planned |
| URS-A-003 | Courses SHALL support attached content: PDF, video URL, embedded quiz, or external LMS link. | Coordinator | ISO 9001 §7.2 | MUST | ⏳ planned (SCORM deferred) |

### A2. Training Matrix

| ID | Requirement | Persona | Reg anchor | MoSCoW | Current state |
|---|---|---|---|---|---|
| URS-A-010 | System SHALL define a Training Matrix mapping `(role, jobFunction)` → required `courseId[]`. | Coordinator | 21 CFR 211.25 | MUST | ⏳ planned |
| URS-A-011 | New-hire onboarding SHALL auto-trigger training assignment for the new user's role per the matrix. | System | ICH Q10 §3.2.4 | MUST | ⏳ planned |
| URS-A-012 | Role change for an existing user SHALL recompute matrix + assign new required training; obsolete training records remain archived. | System | EU GMP Ch.2 §2.10 | MUST | ⏳ planned |

### A3. Training Record Lifecycle

| ID | Requirement | Persona | Reg anchor | MoSCoW | Current state |
|---|---|---|---|---|---|
| URS-A-020 | System SHALL model training record lifecycle as 6 states: **COURSE_CREATED → ASSIGNED → ENROLLED → COMPLETED → EFFECTIVENESS_VERIFIED → CLOSED**. | System | 21 CFR 211.25 | MUST | ⏳ planned |
| URS-A-021 | Every state transition SHALL write AuditTrail with actor + reason. | System | 21 CFR Part 11 §11.10(e) | MUST | ⏳ planned |
| URS-A-022 | Completion SHALL require trainee e-signature (signatureMeaning=COMPLETED) attesting they read/understood the content. | Trainee | 21 CFR Part 11 §11.50 + §11.10(i) | MUST | ⏳ planned |

### A4. Effectiveness Verification

| ID | Requirement | Persona | Reg anchor | MoSCoW | Current state |
|---|---|---|---|---|---|
| URS-A-030 | System SHALL schedule effectiveness verification a tenant-configurable interval after completion (default 90 days). | System | ICH Q10 §3.2.4 | MUST | ⏳ planned |
| URS-A-031 | Effectiveness verification SHALL support: quiz, manager-observation form, or knowledge interview — verifier marks pass/fail with rationale. | Verifier | EU GMP Ch.2 | MUST | ⏳ planned |
| URS-A-032 | Verifier sign-off SHALL require e-signature (signatureMeaning=VERIFIED). | Verifier | 21 CFR Part 11 §11.50 | MUST | ⏳ planned |
| URS-A-033 | Failed effectiveness SHALL trigger re-training (new assignment) + Deviation/CAPA evaluation. | System | ICH Q10 §1.4 | MUST | ⏳ planned |

### A5. Cross-Module Integration

| ID | Requirement | Persona | Reg anchor | MoSCoW | Current state |
|---|---|---|---|---|---|
| URS-A-040 | System SHALL expose `GET /api/training/user/:userId/eligibility?sopId=...` returning whether user has current training on a SOP; called by Batch Records at step entry. | System | 21 CFR 211.25 + 211.188 | MUST | ⏳ planned |
| URS-A-041 | New SOP publication (Doc Control event) SHALL trigger training assignment to all users in roles requiring that SOP. | System | ICH Q10 §3.2.4 | MUST | ⏳ planned |
| URS-A-042 | CAPA module SHALL be able to create training assignments as CAPA action items. | System | ICH Q10 §1.4 | MUST | ⏳ planned |
| URS-A-043 | Deviation with root cause = "training gap" SHALL prompt refresher training assignment for the affected personnel. | System | ICH Q10 §1.4 | SHOULD | ⏳ planned |

### A6. Audit Trail + Data Integrity

| ID | Requirement | Persona | Reg anchor | MoSCoW | Current state |
|---|---|---|---|---|---|
| URS-A-050 | All training records SHALL be audit-trailed (assignment, enrollment, completion, effectiveness, recertification) with mandatory reasonForChange on each transition. | System | 21 CFR Part 11 §11.10(e) | MUST | ⏳ planned |
| URS-A-051 | Training records SHALL be retained for the regulatory retention period (default 5 years after employee separation; tenant-configurable). | System | 21 CFR 211.180 | MUST | ⏳ planned |

---

## 4. Part B — Differentiator Requirements

| ID | Requirement | Strategic rationale | MoSCoW | Current state |
|---|---|---|---|---|
| URS-B-001 | An **AI Quiz Generator** SHALL auto-generate effectiveness-verification questions from SOP content (with citations to SOP sections). | Effectiveness verification today is subjective; AI brings rigor + scale | SHOULD | ⏳ planned |
| URS-B-002 | A **Training Needs Analysis (TNA) AI** SHALL analyze recent deviation + CAPA patterns and recommend new training courses or refreshers per role. | Closed-loop QMS: deviations inform training | SHOULD | ⏳ planned |
| URS-B-003 | The Training Matrix SHALL be **versioned and audit-trailed** — every change to "what's required" creates a new version with effective date. | Inspector-ready evidence of training matrix evolution | MUST | ⏳ planned |
| URS-B-004 | A **personnel-eligibility API** SHALL serve real-time checks (< 100 ms p95) used at Batch step entry, audit assignment, and QP release. | Compliance-by-default in execution flows | MUST | ⏳ planned |
| URS-B-005 | Every AI output SHALL be **grounded + cited + confidence-scored + audit-trailed**. | Part-11-grade AI traceability | MUST | ✅ (reuses platform `groundedGenerationService`) |
| URS-B-006 | Training records SHALL be **portable** — exportable as a signed certificate bundle (PDF + JSON) per employee for cross-tenant reuse (e.g., contract auditors moving between buyer tenants). | Cross-tenant identity moat | SHOULD | ⏳ planned |

---

## 5. Out-of-Scope (Explicit Hand-Off)

- **SOP authoring / version control** → Document Control
- **External LMS integration** (SuccessFactors, Cornerstone, Workday Learning) — planned future
- **SCORM 1.2 / 2004 content** — deferred
- **Live in-person training calendar / room booking** — future
- **Training cost / chargeback** — out of scope v1
- **Onboarding workflow beyond training** (orientation, HR forms) — out of scope

---

## 6. Assumptions and Dependencies

- **Document Control** is the source of truth for SOPs; this module references by `documentId` + version
- **User / RBAC module** provides role + jobFunction per user
- **Notification** module dispatches reminders
- Training assignments survive role changes; archived records preserve regulatory history
- E-sig method: password (bcrypt-verified) for trainee + verifier

---

## 7. Acceptance Criteria

| URS ID range | Verification approach |
|---|---|
| A1 (catalog) | CRUD E2E test |
| A2 (matrix) | New-hire scenario: create user with role → confirm auto-assignment |
| A3 (lifecycle) | State-machine unit tests; trainee completion + e-sig integration test |
| A4 (effectiveness) | 90-day timer test (mocked clock); failed verification → re-training flow |
| A5 (cross-module) | New SOP publish → trigger assignment; batch step blocked when untrained |
| A6 (audit trail) | Sample training record → query trail → row per transition |
| B1 (AI quiz) | Quality-eval suite on SOP excerpts; SME review |
| B4 (eligibility API) | Load test: 1000 concurrent eligibility checks < 100 ms p95 |

---

## 8. Open Questions

1. **Re-certification cadence defaults per course type** — ship template per vertical or require tenant config?
2. **Grace period for overdue training** — how long can someone work after training overdue? Today: assume no grace (hard block). Configurable?
3. **Trainer-of-record requirement** — must a trainer exist for OJT records? Some tenants train via self-study.
4. **Effectiveness threshold** — quiz pass mark? Today: assume 80%. Tenant-configurable?
5. **External certifications** (e.g., GMP certificate from external body) — track as "external course" or separate module?
6. **Cross-tenant portability** — what's the consent + privacy model for exporting an employee's training to another tenant?
7. **Trainee delegation** — can a manager attest on behalf of a trainee for OJT? Today: no.

---

## 9. Traceability Index (URS ↔ Code)

| URS section | Primary code (planned) | Primary UI (planned) |
|---|---|---|
| A1 catalog | `controllers/trainingCourseController.js` | `/training/catalog`, `/training/catalog/[id]` |
| A2 matrix | `controllers/trainingMatrixController.js` | `/training/matrix`, `/training/matrix/[roleId]` |
| A3 records lifecycle | `services/trainingPhaseService.js` | `/my-training`, `/training/records/[id]` |
| A4 effectiveness | `services/effectivenessSchedulerService.js` | `/training/effectiveness-queue` |
| A5 cross-module | `services/trainingEligibilityService.js` | (consumed by Batch/Audit) |
| A6 audit trail | `services/auditTrailService.js` (cross-module) | `/training/records/[id]/audit-log` |
| B1 AI quiz gen | `services/ai/quizGeneratorAgent.js` | course-edit modal |
| B2 TNA | `services/ai/trainingNeedsAnalysisAgent.js` | `/training/insights` |
