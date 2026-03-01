import { Message } from 'discord.js';
import { logger } from '@/lib';
import { listRepositoriesFromDatabase, removeRepositoryFromDatabase } from '@/application/usecases/repository.usecase';
import { assignIssue, createIssue } from '@/application/usecases/issue.usecase';
import { generateLLMResponse, ParsedCommand } from '@/application/usecases/llm.usecase';

export async function handleLLMCommand(
  message: Message,
  content: string,
): Promise<void> {
  const guildId = message.guildId;

  if (!guildId) {
    await message.reply('❌ This command can only be used in a server channel.');
    return;
  }

  try {
    const parsed = await generateLLMResponse(content, guildId);
    if (!parsed) {
      await message.reply(
        '❌ Sorry, I couldn\'t understand that. Try using slash commands directly.',
      );
      return;
    }

    logger.info({ parsed }, 'LLM parsed command');
    await executeCommand(message, guildId, parsed);
  } catch (error) {
    logger.error({ err: error }, 'LLM command error');
    await message.reply('❌ LLM error. Try using slash commands directly.');
  }
}

async function executeCommand(
  message: Message,
  guildId: string,
  parsed: ParsedCommand,
): Promise<void> {
  switch (parsed.command) {
    case 'greeting': {
      await handleGreeting(message, parsed);
      break;
    }

    case 'available-repos': {
      await handleAvailableRepos(message, guildId);
      break;
    }

    case 'remove-repo': {
      await handleRemoveRepo(message, guildId, parsed);
      break;
    }

    case 'create-issue': {
      await handleCreateIssue(message, guildId, parsed);
      break;
    }

    case 'assign-issue': {
      await handleAssignIssue(message, guildId, parsed);
      break;
    }

    case 'unknown': {
      await handleUnknown(message, parsed);
      break;
    }

    default:
      await message.reply(
        '❌ Unknown command. Try using slash commands directly.',
      );
  }
}

async function handleGreeting(
  message: Message,
  parsed: ParsedCommand,
): Promise<void> {
  const timeOfDay = parsed.args.timeOfDay || 'day';
  await message.reply(`Good ${timeOfDay}! How can I assist you today?`);
}

async function handleAvailableRepos(
  message: Message,
  guildId: string,
): Promise<void> {
  const result = await listRepositoriesFromDatabase(guildId);

  if (!result.success) {
    await message.reply('❌ Failed to retrieve repositories.');
    return;
  }

  if (result.repositories.length === 0) {
    await message.reply('No repositories configured.');
    return;
  }

  await message.reply(`Available repositories: ${result.repositories.join(', ')}`);
}

async function handleRemoveRepo(
  message: Message,
  guildId: string,
  parsed: ParsedCommand,
): Promise<void> {
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
}

async function handleCreateIssue(
  message: Message,
  guildId: string,
  parsed: ParsedCommand,
): Promise<void> {
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
      await message.reply('❌ Repository is not configured for this server.');
      return;
    }

    logger.error({ guildId, repo }, 'Create issue failed');
    await message.reply('❌ Failed to create issue.');
    return;
  }

  await message.reply(`✅ Issue created → ${result.issueUrl}`);
}

async function handleAssignIssue(
  message: Message,
  guildId: string,
  parsed: ParsedCommand,
): Promise<void> {
  const { issueNumber, discordUserId, repo } = parsed.args;

  const result = await assignIssue(guildId, discordUserId, repo, issueNumber);

  if (!result.success) {
    switch (result.reason) {
      case 'USER_NOT_LINKED':
        await message.reply(`❌ That user hasn't linked their GitHub account.`);
        return;

      case 'REPO_NOT_CONFIGURED':
        await message.reply('❌ Repository is not configured for this server.');
        return;

      case 'EXTERNAL_ERROR':
        logger.error({ guildId, issueNumber, repo }, 'Assign issue failed');
        await message.reply('❌ Failed to assign issue.');
        return;
    }
  }

  await message.reply(`✅ Issue **#${issueNumber}** assigned successfully.`);
}

async function handleUnknown(
  message: Message,
  parsed: ParsedCommand,
): Promise<void> {
  await message.reply(
    `❓ ${parsed.args.reason}\n\nTry something like:\n` +
      `> @GitBot create an issue for login crash in my-repo\n` +
      `> @GitBot assign issue #42 to @user in my-repo`,
  );
}
