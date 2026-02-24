import { logger } from '@/lib/logger';

export async function handleClientReady(): Promise<void> {
  logger.info('Bot is ready!');
}
