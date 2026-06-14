# Design Control Summary Report (DCSR)

## S.M.A.R.T. Hawk — customer/auditor-facing design-control summary

> A **shareable, IP-safe summary** of the design controls applied to the S.M.A.R.T. Hawk platform, derived from the internal Design History File (DHF). It gives a customer's supplier-quality/CSV team and (through them) a regulator the **evidence that GxP-impacting software decisions are designed, controlled, risk-assessed and auditable** — **without** exposing source code, prompts, model weights, or other confidential design internals. This is the artifact pharma QA teams request during supplier qualification and cite in regulatory submissions.

| Field | Value |
|---|---|
| Document number | `HK-DCSR-v1.0` |
| Record type | `DCSR` (Document Control module) |
| Owner | Principal Architect — author; QMS Head — approver |
| Effective date | 2026-06-14 |
| Audience | Customer supplier-quality / CSV / Regulatory Affairs (under NDA) |
| Classification | Confidential — shareable under NDA; **contains no source/IP** |
| Derived from | [DDP `HK-DDP-v1.0`](DESIGN-AND-DEVELOPMENT-PLAN.md) · [AI Validation Plan](AI-VALIDATION-PLAN.md) · [GAMP-CAT-4](../GAMP-CAT-4-COMPLIANCE.md) · [PLATFORM-CONTROLS](../platform-controls/PLATFORM-CONTROLS.md) |

> 📄 **This is a template + first instance.** Re-issue per major release; the structure is reusable for any customer-facing design summary.

---

## 1. Purpose

To summarise, for an external reviewer, **how S.M.A.R.T. Hawk is designed under control** so they can (a) complete supplier qualification, (b) leverage our design-control evidence in their own CSV under GAMP 5 Category 4, and (c) answer their regulator's questions about the software — **without requiring source-code review** (a Category 5 obligation we are not subject to) and without us exposing proprietary internals.

## 2. Product & intended-use summary

- **Product:** S.M.A.R.T. Hawk AI-native EQMS platform (SaaS; optional sovereign deployment).
- **Intended use:** manage GxP quality workflows — supplier audit, supplier qualification, CAPA, deviation, change control, document control, risk — with AI **decision-support** and human electronic signature on every committed record.
- **GAMP classification:** **Category 4 — configured product** (single code base; tenant configuration without source change).
- **Not intended for:** autonomous GxP decision-making; the platform supports human decisions, it does not make them.

## 3. Design-control conformance summary (per 21 CFR 820.30 / ISO 13485 §7.3 / IEC 62304)

| Design-control element | How it is satisfied (summary) | Internal evidence (DHF) |
|---|---|---|
| **Planning** (820.30(b)) | A controlled Design & Development Plan governs the lifecycle; reviewed/approved as design evolves | DDP §1–§10 |
| **Design inputs** (820.30(c)) | User needs + regulatory requirements captured as URS/FRS with acceptance criteria; reviewed for completeness | Module URS; requirements records |
| **Design outputs** (820.30(d)) | Architecture, specifications, configuration schema, code; essential outputs (audit trail, e-sig, access, AI grounding) identified | Design specs; code (not disclosed) |
| **Design review** (820.30(e)) | Formal reviews at defined gates with an independent reviewer; e-signed | Design-review records |
| **Verification** (820.30(f)) | Outputs traced to inputs; unit/integration/E2E + security tests; OQ in staging | Test results; traceability matrix |
| **Validation** (820.30(g)) | Fitness for intended use confirmed via UAT/PQ in the **commercial environment** with real use cases + user feedback | Validation Summary Report |
| **Design transfer** (820.30(h)) | Controlled release process; staging IQ/OQ; rollback capability | Release records |
| **Design changes** (820.30(i)) | All changes via change control with impact assessment, approval (CAB), SoD, re-V&V | Change register |
| **Design History File** (820.30(j)) | Electronic, continuous DHF: requirements → design → reviews → V&V → release, on an immutable audit trail | DHF index |

## 4. Architecture summary (high-level; no proprietary detail)

