# S.M.A.R.T. Hawk Team Onboarding & App Tour

| Field | Value |
|---|---|
| Owner | Founders / Engineering Lead |
| Status | v1.0 — 2026-06-08 |
| Audience | New team members across all roles |
| Outcome | From "I joined this week" to "I can open the app, click through the 10 most important flows, and explain what I'm looking at" |
| Companion | [COMPLIANCE-TEST-GUIDE.md](./COMPLIANCE-TEST-GUIDE.md) — deeper verification flows for QA / Compliance / SME consultants |

---

## 1. Welcome — read this first

You joined S.M.A.R.T. Hawk. Two things you need before you can be productive:

1. **A working instance of the app** (either the shared Sandbox tenant or your own local dev environment)
2. **A mental model** for what the app does, who uses it, and how it's built

This document gives you both. By the end of it — about 1 hour if you follow the comprehensive tour — you should be able to:

- Log into the app
- Create an audit
- Upload evidence
- Generate an AI-drafted finding (and observe the cite-or-fallback behavior)
- Apply an electronic signature
- Inspect the audit trail
- Explain to a colleague what each layer of the architecture does

If something doesn't work, jump to §10 *(Debugging when things don't work)*. If you're stuck, jump to §12 *(Who to ask)*.

### 1.1 Who this doc is for — pick your path

| You are | Follow | Skips |
|---|---|---|
| Sales · Product · Design · Marketing · Founder hire | **Path A** (§3) | §4 local dev setup |
| Engineer (frontend, backend, full-stack, AI) | **Path A then Path B** (§3 + §4) | None |
| QA · Compliance · Pharma SME consultant | **Path A** (§3) + the companion [COMPLIANCE-TEST-GUIDE.md](./COMPLIANCE-TEST-GUIDE.md) | §4 (unless you also need local) |

---

## 2. The platform in one page (read this before clicking)

S.M.A.R.T. Hawk is an **AI-native EQMS (Enterprise Quality Management System)** for pharmaceutical manufacturers and contract manufacturing organisations (CDMOs). The platform is built across **five architectural layers**, with **Trust · Security · Compliance as Layer 1 — the foundation**:

| Layer | What it provides | Code lives in |
|---|---|---|
| **5 — Experience** | Multi-persona UI · AskHawk chat · phase stepper · admin console | `frontend/app/` + `frontend/components/` |
| **4 — Domain Engine** | 13 EQMS modules · Configuration Layer · 5-pillar runtime (Sense · Monitor · Analyze · Record · Trace) | `backend/src/modules/` + `backend/src/services/` |
| **3 — AI Gateway** | Multi-LLM routing (Anthropic · OpenAI · Gemini · local vLLM) · grounded generation · cite-or-fallback · AI Audit Trail | `backend/src/services/ai/gateway/` |
| **2 — Data & Evidence** | Multi-tenant MongoDB · S3-compatible evidence store · SHA-256 record hashing · tamper-evident audit log | `backend/src/models/` + `backend/src/utils/s3Upload.js` |
| **1 — Trust · Security · Compliance (foundation)** | GAMP Cat 4 · 21 CFR Part 11 · EU GMP Annex 11 · ALCOA+ · TLS · AES-256 · SSO/MFA · RBAC · tenant isolation · IN/US/EU residency · no AI training on customer data | `backend/src/middleware/` + `backend/src/services/compliance/` |

**The 13 EQMS modules** (all in Layer 4): Audit Management · Document Control · CAPA · Deviation · Change Control · Training · Risk Management · Complaint Management · Supplier Management · Equipment Management · Batch Records · Management Review · Design Control. Plus the cross-cutting AskHawk conversational AI agent.

**Two non-negotiable architectural guarantees** worth knowing on day one:

1. **Cite-or-fallback at Layer 3** — Every AI output cites a source or returns "Insufficient evidence — human input required." It is **impossible by design** to produce a hallucinated citation. You'll verify this in §7.
2. **Human always commits the record** — AI drafts, suggests, scores. AI never executes a record state change. A human always reviews and e-signs.

**For deeper context** (read on your own time):
- [PLATFORM-OVERVIEW.md](../../04-engineering/00-overview/PLATFORM-OVERVIEW.md) — full 5-layer canonical reference
- [ARCHITECTURE.md](../../04-engineering/01-architecture/ARCHITECTURE.md) — system architecture
- [VISION.md](../../01-strategy/vision-and-positioning/VISION.md) — strategic positioning

