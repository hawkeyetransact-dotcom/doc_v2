# ADR-003 — Cite-or-Fallback as a Non-Configurable Guarantee

| Field | Value |
|---|---|
| Status | **Accepted** — 2026-02-20 |
| Author | AI Lead · Compliance Lead |
| Reviewers | Founders · Engineering · Compliance |
| Supersedes | n/a |
| Superseded by | n/a |

---

## 1. Context

Hawkeye's AI features (audit finding drafting, CAPA RCA, deviation analysis, AskHawk Q&A) generate text that ends up in regulator-facing artifacts. A single hallucinated citation — an LLM inventing a non-existent 21 CFR clause or a fabricated SOP reference — is a **direct data-integrity violation** under MHRA ALCOA+ (fails Attributable, Accurate, Original) and a candidate Part 11 / Annex 11 finding.

User research (RESEARCH-FINDINGS Insight 2) is explicit:

> *"My regulator will not accept 'the AI said so'. So if your AI gives an answer, I need to see exactly where it came from. No source = no use."* — Director of Quality, Tier-2

Industry context:
- FDA Good Machine Learning Practice (Oct 2021), Principle 9: "Provide users with clear, essential information" including limitations.
- EMA AI Reflection Paper (Sept 2024): risk-based AI validation requires data-integrity-by-design.
- Academic work on retrieval-augmented generation in regulated domains (RegGuard, MEGA-RAG, HalluGuard, 2025–2026) converges on "decline rather than hallucinate" as the safe pattern.

We need a **structural guarantee** — not a configuration option, not a best-effort hope — that hallucinated citations cannot escape into a customer's record.

---

## 2. Decision

> 📜 **Cite-or-fallback is a non-configurable platform guarantee.** Every AI generation invoked through the AI Gateway either (a) returns text with at least one source citation that links to a retrievable evidence record, OR (b) returns the literal response *"insufficient evidence — human input required"*. No admin, no config flag, no API parameter can disable this guarantee.

This rule applies to every task type: audit finding drafts, CAPA RCAs, deviation analyses, AskHawk Q&A, document classifications, AI-suggested corrections. There are no exceptions.

---

## 3. Alternatives considered

### Option A: Best-effort grounding with confidence scoring (no hard rule)
- **Pros:** More flexibility · fewer "insufficient evidence" returns · higher apparent helpfulness
- **Cons:** A single hallucinated citation in a regulator-facing artifact is a catastrophic event — user research shows this is grounds for instant product rejection ("If your AI does that we're out"). Best-effort isn't a guarantee.

### Option B: Cite-or-fallback as a configurable threshold (per-tenant)
- **Pros:** Customer can tune their own risk tolerance
- **Cons:** Creates inconsistent platform behavior; customer's auditor can no longer rely on "Hawkeye always cites"; admin button to disable is a misuse pattern waiting to happen; complicates the regulatory pitch ("Part 11 §11.10(a) Validation is a per-tenant configuration"); makes the platform-level guarantee untrue

### Option C: Cite-or-fallback only for "regulated" task types (audit, CAPA) but not others (AskHawk casual)
- **Pros:** AskHawk feels more conversational
- **Cons:** Boundary is fuzzy ("which tasks are regulated?"); AskHawk responses end up pasted into regulated artifacts anyway; introduces a per-task escape valve

### Option D: Selected — Hard, non-configurable, universal
- **Pros:** Single rule to explain, sell, defend; cannot be misused; cannot be silently undermined; aligns to "Layer 1 cannot be configured away" principle; matches user-research red line
- **Cons:** Reduces apparent helpfulness when sources are sparse; AskHawk casual chat is more often "insufficient evidence" than competitors that just hallucinate

---

## 4. Rationale

| Criterion | Verdict |
|---|---|
| Regulatory defensibility | D wins decisively — universal guarantee is far more defensible than per-task or per-tenant exceptions |
| User research alignment | D matches the explicit customer red line |
| Layer 1 consistency | D aligns to "Layer 1 controls cannot be configured away" pattern (§11.10(e) audit trail also cannot be disabled) |
| Misuse resistance | D wins — no admin button, no config flag, no escape valve |
| Sales narrative simplicity | D wins — "cite-or-fallback at every AI touchpoint" is one sentence everywhere |
| Engineering simplicity | D wins — one rule enforced in one place (the gateway), tested once |
| Apparent helpfulness | Options A/B feel more "helpful" but at unacceptable risk |

---

## 5. Consequences

### Positive
- **Regulatory defensibility.** A customer's QA Director can answer "what about AI hallucinations?" with a structural answer, not a probabilistic one.
- **Trust narrative.** The cite-or-fallback guarantee is one of the five sharpened value propositions (see [VISION.md §4c](../../01-strategy/vision-and-positioning/VISION.md)).
- **Compliance evidence.** Validation of this guarantee is a single OQ test rather than a per-task review.
- **AI Audit Trail integrity.** Every AI output that reaches a user has a defensible source lineage.
- **Sales differentiation vs incumbents** that bolt LLMs onto legacy EQMS without grounding.

