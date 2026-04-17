# GitBot Setup Guide

This guide covers local setup for development and production-like runs.

## Requirements

- Node.js 20+
- npm 10+
- A Discord application and bot token
- A GitHub Personal Access Token
- At least one LLM provider API key (Gemini by default)

## 1) Install Dependencies

From project root:

```bash
npm install
```

## 2) Environment Variables

The project expects environment files used by scripts:

- `.env`

Minimum required variables:

```env
NODE_ENV=development
EXPRESS_PORT=3000

DISCORD_BOT_TOKEN=your_discord_bot_token
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_GUILD_ID=your_discord_guild_id
DISCORD_STANDUP_CHANNEL_ID=your_standup_channel_id

GITHUB_PAT=your_github_personal_access_token
GITHUB_OWNER=your_org_or_username
GITHUB_REPO=default_repo_name

GEMINI_API_KEY=your_gemini_api_key
LLM_PROVIDER_NAME=gemini
```

Notes:

- `LLM_PROVIDER_NAME` supports `gemini` or `openai`.
- `GEMINI_API_KEY` is currently required by config naming; if using OpenAI, keep this variable present or update config conventions.

## 3) Run in Development

Run bot and API together:

```bash
npm run dev
```

Run only Discord bot:

```bash
npm run dev:bot
```

Run only API server:

```bash
npm run dev:api
```

## 4) Type Check and Build

Type check:

```bash
npm run typecheck
```

Build:

```bash
npm run build
```

Output is generated in `dist/`.

## 5) Run Production Scripts

Run bot and API together (after build):

```bash
npm run start
```

Run only bot runtime:

```bash
npm run start:bot
```

Run only API runtime:

```bash
npm run start:api
```

## 6) Format Code

```bash
npm run format
```

## 7) Docker Setup

Build and run via Compose:

```bash
npm run docker:up
```

Stop compose stack:

```bash
npm run docker:down
```

Build images manually:

```bash
npm run docker:build
```

Run built images manually:

```bash
npm run docker:run:bot
npm run docker:run:api
```

## 8) Verify Health

API endpoints:

- `GET /` returns service metadata
- `GET /health` returns status

Example:

```bash
curl http://localhost:3000/health
```

Expected response:

```json
{"status":"ok"}
```

## 9) Discord Command Deployment

Slash commands are deployed automatically during bot startup in `startBot`.

If deployment fails:

- verify `DISCORD_CLIENT_ID`
- verify `DISCORD_GUILD_ID`
- verify bot has application command scope in your server

## Troubleshooting

### Missing environment variable

If startup throws `Missing environment variable: ...`, ensure the key exists in your selected env file.

### Bot is online but commands missing

- Check logs for "Registering slash commands..."
- Confirm bot has permission in target guild
- Confirm `DISCORD_GUILD_ID` matches the guild where you test

### `npm run dev` or `npm run start` fails with `npm-run-all: command not found`

Install it as a dev dependency and rerun:

```bash
npm install -D npm-run-all
```

### LLM parsing errors

- Validate API key and provider name
- Test with simple commands first
- Check logs for raw LLM output

### Database issues

- Ensure `data/` directory is writable
- Remove broken local DB only in development if schema/data is corrupted

## Development Tips

- Keep orchestrations pure from Discord specifics where possible.
- Add new commands by wiring command file and adding to `commands` registry.
- Prefer adding behavior in `core/orchestrations` over handlers.
