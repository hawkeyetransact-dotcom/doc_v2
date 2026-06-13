# USER NEED SPECIFICATION

| **TITLE** | USER NEED SPECIFICATION | | |
|---|---|---|---|
| **DOC #** | UNS/HK-AUDIT/001 | **Department** | Quality Assurance / Product |
| **Revision** | 00 | **Supersedes** | NA |
| **Page #** | 1 of 1 | **Module** | Audit Management |

---

# USER NEED SPECIFICATION

# FOR

# S.M.A.R.T. HAWK AUDIT MANAGEMENT MODULE

---

## TABLE OF CONTENTS

| § | Section |
|---|---|
| 1.0 | APPROVAL |
| 2.0 | INTRODUCTION |
| 3.0 | PURPOSE |
| 4.0 | SCOPE |
| 5.0 | REFERENCES |
| 6.0 | GENERAL DESCRIPTION |
| 7.0 | FUNCTIONAL ANALYSIS SYSTEM TECHNIQUE (FAST) |
| 8.0 | USER REQUIREMENTS / NEEDS |
| 9.0 | REGULATORY REQUIREMENTS |
| 10.0 | MARKET / CUSTOMER PERSPECTIVE OF THE PROBLEM STATEMENT |
| 11.0 | TARGET MARKET DESCRIPTION |
| 12.0 | TARGET CUSTOMER DESCRIPTION |
| 13.0 | SOLUTION OVERVIEW |
| 14.0 | TECHNOLOGY OVERVIEW |
| 15.0 | REVISION HISTORY |

---

## 1.0 APPROVAL

| Function | Department | Name | Signature | Date |
|---|---|---|---|---|
| Prepared By | Quality Assurance / Product | | | |
| Reviewed By | Product Management | | | |
| Reviewed By | Engineering | | | |
| Reviewed By | Compliance | | | |
| Reviewed By | Customer Success | | | |
| Reviewed By | Quality Assurance | | | |
| Approved By | Head QA / Founder Lead | | | |

---

## 2.0 INTRODUCTION

Pharmaceutical manufacturing organizations — including originator pharma, contract manufacturing organizations (CDMOs), Active Pharmaceutical Ingredient (API) makers, and packaging/labelling subcontractors — host and conduct a high volume of GxP audits annually. A representative Tier-3 CDMO with three sites and five Quality Assurance (QA) staff typically participates in 30 or more supplier audits per year, plus a comparable volume of customer-led second-party audits and periodic regulatory (FDA, EMA, MHRA, WHO PQ, PIC/S) inspections.

The status-quo tooling for audit management — spreadsheets, email threads, shared drives, point CAPA trackers, and external consultants — consumes approximately 60% of the QA team's calendar time on audit preparation, response, and remediation. In addition to direct cost (~₹95L / ~$115K per year per representative customer), the status quo carries qualitative burden: weekend war-rooms before regulatory inspections, recurring findings that resurface every renewal cycle, and the inability to defend a complete "who changed what, when, why" lineage to a regulator.

S.M.A.R.T. Hawk is an AI-native Enterprise Quality Management System (EQMS) for the regulated supply chain. The Audit Management module is the headline module of the platform — the entry point through which most customers adopt S.M.A.R.T. Hawk — and is the principal module measured during the 60-day Proof of Concept that precedes paid customer engagement.

This User Need Specification (UNS) captures the user needs that the Audit Management module shall satisfy. It is the input to the module's User Requirements Specification (URS.md), Functional Specification (FRS), Configuration Specification, and downstream IQ / OQ / PQ validation artifacts as required by GAMP 5 Category 4 supplier-leveraged validation per ISPE *GAMP 5 Guide, 2nd Edition* (July 2022) and 21 CFR Part 11 §11.10(a) validation.

---

## 3.0 PURPOSE

The purpose of this document is to identify and establish the intended use of the S.M.A.R.T. Hawk Audit Management module as the principal computerized system supporting the customer's audit lifecycle from intake through closeout, including evidence collection, AI-assisted finding drafting, electronic signature ceremony, audit-trail capture, CAPA spawning, and inspection-readiness pack assembly.

The Audit Management module is delivered as a configured product (GAMP 5 Category 4) supplied as multi-tenant Software-as-a-Service (SaaS) with optional sovereign on-premise deployment for Enterprise customers. The customer is responsible for the configuration of their tenant (vocabulary, standards selected, workflow definitions, role assignments, AI prompt templates) and for executing customer-side validation of the configuration per GAMP 5 Cat 4 supplier-leverage and FDA Computer Software Assurance (CSA) risk-based assurance frameworks.

This UNS describes the user needs that the supplied module shall satisfy. It does NOT describe the medicinal-product-specific user needs of any customer's downstream workflow — those remain the customer's responsibility within the agreed configuration surface.

---

## 4.0 SCOPE

The product in the scope of this document is the **S.M.A.R.T. Hawk Audit Management module**, including:

- The Audit Management module application code, data models, workflows, AI integrations, and user interface
- The cross-cutting platform capabilities the module depends on: authentication, multi-tenant isolation, role-based access control, audit-trail capture, electronic signature ceremony, document storage, notification engine, and AI Gateway
- The supplier portal that enables external auditees (supplier-side QA teams) to participate in the customer's hosted audits
- The Validation Accelerator Package artifacts the module ships to customers (vendor product Functional Specification, IQ/OQ scripts pre-executed against the vendor product, Configuration Specification template, Pre-filled Vendor Assessment Questionnaire, Periodic Vendor Audit Pack)

The following are explicitly **out of scope**:

