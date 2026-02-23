import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from 'discord.js';
import { getGuildRepositories } from '@/db';
import { logger } from '@/lib';

export const data = new SlashCommandBuilder()
  .setName('status')
  .setDescription("Checks the bot's status and command availability.");

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

  const repos = getGuildRepositories(guildId);
  const repoList = repos.length > 0 ? repos.map(r => `- ${r}`).join('\n') : 'No repositories added yet. Use `/add-repo` to add one.';

  await interaction.reply(
    `✅ Bot is online and operational!\n\n` +
      `**Available Repositories:**\n${repoList}\n\n` +
      `Use \`/create-issue\` to create an issue in one of the above repositories.`,
  );
}
