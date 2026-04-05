type BotRuntimeConfig = {
  standupChannelId: string | undefined;
};

const runtimeConfig: BotRuntimeConfig = {
  standupChannelId: undefined,
};

export function setBotRuntimeConfig(config: BotRuntimeConfig): void {
  runtimeConfig.standupChannelId = config.standupChannelId;
}

export function getStandupChannelId(): string | undefined {
  return runtimeConfig.standupChannelId;
}
