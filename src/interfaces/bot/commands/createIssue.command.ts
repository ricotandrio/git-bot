import {
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from 'discord.js';
import { logger } from '@/lib/logger';
import { GuildRepository } from '@/domain/repositories';
import { createIssue } from '@/domain/usecases/issue.usecase';

export const data = new SlashCommandBuilder()
  .setName('create-issue')
  .setDescription('Create a GitHub issue from Discord')
  .addStringOption((option) =>
    option.setName('title').setDescription('Issue title').setRequired(true),
  )
  .addStringOption((option) =>
    option
      .setName('label')
      .setDescription('Issue label')
      .setRequired(true)
      .addChoices(
        { name: 'Bug', value: 'bug' },
        { name: 'Design', value: 'design' },
        { name: 'Feedback', value: 'feedback' },
        { name: 'Enhancement', value: 'enhancement' },
      ),
  )
  .addStringOption((option) =>
    option
      .setName('description')
      .setDescription('Issue description')
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
      content: 'This command can only be used in a server.',
      ephemeral: true,
    });
    return;
  }

  const title = interaction.options.getString('title', true);
  const label = interaction.options.getString('label', true);
  const description = interaction.options.getString('description', true);
  const repoName = interaction.options.getString('repository', true);

  await interaction.deferReply({ ephemeral: true });

  const result = await createIssue(
    guildId,
    repoName,
    title,
    description,
    label,
  );

  if (!result.success) {
    switch (result.reason) {
      case 'REPO_NOT_CONFIGURED':
        await interaction.editReply(
          '❌ Repository is not configured for this server.',
        );
        return;

      case 'EXTERNAL_ERROR':
        logger.error(
          { guildId, repoName, title },
          'Failed to create issue',
        );
        await interaction.editReply(
          '❌ Failed to create issue. Please try again later.',
        );
        return;
    }
  }

  await interaction.editReply(
    `✅ Issue created → ${result.issueUrl}`,
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
