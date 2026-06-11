# URS — AskHawk

| Field | Value |
|---|---|
| Module | AskHawk (cross-cutting AI co-worker) |
| Owner | Product (Hawkeye Platform) + AI Lead |
| Status | **LIVE — all 3 phases shipped May 2026** |
| Version | 1.0 |
| Last updated | 2026-06-01 |
| Regulatory anchors | **21 CFR Part 11 §11.10(b)** (authenticity — cited AI), **§11.10(e)** (audit trail), **ICH Q10 §2.2** (knowledge management), **EU GMP Annex 11** (computerized systems), GDPR §22 (automated decision-making — human-in-loop preserved) |
| Source | `backend/src/services/ai/**`, `backend/src/routes/askhawk*.js`, `backend/src/data/{regulatory-corpus,sop-templates,workflow-playbooks}.json`, `frontend/components/ai/{AskHawkDrawer,ComplianceCopilot,WizardStepper}.tsx` |

---

## 1. Purpose and Scope

**Purpose.** AskHawk is Hawkeye's **cross-cutting AI co-worker** — a persona-aware, grounded, cited, confidence-scored, audit-trailed assistant that:
- **Answers** regulatory questions (Phase 1)
- **Surfaces** SOPs + workflow playbooks (Phase 2)
- **Executes** approved multi-step actions across modules (Phase 3: App Wizard)

It is **not a chatbot retrofit**. It is native to the platform — every output cites KB chunks, every call writes a Part 11–grade audit-trail row, and every write action requires explicit e-signature.

**In scope:**
- **Phase 1: Regulations Q&A** — 11 standards × 32 clauses in `regulatory-corpus.json`
- **Phase 2A: SOP templates** — 6 templates × 5 sections (intake, investigation, action, verification, closure)
- **Phase 2B: Workflow playbooks** — 38 persona-aware playbooks × 9 personas × 12 modules
- **Phase 3: App Wizard** — plan-then-execute with 8 tools (mixed Read + Write); single e-sig covering all WRITE steps in a plan
- Persona-aware retrieval (same question yields different answers for buyer QA vs supplier QA vs auditor)
- KB ingestion (markdown / PDF / docx → chunks → embeddings → MongoDB)
- Active-learning feedback capture
- Multi-LLM gateway with skeleton fallback

**Out of scope (handed off):**
- Per-module AI features (observation drafter, supplier intel, CAPA RCA, deviation classifier) → those modules; AskHawk supplies the **groundedGenerationService pipeline** they reuse
- Document Control vault for KB source files → HawkVault (AskHawk indexes from there)
- App Wizard tool registration per-module — each module defines its tools; AskHawk runtime executes them
- Active-learning auto-tuning (variants A/B test promotion) — scaffolded; human-approval-gated today

---

## 2. Stakeholders and Personas

AskHawk serves **all Hawkeye platform users** — persona is a first-class input to retrieval + answer generation.

| Persona | Role | Typical asks | Why persona matters |
|---|---|---|---|
| **Buyer / Audit PM** (Priya) | Manages audit programme | "How do I plan an annual audit for a supplier in India?"; wizard: "Create audit for X" | Sees buyer-side playbooks; can invoke `wizard.create_audit` (WRITE) |
| **Auditor** (Maria) | Conducts audits | "What's the best practice for citing 21 CFR 211.192?"; "Draft observation from these notes" | Sees auditor-side playbooks; can invoke `wizard.draft_observation` (Read) |
| **Co-Auditor** (Rahul) | Supports lead auditor | "What questions to ask under §13.20?" | Read-only views; cannot invoke WRITE tools |
| **Supplier QA Head** (Asha) | Responds to audits | "How do I respond to an observation about cleaning validation?"; "What's required by ICH Q7 §17 for re-packers?" | Sees supplier-side playbooks (different wording, different references) |
| **Supplier Ops** (Amit/Deepa) | Section owners | "How do I fill the Production section of a PAQ?" | Supplier-section-specific guidance |
| **VP Quality / QA Head** (Elena) | Programme oversight | "Show me CAPA effectiveness trends"; "Summarize regulatory inspection prep" | Aggregate views; high-stakes phrasing |
| **Reg Affairs** (Mei-Lin) | Submissions | "What does MDR Annex II §6.2 require for design?" | Reg-corpus retrieval primary |
| **Marketplace Admin** | Platform side | "Why was auditor X delisted?"; SOP for moderation | Internal SOPs |
| **Tenant Admin** | Configures platform | "How do I configure e-sig hard mode?" | Tenant-config playbooks |

