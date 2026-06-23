# Audit Management — URS & Process-Flow Validation, Gap List & Dev Plan

> Validation of the Audit Management module's **URS and documented process flow against the actual codebase**, a consolidated **gap list**, and a **development plan organized by roadmap phase** (NOW / NEXT / LATER / HORIZON). Evidence is cited to backend/frontend code.

| Field | Value |
|---|---|
| Document | `HK-AUDIT-VAL-v1.0` |
| Module | Audit Management |
| Spec sources | [URS.md](URS.md) (URS-A-* / URS-B-*) · [UNS.md](UNS.md) (~150 reqs) · [DESIGN.md](DESIGN.md) · [ARCHITECTURE.md](ARCHITECTURE.md) |
| Code sources | `codex_backend_01/src/{controllers,services,models,routes,constants}` · `codex_frontend_01/app/(console)/audits/**`, `components/audits/**` |
| Date | 2026-06-16 |
| Method | Static validation (spec ↔ code). *Dynamic/runtime validation pending the live test run — DB unreachable in sandbox; see [USER-GUIDE-AND-TEST-RESULTS.md](USER-GUIDE-AND-TEST-RESULTS.md).* |

---

## 1. Executive summary

| Result | Count |
|---|---|
| URS Part A (foundational) requirements | **46** → ✅ 41 · ⚠️ 5 · ❌ 0 |
| URS Part B (differentiator) requirements | **13** → ✅ 7 · ⚠️ 5 · 🚫 1 (business model) |
| UNS numbered requirements (16–150) | **~135** → substantially ✅ / roadmap |
| 8-phase process flow + gates (G1/G5/G8/G12) | ✅ **all implemented & enforced** |
| **Consolidated gaps** | **11** (2 High · 5 Medium · 4 Low) |

> 🩺 **Verdict:** the module **substantially satisfies** its URS and process flow as a GAMP Cat 4 configured product. No requirement is hard-missing; the 11 gaps are **partials/hardening items**. The only items that should gate **regulated production use** are **hard-mode e-signature (G1)** and the **report hash↔signature binding (G5)** — both small. The strategic gap is the **remote-audit cockpit UI (G7)**.

---

## 2. Process-flow validation

✅ The 8-phase lifecycle and all gates exist in code and are enforced.

| Phase | Owner | Code evidence |
|---|---|---|
| INITIATED → PREP → PLANNING → EXECUTION → FINDINGS → CAPA → CLOSURE → SURVEILLANCE | per-phase | `constants/auditPhases.js` (phase defs + ownerRole); `services/auditPhaseService.js` `canTransition()` (forward-only), `applyPhaseTransition()` |

| Gate | Requirement | Code evidence | Status |
|---|---|---|---|
| **G1** intimation e-sig | URS-A-021/023 | `controllers/intimationSignatureController.js`; `routes/auditPhaseRoutes.js:111` | ✅ (⚠️ soft-mode default — G1 gap) |
| **G5** execution scope lock | URS-A-041 | `controllers/executionScopeController.js` `finalizeExecutionScope()` | ✅ |
| **G8** closure dual e-sig | URS-A-061/063 | `controllers/auditClosureController.js` `createClosureCertificate()` + `approveClosureCertificate()` | ✅ |
| **G12** observation drafted + reviewed | URS-A-050 | `controllers/observationDrafterController.js` `draftObservation()` | ✅ |

Every transition writes an immutable audit-trail row (`auditTrailService.writeAuditTrail()` from `auditPhaseController`) — URS-A-013/080 ✅.

**Flow-vs-spec discrepancies:** none in the phase set/gates. The only enforcement caveat is the **soft-mode e-sig default** (the gate *can* be bypassed unless `ENFORCE_ESIG=hard`).

---

## 3. URS validation matrix

### 3.1 Part A — foundational (✅ 41 / ⚠️ 5)
Only the ⚠️ partials need action; all others verified ✅ (evidence in [URS.md §9 traceability](URS.md) + code).

