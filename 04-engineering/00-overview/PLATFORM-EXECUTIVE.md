# Platform Architecture — Executive View

| Field | Value |
|---|---|
| Audience | CEO · CFO · Board · Investor |
| Length | 1 page · 3 min read |
| Last updated | 2026-05-31 |
| Companion docs | [PLATFORM-ENGINEERING.md](PLATFORM-ENGINEERING.md) (CTO view) · [PLATFORM-USER-FLOWS.md](PLATFORM-USER-FLOWS.md) (per persona) · [PLATFORM-OVERVIEW.md](PLATFORM-OVERVIEW.md) (full reference) |

---

> 💡 **The one-line summary.** S.M.A.R.T. Hawk is an **industry-agnostic compliance engine** built around 5 universal pillars. Same architecture, different configuration per vertical. Today: pharma. Tomorrow: food + med-device. Eventually: every regulated supply chain.

---

## The Engine in One Picture

Three layers. The pipeline (middle) does the work. The configuration layer (top) makes it industry-agnostic. The AI gateway (bottom) makes it intelligent — but governed.

![Three-layer architecture — Configuration Layer wraps the Five-Pillar Pipeline. AI Gateway plugs in from below. Pipeline is fixed; vertical is configuration; AI never commits a record.](../../_assets/hero-svgs/01-platform-architecture.svg)

*The pipeline is **fixed**. The standard, vocabulary, rules, and templates are **configuration**. AI plugs in at every pillar but **never commits a record** — humans always review and e-sign. That separation is what makes the engine industry-agnostic AND what makes the AI defensible to a regulator.*

---

## What This Means For The Business

| Strategic implication | Why it matters |
|---|---|
| **One codebase serves multiple verticals** | Engineering cost stays nearly flat as we add food, med-device, auto. New vertical = new standards pack + new templates, not a fork. |
| **One sales motion travels across verticals** | Supplier audit exists in pharma, food, auto, aero, electronics. Same product, new packaging. |
| **One compliance posture satisfies many regulators** | Part 11 + Annex 11 + ICH + ISO 9001 + ISO 13485 — one audit trail satisfies all. |
| **AI compounds across customers** | Active-learning loop captures every user decision; the model gets better as the customer base grows. |
| **Marginal cost per customer is low** | After M18, gross margin trends to 80% — typical SaaS unit economics. |

---

## Why This Is Defensible

1. **Vertical incumbents (Veeva, MasterControl, Greenlight Guru) will NEVER build this** — their entire moat is vertical depth; going horizontal would destroy what makes them valuable.
2. **Horizontal platforms (ServiceNow, SAP) lack regulated-domain depth** — they have distribution, we have the GxP credibility + reproducible AI.
3. **The standards world is converging onto a common ISO 9001 spine** (2026 revision, IA9100, IATF 16949:2027) — we're rowing with this tailwind.
4. **Native AI architecture from day one** — every output cited + confidence-scored + audit-trailed. Incumbents are retrofitting LLMs into legacy stacks.

---

## What's Built (May 2026)

- **15 default EQMS modules**: AUDIT_MANAGEMENT, DOCUMENT_CONTROL, CAPA_MANAGEMENT, CHANGE_CONTROL, EVENT_MANAGEMENT, TRAINING_MANAGEMENT, RISK_MANAGEMENT, SUPPLIER_QUALITY, MANAGEMENT_REVIEW, ASSET_MANAGEMENT, CHAIN_OF_CUSTODY, TRANSACTION_REVIEW, REGULATORY_INTEL, AI_ASSISTANT (AskHawk), RFQ_PROCUREMENT — code-verified against `backend/src/models/ModuleConfigModel.js`
- **AskHawk cross-cutting AI**: regulations Q&A (11 standards × 32 clauses), SOPs (6 templates), workflow playbooks (38 persona-aware), App Wizard (8 tools)
- **Part 11 / Annex 11–grade compliance spine**: immutable audit trail, e-signature ceremony, RBAC + tenant isolation, AI decision audit trail

## What's Coming (next 18 months)

- SOC 2 Type 1 certification (M12)
- S.M.A.R.T. Hawk-tuned Llama-3 in production (M12)
- Remote-audit cockpit UI (M15)
- First 25-35 paying customers (M18)
- First Food & Beverage vertical pack (M18-M24)

---

## The Ask

| Field | Value |
|---|---|
| **Round** | Pre-seed / Angel |
| **Size** | $1.2-1.5M (target $1.5M) |
| **Runway** | 18 months |
| **Milestones at close** | $250-400K ARR · 25-35 customers · S.M.A.R.T. Hawk-tuned AI in prod · 1+ non-pharma vertical signed |

> 💡 **Next move:** read the [S.M.A.R.T. Hawk Story](../../SMART-HAWK-STORY.md) for the full narrative, or [BUSINESS-PLAN.md](../../02-fundraising/business-plan/BUSINESS-PLAN.md) for the bottom-up financials.

---

*Doc_V2 · Platform Architecture · Executive · 1 page*