---

## 3. Part A — Foundational Requirements

### A1. Conversational Interface

| ID | Requirement | Persona | Reg anchor | MoSCoW | State |
|---|---|---|---|---|---|
| URS-A-001 | User SHALL invoke AskHawk via floating sparkle button (bottom-left), via right-edge `ComplianceCopilot`, or via slash-command in module views. | All | UX | MUST | ✅ `AskHawkDrawer` + `ComplianceCopilot` |
| URS-A-002 | UI SHALL surface intent chips at conversation start: "How do I…", "SOPs", "Regulations", "Do this for me". | All | UX accelerator | MUST | ✅ `AskHawkIntentChips` |
| URS-A-003 | Each user message SHALL produce a streamed response with citations rendered inline + a confidence indicator. | All | Trust + UX | MUST | ✅ `groundedGenerationService` |
| URS-A-004 | Conversation history SHALL persist per-user, tenant-scoped, retrievable across sessions. | All | UX | MUST | ✅ `AskConversation` model |
| URS-A-005 | Each turn SHALL be exportable (markdown + JSON with citations) for inclusion in regulatory submissions. | All | 21 CFR Part 11 §11.10(b) | SHOULD | ✅ |

### A2. Phase 1 — Regulations Q&A

| ID | Requirement | Persona | Reg anchor | MoSCoW | State |
|---|---|---|---|---|---|
| URS-A-010 | System SHALL maintain a curated regulatory corpus covering 11 standards: **21_CFR_11, 21_CFR_211, ICH_Q7, ICH_Q9_R1, ICH_Q10, EU_GMP_ANNEX_11, EU_GMP_CH_1, EU_GMP_CH_4, EU_GMP_CH_7, EU_GMP_ANNEX_16, ISO_9001**. | System | Reg coverage | MUST | ✅ `regulatory-corpus.json` (32 clauses) |
| URS-A-011 | Each clause record SHALL include: standard, clause #, title, full text, summary, related clauses, applicability hints. | System | Authoritative source | MUST | ✅ |
| URS-A-012 | User SHALL ask in natural language; system SHALL retrieve top-K clauses + generate cited answer. | All | UX | MUST | ✅ |
| URS-A-013 | If confidence < 0.6 OR no citations retrieved, system SHALL return skeleton fallback: "I don't have a confident answer for this; here are the closest sources." | System | Anti-hallucination | MUST | ✅ |
| URS-A-014 | Citations SHALL render as clickable chips → full clause modal. | System | Trust | MUST | ✅ |

### A3. Phase 2A — SOP Templates

| ID | Requirement | Persona | Reg anchor | MoSCoW | State |
|---|---|---|---|---|---|
| URS-A-020 | System SHALL maintain SOP templates covering: CAPA Intake, Deviation Investigation, Change Control, Internal Audit, Supplier Qualification, Document Control. | System | ICH Q10 §2.2 | MUST | ✅ 6 templates |
| URS-A-021 | Each SOP template SHALL include 5 sections: **Intake → Investigation → Action → Verification → Closure**. | System | ICH Q10 lifecycle | MUST | ✅ |
| URS-A-022 | User SHALL ask "What's the SOP for X?" and receive the relevant template with persona-customized phrasing. | All | UX | MUST | ✅ |
| URS-A-023 | SOP responses SHALL link to the live workflow in the relevant module (e.g., CAPA SOP → CAPA module). | System | Cross-module UX | MUST | ✅ |

