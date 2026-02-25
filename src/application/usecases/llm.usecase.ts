import { DbGuildRepository } from '@/infrastructure/db';
import { logger } from '@/lib';
import { model } from '@/infrastructure/llm/client';
import { SYSTEM_PROMPT } from '@/infrastructure/llm/prompt';

export type ParsedCommand = {
  command: string;
  args: Record<string, any>;
};

function parseCommand(raw: string): ParsedCommand | null {
  try {
    return JSON.parse(raw) as ParsedCommand;
  } catch {
    return null;
  }
}

export async function generateLLMResponse(
  content: string,
  guildId: string,
): Promise<ParsedCommand | null> {
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
    const cleanRaw = raw.replace(/```json|```/g, '').trim();

    return parseCommand(cleanRaw);
  } catch (error) {
    logger.error({ err: error }, 'Gemini API error');
    throw new Error('LLM error');
  }
}