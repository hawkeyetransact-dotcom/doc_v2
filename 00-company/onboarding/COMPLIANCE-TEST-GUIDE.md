# Compliance Verification Test Guide

| Field | Value |
|---|---|
| Owner | Compliance · Pharma SME · Engineering |
| Status | v1.0 — 2026-06-08 |
| Audience | QA / Compliance team members · Pharma SME consultants · Engineers writing compliance OQ scripts · Internal auditors preparing for customer audits |
| Outcome | A repeatable, scripted protocol to verify that Hawkeye delivers what GAMP Cat 4, 21 CFR Part 11, EU GMP Annex 11, and MHRA ALCOA+ require — on a live tenant |
| Pairs with | [TEAM-ONBOARDING.md](./TEAM-ONBOARDING.md) (prerequisite for app access) · [GAMP-CAT-4-COMPLIANCE.md](../../08-compliance-regulatory/GAMP-CAT-4-COMPLIANCE.md) (canonical reference) · per-module URS files under [06-modules/](../../06-modules/) |

---

## 1. Purpose and intended use

This document gives the Hawkeye QA · Compliance · Pharma SME team a **repeatable verification protocol** to confirm that the Hawkeye platform actually delivers the compliance posture documented in our customer-facing artifacts. Use this guide to:

1. **Self-audit before a customer audit** — annual right-to-audit, periodic vendor audit (Annex 11 §3)
2. **Smoke-test a release** — every functional release should pass these scenarios before notification to customers
3. **Onboard a Pharma SME consultant** — give a new SME hire the verification tour so they can defend the platform to customers
4. **Prepare evidence for customer's OQ** — the scenarios here are the conceptual template behind the OQ scripts shipped in the Validation Accelerator Package

> ℹ️ **What this guide is NOT.** It is not the customer-side OQ. The customer-side OQ scripts live in the Validation Accelerator Package and are executed by the customer's validation team on the customer's own configured tenant. This guide is Hawkeye's internal verification protocol — broader in scope, lighter in formality.

---

## 2. Pre-requisites

Before you run any scenario:

| ✓ | Item |
|---|---|
| ☐ | Working app access (Sandbox tenant or local dev) per [TEAM-ONBOARDING.md](./TEAM-ONBOARDING.md) §3 or §4 |
| ☐ | At least two distinct user accounts available (Tenant Admin + one other persona) — for cross-persona tests |
| ☐ | A second browser profile or incognito window — for the same |
| ☐ | A small PDF file (1-2 pages) to use as evidence — e.g., any Hawkeye PDF from `Doc_V2/` |
| ☐ | A timer / stopwatch — for latency measurements |
| ☐ | (For tenant-isolation tests) A second Sandbox tenant (or two locally-seeded tenants) |
| ☐ | (For SHA-256 tests) `sha256sum` available in your terminal |

> 💡 **Test on a non-production environment.** All scenarios are non-destructive in design, but some intentionally trigger negative paths (try to bypass a gate · try to disable the audit trail · etc.). Run them on Sandbox or local — never on a customer tenant.

---

## 3. Scenarios by regulatory framework

The verification scenarios are grouped by framework. Each scenario has:

- **What to verify** — the regulatory clause it covers
- **Steps** — click-by-click
- **Expected outcome** — what you should see
- **What a failure means** — how seriously to treat a deviation

Numbering: **CT-`<framework>`-NNN** (Compliance Test).

---

## 4. 21 CFR Part 11 — Electronic Records & Signatures

### CT-P11-001 — §11.10(a) Validation evidence accessible

| Element | Detail |
|---|---|
| What to verify | The Validation Accelerator Package is delivered and accessible per GAMP Cat 4 supplier-leverage |
| Steps | (1) As Tenant Admin, navigate to Admin Console → Validation Package; (2) Confirm presence of Vendor Quality Manual, SDLC evidence, FRS, Configuration Spec template, IQ/OQ scripts, security testing summary, VAQ, Release Notes archive, Periodic Vendor Audit Pack |
| Expected | All 8+ artifacts listed and downloadable as PDFs; each artifact carries a version + UTC timestamp |
| Failure interpretation | Missing artifact = product non-conformance with our GAMP Cat 4 commitment per PDR-002. Escalate to Compliance Lead immediately. |