- The customer's medicinal product registration, manufacturing process, or batch-record content (governed by the customer's separate quality systems)
- Workflows requiring custom code modification of the S.M.A.R.T. Hawk product (these would push the workflow to GAMP Category 5; available under a separate customization engagement)
- The customer's IT infrastructure outside S.M.A.R.T. Hawk (Identity Provider, network, endpoint security)
- Customer-side validation execution (URS, Configuration Spec, customer-environment IQ, configuration-specific OQ, PQ, Validation Summary Report — these are the customer's GAMP Cat 4 responsibility per the Validation Accelerator Package guidance)

The Audit Management module is delivered from a common code base to all customers and configured per tenant — never per-customer code-forked.

---

## 5.0 REFERENCES

| Document Title | Document No. |
|---|---|
| ISPE GAMP 5: A Risk-Based Approach to Compliant GxP Computerized Systems, 2nd Edition | ISPE GAMP 5 2nd Ed (Jul 2022) |
| Electronic Records; Electronic Signatures (US) | 21 CFR Part 11 |
| Code of Federal Regulations — Current Good Manufacturing Practice for Finished Pharmaceuticals | 21 CFR Part 210 / 211 |
| Computer Software Assurance for Production and Quality System Software — Final Guidance (US FDA) | FDA CSA (Final 24 Sep 2025; re-issued 3 Feb 2026) |
| Quality System Regulation for Medical Device Manufacturers (US FDA) | 21 CFR Part 820 (QMSR, effective 2 Feb 2026) |
| EU GMP Annex 11 — Computerised Systems (2011 text + 7 Jul 2025 draft revision) | EU GMP Annex 11 |
| EU GMP Annex 22 — Artificial Intelligence (expected 2026) | EU GMP Annex 22 |
| EU GMP Annex 16 — Certification by a Qualified Person and Batch Release | EU GMP Annex 16 |
| MHRA "GxP Data Integrity Definitions and Guidance for Industry" (Mar 2018, Rev 1) | MHRA GxP DI 2018 |
| WHO Technical Report Series 1033, Annex 4 — Data integrity guideline | WHO TRS 1033 (2021) |
| Pharmaceutical Quality System | ICH Q10 |
| Quality Risk Management | ICH Q9 (R1) |
| Good Manufacturing Practice Guide for Active Pharmaceutical Ingredients | ICH Q7 |
| Pharmaceutical Development | ICH Q8 (R2) |
| Quality Management Systems — Requirements | ISO 9001:2015 |
| Medical devices — Quality management systems — Requirements for regulatory purposes | ISO 13485:2016 |
| Medical devices — Application of risk management to medical devices | ISO 14971:2019 |
| FDA Good Machine Learning Practice — 10 Guiding Principles | FDA/HC/MHRA GMLP (Oct 2021) |
| EMA Reflection Paper on the use of Artificial Intelligence in the Medicinal Product Lifecycle (CHMP/CVMP adopted Sept 2024) | EMA AI Reflection Paper |
| ISPE Good Practice Guide: Digital Validation (Validation 4.0) | ISPE GPG: Digital Validation (Apr 2025) |
| Information technology — Security techniques — Information security management systems — Requirements | ISO/IEC 27001:2022 |
| Trust Services Criteria for Service Organizations (SOC 2) | AICPA SOC 2 |
| Information technology — Cloud computing — Data flow, data categories and data use | ISO/IEC 19944 |
| Health informatics — Information security management in health using ISO/IEC 27002 | ISO 27799 |
| Web Content Accessibility Guidelines 2.2 | W3C WCAG 2.2 (Oct 2023) |
| Accessibility requirements for ICT products and services | EN 301 549 v3.2.1 |
| Information and Communication Technology — Section 508 Standards (US Federal) | Section 508 |
| Digital Personal Data Protection Act (India) | India DPDP Act 2023 |
| General Data Protection Regulation (EU) | EU GDPR |
| Health Insurance Portability and Accountability Act — Security Rule | US HIPAA (when applicable) |
| Schedule M — Good Manufacturing Practices and Requirements of Premises, Plant and Equipment for Pharmaceutical Products (India) | India Schedule M (2023 revision) |
| WHO Prequalification Programme — Good Manufacturing Practices | WHO PQ GMP |
| PIC/S Guide to Good Manufacturing Practice for Medicinal Products | PIC/S PE 009 |
| S.M.A.R.T. Hawk Platform Overview (5-layer architecture canonical reference) | Doc_V2 / PLATFORM-OVERVIEW.md |
| S.M.A.R.T. Hawk GAMP 5 Category 4 Compliance Reference | Doc_V2 / GAMP-CAT-4-COMPLIANCE.md |
| S.M.A.R.T. Hawk System Architecture | Doc_V2 / ARCHITECTURE.md |
| S.M.A.R.T. Hawk Frontend Architecture | Doc_V2 / FRONTEND.md |
| S.M.A.R.T. Hawk Security Architecture | Doc_V2 / SECURITY.md |
| S.M.A.R.T. Hawk AI Architecture (Layer 3) | Doc_V2 / AI-ARCHITECTURE.md |
| S.M.A.R.T. Hawk Accessibility Reference | Doc_V2 / ACCESSIBILITY.md |
| S.M.A.R.T. Hawk Design Principles | Doc_V2 / DESIGN-PRINCIPLES.md |
| S.M.A.R.T. Hawk Design Tokens | Doc_V2 / DESIGN-TOKENS.md |
| S.M.A.R.T. Hawk User Flows | Doc_V2 / USER-FLOWS.md |
| S.M.A.R.T. Hawk Audit Management Module — URS | 06-modules/audit-management/URS.md |
| S.M.A.R.T. Hawk Audit Management Module — DESIGN | 06-modules/audit-management/DESIGN.md |
| S.M.A.R.T. Hawk Audit Management Module — ARCHITECTURE | 06-modules/audit-management/ARCHITECTURE.md |
| S.M.A.R.T. Hawk Audit Management Module — STORYBOOK | 06-modules/audit-management/STORYBOOK.md |
| S.M.A.R.T. Hawk ADR-001 — Five-Layer Architecture | 04-engineering/08-adrs/ADR-001-five-layer-architecture.md |
| S.M.A.R.T. Hawk ADR-002 — Multi-LLM Gateway | 04-engineering/08-adrs/ADR-002-multi-llm-gateway.md |
| S.M.A.R.T. Hawk ADR-003 — Cite-or-Fallback | 04-engineering/08-adrs/ADR-003-cite-or-fallback.md |

---

## 6.0 GENERAL DESCRIPTION

### Product description

The S.M.A.R.T. Hawk Audit Management module is the principal computerized system supporting the GxP audit lifecycle for pharmaceutical manufacturers, CDMOs, and other regulated-supply-chain organisations. It implements the universal 5-pillar runtime pipeline of the S.M.A.R.T. Hawk Domain Engine (Layer 4 of the 5-layer architecture) — Sense → Monitor → Analyze → Record → Trace — applied to the audit domain, with grounded AI assistance at every step and human electronic signature at every record commit.

The module supports three audit types out of the box:

- **Hosted (inbound) supplier audits** — the customer is audited by a downstream customer's QA team or by a regulator
- **Conducted (outbound) supplier audits** — the customer audits their own suppliers
- **Internal audits** — the customer's quality system audits itself periodically per ICH Q10

The module is delivered as multi-tenant Software-as-a-Service with optional sovereign on-premise deployment, supporting per-tenant data residency in India (Mumbai, default), United States (US-East), or European Union (Frankfurt). It is multi-persona: Quality Assurance Head, Quality Assurance Manager / Analyst, Operations / Subject Matter Expert, External Auditor, Auditee (supplier-side QA), and Tenant Administrator all interact with persona-tailored interfaces against the same underlying audit record.

The module integrates inseparably with the S.M.A.R.T. Hawk platform's cross-cutting capabilities: Single Sign-On via SAML 2.0 / OIDC, role-based access control at module and record level, the tamper-evident cross-module audit trail (21 CFR §11.10(e); Annex 11 §9), the electronic signature ceremony (Part 11 §11.50 + §11.200), the Multi-LLM AI Gateway (Anthropic Claude, OpenAI GPT, Google Gemini, local vLLM Llama 3), the cite-or-fallback grounded generation guarantee, and the AI Audit Trail capturing model + version + prompt hash + retrieval set + confidence + user disposition per AI call.

### General product design / usage query / expectation

| # | Query Statement | Quality Assurance Head (Buyer / Sponsor) | Quality Assurance Manager / Analyst (Daily User) | External Auditor / Auditee (Supplier QA) |
|---|---|---|---|---|
| Q1 | What do you want the product (a computerized system component of the customer's broader quality system) to do? | The Audit Management module shall reduce my team's annual audit-prep, response, and remediation cost by approximately 40% versus our current spreadsheet-and-email baseline, while improving our regulatory defensibility. | The Audit Management module shall be the single inbox and single source of truth for every audit my team participates in, with AI assistance that drafts but never commits, and an audit trail that is always one click away. | The Audit Management module shall provide me with a structured questionnaire-and-evidence portal where I can respond to my customer's audit request without re-creating evidence I have already provided to other customers. |
| Q2 | Who is going to use it? | The Quality Assurance Head, who owns the budget for the EQMS, attends the Day-60 Proof-of-Concept review, signs the customer contract, and reviews aggregate dashboards weekly. | Quality Assurance Managers and Analysts, who use the module daily, host or conduct individual audits, draft findings, and approve CAPAs spawned from those findings. | External Auditors (from customer or regulator) who visit the supplier site and use the module read-mostly; and Auditees (supplier-side QA) who respond to questionnaires and upload evidence via the supplier portal. |
| Q3 | When will it be used? | Weekly for dashboard review; monthly for Management Review Meeting inputs; at every audit closeout requiring sponsor sign-off; at every quarterly external customer audit. | Daily during audit prep weeks; intensively during on-site audit days; continuously for finding tracking and CAPA closure. | Per inbound audit request received via the supplier portal; per outbound site visit conducted at a customer-supplier site. |
| Q4 | What important attributes or features should be considered? | GAMP 5 Cat 4 vendor classification (so my validation team can leverage vendor evidence); 21 CFR Part 11 and EU GMP Annex 11 conformance by design (so I can defend the system to FDA/EMA); ALCOA+ data integrity enforced at Layer 1; data residency control; vendor's no-AI-training contractual commitment; SOC 2 attestation; right-to-audit. | An audit-trail one click away on every record; phase stepper visible at all times; AI drafts always cite source or return "insufficient evidence"; e-sig ceremony per Part 11 §11.50 + §11.200 on every signed action; keyboard-first navigation; print-ready PDF for every closure certificate. | Ability to respond from a single login regardless of which customer is auditing me; ability to reuse evidence across customers; transparent finding criteria; my response data is mine and exportable on request. |
| Q5 | How will the user interact with the product? | Via the web UI dashboard, AskHawk conversational queries about audit status, and the per-audit closure certificates that require sponsor e-sign. | Via the web UI phase stepper, evidence ledger, AI-draft panel with citation chips, findings table, signature dialog, and the AskHawk drawer for in-context compliance questions. | Via the supplier portal web UI, with SSO authentication into the customer's S.M.A.R.T. Hawk tenant context, section-assignment workflows, evidence upload, and AI-assisted narrative response drafting. |
| Q6 | What type of procedures will the product be used for? | Strategic procedures — supplier qualification governance, periodic Management Review of supplier audit outcomes, regulatory inspection readiness, customer-contractual quality reporting. | Operational procedures — supplier audit scheduling, questionnaire authoring, evidence review, finding drafting, CAPA spawning, audit closure, audit-trail review at batch release. | Reactive procedures — responding to a received audit questionnaire, uploading evidence per assigned section, attending an on-site audit, signing-off on responses, receiving findings and CAPA assignments. |
| Q7 | Is the product used once, or repeatedly? | Used continuously throughout the customer's contractual term with S.M.A.R.T. Hawk; renewed annually; multi-year contracts available. | Used daily for the duration of the customer's contractual term. | Used per audit cycle; the same supplier may interact with the same S.M.A.R.T. Hawk tenant repeatedly over years. |
| Q8 | What other systems will the module interact with? | Customer's Identity Provider (Okta / Azure AD / Google) for SSO; customer's email system for notifications; potentially customer's ERP (SAP / Oracle) and LIMS for evidence import. | Other S.M.A.R.T. Hawk modules within the same tenant: Document Control (for cited SOPs), CAPA (for spawned actions), Deviation (for linked deviations), Supplier Management (for supplier master), Training (for auditor credentials), Risk Management (for risk-weighted findings), Management Review (for aggregate inputs). | DigiLocker (Indian government document vault) for evidence import where applicable; customer's own document systems via secure file upload. |

---

## 7.0 FUNCTIONAL ANALYSIS SYSTEM TECHNIQUE (FAST)

| Steps | Requirements |
|---|---|
| 1.1 | Main function and break down the main function into sub-functions |

| Quality Assurance Head (Sponsor) | Quality Assurance Manager / Analyst (Daily user) | External Auditor / Auditee (Supplier QA) |
|---|---|---|
| **Strategic governance** — Aggregate dashboard review · sign-off on audit closures requiring sponsor authority · authorize CAPA actions exceeding QA Manager approval limit · attend Day-60 PoC review · sign customer contract | **Audit lifecycle execution** — Create or accept audit request · select applicable standard · author or accept questionnaire · assign sections to operations / SME · review uploaded evidence · invoke AI finding drafter · review and edit AI-drafted findings · e-sign findings (Part 11 §11.50) · spawn CAPAs from findings · review audit-trail at batch release (Annex 11 §15) · sign closeout (Part 11 §11.50) · generate audit closure certificate (PDF) | **Audit response execution** — Receive customer audit request via supplier portal · assign sections to internal team · upload evidence per section · author narrative response per section (AI-assisted, cite-or-fallback) · review and e-sign response · receive findings · acknowledge findings · respond to CAPA assignments |
| **Configuration governance** — Approve tenant-level configuration changes (vocabulary · standards · workflow definitions · AI prompt templates) · attend annual Periodic Vendor Audit · review Vendor Quality Manual and SDLC evidence | **Operational governance** — Manage user provisioning (within tenant_admin scope) · review weekly metrics · investigate slow audit closures · escalate stalled CAPAs · participate in quarterly Management Review | **Site-level governance** — Manage supplier-side user provisioning · review aggregate response performance · participate in joint quality agreement reviews with customer |
| **Compliance evidence** — Author the customer-side Validation Summary Report citing S.M.A.R.T. Hawk's GAMP Cat 4 Validation Accelerator Package · maintain customer-side audit-trail review records per Annex 11 §11 · prepare for regulatory inspection · attend FDA / EMA / MHRA / WHO PQ inspections | **Compliance execution** — Execute customer-side configuration-specific OQ on every S.M.A.R.T. Hawk release classified as functional · spot-check audit trail · participate in periodic supplier audits | **Compliance reciprocity** — Maintain own supplier-side validation per customer's quality agreement · share validation status when customer requests |

| Steps | Requirements |
|---|---|
| 1.2 | Mark the essential functions |

| Quality Assurance Head (Sponsor) | Quality Assurance Manager / Analyst (Daily user) | External Auditor / Auditee (Supplier QA) |
|---|---|---|
| Audit prep cost reduction ≥40% versus baseline (measured during PoC) · regulator-defensibility of every signed record · zero AI-hallucinated citations in any regulator-facing artifact · GAMP Cat 4 validation effort versus Cat 5 baseline · breach-free operation | Phase stepper status visibility · cite-or-fallback AI never fabricates · e-sig per §11.50 + §11.200 on every signed action · audit-trail one click away · CAPA effectiveness check gate cannot be bypassed · keyboard-first navigation | Single login across all customer audits · evidence reusable across customers · transparent finding criteria · response e-sign per §11.50 · data export on request |

| Steps | Requirements |
|---|---|
| 1.3 | Define or characterize the inputs or responses for the important functions |

| Quality Assurance Head (Sponsor) | Quality Assurance Manager / Analyst (Daily user) | External Auditor / Auditee (Supplier QA) |
|---|---|---|
| Aggregate dashboard with audit count · audit-prep time trend · finding-severity mix · CAPA cycle time · regulatory inspection calendar · AI Audit Trail summary · breach incidents (target zero) · Vendor Quality Manual and SDLC evidence (delivered annually) · Periodic Vendor Audit Pack | Per-audit phase indicator · evidence ledger contents · AI draft text with citation chips and confidence badge · findings table with severity · linked CAPA records · audit-trail rows with user · UTC · reason · IP · session · e-sig manifest on every signed record (name · UTC · meaning) | Inbox of pending audit requests · per-section assignment list · evidence upload queue with progress · AI narrative draft with citations · e-sig ceremony with password + reason · received findings with severity and CAPA assignment |

| Steps | Requirements |
|---|---|
| 1.4 | Determine the limitations or un-intended use |

| Quality Assurance Head (Sponsor) | Quality Assurance Manager / Analyst (Daily user) | External Auditor / Auditee (Supplier QA) |
|---|---|---|
| S.M.A.R.T. Hawk Audit Management is NOT a substitute for the customer's own quality management responsibility; the customer remains responsible for URS, configuration-specific FRS, customer-environment IQ, configuration-specific OQ, PQ, and Validation Summary Report sign-off. Use of unvalidated or sub-floor-configured S.M.A.R.T. Hawk for GxP production may compromise the customer's regulatory standing. | The module does NOT authorize the AI to commit any record. AI drafts; human always e-signs. Disabling the audit trail is structurally impossible. Disabling cite-or-fallback at Layer 3 is structurally impossible. Bypassing the CAPA effectiveness check gate is structurally impossible. Any of these attempts indicate a misconfigured or compromised environment. | The supplier portal is NOT a substitute for the supplier's own internal quality system. Responding to a customer audit via S.M.A.R.T. Hawk does NOT discharge the supplier's responsibility to maintain its own validated systems and records. |

| Steps | Requirements |
|---|---|
| 1.5 | Consider functional requirements throughout the entire life cycle of the module |

| Quality Assurance Head (Sponsor) | Quality Assurance Manager / Analyst (Daily user) | External Auditor / Auditee (Supplier QA) |
|---|---|---|
| Continuous availability per 99.5% (PoC) / 99.9% (production Enterprise) SLA · annual Periodic Vendor Audit · annual third-party penetration test summary · quarterly release notes with classification · re-validation guidance per release per FDA CSA · GAMP Cat 4 evidence refreshed annually · data export at contract termination with hard-delete certification within 30 days | Continuous audit-trail capture · per-tenant backup daily with 30-day rolling retention (production) · monthly restore test · breach notification within 72 hours · incident post-mortem within 14 days of P1/P2 incident | Continuous access to the supplier portal · data export on request · hard-delete certification within 30 days of supplier-relationship termination |

---

## 8.0 USER REQUIREMENTS / NEEDS

| UN. No. | User Need (UN) | Detailed requirements | Specification / Acceptance criteria | Must | Can |
|---|---|---|---|---|---|
| **A.** | **GENERAL REQUIREMENTS** | | | | |
| 1. | The module shall implement end-to-end audit lifecycle management for the customer's regulated quality system. | Module shall support audit creation, prep, on-site execution, finding capture, CAPA spawning, closeout, and post-closeout audit-trail review without external tooling. | Lifecycle traceability from create → close with audit-trail rows for every transition; no out-of-system handoff required. | X | |
| 2. | The module shall be delivered as a multi-tenant Software-as-a-Service product within the S.M.A.R.T. Hawk platform. | Multi-tenant logical isolation enforced at the query layer; row-level tenant filter on every Mongoose query; tested per OQ. | Multi-tenant isolation tested OQ-AUDIT-INFRA-001 passes for every release. | X | |
| 3. | The module shall conform to the S.M.A.R.T. Hawk 5-layer architecture, residing within Layer 4 (Domain Engine) and consuming Layer 3 (AI Gateway), Layer 2 (Data & Evidence), and Layer 1 (Trust · Security · Compliance). | Module shall not bypass Layer 3 AI Gateway for any LLM call; shall not bypass Layer 1 audit trail for any state change; shall not bypass Layer 2 tenant isolation for any query. | Architectural rules enforced per ARCHITECTURE.md §11; verified by code review and integration tests. | X | |
| 4. | The module shall implement the universal 5-pillar runtime pipeline of the S.M.A.R.T. Hawk Domain Engine. | Every audit shall traverse Sense → Monitor → Analyze → Record → Trace pillars; pillar transitions captured in audit trail. | 5-pillar transitions visible in phase stepper; audit-trail rows tagged with pillar. | X | |
| 5. | The module shall integrate with the other twelve EQMS modules of the S.M.A.R.T. Hawk platform for cross-module traceability. | Audit findings shall spawn CAPAs in the CAPA module; deviations may be linked; documents cited from Document Control module; supplier master read from Supplier Management module. | Cross-module link verified by integration tests; cross-module audit-trail query returns related records under 2 seconds at p95. | X | |
| 6. | The module shall be classified as a GAMP 5 Category 4 — Configured Product per ISPE GAMP 5, 2nd Edition (Jul 2022). | Vendor SDLC evidence shall be shipped to customers; customer validation effort focuses on configuration, not source code; supplier-leverage clause applies. | GAMP Cat 4 classification declared in customer-facing documents; Validation Accelerator Package delivered at PoC kickoff per GAMP-CAT-4-COMPLIANCE.md §9. | X | |
| 7. | The module shall be accessible through a browser-based web user interface. | Supported browsers: Chrome ≥ 120, Edge ≥ 120, Safari ≥ 17, Firefox ≥ 120 (latest two major versions of each). | UI renders functionally equivalent across supported browsers; E2E Playwright tests run against Chromium per release. | X | |
| 8. | The module shall be mobile-responsive for tablet and phone form factors. | UI shall render usably on screens ≥ 360px wide; touch-target size ≥ 44 × 44 CSS pixels per WCAG 2.5.5. | Manual responsive testing per release; mobile companion native app planned roadmap M9. | X | |
| 9. | The module shall be internationalised for multi-language support. | English (en-IN default, en-US, en-GB) shipped at M0; Hindi planned M9, Spanish M12, Mandarin M18. | All UI strings sourced from i18n catalogs; no hard-coded strings; new locale addable without code change. | X | |
| 10. | The module shall be deliverable on customer's sovereign infrastructure (on-premise) for Enterprise customers requiring data sovereignty. | Container-based deployment; customer-supplied MongoDB Enterprise; customer-supplied S3-compatible object storage; local vLLM for AI. | On-premise deployment package available for Enterprise tier per PRICING.md §7; roadmap M12. | | X |
| 11. | The module shall support a synthetic-data Sandbox tier for top-of-funnel discovery without customer real audits. | 14-day self-serve tenant; synthetic data; watermarked exports; no real audit processing. | Sandbox tier provisioned within 60 seconds of signup; auto-expires at 14 days; complies with PDR-005. | X | |
| 12. | The module shall support a 60-day structured Proof of Concept (PoC) for sales-qualified customers using their real audit data. | Free PoC with written success criteria including ≥40% audit-prep time reduction measurement; Validation Accelerator Package delivered at PoC kickoff. | PoC governed by POC-AGREEMENT.md; success criteria measured per POC-PITCH-DECK.md slide 11. | X | |
| 13. | The module shall support customer-elected data residency at tenant provisioning. | Hosting regions: India (Mumbai, default for IN tenants), United States (US-East), European Union (Frankfurt). Customer-elected at provisioning, cannot change post-provision without data migration. | Residency elected at provisioning recorded in tenant configuration audit trail; cross-region transfers blocked unless customer-authorized migration. | X | |
| 14. | The module shall be supplied from a single common code base to all customers, with per-tenant differentiation achieved through configuration only. | No per-customer code-forks; configuration via vocabularyService, standardRegistryService, WorkflowDefinitionService, AI prompt templates. | Single Git repository for the module; customer-specific code modifications would push that workflow to GAMP Cat 5 per PDR-002 and require separate engagement. | X | |
| 15. | The module shall be available with a documented Service Level Agreement (SLA). | 99.5% calendar-month uptime during PoC; 99.9% during paid production Enterprise tier; scheduled maintenance ≤ 4 hours per week before 06:00 IST or after 22:00 IST. | SLA documented in POC-AGREEMENT.md §7 and Master Services Agreement; status page at status.hawkeye.io. | X | |
| **B.** | **TENANT & CONFIGURATION REQUIREMENTS** | | | | |
| 16. | The module shall support per-tenant vocabulary configuration to accommodate customer-specific terminology. | Vocabulary terms (e.g., "batch" vs "lot" vs "sample") configurable per tenant via vocabularyService; default vocabulary supplied; customer override via admin console. | Vocabulary change captured in admin audit trail with e-sig per §11.50; visible in subsequent UI immediately for the tenant. | X | |
| 17. | The module shall support per-tenant selection of applicable regulatory standards. | Standard library shipped: ICH Q7, ICH Q10, EU GMP, US 21 CFR Parts 210/211, WHO PQ GMP, India Schedule M, ISO 9001, ISO 13485, PIC/S. Customer selects active standards via standardRegistryService. | Active standards list per tenant retrievable via API; affects which compliance rules evaluate against audit findings; selection change captured in admin audit trail. | X | |
| 18. | The module shall support per-tenant workflow definitions for the audit lifecycle. | Customer authors workflow per their SOP: states, transitions, approval chain, e-sig gates, role assignments. Versioned via WorkflowDefinitionService. | Workflow definition export as Configuration Specification artifact; version history retained; change requires e-sig per §11.50. | X | |
| 19. | The module shall support per-tenant template library for questionnaires, checklists, finding formats, and audit closure certificates. | Template editor in admin console; templates versioned; templates linked to standard selection. | Templates exportable as PDF and Word; version history retained; cited by audit records. | X | |
| 20. | The module shall support per-tenant configuration of AI prompt templates per workflow action. | Tenant admin authors prompt templates for: audit finding drafting, narrative response, evidence categorization, supplier intelligence summary. | Prompt templates versioned; A/B testing per workflow; default templates shipped; customer override possible. | X | |
| 21. | The module shall support per-tenant configuration of AI confidence threshold per task type. | Default threshold = 0.6 (cosine + reranker score); admin override range 0.3 – 0.9; below threshold returns cite-or-fallback per ADR-003. | Threshold change captured in admin audit trail; affects subsequent AI Gateway behavior immediately. | X | |
| 22. | The module shall expose the live tenant configuration as a Configuration Specification snapshot on demand. | Admin can export Configuration Specification as PDF + JSON; export contains all configurable elements per GAMP-CAT-4-COMPLIANCE.md §12. | Export available within 60 seconds; signed with current UTC and admin identity. | X | |
| 23. | The module shall require electronic signature for any configuration change classified as functional. | Configuration changes classified as: functional (require e-sig + reason + change-control record), security (require e-sig), cosmetic (no e-sig). | E-sig enforcement at admin console; classification documented per configurable element. | X | |
| **C.** | **PERSONA & ACCESS CONTROL REQUIREMENTS** | | | | |
| 24. | The module shall support six personas with persona-tailored interfaces. | Personas: Quality Assurance Head, Quality Assurance Manager/Analyst, Operations/Subject Matter Expert, External Auditor, Auditee (supplier QA), Tenant Administrator. | Persona detected from RBAC role; UI elements hidden when not actionable; same audit record renders differently per persona. | X | |
| 25. | The module shall authenticate users via Single Sign-On using SAML 2.0 or OpenID Connect protocols. | SSO with customer's Identity Provider (Okta, Azure AD, Google Workspace, Ping, OneLogin, others); no S.M.A.R.T. Hawk-issued passwords for end users. | SSO setup completes within 7 days of customer kickoff; SAML metadata exchanged; OIDC discovery URL accepted. | X | |
| 26. | The module shall support Multi-Factor Authentication (MFA) enforced per tenant policy. | MFA delegated to customer IdP; S.M.A.R.T. Hawk enforces session-level checks; MFA bypass not possible for production tenants. | MFA policy configurable per tenant; per-role MFA elevation supported. | X | |
| 27. | The module shall implement Role-Based Access Control (RBAC) at both module and record level. | Module-level: per-role enablement of module access; record-level: per-record permission grant via shared list or workflow assignment. | RBAC enforced at API + UI; tested per OQ-AUDIT-RBAC-001 through 010. | X | |
| 28. | The module shall distinguish between TENANT-scoped administrators and PLATFORM-scoped super-administrators per the adminScope enum. | Tenant admin: full control within tenant; Platform admin: cross-tenant operational access for support (logged in governance audit trail). | adminScope captured in userModel; separation of duties enforced; platform admin actions logged separately. | X | |
| 29. | The module shall support unlimited view-only (read-only) users without per-user licensing fees, with billed seats only for named full-edit users. | View-only role can read audit records, evidence, findings, audit trail; cannot modify or sign. Named full-edit users billed per PRICING.md. | View-only audit trail captures who viewed what when; per-tenant seat count enforced for full-edit role. | X | |
| 30. | The module shall support per-record permission overrides for sensitive audits (e.g., legal-privileged, executive-only). | Per-record ACL overrides the default RBAC role; record visibility hidden in lists and search for unauthorized users. | Per-record permission grants captured in audit trail; default-deny on records flagged sensitive. | X | |
| 31. | The module shall maintain a user-provisioning audit log capturing every account creation, role change, and account deactivation. | Captured: actor, target user, action, UTC, reason; cannot be disabled. | Provisioning audit log queryable by tenant_admin; export to CSV available. | X | |
| 32. | The module shall support periodic access review reports for the tenant's Annex 11 §11 periodic evaluation. | Auto-generated report listing all active users, their roles, last login date, and any role changes in the period; exportable PDF + CSV. | Quarterly schedule with email notification to tenant_admin; customer-side periodic-review e-sig captured. | X | |
| 33. | The module shall implement account lockout after configurable failed authentication attempts. | Lockout after N failed attempts (default 5); unlock after timeout (default 30 minutes) or admin reset. | Failed-attempt audit log captures source IP; brute-force pattern detection escalates to security incident. | X | |
| **D.** | **AUDIT LIFECYCLE REQUIREMENTS** | | | | |
| 34. | The module shall support audit creation via three intake paths: manual (QA Manager creates), supplier portal (auditee responds to received request), and API (programmatic ingest from external scheduling system). | Each intake path captures origin metadata; default lifecycle phase = Draft on creation. | All three intake paths tested per OQ-AUDIT-INTAKE-001 through 003. | X | |
| 35. | The module shall support three primary audit types: hosted (inbound, customer audited by external party), conducted (outbound, customer audits a supplier), and internal (customer's quality system audits itself). | Audit type captured at creation; affects available workflows, e-sig roles, default templates. | Audit type immutable post-creation; conversion between types not supported (create new audit if needed). | X | |
| 36. | The module shall implement a phase stepper visualizing the audit's current position across lifecycle phases. | Phases: Draft → Sent / Received → Pre-Audit Prep → On-Site Execution → Findings Drafting → CAPA Spawning → Closeout Pending → Closed. | Phase stepper visible on every audit detail page; transitions audited; backward transitions require admin override + reason. | X | |
| 37. | The module shall support per-audit selection of applicable regulatory standards from the tenant's active standard library. | One audit may invoke multiple standards (e.g., ICH Q7 + 21 CFR Part 211 + WHO PQ GMP); compliance rules evaluate against the union. | Standard selection captured; AI prompt context includes selected standards; findings cite applicable standard clauses. | X | |
| 38. | The module shall support section-level assignment within an audit, allowing the QA Manager to allocate questionnaire sections to internal teams or to supplier-side auditees. | Each section assignable to a named user or role; assignee receives notification; due date settable per section. | Assignment captured; overdue notifications sent per configured cadence; reassignment audited. | X | |
| 39. | The module shall provide an evidence ledger associating uploaded evidence with audit sections and findings. | Multi-file upload (PDF, DOCX, XLSX, JPG, PNG, MP4, ZIP, others); per-file metadata: name, type, size, uploader, UTC, SHA-256 hash. | Evidence ledger queryable by section, finding, uploader, date; per-file integrity verified via SHA-256 on read. | X | |
| 40. | The module shall provide AI-assisted pre-audit pack assembly from supplier history and selected standards. | AI Gateway invokes audit pre-fill agent; cite-or-fallback enforced; AI draft visible to QA Manager for review/edit. | Pre-fill draft generated within 30 seconds for typical audit scope; AI Audit Trail row written per call. | X | |
| 41. | The module shall provide on-site (live) audit-day support with offline-tolerant evidence capture. | Browser-based evidence capture works with intermittent connectivity; deferred sync on reconnect; conflict resolution per last-write-wins with audit-trail divergence. | Offline mode tested OQ-AUDIT-OFFLINE-001; conflict resolution audited. | X | |
| 42. | The module shall support finding capture during live audit with severity classification. | Severity options: Critical, Major, Minor, Observation. Capture: title, narrative, evidence reference, root-cause hypothesis, recommended CAPA. | Severity captured; per-severity color coding per DESIGN-TOKENS.md; per-severity SLA for CAPA closure. | X | |
| 43. | The module shall provide AI-assisted finding drafting with cite-or-fallback enforcement. | Audit Report Agent (services/ai/audit-agents/auditReportAgent.js) drafts findings from evidence + selected standards; every AI claim cites source or returns "insufficient evidence". | Citation rate 100% on AI-drafted findings; tested OQ-AUDIT-AI-001; AI Audit Trail captures per call. | X | |
| 44. | The module shall require electronic signature on every finding before it transitions to "Signed" state. | E-sig per Part 11 §11.50 (name + UTC + meaning) + §11.200 (password + reason); meaning options: Review · Approval · Authorship · Responsibility. | E-sig enforced at workflow gate; cannot transition without; e-sig captured in electronicSignatureModel; linked to record snapshot SHA-256. | X | |
| 45. | The module shall auto-spawn CAPA records from signed findings, linked back to the originating finding. | CAPA creation triggered by finding signature with severity ≥ Minor; CAPA record carries finding reference, severity, recommended action. | Auto-spawn tested OQ-AUDIT-CAPA-001; linkage queryable both directions; CAPA closure does not retroactively modify finding. | X | |
| 46. | The module shall support audit closeout requiring sponsor (QA Head) electronic signature when audit type or severity triggers escalation. | Configurable per-tenant: which audit types or finding severity combinations require QA Head signature in addition to QA Manager signature. | Sponsor signature requirement captured in workflow definition; bypass not possible. | X | |
| 47. | The module shall generate an audit closure certificate as a regulator-grade PDF on closeout. | Certificate contains: audit metadata, standards applied, evidence summary, findings with severity, CAPA references, signatures (name + UTC + meaning), tenant + module version. | PDF generation under 60 seconds; certificate downloadable from audit detail page; archived per retention policy. | X | |
| 48. | The module shall support audit re-open with mandatory reason and additional e-sig. | Re-open available to authorized roles (default: QA Head); audit state returns to prior phase; original closeout signature retained; re-open audited. | Re-open tested OQ-AUDIT-REOPEN-001; subsequent re-close requires new closeout signature. | X | |
| 49. | The module shall provide audit-trail review as a hard gate prior to batch release per EU GMP Annex 11 §15. | Batch release workflow requires explicit "Audit trail reviewed" e-sig before "Release" action enabled; reviewed audit trail snapshot retained. | Hard-gate enforcement tested OQ-AUDIT-RELEASE-001; bypass not possible. | X | |
| **E.** | **EVIDENCE & DOCUMENT REQUIREMENTS** | | | | |
| 50. | The module shall support evidence upload up to a per-file size limit configurable per tenant. | Default per-file limit: 100 MB. Larger files configurable up to 1 GB. Multi-file batch upload supported. | Per-file integrity hash computed on upload; resumable upload for large files. | X | |
| 51. | The module shall support evidence versioning, preserving prior versions immutably. | New version replaces "current" pointer; prior versions accessible via version history; never overwritten or deleted (ALCOA+ Original + Enduring). | Version history visible; revert-to-version not supported (immutability principle); audit trail captures every version creation. | X | |
| 52. | The module shall link evidence to audit sections, findings, and CAPAs for bidirectional traceability. | Many-to-many: one evidence file may support multiple sections / findings / CAPAs; one section / finding / CAPA may reference multiple evidence files. | Bidirectional link queryable; orphan evidence flagged in admin dashboard. | X | |
| 53. | The module shall support configurable retention periods per evidence record. | Default retention: 10 years from audit closeout. Configurable per tenant per evidence category (e.g., batch records 30 years). | Retention enforced by retention policy service; pre-deletion notification 90 days in advance. | X | |
| 54. | The module shall compute per-record SHA-256 hash for tamper-evidence. | SHA-256 computed on first save; recomputed on read; mismatch triggers integrity alert. | Tamper-evidence verified per OQ-AUDIT-INTEGRITY-001; never blockchain — flagged honestly per VISION.md §4e. | X | |
| 55. | The module shall provide full-text search across evidence content for ingested document types. | OCR for PDF + scanned images via Layer 3 retrieval pipeline; search ranks by relevance + recency. | Search latency p95 < 2 seconds for tenant corpora up to 100K documents. | X | |
| 56. | The module shall support evidence export as PDF (audit-trail-grade) and CSV (raw metadata). | Per-audit bulk export; per-tenant bulk export at termination; per-record on-demand export. | Export packaging tested OQ-AUDIT-EXPORT-001; signed manifest included. | X | |
| 57. | The module shall integrate with DigiLocker (India government document vault) for evidence import where applicable to Indian tenants. | OAuth-based import from customer's DigiLocker account; imported documents flagged with source = DigiLocker. | DigiLocker integration tested per OQ-AUDIT-DIGILOCKER-001 for India-region tenants. | X | |
| **F.** | **AI ASSISTANCE REQUIREMENTS** | | | | |
| 58. | The module shall invoke all AI / Large Language Model (LLM) capabilities exclusively through the S.M.A.R.T. Hawk AI Gateway (Layer 3) per ADR-002. | Direct provider SDK imports prohibited; lint rule and code review enforce; gateway is the single ingress. | Architectural rule enforcement per ARCHITECTURE.md §11; verified per release. | X | |
| 59. | The module's AI features shall enforce cite-or-fallback as a non-configurable guarantee per ADR-003. | Every AI output either cites at least one retrievable source, or returns "Insufficient evidence — human input required." Cannot be configured away. | Cite-or-fallback enforced at gateway pre-output check; tested OQ-AI-001; failed-citation count metric tracked. | X | |
| 60. | The module's AI shall never commit a record state change. | AI drafts, suggests, scores. Human always reviews and e-signs the commit. Workflow layer enforces this — no "auto-approve from AI" path exists. | Workflow layer audit verifies; tested OQ-AUDIT-AI-COMMIT-001 (negative test). | X | |
| 61. | The module shall log every AI call to the AI Audit Trail. | Captured: model provider, model version, prompt hash (SHA-256 of full prompt), retrieval set (source IDs + hashes), output text, confidence, user disposition (accepted / edited / rejected), userId, tenantId, UTC. | AI Audit Trail tamper-evident; reproducibility tested OQ-AI-REPRO-001. | X | |
| 62. | The module shall route AI calls to the appropriate provider (Anthropic, OpenAI, Gemini, local vLLM) based on tenant configuration and task type. | Default provider: Anthropic Claude. Per-tenant + per-task overrides supported. | Provider selection logged in AI Audit Trail; failover supported if primary provider unavailable. | X | |
| 63. | The module shall apply Personally Identifiable Information (PII) redaction before sending content to any third-party LLM provider. | PII redaction service (services/ai/redaction/piiRedactionService.js) runs as gateway pre-filter; redaction patterns include names, emails, phone, addresses, government IDs, batch numbers (configurable). | PII redaction tested OQ-AI-PII-001; redacted spans logged for audit. | X | |
| 64. | The module shall NEVER use customer data for AI model training without explicit written customer consent. | Default contractual position: zero training-data use. Per-provider configuration enforces training opt-out at vendor account level. | No-training certification issuable per customer DPA; vendor configuration audited periodically. | X | |
| 65. | The module shall implement an Active Learning Loop capturing user disposition for prompt refinement. | When user accepts / edits / rejects AI output, disposition recorded; aggregated for prompt template tuning. | Active learning enabled per tenant config (default on); per-task disposition rate visible to product team. | X | |
| 66. | The module shall implement drift monitoring for AI output quality. | Drift monitor (services/ai/wave3/driftMonitor.js) tracks per-task quality signals; alerts on regression. | Drift alerts surface to engineering on-call; per-tenant drift visible in admin dashboard. | X | |
| 67. | The module shall defend against prompt injection in ingested customer documents. | Adversarial input filtering at Layer 3; suspicious patterns flagged and escalated. | Prompt injection test corpus run per release; new injection patterns added quarterly. | X | |
| **G.** | **FINDINGS & CAPA REQUIREMENTS** | | | | |
| 68. | The module shall classify findings into four severity tiers: Critical, Major, Minor, Observation. | Severity affects SLA for CAPA closure, escalation path, sponsor signature requirement, and inspection-readiness inclusion. | Severity capture mandatory; default severity = Observation; reclassification audited. | X | |
| 69. | The module shall support per-finding risk-weighting through the S.M.A.R.T. Hawk Risk Management module integration. | Risk orchestrator (services/risk/riskOrchestrator.js) consumes finding severity, evidence trust, supplier risk profile to compute composite score. | Risk score visible per finding; recomputed on relevant changes; explainable breakdown available. | X | |
| 70. | The module shall capture per-finding electronic signature with meaning = "Review" or "Approval" per the customer's workflow definition. | Workflow definition specifies which meanings are valid for each finding-severity tier. | E-sig meaning captured; later validation reports cite the meaning per §11.50(a)(3). | X | |
| 71. | The module shall auto-spawn one CAPA record per signed finding of severity ≥ Minor by default; configurable per workflow. | CAPA carries: source finding ID, severity, recommended action, due date, assignee. | Spawn behavior tested; configuration changes audited; downstream CAPA module accepts spawn payload. | X | |
| 72. | The module shall enforce an effectiveness check gate before CAPA closure. | CAPA cannot transition to "Closed" without an "Effectiveness Verified" e-sig and supporting evidence. | Hard-gate enforcement tested OQ-AUDIT-CAPA-EFF-001; bypass not possible. | X | |
| 73. | The module shall require electronic signature on CAPA closure with meaning = "Approval" or "Authorship". | E-sig per Part 11 §11.50; cannot close without; closure e-sig captures Reason. | E-sig captured; CAPA closure visible in originating finding's audit record. | X | |
| 74. | The module shall detect recurring findings sharing the same root cause across audits and surface an alert. | Pattern detection across closed findings within configurable lookback window (default 24 months); match heuristic = embedding similarity + root-cause taxonomy. | Recurring-pattern alert visible to QA Manager + QA Head; addresses RESEARCH-FINDINGS.md Insight (recurring findings every renewal cycle). | X | |
| 75. | The module shall support finding export in a regulator-ready format. | Per-audit findings export as PDF (with full e-sig manifest), CSV (tabular), and JSON (programmatic). | Export tested OQ-AUDIT-FINDING-EXPORT-001; PDF passes FDA / EMA inspection-readiness review. | X | |
| **H.** | **E-SIGNATURE & COMPLIANCE REQUIREMENTS** | | | | |
| 76. | The module shall be Validated per 21 CFR §11.10(a). | GAMP 5 Category 4 configured product; vendor-supplied Validation Accelerator Package; customer executes configuration-specific OQ + PQ. | Validation Accelerator Package delivered per GAMP-CAT-4-COMPLIANCE.md §9; customer-side validation effort estimated at ~10.5 days for this module per §30. | X | |
| 77. | The module shall provide accurate, complete human-readable and electronic copies of records for inspection per §11.10(b). | PDF export (human-readable, audit-trail-grade), CSV export (tabular), JSON export (programmatic). | Export tested OQ-AUDIT-EXPORT-001 through 003. | X | |
| 78. | The module shall limit system access to authorized individuals per §11.10(d). | SSO + MFA enforceable + RBAC at module and record level. | Access controls verified per OQ-AUDIT-RBAC-001 through 010. | X | |
| 79. | The module shall maintain secure, computer-generated, time-stamped audit trails per §11.10(e), retained for at least as long as the underlying records. | Every state change logged: user, UTC timestamp, session, IP, reason. Cannot be disabled by any user role. Retention ≥ record lifetime. | Audit trail tamper-evidence per OQ-AUDIT-TRAIL-001; retention enforcement per retention policy service. | X | |
| 80. | The module shall implement authority checks per §11.10(g). | Only authorized roles can sign / alter / operate; verified at API and UI; failed attempts logged. | RBAC enforcement tested; authority-check audit log queryable. | X | |
| 81. | The module shall manifest every electronic signature per §11.50 with printed name + UTC date/time + meaning. | Manifest visible on the signed record display; included in export PDF; included in signature manifest report. | E-sig manifest rendered per DESIGN-PRINCIPLES.md §4; tested OQ-AUDIT-ESIG-MANIFEST-001. | X | |
| 82. | The module shall link e-signatures to their records cryptographically per §11.70. | E-signature binds to SHA-256 snapshot hash of signed record; tampering invalidates signature. | Linkage verified per OQ-AUDIT-ESIG-LINK-001; cryptographic break attempt tested as negative case. | X | |
| 83. | The module shall ensure each e-signature is unique to one individual per §11.100. | One signature account per person via SSO identity; never reassigned; identity verified at IdP. | Provisioning policy tested; account-reuse prevention verified. | X | |
| 84. | The module shall require two distinct components for non-biometric e-signature per §11.200. | Password (delegated via SSO; session token) + Reason (free-text mandatory). Session-boundary rule enforced: first sign in continuous session uses both components; subsequent signs use one; session timeout requires both again. | Session-boundary rule tested per OQ-AUDIT-ESIG-2COMP-001. | X | |
| 85. | The module shall implement ID/password integrity controls per §11.300. | Password policy enforced via SSO; lockout per UN 33; failed-attempt audit log; periodic password aging per IdP policy. | Controls inherited from customer's IdP per SSO contract; S.M.A.R.T. Hawk enforces session-level. | X | |
| 86. | The module shall comply with EU GMP Annex 11 Clause 3 — formal supplier/service-provider agreement and audit basis. | Data Processing Agreement + Vendor Assessment Questionnaire pre-filled + annual right-to-audit per GAMP-CAT-4-COMPLIANCE.md §19. | Customer DPA executed at contract; right-to-audit clause included; audit pack updated annually. | X | |
| 87. | The module shall comply with EU GMP Annex 11 Clause 9 — audit trail capturing user, time, AND reason for changes/deletions. | Reason field mandatory on every modification; cannot be skipped. | Reason capture tested OQ-AUDIT-REASON-001; UI enforces. | X | |
| 88. | The module shall comply with EU GMP Annex 11 Clause 14 — electronic signature equivalent to handwritten, permanently linked, showing name/date/time/meaning. | Per UN 81 + UN 82. | Annex 11 §14 conformance per GAMP-CAT-4-COMPLIANCE.md §23. | X | |
| **I.** | **DATA INTEGRITY (ALCOA+) REQUIREMENTS** | | | | |
| 89. | The module shall ensure all data is **Attributable** per MHRA ALCOA+ (2018) + WHO TRS 1033 (2021). | Every record action linked to a unique SSO-authenticated user via audit trail; no shared accounts permitted. | Attributability verified per OQ-ALCOA-A-001. | X | |
| 90. | The module shall ensure all data is **Legible**. | Human-readable export at record and audit-trail level; no proprietary unreadable formats. | Legibility verified by spot-check; PDF + CSV exports tested. | X | |
| 91. | The module shall ensure all data is **Contemporaneous**. | UTC server timestamps captured at action moment; client-side time not trusted; no back-dating possible. | Contemporaneity verified per OQ-ALCOA-C-001; client-clock skew tolerated up to 5 minutes; beyond skew alerts. | X | |
| 92. | The module shall ensure all data is **Original**. | Original record preserved; new versions append, never overwrite. | Originality verified per OQ-ALCOA-O-001; revert-to-version prohibited. | X | |
| 93. | The module shall ensure all data is **Accurate**. | Validation gates at workflow transitions; reviewer e-signature enforces semantic accuracy. | Accuracy verified per validation gate tests; AI cite-or-fallback prevents AI-introduced inaccuracy per UN 59. | X | |
| 94. | The module shall ensure all data is **Complete**. | Audit trail captures full action context, not just outcome (before/after, intent, retrieval set for AI calls). | Completeness verified per OQ-ALCOA-COMPLETE-001; sample audit-trail row passes regulator inspection criteria. | X | |
| 95. | The module shall ensure all data is **Consistent**. | Schema validation + cross-module canonical data model; UTC + sequence enforcement. | Consistency verified by integration tests across modules. | X | |
| 96. | The module shall ensure all data is **Enduring**. | Per-record SHA-256 hashing; ≥ 10-year configurable retention; tamper-evident storage. | Endurance verified per OQ-ALCOA-E-001; retention policy enforced. | X | |
| 97. | The module shall ensure all data is **Available**. | 24×7 access per SLA; offline export on demand; data export at PoC end within 7 business days. | Availability verified per uptime monitor; export delivery measured against SLA. | X | |
| **J.** | **AUDIT TRAIL REQUIREMENTS** | | | | |
| 98. | The module shall capture an audit-trail row for every state change on every audit-related entity. | Entities include: audit, evidence, finding, CAPA, e-signature, configuration. Captured per row: entity, action, before, after, user, UTC, reason, IP, session. | Per-state-change capture tested OQ-AUDIT-TRAIL-002; sample audit pass regulator inspection criteria. | X | |
| 99. | The module shall make audit trail tamper-evident through SHA-256 per-record hashing and append-only storage. | Audit-trail collection is append-only at the database layer; modification attempts blocked at application + DB layer. | Tamper-evidence verified per OQ-AUDIT-TRAIL-TAMPER-001 (negative test attempts modification). | X | |
| 100. | The module shall make audit-trail disabling structurally impossible — no role, configuration, or admin path can turn it off. | Audit-trail capture is in the service-layer wrapper for every mutation; no opt-out parameter exists. | Disable-attempt tested as negative case OQ-AUDIT-TRAIL-DISABLE-001; verified zero code paths can suppress. | X | |
| 101. | The module shall retain audit-trail rows for at least the record's full lifetime plus 1 year. | Default audit-trail retention: lifetime of the record + 1 year. Configurable up to 30 years per tenant. | Retention enforced; pre-purge notification 90 days in advance to tenant_admin. | X | |
| 102. | The module shall support audit-trail search by entity, action, user, date range, and reason text. | Search latency p95 < 2 seconds for any record's full lineage; cross-module trail query supported. | Search latency tested OQ-AUDIT-TRAIL-SEARCH-001. | X | |
| 103. | The module shall export audit-trail as a regulator-grade PDF containing all captured fields. | Per-record audit-trail export; per-audit cumulative audit-trail export; signed manifest included. | Export format passes FDA / EMA inspection-readiness review per GAMP-CAT-4-COMPLIANCE.md §30. | X | |
| **K.** | **REPORTING & EXPORT REQUIREMENTS** | | | | |
| 104. | The module shall provide an aggregate dashboard summarizing audit volume, status, severity mix, and CAPA cycle time. | Dashboard role-aware: QA Head sees aggregate; QA Manager sees own team's; auditor sees own conducted. | Dashboard refresh p95 < 3 seconds; export to PDF / CSV available. | X | |
| 105. | The module shall provide a custom report builder for ad-hoc reporting. | Filter by audit type, status, date range, severity, supplier, site, standard; group by any captured field; export PDF / CSV / JSON. | Report builder tested; common reports template-saved per tenant. | X | |
| 106. | The module shall provide an inspection-readiness pack assembler (planned roadmap M12) integrating findings, CAPAs, audit trail, e-signature manifests, and validation summary into a single signed PDF. | Per-inspection scope selection (modules, dates, products); assembled pack signed by QA Head; archived in module. | Inspection pack tested as design partner workflow before general availability. | | X |
| 107. | The module shall provide aggregate metrics suitable for the S.M.A.R.T. Hawk Management Review (MRM) module's quarterly cycle. | Audit count, supplier risk distribution, finding-severity trend, CAPA cycle time, recurring-pattern incidence. | MRM input format documented and tested. | X | |
| **L.** | **INTEGRATION REQUIREMENTS** | | | | |
| 108. | The module shall expose all functionality via a documented REST API conforming to OpenAPI 3.1. | OpenAPI spec served at /docs; authenticated via JWT or API key; per-tenant rate limits. | API surface tested OQ-AUDIT-API-001; OpenAPI spec versioned per release. | X | |
| 109. | The module shall emit webhook events on significant state changes for customer-side integration. | Events: AUDIT_CREATED, AUDIT_QUESTIONNAIRE_SENT, FINDINGS_SIGNED, CAPAS_SPAWNED, AUDIT_CLOSED, AUDIT_REOPENED. | Webhook retry policy defined; per-event subscription configurable per tenant. | X | |
| 110. | The module shall support one custom integration to a customer-specific system within the PoC scope per POC-AGREEMENT.md §3.5. | Engineering scope ≤ 16 hours; greater scope by separate agreement. | Custom integration spec documented at PoC kickoff; tested in customer environment. | X | |
| 111. | The module shall integrate with S.M.A.R.T. Hawk Document Control module for citing controlled SOPs and work instructions in audit findings. | Document references retained as DocCtl-ID + version; document deprecation flagged in citing finding. | Cross-module link tested per integration test. | X | |
| 112. | The module shall integrate with S.M.A.R.T. Hawk Supplier Management module for supplier master data lookup. | Supplier records retrieved as read-only from Supplier Management; supplier risk profile factored into audit risk weighting. | Cross-module read tested per integration test. | X | |
| 113. | The module shall send notifications via the platform's notification service (SMTP-agnostic; default Resend). | Notification events configured per tenant: assignment, due-date approach, overdue, finding signed, CAPA spawned, audit closed. | Notification delivery log queryable; delivery SLA monitored. | X | |
| **M.** | **SECURITY & PRIVACY REQUIREMENTS** | | | | |
| 114. | The module shall encrypt all data in transit using TLS 1.3. | No plaintext anywhere; HSTS enforced; downgrade attacks blocked. | TLS verified per release; downgrade attempt tested as negative case. | X | |
| 115. | The module shall encrypt all data at rest using AES-256 with per-tenant logical encryption. | MongoDB Atlas encryption-at-rest; S3-compatible storage encryption-at-rest; per-tenant Bring-Your-Own-Key (BYOK) available on Enterprise tier. | Encryption-at-rest verified at provisioning; BYOK option tested for Enterprise tenants. | X | |
| 116. | The module shall enforce per-tenant logical isolation at the database query layer. | Every Mongoose query carries the tenant filter; enforced at service-layer wrapper; integration test verifies cross-tenant leak attempt fails. | Cross-tenant leak attempt tested OQ-AUDIT-TENANT-ISOLATION-001 (negative test). | X | |
| 117. | The module shall comply with India Digital Personal Data Protection Act 2023 (compliance deadline 13 May 2027). | Data Processor obligations met; written agreement; breach notification; deletion on termination. | DPDP compliance status documented; updates tracked per regulatory monitoring. | X | |
| 118. | The module shall comply with EU General Data Protection Regulation. | Data Processing Agreement executed at contract; EU residency option; Data Protection Officer contact channel. | GDPR conformance verified per customer's DPO inquiry. | X | |
| 119. | The module shall obtain SOC 2 Type II attestation (target Q1 2027). | External auditor engaged; Type I targeted Q3 2026; Type II targeted Q1 2027. | SOC 2 Type I report available under NDA; Type II report on completion. | X | |
| 120. | The module shall undergo annual third-party penetration testing with executive summary shared with customers under NDA. | Annual pentest of full platform including this module; critical findings remediated within 7 days. | Annual pentest summary in Validation Accelerator Package. | X | |
| 121. | The module shall implement dependency vulnerability scanning with critical CVE patching SLA of 7 days. | Dependabot weekly; SAST (CodeQL) every PR; critical CVE patched within 7 days; high within 30 days. | Vulnerability management policy documented; SLA tracked per quarter. | X | |
| 122. | The module shall support hard-delete of all customer data within 30 calendar days of written request, with signed certificate of deletion. | Hard-delete includes backups; certificate signed by S.M.A.R.T. Hawk and delivered to customer. | Deletion process tested OQ-AUDIT-DELETE-001; certificate template per GAMP-CAT-4-COMPLIANCE.md §8.5. | X | |
| 123. | The module shall support customer data export at PoC end (and at contract termination) within 7 business days. | Export bundle: PDF (audit-trail-grade) + CSV + JSON + signed manifest; delivered via SFTP or secure download link with 30-day retention. | Export tested per POC-AGREEMENT.md §8.4. | X | |
| **N.** | **PERFORMANCE & AVAILABILITY REQUIREMENTS** | | | | |
| 124. | The module shall meet the S.M.A.R.T. Hawk Service Level Agreement for uptime. | 99.5% calendar-month uptime during PoC; 99.9% during Enterprise paid; ≤ 4 hours per week scheduled maintenance. | Uptime measured per status.hawkeye.io; SLA credits per Master Services Agreement. | X | |
| 125. | The module's API response latency shall be p95 < 500ms for read endpoints. | Measured at edge; excludes AI-Gateway calls (UN 126). | Latency dashboard per endpoint; SLA tracked. | X | |
| 126. | The module's AI-assisted draft generation latency shall be p95 < 2 seconds for typical audit-scope contexts. | Includes retrieval + LLM inference + post-validation. | Latency measured per task type; cite-or-fallback latency capped same. | X | |
| 127. | The module's audit-trail query latency shall be p95 < 2 seconds for any record's full lineage. | Cross-module trail aggregation included. | Latency tested OQ-AUDIT-TRAIL-LATENCY-001. | X | |
| 128. | The module shall support at least 100 concurrent active users per tenant without performance degradation. | Concurrent users defined as users with active session within last 10 minutes. | Load tested OQ-AUDIT-LOAD-001 at 100 concurrent users; higher scale via Atlas cluster tier upgrade. | X | |
| 129. | The module shall be backed up daily with monthly restore tests. | Daily MongoDB snapshot + S3 object snapshot; 7-day rolling retention (PoC) / 30-day rolling (production); monthly restore test executed in staging. | Backup + restore test results documented in Validation Accelerator Package per GAMP-CAT-4-COMPLIANCE.md §20. | X | |
| 130. | The module shall meet the S.M.A.R.T. Hawk Disaster Recovery objectives: Recovery Time Objective (RTO) < 4 hours; Recovery Point Objective (RPO) < 24 hours. | DR runbook documented; quarterly DR drill (target monthly per GAMP Cat 4 maturity). | DR drill results documented; runbook reviewed annually. | X | |
| **O.** | **ACCESSIBILITY & USABILITY REQUIREMENTS** | | | | |
| 131. | The module shall conform to W3C Web Content Accessibility Guidelines (WCAG) 2.2 Level AA (target full conformance Q4 2026). | 50 Success Criteria covered; current status 42 conformant + 8 partial per ACCESSIBILITY.md §3. | Quarterly internal accessibility audit; annual external audit; VPAT 2.5 + WCAG 2.2 mapping available on request. | X | |
| 132. | The module shall support keyboard-first navigation per S.M.A.R.T. Hawk Design Principle 7. | Every interactive element reachable via Tab; focus visible; keyboard shortcut catalog including ⌘K for AskHawk. | Keyboard navigation tested per release; shortcut catalog documented in help. | X | |
| 133. | The module shall support screen-reader interaction including NVDA, VoiceOver, and JAWS. | ARIA roles + labels on custom components; live regions for dynamic updates; tested quarterly per ACCESSIBILITY.md §5. | Screen-reader test results documented; major issues tracked in accessibility backlog. | X | |
| 134. | The module's electronic signature ceremony shall be accessible per ACCESSIBILITY.md §7. | No password-typing timeout; "Meaning" dropdown keyboard-reachable; plain-language meaning options with tooltips; pre-confirmation summary; alternative auth method roadmap for motor-impaired users. | E-sig ceremony tested with screen reader and keyboard-only; user research with assistive-tech users twice yearly. | X | |
| 135. | The module shall render print-ready PDF for every signed record per S.M.A.R.T. Hawk Design Principle 8. | Print CSS first-class; PDFs include e-sig manifest, audit-trail summary, evidence references; tested PDF/A-1b conformance for archival. | Print quality tested per release; PDF/A-1b validator passes. | X | |
| 136. | The module shall render persona-aware UI hiding actions the current user cannot take per S.M.A.R.T. Hawk Design Principle 5. | Buyer view vs Supplier view of the same audit record differs visibly; hidden actions not shown (not disabled). | Persona-rendering tested per OQ-AUDIT-PERSONA-001 through 006. | X | |
| 137. | The module shall always show audit status via phase stepper + status chips per S.M.A.R.T. Hawk Design Principle 4. | Phase stepper visible on every audit detail page; status chips combine color + icon + text label per ACCESSIBILITY.md §6 (no color-only signaling). | Status visibility verified per design review of every new flow. | X | |
| 138. | The module shall maintain consistent regulatory vocabulary per S.M.A.R.T. Hawk Design Principle 2. | "Finding" not "issue"; "Deviation" not "problem"; "CAPA" not "task"; "Observation" not "comment". | Vocabulary linter on UI strings; copy review per release. | X | |
| **P.** | **VALIDATION & VENDOR EVIDENCE REQUIREMENTS** | | | | |
| 139. | The module shall be delivered as a GAMP 5 Category 4 Configured Product per PDR-002 and ISPE GAMP 5 2nd Edition (Jul 2022). | Classification formal; Validation Accelerator Package delivered at PoC kickoff. | Classification declared in GAMP-CAT-4-COMPLIANCE.md §1; comparable to Veeva Vault QMS, MasterControl, TrackWise. | X | |
| 140. | The module shall ship with a vendor Quality Manual demonstrating ISO 9001 / GAMP-aligned Software Development Lifecycle. | ~30-page QM covering organization, document control, training, internal audits, management review, CAPA, risk management, customer feedback, continual improvement. | Vendor QM delivered annually; updates per material change. | X | |
| 141. | The module shall ship with SDLC evidence including coding standards, peer-review records, branch-protection rules, CI/CD pipeline description, automated test coverage reports. | Coverage ≥ 80% on critical paths; ≥ 2 reviewer approvals per PR; signed commits on main. | SDLC evidence delivered quarterly; sample artifacts in Validation Accelerator Package. | X | |
| 142. | The module shall ship with a product-level Functional Specification per module. | ~50-page FRS covering module purpose, roles, permissions, workflows, states, transitions, gates, capabilities, configuration surface, API surface, data model, reports, error conditions, AI capabilities. | FRS delivered per minor release; current version cross-referenced in module URS. | X | |
| 143. | The module shall ship with vendor-pre-executed Installation Qualification scripts. | IQ scripts executed in vendor staging environment per documented procedure; customer re-executes in their tenant. | IQ evidence delivered per minor release; customer-environment IQ template included. | X | |
| 144. | The module shall ship with vendor-pre-executed base Operational Qualification scripts. | OQ scripts cover all documented functional capabilities; customer authors configuration-specific OQ. | OQ evidence delivered per minor release; configuration-specific OQ template with 50+ pre-authored test cases included. | X | |
| 145. | The module shall ship with an annual third-party penetration test summary. | Annual pentest by external firm; executive summary shared with customers under NDA; critical findings remediated within 7 days. | Pentest summary delivered annually; full report under NDA on request. | X | |
| 146. | The module shall ship with a pre-filled Vendor Assessment Questionnaire containing answers to 100+ standardized supplier-qualification questions. | VAQ aligned to common pharma procurement intake; updated annually; covers SDLC, security, residency, compliance, AI governance. | VAQ delivered at PoC kickoff; extract in GAMP-CAT-4-COMPLIANCE.md Annex A. | X | |
| 147. | The module shall ship with a Periodic Vendor Audit Pack supporting the customer's annual right-to-audit per EU GMP Annex 11 §3. | Pre-prepared audit pack reduces customer audit-prep burden to 4-6 hours of remote audit (vs 2-3 days from cold). | Audit Pack delivered annually; covers SDLC, security, configuration management, customer support, residency, AI governance, training, internal audits, sub-processors. | X | |
| 148. | The module shall publish Release Notes per version with change classification (functional / security / cosmetic) and customer notification SLA. | Major: 90 days advance; Minor: 30 days; Patch (functional bugfix): 7 days; Patch (security): ≤ 24 hours; Cosmetic: at release. | Release Notes archived; classification tested per release; customer notification log retained. | X | |
| 149. | The module shall be assessed annually against ISPE GAMP 5 updates, FDA CSA updates, EU GMP Annex 11 (revised 2026 + Annex 22 for AI), MHRA ALCOA+, FDA GMLP, EMA AI Reflection Paper, and ISPE Validation 4.0 for ongoing conformance. | Annual review by S.M.A.R.T. Hawk Compliance; updates issued via new revision of GAMP-CAT-4-COMPLIANCE.md and downstream vendor evidence refresh. | Annual compliance review documented; customer notification of material posture change within 30 days. | X | |
| 150. | The module shall maintain a public status page at status.hawkeye.io for real-time customer-visible service status. | Per-service component status; incident history; subscription for email/SMS notifications. | Status page available within 1 minute of incident detection; updated continuously during incidents. | X | |

---

## 9.0 REGULATORY REQUIREMENTS

The S.M.A.R.T. Hawk Audit Management module is a component of the S.M.A.R.T. Hawk Enterprise Quality Management System (EQMS) platform. It is delivered as **Software-as-a-Service (SaaS)** to pharmaceutical manufacturers, CDMOs, and other regulated-supply-chain organisations. Per the regulatory analysis below, it does not itself constitute a medical device under FDA 21 CFR Part 820 (QMSR) or EU Medical Device Regulation (MDR 2017/745); however, it is a **GxP-impacting computerised system** governed by:

| Regulatory framework | Applicability | Module compliance posture |
|---|---|---|
| **ISPE GAMP 5 Category 4** — Configured Product (2nd Edition, July 2022) | The classification for the module | Vendor-side validation evidence and Validation Accelerator Package shipped to all customers; customer leverages per supplier-leverage clause |
| **21 CFR Part 11** — Electronic Records and Electronic Signatures (US FDA) | All customer use of the module for GxP records | Conformant per UN 76 through UN 88 |
| **EU GMP Annex 11** — Computerised Systems (2011 text + 7 Jul 2025 draft revision; new Annex 22 — Artificial Intelligence — expected 2026) | EU-region customer use | All 17 clauses addressed per GAMP-CAT-4-COMPLIANCE.md §23 |
| **MHRA "GxP Data Integrity Definitions and Guidance for Industry"** (March 2018) + **WHO TRS 1033 Annex 4** (2021) | All customer use for data-integrity-sensitive records | All 9 ALCOA+ attributes enforced per UN 89 through UN 97 |
| **FDA Computer Software Assurance (CSA)** — Final Guidance issued 24 Sep 2025; re-issued 3 Feb 2026 | US-region customer validation approach | Validation Accelerator Package designed for vendor-evidence-leveraged customer assurance per CSA risk-based framework |
| **ICH Q9 (R1)** — Quality Risk Management | Customer's risk-based approach to validation effort and CAPA prioritization | Module integrates with S.M.A.R.T. Hawk Risk Management module |
| **ICH Q10** — Pharmaceutical Quality System | Customer's overall PQS, of which the module is a supporting computerized system | Module supports ICH Q10 process elements including Process Performance Monitoring, CAPA, Change Management, Management Review |
| **FDA Good Machine Learning Practice — 10 Guiding Principles** (Oct 2021) | AI features of the module | Aligned per AI-ARCHITECTURE.md and GAMP-CAT-4-COMPLIANCE.md §29 |
| **EMA Reflection Paper on AI in the Medicinal Product Lifecycle** (CHMP/CVMP adopted September 2024) | AI features of the module | Aligned per GAMP-CAT-4-COMPLIANCE.md §29 |
| **ISPE Good Practice Guide: Digital Validation (Validation 4.0)** (April 2025) | Customer's modernization of validation approach | Module's vendor evidence is structured for digital-validation tooling consumption |
| **ISO/IEC 27001:2022** | Information Security Management | Roadmap certification target 2027 |
| **AICPA SOC 2 Trust Services Criteria** | US enterprise customer procurement | Type I Q3 2026; Type II Q1 2027 |
| **India Digital Personal Data Protection Act 2023** | Indian customer data | Compliance obligations met ahead of 13 May 2027 hard deadline |
| **EU GDPR** | EU customer data | DPA executed at contract; EU residency option available |
| **W3C WCAG 2.2 Level AA** | Accessibility of customer-facing interfaces | Target full conformance Q4 2026 per ACCESSIBILITY.md §3 |

> Note on regulatory classification. The S.M.A.R.T. Hawk Audit Management module is NOT itself a medical device. It is a computerised system used by pharmaceutical manufacturers in support of their GxP quality system. The customer remains responsible for the regulatory standing of the medicinal products they manufacture and for the validated state of the systems they use. The module's role is to satisfy 21 CFR §11.10(a) validation in conjunction with the customer's GAMP Cat 4 supplier-leveraged validation lifecycle.

---

## 10.0 MARKET / CUSTOMER PERSPECTIVE OF THE PROBLEM STATEMENT

Based on the qualitative discovery research (24 interviews across 18 organisations, October 2025 to May 2026, documented in RESEARCH-FINDINGS.md), the following problem statements are present in most prospective customer environments:

- Audit preparation consumes approximately 60% of QA team calendar time
- Findings recur every renewal cycle because closure evidence is lost in email threads or spreadsheet trackers
- E-signatures are scattered across email approvals attached to PDFs, failing 21 CFR §11.50 manifestation requirements (no documented Meaning per signature)
- Audit-trail reconstruction during regulatory inspection is "cobbled together from logs, emails, and prayer"
- Shared "QA1" generic logins are common (~50% of interviewed organisations), violating 21 CFR §11.100 unique-to-individual requirement
- Different modules use different systems with no cross-module audit-trail capability
- AI tools (informal ChatGPT use) have produced fabricated CFR citations, a direct ALCOA+ violation that has caused product rejection at multiple organisations
- Validation cost for a custom or Cat 5 system dwarfs the SaaS subscription cost (typical ₹30L+ versus ₹10L ACV)

The S.M.A.R.T. Hawk Audit Management module is designed against each of these problem statements per the user needs cataloged in §8.0. Outcomes are measured during the 60-day Proof of Concept against the six success criteria documented in POC-AGREEMENT.md §4.

---

## 11.0 TARGET MARKET DESCRIPTION

The Audit Management module shall be supplied to:

- **Tier-2 mid-pharma manufacturers** (multi-site, ~$50M-$500M revenue): India + Middle East + select Southeast Asia + Africa, expanding to US + EU post-Series-A
- **Tier-3 Contract Manufacturing Organisations** (2-3 sites, ~$10M-$50M revenue): India + Latin America + Southeast Asia + Africa; the principal beachhead segment
- **Tier-4 SME pharma** (single site, < $10M revenue): India + Africa, with the Starter packaging tier
- **API manufacturers** servicing branded and generic pharma supply chains
- **Packaging and labelling subcontractors** participating in supplier-audit workflows
- **Future verticals** (post-Series-A): Medical device manufacturers (under ISO 13485), Food manufacturers (HACCP/FSMA), Aerospace component suppliers (IATF), Cosmetics manufacturers — each via a vertical configuration pack slotting into S.M.A.R.T. Hawk Layer 4

Geographic data-residency support: India (Mumbai, default for IN tenants), United States (US-East), European Union (Frankfurt). Customer elects at tenant provisioning.

---

## 12.0 TARGET CUSTOMER DESCRIPTION

The Audit Management module shall be sold to **Quality Assurance leadership** at the target customer organisations:

- **Buyer / Decision-maker:** Head of Quality / QA Director / Quality Vice President — owns the EQMS budget, signs the contract, attends the Proof-of-Concept Day-60 review, owns regulatory inspection outcomes
- **Champion / Power user:** QA Manager — daily user of the module, hosts and conducts individual audits, drafts findings, approves CAPAs, kills the deal if usability is poor per RESEARCH-FINDINGS.md Insight 4
- **End-user (operations):** Production Manager / Subject-Matter Expert — responds to audit-section assignments, uploads evidence, drafts narrative responses
- **End-user (auditor / auditee):** External auditor (read-mostly), supplier-side QA (responds via supplier portal)
- **Influencer (IT Compliance):** IT Compliance Lead — verifies GAMP classification, SOC 2 status, data residency, SSO compatibility, validation accelerator content
- **Influencer (CFO):** Chief Financial Officer / Procurement Lead — signs off on annual ACV against documented ROI math and validation TCO savings per CFO-DECK.md slide 5a

The module is configured for the customer's tenant by S.M.A.R.T. Hawk Customer Success during onboarding, with ongoing configuration changes available to the customer's Tenant Administrator per UN 16 through UN 23.

The customer remains responsible for further integration and validation of the module within their broader quality system, including clinical / commercial use of any medicinal product manufactured under the customer's quality oversight.

---

## 13.0 SOLUTION OVERVIEW

The S.M.A.R.T. Hawk Audit Management module shall comply with the regulatory and industry standards enumerated in §5.0 and §9.0. The principal solution components are:

a) **5-Layer Architecture** (S.M.A.R.T. Hawk platform canonical) — Trust · Security · Compliance (foundation) → Data & Evidence → AI Gateway → Domain Engine (where this module lives) → Experience. Per ADR-001 and PLATFORM-OVERVIEW.md §2.

b) **5-Pillar Runtime Pipeline** (universal across all 15 EQMS modules) — Sense → Monitor → Analyze → Record → Trace. The Audit Management module instantiates this pipeline for the audit lifecycle.

c) **GAMP 5 Category 4 Configured Product** classification per PDR-002 and GAMP-CAT-4-COMPLIANCE.md, with Validation Accelerator Package shipped at PoC kickoff.

