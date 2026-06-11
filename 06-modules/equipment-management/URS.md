# URS — Equipment Management

| Field | Value |
|---|---|
| Module | Equipment Management |
| Owner | Product (Hawkeye Platform) |
| Status | DRAFT (forward-spec) |
| Version | 0.1 |
| Last updated | 2026-06-01 |
| Regulatory anchors | 21 CFR 211.68 (calibration), 21 CFR 211.182 (equipment cleaning + maintenance records), ICH Q7 §5, EU GMP Ch.3 + Annex 15, ISO 9001 §7.1.5, 21 CFR Part 11 |
| Source | Forward-spec; cross-refs `06-modules/batch-records/`, `06-modules/change-control/`, `06-modules/deviation/` |

---

## 1. Purpose and Scope

**Purpose.** Hawkeye Equipment Management is the QMS module for **equipment master records, calibration scheduling, maintenance records, and live status tracking** across manufacturing + lab assets. Calibration status is consumed real-time by Batch Records (out-of-cal blocks batch step execution).

**In scope:**
- Equipment master (specs, location, type, manufacturer, serial #, qualification status)
- Calibration scheduling (per-equipment-type cadence + per-instance overrides)
- Calibration execution + records + tolerance ranges + as-found/as-left data
- Preventive maintenance (PM) scheduling + execution
- Corrective maintenance (CM) ad-hoc + per-equipment runbooks
- Equipment status lifecycle (commissioned → in-service → out-of-cal → out-of-service)
- E-signature on calibration sign-off (QA) and decommissioning
- Cross-module gating: out-of-cal equipment blocks Batch Records; part replacement triggers Change Control

**Out of scope (handed off):**
- Equipment qualification (IQ/OQ/PQ) protocols → `06-modules/validation/` (future)
- CAPA arising from repeated equipment failures → `06-modules/capa/`
- Change Control for major equipment modifications → `06-modules/change-control/`
- IoT sensor real-time streams (future vertical pack)
- Predictive maintenance AI (scheduled Q3 2027)
- Spare-parts inventory management (future)

---

## 2. Stakeholders and Personas

| Persona | Role | Goals | Pain points without this module |
|---|---|---|---|
| **Maintenance Technician** (e.g., Vijay Patel) | Records calibration results, performs PM/CM tasks | Mobile-friendly entry; barcode equipment ID; pre-filled procedures | Paper logbooks; lost records; calibration certs as PDFs in shared drives |
| **Maintenance Lead** (e.g., Anita Desai) | Schedules calibration + PM; assigns technicians; reviews completion | Cal-due dashboard; auto-reminders; tech workload balance | Excel scheduler; missed cals discovered during audit |
| **QA Reviewer (Calibration)** (e.g., Kavita Joshi) | Approves calibration sign-off with e-sig | Single screen with as-found vs as-left + tolerance; pass/fail clear | Manual cert review; signature on paper |
| **Production User** (read-only) | Checks equipment cal status before scheduling production | Real-time eligibility | Hunt down maintenance to ask |
| **Tenant Admin** | Configures equipment types, cal cadences, RBAC | Per-tenant tuning | Vendor-controlled config |

---

## 3. Part A — Foundational Requirements

### A1. Equipment Master

| ID | Requirement | Persona | Reg anchor | MoSCoW | Current state |
|---|---|---|---|---|---|
| URS-A-001 | System SHALL maintain a master record for every regulated equipment with: equipmentId (unique), equipmentType, manufacturer, model, serialNumber, location, installedDate, qualificationStatus. | Maintenance Lead | 21 CFR 211.182 | MUST | ⏳ planned |
| URS-A-002 | Each equipment SHALL belong to a `tenantId` and a `site` (multi-site tenants supported). | System | Multi-tenancy | MUST | ⏳ planned |
| URS-A-003 | Equipment master SHALL be linkable to MBR steps (which step uses which equipment-type or equipment-id). | System | 21 CFR 211.188(b)(11) | MUST | ⏳ planned |

### A2. Calibration Lifecycle

| ID | Requirement | Persona | Reg anchor | MoSCoW | Current state |
|---|---|---|---|---|---|
| URS-A-010 | System SHALL define a calibration cadence per equipmentType + optional per-instance override. | Maintenance Lead | 21 CFR 211.68 | MUST | ⏳ planned |
| URS-A-011 | System SHALL automatically compute `calDueDate` and surface "due in N days" / "overdue by N days" on dashboards. | System | UX/baseline | MUST | ⏳ planned |
| URS-A-012 | Calibration execution SHALL capture: technician, standard used (with cert traceability), as-found values, as-left values, tolerance, pass/fail decision, attached cert PDF. | Technician | 21 CFR 211.68 | MUST | ⏳ planned |
| URS-A-013 | Out-of-tolerance as-found SHALL auto-create a Deviation against all batches that used the equipment since last cal (retrospective batch impact). | System | 21 CFR 211.192 | MUST | ⏳ planned |
| URS-A-014 | QA SHALL e-sign the calibration record (signatureMeaning=APPROVED) before status reverts from CALIBRATION_IN_PROGRESS → CALIBRATED. | QA | 21 CFR Part 11 §11.50 | MUST | ⏳ planned |

### A3. Maintenance (PM + CM)

| ID | Requirement | Persona | Reg anchor | MoSCoW | Current state |
|---|---|---|---|---|---|
| URS-A-020 | System SHALL support preventive maintenance scheduling per equipment with cadence + procedure linkage. | Maintenance Lead | ICH Q7 §5.2 | MUST | ⏳ planned |
| URS-A-021 | System SHALL support corrective maintenance ad-hoc capture with symptom, root cause (free text), parts replaced, time-on-task. | Technician | ICH Q7 §5.2 | MUST | ⏳ planned |
| URS-A-022 | Replacement of a critical part SHALL trigger Change Control evaluation (auto-create draft Change Request). | System | EU GMP Ch.3 §3.4 | MUST | ⏳ planned |

### A4. Equipment Status State Machine

| ID | Requirement | Persona | Reg anchor | MoSCoW | Current state |
|---|---|---|---|---|---|
| URS-A-030 | System SHALL model status as 6 states: **COMMISSIONED → IN_SERVICE → CALIBRATION_DUE → CALIBRATION_IN_PROGRESS → CALIBRATED → OUT_OF_SERVICE**. | System | EU GMP Annex 15 | MUST | ⏳ planned |
| URS-A-031 | Transitions SHALL be enforced by `equipmentPhaseService.canTransition()` with role + prerequisite checks. | System | ALCOA+ | MUST | ⏳ planned |
| URS-A-032 | OUT_OF_SERVICE (decommissioning) SHALL require e-sig + reason; equipment becomes ineligible for any future batch. | QA | 21 CFR 211.68 | MUST | ⏳ planned |

### A5. Cross-Module Gating

| ID | Requirement | Persona | Reg anchor | MoSCoW | Current state |
|---|---|---|---|---|---|
| URS-A-040 | System SHALL expose a real-time eligibility API (`GET /api/equipment/:id/eligibility`) consumed by Batch Records at step entry; CALIBRATION_DUE / CALIBRATION_IN_PROGRESS / OUT_OF_SERVICE → ineligible. | System | 21 CFR 211.68 + 211.188 | MUST | ⏳ planned |
| URS-A-041 | When an in-progress calibration finds out-of-tolerance as-found, system SHALL identify all batches that used this equipment since the prior cal-passed timestamp and emit batch-impact records. | System | 21 CFR 211.192 | MUST | ⏳ planned |

### A6. Audit Trail + Data Integrity

| ID | Requirement | Persona | Reg anchor | MoSCoW | Current state |
|---|---|---|---|---|---|
| URS-A-050 | System SHALL write AuditTrail rows for every status change, calibration, maintenance event, and signature with mandatory reasonForChange. | System | 21 CFR Part 11 §11.10(e) | MUST | ⏳ planned |
| URS-A-051 | Calibration cert PDFs SHALL be stored with SHA-256 hash anchored in audit trail. | System | ALCOA+ "Enduring" | MUST | ⏳ planned |

---

## 4. Part B — Differentiator Requirements

| ID | Requirement | Strategic rationale | MoSCoW | Current state |
|---|---|---|---|---|
| URS-B-001 | An **AI Predictive Maintenance** model SHALL detect calibration drift (slow trend toward out-of-tolerance) and recommend early intervention. | Reduce surprise OOT events; reduce batch impact | SHOULD | ⏳ planned Q3 2027 |
| URS-B-002 | A **Calibration Schedule Optimizer** SHALL suggest cadence adjustments based on actual drift history per instance (longer for stable, shorter for drifty). | Cost optimization without compliance risk | SHOULD | ⏳ planned |
| URS-B-003 | Equipment status SHALL be **batch-aware** — system SHALL surface "N batches in flight using this equipment" before scheduling cal or maintenance to minimize disruption. | Operational coordination | MUST | ⏳ planned |
| URS-B-004 | Calibration impact analysis SHALL be **automated** — when a cal fails as-found, the system SHALL produce the impacted-batch list in < 5 sec (today: hours of manual review). | Inspector-ready, recall-ready | MUST | ⏳ planned |
| URS-B-005 | Hawkeye SHALL bundle IoT sensor data ingest (planned vertical pack) for live equipment telemetry feeding both calibration drift detection AND batch real-time-release. | Future-proof for Industry 4.0 pharma | SHOULD | ⏳ planned (vertical pack) |

---

## 5. Out-of-Scope (Explicit Hand-Off)

- **Equipment qualification (IQ/OQ/PQ)** protocols and execution → Validation module (future)
- **Change Control** for major equipment modifications → Change Control module
- **CAPA** for repeated equipment failures → CAPA module
- **IoT sensor real-time ingest** — deferred to vertical pack
- **Spare parts inventory / procurement** — out of scope

---

## 6. Assumptions and Dependencies

- **Document Control** owns calibration procedures + maintenance runbooks; this module references by `documentId`
- **Training** owns technician qualification; this module checks technician training before allowing cal-record entry
- **Batch Records** is the primary consumer of equipment eligibility
- **Change Control** is a sink for part-replacement events
- **Time** — equipment cal-due computed in equipment's local timezone; all stored UTC

---

## 7. Acceptance Criteria

| URS ID range | Verification approach |
|---|---|
| A1 (master) | CRUD E2E test |
| A2 (calibration) | E2E: schedule, execute, sign-off, confirm status update |
| A3 (maintenance) | E2E PM + CM; confirm Change Control auto-draft on part replacement |
| A4 (state machine) | Unit tests on `equipmentPhaseService.canTransition()` |
| A5 (cross-module gating) | Integration test: try to start batch step with out-of-cal equipment → blocked |
| A6 (audit trail) | Sample equipment → query trail → row per event |
| B4 (impact analysis) | Simulate failed-as-found cal → confirm batch impact list generated < 5 sec |

---

## 8. Open Questions

1. **Cal cadence default per equipment type** — should we ship vertical-pack templates (pharma vs med-device) or require tenant config?
2. **External standards traceability** — do we model the chain (e.g., field standard → NIST-traceable lab standard → primary standard) or just store cert IDs?
3. **Equipment family inheritance** — should sibling equipment share procedures + cadence by default?
4. **Mobile UX for shop-floor cal entry** — design deferred to pilot feedback
5. **Recall trigger** — when batch impact is identified, do we trigger a Recall workflow automatically or surface for human decision?
6. **Cleaning records (211.182)** — do we model cleaning as a third maintenance type or separate?

---

## 9. Traceability Index (URS ↔ Code)

| URS section | Primary code (planned) | Primary UI (planned) |
|---|---|---|
| A1 master | `controllers/equipmentController.js` | `/equipment`, `/equipment/[id]` |
| A2 calibration | `controllers/calibrationController.js` | `/equipment/[id]/calibrations`, `/calibration/queue` |
| A3 maintenance | `controllers/maintenanceController.js` | `/equipment/[id]/maintenance`, `/maintenance/queue` |
| A4 state machine | `services/equipmentPhaseService.js` | `EquipmentStatusChip` |
| A5 eligibility | `services/equipmentEligibilityService.js` | (consumed by Batch Records UI) |
| A6 audit trail | `services/auditTrailService.js` (cross-module) | `/equipment/[id]/audit-log` |
| B1 predictive maintenance | `services/ai/predictiveMaintenanceAgent.js` | dashboard widget |
| B4 impact analysis | `services/calibrationImpactService.js` | `/equipment/[id]/impact-analysis` |
