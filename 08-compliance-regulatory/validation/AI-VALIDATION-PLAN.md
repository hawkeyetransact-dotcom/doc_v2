# AI Validation Plan

## S.M.A.R.T. Hawk — Validation of AI/ML features in a GxP context

> Defines how S.M.A.R.T. Hawk's AI features are risk-assessed, validated, monitored and re-validated so that an auditor or regulator can be shown **evidence of control over AI decision-making** — with explicit treatment of **false negatives**, **black-box transparency**, and **drift**. Directly answers the advisor concern that "Part 11 alone is insufficient" for AI and that auditors will probe AI hardest.

| Field | Value |
|---|---|
| Document number | `HK-AIVP-v1.0` |
| Record type | `VAL-PLAN` (Document Control module) |
| Owner | AI/ML Lead — responsible; QMS Head — accountable; Pharma SME — consulted |
| Effective date | 2026-06-14 |
| Review cycle | Per AI feature change; per model/prompt version; at least annually |
| Approval | AI Lead → QMS Head → (independent reviewer), Part 11 e-signed |
| Living document | **Yes** — updated on feedback, drift, model change, regulation |
| Related | [DDP](DESIGN-AND-DEVELOPMENT-PLAN.md) · [AI-ARCHITECTURE.md](../../04-engineering/07-ai/AI-ARCHITECTURE.md) · [ADR-003-cite-or-fallback.md](../../04-engineering/08-adrs/ADR-003-cite-or-fallback.md) · [PLATFORM-CONTROLS.md](../platform-controls/PLATFORM-CONTROLS.md) (C15) |

---

## 1. Purpose & scope

To validate that every AI/ML feature that touches a GxP workflow is **fit for its intended use**, that its **failure modes (especially false negatives) are identified, controlled, detectable and acceptable**, and that its behaviour is **reproducible and auditable**. Scope = all AI features in the platform (§4). Out of scope = the underlying foundation-model providers' internal training (third-party; managed via supplier qualification of the LLM provider).

## 2. Regulatory & normative basis

| Source | What it requires of AI |
|---|---|
| **FDA GMLP** (Good Machine Learning Practice, 2021) | Intended use, data quality, model evaluation, human-AI team, monitoring |
| **FDA CSA** (2025/26) | AI/ML explicitly in scope of the regulated QMS; risk-based assurance |
| **FDA AI guidance** (lifecycle / total product lifecycle for AI-enabled software) | Lifecycle controls, transparency, monitoring of real-world performance |
| **EU GMP Annex 11 (rev.) + draft Annex 22 (AI)** | AI/ML governance, explainability, human oversight, change control |
| **EMA Reflection Paper on AI** (2024) | Risk-based, human-in-the-loop, transparency |
| **ICH Q9(R1) / ISO 14971 / ISO 31000** | Quality risk management methodology |
| **GAMP 5 (2nd Ed.)** | Risk-based CSV; AI as a configured/critical component |

## 3. The governing principle — decision-SUPPORT, not decision-MAKING

> 🔒 **S.M.A.R.T. Hawk AI never makes a GxP decision. It drafts, classifies, scores and suggests; a qualified human reviews and *commits* every record under electronic signature.** This single architectural choice (enforced in code) bounds AI risk: the AI's output is always an *input to a human decision*, never the decision. False-negative and black-box risks are therefore mitigated, at the platform level, by **mandatory human review at every record-committing gate**.

## 4. AI feature inventory, intended use & risk class

| # | AI feature | Intended use (decision-support) | GAMP/risk class | Worst-case failure |
|---|---|---|---|---|
| 1 | **Observation drafter** (audit) | Draft audit observations with citations + classification | High | **False negative:** misses/understates a critical finding |
| 2 | **Deviation 6-agent stack** | Classify, find similar, scaffold 5-Why, suggest disposition, recommend CAPA, alert trends | High | False negative: under-classifies a critical deviation; missed trend |
| 3 | **CAPA RCA drafter** | Scaffold 5-Why root-cause | Medium | Misleading root cause (human must validate) |
| 4 | **Document classifier/tagger** | Classify doc type; suggest tags | Low | Misclassification (low harm; human confirms) |
| 5 | **Supplier intel agent** | Fuse FDA/EMA/WHO public data into risk dossier | Medium | False negative: misses adverse public signal |
| 6 | **AskHawk** (reg Q&A, playbooks, wizard) | Answer regulatory questions; draft SOPs; orchestrate wizards | Medium | Hallucinated/incorrect regulatory citation |

Risk class drives validation depth (CSA risk-based assurance). High-risk features get ground-truth evaluation + the strictest human-review gates.

## 5. Risk assessment (ICH Q9 + ISO 14971 + ISO 31000)

For each feature, hazards are scored Severity × Probability × Detectability; controls reduce residual risk to acceptable. Representative hazards:

| Hazard | Example | Severity | Primary controls |
|---|---|---|---|
| **False negative** | AI omits a critical audit observation / under-classifies a deviation | High | Human review gate (mandatory); confidence floor → fallback; independent reviewer at QA gate; recall threshold on eval set; "AI is a draft, not the record" UX |
| **False positive** | AI raises a non-issue | Low–Med | Human triage; confidence display; trend de-noising |
| **Hallucinated citation** | AI cites a non-existent regulation | High (trust) | **Cite-or-fallback (non-configurable):** no citation ⇒ "insufficient evidence"; citations validated against the retrieval set |
| **Drift** | Model/provider update degrades quality | Med | Drift monitoring; periodic re-validation; pinned model versions |
| **Prompt injection** | Malicious content manipulates output | Med | Input sanitisation; grounding to controlled sources; least-privilege tools |
| **Bias** | Systematic skew (e.g., supplier geography) | Med | Eval-set balance review; human oversight; transparency of factors |
| **Non-reproducibility** | Can't reconstruct a past AI output | High (audit) | **AI audit trail (C15):** model version, prompt hash, retrieval set, confidence, disposition |

