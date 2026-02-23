import { Client, GatewayIntentBits } from "discord.js"
import { config } from "@/bot/config"
import { handleInteraction } from "@/bot/handlers"

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
})

client.on("clientReady", () => {
  console.log(`Logged in as ${client.user?.tag}!`)
})

client.on('interactionCreate', handleInteraction);

client.login(config.DISCORD_BOT_TOKEN)