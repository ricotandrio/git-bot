import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from 'discord.js';
import { createIssue } from '@/github/services/issues';
import { logger } from '@/lib/logger';

export const data = new SlashCommandBuilder()
  .setName('create-issue')
  .setDescription('Create a GitHub issue from Discord')
  .addStringOption(option =>
    option
      .setName('title')
      .setDescription('Issue title')
      .setRequired(true)
  )
  .addStringOption(option =>
    option
      .setName('label')
      .setDescription('Issue label')
      .setRequired(true)
      .addChoices(
        { name: 'Bug', value: 'bug' },
        { name: 'Design', value: 'design' },
        { name: 'Feedback', value: 'feedback' },
        { name: 'Enhancement', value: 'enhancement' },
      )
  )
  .addStringOption(option =>
    option
      .setName('description')
      .setDescription('Issue description')
      .setRequired(true)
  );

export async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
  const title = interaction.options.getString('title');
  const label = interaction.options.getString('label');
  const description = interaction.options.getString('description');

  await interaction.deferReply({ ephemeral: true });

  try {
    if (!title || !label || !description) {
      await interaction.editReply('❌ Missing required fields. Please provide title, label, and description.');
      return;
    }

    const issue = await createIssue(title, description, label);

    await interaction.editReply(`✅ Issue #${issue.number} created → ${issue.html_url}`);
  } catch (error) {
    logger.error({ error }, 'Error creating issue');
    await interaction.editReply('❌ Failed to create issue. Please try again later.');
  }
}