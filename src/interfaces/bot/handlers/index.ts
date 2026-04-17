import { Client } from 'discord.js';
import { handleClientReady } from './client-ready.handler';
import { handleInteraction } from './interaction-create.handler';
import { handleGuildCreate } from './guild-create.handler';
import { handleMessageCreate } from './message-create.handler';

export function registerHandlers(client: Client): void {
  client.on('clientReady', handleClientReady);
  client.on('guildCreate', handleGuildCreate);
  client.on('interactionCreate', handleInteraction);
  client.on('messageCreate', handleMessageCreate);
}
