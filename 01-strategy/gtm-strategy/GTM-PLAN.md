# Go-To-Market Plan

| Field | Value |
|---|---|
| Owner | Founders + Sales |
| Status | DRAFT (v1.0) |
| Version | 1.0 |
| Last updated | 2026-05-31 |
| Pairs with | [VISION.md](../vision-and-positioning/VISION.md), [MARKET-ANALYSIS.md](../market-analysis/MARKET-ANALYSIS.md), [PRICING.md](../pricing-and-packaging/PRICING.md) |

---

## 1. The GTM thesis in one paragraph

> 💡 **Win the SMB / emerging-market pharma wedge with founder-led selling and the supplier-audit wedge as our opening move. Convert 40-60 Tier-2 mid-pharma + 60-100 Tier-3 CDMO accounts in 36 months. Harvest references and a hardened standards pack. Then hop to Food & Beverage (Ring 1) — same supplier-audit motion, ~75% engine reuse, strong budget growth.** Never lead with "industry-agnostic" — lead with the pain we solve today.

## 2. Ideal Customer Profile (ICP) — Phase 1 (pharma India)

```mermaid
flowchart LR
    classDef tier1 fill:#fee2e2,stroke:#b91c1c,color:#7f1d1d
    classDef tier2 fill:#dcfce7,stroke:#15803d,color:#14532d,stroke-width:3px
    classDef tier3 fill:#dcfce7,stroke:#15803d,color:#14532d,stroke-width:3px
    classDef tier4 fill:#fef3c7,stroke:#92400e,color:#78350f

    T1["<b>Tier 1</b><br/>Large pharma (Cipla, Sun)<br/>~50 units<br/>❌ NOT TARGET"]:::tier1
    T2["<b>Tier 2 SWEET SPOT</b><br/>Mid-size formulations + APIs<br/>~400-500 units<br/>✅ TARGET"]:::tier2
    T3["<b>Tier 3 SWEET SPOT</b><br/>CDMOs / contract mfg<br/>~800-1000 units<br/>✅ TARGET"]:::tier3
    T4["<b>Tier 4</b><br/>SME formulators, nutra<br/>~2000+ units<br/>⚠️ Long-tail PoC"]:::tier4
```

### ICP definition (sales qualification criteria)

| Attribute | Qualified |
|---|---|
| Revenue | ₹500–5,000Cr (Tier 2) or contract manufacturer of any size (Tier 3) |
| Certification | WHO-GMP certified for export (preferred) |
| Quality team size | 5+ QA staff |
| Audit frequency | 8+ audits/year hosted, OR 5+ audits conducted/year |
| Current EQMS state | Spreadsheets / email / fragmented point tools (NOT Veeva, NOT MasterControl in production) |
| Decision maker | Head of QA, VP Quality, or Plant Quality Manager |
| Buying authority | Can sign $5K–15K ACV without board approval |
| Compliance triggers | Recent FDA-483, EU GMP non-conformance, customer audit failure, or upcoming regulator visit |

## 3. The wedge: supplier audit (the entry point)

```mermaid
flowchart TB
    classDef wedge fill:#dbeafe,stroke:#1e40af,color:#1e3a8a,stroke-width:3px
    classDef expand fill:#dcfce7,stroke:#15803d,color:#14532d

    W["<b>WEDGE — Supplier Audit</b><br/>Most acute pain<br/>Worst incumbent coverage<br/>Travels across every vertical"]:::wedge

    E1["+ Document Control"]:::expand
    E2["+ Deviation / CAPA"]:::expand
    E3["+ Change Control"]:::expand
    E4["+ Risk Register"]:::expand
    E5["+ Training Effectiveness"]:::expand
    E6["+ Complaint Mgmt"]:::expand

    W -->|Month 3-6 land + expand| E1
    W --> E2
    W --> E3
    W --> E4
    W --> E5
    W --> E6
```

> 💡 **Why supplier audit, not "full EQMS".** The supplier-audit pain point is acute (30+ audits/year per CDMO, mostly redundant, mostly painful). It's a single-stakeholder buy (QA head, not board). It demonstrates the platform's grounded AI, e-sig, audit trail in one demo. After 60-90 days of audit-only success, expansion into the other EQMS modules becomes a no-friction upsell because the platform, validation, and trust are already in place.

## 4. Sales motion by stage

### Phase 1 — Founder-led selling (M0-M9)

