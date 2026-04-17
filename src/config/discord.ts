import { requireEnv } from './env';

export const discordConfig = {
  BOT_TOKEN: requireEnv('DISCORD_BOT_TOKEN'),
  CLIENT_ID: requireEnv('DISCORD_CLIENT_ID'),
  GUILD_ID: requireEnv('DISCORD_GUILD_ID'),
  DISCORD_STANDUP_CHANNEL_ID: requireEnv('DISCORD_STANDUP_CHANNEL_ID'),
};
