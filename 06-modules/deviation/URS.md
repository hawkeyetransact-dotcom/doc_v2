# URS — Deviation

| Field | Value |
|---|---|
| Module | Deviation |
| Owner | Product (Hawkeye Platform) |
| Status | DRAFT (reverse-engineered from current code + canon) |
| Version | 0.1 |
| Last updated | 2026-06-01 |
| Regulatory anchors | 21 CFR Part 11, 21 CFR 211.192 (Production record review), ICH Q7 §8 (In-process controls), EU GMP Ch.1 §1.4, ISO 9001 §10.2 |
| Source | Reverse-engineered from `backend/src/{routes,controllers,services,models}/deviation*.js` + `frontend/components/deviation/` + `backend/src/services/ai/**/deviation*` |

---

## 1. Purpose and Scope

**Purpose.** Hawkeye Deviation manages **in-process deviations from defined procedures or specifications** in regulated manufacturing — from operator intake on the floor, through classification (Critical / Major / Minor), investigation, root-cause analysis, disposition, and either resolution or CAPA generation. Six AI agents collaborate end-to-end to compress cycle time without sacrificing 21 CFR Part 11 traceability.

**In scope:**
- Deviation intake (operator, production manager, supplier user)
- Auto + manual classification: Critical / Major / Minor
- Similar-deviation surfacing (find historical patterns at intake)
- Investigation workspace
- 5-Why RCA with structured scaffolding
- Disposition (release-as-is / rework / scrap / quarantine)
- Trend alerting across deviations
- CAPA recommendation + spawn (hand off to CAPA module)
- Signed closure with full audit trail

**Out of scope (handed off):**
- CAPA lifecycle execution → [capa](../capa/URS.md). Deviation spawns a CAPA via `capaRecommender`; CAPA module owns from there.
- Audit findings → [audit-management](../audit-management/URS.md)
- Change Control → [change-control](../change-control/URS.md)
- Batch record release → `06-modules/batch-records/`
- Risk register updates → `06-modules/risk-management/`

---

## 2. Stakeholders and Personas

| Persona | Role | Goals | Pain points without this module |
|---|---|---|---|
| **Production Operator** | Reports the deviation at point of occurrence | Fast intake (mobile/tablet-friendly); not slowed down on floor | Paper deviation forms; lost evidence; delays |
| **Production Manager** | Initial review + escalation | Triage quickly; know which deviations actually matter | Spreadsheet of deviations; no auto-classify |
| **QA Investigator** | Investigates, drafts RCA, recommends disposition | Structured RCA with historical context; AI-suggested similar cases | Free-text Word docs; reinventing investigation each time |
| **QA Head** | Approves disposition + e-sig batch hold (Critical) | Signed disposition; clear escalation for Critical | No e-sig ceremony; ad-hoc batch holds via email |
| **Supplier QA** | Responds to supplier-side deviations | Single inbox; visible response trail | Email threads; lost audit trail |
| **Tenant Admin** | Configures classification matrix, trend thresholds | Per-tenant tuning of severity rubric | Vendor controls everything |

---

## 3. Part A — Foundational Requirements

### A1. Intake

| ID | Requirement | Persona | Reg anchor | MoSCoW | Current state |
|---|---|---|---|---|---|
| URS-A-001 | System SHALL accept deviation intake with: occurrence date, location/equipment, product/batch ref, description, immediate actions taken. | Operator | 21 CFR 211.192 | MUST | ✅ `POST /api/deviations` + `DeviationIntakeForm` |
| URS-A-002 | Each deviation SHALL receive a tenant-scoped unique ID (e.g., `DEV-2026-001234`). | System | 21 CFR Part 11 §11.10 | MUST | ✅ `requestIdService.generateDeviationId()` |
| URS-A-003 | Intake form SHALL accept attachments (photo, document, audio). | Operator | Evidence completeness | MUST | ✅ multi-attachment upload |
| URS-A-004 | Intake SHALL be possible from a mobile-optimized view for floor operators. | Operator | UX baseline | SHOULD | ⚠️ Responsive layout in place; native mobile path deferred |

### A2. Classification (Critical / Major / Minor)

