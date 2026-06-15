# Module Feature & Positioning Catalog

## S.M.A.R.T. Hawk — per-module feature list, positioning & status

> A customer-facing catalog of every module/area: **what it does (feature list)**, **how it's positioned** (the gap it fills vs incumbents), its **status** (honest real-vs-planned), the **AI** inside it, and the **regulatory anchors** it serves. Pairs with the [Positioning & Market Study](../../01-strategy/vision-and-positioning/POSITIONING-AND-MARKET-STUDY-2026.md) and the [DCSR](../../08-compliance-regulatory/validation/DESIGN-CONTROL-SUMMARY-REPORT.md).

| Field | Value |
|---|---|
| Document | `HK-MODCAT-v1.0` |
| Owner | Product |
| Date | 2026-06-15 |
| Status legend | ✅ **Live** (built + demonstrable) · ⚠️ **Emerging/Partial** · ⏳ **Forward-spec** (scaffold/model; 2027) · 🔵 **Vision** |

---

## 0. The portfolio at a glance

| Tier | Modules | Sell as |
|---|---|---|
| ✅ **Live now** | Audit Management · Supplier Prequalification · CAPA · Deviation · Change Control · Document Control (HawkVault) · Risk Management · AskHawk | The supplier-quality core — validate and go live today |
| ⚠️ **Emerging** | Complaint Management | Available, maturing — confirm scope per deal |
| ⏳ **Forward-spec (2027)** | Training · Management Review · Equipment Management · Batch Records · Design Control | Roadmap — data models exist; workflow shipping 2027 |
| 🔵 **Vision** | Marketplace / auditor network | Post-Series-A network play |

**Cross-module guarantees (every module):** immutable cross-module audit trail · Part-11 e-signature on regulated actions · forward-only state machines · RBAC + tenant isolation · grounded, cited, reproducible AI (cite-or-fallback + AI audit trail).

---

## 1. ✅ Audit Management

**Purpose.** End-to-end audit orchestration from request → closure certificate, Part-11 audit trail + e-signature throughout. *The flagship/wedge.*

**Features:** ✅ 8-phase lifecycle (INITIATED→PREP→PLANNING→EXECUTION→FINDINGS→CAPA→CLOSURE→SURVEILLANCE) · ✅ multi-persona (buyer/auditor/co-auditor/supplier) role-gated UIs · ✅ e-sig gates (intimation G1, scope-lock G5, dual closure G8) · ✅ Pre-Audit Questionnaire with supplier section assignment + AI auto-fill · ✅ AI observation drafting (cited, classified, confidence-scored) + auditor coach · ✅ execution scope builder · ✅ remote-audit session capture (Zoom/Teams) · ✅ per-observation CAPA spawn · ✅ cross-tenant auditor affiliation (third-party auditors, no data leak) · ⚠️ consolidated remote-audit cockpit UI (deferred) · ❌ TSA timestamp (post-Series-A).

**Positioning.** Replaces email/spreadsheet audit programs with **live workflow + AI-backed, reproducible findings** — ~40% cycle-time reduction, inspector-ready by design. The entry wedge.

**AI:** `observationDrafter`, `auditorCoach`, `auditPrepAgent`, `supplierIntelAgent`, `auditAutofillAgent`. **Anchors:** 21 CFR Part 11; ICH Q7 §13/19; ICH Q10 §2.7; EU GMP Annex 11/16; ISO 9001 §9.2.

## 2. ✅ Supplier Prequalification

**Purpose.** Gatekeeper — qualify, score and maintain the Qualified Supplier List before a supplier can be audited, transact, or be listed.

**Features:** ✅ 8-state lifecycle (NOMINATED→DATA_COLLECTION→DESK_REVIEW→ON_SITE_VISIT→SCORING→APPROVAL→QUALIFIED) · ✅ Prequal Questionnaire (company, certs, sites, products, financial/legal, ESG) · ✅ HawkVault doc upload + cert-expiry tracking · ✅ desk-review workspace (PASS/FAIL/NEEDS_INFO) · ✅ transparent risk-weighted scoring (certs 25%, audit history 20%, product criticality 20%, geography 15%, financial 10%, ESG 10%) · ✅ auto on-site-visit trigger · ✅ e-sig approval gate · ✅ periodic requalification (risk-tiered cadence) · ⚠️ cross-buyer reuse (consent UI TBD) · ⚠️ cert authenticity APIs (FDA live; ISO partial).

**Positioning.** Kills spreadsheet vetting; **defensible, transparent risk scoring + automated requalification** with early-warning when suppliers drift. **AI:** `supplierIntelAgent` (FDA/EMA/WHO fusion); cert validator. **Anchors:** ICH Q7 §17; EU GMP Ch.7; ISO 9001 §8.4; ISO 13485 §7.4.

## 3. ✅ CAPA

