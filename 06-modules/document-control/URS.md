# URS — Document Control

| Field | Value |
|---|---|
| Module | Document Control |
| Owner | Product (Hawkeye Platform) |
| Status | DRAFT (reverse-engineered from current code + planned wave) |
| Version | 0.1 |
| Last updated | 2026-06-01 |
| Regulatory anchors | 21 CFR Part 11 §11.10(k), EU GMP Ch.4, EU GMP Annex 11 §10, ISO 9001 §7.5, ICH Q10 §3.2 |
| Source | Reverse-engineered from `backend/src/{routes,controllers,services,models}/document*.js` + `frontend/app/(console)/documents/` + `backend/src/services/ai/docIntel*.js` |

---

## 1. Purpose and Scope

**Purpose.** Hawkeye Document Control (a.k.a. HawkVault) is the platform's **controlled-document vault** — the system of record for every SOP, Procedure, Work Instruction, Form, Specification, and Record that any other module references. It enforces versioned authoring, multi-step review and approval, distribution, periodic review, and retention, all under 21 CFR Part 11–grade audit trail and e-signature.

**In scope:**
- Document lifecycle: DRAFT → IN_REVIEW → APPROVED → EFFECTIVE → SUPERSEDED → ARCHIVED
- Per-category multi-step approval chains (e.g., SOP needs Author → Reviewer → QA Head → MR Approver)
- E-signature ceremony on every approval step (Part 11 / Annex 11)
- AI-assisted classification (SOP vs Procedure vs Record vs Form), tag generation, bulk upload wizard with hybrid approval UX
- Read-receipt tracking + training-attached documents
- Cross-module reference (every other EQMS module consumes documents via `documentId`)
- Retention policy enforcement (planned per-tenant)

**Out of scope (handed off):**
- Training-record execution → `06-modules/training/`
- Change Control workflow for document changes → `06-modules/change-control/` (Doc Control records the version; Change Control orchestrates the impact assessment)
- Audit/CAPA/Complaint module workflows that reference documents → respective module docs
- Long-term archive storage tiering → infra concern (out of EQMS surface)

---

## 2. Stakeholders and Personas

| Persona | Role | Goals | Pain points without this module |
|---|---|---|---|
| **Document Author** (any role: QA, Production, R&D) | Drafts new/revised documents | Author from template, attach evidence, submit for review without chasing reviewers | SOPs live in Word + SharePoint; version drift; nobody knows which is current |
| **Document Control Officer (DCO)** (e.g., Neha Iyer) | Owns the vault, configures categories + approval chains, monitors effective inventory | Single inbox of pending docs; expiry-aware dashboard; auditable distribution | Manual log book; periodic-review reminders missed |
| **Reviewer** (subject-matter expert) | Reviews drafted documents for technical accuracy | One-click review queue; comment inline; reject with reason | Email PDF round-trips; lost comments |
| **Approver** (QA Head, MR, Site Head) | Signs off final approval (e-sig) | Confidence the review chain has happened; signature ceremony with reason capture | "Wet-ink" signature workflows; no SoD enforcement |
| **Reader** (every employee) | Consumes the effective version + attests read | Always-current copy; "must-read" inbox; read-receipt audit trail | Reads outdated SOP; no proof of training |
| **Tenant Admin** | Configures categories, retention policy, approval chains | Per-tenant tuning of doc types, retention years, required signatories | Vendor-controlled rigid workflow |

---

## 3. Part A — Foundational Requirements

### A1. Document Lifecycle + Versioning

| ID | Requirement | Persona | Reg anchor | MoSCoW | Current state |
|---|---|---|---|---|---|
| URS-A-001 | Author SHALL create a new document with: title, category (SOP/Procedure/WI/Form/Record/Spec), scope, content body, attachments. | Author | EU GMP Ch.4 §4.1 | MUST | ✅ `POST /api/documents` |
| URS-A-002 | Each document SHALL receive a globally unique `documentNumber` (e.g., `SOP-QA-0001`) plus version vector (major.minor). | System | 21 CFR Part 11 §11.10(k) | MUST | ✅ `documentNumberService` |
| URS-A-003 | Every save while in DRAFT SHALL produce a `DocumentRevision` row capturing field-level diff (before/after, fields[]). | System | ALCOA+ "Original" | MUST | ✅ `documentRevisionService` |
| URS-A-004 | A document SHALL move through states: DRAFT → IN_REVIEW → APPROVED → EFFECTIVE → SUPERSEDED → ARCHIVED. Forward-only by default. | System | EU GMP Ch.4 §4.2 | MUST | ✅ `documentLifecycleService` |
| URS-A-005 | Superseding a document SHALL automatically link the new EFFECTIVE version to the prior, marking the prior as SUPERSEDED with retention countdown started. | System | EU GMP Ch.4 §4.3 | MUST | ✅ `POST /api/documents/:id/supersede` |
| URS-A-006 | A document MAY be reverted to DRAFT only by tenant_admin/superadmin with reasonForChange logged. | System | ALCOA+ | SHOULD | ✅ guarded revert path |

