import { Interaction } from 'discord.js';
import { commands } from '@/bot/commands';
import { logger } from '@/lib';

export async function handleInteraction(interaction: Interaction) {
  if (!interaction.isChatInputCommand()) return;

  const command = commands[interaction.commandName];

  if (!command) {
    await interaction.reply({ content: 'Unknown command.', ephemeral: true });
    return;
  }

  try {
    logger.info(`Received command: /${interaction.commandName} from ${interaction.user.tag} (${interaction.user.id})`);
    await command.execute(interaction);
  } catch (error) {
    console.error(`Error in /${interaction.commandName}:`, error);
    await interaction.reply({ content: 'Something went wrong.', ephemeral: true });
  }
}