import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { getGuildRepositories } from '@/db';
import { logger } from '@/lib';
import { listIssues } from '@/github/services';
import { Issue } from '@/github/services/issues';

export const data = new SlashCommandBuilder()
  .setName('status')
  .setDescription("Checks the bot's status and command availability.");

export async function execute(
  interaction: ChatInputCommandInteraction,
): Promise<void> {
  const guildId = interaction.guildId;
  if (!guildId) {
    await interaction.reply({
      content: '❌ This command can only be used in a server.',
      ephemeral: true,
    });
    return;
  }

  const repos = getGuildRepositories(guildId);

  if (repos.length === 0) {
    await interaction.reply({
      content: '❌ No repositories added yet. Use `/add-repo` to add one.',
      ephemeral: true,
    });
    return;
  }

  await interaction.deferReply();

  // fetch issues per repo in parallel
  const results = await Promise.all(
    repos.map(async (repo) => {
      const issues = await listIssues(repo);
      return { repo, issues };
    }),
  );

  // build message per repo
  const sections = results.map(({ repo, issues }) => {
    const issueList =
      issues.length > 0
        ? issues
            .map((issue: Issue) => `- #${issue.number}: ${issue.title}\n`)
            .join('')
        : ' No open issues.';

    return `Repository: **${repo}**\n${issueList}`;
  });

  await interaction.editReply(
    `📋 **Repositories & Open Issues**\n\n` +
      sections.join('\n\n') +
      `\n\nUse \`/create-issue\` to create a new issue.`,
  );
}
