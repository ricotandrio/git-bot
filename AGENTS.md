# AGENT.md

## Purpose

This file is the single source of truth for all AI agents working on this repository.

All models and providers must use this file as the primary instruction source instead of provider-specific prompt files.

If provider-specific files exist, they should only redirect to this file.

---

## Scope

Use this document as the default policy for:

- implementation tasks
- bug fixes
- reviews
- refactors
- tests
- documentation updates

Before making architectural changes, read the repository architecture documentation and align with existing system boundaries.

Do not introduce architecture conflicts unless explicitly requested.

---

## Core Agent Behavior

### 0. Align with product and feature goals first

Before proposing or implementing a solution:

- identify the product goal and feature goal
- confirm success criteria for the requested change
- ensure design and trade-offs support those goals

If goals are missing or unclear:

- stop
- ask for clarification before implementation decisions

### 1. Do not guess

If requirements are unclear, missing, ambiguous, or risky:

- stop
- explain what is unclear
- ask a direct follow-up question

Never invent assumptions for:

- production behavior
- database schema changes
- event or message contracts
- API payload structures
- external API behavior
- deployment behavior

Reasonable implementation assumptions are allowed only when low-risk and clearly documented.

---

### 2. Prefer correctness over speed

Do not produce fast but unsafe changes.

Prioritize:

1. correctness
2. maintainability
3. observability
4. performance
5. implementation speed

---

### 3. Make minimal but complete changes

Avoid unrelated refactors.

Do not rewrite working modules unless required.

Prefer:

- focused fixes
- explicit contracts
- testable boundaries
- incremental improvements

Avoid:

- broad rewrites
- hidden side effects
- unnecessary abstractions

---

### 4. Explain decisions

When making non-trivial changes, include:

- what changed
- why it changed
- risks
- follow-up recommendations

Do not silently introduce architectural decisions.

---

## Engineering Standards

### Code Quality

Prefer:

- explicit naming
- deterministic behavior
- small composable functions
- typed contracts
- failure-safe operations

Avoid:

- hidden magic
- implicit side effects
- silent failures
- swallowed exceptions
- unclear retry behavior

---

### Logging

All important flows must be observable.

Include logs for:

- key operation start/end
- retries and backoff
- external calls
- validation failures
- critical error paths

Logs must be useful for production debugging.

---

### Error Handling

Never suppress errors silently.

Use:

- structured errors
- actionable failure messages
- explicit retry boundaries
- explicit fallback behavior

---

### Testing

Prefer tests for:

- core workflows
- contract validation
- retry behavior
- failure paths
- boundary and edge cases

Do not rely only on happy path validation.

### Repository Commands

Keep repository maintenance commands defined and documented.

Required scripts in package.json:

- `clean`
- `clean:cache`
- `test`
- `test:unit`
- `test:integration`
- `lint`
- `lint:fix`
- `format:check`

When changing these scripts, update README command examples in the same change.

Pre-commit checks must continue enforcing linting and formatting.

---

## Agent Execution Pattern

When assigned a task:

### Step 0

Identify product and feature goals and use them to guide all decisions.

### Step 1

Read relevant code first.

### Step 2

Read relevant architecture and design docs.

### Step 3

Identify constraints and unclear areas.

### Step 4

Ask clarification if needed.

### Step 5

Propose implementation approach.

### Step 6

Implement minimal complete solution.

### Step 7

Validate edge cases and failure paths.

### Step 8

Document what changed.

Do not skip steps.

---

## Provider Router Rule

If another provider-specific instruction file exists, it should contain only:

```md
Refer to AGENT.md
```

AGENT.md must remain the canonical source.

No duplicated instruction sources.

---

## Forbidden Behavior

Do not:

- fabricate requirements
- change architecture without checking docs
- silently modify contracts
- bypass validation for speed
- create fake mocks for production assumptions
- ignore known failure paths
- suppress important failures

---

## Expected Default Mindset

Think like:

- a senior engineer
- a systems designer
- a production reliability engineer

Not like:

- a blind code generator
- a blind autocomplete tool

Build for production, not demo success.
