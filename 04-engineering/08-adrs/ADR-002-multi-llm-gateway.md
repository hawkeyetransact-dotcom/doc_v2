# ADR-002 — Multi-LLM Gateway Pattern

| Field | Value |
|---|---|
| Status | **Accepted** — 2026-03-15 |
| Author | Engineering Lead · AI Lead |
| Reviewers | CTO · Founders |
| Supersedes | n/a |
| Superseded by | n/a |

---

## 1. Context

Hawkeye's product positions itself as "AI-native", meaning AI assistance appears in every module (audit finding drafting, CAPA RCA, deviation analysis, document classification, AskHawk chat, etc.). The earliest prototype hard-coded Anthropic's Claude SDK directly into each module that needed AI.

This created several problems as we added a second provider (OpenAI) for specific tasks:

1. **Provider sprawl**: every new module had to import + initialize whichever SDK it needed; cross-cutting concerns (auth, retry, logging) were duplicated.
2. **No tenant override**: a customer who wanted to use OpenAI instead of Anthropic for compliance reasons (e.g., AWS Bedrock-hosted models) had no upgrade path that didn't require code changes.
3. **No on-prem path**: Enterprise customers asking about sovereign deployments needed local Llama 3, which required a fourth integration with a completely different shape.
4. **No AI Audit Trail**: capturing every AI call's model + version + prompt hash + retrieval set + confidence needed to be cross-cutting, not per-caller.
5. **Cost control**: tracking token spend per tenant per provider required centralized observability.

---

## 2. Decision

> 📜 **Hawkeye adopts a Multi-LLM Gateway pattern: a single service (`services/ai/gateway/llmGateway.js`) is the only code path that talks to any LLM provider.** All AI features (modules, agents, AskHawk) invoke the gateway with a normalized envelope; the gateway routes to the appropriate provider per tenant config + per-task override.

**Architectural rule:** no controller or service may import a provider SDK directly. Imports of `anthropic`, `openai`, `@google/generative-ai` etc. are restricted to `services/ai/gateway/` by code-review convention (enforced by lint rule under development).

---

## 3. Alternatives considered

### Option A: Continue hard-coded per-module
- **Pros:** Simplest path; no abstraction overhead
- **Cons:** Provider sprawl; no tenant override; cost control fragmented; AI Audit Trail must be implemented N times

### Option B: Use a third-party LLM router (Portkey, Helicone, LiteLLM)
- **Pros:** Off-the-shelf; battle-tested
- **Cons:** External dependency in the AI critical path; data leaves Hawkeye servers; conflicts with Layer 1 "no third-party data sharing" commitment; tenant-residency complications; vendor lock-in

### Option C: LangChain abstraction
- **Pros:** Well-known framework; community models
- **Cons:** Heavy framework; opinions don't match Hawkeye's grounded-generation approach; debugging is harder; framework upgrades break consumers

