import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
  AutocompleteInteraction,
} from 'discord.js';

import * as helps from './helps.command';
import * as ping from './ping.command';
import * as status from './status.command';
import * as createIssue from './create-issue.command';
import * as addRepository from './add-repository.command';
import * as assignIssue from './assign-issue.command';
import * as linkGithub from './link-github.command';
import * as unlinkGithub from './unlink-github.command';

export interface Command {
  data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
  autocomplete?: (interaction: AutocompleteInteraction) => Promise<void>;
}

export const commands: Record<string, Command> = {
  helps,
  ping,
  status,
  'create-issue': createIssue,
  'add-repo': addRepository,
  'assign-issue': assignIssue,
  'link-github': linkGithub,
  'unlink-github': unlinkGithub,
};

export {
  helps,
  ping,
  status,
  createIssue,
  addRepository,
  assignIssue,
  linkGithub,
  unlinkGithub,
};
