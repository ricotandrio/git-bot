import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  AutocompleteInteraction,
} from 'discord.js';
import { GuildRepository } from '@/domain/repositories';
import { logger } from '@/lib';
import { assignIssue } from '@/domain/usecases/issue.usecase';

export const data = new SlashCommandBuilder()
  .setName('assign-issue')
  .setDescription('Assign a GitHub issue to a team member')
  .addIntegerOption((option) =>
    option
      .setName('issue')
      .setDescription('Issue number e.g. 42')
      .setRequired(true),
  )
  .addUserOption((option) =>
    option
      .setName('user')
      .setDescription('Discord user to assign the issue to')
      .setRequired(true),
  )
  .addStringOption((option) =>
    option
      .setName('repository')
      .setDescription('Target repository')
      .setRequired(true)
      .setAutocomplete(true),
  );

export async function execute(
  interaction: ChatInputCommandInteraction,
): Promise<void> {
  const guildId = interaction.guildId;

  if (!guildId) {
    await interaction.reply({
      content: '❌ This command can only be used in a server.',
      ephemeral: true,
    });
    return;
  }

  const issueNumber = interaction.options.getInteger('issue', true);
  const discordUser = interaction.options.getUser('user', true);
  const repoName = interaction.options.getString('repository', true);

  await interaction.deferReply();

  const result = await assignIssue(
    guildId,
    discordUser.id,
    repoName,
    issueNumber,
  );

  if (!result.success) {
    switch (result.reason) {
      case 'USER_NOT_LINKED':
        await interaction.editReply(
          `❌ <@${discordUser.id}> hasn't linked their GitHub account yet.\n` +
          `Ask them to run \`/link-github\` first.`,
        );
        return;

      case 'REPO_NOT_CONFIGURED':
        await interaction.editReply(
          `❌ Repository **${repoName}** is not configured for this server.`,
        );
        return;

      case 'EXTERNAL_ERROR':
        logger.error(
          { guildId, issueNumber, repoName },
          'Failed to assign issue',
        );
        await interaction.editReply(
          '❌ Failed to assign issue. Please try again.',
        );
        return;
    }
  }

  await interaction.editReply(
    `✅ Issue **#${issueNumber}** in **${repoName}** assigned to <@${discordUser.id}>.`,
  );
}

export async function autocomplete(
  interaction: AutocompleteInteraction,
): Promise<void> {
  const guildId = interaction.guildId;

  if (!guildId) {
    await interaction.respond([]);
    return;
  }

  const focusedValue = interaction.options.getFocused(true);
  const repositories: string[] = GuildRepository.getAll(guildId);

  const filtered = repositories
    .filter((repo) =>
      repo.toLowerCase().includes(focusedValue.value.toLowerCase()),
    )
    .slice(0, 25);

  await interaction.respond(
    filtered.map((repo) => ({ name: repo, value: repo })),
  );
}