---

## 3. Path A — Just click around (the Sandbox tenant)

**For:** Sales · Product · Design · Marketing · Founder hire · Engineer (as a first taste before §4)
**Time:** 10 minutes to first login; 1 hour for the full tour
**Pre-requisites:** A laptop with a modern browser (Chrome ≥ 120 recommended)

> ℹ️ **Honest note on environments.** S.M.A.R.T. Hawk does NOT yet have a separate staging environment. The team currently uses the **Sandbox tenant** — the same product surface customers access for self-serve discovery — for internal testing. This is fine for pre-customer phase but flag if your work depends on isolation from sandbox sign-ups.

### 3.1 Get access

| Step | What to do |
|---|---|
| 1 | Open `[SANDBOX URL — fill in: app.hawkeye.io or current shared URL]` in Chrome |
| 2 | Click **Sign Up** and use your `@hawkeye` (or designated team) email |
| 3 | Verify your email (one-time link delivered immediately) |
| 4 | When prompted to create a tenant, name it `team-onboarding-<your-name>` so it's clearly yours and won't clash with anyone else's |
| 5 | Land on `/dashboard` |

Alternatively, ask a teammate to invite you to an existing shared team tenant (saves the per-person tenant creation). If you do, use the email they invite to.

### 3.2 What you should see after login

| UI element | Where | What it does |
|---|---|---|
| Top navigation | Top of every page | Persona switcher · AskHawk launcher (sparkle icon) · profile menu |
| Left sidebar | Left side | Module navigation: Audit · Document Control · CAPA · Deviation · etc. |
| Phase stepper | On any record detail page | Shows current state of an audit / CAPA / change request |
| Status chips | In tables and detail pages | Color + icon + label (never color-only) per [DESIGN-PRINCIPLES.md](../../05-design/design-system/DESIGN-PRINCIPLES.md) |
| AskHawk drawer | Triggered by sparkle icon or ⌘K / Ctrl+K | Conversational agent for compliance Q&A · SOP authoring · workflow help |

### 3.3 Persona switching (optional, useful for tours)

Most Sandbox accounts default to Tenant Admin so you see everything. To experience the platform as different personas:

| Persona | Recommended for | How to switch |
|---|---|---|
| QA Head (Sponsor) | Strategic view · approval flows | Admin Console → Users → switch your role to `qa_head` |
| QA Manager (Daily user) | Audit hosting · finding drafting · CAPA | Default — already enabled |
| Operations / SME | Evidence upload · section assignments | Admin Console → switch role to `operations` |
| Auditor (external) | Read-mostly · supplier-side review | Admin Console → switch role to `auditor` |
| Auditee (supplier) | Responding to received audit | Use the Supplier Portal (`[SANDBOX URL]/supplier`) |

> 💡 **Pro tip.** Don't switch back and forth mid-tour. Pick one persona, walk the flow, then switch and re-walk. The Buyer view vs Supplier view of the same audit record looks materially different — that's the persona-aware rendering pattern (Design Principle 5).

---

## 4. Path B — Local development environment (engineers)

**For:** Engineers who need to read code, modify it, run tests, debug
**Time:** ~45 minutes first time; ~5 minutes thereafter
**Pre-requisites:** Git · Node 20 · MongoDB (local install or Docker) · 1Password access for shared secrets

### 4.1 What you need installed

| Tool | Version | Verify |
|---|---|---|
| Git | latest | `git --version` |
| Node.js | 20.x | `node --version` |
| npm | 10.x (ships with Node 20) | `npm --version` |
| MongoDB | 6.x or 7.x | `mongod --version` OR use Docker |
| 1Password CLI (optional) | latest | `op --version` |
| VS Code (recommended) | latest | — |

### 4.2 Clone the repos

```bash
mkdir -p ~/Code/S.M.A.R.T. Hawk
cd ~/Code/S.M.A.R.T. Hawk

# Get repo access from Founder Lead first; then:
git clone [BACKEND_REPO_URL] backend
git clone [FRONTEND_REPO_URL] frontend
```

> 💡 **Repo URLs** are in the team 1Password vault under "S.M.A.R.T. Hawk → GitHub". Get repo access from the Founder Lead.

### 4.3 Backend setup

