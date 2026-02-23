import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
  AutocompleteInteraction,
} from 'discord.js';

import * as helps from './helps';
import * as ping from './ping';
import * as status from './status';
import * as createIssue from './create-issue';
import * as addRepository from './add-repository';

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
};

export { 
  helps, 
  ping, 
  status,
  createIssue, 
  addRepository 
};