```mermaid
sequenceDiagram
    autonumber
    participant F as Founder
    participant Prospect
    participant SME as Pharma SME consultant
    participant Champion as QA Head champion

    F->>Prospect: Outbound (LinkedIn, intros, events)
    Prospect->>F: 30-min discovery call
    F->>F: Qualify against ICP
    F->>Prospect: Schedule technical demo (60 min)
    SME-->>F: Joins demo as domain credibility
    F->>Prospect: Demo focused on supplier-audit pain
    Prospect->>F: Approves 60-day PoC (1-2 supplier audits)
    F->>Prospect: PoC kickoff + onboarding
    Champion->>F: Internal advocate emerges
    F->>Prospect: PoC review @ Day 45
    Prospect->>F: Decision: paid subscription OR pivot
    F->>Prospect: Contract close (₹6-10L ACV)
```

| Stage | Founder activity | KPI / exit criteria |
|---|---|---|
| 1 · Prospect | 50 outbound touches/week (LinkedIn, warm intros, pharma events) | 8 discovery calls / month |
| 2 · Discover | 30-min call with QA head / VP Q | 4 demos / month qualified |
| 3 · Demo | 60-min technical demo (supplier-audit story + AI grounding) | 2 PoCs / month started |
| 4 · PoC | 60-day pilot with 1-2 real supplier audits | 35%+ PoC → paid conversion |
| 5 · Close | Contract + onboarding | 4-6 month sales cycle, $9-12K ACV |
| 6 · Land + Expand | Month 4-6 upsell into adjacent modules | NDR > 110% |

### Phase 2 — First sales hire (M9-M18)

Hire **Founding Sales / GTM** (pharma-domain background, ₹25-40L + variable). They own:
- Outbound pipeline (50% of leads)
- PoC management + conversion
- Reference cultivation (target: 10 named references by M18)
- Founder takes back >$20K ACV deals only

### Phase 3 — Scale (M18-M36)

Add SDR + second AE + Customer Success. Move to repeatable playbook:
- Outbound (SDR) → discovery (AE) → demo (AE + SME) → PoC (AE + CS) → close (AE)
- Average deal cycle compresses to 3-4 months
- Net Dollar Retention target: 110%+ via module expansion

## 5. Channels — where customers come from

| Channel | M0-M6 | M6-M18 | M18-M36 | Notes |
|---|---|---|---|---|
| **Outbound (LinkedIn + warm intros)** | 60% | 40% | 25% | Founder-led; targets ICP roles directly |
| **Pharma industry events / conferences** | 15% | 20% | 20% | IPA, CDMO summits, FDA visits |
| **Inbound (content + SEO)** | 5% | 15% | 25% | Industry research papers, regulatory guides as bait |
| **Customer referrals** | 5% | 15% | 20% | Targeted post-M6 once first 10 customers are reference-able |
| **Partner channels** | 5% | 5% | 10% | See [PARTNERSHIPS.md](../partnerships/PARTNERSHIPS.md) |
| **Inbound (industry analysts, awards)** | 10% | 5% | — | One-time during fundraise period |

## 6. Per-segment GTM motion

```mermaid
flowchart LR
    classDef t2 fill:#dbeafe,stroke:#1e40af,color:#1e3a8a
    classDef t3 fill:#dcfce7,stroke:#15803d,color:#14532d
    classDef t4 fill:#fef3c7,stroke:#92400e,color:#78350f

    T2["<b>Tier 2 Mid-Pharma</b><br/>$10-18K ACV<br/>4-6 mo cycle"]:::t2
    T2 --> T2A["Multi-stakeholder<br/>Multi-site rollout<br/>Full EQMS upsell"]:::t2

    T3["<b>Tier 3 CDMOs</b><br/>$7-14K ACV<br/>3-4 mo cycle"]:::t3
    T3 --> T3A["Single QA head decision<br/>Supplier-audit pain dominant<br/>Fast close"]:::t3

    T4["<b>Tier 4 SMEs / Nutra</b><br/>$4-7K ACV<br/>4-6 mo cycle"]:::t4
    T4 --> T4A["PoC-led / self-serve<br/>Usage-priced<br/>Long-tail"]:::t4
```