### CT-P11-002 — §11.10(b) Human-readable + electronic export

| Element | Detail |
|---|---|
| What to verify | Every signed record can be exported in human-readable AND electronic formats for inspection |
| Steps | (1) Open any signed audit record; (2) Click Export → choose PDF; (3) Open the PDF; (4) Repeat with CSV and JSON exports |
| Expected | PDF is audit-trail-grade (includes e-sig manifest, all metadata, audit-trail rows); CSV contains all tabular data; JSON is well-formed and complete |
| Failure interpretation | Missing fields in any export = data-integrity risk. Compare exports against the on-screen record; flag every divergence. |

### CT-P11-003 — §11.10(d) Limit access to authorized individuals

| Element | Detail |
|---|---|
| What to verify | Only authenticated users can access records; role-based access enforced at module + record level |
| Steps | (1) Logout; (2) Try to access `/audits/<some-id>` directly via URL; (3) Observe redirect to `/auth/login`; (4) Log in as a low-privilege role (e.g., Operations); (5) Try to access an audit not assigned to that role |
| Expected | Step 3 redirects to login; Step 5 shows access-denied OR record not in list (not just hidden in UI but enforced at API) |
| Failure interpretation | Any record visible to an unauthorized role = critical security issue. Stop testing, escalate to Engineering Lead AND Compliance Lead. |

### CT-P11-004 — §11.10(e) Audit trail captured per state change

| Element | Detail |
|---|---|
| What to verify | Every state change writes an audit-trail row capturing user · UTC · action · before/after · IP · session · reason |
| Steps | (1) As QA Manager, create a new audit (action 1); (2) Upload one evidence file (action 2); (3) Modify the audit description (action 3); (4) Open the Audit Trail tab; (5) Count rows from the audit creation forward |
| Expected | Exactly 3 audit-trail rows for the 3 actions, in chronological UTC order; each row shows: user identity, UTC timestamp, IP, session ID, action type, before/after, reason |
| Failure interpretation | Missing rows = audit trail not capturing all events. Critical Part 11 §11.10(e) failure. Stop, escalate. |

### CT-P11-005 — §11.10(e) Audit trail cannot be disabled

| Element | Detail |
|---|---|
| What to verify | No role, no configuration, no admin path can disable the audit trail (architectural guarantee) |
| Steps | (1) As Tenant Admin, look in Admin Console for any "audit logging" or "telemetry" toggle; (2) Try to find a way to disable it via API (check the OpenAPI spec); (3) Optionally, attempt to delete an audit-trail row via direct Mongo query (engineers only, local environment) |
| Expected | Step 1: no toggle exists. Step 2: no API endpoint for disable. Step 3: Mongo write fails OR succeeds but the application's tamper-evidence check detects the discrepancy on next read |
| Failure interpretation | If you find an admin toggle that disables audit logging, that's a P0 architectural break per ADR-001 + UN 100 of audit-management/UNS.md. |

### CT-P11-006 — §11.50 Signature manifestation

| Element | Detail |
|---|---|
| What to verify | Every signed record displays printed name + UTC + meaning |
| Steps | (1) Open a signed finding; (2) Locate the signature manifest section; (3) Verify: printed name of signer (not just userId), UTC date+time, meaning (Review / Approval / Authorship / Responsibility), visible to a reader |
| Expected | All three elements present and human-readable both on screen AND in PDF export |
| Failure interpretation | Missing any of the three = §11.50 non-conformance. Likely UI bug if rendering issue, or data-model bug if data missing. |

### CT-P11-007 — §11.50 Meaning selectable + meaningful

| Element | Detail |
|---|---|
| What to verify | The signer must explicitly choose the meaning of the signature |
| Steps | (1) Initiate a signature ceremony on any record; (2) Observe the meaning dropdown options; (3) Try to submit without selecting a meaning |
| Expected | Dropdown options include at least: Review, Approval, Authorship, Responsibility. Submission blocked if meaning empty. |
| Failure interpretation | Hard-coded meaning (e.g., always "Approval") = §11.50(a)(3) non-conformance. |

