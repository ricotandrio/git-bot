import { GoogleGenerativeAI } from '@google/generative-ai';
import { Message } from 'discord.js';
import { IssueService } from '@/github/services';
import { GuildRepository, UserMappingRepository } from '@/db';
import { logger } from '@/lib';
import { SYSTEM_PROMPT } from './prompt';
import { config } from '@/config';

const genAI = new GoogleGenerativeAI(config.LLM.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

export async function handleLLMCommand(
  message: Message,
  content: string,
): Promise<void> {
  const guildId = message.guildId!;
  const repos = GuildRepository.getAll(guildId);

  try {
    const prompt =
      `${SYSTEM_PROMPT}\n\n` +
      `Available repos: ${repos.join(', ')}\n` +
      `User message: ${content}`;

    logger.info(prompt);

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
    logger.error({ err: error }, 'Gemini API error');
    await message.reply('❌ LLM error. Try using slash commands directly.');
  }
}

async function executeCommand(
  message: Message,
  parsed: { command: string; args: Record<string, any> },
): Promise<void> {
  switch (parsed.command) {
    case 'greeting': {
      const timeOfDay = parsed.args.timeOfDay || 'day';
      await message.reply(`Good ${timeOfDay}! How can I assist you today?`);
      break;
    }

    case 'available-repos': {
      const guildId = message.guildId;

      if (!guildId) {
        await message.reply(
          '❌ This command can only be used in a server channel.',
        );
        return;
      }

      const repos = GuildRepository.getAll(guildId);
      await message.reply(`Available repositories: ${repos.join(', ')}`);
      break;
    }

    case 'remove-repo': {
      const guildId = message.guildId;

      if (!guildId) {
        await message.reply(
          '❌ This command can only be used in a server channel.',
        );
        return;
      }

      const repoToRemove = parsed.args.repo;
      if (!repoToRemove) {
        await message.reply('❌ Please specify a repository to remove.');
        return;
      }

      GuildRepository.remove(guildId, repoToRemove);
      await message.reply(`✅ Repository **${repoToRemove}** removed.`);
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

      const issue = await IssueService.create(
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
      const mapping = UserMappingRepository.getGithubUsername(discordUserId);

      if (!mapping) {
        await message.reply(
          `❌ That user hasn't linked their GitHub account. Ask them to run \`/link-github\`.`,
        );
        return;
      }

      const response = await IssueService.assign(issueNumber, mapping, repo);
      await message.reply(
        `✅ Issue **#${response.number}** assigned to **${mapping.githubUsername}**.`,
      );
      break;
    }

    case 'unknown': {
      await message.reply(
        `❓ ${parsed.args.reason}\n\nTry something like:\n` +
          `> @GitBot create an issue for login crash in my-repo\n` +
          `> @GitBot assign issue #42 to @user in my-repo`,
      );
      break;
    }

    default:
      await message.reply(
        '❌ Unknown command. Try using slash commands directly.',
      );
  }
}
