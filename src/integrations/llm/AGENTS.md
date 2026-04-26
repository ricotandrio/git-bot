# LLM Integration Guidance

Canonical architecture and policy:

- `AGENTS.md`
- `docs/ARCHITECTURE.md`

Responsibilities in this folder:

- Provider abstraction (OpenAI/Gemini)
- Prompt/provider request handling
- Response shaping for orchestration use

Keep provider-specific behavior isolated behind integration contracts.
