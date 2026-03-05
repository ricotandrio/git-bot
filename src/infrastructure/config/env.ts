function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing environment variable: ${key}`);
  return value;
}

export const config = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  EXPRESS: {
    PORT: parseInt(process.env.EXPRESS_PORT || '3000'),
  },
  DISCORD: {
    BOT_TOKEN: requireEnv('DISCORD_BOT_TOKEN'),
    CLIENT_ID: requireEnv('DISCORD_CLIENT_ID'),
    GUILD_ID: requireEnv('DISCORD_GUILD_ID'),
    DISCORD_STANDUP_CHANNEL_ID: requireEnv('DISCORD_STANDUP_CHANNEL_ID'),
  },
  GITHUB: {
    TOKEN: requireEnv('GITHUB_PAT'),
    OWNER: requireEnv('GITHUB_OWNER'),
    REPO: requireEnv('GITHUB_REPO'),
  },
  LLM: {
    GEMINI_API_KEY: requireEnv('GEMINI_API_KEY'),
  },
};