**Purpose.** Corrective & preventive action from multi-source intake → triage → RCA → action → effectiveness → signed closure.

**Features:** ✅ multi-trigger intake (audit/deviation/complaint/change/MRM) · ✅ triage (no-CAPA w/ rationale, correction-only, formal) · ✅ investigation workspace · ✅ AI 5-Why RCA scaffolder + human review · ✅ multiple actions (owner/due/verification) · ✅ effectiveness check + verifier sign-off · ✅ signed closure + evidence-bundle export · ✅ bidirectional cross-module trace · ⚠️ predictive effectiveness AI (scaffolded).

**Positioning.** "Find-once, solve-forever" — historical CAPA patterns surface during investigation, preventing re-findings. **AI:** `capaRcaDrafter` + pattern matcher. **Anchors:** 21 CFR 820.100; ICH Q10 §3.2.2; ISO 9001 §10.2.

## 4. ✅ Deviation & Event

**Purpose.** In-process deviation intake → AI classification → investigation → disposition → CAPA recommendation, with trend alerting.

**Features:** ✅ floor-friendly intake · ✅ AI auto-classification (Critical/Major/Minor + confidence) · ✅ similar-deviation surfacing · ✅ AI 5-Why scaffolder · ✅ disposition (release/rework/scrap/quarantine/reject) + AI suggestion · ✅ e-sig on disposition · ✅ auto batch-hold + escalation for Critical · ✅ trend alerting · ⚠️ native mobile (responsive live).

**Positioning.** **Real-time, AI-guided triage** cuts batch-hold decisions from hours to minutes; similarity catches systemic issues early. The deepest AI module (6-agent stack). **Anchors:** 21 CFR 211.192; ICH Q7 §8; ISO 9001 §10.2.

## 5. ✅ Change Control

**Purpose.** Formal change from initiation → classification → multi-area impact assessment → approval → implementation → PIR, propagating across modules.

**Features:** ✅ initiation w/ upstream-trigger linkage · ✅ classification (routine/minor/major → approval chain) · ✅ per-area impact assessment (docs/equipment/suppliers/risk/training/validation) · ✅ multi-step approval w/ per-step e-sig + SoD · ✅ reject path w/ rationale · ✅ implementation tracking · ✅ PIR sign-off + CAPA spawn · ⚠️ parallel approvals / SLA escalation (partial).

**Positioning.** Ends ad-hoc email change; **formal impact assessment + routing** keeps doc control, training and suppliers synchronized. **Anchors:** ICH Q7 §13; EU GMP Annex 11 §10; ISO 9001 §8.5.6; ICH Q10 §3.2.3.

## 6. ✅ Document Control (HawkVault)

**Purpose.** Controlled-document vault — system of record for SOPs, procedures, WIs, forms, specs, records under versioning, multi-step approval, distribution, periodic review, retention.

**Features:** ✅ 6-state lifecycle (DRAFT→IN_REVIEW→APPROVED→EFFECTIVE→SUPERSEDED→ARCHIVED) · ✅ per-category approval chains w/ per-step e-sig + SoD · ✅ AI classification + tagging (confidence-gated) · ✅ bulk-upload wizard (single batch e-sig) · ✅ read-receipt tracking + training handoff · ✅ periodic review (T-30 reminders) · ✅ retention policy (enforcement Q1 2027) · ✅ cross-module `documentId` references.

**Positioning.** Single source of truth; kills version drift; **inspector sees a synchronized, auditable document landscape**. **AI:** `docIntelClassifier`, `docIntelTagger`, bulk orchestrator. **Anchors:** Part 11 §11.10(k); EU GMP Ch.4; Annex 11 §10; ISO 9001 §7.5.

## 7. ✅ Risk Management

**Purpose.** Enterprise risk register + FMEA engine; identification → assessment (S×O×D=RPN) → control → periodic review across Product/Process/Supplier/Regulatory/Operational risk.

**Features:** ✅ register (5 risk types) · ✅ FMEA/RPN with per-tenant thresholds + rubric · ✅ mitigation plans (preventive/detective/corrective) linkable to SOP/Training/CAPA/Change · ✅ residual-risk reassessment · ✅ control-effectiveness review · ✅ high-RPN acceptance w/ e-sig · ✅ periodic review cadence · ✅ cross-module feeds (audit scope, CAPA priority, change impact).

**Positioning.** Risk lives in the system, not email; **FMEA transparency + control linkage** with auto-reassessment on complaint/change/audit events. Also the engine behind the product's own PHA/DFMEA/PFMEA/AFMEA. **Anchors:** ICH Q9(R1); ISO 31000; ISO 9001 §6.1.

## 8. ✅ AskHawk (cross-cutting AI co-worker)

**Purpose.** Persona-aware, grounded, cited, audit-trailed AI assistant — regulatory Q&A, SOP templates, workflow playbooks, and plan-then-execute wizards across modules. *All 3 phases shipped.*

