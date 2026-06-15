# Design Control Summary Report (DCSR)

## S.M.A.R.T. Hawk — customer/auditor-facing technical design-control summary

> A **technical, URS-anchored** summary of the design controls applied to the S.M.A.R.T. Hawk platform, derived from the internal Design History File (DHF). It demonstrates, with **engineering specifics** (data models, state machines, control mechanisms, signature/audit-trail schemas), how each **core User-Requirement (URS) expectation is realized in design and corroborated through verification, validation and the operational lifecycle** — **without** exposing source code, AI prompts, model weights, or secret configuration. This is the artifact a pharma customer's supplier-quality/CSV team requests during qualification and references in regulatory interactions.

| Field | Value |
|---|---|
| Document number | `HK-DCSR-v2.0` |
| Record type | `DCSR` (Document Control module) |
| Owner | Principal Architect — author; QMS Head — approver |
| Effective date | 2026-06-15 |
| Audience | Customer supplier-quality / CSV / Regulatory Affairs (under NDA) |
| Classification | Confidential — shareable under NDA; **contains design summaries, not source/IP** |
| Derived from | [DDP `HK-DDP-v1.0`](DESIGN-AND-DEVELOPMENT-PLAN.md) · [AI Validation Plan](AI-VALIDATION-PLAN.md) · [SDLC Standard](../sdlc/SDLC-PROCESS-AND-DOCUMENTATION-STANDARD.md) · module URS (`06-modules/*/URS.md`) · [PLATFORM-CONTROLS](../platform-controls/PLATFORM-CONTROLS.md) |

> 📄 **Template + first instance.** Re-issue per major release. Technical content below is the **design summary** legitimately shared for audit; deeper artifacts (code, prompts, weights) remain in the DHF and are examined only under a deeper NDA / on-site audit.

---

## 1. Purpose

To show an external reviewer, **at engineering depth**, that every GxP-impacting capability is (a) traced to a user requirement, (b) realized by a specific, controlled design mechanism, (c) verified against that requirement, (d) validated for intended use in the commercial environment, and (e) kept correct across the lifecycle by change control and monitoring. This lets a customer complete supplier qualification and **leverage our design-control evidence in their own CSV under GAMP 5 Category 4** without source-code review.

## 2. Product & intended-use summary

- **Product:** S.M.A.R.T. Hawk AI-native EQMS (multi-tenant SaaS; optional sovereign deployment).
- **Intended use:** manage GxP quality workflows (supplier audit, supplier qualification, CAPA, deviation, change control, document control, risk) with **AI decision-support** and **human electronic signature on every committed record**.
- **GAMP classification:** **Category 4 — configured product.**
- **Architecture (5 layers, trust-first):** Experience (Next.js) → Domain Engine (15 modules on one configuration layer + the S.M.A.R.T. runtime pipeline) → AI Gateway (multi-LLM, grounded, cite-or-fallback) → Data & Evidence (multi-tenant MongoDB, S3-compatible evidence store, SHA-256 integrity) → **Trust (GAMP Cat 4 · Part 11 · Annex 11 · ALCOA+ · RBAC · data residency)**.
- **Essential design outputs** (failure would directly impact GxP): immutable **audit trail**, **electronic signature**, **access control / tenant isolation**, and **AI grounding**. These receive the strictest design controls and DFMEA scrutiny.

## 3. Core URS expectations → lifecycle corroboration (the technical heart)

For each core requirement group: the **URS expectation**, the **design realization** (technical), and how it is **corroborated** at Verification (V), Validation (Val) and in Operation (Ops). All requirement IDs reference the per-module URS (`06-modules/<module>/URS.md`).

### 3.1 Auditability — secure, attributable, immutable audit trail
- **URS expectation:** every create/modify/delete of a GxP record is captured with who, when, what, and **why**, retained for the record lifetime, and queryable across modules (Part 11 §11.10(e); Annex 11 §9; ALCOA+).
- **Design realization:** a single cross-module `AuditTrail` collection. Each row: `tenantId`, `entityType`, `entityId`, `action`, `actorId`, `actorRole`, `reasonForChange` (mandatory, ≥10 chars, never auto-defaulted), `signatureId` (when a signature applies), `before`/`after` snapshots, `meta.changeBrief.fields[]` (field-level diff), `createdAt` (UTC, server-set). **Immutability:** written through a single service (`auditTrailService.writeAuditTrail()`); **no update or delete path is exposed** at API or service layer (append-only). Indexed `(tenantId,entityType,entityId)`, `(tenantId,action)`, `(tenantId,createdAt)` for sub-2-second cross-module queries.
- **Corroboration:** **V** — unit/integration tests assert no mutation path and correct field capture; **Val** — UAT confirms a regulator-style query ("show all changes to audit X") returns the full chain; **Ops** — audit-trail completeness is monitored; export recomputes integrity hash.

