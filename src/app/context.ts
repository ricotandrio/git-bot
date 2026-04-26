import { config as globalConfig } from '@/config';
import { EventBus } from '@/core/events';
import {
  AnalyticsService,
  registerAnalyticsConsumer,
} from '@/integrations/analytics';
import { ConsoleProvider } from '@/integrations/analytics/providers';
import { DBIntegration } from '@/integrations/db';
import { GithubIntegration } from '@/integrations/github';
import { LLMIntegration } from '@/integrations/llm';

export type AppConfig = typeof globalConfig;

export type AppContext = {
  config: AppConfig;
  eventBus: EventBus;
  analytics: AnalyticsService;
  db: DBIntegration;
  github: GithubIntegration;
  llm: LLMIntegration;
  standupChannelId: string | undefined;
};

let appContext: AppContext | null = null;

export async function createAppContext(config: AppConfig): Promise<AppContext> {
  const eventBus = new EventBus();
  const analytics = new AnalyticsService(new ConsoleProvider());
  const db = new DBIntegration();
  const github = new GithubIntegration();
  const llm = new LLMIntegration();

  registerAnalyticsConsumer(eventBus, analytics);

  await github.connect({
    token: config.GITHUB.TOKEN,
  });

  await llm.connect({
    apiKey: config.LLM.API_KEY,
    providerName: config.LLM.PROVIDER_NAME,
  });

  await db.connect({ dbPath: './data/gitbot.db' });

  return {
    config,
    eventBus,
    analytics,
    db,
    github,
    llm,
    standupChannelId: config.DISCORD.DISCORD_STANDUP_CHANNEL_ID,
  };
}

export function setAppContext(context: AppContext): void {
  appContext = context;
}

export function getAppContext(): AppContext {
  if (!appContext) {
    throw new Error('AppContext not initialized. Call setAppContext() first.');
  }

  return appContext;
}
