# Backlog Spec — Audit Subtypes & Template Layer

> Engineering-ready specification to extend the Audit Management module from **3 base audit types** to the **full GxP audit taxonomy** (regulatory, internal, in/out-licensing, API/excipient/PM/FP/GxP-misc site, service-provider, testing-lab, PSCI/ESG) — delivered as **configuration + templates on the existing base types**, with **no change to the core audit architecture** (preserves GAMP Cat 4 "configuration, not customization").

| Field | Value |
|---|---|
| Item | `HK-BL-AUDIT-SUBTYPES` |
| Module | Audit Management |
| Status | **Ready for grooming** |
| Owner | Product (audit) · Eng (audit services) |
| Priority | Medium-High (named in customer interlinkage; closes positioning §7.1.1 gap) |
| Effort (T-shirt) | **M** (config + templates + small UI; no core-engine change) |
| Sources | Positioning §7.1.1 · Audit UNS req 35 · client *Automation Interlinkage* list |

---

## 1. Problem / context

Today the module ships **three base audit types** captured at creation and immutable thereafter:
`hosted` (inbound — customer/regulator audits us), `conducted` (outbound — we audit a supplier), `internal` (self-inspection) — *Audit UNS req 35*.

Customers (per the *Automation Interlinkage* map) run a richer spread: **Regulatory, Internal, In/Out-licensing, API-site, Excipient-site, PM-site, FP-site, GxP-misc-site, External-service-provider, External-testing-lab, PSCI/ESG**. These are **not new workflows** — they are the existing `conducted`/`internal`/`hosted` flow with **different scope, questionnaire templates, default reviewer roles, and reporting tags**. We should expose them as **subtypes + templates**, not new modules.

## 2. Goal & non-goals

**Goal:** let a tenant pick a precise **audit subtype** at creation; the subtype drives the default questionnaire/intimation/PAQ template, suggested reviewer roles, and report classification — reusing the existing state machine, e-sig, and audit-trail unchanged.

**Non-goals:** no new state machine; no change to e-signature/audit-trail; we are **not** building a regulator's inspection tool (regulatory = auditee inspection-*readiness* only); no marketplace coupling.

## 3. Proposed design (config + template layer)

### 3.1 Data model (additive, non-breaking)
On `AuditRequestsMaster` (or its config), add:

| Field | Type | Notes |
|---|---|---|
| `auditType` | enum (existing) | `hosted` · `conducted` · `internal` — unchanged base |
| `auditSubtype` | string (enum, **new**) | one of the registry values (§3.2); nullable → behaves as today |
| `auditTrigger` | enum (**new**) | `routine` (default) · `for_cause` · `capa_follow_up` |
| `triggerRefId` / `triggerRefType` | ref (**new**) | for `for_cause`/`capa_follow_up` → source deviation/complaint/CAPA/observation |
| `templateBindingId` | ref (**new**) | resolved default questionnaire/PAQ template for the subtype (overridable) |

New tenant-scoped collection **`AuditSubtypeConfig`** (the registry):
```
{ tenantOrgId, subtypeKey, label, baseType,            // maps subtype -> base auditType
  defaultQuestionnaireTemplateId, defaultIntimationTemplateId, defaultPaqTemplateId,
  suggestedReviewerRoles[], reportTags[], enabled }
```
Seed a platform-default registry (below); tenants enable/disable + remap templates — **config, not code**.

### 3.2 Subtype registry (platform defaults)

| subtypeKey | label | baseType | default reviewer emphasis | reportTag |
|---|---|---|---|---|
| `internal` | Internal / Self-inspection | internal | QA (independent) | `internal` |
| `supplier_api_site` | API site audit | conducted | QA + technical SME | `supplier`,`api` |
| `supplier_excipient_site` | Excipient site audit | conducted | QA | `supplier`,`excipient` |
| `supplier_pm_site` | Packaging-material (PM) site audit | conducted | QA + packaging SME | `supplier`,`pm` |
| `supplier_fp_site` | Finished-product (FP) site audit | conducted | QA | `supplier`,`fp` |
| `supplier_gxp_misc` | GxP-misc item site audit | conducted | QA | `supplier`,`gxp-misc` |
| `service_provider` | External service-provider (laundry, calibration, IT, sterilization) | conducted | QA + functional owner | `service-provider` |
| `testing_lab` | External testing-lab audit | conducted | QC/QA | `lab` |
| `inlicensing_dd` | In-licensing due-diligence | conducted | QA + BD | `licensing`,`in` |
| `outlicensing_dd` | Out-licensing due-diligence | conducted | QA + BD | `licensing`,`out` |
| `psci_esg` | PSCI / ESG audit | conducted | QA + EHS/sustainability | `psci`,`esg` |
| `regulatory_readiness` | Regulatory inspection readiness | hosted | QA Head | `regulatory`,`readiness` |
| `certification` | Certification audit (ISO) | hosted | QA Head | `certification` |

### 3.3 Triggers (orthogonal to subtype)
- `for_cause`: any subtype can be flagged for-cause; `triggerRef*` links the originating event; surfaces a "for-cause" banner + tighter SLA.
- `capa_follow_up`: a re-audit launched from the **SURVEILLANCE** phase or a CAPA; pre-links the prior audit + CAPA.

## 4. Config & UX surface
- **Admin → Audit settings:** enable/disable subtypes per tenant; map each subtype's default templates + suggested roles (reuses existing template registry — `INTIMATION_LETTER`, `PRE_AUDIT_QUESTIONNAIRE`, questionnaire templates incl. **Template #3**).
- **Request New Audit form:** after `auditType`, add an **Audit Subtype** picker (filtered to the chosen base type) + an **Audit Trigger** selector (Routine / For-cause / CAPA follow-up). Selecting a subtype pre-fills the questionnaire/PAQ template (still overridable).
- Backward compatible: leaving subtype blank = today's behavior.

## 5. Acceptance criteria
1. A tenant can create an audit with any of the 13 subtypes; the subtype is captured, immutable post-creation, and shown on the audit + in reports/filters.
2. Subtype pre-selects the correct default questionnaire/PAQ/intimation template; user can override.
3. `for_cause` and `capa_follow_up` triggers are recordable, link to the source record, and appear in the audit trail.
4. Existing audits (no subtype) and the existing 3 base types are **unaffected** (regression-clean).
5. Report builder & audit list can **filter/group by subtype and trigger**.
6. No change to the audit state machine, e-signature ceremony, or audit-trail schema.
7. Subtype registry is tenant-configurable (enable/disable, template remap) without code deploy.

## 6. Impacted areas
- **Backend:** `AuditRequestsMaster` schema (+4 fields, additive); new `AuditSubtypeConfig` model + seed; `audit-request` create/validate; report tags; list/report filters. *No phase-service change.*
- **Frontend:** request form subtype/trigger pickers; audit detail badge; list/report filters.
- **Seed:** platform-default subtype registry + a starter template per subtype (questionnaire content can reuse/clone Template #3 as the base).
- **Docs:** update Audit URS (req 35) + positioning §7.1.1 (done).

## 7. Risk & GAMP note
Low risk — purely additive, nullable fields + a config registry; the regulated spine (state machine, e-sig, audit trail) is untouched. Because subtypes/templates are **data, not code**, this remains **GAMP Cat 4 configuration** and does not push any workflow to Cat 5.

## 8. Traceability
| Need | Source |
|---|---|
| Full audit-type taxonomy | client *Automation Interlinkage* list; Positioning §7.1.1 |
| 3 base types today | Audit UNS req 35 |
| Config-not-code constraint | GAMP-CAT-4-COMPLIANCE §3 |
