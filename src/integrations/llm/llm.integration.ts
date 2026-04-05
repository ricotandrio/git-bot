import { Integration } from '../integration.interface';
import { GITBOT_PROMPT } from './prompts';
import { ASSISTANT_PROMPT } from './prompts/assistant.prompt';
import { LLMProvider } from './llm.types';
import { OpenAIProvider } from './providers/openai/openai.provider';
import { GeminiProvider } from './providers/gemini/gemini.provider';

export class LLMIntegration implements Integration {
  name = 'llm';

  private client!: LLMProvider;

  async connect(config: { apiKey: string; providerName: 'openai' | 'gemini' }) {
    const { apiKey, providerName } = config;

    if (providerName === 'openai') {
      this.client = new OpenAIProvider(apiKey);
      this.name = 'openai';
    } else if (providerName === 'gemini') {
      this.client = new GeminiProvider(apiKey);
      this.name = 'gemini';
    } else {
      throw new Error(`LLM provider ${providerName} not supported`);
    }
  }

  async execute(action: string, payload: any) {
    switch (action) {
      case 'ask_question':
        return this.client.generate(ASSISTANT_PROMPT, payload.prompt);
      case 'git_bot':
        return this.client.generate(GITBOT_PROMPT, payload);
      default:
        throw new Error(`Action ${action} not supported`);
    }
  }
}
