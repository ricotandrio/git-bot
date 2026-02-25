import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { logger } from '@/lib';
import { unlinkGithubAccount } from '@/domain/usecases/user.usecase';

export const data = new SlashCommandBuilder()
  .setName('unlink-github')
  .setDescription('Unlink your Discord account from GitHub');

export async function execute(
  interaction: ChatInputCommandInteraction,
): Promise<void> {
  const discordUserId = interaction.user.id;

  await interaction.deferReply({ ephemeral: true });

  const result = unlinkGithubAccount(discordUserId);

  if (!result.success) {
    switch (result.reason) {
      case 'NOT_LINKED':
        await interaction.editReply(
          "❌ You don't have a linked GitHub account. Use `/link-github` first.",
        );
        return;

      case 'PERSISTENCE_ERROR':
        logger.error(
          { discordUserId },
          'Failed to unlink GitHub account',
        );
        await interaction.editReply(
          '❌ Failed to unlink account. Please try again.',
        );
        return;
    }
  }

  await interaction.editReply(
    `✅ Your GitHub account **${result}** has been unlinked.`,
  );
}