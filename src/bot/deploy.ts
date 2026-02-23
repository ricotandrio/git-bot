import { REST, Routes, SlashCommandBuilder } from 'discord.js';
import { config } from '@/config';
import { commands } from '@/bot/commands';
import { logger } from '@/lib';

const rest = new REST().setToken(config.DISCORD.BOT_TOKEN);

(async () => {
  try {
    logger.info('Registering slash commands...');

    const body = Object.values(commands).map((cmd) => cmd.data.toJSON());

    if (body.length === 0) {
      logger.warn('No commands to register.');
      process.exit(0);
    }

    await rest.put(
      Routes.applicationGuildCommands(
        config.DISCORD.CLIENT_ID,
        config.DISCORD.GUILD_ID,
      ),
      { body: body },
    );

    logger.info(
      { count: body.length },
      'Slash commands registered successfully',
    );
  } catch (error) {
    logger.error({ error }, 'Error registering slash commands');
    process.exit(1);
  }
})();
