# PDR-001 — No Production Freemium Tier (Sandbox + PoC Instead)

| Field | Value |
|---|---|
| Status | **Accepted** — 2026-06-01 |
| Owner | Product · Founders |
| Approver | Founder Lead |
| Supersedes | n/a (initial decision) |
| Superseded by | n/a (still in force; Sandbox was added under PDR-005 as a non-production discovery tier) |
| Pairs with | [PRICING.md §6 + §16.3](../../01-strategy/pricing-and-packaging/PRICING.md) |

---

## 1. Context

In April–May 2026 the team debated whether to introduce a **freemium tier** for top-of-funnel lead generation. Multiple advisors argued that B2B SaaS in 2026 expects a "try before you buy" entry; pure sales-led motion was seen as slower.

The counter-argument was that pharma EQMS is not consumer SaaS: customers cannot "try" the platform meaningfully without putting real audit data into a system that must meet 21 CFR Part 11 + EU GMP Annex 11 — which a free unmanaged tier cannot deliver. A freemium tier with real audits would either (a) compromise the compliance posture (free customers running production-grade GxP on us) or (b) be so feature-limited as to fail to demonstrate value.

## 2. Decision

> 📜 **S.M.A.R.T. Hawk will NOT offer a production freemium tier.** Customer trial happens via a structured 60-day Proof of Concept (PoC) with written success criteria, on the customer's real audit data, at no cost. The PoC is the "try-before-buy". Paid contracts are Starter (₹3.5L) / Growth (₹10L) / Enterprise (₹20L+). No tier with real-audit production use is free, ever.

## 3. Alternatives considered

### Option A: Freemium production tier (1 site, 1 user, watermarked exports, real audits)
- **Pros:** Lower entry barrier; top-of-funnel growth; "self-serve" credibility with VC story
- **Cons:** Erodes the value-share narrative ("we charge ~25% of customer savings"); creates compliance liability if customer treats it as production; complicates the PoC sales motion ("why pay for a PoC when freemium exists?"); operational support cost for free customers; difficult to migrate from free → paid without friction

### Option B: PoC-led only (no freemium, no sandbox)
- **Pros:** Cleanest commercial narrative; full sales control; high-touch quality
- **Cons:** No top-of-funnel for self-driven prospects; longer sales cycle; harder to scale outbound past founder bandwidth

### Option C: Selected — PoC-led + (later) Sandbox tier for discovery
- **Pros:** PoC remains the qualified trial; Sandbox added later (PDR-005) for top-of-funnel without compromising the value pitch (Sandbox is synthetic data, watermarked, 14-day, demo-only — explicitly not production)
- **Cons:** Two-step funnel adds complexity; risk of Sandbox being treated as "the free tier"

## 4. Rationale

| Criterion | Verdict |
|---|---|
| Value-share narrative integrity | Option C preserves "you save ₹38L, we charge ₹10L". Option A erodes it. |
| Compliance liability | Option A creates real risk (customer running unvalidated EQMS on production data). Option C avoids it via the Sandbox guardrails. |
| Sales motion clarity | Option C: "Sandbox to explore, PoC to validate, paid to run". Three distinct lanes with three distinct conversion mechanics. |
| Top-of-funnel pressure | Option B had this gap. Option C fills it via Sandbox without compromising the rest. |
| Founder bandwidth | Option C scales (Sandbox is self-serve; PoC is qualified). Option B does not. |
| Time-to-cash | Option C: customers can self-discover via Sandbox then convert via PoC. Option A: free users may never pay. |

## 5. Consequences

### Positive
- Value-share pitch remains intact in CFO + procurement conversations.
- PoC remains the closing motion with written success criteria.
- No "free tier abuse" customer-support burden.
- Procurement teams cannot ambiguously say "we use the free tier" — clear paid/Sandbox split.

### Negative
- We forgo a self-serve growth lane (until PDR-005 added Sandbox).
- Slower top-of-funnel than freemium-based competitors.
- Outbound sales motion is mandatory for first 50 customers.
- Some prospects who would have signed up for freemium may not engage at all.

### Operational
- The Sandbox tier (added later under PDR-005) must be operationally cheap to maintain.
- PoC conversion target ≥70% Day-60 → paid; if conversion falls below 50% we should revisit.

## 6. Compliance + commercial implications

| Area | Impact |
|---|---|
| [PRICING.md §6](../../01-strategy/pricing-and-packaging/PRICING.md) | Tier ladder reflects this: Sandbox · PoC · Starter · Growth · Enterprise (no freemium between PoC and Starter) |
| [PRICING.md §16.3](../../01-strategy/pricing-and-packaging/PRICING.md) | Principle 3 codified: "No production freemium" |
| [SALES-PLAYBOOK.md](../../09-sales-marketing/pitch-materials/SALES-PLAYBOOK.md) | Sales motion structured around PoC, not freemium |
| [POC-PROPOSAL.md](../../09-sales-marketing/pitch-materials/POC-PROPOSAL.md) | The proposal IS the free trial |
| [GAMP-CAT-4-COMPLIANCE.md](../../08-compliance-regulatory/GAMP-CAT-4-COMPLIANCE.md) | Avoids the GAMP Cat 4 validation cost being borne for free customers |

## 7. When to revisit

| Signal | Action |
|---|---|
| PoC conversion rate <50% sustained over 6 months | Reopen — pricing/positioning issue, not freemium issue |
| 3+ direct competitor losses where they offered freemium and won | Reopen — competitive pressure |
| Sandbox tier (PDR-005) generates <5% of PoC requests | Reopen — Sandbox might need to be more capable, but should not become production freemium |
| Reaching 100 paid customers — re-examine top-of-funnel mechanics | Standard review |

## 8. References

- Discussion thread (internal) with founders Apr 28, 2026
- Advisor feedback (3 external advisors, May 2026)
- Industry analysis: Veeva (no freemium), MasterControl (no freemium), TrackWise (no freemium) — comparable EQMS vendors universally PoC-led
- [PRICING.md](../../01-strategy/pricing-and-packaging/PRICING.md)
- [PDR-005 — Add Sandbox tier as non-production discovery lane](./DECISIONS-INDEX.md)

---

*Doc_V2 · Product Decision Record · PDR-001 · Accepted 2026-06-01*
