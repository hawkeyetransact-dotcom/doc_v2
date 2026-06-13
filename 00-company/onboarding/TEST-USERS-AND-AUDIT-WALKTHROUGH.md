# Test Users + Audit Module Walkthrough

| Field | Value |
|---|---|
| Owner | Engineering · QA |
| Status | v1.0 — 2026-06-08 |
| Audience | S.M.A.R.T. Hawk Developers and QA testing the deployed Audit Management module |
| Outcome | In 60 minutes, you've logged in as 5 different personas, played out a complete audit lifecycle, and seen every step work end-to-end |
| Pairs with | [TEAM-ONBOARDING.md](./TEAM-ONBOARDING.md) (deeper setup if you need local dev) · [COMPLIANCE-TEST-GUIDE.md](./COMPLIANCE-TEST-GUIDE.md) (deeper verification if you're QA) |

---

## How this works

You don't need to install anything. You don't need a local environment. You don't need to create accounts.

**Just open the deployed URL in your browser, copy any email + password from the table below, and log in.** Then follow the story.

> 🌐 **The deployed URL:** `[DEPLOYED URL — fill in: e.g., https://app.hawkeye.io]`

The story below has 7 acts. Each act tells you which user to log in as, exactly what to click, and what you should see. You'll log out and log back in as different people — that's the point. **Each persona sees a different view of the same audit.**

After the story, there are quick-reference cards for each persona so you can come back and explore any one in depth.

Total time: about 60 minutes for the full story. About 10 minutes if you just want to see one persona's view.

---

## 1. The complete test-user matrix

> 💡 **All passwords are identical: `Testing@2022`** — this is intentional for shared team testing on a non-production environment. Never use this pattern anywhere real.

> ℹ️ **Email domain:** `@test.com`. These are not real email addresses — they exist only inside the S.M.A.R.T. Hawk database for testing.

### 1.1 Buyer organisations (5 tenants × 3 users each = 15 users)

> Think of each buyer as a pharmaceutical company that buys from contract manufacturers. They run audits on their suppliers.

| Tenant | Login email | Layman role | What this person does |
|---|---|---|---|
| **Buyer Pharma 1** | `buyer1@test.com` | QA Head | Receives supplier audits, signs off findings, owns the audit programme |
| Buyer Pharma 1 | `buyer1-internal-auditor-a@test.com` | Internal Auditor A | Conducts internal audits of Buyer Pharma 1's own quality system |
| Buyer Pharma 1 | `buyer1-internal-auditor-b@test.com` | Internal Auditor B | Second internal auditor — provides cross-check, backup, segregation of duties |
| **Buyer Pharma 2** | `buyer2@test.com` | QA Head | Same as Buyer 1, different company |
| Buyer Pharma 2 | `buyer2-internal-auditor-a@test.com` | Internal Auditor A | |
| Buyer Pharma 2 | `buyer2-internal-auditor-b@test.com` | Internal Auditor B | |
| **Buyer Pharma 3** | `buyer3@test.com` | QA Head | |
| Buyer Pharma 3 | `buyer3-internal-auditor-a@test.com` | Internal Auditor A | |
| Buyer Pharma 3 | `buyer3-internal-auditor-b@test.com` | Internal Auditor B | |
| **Buyer Pharma 4** | `buyer4@test.com` | QA Head | |
| Buyer Pharma 4 | `buyer4-internal-auditor-a@test.com` | Internal Auditor A | |
| Buyer Pharma 4 | `buyer4-internal-auditor-b@test.com` | Internal Auditor B | |
| **Buyer Pharma 5** | `buyer5@test.com` | QA Head | |
| Buyer Pharma 5 | `buyer5-internal-auditor-a@test.com` | Internal Auditor A | |
| Buyer Pharma 5 | `buyer5-internal-auditor-b@test.com` | Internal Auditor B | |

### 1.2 Supplier organisations (5 tenants × 2 users each = 10 users)

> Think of each supplier as a contract manufacturer (CDMO). They make products for the buyers, and they respond to buyer audits.

| Tenant | Login email | Layman role | What this person does |
|---|---|---|---|
| **Supplier CDMO 1** | `supplier1@test.com` | Supplier QA Head | Receives audit requests from buyers, assigns work to team, signs responses |
| Supplier CDMO 1 | `supplier_user1@test.com` | Supplier QA Team Member | Uploads evidence (SOPs, training records, equipment qualification) for the audit |
| **Supplier CDMO 2** | `supplier2@test.com` | Supplier QA Head | |
| Supplier CDMO 2 | `supplier_user2@test.com` | Supplier QA Team Member | |
| **Supplier CDMO 3** | `supplier3@test.com` | Supplier QA Head | |
| Supplier CDMO 3 | `supplier_user3@test.com` | Supplier QA Team Member | |
| **Supplier CDMO 4** | `supplier4@test.com` | Supplier QA Head | |
| Supplier CDMO 4 | `supplier_user4@test.com` | Supplier QA Team Member | |
| **Supplier CDMO 5** | `supplier5@test.com` | Supplier QA Head | |
| Supplier CDMO 5 | `supplier_user5@test.com` | Supplier QA Team Member | |

### 1.3 External Auditor organisations (5 tenants × 1 user each = 5 users)

> Think of each external auditor as an independent third-party audit firm. They can be invited into a buyer's audit to provide neutral assessment.

| Tenant | Login email | Layman role | What this person does |
|---|---|---|---|
| **External Auditor Firm 1** | `auditor1@test.com` | Independent Auditor | Conducts third-party audits when invited by buyers |
| **External Auditor Firm 2** | `auditor2@test.com` | Independent Auditor | |
| **External Auditor Firm 3** | `auditor3@test.com` | Independent Auditor | |
| **External Auditor Firm 4** | `auditor4@test.com` | Independent Auditor | |
| **External Auditor Firm 5** | `auditor5@test.com` | Independent Auditor | |

### 1.4 S.M.A.R.T. Hawk platform admin (1 user)

> Think of this as the S.M.A.R.T. Hawk team's superadmin account — sees across all tenants. Use sparingly.

| Login email | Layman role | What this person does |
|---|---|---|
| `hawkeye-admin@test.com` | S.M.A.R.T. Hawk Superadmin | Cross-tenant platform administration (for S.M.A.R.T. Hawk team use only) |

### 1.5 Totals

| Category | Tenants | Users |
|---|---|---|
| Buyer | 5 | 15 (1 QA Head + 2 Internal Auditors per buyer) |
| Supplier | 5 | 10 (1 QA Head + 1 Team Member per supplier) |
| External Auditor | 5 | 5 |
| Platform | — | 1 |
| **Total** | **15 tenants** | **31 users** |

---

## 2. How these users got created (one-time, for the team's reference)

If you're setting up a fresh deployment OR a fresh local Mongo, run these once:

```bash
cd backend
npm run seed:persona-users        # creates 30 of the 31 users (buyer, supplier, auditor, superadmin)
npm run seed:internal-auditors    # creates the remaining 10 internal auditor users
```

Both scripts are **idempotent** — safe to re-run; they update existing users and create missing ones without duplicating anything.

Once that's done, every email + password in §1 is live and ready to log into. You don't need to run them again unless the database was reset.

> 🔧 **For S.M.A.R.T. Hawk Engineering only.** If you want fewer or more sets (e.g., 3 buyers instead of 5), set `SEED_PERSONA_COUNT=3` before running. Default is 5.

---

## 3. The 60-minute guided story

> 💡 **What this is.** A complete supplier-audit lifecycle told as a 7-act play. Each act tells you which user to log in as, exactly what to click, and what you should see. Log out and log back in as you go.
>
> **The plot:** Buyer Pharma 1 is going to audit Supplier CDMO 1. Internal Auditor A reviews. External Auditor 1 is brought in for an extra opinion. Internal Auditor B does a final cross-check. The audit closes. Done.

> ⏱️ **Save your progress.** If you need to stop mid-story, write down which act you finished. Each act takes about 8-10 minutes. You can resume by logging in as the next persona.

### 🎬 Act 1 — Buyer Pharma 1 starts the audit

**Log in as:** `buyer1@test.com` · password `Testing@2022`

You are the QA Head at Buyer Pharma 1. You need to audit one of your suppliers — Supplier CDMO 1.

| Step | Click | What you should see |
|---|---|---|
| 1 | Land on the dashboard | Some sample data; left sidebar with module links |
| 2 | Click **Audit Management** in the left sidebar | List of existing audits (may be empty if this is the first run) |
| 3 | Click **+ New Audit** (or "Create Audit") | New-audit form |
| 4 | Fill in: Name = "Q3 Audit of Supplier CDMO 1" · Type = Supplier audit · Supplier = Supplier 1 · Standard = ICH Q7 · Due date = 30 days from today | Form ready to submit |
| 5 | Click **Save** or **Create** | You land on the new audit's detail page; current state is "Draft" |
| 6 | Look at the top — find the **phase stepper** | A bar showing 5 phases: Plan → Prep → On-Site → Closeout → Closed. "Plan" is highlighted. |
| 7 | Click **Send to Supplier** | Confirmation dialog asks if you're sure |
| 8 | Confirm | Audit phase moves to "Prep"; an email is queued to Supplier CDMO 1 |
| 9 | Log out (top-right menu → Sign out) | Back to login page |

> 🔍 **Behind the scenes (for Devs/QA).** Three things happened: (a) a new `AuditRequest` document was created in Mongo with `tenantId = buyer-01._id`; (b) an `auditEvent` row was written to the audit trail capturing who/when/IP; (c) a notification event was emitted for delivery to the supplier. Open Admin Console → Audit Log to confirm.

---

### 🎬 Act 2 — Supplier CDMO 1 receives the request and assigns work

**Log in as:** `supplier1@test.com` · password `Testing@2022`

You are the QA Head at Supplier CDMO 1. You just received an audit request from Buyer Pharma 1.

| Step | Click | What you should see |
|---|---|---|
| 1 | Land on the dashboard | You should see a notification — "1 new audit request" |
| 2 | Click the notification (or open Audit Management from sidebar) | The Q3 Audit of Supplier CDMO 1 audit appears, marked as "Received" or "Action Required" |
| 3 | Open the audit | Audit detail page from the supplier side — you can see the buyer's questionnaire / required evidence list |
| 4 | Look at **Sections** or **Questionnaire** tab | List of audit sections (e.g., "Quality System", "Manufacturing", "Documentation", "Training") |
| 5 | For one section, click **Assign** | Dropdown of your team members |
| 6 | Assign that section to `supplier_user1@test.com` | Confirmation; assignee notified |
| 7 | Log out | |

> 🔍 **Behind the scenes.** Same audit document, different tenant view. Supplier-side controllers serve only what's been shared from the buyer + what the supplier owns. Cross-tenant data NOT leaking is the key property — you couldn't accidentally see another buyer's audits.

---

### 🎬 Act 3 — Supplier team member uploads evidence

**Log in as:** `supplier_user1@test.com` · password `Testing@2022`

You are a junior QA at Supplier CDMO 1. Your manager assigned you a section of the buyer's audit. You need to upload supporting evidence.

| Step | Click | What you should see |
|---|---|---|
| 1 | Land on the dashboard | Notification: "1 audit section assigned to you" |
| 2 | Click the notification | The audit's section view, just for the section you were assigned |
| 3 | Click **Upload Evidence** (or "Add Evidence") | File picker opens |
| 4 | Upload any PDF — anything works for testing (a bill, a screenshot saved as PDF, anything < 100 MB) | File appears in the section's evidence list with name, size, your name as uploader, and a UTC timestamp |
| 5 | Open the file you just uploaded (click its name) | File previews in-app or downloads |
| 6 | Add a short comment in the section's narrative field — something like "See attached evidence for our SOP-001" | Saved |
| 7 | Click **Mark Section Complete** | Status of the section updates to "Submitted by supplier" |
| 8 | Log out | |

> 🔍 **Behind the scenes.** The PDF was uploaded to the S3-compatible store (likely Cloudflare R2). A SHA-256 hash was computed and recorded against the file. The Evidence record links to the section AND to the audit AND to the supplier user. The audit trail captures the upload with your name + UTC + IP.

---

### 🎬 Act 4 — Buyer's Internal Auditor A reviews

**Log in as:** `buyer1-internal-auditor-a@test.com` · password `Testing@2022`

You are Internal Auditor A at Buyer Pharma 1. Your QA Head wants you to review the supplier's responses before they get signed off.

| Step | Click | What you should see |
|---|---|---|
| 1 | Land on the dashboard | List of audits you have access to (you're employed by Buyer Pharma 1) |
| 2 | Open the Q3 Audit of Supplier CDMO 1 | Audit detail page — buyer-side view |
| 3 | Go to the **Sections** tab | Sections with the supplier's submitted responses; the one you saw in Act 3 is now "Submitted by supplier" |
| 4 | Click that section | You can see the evidence the supplier uploaded; the narrative; everything |
| 5 | Try to upload your OWN evidence as a counter-document | Should work — internal auditors can add evidence |
| 6 | Add a comment: "Reviewed — recommend asking for additional batch records" | Saved |
| 7 | Log out | |

> 🔍 **Behind the scenes.** Internal Auditor A is in the SAME tenant as buyer1@test.com (the `buyer-01` tenant) but a different user with role = `buyer`. They have the same access to the audit; their actions are attributable to them, not to the QA Head.

---

### 🎬 Act 5 — External Auditor 1 brought in for independent review

**Back as:** `buyer1@test.com` · password `Testing@2022`

You're the QA Head again. You want an independent third-party opinion. You invite External Auditor 1 into the audit.

| Step | Click | What you should see |
|---|---|---|
| 1 | Open the Q3 Audit of Supplier CDMO 1 | Detail page |
| 2 | Find the **Participants** or **Invitees** tab (or "Share" action) | List of who has access |
| 3 | Click **Invite Auditor** | Selector |
| 4 | Choose `auditor1@test.com` from the external auditor list | Confirmation |
| 5 | Log out | |

**Log in as:** `auditor1@test.com` · password `Testing@2022`

You are the External Auditor. You just got invited.

| Step | Click | What you should see |
|---|---|---|
| 6 | Land on dashboard | Notification: "1 audit assignment from Buyer Pharma 1" |
| 7 | Open the audit | You see the audit detail but in **read-mostly** mode — you can review evidence, add comments, but not modify records |
| 8 | Browse the evidence Supplier 1 uploaded | All files accessible |
| 9 | Browse Internal Auditor A's comments | Visible to you |
| 10 | Add YOUR independent observation as a comment: "Recommend supplier provide CAPA history" | Saved as auditor-attributed comment |
| 11 | Log out | |

> 🔍 **Behind the scenes.** External Auditor 1 is in a DIFFERENT tenant (`auditor-01`) but they have been granted access to the audit via cross-tenant invitation. Their role is `auditor` — read-mostly. They cannot modify the underlying audit record; they can add observations attributable to their identity.

---

### 🎬 Act 6 — Buyer QA Head signs the finding

**Log in as:** `buyer1@test.com` · password `Testing@2022`

The audit is now in good shape. You're going to draft a finding (a recorded observation that the supplier needs to address), sign it, and let the system spawn a CAPA.

| Step | Click | What you should see |
|---|---|---|
| 1 | Open the audit | Detail page |
| 2 | Click the **Findings** tab → **+ AI-Draft Finding** | AskHawk drawer opens; AI begins drafting based on the evidence and the section narratives |
| 3 | Wait 5-15 seconds | Either: a draft text with citation badges (you can see WHICH evidence the AI used), OR the message "Insufficient evidence — human input required" |
| 4 | If you got a draft, click **Accept Draft**. If you got the fallback, type a short finding manually: "Supplier could not produce training records for batch 220915-A" | Finding appears in the findings table |
| 5 | Set Severity to **Minor** | Saved |
| 6 | Click **Sign Finding** | Signature dialog opens |
| 7 | Select **Meaning = Approval** | Required dropdown |
| 8 | Enter your password again (`Testing@2022`) | Required field |
| 9 | Enter a reason: "QA Head approval per SOP-014" | Required field |
| 10 | Click **Confirm** | Finding state changes to "Signed". Top of the finding now shows: "Signed by [your name] on [UTC] for Approval" |
| 11 | Look at the audit detail page — a new CAPA should have appeared in the linked-records panel | "1 CAPA spawned from finding" |
| 12 | Log out | |

> 🔍 **Behind the scenes — the four most regulator-watched things.** (a) The AI either cited a source or returned the fallback — never made up a citation; (b) the signature captured **printed name + UTC + meaning** (Part 11 §11.50 manifestation); (c) the signature required **password + reason** (Part 11 §11.200 two-distinct-components); (d) the audit trail captured everything with user/UTC/IP/session/reason (Part 11 §11.10(e) + Annex 11 §9).

---

### 🎬 Act 7 — Internal Auditor B does the cross-check, then audit closes

**Log in as:** `buyer1-internal-auditor-b@test.com` · password `Testing@2022`

You are Internal Auditor B. The QA Head signed the finding; before closeout, your role is to verify everything looks right.

| Step | Click | What you should see |
|---|---|---|
| 1 | Land on dashboard → open the audit | All evidence, the signed finding, all comments visible |
| 2 | Click on the signed finding | You see the e-sig manifest — name, UTC, meaning |
| 3 | Click the **Audit Trail** tab | A scroll of every action taken in this audit: who/what/when/why |
| 4 | Browse the audit trail | You should see entries for: AUDIT_CREATED · AUDIT_SENT · SECTION_ASSIGNED · EVIDENCE_UPLOADED · SECTION_SUBMITTED · COMMENT_ADDED · AUDITOR_INVITED · FINDING_DRAFTED · FINDING_SIGNED · CAPA_SPAWNED |
| 5 | Add a verification comment: "Cross-check complete; audit ready to close" | Saved |
| 6 | Log out | |

**Back to:** `buyer1@test.com` · password `Testing@2022`

The QA Head closes the audit.

| Step | Click | What you should see |
|---|---|---|
| 7 | Open the audit | Detail page |
| 8 | Look at the phase stepper — find the "Closeout Pending" or "Review Audit Trail" step | A button that says "Review Audit Trail" |
| 9 | Click **Review Audit Trail** | Renders the full audit trail in a modal or new view |
| 10 | At the bottom, click **Mark Reviewed** and e-sign (password + reason "Closeout review") | "Release Batch" or "Close Audit" button now enables |
| 11 | Click **Close Audit** | Signature dialog (Meaning = Approval) |
| 12 | Confirm with password + reason | Audit state = "Closed". A closure certificate PDF generates. |
| 13 | Click **Download Closure Certificate** | PDF downloads — open it; it shows the audit metadata, signatures, finding summary, all timestamps |
| 14 | Log out | |

🎉 **The story is complete.** You just played 5 different people through one full audit lifecycle.

> 🔍 **The hard gate you just triggered.** Annex 11 §15 requires audit-trail review before batch release. S.M.A.R.T. Hawk enforces this as a workflow rule: the "Close Audit" button does not enable until "Review Audit Trail" is e-signed. This is one of the top FDA-483 themes — and it's structurally impossible to bypass in S.M.A.R.T. Hawk.

---

## 4. Quick-reference persona cards

Use these when you want to explore a specific persona without re-reading the whole story. **Each card answers: who am I · what do I see · what can I do.**

### 4.1 Buyer QA Head (`buyer1@test.com` through `buyer5@test.com`)

| Thing | Value |
|---|---|
| Tenant | Buyer Pharma 1 through 5 |
| Layman role | "I run the audit programme for my company" |
| Can do | Create audits, send to suppliers, invite internal/external auditors, draft findings, sign findings, spawn CAPAs, review audit trail, close audits, download certificates |
| Cannot do | Modify another buyer's audits, see supplier-side private data, see auditor's internal notes |
| Main views | Audits dashboard · phase stepper · evidence ledger · findings table · audit trail |

### 4.2 Buyer Internal Auditor A / B (`buyer{N}-internal-auditor-{a,b}@test.com`)

| Thing | Value |
|---|---|
| Tenant | Same tenant as the buyer QA Head |
| Layman role | "I review and cross-check audits internally" |
| Can do | View audits in same tenant, add comments, upload counter-evidence, review audit trail |
| Cannot do | Sign findings as approver (only the QA Head can — separation of duties); cannot close audits |
| Main views | Audits assigned to me · comments · audit trail review |

### 4.3 Supplier QA Head (`supplier1@test.com` through `supplier5@test.com`)

| Thing | Value |
|---|---|
| Tenant | Supplier CDMO 1 through 5 |
| Layman role | "I respond to buyer audits and manage my supplier team's responses" |
| Can do | Receive audit requests, assign sections to team members, review evidence before submission, sign responses, view findings against my org |
| Cannot do | Modify the buyer's questionnaire structure, see other suppliers' data, see the buyer's internal comments |
| Main views | Inbox of audit requests · sections to respond to · my team's progress |

### 4.4 Supplier Team Member (`supplier_user1@test.com` through `supplier_user5@test.com`)

| Thing | Value |
|---|---|
| Tenant | Same tenant as the Supplier QA Head |
| Layman role | "I upload evidence for the sections my manager assigns me" |
| Can do | Upload evidence to assigned sections, add narrative, mark section complete |
| Cannot do | See sections not assigned to me, sign responses (only QA Head can), modify others' work |
| Main views | My assigned sections · evidence I uploaded |

### 4.5 External Auditor (`auditor1@test.com` through `auditor5@test.com`)

| Thing | Value |
|---|---|
| Tenant | External Auditor Firm 1 through 5 (separate tenant from buyers/suppliers) |
| Layman role | "I'm an independent third-party invited into audits to give a neutral opinion" |
| Can do | View audits I've been invited to, add observations, see evidence, see signed findings |
| Cannot do | Modify the audit record, sign on behalf of buyer or supplier, create new audits, see audits I wasn't invited to |
| Main views | Audits I've been invited to · my observations · my colleagues' observations |

### 4.6 S.M.A.R.T. Hawk Superadmin (`hawkeye-admin@test.com`)

| Thing | Value |
|---|---|
| Tenant | Platform (cross-tenant) |
| Layman role | "I'm the S.M.A.R.T. Hawk team — I administer the platform" |
| Can do | View all tenants, manage tenant settings, troubleshoot issues, generate cross-tenant reports |
| Cannot do | Modify a customer tenant's records as if you were that customer (your actions are logged separately in the governance audit trail) |
| Main views | Platform Admin console · all tenants list · platform audit log |
| When to use | Sparingly — only when you're debugging a cross-tenant issue. Default to a tenant user otherwise. |

---

## 5. Behind the scenes — what each click actually triggered

For Devs and QA who want to verify the right things technically happened. None of this is required for the story itself, but you'll want to know it.

| User action in the story | Technical event(s) triggered |
|---|---|
| Create audit | `AuditRequest` document inserted · `auditEvent` row written · webhook event emitted · notification to supplier queued |
| Upload evidence | File uploaded to S3-compatible store · SHA-256 hash computed · `Evidence` document inserted linked to section · `auditEvent` row written |
| AI-Draft Finding | LLM Gateway invoked through `services/ai/gateway/llmGateway.js` — single ingress · retrieval against tenant KB · cite-or-fallback enforcement at gateway · `aiAuditTrail` row written (model + version + promptHash + retrievalSet + confidence + userId + tenantId) |
| Sign finding | `electronicSignatureModel` row created · SHA-256 snapshot of finding state recorded · password verified · `auditEvent` row written |
| CAPA auto-spawn | New `Capa` document inserted linked to finding · `auditEvent` row written for the spawn |
| Review audit trail (hard gate) | "Review audit trail" action requires its own e-sig before "Close" button enables · workflow layer enforces |
| Close audit | Final e-sig · audit state → Closed · closure certificate PDF generated · all linked records frozen |

To verify any of these, log in as `hawkeye-admin@test.com` and check the Platform → Audit Log, or open Mongo directly if you have access.

---

## 6. Free-play prompts

Once you've finished the 7-act story, here are 10 things to try on your own:

1. **Try to log in with the wrong password 6 times in a row.** Should you get locked out? (Test §11.300 lockout.)
2. **Try to access an audit by URL while logged in as the wrong supplier.** Open Buyer 1's audit URL while logged in as `supplier2@test.com`. (Tests cross-tenant isolation.)
3. **Try to make AskHawk hallucinate.** Ask it something obviously not in any SOP — "What's the airspeed velocity of an unladen swallow?" Should return "Insufficient evidence." (Tests cite-or-fallback.)
4. **Try to sign a finding without entering a reason.** Should be blocked at the UI. (Tests §11.200.)
5. **Modify a finding in Mongo directly, then refresh the UI.** The signature should now show as "Invalidated — record modified since signature." (Tests §11.70 cryptographic linking. Requires Mongo access.)
6. **Switch a user's role mid-session.** Log in as `buyer1@test.com`, then have a teammate change your role to `auditor` via the admin console. Refresh — your view should immediately reflect the new role. (Tests RBAC live propagation.)
7. **Disable the audit trail.** Try to find any admin setting that disables audit logging. There shouldn't be one. (Tests architectural guarantee — cannot be configured away.)
8. **Export a closed audit as PDF + CSV + JSON.** Compare the three exports. The PDF is human-readable; the CSV is tabular; the JSON is programmatic. All should agree. (Tests §11.10(b).)
9. **Try to upload a 200 MB file.** Should be blocked with friendly error. (Tests size limit.)
10. **Run a "Reset password" cycle.** Confirm the password change is audited. (Tests §11.300 password controls + audit-trail capture.)

For deeper verification, see [COMPLIANCE-TEST-GUIDE.md](./COMPLIANCE-TEST-GUIDE.md) — same protocol but more formal.

---

## 7. Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| `[DEPLOYED URL]` doesn't load | Deployment is down OR URL not filled in | Check status.hawkeye.io · ask in #engineering Slack · update the URL placeholder at the top of this doc |
| Login fails with "Invalid credentials" using a seeded email | Seeds haven't been run on this environment yet | Ask Engineering to run `npm run seed:persona-users && npm run seed:internal-auditors` |
| Login fails with "Account locked" | You triggered the 5-failed-attempts lockout | Wait 30 minutes OR ask Engineering to unlock you via Mongo |
| You see a different audit than expected | You're logged in as the wrong persona | Log out completely (top-right menu → Sign out) and log in fresh as the right email |
| AskHawk says "AI temporarily unavailable" | Anthropic / OpenAI API hiccup | Wait 30 seconds and retry · if persistent, check #engineering-ai |
| Upload fails | File too large (> 100 MB) OR network hiccup | Use a smaller file · retry |
| Phase stepper doesn't advance after I clicked Send | Notification engine processing async — usually a few seconds | Refresh the page · if still not advancing, check audit log for errors |
| "Cross-tenant data leak" — you see another tenant's data | This is a P0 bug — STOP and escalate immediately | Slack #engineering and tag Founder Lead |

---

## 8. See also

- [TEAM-ONBOARDING.md](./TEAM-ONBOARDING.md) — broader onboarding (local dev setup if you need it, codebase map, glossary)
- [COMPLIANCE-TEST-GUIDE.md](./COMPLIANCE-TEST-GUIDE.md) — formal compliance verification (Part 11 / Annex 11 / ALCOA+ / cite-or-fallback) for QA / Compliance / Pharma SME
- [USER-FLOWS.md](../../05-design/flows/USER-FLOWS.md) — design-side description of the same flows
- [Audit Management URS.md](../../06-modules/audit-management/URS.md) — formal user requirements for what you just tested

---

*Doc_V2 · Company · Onboarding · Test Users + Audit Walkthrough v1.0 · 2026-06-08*
