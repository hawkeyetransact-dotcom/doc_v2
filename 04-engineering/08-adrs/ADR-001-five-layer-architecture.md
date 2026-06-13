# ADR-001 — Five-Layer Architecture with Trust as Layer 1

| Field | Value |
|---|---|
| Status | **Accepted** — 2026-06-04 |
| Author | Founder Lead + CTO |
| Reviewers | Engineering team · Compliance Lead |
| Supersedes | The earlier "3-layer engine" framing (Config + 5-pillar Pipeline + AI Gateway) — preserved as the interior of Layer 4 |
| Superseded by | n/a |

---

## 1. Context

Earlier in the platform's life we documented the engine as a **three-layer architecture**: a Configuration Layer (top) that made the engine industry-agnostic, a Five-Pillar Pipeline (middle) for the universal compliance motion, and an AI Gateway (bottom) plugging into each pillar.

That framing was accurate to the code but **insufficient as a buyer-facing story**, because:

1. It implicitly hid the data layer (MongoDB + S3 evidence store) and the experience layer (Next.js UI + AskHawk).
2. It did not surface **Trust · Security · Compliance** as the foundation everything depends on — a buyer-facing audience (QA Director, IT Compliance) experiences security as the substrate, not as a feature.
3. It conflated "the engine" (Layer 4 in the new framing) with "the platform" (all 5 layers).
4. It failed the procurement-gate test: customers asked "what layer does Part 11 live in?" — the answer "everywhere" was unsatisfying.

A user feedback round (June 2026) explicitly asked for a 5-layer architecture with security/privacy as a primary pillar.

---

## 2. Decision

> 📜 **S.M.A.R.T. Hawk is architected as five layers, with Trust · Security · Compliance as Layer 1 — the foundation on which every higher layer depends.**
>
> 1. **Layer 1 — Trust · Security · Compliance** *(foundation)*: GAMP 5 Cat 4 · Part 11 · Annex 11 · ALCOA+ · encryption · tenant isolation · data residency · zero AI training on customer data
> 2. **Layer 2 — Data & Evidence**: multi-tenant MongoDB · S3-compatible evidence store · SHA-256 record hashing · tamper-evident audit log
> 3. **Layer 3 — AI Gateway**: multi-LLM routing · grounded generation · cite-or-fallback · AI Audit Trail
> 4. **Layer 4 — Domain Engine**: 15 EQMS modules · Configuration Layer · 5-pillar runtime (Collect · Process · Validate · Report · Seal)
> 5. **Layer 5 — Experience**: multi-persona UI · AskHawk chat · phase stepper · mobile companion

The previous 3-layer engine framing is **preserved unchanged inside Layer 4** as the Domain Engine's internal structure (Configuration Layer + 5-pillar Pipeline + AI Gateway hook from Layer 3).

---

## 3. Alternatives considered

### Option A: Keep the 3-layer engine framing as the architecture
- **Pros:** Already documented · no churn to existing docs
- **Cons:** Buyer-facing failure (per Context); hides data + experience layers; misses opportunity to elevate Trust

### Option B: Onion / hexagonal architecture (no numbered layers)
- **Pros:** Common in DDD literature
- **Cons:** Less intuitive for buyer audiences; "core domain in the middle" doesn't naturally elevate Trust as foundation; pharma audiences think in stacks not rings

### Option C: 7-layer architecture (OSI-inspired)
- **Pros:** Granular
- **Cons:** Too granular for buyer-facing; loses sharpness

### Option D: Selected — 5-layer with Trust as Layer 1
- **Pros:** Aligns to how buyers (QA Director, IT Compliance) experience the platform; elevates Trust as foundation; preserves engineering substance (5-pillar pipeline + 3-internal-components live inside Layer 4); identical diagram works for engineer + sales + investor; aligns to industry framing ("trust-first architecture")
- **Cons:** Required updating ~12 documents to consistent canon (done in same week as this ADR)

---

## 4. Rationale