## 6. False-negative management (the auditor's hot button)

False negatives — the AI *missing* something that matters — are the most dangerous AI failure in quality work. Controls, layered:

1. **Definition per feature.** A false negative is defined explicitly (e.g., observation drafter: a CRITICAL/MAJOR finding present in evidence but absent from the AI draft).
2. **Human-in-the-loop is mandatory, not optional.** The AI draft is never the record; a qualified reviewer must review the evidence and commit. The UX presents the AI output as a *starting point*, with the source evidence alongside, so the human can catch omissions.
3. **Detection mechanisms:**
   - **Confidence floor → fallback:** below threshold the AI returns an honest "insufficient evidence" skeleton rather than a confident-but-incomplete answer.
   - **Independent reviewer gate** on high-risk outputs (e.g., audit verification/closure) — a second human.
   - **Ground-truth evaluation:** curated datasets with known findings; measure **recall** (1 − false-negative rate) against acceptance thresholds before release and on each model change.
   - **Coverage prompts / checklists:** for high-risk features, the AI is prompted against a standard checklist so omissions are surfaced.
   - **Trend/anomaly alerting** (deviation): flags clusters a human might miss.
4. **Acceptance criteria:** per-feature minimum recall on the eval set (e.g., observation drafter ≥ target recall for CRITICAL findings) — defined in the per-feature validation protocol; residual risk formally accepted by the QMS Head.
5. **Residual-risk disclosure:** where a false negative remains possible, the mitigation is *the human reviewer is accountable for completeness* — documented and trained.

## 7. Validation approach (AI-OQ)

| Element | Approach |
|---|---|
| Ground-truth datasets | Curated, version-controlled eval sets per high/medium feature (representative + edge + adversarial cases) |
| Metrics | Precision, **recall (false-negative rate)**, F1; **citation completeness/accuracy**; calibration of confidence; human-acceptance rate |
| Acceptance thresholds | Per-feature, risk-scaled; signed off before release |
| Test protocol | AI-OQ scripts executed in staging; results recorded as validation records (D-61) |
| Human-factors | Usability evaluation that the AI output *helps a human catch issues* (not lulls them) |
| Regression | Re-run eval sets on every model/prompt version change |

## 8. Controls already in the product (evidence to show auditors)

| Control | Implementation | Auditor evidence |
|---|---|---|
| **Cite-or-fallback** (non-configurable) | `groundedGenerationService` — citation required or "insufficient evidence" | ADR-003; live demo |
| **AI decision audit trail (C15)** | `recordAiDecision()` logs model version, prompt hash, retrieval set, confidence, disposition | Audit-trail export of any past AI output (reproducible) |
| **Human commits the record** | E-signature gate after every AI draft | E-sig records; workflow gates |
| **Confidence floor** | Per-feature threshold → fallback skeleton | Config + AI-OQ results |
| **No training on customer data** | Tenant isolation; provider API calls don't train | DPA; architecture statement |
| **Multi-LLM gateway** | Provider abstraction; pinned versions | ADR-002 |

## 9. Black-box transparency & explainability

Foundation models are not fully interpretable; we therefore make the **decision context transparent** rather than the model internals:
- Every AI output ships with **citations to the grounding sources** and a **confidence score** — the reviewer sees *why* and *how sure*.
- The **AI audit trail** makes any output **reproducible** (same model version + prompt + retrieval set).
- **Model cards** per feature document intended use, training/grounding data provenance, eval results, limitations, and the human-oversight requirement.
- A **regulator-facing AI design summary** (a subset suitable for the [DCSR](DESIGN-CONTROL-SUMMARY-REPORT.md)) explains controls without exposing prompts/weights.

## 10. Change control & re-validation

| Trigger | Action |
|---|---|
| Foundation-model version change (provider) | Impact assessment; regression on eval sets; re-validate high-risk features before promotion |
| Prompt-template change | Version the prompt; re-run affected eval sets |
| New AI feature | Full inventory entry + risk assessment + AI-OQ before release |
| Drift signal (monitoring) | Investigate; CAPA if degraded; re-validate |
| Periodic | At least annual re-validation of high-risk features |

Prompts and eval sets are **version-controlled** alongside code; changes flow through the SDLC change-control process (no AI change to production without an approved change record).

## 11. Monitoring in production

Real-world performance is monitored: human-acceptance/edit/reject rates per feature (a proxy for quality), confidence-calibration drift, fallback rates, and incident reports. Material degradation triggers CAPA and re-validation. *(Active-learning auto-tuning is roadmapped — Q1 2027 — and will itself be validated before enabling.)*

## 12. Roles, acceptance & honesty

- **AI/ML Lead** executes validation; **QMS Head** approves acceptance and residual-risk; **Pharma SME** reviews for GxP adequacy.
- **Current-state honesty:** the *controls* (cite-or-fallback, AI audit trail, human-commit) are live in code; the **formal eval datasets, per-feature thresholds and AI-OQ execution are being established** as part of this plan (target: before v1.0 GA for high-risk features). Active-learning loop and predictive features are roadmap and will be validated before enabling.

## 13. Revision history
| Version | Date | Author | Reason |
|---|---|---|---|
| 1.0 | 2026-06-14 | AI/ML Lead + QMS | Initial issue — AI validation plan incl. false-negative management |