### CT-P11-008 — §11.70 Signature/record linking via SHA-256

| Element | Detail |
|---|---|
| What to verify | E-signature is cryptographically linked to the record snapshot; modification invalidates the signature |
| Steps | (1) Sign a record; (2) Note the record-snapshot-hash visible on the signature manifest; (3) Engineers: modify the underlying Mongo record directly (e.g., change a field via `db.findings.updateOne(...)`); (4) Refresh the record in the UI; (5) Open the signature manifest |
| Expected | Step 5: signature shows "INVALIDATED — record modified since signature" OR similar tamper-detection indicator. The record is still readable but the signature is no longer valid. |
| Failure interpretation | If modifying the underlying data does NOT invalidate the signature, the §11.70 linking is broken. Critical. |

### CT-P11-009 — §11.100 Unique to one individual

| Element | Detail |
|---|---|
| What to verify | Each signature account is unique; no shared accounts permitted |
| Steps | (1) As Tenant Admin, try to create a second user with the same email as an existing user; (2) Try to provision a user with a generic email like "qa1@..." |
| Expected | Step 1: rejected with "User already exists" error. Step 2: technically allowed (we don't block "shared-sounding" emails) but the IT Compliance customer-side policy should catch this. |
| Failure interpretation | Email-uniqueness must be enforced; shared accounts are a §11.100 violation. The "qa1@..." case is acceptable platform behavior — the customer's policy is responsible. |

### CT-P11-010 — §11.200 Two distinct components

| Element | Detail |
|---|---|
| What to verify | Non-biometric e-sig uses at least two distinct components (password + reason); session-boundary rule enforced |
| Steps | (1) Initiate a signature ceremony — observe the form requires Password AND Reason; (2) Submit; (3) Within the same continuous session (within 5 minutes), initiate a second signature — observe whether both components are re-prompted or just one (per §11.200(a)(2), subsequent in-session can use one); (4) Wait > 30 minutes (session timeout); (5) Try to sign again — both components should be re-prompted |
| Expected | Step 1: both Password + Reason required. Step 3: depends on the platform's session-boundary configuration (currently both required per tenant policy). Step 5: both required. |
| Failure interpretation | If a fresh session does NOT re-prompt both components, that's a §11.200(a)(2) violation. |

### CT-P11-011 — §11.300 Account lockout on failed attempts

| Element | Detail |
|---|---|
| What to verify | Failed-login attempts logged; lockout after threshold; alerting |
| Steps | (1) From a fresh browser, attempt to log in with wrong password 5 times; (2) Observe lockout message; (3) Check Admin → Audit Log for the failed-attempt records |
| Expected | After 5 attempts (default), account locked for 30 min OR until admin unlock; failed-attempt audit log shows source IP and timestamp for each attempt |
| Failure interpretation | If account is not locked after threshold = brute-force exposure. If failed attempts are not logged = §11.300 + §11.10(e) non-conformance. |

---

## 5. EU GMP Annex 11 — Computerised Systems

### CT-A11-001 — §3 Supplier agreement + right to audit

| Element | Detail |
|---|---|
| What to verify | DPA is signed; right-to-audit clause exists in DPA; Vendor Assessment Questionnaire is available |
| Steps | (1) As Tenant Admin, navigate to Admin Console → Legal & Compliance → Documents; (2) Confirm presence of: signed DPA, executed NDA, current Validation Accelerator Package version |
| Expected | All three documents present and downloadable; right-to-audit clause locatable in DPA |
| Failure interpretation | Missing DPA = Annex 11 §3 non-conformance for the customer. Hawkeye must remediate before next contract. |

### CT-A11-002 — §7 Backup integrity + restore tests

| Element | Detail |
|---|---|
| What to verify | Backups are taken; periodic restore tests are executed and documented |
| Steps | (1) As Tenant Admin, navigate to Admin Console → Operations → Backup History; (2) Confirm most recent monthly restore-test report is present and signed |
| Expected | Most recent restore-test report dated within the last 35 days; signed by Engineering Lead or Founder Lead |
| Failure interpretation | Missing or stale restore-test report = §7 non-conformance. Operational gap; escalate to Engineering Lead. |

### CT-A11-003 — §9 Audit trail captures REASON for change

| Element | Detail |
|---|---|
| What to verify | Annex 11 §9 specifically requires the audit trail to capture the REASON for any change or deletion — beyond what Part 11 §11.10(e) requires |
| Steps | (1) Modify any record (e.g., change finding severity from Minor to Major); (2) Observe the "Reason for change" field — should be mandatory; (3) Open the Audit Trail row for that modification; (4) Confirm the reason text is captured |
| Expected | Step 2: reason field cannot be skipped (UI blocks submission if empty). Step 4: reason text visible in audit-trail row. |
| Failure interpretation | If reason can be skipped = §9 non-conformance. The most common Annex 11 inspection finding — must work. |

### CT-A11-004 — §11 Periodic evaluation inputs available

| Element | Detail |
|---|---|
| What to verify | Customer can perform periodic evaluation per §11 using Hawkeye-supplied inputs |
| Steps | (1) Admin Console → Reports → Periodic Evaluation Report; (2) Generate report for last quarter; (3) Confirm report contains: validation status, deviation log summary, change log, security incidents, configuration drift, backup test outcomes |
| Expected | Report generates within 60 seconds; contains all 6 input categories |
| Failure interpretation | Missing input = customer cannot execute §11 periodic review properly. Compliance gap. |

### CT-A11-005 — §12 Security: SSO + MFA + RBAC + provisioning log

| Element | Detail |
|---|---|
| What to verify | All four security controls operational |
| Steps | (1) Verify SSO configured (Admin → Users → SSO Settings); (2) Try logging in via SSO with an IdP test account; (3) Verify MFA prompted (depending on tenant policy); (4) Verify RBAC: as low-privilege user, confirm absence of admin features; (5) Verify provisioning audit log captures every user creation/role change |
| Expected | All four operate as designed; log is queryable and exportable |
| Failure interpretation | Any one failing = §12 non-conformance. RBAC gaps are particularly serious. |

### CT-A11-006 — §14 E-signature equivalence per §11.50 + §11.200

| Element | Detail |
|---|---|
| What to verify | Annex 11 §14 cross-references the e-sig requirements; pass-through verification covered by CT-P11-006 through CT-P11-010 |
| Steps | Re-run CT-P11-006, CT-P11-007, CT-P11-008, CT-P11-010 |
| Expected | All pass |
| Failure interpretation | Inherit from CT-P11 outcomes |

### CT-A11-007 — §15 Audit-trail review as batch-release gate

| Element | Detail |
|---|---|
| What to verify | Annex 11 §15 requires the audit trail to be reviewed as part of batch release; Hawkeye enforces this as a hard gate |
| Steps | (1) Open any batch record (or audit, in the absence of batch); (2) Attempt to click "Release" without reviewing the audit trail; (3) Observe block; (4) Click "Review Audit Trail" → render trail → e-sign as Reviewed; (5) Now click "Release" |
| Expected | Step 3: block message visible; Step 5: works |
| Failure interpretation | If release is possible without prior audit-trail review = §15 non-conformance and one of the top 4 FDA 483 themes (per [POC-PITCH-DECK.md slide 6](../../09-sales-marketing/pitch-materials/POC-PITCH-DECK.md)) |

### CT-A11-008 — §16 Business continuity + DR runbook

| Element | Detail |
|---|---|
| What to verify | DR runbook exists; quarterly DR drill executed |
| Steps | (1) Admin Console → Operations → DR Runbook; (2) Verify runbook present and dated within the last 12 months; (3) Verify last drill report dated within the last 95 days |
| Expected | Both present |
| Failure interpretation | Missing or stale = §16 non-conformance |

---

## 6. MHRA / WHO ALCOA+ — 9 attributes

For each attribute, the verification is brief — the substantive enforcement was tested in §4 and §5.

### CT-ALCOA-A — **Attributable**

| Verify | Open any audit-trail row; confirm presence of unique user identifier; confirm no shared-account markers (`anonymous`, `system` only used for automated jobs which is acceptable) |
| Pass | Every user-initiated action attributable to a named user account |

### CT-ALCOA-L — **Legible**

| Verify | Export any signed record as PDF; open in any PDF reader; confirm all text is human-readable |
| Pass | PDF renders, all fields present and readable |

### CT-ALCOA-C — **Contemporaneous**

| Verify | Perform an action; immediately note your local time; open the resulting audit-trail row; compare UTC timestamp against your local time (converted) |
| Pass | UTC timestamp within ±5 seconds of action moment; no back-dating possible (try to submit a record with a future UTC — should be rejected) |

### CT-ALCOA-O — **Original**

| Verify | Create a record; modify it; verify both versions accessible via version history; verify original cannot be deleted, only superseded |
| Pass | Version history visible; original preserved |

### CT-ALCOA-A — **Accurate** (second A)

| Verify | Run any workflow with a validation gate (e.g., severity required before signing); attempt to bypass — should be blocked |
| Pass | Validation gates enforce semantic accuracy |

### CT-ALCOA-COMPLETE — **Complete**

| Verify | Inspect a sample audit-trail row for an AI-assisted action; verify the row captures: not just the outcome but the input context, the retrieval set, and the user disposition |
| Pass | Full action context visible |

### CT-ALCOA-CONSISTENT — **Consistent**

| Verify | Inspect timestamps across a multi-step workflow; verify sequential ordering; verify schema consistency (e.g., severity field uses same enum across modules) |
| Pass | Sequential + consistent |

### CT-ALCOA-E — **Enduring**

| Verify | Open a record's signature manifest; verify the SHA-256 hash captured at signing matches recomputed hash on read |
| Pass | Hash matches; tamper-evidence intact |

### CT-ALCOA-AVAILABLE — **Available**

| Verify | Trigger data export at the tenant level; verify completion within stated SLA (7 business days for production; on-demand for Sandbox) |
| Pass | Export completes; package includes PDF + CSV + JSON + signed manifest |

---

## 7. AI safety verification

### CT-AI-001 — Cite-or-fallback non-configurable (ADR-003)

| Element | Detail |
|---|---|
| What to verify | Architectural guarantee that every AI output cites a source OR returns the fallback string — cannot be configured away |
| Steps | (1) Open AskHawk; (2) Ask a question with a clear answer in the regulatory corpus (e.g., "What does 21 CFR Part 11 §11.50 require?") — should return cited answer; (3) Ask a question with NO grounding source (e.g., "What is my favorite color?") — should return "Insufficient evidence — human input required"; (4) Try every admin setting you can find to "make AI more helpful" — verify no setting exists that allows ungrounded output |
| Expected | Step 2: citations + confidence visible. Step 3: fallback string returned, not a fabricated answer. Step 4: no such admin setting exists. |
| Failure interpretation | If the AI ever produces an answer with no citation when retrieval failed, that's a P0 architectural break per ADR-003. Stop, escalate to Engineering Lead AND Founder Lead immediately. |

### CT-AI-002 — AI Audit Trail capture per call

| Element | Detail |
|---|---|
| What to verify | Every AI call writes an AI Audit Trail row with model · version · prompt hash · retrieval set · confidence · user disposition |
| Steps | (1) Invoke an AI-assisted action (e.g., AI-Draft Finding); (2) After completion, navigate to Admin Console → AI Audit Trail; (3) Locate the row for your call; (4) Verify all six fields present |
| Expected | All fields captured; prompt hash is a SHA-256 (64 hex chars); retrieval set lists source document IDs and their content hashes |
| Failure interpretation | Missing field = AI Audit Trail incomplete; affects GMLP Principle 10 (monitoring deployed models) + AI defensibility to regulators |

### CT-AI-003 — Tenant isolation in AI calls

| Element | Detail |
|---|---|
| What to verify | An AI call from tenant A cannot retrieve sources from tenant B |
| Steps | (1) Create two tenants (Sandbox: two signup emails; local: two seeded tenants); (2) In tenant A, upload a distinctive document (e.g., "Project Falcon SOP — confidential"); (3) Switch to tenant B; (4) Invoke AskHawk asking about "Project Falcon"; (5) Observe response |
| Expected | Tenant B's AskHawk returns "Insufficient evidence" (no cross-tenant retrieval); never returns content from tenant A's document |
| Failure interpretation | If tenant B sees ANY content from tenant A, that's a P0 cross-tenant data leak. Stop, escalate immediately. |

### CT-AI-004 — Customer data not used for training (contractual + technical)

| Element | Detail |
|---|---|
| What to verify | The vendor configuration at each LLM provider has training opt-out enabled |
| Steps | (1) Engineering Lead: confirm via vendor admin consoles (Anthropic · OpenAI · Gemini) that the Hawkeye production API keys have training opt-out enabled; (2) Verify the no-training contractual position is documented in the DPA template |
| Expected | Both confirmed |
| Failure interpretation | If training opt-out is NOT configured at vendor level, that's a breach of contractual position. Remediate same day. |

### CT-AI-005 — Human always commits the record

| Element | Detail |
|---|---|
| What to verify | No AI workflow can commit a record state change without a human e-signature |
| Steps | (1) Look for any "auto-sign", "auto-approve", "AI agent action" admin setting; (2) Inspect the AI Gateway code to confirm no path bypasses the workflow layer; (3) Try to find an API endpoint that allows an AI agent to e-sign on behalf of a user |
| Expected | Step 1: no such setting; Step 2: no such code path; Step 3: no such endpoint |
| Failure interpretation | If AI can commit a record without human, that breaks ADR-003 + UN 60 of audit-management/UNS.md. P0 escalation. |

---

## 8. Tenant isolation verification (cross-cutting security)

### CT-ISO-001 — Cross-tenant data leak attempt (READ)

| Element | Detail |
|---|---|
| What to verify | Tenant A user cannot READ tenant B records |
| Steps | (1) Two tenants seeded (per CT-AI-003); (2) As tenant A admin, note an audit record ID in tenant A (e.g., `audit_abc123`); (3) Log in as tenant B admin; (4) Attempt to access `/audits/abc123` directly via URL; (5) Attempt via API: `GET /api/audits/abc123` with tenant B's JWT |
| Expected | Step 4: redirected to tenant B's dashboard with "Record not found". Step 5: API returns 404 (NOT 403 — we don't even confirm record exists) |
| Failure interpretation | If tenant B can READ tenant A's record by ID, that's a P0 cross-tenant leak. |

