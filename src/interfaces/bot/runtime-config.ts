import { getAppContext } from '@/app/context';

type BotRuntimeConfig = {
  standupChannelId: string | undefined;
};

export function setBotRuntimeConfig(config: BotRuntimeConfig): void {
  const appContext = getAppContext();
  appContext.standupChannelId = config.standupChannelId;
}

export function getStandupChannelId(): string | undefined {
  return getAppContext().standupChannelId;
}
