import { discordConfig } from './discord';
import { githubConfig } from './github';
import { llmConfig } from './llm';

export const requireEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new Error(`Missing environment variable: ${key}`);
  return value;
};

export const config = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  EXPRESS: {
    PORT: parseInt(process.env.EXPRESS_PORT || '3000'),
  },
  DISCORD: discordConfig,
  GITHUB: githubConfig,
  LLM: llmConfig,
};