```bash
cd backend

npm install                              # ~2 min
cp .env.example .env                     # create local env file
# Edit .env to fill in real values:
#   MONGO_URI=mongodb://127.0.0.1:27017/hawkeye_dev
#   JWT_SECRET=<generate via: openssl rand -hex 32>
#   ANTHROPIC_API_KEY=<from 1Password — your personal dev key, NOT prod>
#   PORT=8101
#   FE_BASE_URL=http://localhost:3000
#   NODE_ENV=development

# Start MongoDB (if not already running)
brew services start mongodb-community     # macOS
# OR
sudo systemctl start mongod               # Linux
# OR
docker run -d -p 27017:27017 mongo:7      # Docker

# Run the backend
npm run dev                               # starts on port 8101
```

Verify backend is up: open `http://localhost:8101/docs` — you should see the Swagger / OpenAPI spec page.

### 4.4 Frontend setup

```bash
cd ../frontend

npm install                              # ~3 min
cp .env.local.example .env.local         # if example exists; otherwise create from scratch
# Edit .env.local:
#   NEXT_PUBLIC_API_URL=http://localhost:8101
#   NEXT_PUBLIC_ASKHAWK_ENABLED=true

npm run dev                              # starts on port 3000
```

Open `http://localhost:3000`. You should land on `/auth/login`.

### 4.5 Create your first local user

Since there's no SSO IdP in local dev, the local auth fallback is enabled:

```bash
# In a new terminal, with backend running:
cd backend
npm run seed:dev-user
# Creates: email=dev@hawkeye.local password=S.M.A.R.T. Hawk!Dev2026 role=tenant_admin
```

Log in with those credentials at `http://localhost:3000/auth/login`. You're in.

> ⚠️ **Never commit `.env` or `.env.local` files.** They are gitignored. If your `.env` ends up in a commit, rotate every secret immediately and tell the Founder Lead.

### 4.6 Seed test data (optional but recommended)

```bash
cd backend
npm run seed:eqms                        # seeds all 13 modules with synthetic data
# OR target one module:
npm run seed:audit                       # seeds Audit Management module only
```

Refresh your browser. You should now see seeded audits, documents, CAPAs, etc.

### 4.7 Run the tests

```bash
# Backend
cd backend
npm test                                 # unit + integration; ~2 min
npm run test:e2e                         # E2E via supertest; ~5 min

# Frontend
cd ../frontend
npm test                                 # Jest unit tests
npm run test:e2e                         # Playwright; ~3 min
```

If any test fails on your first run, that's a setup issue (env vars · Mongo not running · port conflict). Check §10.

### 4.8 Where to make your first change

A safe first PR:

| Change | Where | Why it's safe |
|---|---|---|
| Add a console.log to a service | `backend/src/services/<domain>/<file>.js` | No production impact; teaches you the service-layer pattern |
| Tweak a UI label | `frontend/components/<domain>/<component>.tsx` | Visible feedback in seconds; teaches you the component pattern |
| Add a new pre-filled value to the seed script | `backend/scripts/seed/*.js` | Teaches you the data-model + helps the team |

---

## 5. Logging in — test accounts & personas

For **Path A** (Sandbox), use the credentials you created during signup.

For **Path B** (local), use seeded accounts:

| Persona | Email | Password | Role |
|---|---|---|---|
| Tenant Admin (default) | `dev@hawkeye.local` | `S.M.A.R.T. Hawk!Dev2026` | `tenant_admin` |
| QA Head | `qa-head@hawkeye.local` | `S.M.A.R.T. Hawk!Dev2026` | `qa_head` |
| QA Manager | `qa-mgr@hawkeye.local` | `S.M.A.R.T. Hawk!Dev2026` | `qa_manager` |
| QA Analyst | `qa-analyst@hawkeye.local` | `S.M.A.R.T. Hawk!Dev2026` | `qa_analyst` |
| Operations | `ops@hawkeye.local` | `S.M.A.R.T. Hawk!Dev2026` | `operations` |
| External Auditor | `auditor@hawkeye.local` | `S.M.A.R.T. Hawk!Dev2026` | `auditor` |
| Auditee (Supplier QA) | `supplier@hawkeye.local` | `S.M.A.R.T. Hawk!Dev2026` | `auditee` (uses Supplier Portal) |

> ℹ️ These are seeded by `npm run seed:dev-user` and `npm run seed:eqms`. Passwords are intentionally identical for dev convenience; never use these patterns in any non-local environment.

