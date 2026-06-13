# URS — Management Review (MRM)

| Field | Value |
|---|---|
| Module | Management Review |
| Owner | Product (S.M.A.R.T. Hawk Platform) |
| Status | DRAFT (forward-spec) |
| Version | 0.1 |
| Last updated | 2026-06-01 |
| Regulatory anchors | ICH Q10 §1.6 + §3.2.4, ISO 9001 §9.3, EU GMP Ch.1 §1.7–§1.9, 21 CFR Part 11 |
| Source | Forward-spec; cross-refs every operating module (audit, capa, change-control, deviation, complaint, supplier, risk, training, batch, equipment) |

---

## 1. Purpose and Scope

**Purpose.** S.M.A.R.T. Hawk Management Review (MRM) is the QMS module for **periodic, structured review of QMS performance by senior management**, with formally compiled inputs, documented decisions, action items tracked to closure, and chair sign-off. Implements ICH Q10 §1.6 (PQS management responsibility) + ISO 9001 §9.3 (management review).

**In scope:**
- MRM lifecycle (scheduled → inputs compiled → meeting → minutes → approval → action tracking → closed)
- Cadence configuration (quarterly default; annual minimum)
- Auto-compilation of inputs from every operating module (KPIs + exceptions)
- Meeting record (attendees, agenda, minutes, decisions)
- Action item assignment with owners + due dates + tracking through closure
- E-signature on minutes approval by Chair (always)
- Attendee attestation of attendance
- Cross-module: spawns CAPA, Change Control, Risk reviews as MRM outputs

**Out of scope (handed off):**
- Meeting calendar/room booking → external (Outlook/Google Calendar integration future)
- Recording transcription → future integration
- Operating module KPIs themselves — MRM consumes; each module owns its metrics
- Action item execution lifecycle (those route to CAPA / Change Control / Risk modules)

---

## 2. Stakeholders and Personas

| Persona | Role | Goals | Pain points without this module |
|---|---|---|---|
| **VP Quality / MRM Chair** (e.g., Dr Elena Vasquez) | Chairs the meeting, approves minutes, owns the outcome | Pre-compiled inputs ready for review; clear decisions captured; one-click action item creation | Inputs compiled manually over 2 weeks; minutes typed in Word; action items lost in email |
| **MRM Attendees** (function leads — VP Manufacturing, VP Regulatory, Site Heads, etc.) | Attend, contribute, attest attendance | Single agenda + relevant inputs in advance | Last-minute powerpoints; no structured input visibility |
| **Action Owner** (anyone post-meeting) | Own action item, drive to closure | Clear assignment + due date in inbox | Action items in PDF minutes, never tracked |
| **QA Operations** | Compile inputs, draft agenda, draft minutes | Auto-pull from every module; manual override if needed | Hours of copy-paste across spreadsheets |
| **Regulator / Auditor (read-only)** | Inspect MRM evidence during audit | Single page: dates, attendees, inputs, decisions, action closure | Comb through email + PDF chains |

---

## 3. Part A — Foundational Requirements

### A1. MRM Scheduling + Cadence

| ID | Requirement | Persona | Reg anchor | MoSCoW | Current state |
|---|---|---|---|---|---|
| URS-A-001 | System SHALL support recurring MRM cadence (quarterly default; tenant-configurable; annual minimum). | Tenant Admin | ICH Q10 §1.6, ISO 9001 §9.3 | MUST | ⏳ planned |
| URS-A-002 | Each scheduled MRM SHALL receive a globally unique `mrmId` (e.g., `MRM2026Q2-001`) and a tenant-scoped sequence. | System | 21 CFR Part 11 §11.10 | MUST | ⏳ planned |
| URS-A-003 | System SHALL alert Chair + QA Ops T-30, T-14, T-7 days before scheduled meeting to compile inputs. | System | UX baseline | MUST | ⏳ planned |
| URS-A-004 | Ad-hoc MRMs SHALL be supported (e.g., for major incident, regulator visit) outside the recurring cadence. | Chair | ICH Q10 §1.6 | SHOULD | ⏳ planned |

### A2. Input Compilation

| ID | Requirement | Persona | Reg anchor | MoSCoW | Current state |
|---|---|---|---|---|---|
| URS-A-010 | System SHALL aggregate MRM inputs from every QMS module per ICH Q10 §1.6 + ISO 9001 §9.3 standard categories: audit findings, CAPA effectiveness, customer complaints, regulator interactions, change controls, risk register, training gaps, internal audit results, supplier performance, deviations. | System | ICH Q10 §1.6, ISO 9001 §9.3 | MUST | ⏳ planned |
| URS-A-011 | Each input SHALL include: source module, period covered, KPI value, trend vs prior period, exceptions/escalations list, hyperlink to source records. | System | ICH Q10 §1.6 | MUST | ⏳ planned |
| URS-A-012 | QA Ops SHALL be able to override / annotate / add manual inputs (e.g., strategic context, market events). | QA Ops | UX | MUST | ⏳ planned |
| URS-A-013 | Compiled inputs SHALL be reviewable + lockable before meeting; once locked, additions require a new revision. | QA Ops | ALCOA+ | MUST | ⏳ planned |

