import { Client } from 'discord.js';
import { handleClientReady } from './clientReady.handler';
import { handleInteraction } from './interactionCreate.handler';
import { handleGuildCreate } from './guildCreate.handler';
import { handleMessageCreate } from './messageCreate.handler';

export function registerHandlers(client: Client): void {
  client.on('clientReady', handleClientReady);
  client.on('guildCreate', handleGuildCreate);
  client.on('interactionCreate', handleInteraction);
  client.on('messageCreate', handleMessageCreate);
}
