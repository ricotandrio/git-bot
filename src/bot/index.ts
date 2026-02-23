import { Client, GatewayIntentBits } from 'discord.js';
import { config } from '@/config';
import { handleInteraction } from '@/bot/handlers';
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
  client.on('clientReady', () => {
    console.log(`Logged in as ${client.user?.tag}!`);
  });

  client.on('interactionCreate', handleInteraction);

  initDb();

  client.login(config.DISCORD.BOT_TOKEN);
}

main();