### A2. Multi-Step Approval Chain + E-Signature

| ID | Requirement | Persona | Reg anchor | MoSCoW | Current state |
|---|---|---|---|---|---|
| URS-A-010 | System SHALL support per-category approval chains (e.g., SOP = Author → Reviewer → QA Head → MR). | Tenant Admin | EU GMP Ch.4 §4.1 | MUST | ✅ `ApprovalChainTemplate` model |
| URS-A-011 | Each step in the chain SHALL require an e-signature (signatureMeaning per step: REVIEWED, APPROVED, AUTHORIZED). | Reviewer/Approver | **21 CFR Part 11 §11.50 + §11.200** | MUST | ✅ `SignatureDialog` + `documentApprovalController` |
| URS-A-012 | SoD: a single user SHALL NOT sign two different steps on the same document version (e.g., cannot both review and approve). | System | EU GMP Ch.4 §4.1 (segregation) | MUST | ✅ `requireStepApprover` middleware |
| URS-A-013 | If a step is rejected, the document SHALL return to DRAFT with rejection comment retained; restart of chain required. | System | ALCOA+ | MUST | ✅ rejection path |
| URS-A-014 | The e-signature record SHALL capture signerId, signerRole, signatureMeaning, reasonForChange (mandatory ≥10 chars), authMethod, IP, userAgent, timestamp. | System | 21 CFR Part 11 §11.200 | MUST | ✅ `ElectronicSignature` model |
| URS-A-015 | Without a complete approval chain, system SHALL block transition to EFFECTIVE. | System | 21 CFR Part 11 §11.10(j) | MUST | ✅ enforced in `documentLifecycleService` |

### A3. Distribution + Read Receipts

| ID | Requirement | Persona | Reg anchor | MoSCoW | Current state |
|---|---|---|---|---|---|
| URS-A-020 | EFFECTIVE documents SHALL be distributable to user/role groups; recipients receive notification with deep link. | DCO | ICH Q10 §3.2 | MUST | ✅ `POST /api/documents/:id/distribute` |
| URS-A-021 | Recipients SHALL be able to acknowledge reading via single click → captures read receipt with timestamp + IP. | Reader | EU GMP Ch.2 §2.4 | MUST | ✅ `DocumentReadReceipt` model |
| URS-A-022 | Documents flagged "training required" SHALL hand off to Training module to schedule training event. | System | EU GMP Ch.2 §2.4 | SHOULD | ⚠️ Hook exists; training-link UI partial |
| URS-A-023 | DCO dashboard SHALL show read-coverage % per document (acknowledged / distributed). | DCO | UX baseline | SHOULD | ✅ coverage widget |

### A4. Periodic Review + Retention

| ID | Requirement | Persona | Reg anchor | MoSCoW | Current state |
|---|---|---|---|---|---|
| URS-A-030 | Each EFFECTIVE document SHALL have a `nextReviewDue` date (per-category default; per-doc override allowed). | DCO | EU GMP Ch.4 §4.4 | MUST | ✅ `documentReviewService` |
| URS-A-031 | T-30 days before due, system SHALL notify owner + DCO. | System | UX baseline | MUST | ✅ scheduler hook |
| URS-A-032 | DCO SHALL be able to confirm "no change needed" (extends review window) OR initiate revision (forks a DRAFT v(n+1)). | DCO | EU GMP Ch.4 | MUST | ✅ `POST /api/documents/:id/review` |
| URS-A-033 | Retention period (in years) SHALL be configured per-category and enforced on ARCHIVED documents (no purge before period elapses). | Tenant Admin | EU GMP Ch.4 §4.10 | MUST | ⚠️ Field exists; automated enforcement planned Q1 2027 |

### A5. AI-Assisted Classification + Tagging