---

## 6. The 10-minute app tour

Goal: log in → create an audit → upload evidence → generate an AI-drafted finding → e-sign → inspect audit trail → log out. Click count: ~25. Time: 10 minutes if you don't get distracted.

| # | Action | What you should see |
|---|---|---|
| 1 | Log in as **QA Manager** (`qa-mgr@hawkeye.local`) | Dashboard with seeded audits, CAPAs, documents |
| 2 | Left sidebar → **Audit Management** | List of seeded audits |
| 3 | Click **+ New Audit** | New audit creation form |
| 4 | Fill in: name = "Tour Audit · `<your-name>`" · type = Hosted supplier audit · standard = ICH Q7 · site = default | Form submits; you land on the new audit's detail page |
| 5 | Observe the **phase stepper** at the top — current state: Draft | Phase stepper visible with 5 phases (Plan → Prep → On-Site → Closeout → Closed) |
| 6 | Click **Evidence** tab → **+ Upload Evidence** | File picker opens |
| 7 | Upload any small PDF (e.g., a S.M.A.R.T. Hawk PDF from `Doc_V2/`) | File appears in evidence ledger with SHA-256 hash, uploader, UTC |
| 8 | Click **Findings** tab → **+ AI-Draft Finding** | AskHawk drawer opens; AI begins drafting |
| 9 | Observe the AI draft with **citation chips** and **confidence badge** | If sources found: text + citations. If not: "Insufficient evidence — human input required" |
| 10 | Click **Accept Draft** → severity = Minor → save | Finding appears in findings table |
| 11 | Click the finding → **Sign** | Signature dialog opens |
| 12 | Select meaning = **Approval** → enter password (your seeded password) → enter reason = "Tour test" → confirm | Finding state → "Signed". E-sig manifest appears: printed name + UTC + meaning |
| 13 | Click **Audit Trail** tab | Audit trail rows for: AUDIT_CREATED · EVIDENCE_UPLOADED · FINDING_DRAFTED · FINDING_SIGNED — each with user · UTC · IP · session · reason |
| 14 | Logout (top-right profile menu → Sign out) | Land on `/auth/login` |

**What you just verified:**
- The 5-pillar runtime (Sense → Monitor → Analyze → Record → Trace) actually executes
- AI grounding works (you saw citations)
- E-signature ceremony works per Part 11 §11.50 + §11.200
- Audit trail captures every state change with the right metadata

---

## 7. The 1-hour comprehensive tour

After the 10-minute tour, walk these in any order. Each section is 5-10 minutes.

### 7.1 Document Control
- Sidebar → Document Control → click any seeded SOP → observe version history (versions append, never overwrite — ALCOA+ Original/Enduring)
- Try editing → save as new version → verify old version still accessible

### 7.2 CAPA (linked from a finding)
- Open the finding you signed in §6 → observe the auto-spawned CAPA in the related-records panel
- Open the CAPA → walk it through Plan → In Progress → Effectiveness Check → Closed (each transition requires e-sig)
- Try to close without an effectiveness check — observe the hard-gate block

### 7.3 Deviation
- Sidebar → Deviation → create a new deviation → invoke AI 5-Why drafter → observe the same cite-or-fallback behavior

### 7.4 AskHawk
- Click the sparkle icon (or ⌘K / Ctrl+K) → open AskHawk drawer
- Try: "What does 21 CFR Part 11 §11.50 require?" — should return citations
- Try: "What is my favorite color?" — should return "Insufficient evidence — human input required"
- Try: "Draft an SOP for batch release" — wizard mode kicks in; observe the structured response

### 7.5 Admin Console
- Top-right profile menu → Admin Console
- Browse: Users · Roles · Workflows · Standards · AI Configuration · Integrations
- Note: most workflow changes require e-sig per Annex 11 §10 (change & config management)

### 7.6 Other modules — quick visits
- Change Control · Training · Risk Management · Complaint Management · Supplier Management · Equipment Management · Batch Records · Management Review · Design Control — each follows the same 5-pillar pattern

### 7.7 Audit-trail review at batch release (Annex 11 §15)
- Sidebar → Batch Records → open a seeded batch → notice the "Audit-Trail Review" gate before "Release Batch"
- Try to click "Release Batch" without reviewing — observe the hard-gate block
- Click "Review Audit Trail" → render the trail → e-sign as "Reviewed" → now "Release Batch" enables

