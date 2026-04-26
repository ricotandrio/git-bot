# GitBot

GitBot is a Discord bot that integrates GitHub repository management directly into Discord. It enables teams to create and manage issues without leaving their primary communication channel.

GitBot solves this by allowing anyone to create a structured GitHub issue directly from Discord with a simple command.

## Prerequisites

- Node 20+

## Testing

Run all tests:

```bash
npm test
```

Run unit tests only:

```bash
npm run test:unit
```

Run integration tests only:

```bash
npm run test:integration
```

Clean build artifacts and common caches:

```bash
npm run clean
```

Clean cache directories only:

```bash
npm run clean:cache
```

## Linting and Formatting

Run ESLint:

```bash
npm run lint
```

Run ESLint with auto-fix:

```bash
npm run lint:fix
```

Run Prettier check:

```bash
npm run prettier:check
```

Pre-commit enforcement is enabled with Husky + lint-staged.
On every commit, staged files are checked by ESLint and formatted by Prettier.

## Usage

GitBot supports both natural language interaction and structured slash commands.

### Natural Language via @mention

You can also just tag the bot and describe what you want in plain English, no commands needed:

```
@GitBot create a bug for login crash in my-repo
@GitBot assign issue #42 to @rico in my-repo
@GitBot what repos are available?
@GitBot remove my-repo from the list
```

GitBot uses Gemini API to understand your intent and execute the right action automatically.

### Slash Commands

Use structured slash commands for precise control:

| Command          | Description                              |
| ---------------- | ---------------------------------------- |
| `/create-issue`  | Create a GitHub issue from Discord       |
| `/assign-issue`  | Assign an issue to a team member         |
| `/add-repo`      | Add a GitHub repository to the server    |
| `/link-github`   | Link your Discord account to GitHub      |
| `/unlink-github` | Unlink your GitHub account               |
| `/status`        | View open issues across all repositories |
| `/helps`         | List all available commands              |
| `/ping`          | Check bot latency                        |
