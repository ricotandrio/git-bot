import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { UserMappingRepository } from '@/db';
import { logger } from '@/lib';

export const data = new SlashCommandBuilder()
  .setName('unlink-github')
  .setDescription('Unlink your Discord account from GitHub');

export async function execute(
  interaction: ChatInputCommandInteraction,
): Promise<void> {
  const discordId = interaction.user.id;

  // check if even linked
  const existingGithubUsername =
    await UserMappingRepository.getGithubUsername(discordId);
  if (!existingGithubUsername) {
    await interaction.reply({
      content:
        "❌ You don't have a linked GitHub account. Use `/link-github` first.",
      ephemeral: true,
    });
    return;
  }

  try {
    await UserMappingRepository.remove(discordId);

    logger.info(
      { discordId, githubUsername: existingGithubUsername },
      'GitHub account unlinked',
    );

    await interaction.reply({
      content: `✅ Your GitHub account **${existingGithubUsername}** has been unlinked.`,
      ephemeral: true,
    });
  } catch (error) {
    logger.error({ error }, 'Failed to unlink GitHub account');
    await interaction.reply({
      content: '❌ Failed to unlink account. Please try again.',
      ephemeral: true,
    });
  }
}