| ID | Requirement (short) | Status | Evidence / gap |
|---|---|---|---|
| A-001…A-005 | Request create, IDs, auditor assign, accept/reject, supplier decision | ✅ | `auditRequestController`, `requestIdService`, `/auditors/available` |
| **A-006** | Phase-0 deficiency-validation **blocking** gate | ⚠️ | Route exists (`/deficiency-validation`) but **not verified as a hard transition blocker** → **Gap G2** |
| A-010…A-015 | 8-phase machine, tracking, forward-only, trail, stepper, tab-gating | ✅ | `auditPhaseService`, `AuditPhaseStepper`, `AuditRequestTabs` |
| A-020…A-022 | Intimation artifact + e-sig ceremony + record fields | ✅ | `intimationSignatureController`, `ElectronicSignature` model |
| **A-023** | Block PREP without valid intimation sig | ⚠️ | **Soft-mode default** (`ENFORCE_ESIG=soft`); no per-tenant flag → **Gap G1** |
| A-030…A-032, A-034 | PAQ artifact, section assignment, multi-type fields, status flow | ✅ | `SmartQuestion`, `/assign-sections`, milestone codes |
| **A-033** | OCR + LLM auto-fill w/ confidence + citation | ⚠️ | `aiPrefillController`/`auditAutofillAgent` present; **doc-ingestion pipeline not fully wired** → **Gap G3** |
| A-040…A-043 | Execution scope build/lock, live evidence, remote session | ✅ | `executionScopeController`, `AuditNote`, `RemoteSession` |
| A-050…A-055 | Observation manual/AI, schema, confidence-floor, review, AI trail, disposition | ✅ | `observationDrafterController`, `groundedGenerationService`, `recordAiDecision()` |
| **A-060** | FINAL_REPORT + SHA-256 integrity anchor | ⚠️ | Hash on PDF present; **`anchorHash` ↔ signature binding incomplete** → **Gap G5** |
| A-061…A-064 | Report multi-sign, closure cert, buyer approval, REJECT→CAPA | ✅ | `auditClosureController`, report sign (multi-role) |
| A-070…A-073 | RBAC, cross-tenant guard, auditor filter, availability | ✅ | `permit()`, `canAuditorAccessAudit()`, `AvailabilityBlock` |
| A-080…A-083 | Trail every change, immutable, reason≥10ch, field diffs | ✅ | `auditTrailService`, `meta.changeBrief` |
| A-090 | Event notifications | ✅ | `NotificationOrchestratorService` |
| **A-091** | Overdue reminders | ⚠️ | Dashboard banner only; **no overdue cron/email job** → **Gap G4** |

### 3.2 Part B — differentiators (✅ 7 / ⚠️ 5 / 🚫 1)

| ID | Requirement (short) | Status | Evidence / gap |
|---|---|---|---|
| **B-001** | Remote-audit cockpit (video + screen-share + annotation) | ⚠️ | `RemoteSession` foundation only; **consolidated cockpit UI deferred** → **Gap G7 (High/strategic)** |
| B-002 | Supplier-first portal | ✅ | `/supplier/audits/*` |
| B-003 | Grounded + cited + confidence + reproducible AI | ✅ | `groundedGenerationService`, AuditTrail.ai.* |
| **B-004** | Active-learning loop (auto variant A/B) | ⚠️ | Disposition captured; **auto-tuning not wired** → **Gap G10** |
| B-005 | Auditor coach panel | ✅ | `AuditorCoachPanel`, `/coach/.../growth-plan` |
| **B-006** | Cross-company audit intel (consent) | ⚠️ | tenant+public fusion only; **cross-tenant findings + consent UI deferred** → **Gap G8** |
| **B-007** | Predictive CAPA-effectiveness at draft | ⚠️ | Wave-3 model exists; **not wired to drafter** → **Gap G9** |
| B-008 | Plan-then-execute App Wizard | ✅ | `wizard.create_audit`, `multiStepAgent`, `WizardStepper` |
| B-009 | Cross-module audit-trail browser | ✅ | `/audit-trail/by-entity` |
| B-010 | Price below Veeva floor | 🚫 | Business model, not a module feature |
| B-011 | Honest fallback (no hallucination) | ✅ | `groundedGenerationService` skeleton path |
| **B-012** | TSA cryptographic timestamp | ⚠️ | SHA-256 only; **TSA not wired** → **Gap G6** |
| B-013 | Industry-agnostic engine (vertical packs) | ✅ | `assessment-types` + clause libraries |

*Plus the cross-cutting UNS requirements (persona/RBAC, evidence, AI governance, ALCOA+, security, performance, accessibility, validation) are substantially implemented or on the platform roadmap (see agent matrix UN-16…150).*

---

## 4. Consolidated gap list

| # | Gap | URS ref | Severity | Effort | Fix summary |
|---|---|---|---|---|---|
| **G1** | E-sig **soft-mode** default; no per-tenant hard-enforce flag | A-023 | **High** | S | Add tenant config `eSigEnforcement`; default **hard** for production tenants |
| **G2** | Phase-0 deficiency-validation not a verified blocking gate | A-006 | Medium | S | Make `deficiencyValidation` status block PREP→PLANNING in `canTransition()`; add test |
| **G3** | OCR + LLM auto-fill doc-ingestion pipeline incomplete | A-033 | Medium | M | Wire HawkVault doc retrieval → OCR → prefill agent with per-field confidence + citation |
| **G4** | Overdue-task reminders (no cron/email) | A-091 | Low | M | Scheduled overdue-check job → `NotificationOrchestratorService` |
| **G5** | Report integrity anchor: hash ↔ signature binding incomplete | A-060 | Medium | S | Bind immutable SHA-256 `anchorHash` to each report version + e-signature |
| **G6** | TSA (trusted timestamp) not wired | B-012 | Low | L | Select TSA (FreeTSA/DigiStamp/in-house RFC-3161); anchor report/audit-trail hashes |
| **G7** | Remote-audit cockpit UI (video+screen-share+annotation) deferred | B-001 | **High** (strategic) | L | Build consolidated cockpit: Zoom/Teams embed + annotation canvas + evidence panel |
| **G8** | Cross-tenant supplier-intel surfacing + consent | B-006 | Medium | M | Consent UI + cross-tenant finding query with PII/confidentiality guards |
| **G9** | Predictive CAPA-effectiveness not wired to drafter | B-007 | Low | M | Call Wave-3 model as optional score on CAPA recommendation |
| **G10** | Active-learning auto-tuning not in prod | B-004 | Low | M | Automated prompt-variant generation + human-approved rollout |
| **G11** | Dual status-field debt (`trackStatus` vs `phaseState`) | (tech debt) | Medium | M | Burn down `trackStatus` callers; drop field in v2.0 |