### Negative
- **Apparent helpfulness lower** for queries where evidence is genuinely sparse. AskHawk responses say "insufficient evidence — human input required" more often than competitors that confabulate.
- **Customer onboarding** must educate users that "insufficient evidence" is a feature, not a bug.
- **Engineering discipline** required: every new AI task must integrate with the retrieval+grounding flow; "quick path" without grounding is structurally impossible.
- **Some "draft" use cases** (e.g., "write me a quick summary") need careful design — they should explicitly disclaim "not source-grounded" rather than try to bypass the guarantee.

### Operational
- The rule is enforced inside `services/ai/gateway/llmGateway.js` (the only LLM ingress).
- The retrieval+confidence threshold is the gating logic; if no source meets the threshold, the gateway returns the canonical fallback string.
- The retrieval threshold IS configurable (per task type, per tenant), but the cite-or-fallback BEHAVIOR is not.

---

## 6. Implementation notes

### Enforcement point

The gateway (per [ADR-002 — Multi-LLM Gateway](./ADR-002-multi-llm-gateway.md)) runs cite-or-fallback as a pre-output check:

```
for every AI task that returns text:
    1. retrieve top-k sources from tenant KB + regulatory corpus
    2. compute retrieval confidence (cosine + reranker)
    3. if confidence < threshold OR no source retrieved:
         return { text: "Insufficient evidence — human input required.",
                  citations: [],
                  confidence: 0,
                  fallback: true }
    4. else:
         pass {sources} to LLM with grounding instructions
         post-validate that LLM response cites at least one source
         if validation fails, return fallback
```

### What IS configurable

| Parameter | Default | Configurable by |
|---|---|---|
| Retrieval confidence threshold | 0.6 | Tenant admin, per task type |
| Top-k sources to retrieve | 5 | Tenant admin |
| Re-ranker enabled | true | Tenant admin |
| Custom prompt template per task | yes | Tenant admin (per Configuration Layer) |

### What is NOT configurable

| Parameter | Why |
|---|---|
| The fallback behavior itself | Layer 1 / regulatory commitment |
| The fallback string format | Customer auditor must always recognize it |
| Whether to log the fallback in AI Audit Trail | ALCOA+ Complete + Attributable |
| Bypassing cite-or-fallback per task | No exceptions |

### Code anchor

- `services/ai/gateway/llmGateway.js` — gateway with cite-or-fallback enforcement
- `services/ai/grounded-generation/` — retrieval + threshold + post-validation logic
- `services/ai/audit/aiAuditTrail.js` — captures fallback occurrences for operational visibility

### UI rendering

When the gateway returns a fallback, the frontend renders it distinctively (per [DESIGN-PRINCIPLES.md §3 — Honesty in AI](../../05-design/design-system/DESIGN-PRINCIPLES.md)):

- Skeleton state visible (not pretending to be a real answer)
- Clear "AI returned: insufficient evidence" label
- Prompt to add evidence to KB OR proceed manually
- Telemetry captures fallback rate per task per tenant (helps customer tune threshold or add KB content)

---

## 7. When to revisit

| Signal | Action |
|---|---|
| Customer-side fallback rate >30% for AskHawk casual chat | Re-examine retrieval pipeline (likely a content / KB gap, not a guarantee issue) |
| A regulator explicitly requires a different fallback format | Adjust the format; do NOT change the guarantee |
| LLM provider releases native "decline if no source" mode at lower cost | Evaluate switching to it — but the guarantee stays |
| Customer requests a "draft-only" mode that bypasses citation | Decline; offer "draft from this specific source you upload" as the supported path |

---

## 8. References

- [VISION.md §4c #5](../../01-strategy/vision-and-positioning/VISION.md) — value prop #5 codifies this guarantee
- [ARCHITECTURE.md §11 Rule 5](../01-architecture/ARCHITECTURE.md) — "Cite-or-fallback is non-negotiable" architectural rule
- [PLATFORM-OVERVIEW.md §2c](../00-overview/PLATFORM-OVERVIEW.md) — Layer 3 (AI Gateway) description
- [GAMP-CAT-4-COMPLIANCE.md §27.1](../../08-compliance-regulatory/GAMP-CAT-4-COMPLIANCE.md) — "Two guarantees that cannot be configured away"
- [DESIGN-PRINCIPLES.md §3](../../05-design/design-system/DESIGN-PRINCIPLES.md) — "Honesty in AI" UI principle
- [RESEARCH-FINDINGS.md Insight 2](../../03-product/01-personas-and-research/RESEARCH-FINDINGS.md) — user research red line
- [ADR-002](./ADR-002-multi-llm-gateway.md) — gateway is the enforcement point
- FDA Good Machine Learning Practice (Oct 2021)
- EMA Reflection Paper on AI in Medicinal Product Lifecycle (Sept 2024)
- Academic: "RegGuard: Retrieval-Augmented Generation Under Regulatory Constraints" (2026), HalluGuard (2025)

---

*Doc_V2 · Engineering · ADR-003 · Accepted 2026-02-20*
