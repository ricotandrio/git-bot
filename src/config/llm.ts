import { requireEnv } from './env';

export const llmConfig = {
  API_KEY: requireEnv('GEMINI_API_KEY'),
  PROVIDER_NAME:
    (process.env.LLM_PROVIDER_NAME as 'openai' | 'gemini') || 'gemini',
};