### CT-ISO-002 — Cross-tenant data leak attempt (WRITE)

| Element | Detail |
|---|---|
| What to verify | Tenant A user cannot WRITE to tenant B records |
| Steps | (1) Same setup; (2) As tenant B, attempt to POST a modification to `audit_abc123` (a tenant A record) |
| Expected | API returns 404 |
| Failure interpretation | If write succeeds, P0 leak |

### CT-ISO-003 — Cross-tenant SEARCH leak

| Element | Detail |
|---|---|
| What to verify | Tenant A's records do not appear in tenant B's search results |
| Steps | (1) Upload a distinctively-named record in tenant A; (2) Switch to tenant B; (3) Search for the distinctive name in all modules |
| Expected | Zero hits in tenant B |
| Failure interpretation | Any hit = leak |

---

## 9. Data lifecycle verification

### CT-LIFE-001 — Export at PoC end

| Element | Detail |
|---|---|
| What to verify | Tenant admin can trigger full data export |
| Steps | (1) Admin Console → Data → Request Export; (2) Confirm export job initiated; (3) When complete, download package |
| Expected | Package contains: PDF (audit-trail-grade) + CSV (raw) + JSON (programmatic) + signed manifest |
| Failure interpretation | Missing format = §8.4 of GAMP-CAT-4-COMPLIANCE.md non-conformance |