| Segment | Sales motion | Land use case | Expand modules | Cycle | NDR target |
|---|---|---|---|---|---|
| Tier 2 mid-pharma | Multi-stakeholder enterprise | Supplier audit + doc control | CAPA, deviation, change control | 4-6 mo | 115% |
| Tier 3 CDMOs | Single-decision-maker | Supplier audit (acute pain) | Deviation, CAPA, training | 3-4 mo | 105% |
| Tier 4 SMEs | PoC-led, self-serve onboarding | Audit response automation | Doc control add-on | 4-6 mo | 100% |

## 7. The expansion sequence (matches Market Analysis §9)

```mermaid
flowchart LR
    classDef now fill:#dcfce7,stroke:#15803d,color:#14532d,stroke-width:3px
    classDef next fill:#dbeafe,stroke:#1e40af,color:#1e3a8a

    M["<b>NOW — Months 0-18</b><br/>Pharma India SMB<br/>Tier 2 + Tier 3 + Tier 4<br/>25-35 customers"]:::now
    N["<b>NEXT — Months 18-30</b><br/>Pharma SE Asia + Middle East<br/>OR Food & Beverage India<br/>(pick by partner pull)"]:::next
    L["<b>LATER — Months 30-48</b><br/>US/EU pharma<br/>+ Food & Beverage scaled<br/>+ Med-device QMSR migration"]:::next
```

| Phase | Time | Target | Why now |
|---|---|---|---|
| **Now** | M0-M18 | Pharma India: Tier 2 + Tier 3 + Tier 4 | Highest pull; the wedge incumbents ignore; proves engine + reproducible AI + affordability |
| **Next** | M18-M30 | Pharma SE Asia + Middle East, OR Food & Beverage (whichever has stronger partner pull) | First geographic OR first vertical hop, depending on traction |
| **Later** | M30-M48 | US/EU pharma + Food & Beverage scaled + Med-device QMSR migration | Series A funded; ready for upmarket + first non-pharma vertical |
| **Horizon** | M48+ | Automotive supplier-audit wedge + Aerospace | Ring 2 with ISO 9001:2026 convergence tailwind |

## 8. Customer journey — from prospect to expansion

```mermaid
journey
    title Tier 3 CDMO customer journey (6-month land-to-expand)
    section Discovery
      Outbound touch: 3: Founder
      Discovery call: 4: Founder, QA Head
      Qualify: 5: Founder
    section Pilot
      Technical demo + SME: 5: Founder, QA Head, Pharma SME
      PoC kickoff: 4: Founder, QA Head, Implementation
      First supplier audit: 5: QA Head, Auditor
      PoC review: 5: Founder, QA Head
    section Close
      Contract negotiation: 3: Founder, QA Head, CFO
      Onboarding: 4: Customer Success, QA Team
      First audit in production: 5: QA Head, Auditor
    section Expand
      Module 2 land (doc control): 4: CS, QA Head
      Module 3 land (CAPA): 5: CS, QA Head, VP Q
      Reference call to next prospect: 5: QA Head
```

## 9. Demo script — the 30/45/60 minute cuts

The canonical demo lives at `00-strategy-and-pitch/demo-assets/07-pharma-demo-script.md`. Three cuts:

| Cut | Audience | Focus | Demo modules |
|---|---|---|---|
| **30-min** | QA Head intro / first call | Pain reduction in supplier audit only | Audit list → schedule audit → AI observation drafter → e-sig closure |
| **45-min** | QA team + Plant Head | Audit + deviation + CAPA cross-module wiring | Add: deviation → CAPA workflow with predictive AI |
| **60-min** | VP Quality + CFO | Full EQMS + reproducible AI traceability + ROI | Add: doc control, change, audit-trail browser, ROI calculator |

## 10. Pricing positioning

| Anchor | S.M.A.R.T. Hawk | Veeva / MasterControl |
|---|---|---|
| Annual contract value | $4K–18K (per-segment) | $30K floor → $300K+ at scale |
| Implementation cost | $0–5K | $50K-500K consultant-driven |
| Time-to-value | < 30 days (PoC live) | 6-12 months |
| Per-audit cost (delivered) | ~$300-500 | ~$3000-5000 (incl. consulting overhead) |