| ID | Requirement | Persona | Reg anchor | MoSCoW | Current state |
|---|---|---|---|---|---|
| URS-A-010 | System SHALL classify each deviation into one of: **Critical** (direct product/patient impact), **Major** (potential impact), **Minor** (no impact). | QA Investigator | ICH Q7 §8 | MUST | ✅ `DeviationCategorization` model |
| URS-A-011 | AI SHALL auto-classify on intake via `deviationIntakeClassifier`, returning predicted class + confidence + reasoning citations. | System | UX accelerator | MUST | ✅ Wave-2 agent live |
| URS-A-012 | AI-suggested class SHALL be reviewable + overridable by QA Investigator before commit (human-in-loop). | QA Investigator | UX safety | MUST | ✅ `DeviationClassifyForm` review modal |
| URS-A-013 | A **Critical** classification SHALL trigger automatic batch hold + escalation to QA Head + Production Manager. | System | 21 CFR 211.192 | MUST | ✅ batch-hold event emitted (downstream consumer wires vary) |
| URS-A-014 | All classification decisions SHALL be audit-trailed with actor + reasonForChange + before/after class. | System | 21 CFR Part 11 §11.10(e) | MUST | ✅ `auditTrailService` |

### A3. Similar-Deviation Surfacing

| ID | Requirement | Persona | Reg anchor | MoSCoW | Current state |
|---|---|---|---|---|---|
| URS-A-020 | System SHALL surface historically similar deviations at intake + investigation time via `deviationSimilarFinder` AI. | All | ICH Q7 §8 | SHOULD | ✅ Wave-2 agent live |
| URS-A-021 | Similar-deviation results SHALL include: deviation ID, occurrence date, similarity score, prior root cause, prior disposition. | System | UX accelerator | SHOULD | ✅ result schema |

### A4. Investigation + RCA

| ID | Requirement | Persona | Reg anchor | MoSCoW | Current state |
|---|---|---|---|---|---|
| URS-A-030 | System SHALL provide an investigation workspace with problem statement, timeline, witnesses, evidence. | QA Investigator | 21 CFR 211.192 | MUST | ✅ `DeviationInvestigation` embedded |
| URS-A-031 | System SHALL provide a structured 5-Why RCA scaffolder via `deviationFiveWhyScaffolder`. | QA Investigator | ICH Q7 §8 | MUST | ✅ `DeviationFiveWhyScaffolder` component + Wave-2 agent |
| URS-A-032 | RCA AI draft SHALL include: each "why" step + supporting evidence + suggested root cause + confidence. | System | UX accelerator | MUST | ✅ `deviationFiveWhyScaffolder` output schema |

### A5. Disposition

| ID | Requirement | Persona | Reg anchor | MoSCoW | Current state |
|---|---|---|---|---|---|
| URS-A-040 | System SHALL support disposition outcomes: **Release-as-is**, **Rework**, **Scrap**, **Quarantine**, **Reject**. | QA Head | 21 CFR 211.192 | MUST | ✅ disposition enum |
| URS-A-041 | AI SHALL suggest a disposition via `deviationDispositionDrafter` based on classification + RCA + similar-deviation precedent. | System | UX accelerator | SHOULD | ✅ Wave-2 agent live |
| URS-A-042 | Disposition SHALL require e-signature by QA Head (signatureMeaning=APPROVED). | QA Head | **21 CFR Part 11 §11.50** | MUST | ✅ `requireESignature` on disposition endpoint |
| URS-A-043 | Critical-classified deviations SHALL block disposition until QA Head reviews + signs (no auto-approve). | System | 21 CFR 211.192 | MUST | ✅ enforced in `dispositionController` |

### A6. CAPA Generation

| ID | Requirement | Persona | Reg anchor | MoSCoW | Current state |
|---|---|---|---|---|---|
| URS-A-050 | System SHALL recommend a CAPA via `capaRecommender` AI: CAPA type (corrective/preventive) + scope + initial action seeds. | System | ICH Q10 §3.2.2 | SHOULD | ✅ Wave-2 agent live |
| URS-A-051 | QA Investigator SHALL be able to spawn a CAPA from the deviation with one click, passing context to the CAPA module. | QA Investigator | UX accelerator | MUST | ✅ `POST /api/deviations/:id/spawn-capa` |
| URS-A-052 | The spawned CAPA SHALL retain a bidirectional link to the source deviation (CAPATrigger record). | System | ALCOA+ "Complete" | MUST | ✅ `CAPATrigger.triggerType=DEVIATION` |

