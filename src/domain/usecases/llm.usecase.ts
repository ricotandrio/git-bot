import { DbGuildRepository } from '@/infrastructure/db';
import { logger } from '@/lib';
import { model } from '@/infrastructure/llm/client';
import { SYSTEM_PROMPT } from '@/infrastructure/llm/prompt';

export async function generateLLMResponse(
  content: string,
  guildId: string,
): Promise<string> {
  const repos = DbGuildRepository.getAll(guildId);

  try {
    const prompt =
      `${SYSTEM_PROMPT}\n\n` +
      `Available repos: ${repos.join(', ')}\n` +
      `User message: ${content}`;

    logger.info(prompt);

    const result = await model.generateContent(prompt);
    const raw = result.response.text().trim();

    logger.info({ raw }, 'Gemini raw response');

    // strip markdown backticks if Gemini adds them anyway
    return raw.replace(/```json|```/g, '').trim();
  } catch (error) {
    logger.error({ err: error }, 'Gemini API error');
    throw new Error('LLM error');
  }
}