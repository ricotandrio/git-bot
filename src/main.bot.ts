import { config } from "@/infrastructure/config";
import { initDb } from "@/infrastructure/db";

import { startBot } from "@/interfaces/bot/client";

async function main() {
  await initDb();

  await startBot(
    config.DISCORD.BOT_TOKEN,
    config.DISCORD.CLIENT_ID,
    config.DISCORD.GUILD_ID,
    config.DISCORD.DISCORD_STANDUP_CHANNEL_ID,
  );
}

main();