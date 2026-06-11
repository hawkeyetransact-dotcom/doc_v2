# Proof of Concept Agreement

## Hawkeye AI-Native EQMS Platform · 60-Day Engagement

---

> **Prepared for**
> `[CUSTOMER LEGAL NAME]`
> `[CUSTOMER ADDRESS]`
>
> **Prepared by**
> Hawkeye Transact Pvt. Ltd.
> `[HAWKEYE ADDRESS]`
>
> **Agreement reference:** `HK-POC-AGR-[YYYY-MM]-[NNN]`
> **Effective Date:** `[YYYY-MM-DD]`
> **Confidential** — for the sole use of the addressee

---

## §1. Parties

| Party | Name & Address |
|---|---|
| **Customer** ("Client") | `[CUSTOMER LEGAL NAME]`<br/>`[CUSTOMER REGISTERED ADDRESS]`<br/>`[CUSTOMER GSTIN / TAX ID]` |
| **Provider** ("Hawkeye") | Hawkeye Transact Pvt. Ltd.<br/>`[HAWKEYE REGISTERED ADDRESS]`<br/>`[HAWKEYE GSTIN]` |

This Proof of Concept Agreement ("Agreement") is entered into on `[EFFECTIVE DATE]` ("Effective Date") between the parties named above.

---

## §2. Purpose & Background

The Client wishes to evaluate the Hawkeye AI-native EQMS platform ("Platform") for potential adoption in its Quality Management operations. Hawkeye wishes to demonstrate the Platform's fit for the Client's audit-management and EQMS workflows under real operating conditions.

This Agreement governs a **60-day Proof of Concept** ("PoC") whose purpose is:
1. To validate the Platform's return-on-investment claims against the Client's actual audit workload.
2. To confirm the Platform's compliance posture (21 CFR Part 11 · EU GMP Annex 11 · ALCOA+) meets the Client's regulatory obligations.
3. To produce a data-driven go/no-go decision for a paid commercial engagement.

---

## §3. PoC Scope

### 3.1 Modules in scope

| Module | Included | Notes |
|---|---|---|
| Audit Management | ✅ Yes | Primary PoC focus |
| `[SECOND MODULE — Document Control · CAPA · or Deviation]` | ✅ Yes | Selected at kickoff |
| All other EQMS modules | ❌ No (read-only preview only) | Available post-conversion |

### 3.2 Sites & users

| Dimension | Value |
|---|---|
| Sites in scope | 1 — `[CUSTOMER SITE NAME / LOCATION]` |
| Named full-edit users | Up to 5 — names to be supplied at kickoff |
| View-only users (auditors, observers) | Unlimited |
| Multi-site rollout | Out of scope (post-conversion expansion) |

### 3.3 Audit volume in scope

