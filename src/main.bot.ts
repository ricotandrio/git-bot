import { config } from '@/config';

import { createAppContext, setAppContext } from '@/app/context';
import { startBot } from '@/interfaces/bot/client';

async function main() {
  const appContext = await createAppContext(config);
  setAppContext(appContext);

  await startBot(
    appContext,
    config.DISCORD.BOT_TOKEN,
    config.DISCORD.CLIENT_ID,
    config.DISCORD.GUILD_ID,
    config.DISCORD.DISCORD_STANDUP_CHANNEL_ID,
  );
}

main();