### A7. Trend Alerting

| ID | Requirement | Persona | Reg anchor | MoSCoW | Current state |
|---|---|---|---|---|---|
| URS-A-060 | System SHALL run `trendAlerter` AI across deviations to detect: same equipment cluster, same SOP cluster, same supplier cluster, time-window spikes. | System | ICH Q7 §8 + Q10 §3 | SHOULD | ✅ Wave-2 agent live; threshold tuning needed |
| URS-A-061 | Trend alerts SHALL surface on dashboard via `DeviationTrendsBanner`. | All | UX baseline | MUST | ✅ component live |
| URS-A-062 | Trend alerts SHALL be acknowledgeable (with reasonForChange) — no silent dismissal. | QA Head | ALCOA+ | MUST | ✅ acknowledge action audit-trailed |

### A8. Closure

| ID | Requirement | Persona | Reg anchor | MoSCoW | Current state |
|---|---|---|---|---|---|
| URS-A-070 | Deviation SHALL close on: disposition signed + (CAPA spawned OR no-CAPA-needed rationale documented). | System | 21 CFR 211.192 | MUST | ✅ `closureController` |
| URS-A-071 | Closure SHALL require RCA approval signature (separate from disposition). | QA Head | ALCOA+ | MUST | ✅ separate e-sig endpoint |

### A9. RBAC + Tenant Isolation + Audit Trail

| ID | Requirement | Persona | Reg anchor | MoSCoW | Current state |
|---|---|---|---|---|---|
| URS-A-080 | Deviations SHALL be tenant-scoped; cross-tenant reads blocked at service layer. | System | 21 CFR Part 11 §11.10(d) | MUST | ✅ `buildDeviationTenantScopeQuery()` |
| URS-A-081 | Every state change, signature, and AI decision SHALL write an immutable AuditTrail row. | System | **21 CFR Part 11 §11.10(e)** | MUST | ✅ shared `auditTrailService` |
| URS-A-082 | Reason-for-change required ≥10 characters on regulated transitions. | System | ALCOA+ | MUST | ✅ SignatureDialog validation |

---

## 4. Part B — Differentiator (White-Space) Requirements

| ID | Requirement | Strategic rationale | MoSCoW | Current state |
|---|---|---|---|---|
| URS-B-001 | **6-agent AI stack** (classifier + similar-finder + 5-Why scaffolder + disposition drafter + CAPA recommender + trend alerter) SHALL collaborate end-to-end, all grounded + cited + audit-trailed. | No competitor (Veeva, MasterControl, TrackWise) offers anything like this depth of AI co-pilot | MUST | ✅ all 6 agents live |
| URS-B-002 | **Real-time trend dashboard** SHALL surface emerging patterns (equipment, SOP, supplier, time window) within hours of intake — not the next month's QMS review. | Inspector-readiness; pre-emptive risk reduction | MUST | ✅ `DeviationTrendsBanner` + nightly job; threshold tuning open |
| URS-B-003 | **One-click CAPA spawn with context** — investigator clicks "Spawn CAPA," the CAPA module pre-fills problem statement + RCA + suggested actions from `capaRecommender`. | Compress dev-to-CAPA latency from days to minutes | MUST | ✅ live |
| URS-B-004 | **Mobile floor intake** SHALL allow an operator to file a deviation with photo + voice memo from a tablet in < 60 seconds. | Lifts the floor-paper-form barrier that incumbents tolerate | SHOULD | ⚠️ Responsive layout; native mobile UX deferred |
| URS-B-005 | **Predictive CAPA effectiveness** SHALL flag low-likelihood-of-success recommendations from `capaRecommender` so investigator iterates before commit. | Reduces re-litigation; pairs with CAPA module URS-B-002 | SHOULD | ⚠️ Shared Wave-3 model scaffolded; cross-module wiring pending |

---

## 5. Out-of-Scope (Explicitly Hand-Off)