d) **Multi-LLM AI Gateway** (Layer 3) — Anthropic Claude (default), OpenAI GPT, Google Gemini, local vLLM Llama 3 (sovereign / on-prem) — per ADR-002, with cite-or-fallback non-configurable guarantee per ADR-003.

e) **21 CFR Part 11 Electronic Signature ceremony** — Password + Reason on every signing event, manifested with printed name + UTC + meaning per §11.50, linked to record via SHA-256 hash per §11.70.

f) **Tamper-evident Audit Trail** capturing every state change with user · UTC · session · IP · reason per §11.10(e) and Annex 11 §9, retained per record lifetime, cannot be disabled by any user role.

g) **Cross-module integration** with the twelve other EQMS modules of the S.M.A.R.T. Hawk platform (Document Control, CAPA, Deviation, Change Control, Training, Risk Management, Complaint, Supplier Management, Equipment, Batch Records, Management Review, Design Control) plus the cross-cutting AskHawk conversational AI agent.

h) **Multi-tenant SaaS delivery** with optional sovereign on-premise deployment for Enterprise customers requiring data sovereignty (roadmap M12+).

i) **WCAG 2.2 AA Accessibility** target with Q4 2026 milestone for full conformance, including specific accessibility commitments for the e-signature ceremony per ACCESSIBILITY.md §7.