### CT-LIFE-002 — Hard-delete with certificate

| Element | Detail |
|---|---|
| What to verify | Customer-requested hard-delete completes within 30 days; certificate provided |
| Steps | (Test environment only — never run on customer tenant) (1) Initiate hard-delete on a test tenant; (2) Observe 30-day countdown; (3) Verify backup deletion scheduled; (4) Observe certificate-of-deletion template |
| Expected | Process documented; certificate template signed by Founder Lead at completion |
| Failure interpretation | Missing capability = DPDP/GDPR non-conformance |

---

## 10. Test report template

After running a verification session, file a report. Suggested template:

```markdown
# Compliance Verification Report — [Date]

| Field | Value |
|---|---|
| Tester | [Name] |
| Date | [YYYY-MM-DD] |
| Environment | Sandbox · Local Dev · Staging (which) |
| Hawkeye version | [release tag — e.g., v0.45.2] |
| Scenarios run | [list IDs — e.g., CT-P11-001 through CT-P11-011] |

## Summary
| Framework | Total | Pass | Fail |
|---|---|---|---|
| Part 11 | 11 | 11 | 0 |
| Annex 11 | 8 | 8 | 0 |
| ALCOA+ | 9 | 9 | 0 |
| AI safety | 5 | 5 | 0 |
| Tenant isolation | 3 | 3 | 0 |
| Data lifecycle | 2 | 2 | 0 |
| **Total** | **38** | **38** | **0** |

## Failures (if any)
| Scenario | Expected | Actual | Severity | Owner |
|---|---|---|---|---|

## Observations & follow-up
...
```

