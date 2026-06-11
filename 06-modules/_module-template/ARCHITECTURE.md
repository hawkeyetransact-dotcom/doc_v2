# ARCHITECTURE — `<Module Name>`

> System architecture + data + API + RBAC + AI + regulatory trace. Replace `<placeholders>` when copying.

## 1. System Context

Where this module sits in the platform. What it consumes / what consumes it.

```
[Frontend] → [API routes] → [controllers] → [services] → [models / DB]
                                              ↓
                                       [AI services / agents]
                                              ↓
                                       [audit-trail / e-sig]
```

## 2. Data Model

Entities and relationships specific to this module.

| Model | Purpose | Key fields | Relationships |
|---|---|---|---|

ERD reference: `Doc_V2/04-engineering/02-data-model/<module>-erd.mmd` (when produced).

## 3. API Contracts

| Method | Path | Auth | RBAC | Purpose | Side effects |
|---|---|---|---|---|---|

## 4. RBAC Matrix

| Capability | Buyer | Auditor | Supplier | Tenant Admin | Superadmin |
|---|---|---|---|---|---|

## 5. AI Capabilities

| AI tool | Purpose | Read/Write | E-sig gate | Audit-trail entry |
|---|---|---|---|---|

## 6. State Machine (Implementation)

Cross-reference DESIGN §4. Document how the state transitions are enforced in code (services, middleware, model-level hooks).

## 7. Compliance Trace

Map each platform feature to the regulatory clause it satisfies.

| Feature | 21 CFR Part 11 | ICH Q7 | EU GMP Annex 11 | ISO 9001 |
|---|---|---|---|---|

## 8. Operational Concerns

- Performance / scale targets
- Failure modes + recovery
- Observability (logs, metrics, traces)

## 9. Open Engineering Questions

Things still being designed.