| ID | Requirement | Persona | Reg anchor | MoSCoW | Current state |
|---|---|---|---|---|---|
| URS-A-040 | On document upload, system SHALL auto-classify the document type (SOP/Procedure/WI/Form/Record/Spec) using `docIntelClassifier` with confidence score. | System | UX accelerator | SHOULD | ✅ `docIntelClassifier` service |
| URS-A-041 | System SHALL auto-suggest tags (persona, module, regulatory clauses) using `docIntelTagger`; author reviews and accepts. | System | UX accelerator | SHOULD | ✅ `docIntelTagger` service |
| URS-A-042 | AI classification with confidence < 0.6 SHALL fall back to manual classification (no auto-set). | System | Grounding requirement | MUST | ✅ confidence floor enforced |
| URS-A-043 | Every AI invocation SHALL log AuditTrail row with modelVersion, promptHash, retrievalSet, confidence, user disposition. | System | 21 CFR Part 11 + reproducibility | MUST | ✅ `recordAiDecision()` |

### A6. Bulk Upload Wizard (AI Orchestrator)

| ID | Requirement | Persona | Reg anchor | MoSCoW | Current state |
|---|---|---|---|---|---|
| URS-A-050 | DCO SHALL upload many files in one operation (drag-drop or zip); each is classified, tagged, and a draft document is proposed. | DCO | UX accelerator | SHOULD | ✅ `docBulkUploadOrchestrator` + wizard UI |
| URS-A-051 | Wizard SHALL present a reviewable plan (file → proposed category, title, tags, approval chain) before any write. | DCO | Human-in-loop | MUST | ✅ hybrid-approval UX (plan → approve → execute) |
| URS-A-052 | Bulk write SHALL be gated by a single e-signature covering the batch (reasonForChange captures "bulk import 2026-06-01 — Q1 SOP refresh"). | DCO | 21 CFR Part 11 §11.10(j) | MUST | ✅ batch-e-sig path |

### A7. RBAC + Tenant Isolation

| ID | Requirement | Persona | Reg anchor | MoSCoW | Current state |
|---|---|---|---|---|---|
| URS-A-060 | Every document endpoint SHALL enforce role-based access; DCO is the owner role with broadest privilege. | System | 21 CFR Part 11 §11.10(d) | MUST | ✅ `permit(...roles)` middleware |
| URS-A-061 | Documents SHALL be tenant-scoped; no cross-tenant read unless explicit share record exists. | System | Multi-tenant safety | MUST | ✅ tenant scope query helper |

### A8. Audit Trail + Data Integrity

| ID | Requirement | Persona | Reg anchor | MoSCoW | Current state |
|---|---|---|---|---|---|
| URS-A-070 | Every state change, signature, distribution event, and AI decision SHALL write an AuditTrail row. | System | 21 CFR Part 11 §11.10(e) | MUST | ✅ `auditTrailService.writeAuditTrail()` |
| URS-A-071 | AuditTrail rows SHALL be immutable and queryable cross-module (e.g., "show me every change to SOP-QA-0001"). | System | ALCOA+ | MUST | ✅ `GET /api/audit-trail/by-entity` |
| URS-A-072 | DocumentRevision SHALL store field-level diffs so reviewers can answer "what changed since v1.0"? | System | ALCOA+ "Attributable" | MUST | ✅ `changeBrief.fields[]` |

---

## 4. Part B — Differentiator (White-Space) Requirements

| ID | Requirement | Strategic rationale | MoSCoW | Current state |
|---|---|---|---|---|
| URS-B-001 | Hawkeye SHALL provide **AI-assisted bulk upload** that classifies, tags, and proposes approval chains for hundreds of docs in one operation, with a single signed batch import — incumbents require one-at-a-time entry. | Bulk SOP migration is the #1 onboarding blocker for new tenants | MUST | ✅ `docBulkUploadOrchestrator` wizard live |
| URS-B-002 | Document tags SHALL be **persona-aware and module-aware** — surfacing the same SOP differently to a Production Operator vs a QA Reviewer (filtered "must-know" inbox). | UX wedge: SOPs surface contextually rather than as filing cabinet | SHOULD | ⚠️ Tagger exists; persona-filter UI partial |
| URS-B-003 | Every approval-chain change SHALL be **versioned and audit-trailed** so regulators can answer "which chain was active when SOP v2.0 was approved on date X". | Inspector-readiness | MUST | ✅ `ApprovalChainTemplate` versioning |
| URS-B-004 | Hawkeye SHALL surface **cross-module reference counts** for each document ("this SOP is cited by 12 CAPA records, 4 audits, 3 risks") so DCO understands blast radius of revision. | Change-impact visibility no incumbent ships | SHOULD | ⚠️ Reference index scaffolded; UI partial |
| URS-B-005 | Periodic-review reminders SHALL be **risk-weighted** — high-risk SOPs (linked to high-RPN risks) reviewed more frequently than tenant default. | Cross-module signal: Risk module feeds review cadence | SHOULD | ⚠️ Risk-weight planned; today flat per-category cadence |
| URS-B-006 | An **AI summarizer** SHALL produce a 3-line change summary for v(n+1) ("what changed vs v(n), why it matters") for reviewer's review queue. | Reviewer cognitive load reducer | SHOULD | ⏳ Planned Q1 2027 |

