import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { GuildRepository } from '@/infrastructure/db';
import { IssueService } from '@/infrastructure/github/services/issue.service';
import { Issue } from '@/infrastructure/github/services/issue.service';

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

  const repos = await GuildRepository.getAll(guildId);

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