### A4. Phase 2B — Workflow Playbooks (Persona-Aware)

| ID | Requirement | Persona | Reg anchor | MoSCoW | State |
|---|---|---|---|---|---|
| URS-A-030 | System SHALL maintain 38 playbooks indexed by **(persona × module)** matrix (9 personas × 12 modules; not every cell populated — 38 high-value combos). | System | UX accelerator | MUST | ✅ `workflow-playbooks.json` |
| URS-A-031 | Same query from different personas SHALL yield different playbook content (e.g., "respond to observation" returns buyer-side vs auditor-side vs supplier-side). | System | Persona-aware | MUST | ✅ persona injection at retrieval |
| URS-A-032 | Playbooks SHALL include: trigger, prerequisites, step-by-step actions, decision points, regulatory anchors, related module links. | System | Practitioner UX | MUST | ✅ |
| URS-A-033 | User SHALL be able to "open in module" — system deep-links to the relevant module view. | All | UX | SHOULD | ✅ |

### A5. Phase 3 — App Wizard (Plan-Then-Execute)

| ID | Requirement | Persona | Reg anchor | MoSCoW | State |
|---|---|---|---|---|---|
| URS-A-040 | User SHALL express an action goal in natural language; system SHALL produce a **reviewable plan** of steps with tool calls. | All | UX co-worker | MUST | ✅ `multiStepAgent` |
| URS-A-041 | Plan SHALL be inspectable: each step labeled with tool, arguments, expected effect, **side-effect tag** (READ / WRITE). | All | Trust + safety | MUST | ✅ `WizardStepper` UI |
| URS-A-042 | User SHALL **approve** the plan before any tool executes; rejection cancels the plan with reason logged. | All | Human-in-loop | MUST | ✅ approval flow |
| URS-A-043 | If plan contains **any WRITE tool**, execution SHALL require **single e-signature** covering all WRITE steps in the plan; signature ceremony = standard Part 11 (password + reason ≥10 chars). | All | 21 CFR Part 11 §11.50 | MUST | ✅ `toolCallingRuntime` + `requireESignature` |
| URS-A-044 | Each tool call SHALL write an `AuditTrail` row with: planId, stepIndex, tool, args (redacted), result-status, latency, error. | System | 21 CFR Part 11 §11.10(e) | MUST | ✅ `recordAiDecision` for AI steps; `writeAuditTrail` for tool steps |
| URS-A-045 | The tool registry SHALL include (at min, May 2026): `wizard.create_audit`, `wizard.create_capa`, `wizard.find_auditor`, `wizard.list_suppliers`, `wizard.list_products`, `wizard.list_open_capas`, `wizard.classify_deviation`, `wizard.draft_observation`. | System | Feature scope | MUST | ✅ 8 tools registered |
| URS-A-046 | Each tool SHALL declare: `name`, `description`, `args schema`, `read_or_write`, `required_roles`, `requires_esig`. | System | Tool registry | MUST | ✅ `wizardTools.js` |
| URS-A-047 | Tool execution SHALL be RBAC-checked per-step against the invoking user's roles. | System | 21 CFR Part 11 §11.10(d) | MUST | ✅ |
| URS-A-048 | If any step fails, downstream WRITE steps SHALL halt; plan transitions to `failed`; partial state visible in audit trail. | System | Safety | MUST | ✅ |

### A6. Grounding + Reproducibility

