import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  AutocompleteInteraction,
} from 'discord.js';
import { IssueService } from '@/github/services';
import { GuildRepository, UserMappingRepository } from '@/db';
import { logger } from '@/lib';

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

  // resolve discord user → github username
  const githubUsername = await UserMappingRepository.getGithubUsername(
    discordUser.id,
  );
  if (!githubUsername) {
    await interaction.reply({
      content:
        `❌ <@${discordUser.id}> hasn't linked their GitHub account yet.\n` +
        `Ask them to run \`/link-github\` first.`,
      ephemeral: true,
    });
    return;
  }

  await interaction.deferReply();

  try {
    const response = await IssueService.assign(
      issueNumber,
      githubUsername,
      repoName,
    );

    logger.info({ issueNumber, githubUsername, repoName }, 'Issue assigned');

    await interaction.editReply(
      `✅ Issue **#${response.number}** in **${repoName}** assigned to <@${discordUser.id}> (${githubUsername}).`,
    );
  } catch (error) {
    logger.error({ error }, 'Failed to assign issue');
    await interaction.editReply('❌ Failed to assign issue. Please try again.');
  }
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
  const repositories: string[] = await GuildRepository.getAll(guildId);

  const filtered = repositories
    .filter((repo) =>
      repo.toLowerCase().includes(focusedValue.value.toLowerCase()),
    )
    .slice(0, 25);

  await interaction.respond(
    filtered.map((repo) => ({ name: repo, value: repo })),
  );
}
