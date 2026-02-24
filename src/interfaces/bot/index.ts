import { Client, GatewayIntentBits } from 'discord.js';
import { config } from '@/infrastructure/config';
import { registerHandlers } from '@/interfaces/bot/handlers';
import { initDb } from '@/infrastructure/db';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

function main() {
  registerHandlers(client);
  initDb();

  client.login(config.DISCORD.BOT_TOKEN);
}

main();