### A3. Meeting Record

| ID | Requirement | Persona | Reg anchor | MoSCoW | Current state |
|---|---|---|---|---|---|
| URS-A-020 | System SHALL record meeting metadata: date, location, mode (in-person / remote / hybrid), agenda, attendees, apologies. | QA Ops | ISO 9001 §9.3 | MUST | ⏳ planned |
| URS-A-021 | Attendees SHALL attest their attendance via e-signature (signatureMeaning=ATTENDED) — captured during or post-meeting. | Attendee | 21 CFR Part 11 §11.50 | MUST | ⏳ planned |
| URS-A-022 | System SHALL capture a structured minutes record: per-input discussion summary, decisions made, action items with owners + due dates. | QA Ops | ISO 9001 §9.3 | MUST | ⏳ planned |
| URS-A-023 | Optional: meeting recording URL/asset link + transcript field (integration deferred). | QA Ops | UX | SHOULD | ⏳ deferred |

### A4. Minutes Approval Gate (Chair E-Sig)

| ID | Requirement | Persona | Reg anchor | MoSCoW | Current state |
|---|---|---|---|---|---|
| URS-A-030 | Minutes SHALL transition from DRAFT → APPROVED only via Chair e-signature (signatureMeaning=APPROVED). | Chair | 21 CFR Part 11 §11.50 + ISO 9001 §9.3 | MUST | ⏳ planned |
| URS-A-031 | Approved minutes SHALL be **immutable** — corrections require a new revision with explicit reason. | System | ALCOA+ "Enduring" | MUST | ⏳ planned |
| URS-A-032 | Approved minutes PDF SHALL be hashed (SHA-256) and stored in HawkVault with hash anchored in audit trail. | System | ALCOA+ | MUST | ⏳ planned |

### A5. Action Item Tracking

| ID | Requirement | Persona | Reg anchor | MoSCoW | Current state |
|---|---|---|---|---|---|
| URS-A-040 | Action items SHALL be created from minutes with: title, description, owner, due date, type (info / CAPA / Change Request / Risk review). | Chair / QA Ops | ICH Q10 §1.6 | MUST | ⏳ planned |
| URS-A-041 | Action items of type CAPA / CR / Risk SHALL spawn linked records in the corresponding module — cross-module link maintained both ways. | System | ICH Q10 §1.6 | MUST | ⏳ planned |
| URS-A-042 | Action item closure SHALL require evidence + owner sign-off; overdue items SHALL escalate to Chair. | Owner | ICH Q10 §1.6 | MUST | ⏳ planned |
| URS-A-043 | MRM SHALL only transition to CLOSED state when all action items are CLOSED OR explicitly carried-forward by Chair (with reason). | System | ICH Q10 §1.6 | MUST | ⏳ planned |

### A6. Audit Trail + Data Integrity

| ID | Requirement | Persona | Reg anchor | MoSCoW | Current state |
|---|---|---|---|---|---|
| URS-A-050 | System SHALL write AuditTrail rows for every state transition, signature, input lock, minutes revision, action item creation/closure with mandatory reasonForChange. | System | 21 CFR Part 11 §11.10(e) | MUST | ⏳ planned |
| URS-A-051 | All MRM records SHALL be retained for the regulatory retention period (default 10 years; tenant-configurable). | System | 21 CFR Part 11 §11.10(c) | MUST | ⏳ planned |

---

## 4. Part B — Differentiator Requirements

| ID | Requirement | Strategic rationale | MoSCoW | Current state |
|---|---|---|---|---|
| URS-B-001 | An **Auto-MRM Input Compiler** SHALL aggregate inputs from all modules into a structured agenda — pre-meeting effort reduced from 2 weeks to 2 hours. | Major time-saver — no incumbent does this end-to-end | MUST | ⏳ planned (Q2 2027) |
| URS-B-002 | An **MRM Minutes Drafter AI** SHALL draft structured minutes from a meeting recording transcript (with citations to which agenda item each statement belongs). | Modern UX vs typing minutes in Word | SHOULD | ⏳ planned (transcription integration TBD) |
| URS-B-003 | The MRM dashboard SHALL surface **trend analysis** across N most recent MRMs — same KPI plotted over time, action item closure rate, recurring themes. | Strategic visibility for boards | MUST | ⏳ planned |
| URS-B-004 | Action items SHALL be **closed-loop with originating modules** — closing a CAPA spawned by MRM action item auto-closes the MRM action; opening a CAPA references the source MRM. | True PQS closure tracking | MUST | ⏳ planned |
| URS-B-005 | Approved minutes SHALL be **inspector-readable** — regulator opens MRM record, sees inputs + minutes + action item status (with linked records) in one screen. | Inspector-readiness as product feature | MUST | ⏳ planned |
| URS-B-006 | Every AI output SHALL be **grounded + cited + confidence-scored + audit-trailed**. | Part-11-grade AI traceability | MUST | ✅ (reuses platform `groundedGenerationService`) |