### Option D: Selected — Custom in-house Gateway
- **Pros:** Full control over routing, retry, logging, AI Audit Trail; data never leaves Hawkeye; aligns to Layer 1 commitments; can implement Hawkeye-specific patterns (cite-or-fallback, prompt hash, model version pinning, drift monitoring)
- **Cons:** Maintenance burden; we must implement multi-provider features ourselves (streaming, tool-calling, function-calling per provider's API shape)

---

## 4. Rationale

| Criterion | Verdict |
|---|---|
| Data sovereignty | Option D wins — no third party in AI critical path |
| Tenant overrides | Option D wins — config-driven per tenant |
| AI Audit Trail completeness | Option D wins — guaranteed at gateway level |
| Cost control / metering | Option D wins — gateway is the single point of measurement |
| Cite-or-fallback enforcement | Option D wins — implemented once at the gateway |
| Sovereign deployment | Option D wins — same code path can swap in local vLLM |
| Multi-provider tool-calling abstraction | Option D requires custom work; the others have it |
| Velocity | Option B/C are faster initially; D pays off after 6+ months |

Net: data sovereignty + AI Audit Trail + Layer 1 commitments make D the only viable choice.

---

## 5. Consequences

### Positive
- One file (`llmGateway.js`) is the contractual boundary for all AI calls.
- AI Audit Trail (`aiAuditTrail.js`) hooks into every call automatically.
- Cite-or-fallback is enforced at the gateway — cannot be bypassed by a future careless caller.
- Sovereign deployments (Enterprise on-prem with local Llama 3) require only a new provider adapter, not a per-module change.
- Cost metering per tenant per provider is centralized.
- Provider failover (Anthropic down → OpenAI fallback for a task type) is configurable at gateway level.

### Negative
- We carry the maintenance burden of provider SDK changes (Anthropic, OpenAI, Gemini all evolve their APIs).
- Streaming / tool-calling / function-calling normalization is on us.
- Test coverage on the gateway must be high (mocks for every provider).

### Operational
- Engineers learn to invoke `llmGateway.invoke({ task, context, options })` — never the underlying SDK.
- Code review rejects PRs that import an LLM provider SDK outside `services/ai/`.
- Adding a new provider = one new adapter file + gateway routing entry.

---

## 6. Implementation notes

### Files

| File | Purpose |
|---|---|
| `services/ai/gateway/llmGateway.js` | The single entry point; routes to providers; normalizes envelopes |
| `services/ai/gateway/anthropicProvider.js` | Anthropic adapter (raw fetch to api.anthropic.com) |
| `services/ai/gateway/openaiProvider.js` | OpenAI adapter (uses `openai` npm package) |
| `services/ai/gateway/geminiProvider.js` | Google Gemini adapter |
| `services/ai/gateway/legacyProvider.js` | Local vLLM / Llama 3 adapter (sovereign) |
| `services/ai/audit/aiAuditTrail.js` | Hooked into every gateway call; captures model + version + promptHash + retrievalSet + confidence + user disposition |
| `services/ai/redaction/piiRedactionService.js` | Pre-flight PII redaction before any provider call |

### Envelope shape

```ts
// Request
{
  task: 'auditFindingDraft' | 'capaRcaDraft' | 'askHawkChat' | ...,
  tenantId: string,
  userId: string,
  context: { /* task-specific */ },
  options?: {
    providerOverride?: 'anthropic' | 'openai' | 'gemini' | 'local',
    modelOverride?: string,
    temperature?: number,
    stream?: boolean
  }
}

// Response
{
  text: string,
  citations: Array<{ sourceId: string, hash: string, span: [number, number] }>,
  confidence: number,
  modelProvider: string,
  modelVersion: string,
  promptHash: string,
  retrievalSet: string[],
  tokens: { input: number, output: number },
  latencyMs: number,
  toolCalls?: Array<{ name: string, args: any }>
}
```

### Tenant config

Per-tenant provider routing lives in `tenantModel.aiConfig`:

```js
{
  defaultProvider: 'anthropic',
  taskOverrides: {
    'capaRcaDraft': 'openai',      // tenant prefers GPT for RCA
    'askHawkChat': 'anthropic'
  },
  trainingOptOut: true              // never used for training (default true)
}
```

---

## 7. When to revisit

| Signal | Action |
|---|---|
| A reliable 3rd-party LLM router (Portkey-class) becomes data-sovereign and per-tenant-config | Re-evaluate buy vs maintain |
| Maintaining 4+ provider adapters becomes a meaningful eng cost (>20% of AI engineering time) | Consider partial offload |
| A new dominant model API standard emerges (OpenAI Realtime, Anthropic MCP) that materially changes the abstraction | Re-architect envelope |
| Customer demand for a 5th provider that doesn't fit the envelope | Re-evaluate envelope shape |

---

## 8. References

- [ARCHITECTURE.md §3.1](../01-architecture/ARCHITECTURE.md) — Multi-LLM Gateway pattern detail
- [AI-ARCHITECTURE.md](../07-ai/AI-ARCHITECTURE.md) — full AI architecture
- [ADR-003 — Cite-or-Fallback](./ADR-003-cite-or-fallback.md) — related guarantee enforced at gateway
- [GAMP-CAT-4-COMPLIANCE.md §28](../../08-compliance-regulatory/GAMP-CAT-4-COMPLIANCE.md) — AI Audit Trail validation
- LangChain — considered and rejected (Option C)
- Portkey, Helicone, LiteLLM — considered and rejected (Option B)

---

*Doc_V2 · Engineering · ADR-002 · Accepted 2026-03-15*
