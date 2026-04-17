# GitBot Architecture

This document explains how GitBot is structured, how requests flow through the system, and where to add new features safely.

## High-Level Overview

GitBot has two runtime entry points:

- `src/main.bot.ts`: starts the Discord bot runtime.
- `src/main.api.ts`: starts the Express API runtime for webhooks/health.

The bot runtime is built around an application context (`AppContext`) that initializes and holds core dependencies:

- GitHub integration
- LLM integration
- Database integration
- Event bus
- Analytics service

This context is created once at startup and then consumed by orchestration and interface layers.

## Layered Structure

### 1) Config Layer

- Folder: `src/config/`
- Responsibility: reads environment variables and builds runtime configuration.

Main config modules:

- `env.ts`: shared env parsing (`requireEnv`) and top-level config object.
- `discord.ts`, `github.ts`, `llm.ts`: provider-specific configuration.

### 2) App Context / Composition Root

- File: `src/app/context.ts`
- Responsibility: application bootstrap wiring and lifecycle initialization.

`createAppContext(config)` creates and connects all integrations and returns a typed `AppContext` object.

`setAppContext` and `getAppContext` expose the initialized context for modules that need runtime dependencies.

### 3) Integrations Layer

- Folder: `src/integrations/`
- Responsibility: external systems and provider adapters.

Key integrations:

- `db/`: SQLite access (`better-sqlite3`) and action modules.
- `github/`: GitHub actions (`create_issue`, `assign_issue`, `get_issues`, repositories).
- `llm/`: OpenAI/Gemini provider abstraction.
- `analytics/`: event tracking provider abstraction.
- `terminal/`: terminal integration surface.

### 4) Domain/Use-Case Layer (Orchestrations)

- Folder: `src/core/orchestrations/`
- Responsibility: business use cases and workflows.

Current orchestration modules:

- `issue.orchestration.ts`: create/assign/list issue behavior.
- `repository.orchestration.ts`: repository allow-list management per guild.
- `user.orchestration.ts`: Discord-to-GitHub account mappings.
- `llm.orchestration.ts`: natural language parsing and command generation.

These modules consume dependencies via `AppContext` instead of constructing providers directly.

### 5) Interface Layer

- Folder: `src/interfaces/`
- Responsibility: delivery channels (Discord bot and HTTP API).

Bot side:

- `interfaces/bot/client.ts`: Discord client bootstrap and slash command deployment.
- `interfaces/bot/handlers/`: event handlers for interactions/messages.
- `interfaces/bot/commands/`: slash command definitions and execution.

API side:

- `interfaces/api/client.ts`: Express server, health endpoints, and GitHub webhook ingestion.

## Eventing and Analytics

Event bus implementation lives in `src/core/events/`.

On boot, analytics consumers are registered so emitted events can be tracked asynchronously.

Current event map is intentionally small and can be expanded in `events.type.ts` as new domain events are introduced.

## Runtime Flow

### Bot Runtime

1. `main.bot.ts` loads config.
2. `createAppContext(config)` initializes integrations.
3. `startBot(...)` creates Discord client and deploys commands.
4. Handlers process slash commands and mentions.
5. Handlers call orchestration functions.
6. Orchestrations call integrations and emit events.

### API Runtime

1. `main.api.ts` loads config and starts Express.
2. API exposes:
	- `GET /`
	- `GET /health`
	- `POST /webhooks/github`
	- `POST /api/webhooks/github`
3. Webhook payload metadata is logged and acknowledged.

## Persistence Model

SQLite database file path is currently `./data/gitbot.db`.

Persisted data includes:

- Guild-to-repository mappings
- Discord-to-GitHub username mappings

All DB operations are wrapped by action modules under `src/integrations/db/*/actions`.

## Dependency Injection Direction

Current design uses an application context as the primary dependency source. This enables:

- deterministic startup order
- easier integration swapping (e.g., LLM provider)
- clearer boundaries between orchestration and provider code

For future improvement, you can move from global `getAppContext()` access to explicit context injection per command/handler constructor for stronger test isolation.

## Extension Guide

When adding a new feature:

1. Add provider-level changes in `src/integrations/*` if external I/O is required.
2. Add or update orchestration logic in `src/core/orchestrations/*`.
3. Expose feature through Discord command/handler and/or API route.
4. Emit domain events where useful and register analytics consumers.
5. Keep business rules in orchestration layer, not in integration or UI layer.

## Suggested Future Improvements

- Add integration and orchestration unit tests with dependency mocks.
- Add graceful shutdown hooks for DB and network clients.
- Add schema migration/versioning for SQLite tables.
- Add command authorization/role-based access controls.
