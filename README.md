# GitBot

GitBot is a Discord bot that integrates GitHub repository management directly into Discord. It enables teams to create and manage issues without leaving their primary communication channel.

GitBot solves this by allowing anyone to create a structured GitHub issue directly from Discord with a simple command. No context switching. No manual copy-paste. Just seamless issue creation that captures the essence of the discussion and translates it into actionable work on GitHub.

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

| Command | Description |
|---|---|
| `/create-issue` | Create a GitHub issue from Discord |
| `/assign-issue` | Assign an issue to a team member |
| `/add-repo` | Add a GitHub repository to the server |
| `/link-github` | Link your Discord account to GitHub |
| `/unlink-github` | Unlink your GitHub account |
| `/status` | View open issues across all repositories |
| `/helps` | List all available commands |
| `/ping` | Check bot latency |

## Setup

1. Clone the repository
   ```bash
   git clone https://github.com/your-username/git-bot.git
   cd git-bot
   ```

2. Copy the environment file
   ```bash
   # for development
   cp .env.example .env.dev

   # for production
   cp .env.example .env.prod
   ```

3. Fill in the values inside `.env.dev` or `.env.prod`

4. Run with Docker
   ```bash
   # development
   npm run docker:dev

   # production
   npm run docker:prod
   ```