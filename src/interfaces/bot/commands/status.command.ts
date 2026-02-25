import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { IssueService } from '@/infrastructure/github/services/issue.service';
import { Issue } from '@/infrastructure/github/services/issue.service';
import { logger } from '@/lib';
import { listRepositoriesFromDatabase } from '@/domain/usecases/repository.usecase';

export const data = new SlashCommandBuilder()
  .setName('status')
  .setDescription("Checks the repositories' open issues status");

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

  const listRes = listRepositoriesFromDatabase(guildId);

  if (!listRes.success) {
    logger.error({ guildId }, 'Failed to fetch repositories for autocomplete');
    await interaction.reply({
      content: '❌ Failed to fetch repositories. Please try again later.',
      ephemeral: true,
    });
    return;
  }

  const repositories = listRes.repositories;


  if (repositories.length === 0) {
    await interaction.reply({
      content: '❌ No repositories added yet. Use `/add-repo` to add one.',
      ephemeral: true,
    });
    return;
  }

  await interaction.deferReply();

  // fetch issues per repo in parallel
  const results = await Promise.all(
    repositories.map(async (repo) => {
      const issues = await IssueService.getIssues(repo);
      return { repo, issues };
    }),
  );

  const sections = results.map(({ repo, issues }) => {
    if (issues.length === 0) {
      return `Repository: **${repo}**\n  No open issues.`;
    }

    const issueList = issues
      .map((issue: Issue) => {
        if (issue.assignees.length === 0) {
          return `- #${issue.number}: ${issue.title} [unassigned]`;
        }

        const assignees = issue.assignees.join(', ');
        return `- #${issue.number}: ${issue.title} [${assignees}]`;
      })
      .join('\n');

    return `Repository: **${repo}**\n${issueList}`;
  });

  await interaction.editReply(
    `📋 **Repositories & Open Issues**\n\n` +
      sections.join('\n\n') +
      `\n\nUse \`/create-issue\` to create a new issue.`,
  );
}
