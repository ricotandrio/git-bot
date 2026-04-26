# App Composition Guidance

Canonical architecture and policy:

- `AGENTS.md`
- `docs/ARCHITECTURE.md`

Responsibilities in this folder:

- Build application context and wire dependencies
- Own startup-time integration initialization
- Expose typed context for orchestrations and interfaces

Do not implement business workflows here.
