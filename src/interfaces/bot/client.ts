import { Client, GatewayIntentBits, REST, Routes } from 'discord.js';
import type { AppContext } from '@/app/context';
import { commands } from '@/interfaces/bot/commands';
import { registerHandlers } from '@/interfaces/bot/handlers';
import { setBotRuntimeConfig } from '@/interfaces/bot/runtime-config';
import { logger } from '@/utils';

export async function deployBot(
  rest: REST,
  CLIENT_ID: string,
  GUILD_ID: string,
) {
  try {
    logger.info('Registering slash commands...');

    const body = Object.values(commands).map((cmd) => cmd.data.toJSON());

    if (body.length === 0) {
      logger.warn('No commands to register.');
      process.exit(0);
    }

    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
      body: body,
    });

    logger.info(
      { count: body.length },
      'Slash commands registered successfully',
    );
  } catch (error) {
    logger.error({ error }, 'Error registering slash commands');
    process.exit(1);
  }
}

export async function startBot(
  appContext: AppContext,
  BOT_TOKEN: string,
  CLIENT_ID: string,
  GUILD_ID: string,
  STANDUP_CHANNEL_ID: string,
) {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildMembers,
    ],
  });

  const rest = new REST().setToken(BOT_TOKEN);

  setBotRuntimeConfig({
    standupChannelId: STANDUP_CHANNEL_ID ?? appContext.standupChannelId,
  });

  await deployBot(rest, CLIENT_ID, GUILD_ID);

  registerHandlers(client);

  client.login(BOT_TOKEN);
}
