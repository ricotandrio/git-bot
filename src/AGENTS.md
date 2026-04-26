# Source Folder Guidance

Canonical architecture and policy live in:

- `AGENTS.md`
- `docs/ARCHITECTURE.md`

Use this folder for runtime application code only.

Layer boundaries:

- `src/config`: configuration parsing
- `src/app`: app composition/context
- `src/core`: domain workflows and events
- `src/integrations`: external providers/adapters
- `src/interfaces`: delivery channels (bot/api)
- `src/utils`: shared utilities with no business rules

Do not place business rules directly in interface or integration modules.
