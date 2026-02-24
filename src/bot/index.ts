import { Client, GatewayIntentBits } from 'discord.js';
import { config } from '@/config';
import { registerHandlers } from '@/bot/handlers';
import { initDb } from '@/db';

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
