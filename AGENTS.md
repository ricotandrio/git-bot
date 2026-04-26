# AGENTS.md

## Purpose

This is the single instruction source for all AI agents in this repository.

Use this file instead of provider-specific prompt files.

If provider files exist (`CLAUDE.md`, `GEMINI.md`, `OPENAI.md`), they must only say:

Refer to AGENTS.md

## Project Context

Project: AI-driven Git bot with webhook automation and event-driven processing.

Primary goals:

- reliable event bus behavior
- reliable webhook ingestion and outbound delivery
- robust news scraping and summarization flow
- safe autonomous behavior with clarification on ambiguity

Canonical architecture doc:

- `docs/ARCHITECTURE.md`

Before architectural changes, read the architecture doc and keep boundaries intact unless explicitly asked to change them.

## Core Rules

### 0) Start from product and feature goals

Before proposing or coding:

- identify product goal and feature goal
- confirm success criteria
- confirm what must not change

If unclear, stop and ask.

### 1) Do not guess

Do not invent assumptions for production behavior, schemas, contracts, payloads, external APIs, or deployment behavior.

Low-risk implementation assumptions are allowed only when explicitly documented.

### 2) Prefer correctness over speed

Priority order:

1. correctness
2. maintainability
3. observability
4. performance
5. speed

### 3) Make minimal complete changes

Do:

- focused fixes
- explicit contracts
- testable boundaries

Do not:

- broad rewrites
- hidden side effects
- unrelated refactors

### 4) Explain non-trivial decisions

Always state:

- what changed
- why it changed
- risks
- follow-up recommendations

## Engineering Standards

### Code Quality

- explicit naming
- deterministic behavior
- small composable units
- typed contracts
- failure-safe operations

Avoid hidden magic, implicit side effects, silent failures, and swallowed exceptions.

### Logging

Log key starts/ends, retries, external calls, validation failures, and critical errors.

### Error Handling

Use structured actionable errors, explicit retry boundaries, and explicit fallback behavior.

### Testing

Cover core workflows, contracts, retries, failure paths, and edge cases.

### Required Repository Scripts

`package.json` must keep:

- `clean`
- `clean:cache`
- `test`
- `test:unit`
- `test:integration`
- `lint`
- `lint:fix`
- `format:check`

If these change, update command usage in `README.md` in the same change.

Pre-commit must keep lint/format enforcement.

## Execution Flow

Follow this order every time:

1. identify product and feature goals
2. verify requirements and expected behavior
3. read architecture/design docs
4. inspect relevant code
5. identify constraints and unknowns
6. ask clarification if needed
7. propose approach
8. implement minimal complete solution
9. validate edge and failure paths
10. document outcomes

## Mandatory Completion Checklist

Before marking done, all must be true:

- [ ] product goal identified
- [ ] feature goal identified
- [ ] success criteria confirmed
- [ ] requirements verified
- [ ] architecture docs reviewed
- [ ] relevant code reviewed
- [ ] constraints and risks listed
- [ ] clarification asked when needed (or explicitly not needed)
- [ ] minimal complete implementation delivered
- [ ] failure paths and edge cases validated
- [ ] lint/tests/validation run or explicitly justified if skipped
- [ ] changes documented with risks and follow-ups
- [ ] architecture and contracts preserved

If any item is unchecked, task is not complete.

## Forbidden

Do not:

- fabricate requirements
- change architecture without checking docs
- silently change contracts
- bypass validation for speed
- create fake production assumptions
- ignore known failure paths
- suppress important failures

## Default Mindset

Think like a senior engineer, systems designer, and production reliability engineer.

Build for production reliability, not demo success.
