import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import * as helps from "./helps";
import * as ping from "./ping";

export interface Command {
  data: SlashCommandBuilder;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

export const commands: Record<string, Command> = {
  helps,
  ping,
};

export { 
  helps, ping 
};