**Features:** ✅ Reg Q&A (11 standards × 32 clauses, cited, confidence-gated fallback) · ✅ 6 SOP templates (persona-customized) · ✅ 38 workflow playbooks (persona × module) · ✅ App Wizard (8 plan-then-execute tools; single e-sig covers approved WRITE plan; role-gated) · ✅ streamed cited responses + confidence · ✅ persistent tenant-scoped history · ✅ export (md/JSON w/ citations) · ✅ multi-LLM gateway + skeleton fallback.

**Positioning.** **Native, not a retrofit** — every answer cites sources, every write-action is e-signed and audit-trailed. The differentiator that no incumbent matches at this depth. **Anchors:** Part 11 §11.10(b)(e); ICH Q10 §2.2; Annex 11; GDPR §22 (human-in-loop).

## 9. ⚠️ Complaint Management

**Purpose.** Customer complaint lifecycle — intake → triage (reportable/non-reportable) → investigation → resolution → CAPA/Deviation linkage; regulator-notification support.

**Features:** ⚠️ multi-channel intake · ⚠️ triage + reportability classification · ⚠️ investigation + RCA · ⚠️ complaint trending · ⚠️ CAPA/Deviation spawn · ⚠️ MDR/EU-Vigilance notification templates + e-sig · ❌ email ingestion / AI similarity (Wave-3 planned).

**Positioning.** Closes the patient-safety loop; AI similarity (planned) catches trends before recalls. *Sell with scope confirmation per deal.* **Anchors:** 21 CFR 820.198; ICH Q10 §3.2.1; ISO 13485 §8.2.2.

## 10–14. ⏳ Forward-spec (data models exist; workflow 2027)

| Module | Purpose | Headline planned features | Anchors |
|---|---|---|---|
| **Training** ⏳ | Training records + effectiveness; training matrix | Role→course matrix; completion e-sig; effectiveness verification; **real-time eligibility API** (gates batch steps) | 21 CFR 211.25; ICH Q10 §3.2.4; ISO 13485 §6.2 |
| **Management Review** ⏳ | Periodic QMS review + action tracking | Auto-compiled inputs from every module; attendance + minutes e-sig; action items auto-spawn CAPA/Change/Risk; hashed minutes | ICH Q10 §1.6; ISO 9001 §9.3 |
| **Equipment Management** ⏳ | Calibration + maintenance | Cal scheduling; out-of-tolerance → auto-Deviation + batch-impact; **real-time eligibility API**; PM/CM | 21 CFR 211.68; EU GMP Annex 15 |
| **Batch Records** ⏳ | Electronic batch record + QP release | MBR templates; in-sequence step execution; equipment+training gating; Annex-16 QP release checklist; release certificate (hashed) | 21 CFR 211.188/194; EU GMP Annex 16 |
| **Design Control** ⏳ | Med-device DHF | Inputs↔outputs traceability; design reviews; V&V protocols; transfer; 510(k)/MDR export | 21 CFR 820.30; ISO 13485 §7.3; EU MDR |

## 15. 🔵 Marketplace (auditor network)

**Purpose.** Two-sided network — buyers find qualified auditors (engagement/pay-per-audit); suppliers gain discoverability. **Status: scaffold + basic supplier browse; matching, payments, network economics post-Series-A.**

**Features:** ⏳ auditor profiles + credential verification · ⏳ engagement contract + dual e-sig → auto-creates Audit Request · ⚠️ supplier directory (opt-in from Prequal) + basic search · ❌ payments (Stripe Connect) · ❌ recommendation engine / network economics.

**Positioning.** Auditor liquidity + supplier discoverability; the long-term network moat. **Do not sell as live.**

---

## Appendix — module → audit-trail / e-sig coverage matrix

| Module | Status | Immutable audit trail | E-sig gates | Native AI |
|---|---|---|---|---|
| Audit Management | ✅ | ✅ | intimation · scope · closure (dual) | ✅✅ |
| Supplier Prequalification | ✅ | ✅ | qualification approval | ✅ |
| CAPA | ✅ | ✅ | closure | ✅ |
| Deviation | ✅ | ✅ | disposition | ✅✅ |
| Change Control | ✅ | ✅ | per-step approval (SoD) | ⚠️ |
| Document Control | ✅ | ✅ | per-step approval (SoD) | ✅ |
| Risk Management | ✅ | ✅ | high-RPN acceptance | ⏳ |
| AskHawk | ✅ | ✅ | wizard WRITE plan | ✅✅ |
| Complaint | ⚠️ | ✅ | regulator notification | ⏳ |
| Training/MRM/Equipment/Batch/Design | ⏳ | (designed) | (designed) | ⏳ |
| Marketplace | 🔵 | (designed) | engagement contract | ⏳ |
