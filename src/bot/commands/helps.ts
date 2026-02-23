import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('helps')
  .setDescription("Provides help information about the bot's commands.");

export async function execute(
  interaction: ChatInputCommandInteraction,
): Promise<void> {
  await interaction.reply(
    'Here are the available commands:\n' +
      "/helps - Provides help information about the bot's commands.\n" +
      "/ping - Checks the bot's latency.\n" +
      "/status - Displays the bot's current status and available repositories with open issues.\n" +
      '/add-repo - Add a GitHub repository to the bot.\n' +
      '/create-issue - Create a GitHub issue from Discord.\n' +
      '/assign-issue - Assign an open issue to yourself.\n' +
      '/link-github - Link your Discord account to your GitHub account.\n' +
      '/unlink-github - Unlink your Discord account from your GitHub account.',
  );
}
