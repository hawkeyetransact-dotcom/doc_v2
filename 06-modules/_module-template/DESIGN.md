# DESIGN — `<Module Name>`

> UX design + user journeys + state machine. Replace `<placeholders>` when copying.

## 1. Personas

Cross-reference URS §2. For each persona working in this module, capture:

| Persona | Primary actions | Frequency | Key decisions |
|---|---|---|---|

## 2. User Journeys

End-to-end journey per persona (or per scenario). For each:

- **Trigger** — what kicks it off
- **Steps** — numbered, with screen/component reference where relevant
- **Outcome** — success state + failure modes
- **Handoffs** — when the journey crosses to another persona

## 3. Screens and Components

Inventory of pages/components, what each does, key affordances.

| Screen / Component | Path (frontend) | Purpose | Primary persona |
|---|---|---|---|

## 4. State Machine

The module's records (audits, CAPAs, etc.) progress through a state machine. Diagram + transition table:

```
[draft] → [submitted] → [in_review] → [approved] → [closed]
              ↓
          [rejected]
```

| From state | Transition trigger | To state | Who can trigger | Side effects |
|---|---|---|---|---|

## 5. Notifications and Reminders

What gets notified, to whom, when.

## 6. Error and Edge Cases

Empty states, permission denials, validation failures, concurrency conflicts.

## 7. Accessibility

WCAG considerations specific to this module.

## 8. Open Design Questions

Things still being designed.