j) **SOC 2 Type II** attestation target Q1 2027; **ISO/IEC 27001:2022** certification target 2027; **annual third-party penetration test** with executive summary shared under NDA.

---

## 14.0 TECHNOLOGY OVERVIEW

The S.M.A.R.T. Hawk Audit Management module is built on the following technical stack and processed through the following operational pipeline:

a) **Frontend** — Next.js 15 (App Router) · React 18 · TypeScript 5 strict · Material-UI (MUI) 6 · Emotion (CSS-in-JS) · Tailwind CSS · react-hook-form + Zod · next-intl (i18n) · socket.io-client (real-time). Per FRONTEND.md.

b) **Backend** — Node.js 20 · Express · 4-layer middleware chain (auth → tenant → role → feature-flag) · Mongoose 7 against MongoDB Atlas · custom JWT auth · 95+ route files · 170+ Mongoose models · 12-stage middleware pipeline. Per ARCHITECTURE.md.

c) **Data Layer** — MongoDB Atlas (M-tier cluster, 3-node, per-region for residency) · S3-compatible evidence store (Cloudflare R2 default; AWS S3, Backblaze B2, DigitalOcean Spaces, MinIO swap-in) · SHA-256 record snapshot hashing.

d) **AI Layer** — Multi-LLM Gateway (services/ai/gateway/llmGateway.js) routing to Anthropic Claude · OpenAI GPT · Google Gemini · local vLLM Llama 3 · Grounded generation with cite-or-fallback · AI Audit Trail per call · Active learning loop · Drift monitoring · Prompt-injection defence · PII redaction pre-flight.

