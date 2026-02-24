import { GoogleGenerativeAI } from '@google/generative-ai';
import { Message } from 'discord.js';
import { IssueService } from '@/infrastructure/github/services';
import { GuildRepository, UserMappingRepository } from '@/infrastructure/db';
import { logger } from '@/lib';
import { SYSTEM_PROMPT } from './prompt';
import { config } from '@/infrastructure/config';
import { listRepositoriesFromDatabase, removeRepositoryFromDatabase } from '@/domain/usecases/repository.usecase';
import { assignIssue, createIssue } from '@/domain/usecases/issue.usecase';

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
        await message.reply('❌ This command can only be used in a server channel.');
        return;
      }

      const result = await listRepositoriesFromDatabase(guildId);

      if (!result.success) {
        await message.reply('❌ Failed to retrieve repositories.');
        return;
      }

      if (result.repositories.length === 0) {
        await message.reply('No repositories configured.');
        return;
      }

      await message.reply(
        `Available repositories: ${result.repositories.join(', ')}`,
      );
      break;
    }

    case 'remove-repo': {
      const guildId = message.guildId;

      if (!guildId) {
        await message.reply('❌ This command can only be used in a server channel.');
        return;
      }

      const repoToRemove = parsed.args.repo;

      if (!repoToRemove) {
        await message.reply('❌ Please specify a repository to remove.');
        return;
      }

      const result = await removeRepositoryFromDatabase(guildId, repoToRemove);

      if (!result.success) {
        if (result.reason === 'NOT_FOUND') {
          await message.reply(`❌ Repository **${repoToRemove}** not found.`);
          return;
        }

        logger.error({ guildId, repoToRemove }, 'Remove repo failed');
        await message.reply('❌ Failed to remove repository.');
        return;
      }

      await message.reply(`✅ Repository **${repoToRemove}** removed.`);
      break;
    }

    case 'create-issue': {
      const guildId = message.guildId;

      if (!guildId) {
        await message.reply('❌ This command can only be used in a server channel.');
        return;
      }

      const { title, body, label, repo } = parsed.args;

      const result = await createIssue(
        guildId,
        repo,
        title ?? 'New Issue',
        body ?? '',
        label ?? 'bug',
      );

      if (!result.success) {
        if (result.reason === 'REPO_NOT_CONFIGURED') {
          await message.reply(
            '❌ Repository is not configured for this server.',
          );
          return;
        }

        logger.error({ guildId, repo }, 'Create issue failed');
        await message.reply('❌ Failed to create issue.');
        return;
      }

      await message.reply(`✅ Issue created → ${result.issueUrl}`);
      break;
    }

    case 'assign-issue': {
      const guildId = message.guildId;

      if (!guildId) {
        await message.reply('❌ This command can only be used in a server channel.');
        return;
      }

      const { issueNumber, discordUserId, repo } = parsed.args;

      const result = await assignIssue(
        guildId,
        discordUserId,
        repo,
        issueNumber,
      );

      if (!result.success) {
        switch (result.reason) {
          case 'USER_NOT_LINKED':
            await message.reply(
              `❌ That user hasn't linked their GitHub account.`,
            );
            return;

          case 'REPO_NOT_CONFIGURED':
            await message.reply(
              '❌ Repository is not configured for this server.',
            );
            return;

          case 'EXTERNAL_ERROR':
            logger.error({ guildId, issueNumber, repo }, 'Assign issue failed');
            await message.reply('❌ Failed to assign issue.');
            return;
        }
      }

      await message.reply(
        `✅ Issue **#${issueNumber}** assigned successfully.`,
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
