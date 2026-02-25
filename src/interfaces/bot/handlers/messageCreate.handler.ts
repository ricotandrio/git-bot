// src/bot/handlers/messageCreate.ts
import { Message } from 'discord.js';
import { logger } from '@/lib';
import { handleLLMCommand } from './llmCommand.handler';

export async function handleMessageCreate(message: Message): Promise<void> {
  if (message.author.bot) return;
  if (!message.mentions.has(message.client.user!)) return; // only respond if bot is mentioned

  if (!message.channel.isTextBased()) {
    await message.reply('❌ I can only respond in text channels.');
    return;
  }

  const content = message.content
    .replace(`<@${message.client.user!.id}>`, '')
    .trim();

  if (!content) {
    logger.info('No content after mention, sending greeting');

    await message.reply(
      'Hey! How can I help? Try asking me to create an issue or check the board.',
    );
    return;
  }

  if (message.channel.isDMBased() === false) {
    await message.channel.sendTyping();
  }

  try {
    await handleLLMCommand(message, content);
  } catch (error) {
    logger.error({ error }, 'LLM command failed');
    await message.reply(
      '❌ Something went wrong. Try using slash commands directly.',
    );
  }
}
