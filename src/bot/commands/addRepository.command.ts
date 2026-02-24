import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  PermissionFlagsBits,
} from 'discord.js';
import { logger } from '@/lib';
import { GuildRepository } from '@/db';

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

  const repoName = interaction.options.getString('name', true).trim();

  // validate format — no spaces, no full URLs
  if (repoName.includes(' ') || repoName.includes('github.com')) {
    await interaction.reply({
      content:
        '❌ Invalid format. Use just the repo name e.g. `my-repo`, not a full URL.',
      ephemeral: true,
    });
    return;
  }

  // check for duplicates
  const existing = await GuildRepository.getAll(guildId);
  if (existing.includes(repoName)) {
    await interaction.reply({
      content: `❌ Repository **${repoName}** is already added.`,
      ephemeral: true,
    });
    return;
  }

  try {
    await GuildRepository.add(guildId, repoName);

    logger.info({ guildId, repoName }, 'Repository added');

    await interaction.reply({
      content: `✅ Repository **${repoName}** added. It's now available for \`/create-issue\`.`,
      ephemeral: true,
    });
  } catch (error) {
    logger.error({ error }, 'Failed to add repository');
    await interaction.reply({
      content: '❌ Failed to add repository. Please try again.',
      ephemeral: true,
    });
  }
}
