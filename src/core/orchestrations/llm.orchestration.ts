import { config } from '@/config';
import { logger } from '@/utils';
import { dbIntegration } from '@/integrations/db';
import { getGuildRepositories } from '@/integrations/db/guild-repositories';
import { llmIntegration } from '@/integrations/llm';

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
  const db = dbIntegration.getClient().getDb();
  const repos = getGuildRepositories(db, { guildId });

  try {
    const prompt =
      `Available repos: ${repos.join(', ')}\n` +
      `User message: ${content}`;

    logger.info(prompt);

    const raw = await llmIntegration.execute('git_bot', prompt) as string;

    logger.info({ raw }, 'Gemini raw response');

    const cleanRaw = raw.replace(/```json|```/g, '').trim();

    return parseCommand(cleanRaw);
  } catch (error) {
    logger.error({ err: error }, 'Gemini API error');
    throw new Error('LLM error');
  }
}