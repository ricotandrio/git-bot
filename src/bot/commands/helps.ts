import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("helps")
  .setDescription("Provides help information about the bot's commands.");

export async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
  await interaction.reply(
    "Here are the available commands:\n" +
    "/helps - Provides help information about the bot's commands.\n" +
    "/ping - Checks the bot's latency.\n" + 
    "/create-issue - Create a GitHub issue from Discord.\n"
  );
}