### 3.2 Attribution & non-repudiation — electronic signature
- **URS expectation:** signed records show printed name, UTC date/time, and meaning; signatures are unique to one person, permanently linked to the record, and use ≥2 identification components (Part 11 §11.50/70/100/200; Annex 11 §14).
- **Design realization:** an append-only `ElectronicSignature` record: `signerId → name`, `signerRole`, `signatureMeaning ∈ {AUTHORED, REVIEWED, APPROVED, WITNESSED, REJECTED}`, `reasonForChange`, `authMethod ∈ {PASSWORD, MFA, SSO, …}`, `ipAddress`, `userAgent`, `signedAt` (UTC), and `contentHash` = **SHA-256 of the exact signed record snapshot**. **Binding:** `recordType + recordId` foreign-key links the signature to its record; detachment would violate DB-level integrity. **≥2 components:** identity (`signerId`/email) + secret (bcrypt-verified password) today; **MFA is a roadmap hardening (Q3 2026)**. Enforced by `requireESignature` middleware at every record-committing transition. *Current default is "soft-mode" (warn-and-allow); hard-mode default is Q3 2026 — disclosed.*
- **Corroboration:** **V** — tests assert the signature fields, hash, and binding; SoD test prevents one user signing two gated steps of the same version; **Val** — QA Head completes a real audit closure with a compliant signature; **Ops** — signatures are immutable records on the audit trail.

### 3.3 Access control & tenant isolation
- **URS expectation:** only authorized individuals access the system and records; no cross-tenant access (Part 11 §11.10(d)(g); Annex 11 §12).
- **Design realization:** a **4-layer middleware chain** on every endpoint — `authenticate` (JWT) → `resolveTenant` (binds `tenantOrgId`) → `permit(...roles)` (RBAC) → `requireESignature` (where the action commits a record). Data isolation is enforced **at the query layer** via tenant-scope helpers (e.g., `buildAuditTenantScopeQuery`), not UI filtering. Roles include `tenant_admin, qa_head, qa_manager, auditor, auditee/supplierUser, qa_prequal, qa_approver, …`. Cross-tenant auditor access requires an explicit affiliation record.
- **Corroboration:** **V** — permit-middleware and tenant-scope tests; negative tests assert no cross-tenant read; **Val** — role-based walkthrough per persona; **Ops** — quarterly logical-access review (SDLC LA-4); MFA/SSO roadmap (Q3 2026/Q1 2027).

### 3.4 Workflow integrity — forward-only state machines with gates
- **URS expectation:** the system enforces permitted sequencing; steps cannot be skipped; reverts are controlled and logged (Part 11 §11.10(f); ICH Q7 §13).
- **Design realization:** each module is a forward-only state machine validated server-side by a `*PhaseService.canTransition()` before any write; gate prerequisites (ownership role, prior e-sig, scope lock) are checked; reverts require elevated role + mandatory reason and write an audit-trail row. Representative lifecycles:

| Module | States | Key gates (e-sig) |
|---|---|---|
| **Audit** | INITIATED → PREP → PLANNING → EXECUTION → FINDINGS → CAPA → CLOSURE → SURVEILLANCE | G1 intimation; G5 scope-lock; G8 dual closure (auditor AUTHORED + sponsor APPROVED) |
| **Supplier Qualification** | NOMINATED → DATA_COLLECTION → DESK_REVIEW → ON_SITE_VISIT → SCORING → APPROVAL → APPROVED → PERIODIC_REQUAL | desk-review disposition; approval (score ≥ threshold) |
| **CAPA** | INITIATED → TRIAGE → INVESTIGATION → RCA → ACTION_PLANNING → EXECUTION → EFFECTIVENESS_CHECK → CLOSED | closure e-sig after effectiveness |
| **Change Control** | INITIATION → CLASSIFICATION → IMPACT_ASSESSMENT → APPROVAL_WORKFLOW → IMPLEMENTATION → PIR → CLOSURE | per-step approval (SoD); PIR sign-off |
| **Document Control** | DRAFT → IN_REVIEW → APPROVED → EFFECTIVE → SUPERSEDED → ARCHIVED | per-step approval (REVIEWED/APPROVED); SoD |
| **Deviation** | INTAKE → CLASSIFY → INVESTIGATE → DISPOSITION → (CAPA_SPAWN) → CLOSE | disposition e-sig |

