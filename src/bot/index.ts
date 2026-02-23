import { Client, GatewayIntentBits } from "discord.js"
import { config } from "@/config"
import { handleInteraction } from "@/bot/handlers"

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
})

client.on("clientReady", () => {
  console.log(`Logged in as ${client.user?.tag}!`)
})

client.on('interactionCreate', handleInteraction);

client.login(config.DISCORD.BOT_TOKEN)