---

## 8. 12 basic test scenarios with expected outcomes

These verify the app works as designed. For **compliance-grade verification** (Part 11 / Annex 11 / ALCOA+), use the sibling [COMPLIANCE-TEST-GUIDE.md](./COMPLIANCE-TEST-GUIDE.md).

| # | Scenario | Steps | Expected |
|---|---|---|---|
| 1 | Login works | Log in with valid creds | Land on dashboard |
| 2 | Wrong password fails | Log in with wrong password | Error · audit-log row written (check Admin → Audit Log) |
| 3 | Account lockout works | 5 failed login attempts | Account locked for 30 min · email notification sent |
| 4 | Create audit | New Audit → fill required fields → save | Audit appears in list with state = Draft |
| 5 | Upload evidence | Open audit → Evidence → upload PDF < 100 MB | File appears with hash · uploader · UTC |
| 6 | Upload oversize file | Try to upload a file > 100 MB | Friendly error message · upload blocked |
| 7 | AI-draft finding | AI-Draft Finding action | Either citations + confidence OR "insufficient evidence" |
| 8 | E-sign with wrong password | Sign with wrong password | E-sig rejected · audit log captures failed attempt |
| 9 | E-sign without reason | Sign with empty reason field | UI blocks submission · field required indicator |
| 10 | Audit trail captures every action | After 5 actions, open Audit Trail | Exactly 5 rows · each with user · UTC · IP · session · reason |
| 11 | Cross-persona view | Sign finding as QA Manager · log in as Auditor · view same audit | Auditor sees finding read-only; cannot modify; cannot sign |
| 12 | Logout terminates session | Sign out · try to access /dashboard | Redirected to /auth/login |

If any scenario fails on your local environment, see §10. If any fails on the Sandbox tenant, it's a real bug — file in the team Slack #bugs channel.

---

## 9. Where to find specific things in the codebase

| You want to understand | Look in |
|---|---|
| How a new request enters the app | `backend/src/app.js` → middleware chain → route file → controller → service |
| How AI calls are made | `backend/src/services/ai/gateway/llmGateway.js` (the ONLY ingress to LLM providers) |
| How cite-or-fallback is enforced | `backend/src/services/ai/grounded-generation/` |
| How tenant isolation is enforced | `backend/src/middleware/tenantMiddleware.js` + every Mongoose query carries `tenantId` |
| How an audit trail row is written | `backend/src/services/governance/governanceAuditLogService.js` + `auditTrailService.js` |
| How an e-signature is captured | `backend/src/models/electronicSignatureModel.js` + signature dialog component |
| How the 5-pillar runtime executes | `backend/src/modules/auditEngine/` + per-module `services/` |
| How the frontend talks to backend | `frontend/lib/axiosInstance.ts` (single axios instance) + 40 domain-specific API modules under `frontend/lib/*Api.ts` |
| How auth works in the frontend | `frontend/lib/auth.ts` (server-only) + `frontend/actions/auth.ts` |
| How AskHawk is built | `frontend/components/askhawk/AskHawkDrawer.tsx` + `frontend/lib/askHawkApi.ts` + `backend/src/modules/askhawk/` |
| Mongoose models (170 of them) | `backend/src/models/*.js` |
| API spec | `http://localhost:8101/docs` (Swagger) when running locally; or `backend/src/docs/` |

Full architectural reference: [ARCHITECTURE.md](../../04-engineering/01-architecture/ARCHITECTURE.md). Frontend specifics: [FRONTEND.md](../../04-engineering/04-frontend/FRONTEND.md).

---

## 10. Debugging when things don't work

### 10.1 Local backend won't start

| Error | Cause | Fix |
|---|---|---|
| `MongoServerSelectionError: connect ECONNREFUSED 127.0.0.1:27017` | MongoDB isn't running | Start it (see §4.3) |
| `Error: listen EADDRINUSE: address already in use :::8101` | Another process on port 8101 | `lsof -i :8101` (macOS/Linux) → kill it OR change PORT in `.env` |
| `JWT_SECRET is not defined` | Missing env var | Add `JWT_SECRET=<random>` to `.env` |
| `ANTHROPIC_API_KEY missing` (only for AI features) | AI key not set | Get a dev key from 1Password; non-AI features still work without |
| Mongoose deprecation warnings | Mongoose 7 verbosity | Ignore — they're warnings not errors |