File reports in: `Doc_V2/00-company/onboarding/verification-reports/<YYYY-MM-DD>-<tester-initials>.md` (create the folder when filing the first one).

---

## 11. Cadence — when to run this guide

| Trigger | Scope |
|---|---|
| New QA / Compliance / Pharma SME hire | Full run (~3-4 hours) within first week |
| Functional release (Major or Minor) | All scenarios marked affected by the release per Release Notes |
| Security patch | CT-A11-005 + CT-ISO-001 through 003 |
| Pre-customer PoC kickoff | Spot-check of CT-P11-006, CT-P11-008, CT-A11-007 (the high-visibility ones) |
| Quarterly self-audit | Full run |
| Annual Periodic Vendor Audit prep | Full run + report archived for the customer audit pack |
| After any P1/P2 incident | Targeted run on the affected area |

---

## 12. When you find a failure

> ⚠️ **Treat every compliance-verification failure as P1 until proven otherwise.** The downstream cost is regulatory exposure to the customer, not just an internal bug.

| Step | Action |
|---|---|
| 1 | Capture screenshots / network logs / Mongo state immediately |
| 2 | Open a P1 issue in the engineering tracker labeled `compliance-verification-failure` |
| 3 | Notify the Founder Lead AND Engineering Lead AND Compliance Lead by direct message — same day |
| 4 | If the failure affects a live customer tenant (not Sandbox), see incident-response process; we may need to notify the customer within 72 hours per the DPA breach-notification clause |
| 5 | Do NOT continue testing other scenarios until the root cause is at least scoped |