e) **Authentication** — Custom JWT in httpOnly cookie issued post-SSO; SSO via SAML 2.0 or OpenID Connect with customer's IdP (Okta, Azure AD, Google Workspace, Ping, OneLogin, others); MFA enforced at IdP per tenant policy.

f) **Hosting** — Vercel (frontend + serverless functions for Express) · MongoDB Atlas (managed) · Cloudflare R2 (S3-compatible storage) · separate Node service for long-lived WebSocket (planned Fly.io migration Q4 2026). Per INFRASTRUCTURE.md.

g) **CI/CD** — GitHub + GitHub Actions · automated lint, type-check, unit test, integration test, E2E (Playwright on key flows) · SAST (CodeQL) · Dependabot · branch protection on main with ≥2 reviewer approvals · signed commits · Vercel preview deploy per pull request · auto-deploy to production on merge to main.

h) **Observability** — Sentry (error reporting) · Vercel logs + Atlas logs (structured with correlation IDs) · Vercel Analytics (Core Web Vitals) · UptimeRobot + Vercel monitor · status.hawkeye.io (public status page) · per-tenant metrics dashboard.

i) **Compliance Spine** — Layer 1 controls (Trust · Security · Compliance) enforced across every higher layer: 21 CFR Part 11, EU GMP Annex 11, ALCOA+ data integrity, GAMP 5 Cat 4 validation, FDA CSA risk-based assurance, India DPDP, EU GDPR, SSO/MFA/RBAC at record level, per-tenant encryption (BYOK on Enterprise), data residency (IN/US/EU), no AI training on customer data without consent.

j) **Release Process** — Semantic versioning (MAJOR.MINOR.PATCH) · classified per release (functional / security / cosmetic) · customer notification SLA per classification · vendor-pre-executed IQ/OQ scripts shipped per minor release · Validation Accelerator Package refreshed annually plus per material release.

---

## 15.0 REVISION HISTORY

| Current Version | Effective Date | Reason for change |
|---|---|---|
| 00 | (To be set on approval) | New document — initial issue of User Need Specification for the S.M.A.R.T. Hawk Audit Management module per change control CC/2026/HK-AUDIT/001 |

---

*Doc_V2 · 06-modules · audit-management · UNS · v0 (Draft) · 2026-06-08 · Confidential*