### 10.2 Local frontend won't start

| Error | Cause | Fix |
|---|---|---|
| `Error: listen EADDRINUSE :::3000` | Another process on 3000 | `npm run dev -- -p 3001` to use a different port |
| `NEXT_PUBLIC_API_URL is not defined` | Missing env var | Add to `.env.local` (see §4.4) |
| White screen after login | Backend isn't reachable | Check `NEXT_PUBLIC_API_URL` matches your backend port; check backend is running |

### 10.3 Login fails locally

| Symptom | Cause | Fix |
|---|---|---|
| "Invalid credentials" with seeded user | Seed script didn't run | Re-run `npm run seed:dev-user` |
| Login succeeds but immediately bounces to login | JWT cookie not set | Check browser dev-tools → Application → Cookies; if missing, check backend logs; likely a CORS / cookie domain mismatch |
| "Account locked" | 5 failed attempts | Wait 30 min OR clear via Mongo: `db.users.updateOne({email:"dev@hawkeye.local"}, {$set:{failedLoginAttempts:0, lockedUntil:null}})` |

### 10.4 AI features return errors

| Symptom | Cause | Fix |
|---|---|---|
| "AI provider not configured" | No `ANTHROPIC_API_KEY` etc. | Add a key to `.env`; if you don't have one, use the Sandbox tenant instead of local |
| AI always returns "Insufficient evidence" | KB / retrieval not seeded | Run `npm run seed:ai-corpus`; or accept this is normal behavior when no retrieval source matches |

### 10.5 Sandbox tenant issues

| Symptom | Fix |
|---|---|
| Sandbox login bouncing | Wait 60s for backend cold-start (Vercel serverless); retry |
| Don't see seeded data | Sandbox doesn't auto-seed; create your own audits/CAPAs to play with |
| AskHawk says "AI temporarily unavailable" | Likely Anthropic API hiccup; retry in 30s |

### 10.6 Tests fail

| Symptom | Fix |
|---|---|
| Backend integration tests fail with Mongo errors | Tests need a separate test DB; check `MONGO_URI_TEST` env var; or `npm run test:reset-db` |
| Frontend E2E tests fail with "page not found" | Backend not running on expected port; start backend first |
| Snapshot tests fail | Either you intentionally changed UI (run `npm test -- -u` to update snapshots) or a regression — investigate |

---

## 11. Glossary — terms you'll hear daily

| Term | Definition |
|---|---|
| **EQMS** | Enterprise Quality Management System — the product category S.M.A.R.T. Hawk competes in |
| **GxP** | Good Practice (umbrella for GMP · GLP · GCP · GDP · GVP) — the regulatory family for life sciences |
| **GMP** | Good Manufacturing Practice — applies to drug + device manufacturing (our beachhead) |
| **GAMP 5** | ISPE's Risk-Based Approach to Compliant GxP Computerized Systems — S.M.A.R.T. Hawk is **Category 4 — Configured Product** |
| **21 CFR Part 11** | FDA regulation governing electronic records + e-signatures |
| **EU GMP Annex 11** | EU regulation governing computerised systems used in GMP |
| **ALCOA+** | Data integrity attributes (Attributable · Legible · Contemporaneous · Original · Accurate + Complete · Consistent · Enduring · Available) — 9 in total |
| **CSV** | Computer System Validation (the document-heavy approach) |
| **CSA** | Computer Software Assurance — FDA's risk-based replacement for CSV (Final guidance Sep 2025) |
| **CAPA** | Corrective and Preventive Action — a quality finding's follow-up |
| **CDMO** | Contract Manufacturing Organisation — our wedge customer segment |
| **PoC** | Proof of Concept — S.M.A.R.T. Hawk's 60-day customer trial structure |
| **Sandbox** | S.M.A.R.T. Hawk's self-serve free discovery tier (synthetic data · 14-day expiry) |
| **5-layer architecture** | S.M.A.R.T. Hawk's canonical architectural framing — see §2 |
| **5-pillar runtime** | Sense → Monitor → Analyze → Record → Trace — the universal motion every module follows |
| **Cite-or-fallback** | Architectural guarantee — every AI output cites a source or returns "Insufficient evidence" |
| **AskHawk** | S.M.A.R.T. Hawk's conversational AI agent (cross-cutting feature across all modules) |
| **Validation Accelerator Package** | S.M.A.R.T. Hawk's bundle of vendor evidence shipped to customers at PoC kickoff to support GAMP Cat 4 supplier-leveraged validation |
| **e-sig** | Electronic signature per 21 CFR §11.50 + §11.200 |
| **WHO-GMP** | WHO's GMP standard — relevant for export-market CDMOs like Sanpras |
| **WHO-PQ** | WHO Prequalification — a high-bar regulatory pathway |
| **Persona** | Buyer (S.M.A.R.T. Hawk's customer's QA team) · Supplier (auditee) · Auditor (external) · etc. |

