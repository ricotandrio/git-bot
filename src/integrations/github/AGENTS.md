# GitHub Integration Guidance

Canonical architecture and policy:

- `AGENTS.md`
- `docs/ARCHITECTURE.md`

Responsibilities in this folder:

- GitHub API client usage
- Action wrappers (`create_issue`, `assign_issue`, etc.)
- Provider-specific error propagation

Do not encode guild/business policy in this layer.
