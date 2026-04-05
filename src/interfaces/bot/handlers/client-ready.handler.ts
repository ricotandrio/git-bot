import { logger } from '@/utils/logger';

export async function handleClientReady(): Promise<void> {
  logger.info('Bot is ready!');
}