- **CAPA lifecycle** after spawn → [capa](../capa/URS.md). Deviation module hands off via `capaRecommender` + `POST /api/deviations/:id/spawn-capa`.
- **Audit observation drafting** → [audit-management](../audit-management/URS.md). Auditors may reference deviations but don't manage them here.
- **Change Control workflow** → [change-control](../change-control/URS.md). A change can be triggered by a deviation trend; managed in the change module.
- **Batch record release decisions** → `06-modules/batch-records/`. Deviation can block batch release; release ceremony lives in batch-records.
- **Document Control SOP updates** triggered by a deviation root cause → `06-modules/document-control/`.

---

## 6. Assumptions and Dependencies

- **Multi-tenant model:** every deviation belongs to a `tenantOrgId`.
- **Batch-hold integration:** depends on batch-records module emitting/consuming hold events.
- **LLM availability:** all 6 AI agents degrade gracefully — classifier defaults to "Major" pending review, RCA scaffolder gives empty template, trend alerter pauses.
- **E-signature method:** password-based today (bcrypt-verified).
- **Storage:** evidence in S3-backed HawkVault; metadata in MongoDB.

---

## 7. Acceptance Criteria

| URS ID range | Verification approach |
|---|---|
| A1 (intake) | E2E `deviation-intake.spec.ts`; unit tests on Deviation model |
| A2 (classification + AI) | Eval suite `deviationIntakeClassifier.eval.js`; manual override path test |
| A3 (similar) | Eval suite `deviationSimilarFinder.eval.js` |
| A4 (RCA + AI) | Eval suite `deviationFiveWhyScaffolder.eval.js` |
| A5 (disposition + e-sig) | Manual sign ceremony + cross-check AuditTrail row |
| A6 (CAPA spawn) | E2E `deviation-to-capa.spec.ts` |
| A7 (trend alerting) | Synthetic-data test on trend job; banner visibility test |
| A8 (closure) | E2E closure path |
| A9 (RBAC + trail) | Cross-tenant guard tests + AuditTrail row query |
| B1–B5 | Demo script (B1, B3); roadmap KPIs (B2, B5); product strategy (B4) |

---

## 8. Open Questions

1. **Trend threshold tuning** (URS-A-060, URS-B-002) — how do we calibrate "this is a real trend" vs noise? Per-tenant configurable? AI-tuned?
2. **CAPA recommender accuracy validation** (URS-A-050) — what's our acceptance-rate KPI for `capaRecommender` outputs?
3. **Critical-class hard block vs soft warn** — should a Critical classification force batch hold, or warn the QA Head with override-with-reason?
4. **Mobile intake** (URS-B-004) — native app vs PWA vs responsive web?
5. **Cross-tenant similar-deviation surfacing** — when a supplier appears across multiple buyer tenants, can we surface "another buyer saw the same deviation here" with consent?
6. **Disposition AI confidence floor** — same 0.6 default as observation drafter? Or higher given regulatory weight?

---

## 9. Traceability Index (URS ↔ Code)

| URS section | Primary code | Primary UI |
|---|---|---|
| A1 intake | `controllers/deviationController.js`, `models/Deviation.js` | `DeviationIntakeForm`, `/deviations` |
| A2 classification | `services/ai/wave2/deviationIntakeClassifier.js`, `controllers/deviationClassifyController.js` | `DeviationClassifyForm` |
| A3 similar | `services/ai/wave2/deviationSimilarFinder.js` | `SimilarDeviationPanel` |
| A4 RCA | `services/ai/wave2/deviationFiveWhyScaffolder.js` | `DeviationFiveWhyScaffolder` |
| A5 disposition | `controllers/dispositionController.js`, `services/ai/wave2/deviationDispositionDrafter.js` | `/deviations/[id]/disposition` |
| A6 CAPA spawn | `controllers/deviationController.js`, `services/ai/wave2/capaRecommender.js` | spawn-CAPA button |
| A7 trends | `services/ai/wave2/trendAlerter.js` (nightly job) | `DeviationTrendsBanner` |
| A8 closure | `controllers/deviationClosureController.js` | `/deviations/[id]/close` |
| A9 RBAC + trail | `utils/deviationAccess.js`, shared `auditTrailService` | `/deviations/[id]/audit-log` |
| B1 6-agent stack | `services/ai/wave2/deviation*.js` | `/deviations/[id]/*` panels |
