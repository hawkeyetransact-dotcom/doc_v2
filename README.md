# Doc_V2/ — Hawkeye Company Documentation

> Created 2026-05-31. This is a from-scratch taxonomy for everything a SaaS startup needs to document. It runs in parallel with the legacy `backend/docs/` tree while we migrate.

## Why this exists

The legacy `backend/docs/` grew organically and accumulated noise. Doc_V2 is a clean, opinionated taxonomy:

- **Company-wide** (not backend-specific) — covers strategy, fundraising, sales, legal, ops, design, product, engineering, modules, customer success, research
- **One source per topic** — no scattered duplicates
- **Per-module template** — every product module gets the same 3 docs (URS, DESIGN, ARCHITECTURE)
- **Empty-by-default** — files added deliberately as content is migrated or written

## Top-level taxonomy

| # | Folder | Purpose |
|---|---|---|
| 00 | `company/` | Mission, vision, org chart, hiring, culture |
| 01 | `strategy/` | Business strategy, market analysis, GTM, pricing, partnerships |
| 02 | `fundraising/` | Pitch deck, business plan, financial model, data room, investor updates |
| 03 | `product/` | PRD, URS canon, roadmap, personas/research, product ADRs |
| 04 | `engineering/` | Platform architecture, data model, API, infrastructure, security, AI |
| 05 | `design/` | Design system, user flows, wireframes, accessibility |
| 06 | `modules/` | Per-module deep specs — 15 modules × 3 docs each |
| 07 | `operations/` | Runbooks, on-call, incident response, disaster recovery |
| 08 | `compliance-regulatory/` | 21 CFR Part 11, ICH Q-series, EU GMP, ISO, validation, data integrity |
| 09 | `sales-marketing/` | Pitch materials, demo scripts, case studies, customer pitches, content |
| 10 | `customer-success/` | Onboarding, user manuals, training, per-customer accounts |
| 11 | `research-domain/` | Industry research, pharma domain knowledge, competitive intel |
| 12 | `legal/` | Contracts, IP, employee agreements, data protection |
| — | `_archive/` | Anything moved aside |

## Per-module template

Every folder under `06-modules/<module>/` follows the same 3-document structure:

- **URS.md** — User Requirements Spec (Part A foundational + Part B differentiator white-space)
- **DESIGN.md** — UX flows, personas, journey maps, state machine, screens
- **ARCHITECTURE.md** — System architecture, data model, API catalog, RBAC matrix, AI capabilities, regulatory-clause traceability

See `06-modules/_module-template/` for the canonical scaffold.

## Status

- ✅ **audit-management/** — reverse-engineered from current code (2026-05-31)
- ⏳ All other modules — placeholders only

## Migration from legacy `backend/docs/`

The legacy `backend/docs/` tree remains in place for now. Migration happens deliberately on a per-topic basis. See [INDEX.md](INDEX.md) for the planned mapping.
