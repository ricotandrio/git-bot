import { Interaction } from 'discord.js';
import { commands } from '@/bot/commands';
import { logger } from '@/lib';

export async function handleInteraction(interaction: Interaction) {
  // Autocomplete
  if (interaction.isAutocomplete()) {
    const command = commands[interaction.commandName];
    if (!command?.autocomplete) return;

    try {
      await command.autocomplete(interaction);
    } catch (error) {
      logger.error({ error }, 'Autocomplete error');
    }
    return;
  }

  // Slash Commands
  if (interaction.isChatInputCommand()) {
    const command = commands[interaction.commandName];

    if (!command) {
      await interaction.reply({ content: 'Unknown command.', ephemeral: true });
      return;
    }

    try {
      logger.info(
        `Received command: /${interaction.commandName} from ${interaction.user.tag} (${interaction.user.id})`,
      );
      await command.execute(interaction);
      
    } catch (error) {
      console.error(`Error in /${interaction.commandName}:`, error);

      await interaction.reply({
        content: 'Something went wrong.',
        ephemeral: true,
      });
    }
  }

}
