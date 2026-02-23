import { ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandOptionsOnlyBuilder } from "discord.js";
import * as helps from "./helps";
import * as ping from "./ping";
import * as createIssue from "./create-issue";

export interface Command {
  data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

export const commands: Record<string, Command> = {
  helps,
  ping,
  "create-issue": createIssue,
};

export { 
  helps, ping, createIssue
};