import { GoogleGenerativeAI } from '@google/generative-ai';
import { Message } from 'discord.js';
import { createIssue, assignIssue } from '@/github/services/issue.service';
import { getGuildRepositories, getUserMapping } from '@/db';
import { logger } from '@/lib';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

export const SYSTEM_PROMPT = `
You are GitBot, a Discord bot that manages GitHub issues.
You must respond ONLY with a JSON object — no explanation, no markdown, no backticks.

Available commands:
- available-repos: { "command": "available-repos", "args": {} }
- create-issue: { "command": "create-issue", "args": { "title": string, "body": string, "label": string, "repo": string } }
- assign-issue: { "command": "assign-issue", "args": { "issueNumber": number, "discordUserId": string, "repo": string } }
- unknown:      { "command": "unknown", "args": { "reason": string } }

Rules:
- label must be one of: bug, design, feedback, enhancement — default to bug
- if repo is not mentioned, set repo as null
- if intent is unclear, use unknown command
- respond with raw JSON only, no markdown
`;

export async function handleLLMCommand(
  message: Message,
  content: string,
): Promise<void> {
  const guildId = message.guildId!;
  const repos = getGuildRepositories(guildId);

  try {
    const prompt =
      `${SYSTEM_PROMPT}\n\n` +
      `Available repos: ${repos.join(', ')}\n` +
      `User message: ${content}`;

    const result = await model.generateContent(prompt);
    const raw = result.response.text().trim();

    logger.info({ raw }, 'Gemini raw response');

    // strip markdown backticks if Gemini adds them anyway
    const cleaned = raw.replace(/```json|```/g, '').trim();

    let parsed: { command: string; args: Record<string, any> };
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      await message.reply(
        '❌ Could not understand that. Try using slash commands directly.',
      );
      return;
    }

    logger.info({ parsed }, 'LLM parsed command');
    await executeCommand(message, parsed);
  } catch (error) {
    logger.error({ error }, 'Gemini API error');
    await message.reply('❌ LLM error. Try using slash commands directly.');
  }
}

async function executeCommand(
  message: Message,
  parsed: { command: string; args: Record<string, any> },
): Promise<void> {
  switch (parsed.command) {
    case 'available-repos': {
      const guildId = message.guildId;

      if (!guildId) {
        await message.reply(
          '❌ This command can only be used in a server channel.',
        );
        return;
      }

      const repos = getGuildRepositories(guildId);
      await message.reply(`Available repositories: ${repos.join(', ')}`);
      break;
    }

    case 'create-issue': {
      const { title, body, label, repo } = parsed.args;

      if (!repo) {
        await message.reply(
          '❌ Please specify a repository. e.g. `@GitBot create login bug in my-repo`',
        );
        return;
      }

      const issue = await createIssue(
        title ?? 'New Issue',
        body ?? 'Created via Discord mention',
        label ?? 'bug',
        repo,
      );

      await message.reply(
        `✅ Issue **#${issue.number}** created → ${issue.html_url}`,
      );
      break;
    }

    case 'assign-issue': {
      const { issueNumber, discordUserId, repo } = parsed.args;
      const mapping = getUserMapping(discordUserId);

      if (!mapping) {
        await message.reply(
          `❌ That user hasn't linked their GitHub account. Ask them to run \`/link-github\`.`,
        );
        return;
      }

      const response = await assignIssue(
        issueNumber,
        mapping.githubUsername,
        repo,
      );
      await message.reply(
        `✅ Issue **#${response.number}** assigned to **${mapping.githubUsername}**.`,
      );
      break;
    }

    case 'unknown': {
      await message.reply(
        `❓ ${parsed.args.reason}\n\nTry something like:\n` +
          `> @GitBot create an issue for login crash in my-repo\n` +
          `> @GitBot assign issue #42 to @rico in my-repo`,
      );
      break;
    }

    default:
      await message.reply(
        '❌ Unknown command. Try using slash commands directly.',
      );
  }
}
