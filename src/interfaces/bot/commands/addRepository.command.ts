import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  PermissionFlagsBits,
} from 'discord.js';
import { logger } from '@/lib';
import { addRepositoryToDatabase } from '@/domain/usecases/repository.usecase';

export const data = new SlashCommandBuilder()
  .setName('add-repo')
  .setDescription('Add a GitHub repository to this server')
  .addStringOption((option) =>
    option
      .setName('name')
      .setDescription('Repository name e.g. my-repo')
      .setRequired(true),
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

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

  const repoName = interaction.options.getString('name', true);

  const result = addRepositoryToDatabase(guildId, repoName);

  if (!result.success) {
    switch (result.reason) {
      case 'INVALID_FORMAT':
        await interaction.reply({
          content:
            '❌ Invalid format. Use just the repo name (e.g. `my-repo`), not a full URL.',
          ephemeral: true,
        });
        return;

      case 'DUPLICATE':
        await interaction.reply({
          content: `❌ Repository **${repoName}** is already added.`,
          ephemeral: true,
        });
        return;

      case 'PERSISTENCE_ERROR':
        logger.error({ guildId, repoName }, 'Failed to add repository');
        await interaction.reply({
          content: '❌ Failed to add repository. Please try again.',
          ephemeral: true,
        });
        return;
    }
  }

  await interaction.reply({
    content: `✅ Repository **${result.repoName}** added. It's now available for \`/create-issue\`.`,
    ephemeral: true,
  });
}