| ID | Requirement | Persona | Reg anchor | MoSCoW | State |
|---|---|---|---|---|---|
| URS-A-050 | Every AskHawk response SHALL route through `groundedGenerationService` with: schema-validated JSON, mandatory citations (≥1), confidence floor (0.6 default; configurable per feature), skeleton fallback below floor. | System | Anti-hallucination | MUST | ✅ |
| URS-A-051 | Every AI call SHALL write an `AuditTrail` row capturing: feature, modelVersion, promptVersion, promptHash, retrievalSet[], citations[], confidence, tokensInput, tokensOutput, latencyMs. | System | 21 CFR Part 11 §11.10(b), §11.10(e) | MUST | ✅ `recordAiDecision` |
| URS-A-052 | User disposition (USER_ACCEPTED / USER_EDITED / USER_REJECTED / SUPERSEDED) SHALL be capturable post-response. | System | Active learning | MUST | ✅ `POST /api/ai/decisions/outcome` |
| URS-A-053 | Multi-LLM gateway SHALL route by task type with health + cost monitoring; primary Claude (Anthropic), fallback GPT-4o (OpenAI), Gemini 2.0 Flash for speed-sensitive. | System | Reliability | MUST | ✅ `llmGateway` |

### A7. KB Ingestion

| ID | Requirement | Persona | Reg anchor | MoSCoW | State |
|---|---|---|---|---|---|
| URS-A-060 | Tenant admin SHALL be able to ingest KB content (markdown / PDF / docx) via UI or API. | Tenant Admin | KB curation | MUST | ✅ `POST /api/askhawk/ingest` |
| URS-A-061 | Ingestion SHALL: chunk (800-token + 100-token overlap), embed (OpenAI text-embedding-3-small, 1536-dim), store in MongoDB Atlas vector. | System | Retrieval quality | MUST | ✅ |
| URS-A-062 | Ingestion SHALL support tenant scoping + `__platform__` scoping (cross-tenant regulatory canon). | System | Multi-tenant | MUST | ✅ |
| URS-A-063 | Ingestion SHALL track source document version; re-ingest SHALL deprecate old chunks (no orphan citations). | System | Reproducibility | MUST | ✅ |

### A8. RBAC + Tenant Isolation

| ID | Requirement | Persona | Reg anchor | MoSCoW | State |
|---|---|---|---|---|---|
| URS-A-070 | AskHawk SHALL enforce role + tenant on every chat turn, retrieval, and tool call. | System | 21 CFR Part 11 §11.10(d) | MUST | ✅ |
| URS-A-071 | Retrieval SHALL scope to tenant + `__platform__`; a tenant SHALL never see another tenant's KB content. | System | Multi-tenant safety | MUST | ✅ |
| URS-A-072 | Wizard tools SHALL respect per-tool `required_roles`; e.g., `wizard.create_audit` requires `buyer` OR `tenant_admin` role. | System | RBAC | MUST | ✅ |

---

## 4. Part B — Differentiator (White-Space) Requirements