| Criterion | Verdict |
|---|---|
| Faithfulness to actual code | High — every layer maps to real code (Layer 1 = `middleware/auth.js` + `electronicSignatureModel`; Layer 2 = Mongoose + `s3Upload.js`; Layer 3 = `services/ai/`; Layer 4 = `modules/` + `services/`; Layer 5 = `frontend/`) |
| Buyer-facing intelligibility | High — QA Director recognizes "Trust as foundation" as how they think about it |
| Engineer-facing usability | High — preserved 5-pillar pipeline + 3-internal-components inside Layer 4 means no engineering churn |
| Compliance documentation fit | High — every clause in Part 11 / Annex 11 / ALCOA+ maps cleanly to a layer (most to Layer 1, some to Layer 2 + Layer 3) |
| Pricing/positioning fit | High — "Trust-First Layer 1 architecture" is value prop #4 |
| Future extensibility | High — vertical packs slot into Layer 4 (Domain Engine) via Configuration Layer without disturbing other layers |

---

## 5. Consequences

### Positive
- One canonical architecture diagram across all 15 customer-facing documents.
- Buyer-facing pitch decks (POC-PROPOSAL, CFO-DECK, CTO-DECK, QA-HEAD-DECK) carry consistent framing.
- GAMP Cat 4 + Part 11 + Annex 11 + ALCOA+ have a natural home (Layer 1).
- Security/privacy posture is structurally elevated, not buried in a footnote.
- Vertical-pack roadmap is clearer — new verticals slot into Layer 4 via configuration.

### Negative
- Required updating ~12 documents to consistent canon (done; tracked in the rewrite history).
- 15 module ARCHITECTURE.md files still need a one-line layer reference added (engineering debt, tracked in [ARCHITECTURE.md §12](../01-architecture/ARCHITECTURE.md)).
- The "5-layer" name overlaps verbally with the "5-pillar runtime"; we must consistently distinguish "layer" (vertical/structural) from "pillar" (horizontal/runtime).

### Operational
- Every new engineering doc and pitch artifact should reference this canon.
- New ADRs and PDRs should cite which layer(s) they affect.
- Onboarding training for new engineers includes the 5-layer + 5-pillar distinction.

---

## 6. Implementation notes

| Element | Where it lives | Code anchor |
|---|---|---|
| Layer 1 — Trust · Security · Compliance | Middleware + auth + e-sig + compliance services | `middleware/authMiddleware.js` · `middleware/tenantMiddleware.js` · `electronicSignatureModel.js` · `auditTrailService.js` · `services/compliance/` |
| Layer 2 — Data & Evidence | Mongoose models + storage adapter + audit log | `models/*.js` (170 files) · `utils/s3Upload.js` · `auditEventModel.js` |
| Layer 3 — AI Gateway | Single ingress to all LLM providers | `services/ai/gateway/llmGateway.js` · `services/ai/audit/aiAuditTrail.js` · `services/ai/redaction/piiRedactionService.js` |
| Layer 4 — Domain Engine | 15 EQMS modules + Configuration + 5-pillar runtime | `modules/*` + `services/` + Configuration via `services/compliance/standardRegistryService.js` etc. |
| Layer 5 — Experience | Next.js frontend | `frontend/app/` · `frontend/components/` |

The 5-pillar runtime (Source → Model → Assess → Report → Trace) is described in [ARCHITECTURE.md §1](../01-architecture/ARCHITECTURE.md) and walks through every module identically.

---

## 7. When to revisit

| Signal | Action |
|---|---|
| A 6th major architectural concern emerges (e.g., an explicit Integration Layer for >50 integrations) | Add as Layer 6 or fold into existing layer |
| Vertical packs prove the Configuration Layer needs more weight than "inside Layer 4" allows | Consider splitting Configuration as its own layer |
| Customers explicitly find "Trust as Layer 1" confusing | Reconsider naming, not structure |
| Edge / mobile native app diverges enough to warrant its own layer | Add as Layer 6 (Mobile) |

---

## 8. References

- [PLATFORM-OVERVIEW.md §2](../00-overview/PLATFORM-OVERVIEW.md) — full canonical 5-layer reference
- [VISION.md §4](../../01-strategy/vision-and-positioning/VISION.md) — strategic positioning of the architecture
- [ARCHITECTURE.md §1](../01-architecture/ARCHITECTURE.md) — engineer-facing layer detail
- [GAMP-CAT-4-COMPLIANCE.md](../../08-compliance-regulatory/GAMP-CAT-4-COMPLIANCE.md) — Layer 1 expanded
- Original 3-layer framing — preserved as Layer 4 internal structure
- Industry references: Onion architecture (Jeffrey Palermo, 2008) · Hexagonal architecture (Alistair Cockburn, 2005) · ISO/IEC/IEEE 42010 architecture description framework

---

*Doc_V2 · Engineering · ADR-001 · Accepted 2026-06-04*