---

## 5. Out-of-Scope (Explicitly Hand-Off)

- **Training execution** (assignment, quiz, retraining schedule) → Training module
- **Change Control workflow** for document changes → Change Control module (Doc Control issues the new version; Change Control runs the impact assessment)
- **Long-term archival storage tiering** (S3 Glacier transitions) → infra concern
- **AskHawk corpus indexing** of effective documents → AskHawk module consumes Doc Control via API

---

## 6. Assumptions and Dependencies

- **Multi-tenant model:** every document belongs to a `tenantOrgId`
- **Storage:** document body + attachments in S3-backed HawkVault; metadata in MongoDB
- **E-signature method:** password-based today (user's own password, bcrypt-verified)
- **LLM availability:** AI features degrade gracefully (classification falls back to manual; tagging falls back to manual entry)
- **Notification channels:** email by default; in-app banner for must-read

---

## 7. Acceptance Criteria

| URS ID range | Verification approach |
|---|---|
| A1 (lifecycle) | E2E test `frontend/e2e/document-lifecycle.spec.ts` |
| A2 (approval + e-sig) | Manual + backend test `documentApproval.test.js`; SoD test for `requireStepApprover` |
| A3 (distribution + receipts) | E2E read-receipt walk |
| A4 (review + retention) | Scheduler unit test; retention enforcement E2E (when implemented) |
| A5–A6 (AI + bulk) | AI eval suite + bulk-upload E2E |
| A7 (RBAC) | Permit middleware tests |
| A8 (audit trail) | Cross-module trail query test |
| B1–B6 (white-space) | Demo script + KPIs (bulk-import success rate, read-coverage %, mean-time-to-effective) |

---

## 8. Open Questions

1. **Per-tenant retention enforcement** — when do we ship automated purge gating? (Currently field-only)
2. **Risk-weighted review cadence (URS-B-005)** — what's the exact formula (RPN > 100 → 6-month review vs 24-month default)?
3. **AI change summarizer (URS-B-006)** — Q1 2027 commit; what's the eval criterion?
4. **Approval chain template versioning** — UI for tenant_admin to manage chain templates is partial; ship Q4 2026?
5. **Read-receipt scope** — required for SOP only, or for all categories?
6. **Mobile read-attestation** — operators on shop floor want mobile receipt UX; defer?
7. **External regulator access** — should regulators (FDA inspector) get a read-only token for specific docs without full tenant access?

---

## 9. Traceability Index (URS ↔ Code)

| URS section | Primary code | Primary UI |
|---|---|---|
| A1 lifecycle | `controllers/documentController.js`, `services/documentLifecycleService.js` | `/documents`, `/documents/[id]` |
| A2 approval + e-sig | `controllers/documentApprovalController.js`, `middlewares/requireStepApprover.js`, `middlewares/requireESignature.js` | `/documents/[id]/approve`, `SignatureDialog` |
| A3 distribution | `controllers/documentDistributionController.js` | `/documents/[id]/distribute` |
| A4 review + retention | `services/documentReviewService.js` | `/documents/[id]/review` |
| A5 AI classify/tag | `services/ai/docIntelClassifier.js`, `docIntelTagger.js` | upload modal AI panel |
| A6 bulk upload | `services/ai/docBulkUploadOrchestrator.js` | `/documents/bulk-upload` wizard |
| A7 RBAC | `middlewares/{authMiddleware,roleMiddleware}.js` | route-level page guards |
| A8 audit trail | `services/auditTrailService.js`, `models/{AuditTrail,DocumentRevision}.js` | `/documents/[id]/audit-log` |
| B1 bulk wizard | `services/ai/docBulkUploadOrchestrator.js` | `/documents/bulk-upload` |
| B4 cross-module refs | `services/documentReferenceIndex.js` | `/documents/[id]` references tab |
