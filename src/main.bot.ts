import { config } from "@/config";

import { startBot } from "@/interfaces/bot/client";
import { githubIntegration } from "./integrations/github";
import { llmIntegration } from "./integrations/llm";
import { dbIntegration } from "./integrations/db";
import { EventBus } from "./core/events";
import { AnalyticsService } from "./integrations/analytics/analytics.services";
import { ConsoleProvider } from "./integrations/analytics/providers/console.provider";
import { registerAnalyticsConsumer } from "./integrations/analytics";


async function main() {
  const eventBus = new EventBus();

  const analytics = new AnalyticsService(new ConsoleProvider());

  registerAnalyticsConsumer(eventBus, analytics);

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