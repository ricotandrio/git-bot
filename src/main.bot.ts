import { config } from "@/config";

import { startBot } from "@/interfaces/bot/client";
import { githubIntegration } from "./integrations/github";
import { llmIntegration } from "./integrations/llm";
import { dbIntegration } from "./integrations/db";


async function main() {
  await githubIntegration.connect({
    token: config.GITHUB.TOKEN,
  });

  await llmIntegration.connect({
    apiKey: config.LLM.API_KEY,
    providerName: config.LLM.PROVIDER_NAME,
  });

  await dbIntegration.connect({ dbPath: './data/gitbot.db' });

  await startBot(
    config.DISCORD.BOT_TOKEN,
    config.DISCORD.CLIENT_ID,
    config.DISCORD.GUILD_ID,
    config.DISCORD.DISCORD_STANDUP_CHANNEL_ID,
  );
}

main();