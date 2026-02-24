import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
  AutocompleteInteraction,
} from 'discord.js';

import * as helps from './helps.command';
import * as ping from './ping.command';
import * as status from './status.command';
import * as createIssue from './createIssue.command';
import * as addRepository from './addRepository.command';
import * as assignIssue from './assignIssue.command';
import * as linkGithub from './linkGithub.command';
import * as unlinkGithub from './unlinkGithub.command';

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