For deeper definitions: [GAMP-CAT-4-COMPLIANCE.md §33](../../08-compliance-regulatory/GAMP-CAT-4-COMPLIANCE.md) glossary.

---

## 12. Who to ask

| Topic | Person · Channel |
|---|---|
| Repo access · 1Password access · general account problems | Founder Lead — direct email or Slack DM |
| Backend code questions | Engineering Slack `#engineering-backend` |
| Frontend code questions | Engineering Slack `#engineering-frontend` |
| AI Gateway / cite-or-fallback / LLM provider questions | Engineering Slack `#engineering-ai` |
| Compliance / Part 11 / Annex 11 / GAMP questions | Compliance / Pharma SME — Slack `#compliance` |
| Customer / sales / PoC questions | Slack `#sales` |
| Design / UX / accessibility questions | Slack `#design` |
| "I'm completely stuck" | Founder Lead — direct line |

### 12.1 First-week recurring meetings to attend

| Meeting | Cadence | What you'll get |
|---|---|---|
| Engineering standup | Daily 09:30 IST | Current sprint focus + blockers |
| Customer-success sync | Weekly | What's happening with active PoCs / customers |
| Compliance review | Weekly | Regulatory updates + product compliance posture |
| Founder all-hands | Bi-weekly | Strategic context · roadmap · open questions |

---

## 13. Your first-week checklist

| ✓ | Item |
|---|---|
| ☐ | Read §2 (5-layer architecture in one page) — 5 min |
| ☐ | Complete Path A (Sandbox tenant access) — 10 min |
| ☐ | Walk the 10-minute tour (§6) — 10 min |
| ☐ | Walk the 1-hour comprehensive tour (§7) — 60 min |
| ☐ | Read CORE-PRD.md for product context — 20 min |
| ☐ | (Engineers) Complete Path B (local dev) — 45 min |
| ☐ | (Engineers) Submit a safe first PR (§4.8) — varies |
| ☐ | (QA / Compliance) Read [COMPLIANCE-TEST-GUIDE.md](./COMPLIANCE-TEST-GUIDE.md) and walk the Part 11 verification — 60 min |
| ☐ | Attend first engineering standup |
| ☐ | Schedule a 30-min intro with the Founder Lead |
| ☐ | Join all Slack channels in §12 |
| ☐ | Set up 1Password access |
| ☐ | Bookmark this document |

---

## 14. See also

- [COMPLIANCE-TEST-GUIDE.md](./COMPLIANCE-TEST-GUIDE.md) — sibling doc · deeper Part 11 / Annex 11 / ALCOA+ / cite-or-fallback verification flows for QA · Compliance · Pharma SME consultants
- [PLATFORM-OVERVIEW.md](../../04-engineering/00-overview/PLATFORM-OVERVIEW.md) — full 5-layer canonical reference
- [ARCHITECTURE.md](../../04-engineering/01-architecture/ARCHITECTURE.md) — backend system architecture
- [FRONTEND.md](../../04-engineering/04-frontend/FRONTEND.md) — frontend architecture
- [USER-FLOWS.md](../../05-design/flows/USER-FLOWS.md) — 10 key user journeys
- [CORE-PRD.md](../../03-product/03-prd/CORE-PRD.md) — platform-level product requirements
- [VISION.md](../../01-strategy/vision-and-positioning/VISION.md) — strategic positioning
- [GAMP-CAT-4-COMPLIANCE.md](../../08-compliance-regulatory/GAMP-CAT-4-COMPLIANCE.md) — full compliance reference (long, read on your own time)

---

*Doc_V2 · Company · Onboarding · Team Onboarding & App Tour v1.0 · 2026-06-08*
