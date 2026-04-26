# Integrations Layer Guidance

Canonical architecture and policy:

- `AGENTS.md`
- `docs/ARCHITECTURE.md`

Responsibilities in this folder:

- External provider adapters (DB, GitHub, LLM, analytics, terminal)
- Provider client lifecycle and connection handling
- I/O translation between provider and domain contracts

Do not place business decisions in integration adapters.