| Type | Count |
|---|---|
| Real supplier audits run end-to-end on Platform | 1–2 audits |
| Historical audit imported as benchmark | 1 audit (Client's choice) |
| Synthetic / training audits | Unlimited |

### 3.4 AI credits

| Allowance | 25,000 credits (≈ 25 audit-grade AI generations) |
|---|---|
| Overage | Hawkeye absorbs first 10,000 of overage at no cost; further overage triggers renegotiation, not invoice |

### 3.5 Integrations

| Integration | In scope |
|---|---|
| SSO (SAML 2.0 or OIDC — Okta, Azure AD, Google, others) | ✅ Yes |
| DigiLocker import | ✅ Yes (if applicable to Client geography) |
| One (1) custom connector to Client system | ✅ Yes (scope ≤ 16 engineering hours; greater scope by separate agreement) |
| Additional integrations | ❌ Out of scope |

### 3.6 Onboarding & support

| Item | Provision |
|---|---|
| Kickoff workshop | 2 hours, on-site or video, Week 0 |
| Weekly checkpoint calls | 30 minutes each, Weeks 1–8 |
| Dedicated Slack / Teams channel | Yes; 24-business-hour response service level |
| Pharma SME consultant sessions | 2 sessions (Week 2 · Week 7) |
| Validation summary report | Delivered Week 7 |

### 3.7 Explicitly out of scope

- Custom-built workflows or modules
- On-premise deployment (cloud-only during PoC)
- Multi-site rollout beyond the single PoC site
- Production-grade service level upgrades (PoC SLA per §7)
- Third-party penetration testing arrangements (available post-conversion)
- Migration of historical EQMS data beyond the one benchmark audit
- Custom training sessions beyond the kickoff workshop

---

## §4. Success Criteria

The following success criteria are agreed jointly. Targets may be adjusted by mutual written agreement at the Week 0 kickoff. The criteria as finalized at kickoff are **binding** for the Day-60 go/no-go decision per §10.

| # | Criterion | Default target | Adjustable floor | Measurement method |
|---|---|---|---|---|
| 1 | Audit-preparation time reduction vs Client baseline | ≥40% | 25% | Stopwatch on PoC audit vs Client-provided historical baseline |
| 2 | AI-drafted findings citation completeness | 100% | Not adjustable | Inspection of findings export — every AI claim must cite source |
| 3 | 21 CFR Part 11 e-signature + audit-trail compliance | Full | Not adjustable | Validation summary report (§3.6) |
| 4 | Tools the Platform replaces (spreadsheet · email · doc store · CAPA tracker) | ≥3 of 4 | 2 of 4 | Joint count at PoC close |
| 5 | End-user preference vs status quo | ≥7 / 10 average | 6 / 10 | Anonymous survey of all PoC users |
| 6 | QA-Head go/no-go subjective assessment | "Yes" | Not adjustable | Sponsor interview at Day-60 review |

> ✅ **Asymmetry clause.** If any non-adjustable criterion is failed, or if more than two adjustable criteria fail to meet even their adjusted floor, the Client owes Hawkeye **nothing** and may exit per §11.

---

## §5. Timeline & Milestones

| Week | Milestone | Owner | Acceptance |
|---|---|---|---|
| 0 | Agreement signed · kickoff scheduled | Joint | Signed Agreement |
| 0 | Kickoff workshop · success criteria locked | Joint | Kickoff minutes signed |
| 1 | Tenant provisioned · SSO live | Hawkeye | Client login confirmed |
| 1–2 | Users invited · onboarding training (1 hour) | Hawkeye | All 5 named users active |
| 2 | Historical audit benchmark imported | Hawkeye | Benchmark report shared |
| 3–6 | First real audit runs end-to-end | Joint | Audit closeout |
| 5–7 | Second real audit (optional) | Joint | Audit closeout |
| 7 | Validation summary report delivered | Hawkeye | Report signed off |
| 7 | User survey + sponsor interview | Hawkeye | Results documented |
| 8 | Day-60 review meeting · go/no-go decision | Joint | Decision document signed |
| 8–9 | (If go) Commercial contract paperwork | Joint | Master Services Agreement signed |
| 8–9 | (If no-go) Data export + offboarding | Hawkeye | Export receipt signed |

**Effective Date:** `[YYYY-MM-DD]` · **Day 60:** `[YYYY-MM-DD]` (60 calendar days from Effective Date)

> ⚠️ **Slippage handling.** If a scheduled real audit is rescheduled by the Client for reasons outside Hawkeye's control, the PoC end date shifts by the slippage amount, up to a maximum 30-day extension. Further extensions require mutual written agreement.

---

## §6. Fees & Commercial Terms

### 6.1 PoC fees

**The PoC is provided at no cost to the Client.** No fees, setup charges, training fees, validation report fees, or other compensation are payable by the Client to Hawkeye during the PoC term.

### 6.2 What the Client provides at no cost

| Provision | Notes |
|---|---|
| Time of named PoC team | ~50 person-hours total estimated |
| Audit data for 1–2 real audits | Subject to §8 data-handling |
| Access to relevant IT contacts for SSO setup | Reasonable scheduling |
| Honest feedback at weekly checkpoints | In good faith |

### 6.3 Conversion pricing (if Client elects to convert)

If the Client converts to a paid contract within **14 calendar days** of the Day-60 review:

| Conversion benefit | Detail |
|---|---|
| Year-1 ACV per current commercial tier sheet | Selected tier (Starter / Growth / Enterprise) |
| First-renewal-locked pricing | Year-2 ACV ≤ Year-1 ACV + 5% |
| Free historical data migration | One-time, scope ≤ 40 engineering hours |
| Reference-status discount (opt-in) | 15% off Year-1 ACV in exchange for case-study participation after 6 months |

Conversion after Day 74 is at list pricing without conversion benefits.

---

## §7. Service Levels During PoC

| Metric | PoC service level |
|---|---|
| Platform uptime | ≥99.5% (calendar-monthly average, excluding scheduled maintenance) |
| Scheduled maintenance | ≤4 hours per week, weekdays before 06:00 IST or after 22:00 IST |
| Support response (Slack/Teams channel) | ≤24 business hours |
| Critical incident response (P1 — platform unreachable) | ≤4 business hours acknowledgement |
| Emergency hotline (during scheduled audit days only) | Phone number provided at kickoff |
| Backup/recovery | Daily snapshots · 7-day retention during PoC |

---

## §8. Data Handling, Security, Compliance

### 8.1 Data residency

| Region | Client elects at kickoff | Default |
|---|---|---|
| India (Mumbai) | Cloudflare R2 India region | ✅ |
| United States | Cloudflare R2 US-East | If elected |
| European Union | Cloudflare R2 EU | If elected |

### 8.2 Security posture

| Control | Implementation |
|---|---|
| Encryption in transit | TLS 1.3 |
| Encryption at rest | AES-256 |
| Tenant isolation | Multi-tenant with row-level isolation; logical separation enforced at application layer |
| Authentication | SAML 2.0 / OIDC SSO from Day 1; MFA enforceable |
| Authorization | RBAC at module + record level |
| Audit logging | Every user action logged with user · timestamp · reason · IP · session |
| Backups | Daily full snapshot · 7-day rolling retention during PoC |
| Vulnerability management | Dependabot + monthly scan; critical CVEs patched within 7 days |

### 8.3 Regulatory compliance — clause-level

| Standard | Hawkeye conformance |
|---|---|
| **GAMP 5 Category 4** (ISPE *GAMP 5 Guide, 2nd Edition*, Jul 2022) | Hawkeye is built and supplied as a Cat 4 configured product. Vendor SDLC evidence, IQ/OQ scripts, Functional Specification, Configuration Specification, security testing summary, periodic vendor audit pack — all included in the Validation Accelerator Package delivered to the Client at kickoff. |
| **21 CFR Part 11** — §11.10 (closed-system controls) | Validation per Cat 4; human-readable + electronic export; access limits via SSO/MFA/RBAC; tamper-evident time-stamped audit trail per §11.10(e) cannot be disabled by any user role; authority checks per §11.10(g). |
| **21 CFR Part 11** — §11.50 (signature manifestations) | Every signed record displays printed name + UTC date/time + meaning (review/approval/authorship/responsibility). |
| **21 CFR Part 11** — §11.70 (signature/record linking) | E-signature cryptographically linked to SHA-256 snapshot hash of the signed record. |
| **21 CFR Part 11** — §11.100 (general e-sig) | Each e-sig unique to one verified individual; never reassigned. |
| **21 CFR Part 11** — §11.200 (two distinct components) | Password + Reason required on every signing event; session-boundary rule enforced. |
| **21 CFR Part 11** — §11.300 (ID/password controls) | Password aging, complexity, lockout, audit log of failed attempts. |
| **EU GMP Annex 11** (2011 text + 7 Jul 2025 draft revision; new Annex 22 for AI expected 2026) | All 17 clauses addressed by design — including §3 supplier agreement, §4 lifecycle, §7 backup integrity, §9 audit-trail-with-reason, §11 periodic evaluation, §12 access control, §14 e-sig equivalence, §16 business continuity. |
| **MHRA ALCOA+** (Mar 2018) + **WHO TRS 1033 Annex 4** (2021) | All 9 attributes enforced by design: Attributable · Legible · Contemporaneous · Original · Accurate · Complete · Consistent · Enduring · Available. |
| **FDA CSA** (Final Sep 2025; re-issued 3 Feb 2026) | Validation Accelerator Package designed for vendor-evidence-leveraged customer assurance per the CSA risk-based framework. |
| **ICH Q7 / Q9 / Q10** | Templates and workflows aligned; full conformance certification path post-conversion. |
| **India DPDP Act 2023** (deadline 13 May 2027) | Data Processor obligations met; written agreement per §11 of DPDP Rules; breach notification; deletion on termination. |
| **EU GDPR** | Data Processing Agreement executed concurrently; EU residency option; Data Protection Officer contact channel. |
| **AI safety — FDA GMLP (Oct 2021) + EMA AI Reflection Paper (Sept 2024)** | Cite-or-fallback grounded generation; AI audit trail per output (model · version · prompt hash · retrieval set · confidence · user disposition); no model-training on Client Data without explicit written consent; prompt-injection defence at Layer 3 AI Gateway. |

### 8.4 Data export at PoC end

Within **7 business days** of PoC closure (regardless of go/no-go outcome), Hawkeye shall provide the Client with:
- All Client-uploaded documents in their original format
- All Client-created records as a CSV bundle + JSON bundle
- An audit-trail PDF export for every signed object (regulator-grade)
- A signed manifest of the export

The export package is delivered via SFTP or secure download link, retained for 30 days.

### 8.5 Data deletion at PoC end

If the Client elects no-go (per §11) and requests hard deletion in writing, Hawkeye shall hard-delete all Client data (including backups) within **30 calendar days** of the request and provide a signed certificate of deletion.

If the Client converts to paid (per §6.3), data remains in place and is migrated to the paid tenant.

---

## §9. Confidentiality & Intellectual Property

### 9.1 Confidentiality

A separate mutual Non-Disclosure Agreement ("NDA") is signed concurrent with this Agreement. The NDA governs all Confidential Information exchanged during the PoC. To the extent of conflict between this Agreement and the NDA, the NDA controls regarding confidentiality matters.

### 9.2 Customer data

All audit data, documents, findings, and other content uploaded or created by the Client during the PoC ("Customer Data") is and remains the sole property of the Client. Hawkeye claims no right, title, or interest in Customer Data.

### 9.3 Platform IP

The Platform (including software, AI models, workflows, templates, and documentation) is and remains the sole property of Hawkeye. No license is granted to the Client beyond use of the Platform during the PoC term.

### 9.4 Feedback

Feedback provided by the Client during the PoC may be incorporated by Hawkeye into the Platform without restriction or obligation, provided such incorporation does not disclose Customer Data or Client identity without written consent.

### 9.5 Case-study rights

Hawkeye may NOT publish a case study, customer logo, quote, or other marketing reference about the Client without the Client's prior written consent. Such consent is requested separately, post-conversion, as part of the reference-status discount option per §6.3.

---

## §10. Day-60 Review & Decision

### 10.1 Review meeting

A joint review meeting shall be held on or about Day 60 (the "Day-60 Review"). Required attendees:

| From the Client | From Hawkeye |
|---|---|
| Executive Sponsor (QA Head / Quality Director) | Founder / CEO |
| PoC Lead (QA Manager) | Customer Success Engineer assigned to PoC |
| Optional: IT/InfoSec representative | Optional: Pharma SME consultant |

### 10.2 Agenda (90 minutes)

1. Walk-through of all 6 success criteria (per §4) with data — 30 min
2. Open issues and risks identified during PoC — 15 min
3. Commercial conversion options if go (per §6.3) — 20 min
4. Decision: Go · Extend · No-Go — 15 min
5. Action items and signatures — 10 min

### 10.3 Decision document

The outcome of the Day-60 Review shall be captured in a one-page Decision Document signed by both parties, recording:
- Which success criteria were met / not met
- The decision: Go · Extend · No-Go
- Next-step ownership and dates

---

## §11. Termination & Exit

### 11.1 Termination for convenience

Either party may terminate this Agreement for any reason on 7 days' written notice. Upon such termination:
- No fees become payable
- §8.4 (data export) and §8.5 (data deletion) apply
- §9 (confidentiality and IP) survives

### 11.2 Termination for cause

Either party may terminate this Agreement immediately if the other party commits a material breach that is not cured within 7 days of written notice.

### 11.3 Survival

The following sections survive termination: §8.4, §8.5, §9, §13, §14.

---

## §12. Service Provider Obligations During PoC

Hawkeye agrees to:
1. Provide the Platform per §3 at no cost.
2. Provide named personnel per §3.6 at no cost.
3. Honor service levels per §7.
4. Deliver the validation summary report per §3.6 by Week 7.
5. Conduct the Day-60 Review per §10 in good faith.
6. Honor data handling obligations per §8.
7. NOT use Customer Data for AI training without prior written consent.
8. NOT sell, share, or transfer Customer Data to any third party.

---

## §13. Customer Obligations During PoC

The Client agrees to:
1. Designate the named team per §3.6 and Annex A.
2. Provide audit data per §3.3 in reasonable time for Week 3 kickoff of first audit.
3. Attend weekly checkpoints.
4. Provide honest, timely feedback.
5. Complete the end-of-PoC survey.
6. Attend the Day-60 Review.
7. NOT distribute, sublicense, or reverse-engineer the Platform.
8. NOT use the Platform for any production purpose beyond the scope of this PoC.
9. Maintain reasonable security on user credentials (no shared logins).

---

## §14. Standard Legal Terms

### 14.1 Independent contractors

The parties are independent contractors. Nothing in this Agreement creates a partnership, joint venture, agency, or employment relationship.

### 14.2 Limitation of liability

EACH PARTY'S TOTAL LIABILITY UNDER THIS AGREEMENT SHALL NOT EXCEED ₹1,00,000 (ONE LAKH RUPEES). NEITHER PARTY SHALL BE LIABLE FOR INDIRECT, INCIDENTAL, CONSEQUENTIAL, SPECIAL, OR PUNITIVE DAMAGES. This limitation does NOT apply to: (a) breach of confidentiality, (b) breach of data handling obligations per §8, or (c) gross negligence or willful misconduct.

### 14.3 Warranties

Each party represents that it has the authority to enter into this Agreement. Hawkeye warrants that the Platform will perform substantially as described in §3 and in the accompanying Proposal. Hawkeye disclaims all other warranties, express or implied, including merchantability and fitness for a particular purpose.

### 14.4 Indemnification

Hawkeye shall indemnify the Client against third-party IP infringement claims arising from use of the Platform per this Agreement. Client shall indemnify Hawkeye against claims arising from Customer Data or Client's misuse of the Platform.

### 14.5 Governing law & dispute resolution

This Agreement is governed by the laws of India. Disputes shall first be resolved by good-faith negotiation between the parties. If unresolved within 30 days, disputes shall be submitted to arbitration in Bengaluru per the Arbitration and Conciliation Act, 1996. Each party bears its own costs.

### 14.6 Notices

Notices shall be in writing and delivered via email with read receipt to:

| Party | Email |
|---|---|
| Client | `[CUSTOMER NOTICE EMAIL]` |
| Hawkeye | `[HAWKEYE LEGAL EMAIL]` (with copy to founder email) |

### 14.7 Entire agreement

This Agreement, together with the NDA and Data Processing Agreement executed concurrently, constitutes the entire agreement between the parties regarding the PoC and supersedes all prior discussions. Amendments must be in writing and signed by both parties.

---

## §15. Signatures

By signing below, each party agrees to be bound by the terms of this Agreement.

| For the Client | For Hawkeye |
|---|---|
| **Name:** `[CUSTOMER SIGNATORY NAME]` | **Name:** `[HAWKEYE SIGNATORY NAME]` |
| **Title:** `[CUSTOMER SIGNATORY TITLE]` | **Title:** Founder & CEO |
| **Signature:** ________________________ | **Signature:** ________________________ |
| **Date:** ____________________________ | **Date:** ____________________________ |

---

## Annex A — Named PoC Team

### A.1 Client team

| Role | Name | Email | Time commitment |
|---|---|---|---|
| Executive Sponsor | `[NAME]` | `[EMAIL]` | ~4 hrs over 60 days |
| PoC Lead | `[NAME]` | `[EMAIL]` | ~32 hrs over 60 days |
| Named user 1 | `[NAME]` | `[EMAIL]` | Audit days only |
| Named user 2 | `[NAME]` | `[EMAIL]` | Audit days only |
| Named user 3 | `[NAME]` | `[EMAIL]` | Audit days only |
| Named user 4 | `[NAME]` | `[EMAIL]` | Audit days only |
| Named user 5 | `[NAME]` | `[EMAIL]` | Audit days only |
| IT/InfoSec contact (SSO setup) | `[NAME]` | `[EMAIL]` | ~4 hrs (Week 1) |

### A.2 Hawkeye team

| Role | Name | Email | Time commitment |
|---|---|---|---|
| Founder Lead | `[FOUNDER NAME]` | `[FOUNDER EMAIL]` | Kickoff + Day-60 review |
| Customer Success Engineer | `[CS NAME]` | `[CS EMAIL]` | Weekly checkpoints + Slack |
| Pharma SME Consultant | `[SME NAME]` | `[SME EMAIL]` | 2 sessions (Week 2 · Week 7) |

---

## Annex B — Baseline Data for Success Criterion 1

To measure the ≥40% audit-prep time reduction (§4 Criterion 1), the Client shall provide the following baseline within 7 days of Effective Date:

| Baseline data | Method |
|---|---|
| Time spent on most recent comparable audit (hours, by role) | Self-report or timesheet extract |
| Number of QA personnel involved | Headcount |
| Tools used (list) | Free text |
| Major friction points (top 3) | Free text |

This baseline is the comparator against which the PoC audit will be measured.

---

## Annex C — Document Companion Set

This Agreement is delivered together with the following documents:

| Document | Purpose | Provided |
|---|---|---|
| Proposal (PDF) | Offer, rationale, commercial summary | ✅ |
| Implementation Plan (PDF) | Week-by-week schedule, RACI, risk register | ✅ |
| Pitch Deck (PDF) | Visual companion for executive walk-through | ✅ |
| **GAMP 5 Cat 4 — Customer Brief** (PDF) | 8-page summary: classification · vendor/customer split · accelerator package contents · validation estimate · FAQ | ✅ |
| **GAMP 5 Cat 4 Compliance Reference** (PDF, ~25 pages) | Canonical: V-model lifecycle · clause-by-clause cross-standard mapping · pre-filled VAQ · worked module example · FAQ · template library | ✅ at kickoff |
| Mutual NDA (separate document) | Confidentiality | ✅ |
| Data Processing Agreement (separate document) | GDPR / DPDP compliance | ✅ |
| ROI calculator (filled with Client's numbers) | Pricing rationale | ✅ |
| Architecture diagram (1-page) | InfoSec reference | ✅ |
| Pharma SME bio | Credibility | ✅ |

---

*Hawkeye Transact Pvt. Ltd. · Agreement HK-POC-AGR-`[YYYY-MM]`-`[NNN]` · `[EFFECTIVE DATE]` · Confidential*