Five layers, trust-first: **Trust (GAMP Cat 4 · Part 11 · Annex 11 · ALCOA+ · RBAC · data residency) → Data & Evidence (tenant isolation · evidence store · SHA-256 · tamper-evident audit log) → AI Gateway (grounded · cite-or-fallback · AI audit trail) → Domain Engine (modules on one configuration layer + the S.M.A.R.T. runtime pipeline) → Experience.** Every module writes to **one immutable cross-module audit trail**, enabling a regulator to trace an issue end-to-end.

## 5. Verification & validation summary

| | |
|---|---|
| **Verification** (build it right) | Performed in **non-commercial test/staging** environments; unit + integration + E2E + SAST/DAST; outputs traced to inputs via a traceability matrix. |
| **Validation** (right product) | Performed in the **commercial (production) environment** with real use cases and user feedback (UAT/PQ); confirms the software meets user needs and intended use. |
| **Result (summary)** | Core modules (audit, document control, CAPA, change, deviation, risk, supplier prequalification) verified and entering customer-led validation. Validation summaries available under NDA. |

## 6. Risk management summary (ISO 14971 / ICH Q9 / ISO 31000)

Top design risks and mitigations (summary level):

| Risk theme | Mitigation (summary) |
|---|---|
| Data integrity / tampering | Immutable audit trail; SHA-256; ALCOA+ by design; RBAC + tenant isolation |
| Unauthorised access | 4-layer access control; e-signature; (MFA/SSO — *Q3 2026 / Q1 2027*) |
| Incorrect AI output (incl. **false negatives**) | Decision-support only + mandatory human commit; cite-or-fallback; AI audit trail; ground-truth evaluation — see §7 |
| Loss of records | Backups + restore tests; multi-region; retention policy |
| Change-induced regression | Change control + V&V + rollback |

## 7. AI design-controls summary (the auditor focus area)

> S.M.A.R.T. Hawk anticipates that auditors will probe the AI hardest. The following are designed-in and evidenced (full detail in the [AI Validation Plan](AI-VALIDATION-PLAN.md), shareable under NDA):

- **Decision-support, never decision-making** — a qualified human reviews and commits every record under e-signature.
- **Cite-or-fallback (non-configurable)** — every AI output cites grounding sources or returns "insufficient evidence"; **no hallucinated citations by design**.
- **AI decision audit trail** — model version, prompt hash, retrieval set, confidence, and human disposition are logged, so any past AI output is **reproducible** for a regulator.
- **False-negative controls** — mandatory human review, confidence-floor fallback, independent-reviewer gates on high-risk outputs, and ground-truth recall thresholds (validated before release).
- **Black-box transparency** — citations + confidence + reproducibility + per-feature model cards substitute for model-internal interpretability; human oversight is the backstop.
- **Change control + monitoring** — model/prompt changes are version-controlled, re-validated, and monitored for drift.

## 8. Compliance posture (summary, honest)

| Area | Status |
|---|---|
| GAMP 5 Category 4 | ✅ Classified; Validation Accelerator Package available |
| 21 CFR Part 11 / EU Annex 11 | ✅ By design (audit trail, e-signature, ALCOA+); **e-signature hard-mode default — Q3 2026** |
| Access control | RBAC + tenant isolation live; **MFA/SSO — Q3 2026 / Q1 2027** |
| SOC 2 | Type I **Q3 2026**, Type II **Q1 2027** |
| ISO 9001 | Aligned; certification targeted **2027** |
| Validation package per tenant | Completing **Q4 2026** |

*(Disclosed proactively so no examiner is surprised; compensating controls operate in the interim.)*

## 9. Confidentiality boundary — what is intentionally not disclosed

To protect IP while remaining audit-credible, this DCSR **does not** include: source code, AI prompts/templates, model weights/fine-tuning data, secret configuration, infrastructure credentials, or detailed algorithm internals. These exist in the internal DHF and can be **examined under a deeper NDA / on-site supplier audit** where contractually agreed, in line with GAMP Cat 4 supplier-leverage (which does **not** require source-code review).

## 10. How to request deeper evidence

A customer's CSV/audit team may request, under NDA: the full Validation Accelerator Package, the AI Validation Plan, security testing summaries, the SOC report (when issued), and a periodic supplier audit. Contact: the Compliance-Lifecycle Owner / `compliance@` mailbox.

## 11. Revision history
| Version | Date | Author | Reason |
|---|---|---|---|
| 1.0 | 2026-06-14 | Principal Architect + QMS | Initial issue — template + first instance |
