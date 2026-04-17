import OpenAI from 'openai';
import { LLMProvider } from '../../llm.types';

export class OpenAIProvider implements LLMProvider {
  private client: OpenAI;
  private model: string;

  constructor(apiKey: string, model: string = 'gpt-4.1-mini') {
    this.client = new OpenAI({ apiKey });
    this.model = model;
  }

  getClient() {
    return this.client;
  }

  async generate(instruction: string, prompt: string) {
    const response = await this.client.responses.create({
      model: this.model,
      input: [
        {
          role: 'system',
          content: instruction,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    return response.output_text ?? '';
  }
}
