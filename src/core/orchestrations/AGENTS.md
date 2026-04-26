# Orchestration Guidance

Canonical architecture and policy:

- `AGENTS.md`
- `docs/ARCHITECTURE.md`

Responsibilities in this folder:

- Implement use-case workflows
- Coordinate integrations through `AppContext`
- Emit domain events for async consumers

Keep business rules here, not in integrations or interface handlers.