- **Corroboration:** **V** — transition tests assert blocked illegal transitions and gate enforcement; **Val** — end-to-end workflow walkthroughs; **Ops** — state changes are audit-trailed.

### 3.5 Supplier qualification — transparent, risk-weighted scoring
- **URS expectation:** suppliers are qualified on a transparent, defensible risk score with documented factors and periodic requalification.
- **Design realization:** `supplierScoreService` computes a 0–100 score from weighted factors — **certifications 25%, audit history 20%, product criticality 20%, geography 15%, financial/legal 10%, ESG 10%** — each factor's contribution displayed (no black box). Tiers: **80–100 LOW** (annual requal), **60–79 MEDIUM** (semi-annual), **40–59 HIGH** (quarterly), **<40 BLOCK**. `supplierIntelAgent` augments the dossier from FDA/EMA-EudraGMDP/WHO-PQ public data. `requalScheduler` (cron) opens periodic requalification cases; overdue blocks downstream audits/bookings.
- **Corroboration:** **V** — scoring unit tests with snapshot weights; **Val** — qualification of a real supplier with QA-approver e-sig; **Ops** — requalification cadence runs; score changes audit-trailed.

### 3.6 Data integrity (ALCOA+) and record integrity
- **URS expectation:** records are Attributable, Legible, Contemporaneous, Original, Accurate (+ Complete, Consistent, Enduring, Available).
- **Design realization:** attribution via signatures + audit trail; contemporaneity via server-set UTC timestamps; originality via append-only storage + `before/after`; integrity via **`buildSnapshotHash` (SHA-256)** on signed snapshots and on every export (a hash mismatch raises a **CRITICAL** event); enduring/available via multi-region MongoDB + S3 evidence store + retention policy.
- **Corroboration:** **V** — hashing and export-integrity tests; **Val** — exported PDF/JSON verified to match source; **Ops** — restore tests (SDLC CO-1, Q4 2026) and retention enforcement (Q1 2027).

### 3.7 AI decision-support — grounded, reproducible, false-negative-aware
- **URS expectation:** AI assists GxP work without making decisions; outputs are evidence-based and auditable; AI cannot introduce uncontrolled error (esp. missed findings).
- **Design realization:** **cite-or-fallback (non-configurable)** — `groundedGenerationService` requires ≥1 citation to the retrieval set or returns an "insufficient evidence" skeleton; **confidence floor (≈0.6)** routes low-confidence to fallback; **AI decision audit trail (C15)** — `recordAiDecision()` logs `modelVersion`, `promptHash`, `retrievalSet`, `confidence`, and human `disposition` (accepted/edited/rejected), making any past AI output reproducible; **human commits the record** (e-sig gate after every AI draft). **False-negative controls** (full detail in the AI Validation Plan): mandatory human review with source evidence shown beside the draft, independent-reviewer gate on high-risk outputs, and ground-truth **recall** thresholds validated before release.
- **Corroboration:** **V** — AI-OQ against ground-truth eval sets (precision/recall/citation-completeness/calibration) with per-feature acceptance thresholds; **Val** — usability evaluation that the AI helps reviewers *catch* issues; **Ops** — human accept/edit/reject rates and drift monitored; model/prompt changes re-validated under change control.

## 4. Design-control conformance (21 CFR 820.30 / ISO 13485 §7.3 / IEC 62304) — with technical realization