---

## 5. Development plan — by roadmap phase

Mapped to the platform roadmap (Positioning §15 / Costing) and the budgeted engineering capacity. Each item lists owner, effort, and **closure acceptance**.

### Phase NOW — M0–6 (Q2–Q3 2026): regulated-production gating
*Goal: nothing blocks a pharma tenant from validating + going live.*

| Gap | Work | Owner | Effort | Acceptance |
|---|---|---|---|---|
| **G1** | Per-tenant e-sig enforcement; default **hard** for prod | Backend + QMS | S | New prod tenant cannot transition a gate without a valid e-sig; soft is opt-in legacy only; OQ test passes |
| **G5** | Bind report `anchorHash` (SHA-256) to each version + signature | Backend | S | Any report export re-verifies hash; mismatch → CRITICAL; hash referenced in e-sig record |
| **G2** | Enforce Phase-0 deficiency gate in `canTransition()` | Backend | S | PREP→PLANNING blocked until deficiency-validation complete; negative test passes |
| **G11 (start)** | Begin `trackStatus`→`phaseState` caller burndown | Backend | M (split) | Inventory + first 50% callers migrated; no new `trackStatus` writes |

### Phase NEXT — M6–12 (Q4 2026–Q1 2027): AI completeness + ops
| Gap | Work | Owner | Effort | Acceptance |
|---|---|---|---|---|
| **G3** | Complete OCR→retrieval→auto-fill pipeline | AI + Backend | M | PAQ fields auto-filled from uploaded docs with per-field confidence + citation; AI-OQ recall threshold met |
| **G4** | Overdue-reminder scheduled job | Backend | M | Overdue tasks email + dashboard reminder per persona; configurable cadence |
| **G9** | Wire predictive CAPA-effectiveness to drafter | AI | M | CAPA recommendation shows effectiveness score; low-likelihood flagged |
| **G11 (finish)** | Drop `trackStatus`; `phaseState` single source | Backend | M | Field removed in v2.0; regression-clean |

### Phase LATER — M12–18 (Q2–Q3 2027): strategic differentiators + breadth
| Gap | Work | Owner | Effort | Acceptance |
|---|---|---|---|---|
| **G7** | Remote-audit **cockpit UI** (video + screen-share + annotation + evidence panel) | Eng + Design | L | Consolidated cockpit ships; live remote audit conducted end-to-end with in-tool annotation → evidence |
| **G8** | Cross-tenant supplier-intel + consent | AI + Backend | M | With consent, "another buyer found X" recurring-finding flag surfaces; PII-guarded |
| **G10** | Active-learning loop (human-approved variant rollout) | AI | M | Acceptance-rate dashboard per feature; variant A/B with approval gate |
| **Audit subtypes/templates** | Implement [`AUDIT-SUBTYPES-BACKLOG-SPEC`](AUDIT-SUBTYPES-BACKLOG-SPEC.md) | Backend + Product | M | 13 subtypes selectable; templates per subtype; for-cause/CAPA-follow-up triggers; Cat 4 (config) |

### Phase HORIZON — M18+ (2028): trust-maximization + verticals
| Gap | Work | Owner | Effort | Acceptance |
|---|---|---|---|---|
| **G6** | TSA (RFC-3161) anchoring of report/audit-trail hashes | Security + Backend | L | Each closed report carries a TSA token; independently verifiable |
| **G13 (vertical packs)** | Med-device/food/auto/aero clause libraries on the generic engine | Product + AI | L | New vertical audit runs via config pack, no code fork |

---

## 6. Closure acceptance (definition of done for "validated")

The module is **fully validated to URS** when: (a) all High/Medium gaps (G1, G2, G3, G5, G7, G8, G11) are closed; (b) the **live Template-#3 / Sai-Life test run** passes (see [USER-GUIDE-AND-TEST-RESULTS.md](USER-GUIDE-AND-TEST-RESULTS.md)) with screenshots; (c) the URS↔code traceability index ([URS.md §9](URS.md)) shows ✅ for every MUST; and (d) configuration-specific OQ is executed per the customer's CSV.

---

## 7. Revision history
| Version | Date | Author | Reason |
|---|---|---|---|
| 1.0 | 2026-06-16 | QA + Engineering | Initial static validation, gap list & phased dev plan |