---

## 5. Out-of-Scope (Explicit Hand-Off)

- **Meeting calendar / room booking** — external (Outlook / Google Calendar integration future)
- **Live video meeting hosting** — use Zoom/Teams via standard links
- **Recording transcription** — integration TBD; for now, attach recording URL + manual transcript
- **Operating module KPIs themselves** — each module owns its KPI computation; MRM consumes
- **Board governance** beyond QMS (financial, ESG, strategic planning) — separate Board module (future)

---

## 6. Assumptions and Dependencies

- **Every operating module** exposes a `GET /api/<module>/mrm-input?from=...&to=...` endpoint returning structured input
- **Doc Control** stores the approved minutes PDF
- **CAPA / Change Control / Risk** modules accept programmatic creation of records linked back to MRM action item
- **Notification module** dispatches reminders, attendance asks, escalations
- E-sig method: password (bcrypt-verified)
- **Time** — MRM cadence computed in tenant's primary timezone

---

## 7. Acceptance Criteria

| URS ID range | Verification approach |
|---|---|
| A1 (scheduling) | Cron test: configure quarterly → verify Q2 + Q3 + Q4 scheduled |
| A2 (inputs) | Integration test: every module exposes input endpoint; aggregation works |
| A3 (meeting) | E2E: schedule → compile → attest → record minutes |
| A4 (minutes approval) | E-sig integration test; immutability test on approved minutes |
| A5 (action items) | E2E: create CAPA-type action → confirm CAPA created in CAPA module with back-link |
| A6 (audit trail) | Sample MRM → query trail → row per transition |
| B1 (auto-compile) | Per-module input completeness test; SME (Elena persona) walkthrough |
| B3 (trend analysis) | Multi-MRM scenario test; visual regression on trend chart |

---

## 8. Open Questions

1. **Default cadence per industry** — pharma typically quarterly; med-device may be annual; food may be more frequent. Ship per-vertical defaults?
2. **Input refresh during meeting** — if Chair asks "what's the latest CAPA count?" during the meeting, do we re-pull live or stick with locked snapshot?
3. **Anonymous voting / decisions** — some governance models prefer anonymous votes on contentious items. Today: not supported.
4. **Carry-forward action items** — formal mechanism to roll an open action to next MRM with Chair approval?
5. **External attendees** — board observers, consultants, regulator visitors. Tenant guest accounts?
6. **Sub-tenant rollup** — large enterprises with multi-site / multi-BU may want a corporate MRM that consumes site MRMs.
7. **Recording transcription provider** — Otter? AssemblyAI? Whisper self-hosted? Cost/privacy considerations.
8. **Confidentiality classification** of MRM minutes — some content may be restricted (e.g., regulator interactions). Per-section RBAC?

---

## 9. Traceability Index (URS ↔ Code)

| URS section | Primary code (planned) | Primary UI (planned) |
|---|---|---|
| A1 scheduling | `controllers/mrmSchedulerController.js`, `services/mrmCadenceService.js` | `/mrm`, `/mrm/upcoming` |
| A2 input compilation | `services/mrmInputCompilerService.js` | `/mrm/[id]/inputs` |
| A3 meeting record | `controllers/mrmMeetingController.js` | `/mrm/[id]/meeting` |
| A4 minutes approval | `controllers/mrmMinutesController.js`, `middlewares/requireESignature.js` | `/mrm/[id]/minutes`, `SignatureDialog` |
| A5 action items | `controllers/mrmActionController.js`, cross-module spawners | `/mrm/[id]/actions`, `/my-mrm-actions` |
| A6 audit trail | `services/auditTrailService.js` (cross-module) | `/mrm/[id]/audit-log` |
| B1 auto-compiler | `services/ai/mrmInputCompilerAgent.js` | `/mrm/[id]/inputs` (one-click) |
| B2 minutes drafter | `services/ai/mrmMinutesDrafterAgent.js` | `/mrm/[id]/meeting` (Draft from recording) |
| B3 trend analysis | `services/mrmTrendService.js` | `/mrm/trends` |