| Element | Technical realization (summary) | DHF evidence |
|---|---|---|
| Planning (b) | Controlled DDP; risk-scaled rigor (CSA) | DDP §1–10 |
| Inputs (c) | URS/FRS per module with acceptance criteria + regulatory requirements register | Module URS; requirements records |
| Outputs (d) | Architecture, schemas, configuration model, code; essential outputs flagged (audit trail, e-sig, access, AI grounding) | Design specs; code (not disclosed) |
| Review (e) | Gated design reviews with independent reviewer, e-signed | Design-review records |
| Verification (f) | Unit/integration/E2E + SAST/DAST + OQ in staging; traceability matrix | CI reports; trace matrix |
| Validation (g) | UAT/PQ in **commercial environment** with real use cases + feedback | Validation Summary |
| Transfer (h) | Controlled release; staging IQ/OQ; rollback | Release records |
| Changes (i) | Change control + impact assessment + CAB + SoD + re-V&V | Change register |
| DHF (j) | Electronic, continuous: requirements → design → reviews → V&V → release on the immutable audit trail | DHF index |

## 5. Verification vs Validation — environments and evidence

| | Verification (build it right) | Validation (right product) |
|---|---|---|
| **Environment** | Non-commercial `staging` | **Commercial `production`** |
| **Focus** | Outputs meet inputs; edge cases; control effectiveness | User needs / intended use; real workflows; user feedback |
| **Methods** | Unit, integration, E2E (Playwright), SAST/DAST, OQ scripts, traceability | UAT protocol (URS-traced), PQ, human-factor evaluation |
| **Records** | CI reports, OQ results, traceability matrix | Validation Summary Report, UAT records |

> The advisor's distinction is honored explicitly: **verification occurs in test/staging; validation occurs in the commercial (production) environment** with real use cases and captured user feedback.

## 6. Risk management summary (ISO 14971 / ICH Q9 / ISO 31000)

Product risk is analyzed via **PHA → DFMEA → PFMEA → AFMEA** (full worksheets in the [SDLC Standard §5.2](../sdlc/SDLC-PROCESS-AND-DOCUMENTATION-STANDARD.md) and DDP §11.5). Highest-attention residual risks and their controls:

| Risk | Control |
|---|---|
| AI false negative (missed critical finding) | Human-commit gate; confidence-floor fallback; independent reviewer; ground-truth recall threshold |
| Audit-trail loss/alteration | Append-only; integrity hash; access SoD |
| Cross-tenant exposure | Query-layer tenant scoping; negative tests; pen-test |
| Change-induced regression | Change control + re-V&V + rollback |
| Unrecoverable data | Backups + periodic restore test (Q4 2026) |

## 7. Compliance posture (honest, dated)

| Area | Status |
|---|---|
| GAMP 5 Category 4 | ✅ Classified; Validation Accelerator Package available |
| 21 CFR Part 11 / EU Annex 11 | ✅ By design; **e-signature hard-mode default — Q3 2026** |
| Access control | RBAC + tenant isolation live; **MFA/SSO — Q3 2026 / Q1 2027** |
| Validation package per tenant | Completing **Q4 2026** |
| Backup restore-test cadence | **Q4 2026** |
| SOC 2 | Type I **Q3 2026** · Type II **Q1 2027** |
| ISO 9001 | Aligned; certification targeted **2027** |

*(Disclosed proactively; compensating controls — branch protection, immutable audit trail, RBAC, backups — operate in the interim.)*

## 8. Confidentiality boundary — what is intentionally not disclosed

This DCSR shares **design summaries** (schemas, states, control mechanisms) appropriate for audit. It **does not** include: source code, AI prompt templates, model weights / fine-tuning data, secret configuration, infrastructure credentials, or proprietary algorithm internals. These reside in the internal DHF and may be examined under a deeper NDA / on-site supplier audit where contractually agreed — consistent with GAMP Cat 4 supplier-leverage (no source-code review obligation).

## 9. How to request deeper evidence
Under NDA: the full Validation Accelerator Package, the [AI Validation Plan](AI-VALIDATION-PLAN.md), the FMEA worksheets, security-testing summaries, the SOC report (when issued), and a periodic supplier audit. Contact: the Compliance-Lifecycle Owner / `compliance@` mailbox.

## 10. Revision history
| Version | Date | Author | Reason |
|---|---|---|---|
| 1.0 | 2026-06-14 | Architect + QMS | Initial issue (reference-level) |
| 2.0 | 2026-06-15 | Architect + QMS | **Elaborated to technical depth**: URS→lifecycle corroboration, data/signature/audit-trail schemas, state machines, scoring model, AI control mechanisms |