---

## 13. See also

- [TEAM-ONBOARDING.md](./TEAM-ONBOARDING.md) — get app access first
- [GAMP-CAT-4-COMPLIANCE.md](../../08-compliance-regulatory/GAMP-CAT-4-COMPLIANCE.md) — canonical reference (~25 pages); Part 6 (cross-standard mapping) is the source for the scenarios in §4-§6 here
- [ADR-001](../../04-engineering/08-adrs/ADR-001-five-layer-architecture.md) — Trust as Layer 1 (foundation)
- [ADR-002](../../04-engineering/08-adrs/ADR-002-multi-llm-gateway.md) — Multi-LLM Gateway pattern
- [ADR-003](../../04-engineering/08-adrs/ADR-003-cite-or-fallback.md) — Cite-or-fallback guarantee
- [UNS.md (Audit Management)](../../06-modules/audit-management/UNS.md) — 150 user needs; many are verified by scenarios here
- [POC-PITCH-DECK.md slide 6](../../09-sales-marketing/pitch-materials/POC-PITCH-DECK.md) — top FDA-483 themes addressed by design
- [VISION.md §4d](../../01-strategy/vision-and-positioning/VISION.md) — the two architectural guarantees that cannot be configured away

---

*Doc_V2 · Company · Onboarding · Compliance Verification Test Guide v1.0 · 2026-06-08*
