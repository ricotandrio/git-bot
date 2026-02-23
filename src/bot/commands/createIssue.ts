import {
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from 'discord.js';
import { createIssue } from '@/github/services';
import { logger } from '@/lib/logger';
import { getGuildRepositories } from '@/db';

export const data = new SlashCommandBuilder()
  .setName('create-issue')
  .setDescription('Create a GitHub issue from Discord')
  .addStringOption((option) =>
    option.setName('title').setDescription('Issue title').setRequired(true),
  )
  .addStringOption((option) =>
    option
      .setName('label')
      .setDescription('Issue label')
      .setRequired(true)
      .addChoices(
        { name: 'Bug', value: 'bug' },
        { name: 'Design', value: 'design' },
        { name: 'Feedback', value: 'feedback' },
        { name: 'Enhancement', value: 'enhancement' },
      ),
  )
  .addStringOption((option) =>
    option
      .setName('description')
      .setDescription('Issue description')
      .setRequired(true),
  )
  .addStringOption((option) =>
    option
      .setName('repository')
      .setDescription('Target repository')
      .setRequired(true)
      .setAutocomplete(true),
  );

export async function execute(
  interaction: ChatInputCommandInteraction,
): Promise<void> {
  const guildId = interaction.guildId;
  if (!guildId) {
    await interaction.reply({
      content: 'This command can only be used in a server.',
      ephemeral: true,
    });
    return;
  }

  const repositories = getGuildRepositories(guildId);
  if (repositories.length === 0) {
    await interaction.reply({
      content:
        'No repositories configured for this server. Please ask an admin to set up repositories first.',
      ephemeral: true,
    });
    return;
  }

  const title = interaction.options.getString('title');
  const label = interaction.options.getString('label');
  const description = interaction.options.getString('description');
  const repo = interaction.options.getString('repository', true);
  if (!title || !label || !description || !repo) {
    await interaction.editReply(
      '❌ Missing required fields. Please provide title, label, and description.',
    );
    return;
  }

  if (!repositories.includes(repo)) {
    await interaction.editReply(
      '❌ Invalid repository. Please select a valid repository.',
    );
    return;
  }

  await interaction.deferReply({ ephemeral: true });

  try {
    const issue = await createIssue(title, description, label, repo);

    await interaction.editReply(
      `✅ Issue #${issue.number} created → ${issue.html_url}`,
    );
  } catch (error) {
    logger.error({ error }, 'Error creating issue');
    await interaction.editReply(
      '❌ Failed to create issue. Please try again later.',
    );
  }
}

export async function autocomplete(
  interaction: AutocompleteInteraction,
): Promise<void> {
  const guildId = interaction.guildId;

  if (!guildId) {
    await interaction.respond([]);
    return;
  }

  const focusedValue = interaction.options.getFocused(true);
  const repositories: string[] = getGuildRepositories(guildId);

  const filtered = repositories
    .filter((repo) =>
      repo.toLowerCase().includes(focusedValue.value.toLowerCase()),
    )
    .slice(0, 25);

  await interaction.respond(
    filtered.map((repo) => ({ name: repo, value: repo })),
  );
}