| ID | Requirement | Rationale | MoSCoW | State |
|---|---|---|---|---|
| URS-B-001 | **Part-11-grade AI traceability** — full reproducibility of any AI decision (modelVersion + promptHash + retrievalSet + confidence + user disposition) queryable in < 2 sec across 100k entries. | No incumbent ships this. Regulator-readiness as a feature. | MUST | ✅ live |
| URS-B-002 | **Skeleton fallback (honest failure path)** — when confidence < 0.6 OR no citations, system returns deterministic skeleton WITH citations, never fabricated content. | Anti-hallucination posture; competitive moat | MUST | ✅ live |
| URS-B-003 | **Persona-aware playbooks** — same question yields different responses per persona; not just retrieval ranking — actual content + tone differs. | Co-worker UX moat | MUST | ✅ live (38 playbooks × 9 personas) |
| URS-B-004 | **App Wizard with single-e-sig multi-step execution** — buyer says "Create audit for Sanpras with Maria on Aug 15"; plan generated; single e-sig covers create + assign + notify. | Co-worker UX, not chatbot retrofit | MUST | ✅ live (Phase 3) |
| URS-B-005 | **Active-learning loop** — every USER_EDITED / REJECTED disposition feeds prompt-variant A/B testing (human-approved promotion). | Compounding moat | SHOULD | ⚠️ Scaffolded; auto-tuning planned Q1 2027 |
| URS-B-006 | **Cross-tenant regulatory canon** in `__platform__` scope — all tenants benefit from Hawkeye's curated 11 standards × 32 clauses; tenant content stays private. | Network value | MUST | ✅ live |
| URS-B-007 | **Multi-LLM gateway with cost-routing + skeleton fallback** — auto-routes Claude / GPT-4o / Gemini by task; all providers down → deterministic fallback. | Reliability differentiator | MUST | ✅ live |
| URS-B-008 | **Cross-module AI delegation** — every module's AI feature (observation drafter, supplier intel, CAPA RCA, deviation classifier) consumes AskHawk's `groundedGenerationService` — one trusted pipeline, many features. | Engineering moat (no per-module AI debt) | MUST | ✅ live |
| URS-B-009 | **AskHawk for inspectors** — read-only AskHawk surface that lets a regulator ask "show me every AI-generated observation in the last 12 months by model version" — cross-module audit-trail query. | Inspector-readiness | SHOULD | ⏳ Plan (Q2 2027) |
| URS-B-010 | **Fine-tuned Hawkeye model on domain corpus** — long-term, fine-tune Llama-3 on PoC-collected accepted/edited drafts → lower cost + better domain accuracy for low-stakes tasks. | Build-vs-buy moat | COULD | 🚫 Roadmap M12+ (per AI-ARCHITECTURE.md §7) |

---

## 5. Out-of-Scope

- **Per-module AI feature business logic** (e.g., observation drafter prompt design) — owned by the consuming module; AskHawk owns the pipeline
- **Document storage for KB source files** → HawkVault (AskHawk indexes from there)
- **Active-learning auto-tuning gate** — scaffolded but human-approval-gated today; full automation is roadmap
- **Fine-tuned model training** — roadmap M12+; not in MVP scope
- **Voice interface** — text-only today; voice is a future surface

---

## 6. Assumptions and Dependencies

- **Multi-tenant model:** every conversation, KB chunk, and AI decision scoped to `tenantOrgId`; `__platform__` scope reserved for regulatory canon
- **LLM availability:** Claude primary, OpenAI + Gemini fallback; all-down → skeleton fallback path
- **Embeddings:** OpenAI text-embedding-3-small (1536-dim); single provider acceptable for now
- **Vector store:** MongoDB Atlas cosine; pgvector experiments not in prod
- **Notification:** email + in-app (for wizard plan approval, etc.)
- **AskHawk consumes:** Audit Mgmt models (for `wizard.create_audit`), CAPA models (for `wizard.create_capa`), Supplier models (for `wizard.list_suppliers`), Auditor models (for `wizard.find_auditor`), Document Control (KB source); writes via the same modules' service layers (not direct DB writes)

---

## 7. Acceptance Criteria

| URS range | Verification approach |
|---|---|
| A1 (chat interface) | E2E `frontend/e2e/askhawk-drawer.spec.ts` |
| A2 (regs Q&A) | AskHawk eval suite — query/answer pairs over 32 clauses with citation recall@1, confidence floor check |
| A3 (SOP templates) | Snapshot test on 6 templates × 5 sections rendering |
| A4 (persona playbooks) | Persona-pivot eval — same query, 9 personas → 9 distinct content traces |
| A5 (App Wizard) | E2E `frontend/e2e/askhawk-wizard.spec.ts`: plan → approve → e-sig → execute → verify Audit created |
| A6 (grounding) | Eval suite hits each AI feature; assert citations + confidence + audit-trail row presence |
| A7 (KB ingestion) | Round-trip: upload doc → query → retrieve → cite |
| A8 (RBAC) | Tool-level RBAC tests in `tests/services/ai/wizardTools.test.js` |
| B1 (Part-11 traceability) | Regulator-mock query: "show all AI-generated observations in 12 months" — single query < 2 sec |
| B2 (skeleton fallback) | Forced low-confidence test → assert skeleton template |
| B3 (persona playbooks) | Persona-pivot eval (same as A4) |
| B4 (App Wizard) | E2E with multi-write plan + single e-sig |
| B7 (LLM gateway) | Simulate Claude outage → assert fallback to GPT-4o; simulate all down → skeleton |