The conversation that closes the deal lives in [PRICING.md §4](../pricing-and-packaging/PRICING.md#4-the-conversation-that-closes-the-deal).

## 11. Reference customer plan

The first 10 customers are **reference customers** — sold at near-zero margin in exchange for:

| Reference asset | Required from each customer |
|---|---|
| Named logo + case study | Mid-PoC commitment |
| Time-on-task ROI calculation | 30 days post go-live |
| Co-presented webinar | Within 90 days post go-live |
| Reference call to 2 prospects | Within 6 months |
| Quote for pitch deck | Within 60 days |

Target: **10 reference customers by M18** (~50% of total customer base at that point).

## 12. Pre-Series-A milestone targets

| Milestone | M6 | M12 | M18 | M24 | M36 |
|---|---|---|---|---|---|
| Paying customers | 0-2 | 8-12 | 25-35 | 55-75 | 150-200 |
| ARR ($K) | 0 | 75 | 255 | 620 | 1,825 |
| Reference customers (named) | 0 | 3 | 8-10 | 15+ | 30+ |
| Named industry verticals | 1 (pharma) | 1 | 1 | 1-2 | 2-3 |
| Net Dollar Retention | n/a | 100% | 105% | 110% | 115% |
| Sales cycle (months) | 6+ | 5 | 4 | 3.5 | 3 |
| Demo→PoC conversion | 25% | 30% | 35% | 40% | 45% |
| PoC→Paid conversion | 25% | 30% | 35% | 40% | 45% |

> ⚠️ **The series-A trigger.** At M18, ARR run-rate ~$255K + 25-35 customers + strong NDR + 1-2 ring-1 customers = Series A territory. If those don't hit, founder-led extension round + tighter focus.

## 13. What we DON'T do (yet)

> 🚫 **Things we will NOT pursue in the first 18 months — even if asked.**
>
> - **Veeva or MasterControl displacement** in Tier 1 accounts (wrong fight, wrong timing)
> - **On-prem deployments** (until M18+ when sovereignty becomes a real ask)
> - **US/EU market expansion** (until M30+ post-Series-A; India + SE Asia first)
> - **Vertical packs beyond pharma + adjacent GxP** (food, cosmetics) — until pharma references hit 10+
> - **Marketplace network effects** (Qualifyze-style) — until we have 50+ buyers and 200+ suppliers as captive supply
> - **Enterprise sales** with 6+ month cycles — keep cycles short, prove velocity first
> - **Free / freemium tiers** — eroding the value-share narrative is not worth the lead-gen
> - **System integrator partnerships** at scale (Accenture, Deloitte) — wrong velocity for our stage; revisit at Series A

## 14. Risks & mitigations (GTM-specific)

| Risk | Likelihood | Mitigation |
|---|---|---|
| Founder-led sales doesn't scale past 10 customers | High (by design) | Hire pharma-domain Founding Sales at M9, after PMF signal |
| First sales hire underperforms (long ramp) | Medium-high | Founder co-sells first 5 deals with hire; hard 90-day ramp |
| PoC → paid conversion < 30% | Medium | Tighten qualification; require written success criteria; shorter PoCs |
| Sales cycle stretches past 6 months | Medium | Pivot positioning to single-wedge (supplier audit only); narrower problem = faster close |
| Competitor launches India-specific tier (Veeva SMB, etc.) | Low | Lock 10+ reference customers before they react; differentiate on AI + supplier coupling, not just price |
| Industry events / conference budget gets cut | Low | Outbound + content channels can absorb |
| Customer asks for on-prem before we're ready | Medium | Validation + roadmap commitment with deferred delivery; or partner with sovereignty-focused vendor |

## 15. Honest reckoning

> ⚠️ **What we don't yet know.** We are pre-customer. The 35% PoC-conversion rate is an assumption. The 4-6 month sales cycle is an assumption. The supplier-audit-wedge thesis is unvalidated commercially (only validated through customer discovery interviews). The first 6 months post-funding are about proving these assumptions or pivoting. The GTM plan above is the **base case**; the **pessimistic case** (M18 ARR ~$120-150K) still funds a smaller seed at lower valuation. Plan does not require optimistic execution.

---

## See also

- [VISION.md](../vision-and-positioning/VISION.md) — positioning + 5-pillar engine
- [MARKET-ANALYSIS.md](../market-analysis/MARKET-ANALYSIS.md) — sector rings + TAM
- [PRICING.md](../pricing-and-packaging/PRICING.md) — ACV math
- [PARTNERSHIPS.md](../partnerships/PARTNERSHIPS.md) — channel + tech partnerships
- `00-strategy-and-pitch/demo-assets/07-pharma-demo-script.md` (legacy) — canonical demo script
- `Doc_V2/09-sales-marketing/demo-scripts/` — eventual home of refreshed demo materials
