import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from 'discord.js';
import { logger } from '@/lib';
import { linkGithubAccount } from '@/application/usecases/user.usecase';

export const data = new SlashCommandBuilder()
  .setName('link-github')
  .setDescription('Link your Discord account to your GitHub account')
  .addStringOption((option) =>
    option
      .setName('username')
      .setDescription('Your exact GitHub username')
      .setRequired(true),
  );

export async function execute(
  interaction: ChatInputCommandInteraction,
): Promise<void> {
  const githubUsername = interaction.options.getString('username', true);
  const discordUserId = interaction.user.id;

  await interaction.deferReply({ ephemeral: true });

  const result = linkGithubAccount(discordUserId, githubUsername);

  if (!result.success) {
    switch (result.reason) {
      case 'ALREADY_LINKED':
        await interaction.editReply(
          `⚠️ You already have a linked GitHub account: **${result.existingUsername}**.\n` +
          `Run \`/unlink-github\` first if you want to change it.`,
        );
        return;

      case 'INVALID_USERNAME':
        await interaction.editReply(
          '❌ Invalid GitHub username format. Please check and try again.',
        );
        return;

      case 'PERSISTENCE_ERROR':
        logger.error(
          { discordUserId, githubUsername },
          'Failed to link GitHub account',
        );
        await interaction.editReply(
          '❌ Failed to link account. Please try again.',
        );
        return;
    }
  }

  await interaction.editReply(
    `✅ Successfully linked your Discord account to GitHub **${result.githubUsername}**.\n` +
    `You can now be assigned to issues using \`/assign-issue\`.`,
  );
}