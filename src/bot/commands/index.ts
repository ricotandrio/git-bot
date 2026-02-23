import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
  AutocompleteInteraction,
} from 'discord.js';

import * as helps from './helps';
import * as ping from './ping';
import * as status from './status';
import * as createIssue from './createIssue';
import * as addRepository from './addRepository';
import * as assignIssue from './assignIssue';
import * as linkGithub from './linkGithub';

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
  'add-repository': addRepository,
  'assign-issue': assignIssue,
  'link-github': linkGithub,
};

export { helps, ping, status, createIssue, addRepository };
