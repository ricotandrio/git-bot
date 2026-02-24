import { Guild, TextChannel } from 'discord.js';
import { logger } from '@/lib/logger';

export async function handleGuildCreate(guild: Guild): Promise<void> {
  try {
    // find the first channel the bot can send messages in
    const channel = guild.channels.cache.find(
      (ch) =>
        ch.isTextBased() &&
        guild.members.me?.permissionsIn(ch).has('SendMessages'),
    ) as TextChannel;

    if (!channel) {
      logger.warn(
        { guildId: guild.id },
        'No available channel to send welcome message',
      );
      return;
    }

    await channel.send(
      `👋 Hey **${guild.name}**! I'm GitBot.\n\n` +
        `I bridge your Discord server with GitHub`,
    );

    logger.info(
      { guildId: guild.id, guildName: guild.name },
      'Bot joined a new server',
    );
  } catch (error) {
    logger.error({ error }, 'Failed to send guild welcome message');
  }
}
