import { Client } from 'discord.js';
import { logger } from '@/lib';

type NotifyAssignmentParams = {
  client: Client;
  channelId: string;
  discordUserId: string;
  repoName: string;
  issueNumber: number;
};

export async function notifyIssueAssignment({
  client,
  channelId,
  discordUserId,
  repoName,
  issueNumber,
}: NotifyAssignmentParams): Promise<void> {
  try {
    const channel = await client.channels.fetch(channelId);

    if (!channel || !channel.isTextBased() || !channel.isSendable()) {
      logger.warn({ channelId }, 'Assignment notification channel is not text-based');
      return;
    }

    await channel.send(
      `✅ <@${discordUserId}> has been assigned to issue **#${issueNumber}** in **${repoName}**.`,
    ); 
  } catch (error) {
    logger.error(
      { error, channelId, discordUserId, issueNumber, repoName },
      'Failed to send assignment notification',
    );
  }
}
