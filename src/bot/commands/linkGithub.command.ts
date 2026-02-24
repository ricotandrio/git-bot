import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  User,
} from 'discord.js';
import { UserMappingRepository } from '@/db';
import { logger } from '@/lib';

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
  const githubUsername = interaction.options.getString('username', true).trim();
  const discordId = interaction.user.id;

  // check if already linked
  const existingGithubUsername =
    await UserMappingRepository.getGithubUsername(discordId);
  if (existingGithubUsername) {
    await interaction.reply({
      content:
        `⚠️ You already have a linked GitHub account: **${existingGithubUsername}**.\n` +
        `Run \`/unlink-github\` first if you want to change it.`,
      ephemeral: true,
    });
    return;
  }

  // validate github username format
  const isValidUsername =
    /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/.test(githubUsername);
  if (!isValidUsername) {
    await interaction.reply({
      content: '❌ Invalid GitHub username format. Please check and try again.',
      ephemeral: true,
    });
    return;
  }

  await interaction.deferReply({ ephemeral: true });

  try {
    await UserMappingRepository.add(discordId, githubUsername);

    logger.info({ discordId, githubUsername }, 'GitHub account linked');

    await interaction.editReply(
      `✅ Successfully linked your Discord account to GitHub **${githubUsername}**.\n` +
        `You can now be assigned to issues using \`/assign-issue\`.`,
    );
  } catch (error) {
    logger.error({ error }, 'Failed to link GitHub account');
    await interaction.editReply('❌ Failed to link account. Please try again.');
  }
}