---

## 8. Open Questions

1. **Active-learning auto-tuning trigger** — when does the system propose variants without human gate? (Today: human always approves; URS-B-005 roadmap)
2. **Cross-tenant supplier intel surfacing inside AskHawk** — e.g., "another buyer in your network found CAPA-relevant issue X at this supplier" — consent UI deferred (URS-B-006 surfacing question)
3. **Persona inference** — today persona is from user role; should AskHawk dynamically infer (e.g., user logged in as buyer but asking auditor question)?
4. **Wizard tool expansion roadmap** — current 8 tools; what's next? (`wizard.schedule_audit`, `wizard.deploy_sop`, `wizard.approve_capa` candidates)
5. **AskHawk for inspectors (URS-B-009)** — read-only persona for regulator visits; auth model?
6. **DOCS-DRIFT banners** — `backend/docs/askhawk/*` carries DOCS-DRIFT banners predating Phase 3; needs cleanup
7. **Voice surface** — when (Q3 2027?) and what's the e-sig story for voice-initiated WRITE plans?
8. **Fine-tune timing** (URS-B-010) — when does PoC data volume cross the threshold for first useful fine-tune?
9. **Per-tenant prompt customization** — can a tenant pin a different prompt version for compliance reasons?
10. **TSA timestamp on AI decision rows** — cryptographic anchor for `recordAiDecision` rows?

---

## 9. Traceability Index (URS ↔ Code)

| URS section | Primary code | Primary UI |
|---|---|---|
| A1 chat interface | `routes/askhawkChatRoutes.js`, `controllers/askhawkChatController.js`, `models/AskConversation.js` | `AskHawkDrawer`, `ComplianceCopilot`, `AskHawkIntentChips` |
| A2 regs Q&A | `data/regulatory-corpus.json`, `services/ai/retrievalService.js` | response with citation chips |
| A3 SOPs | `data/sop-templates.json`, retrieval pipeline | SOP card UI in drawer |
| A4 playbooks | `data/workflow-playbooks.json`, persona-aware retrieval | playbook card UI |
| A5 App Wizard | `services/ai/wave2/{multiStepAgent,toolCallingRuntime,wizardTools}.js`, `routes/aiAgentRoutes.js`, `models/AiAgentPlan.js` | `WizardStepper` (in `AskHawkDrawer` + `ComplianceCopilot`) |
| A6 grounding | `services/groundedGenerationService.js`, `services/ai/audit-trail/recordAiDecision.js`, `services/ai/llmGateway.js` | (transparent — confidence chip + citations) |
| A7 KB ingestion | `controllers/kbIngestController.js`, `services/ai/ingestionService.js`, `models/{KbArticle,KbChunk}.js` | `/admin/askhawk/ingest` |
| A8 RBAC | shared `permit()`, tool-level `wizardTools.js` `required_roles` | role-gated UI elements |
| B1 Part-11 traceability | `recordAiDecision` + `AuditTrail` indexes | `GET /api/audit-trail/by-entity?aiFeature=X` |
| B2 skeleton fallback | `groundedGenerationService.skeletonFallback()` | (honest message in UI) |
| B5 active learning | `services/ai/activeLearningLoop.js`, `models/ActiveLearningSample.js` | admin dashboard (planned) |
| B7 LLM gateway | `services/ai/llmGateway.js` | (transparent) |
| B8 cross-module AI delegation | every module's AI service imports `groundedGenerationService` | (architectural) |
