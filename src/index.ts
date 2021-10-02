import "dotenv/config";
import path from "path";
import { Intents } from "discord.js";
import { CoreClient } from "discord-bot-core-client";

const client = new CoreClient({
  token: process.env.DISCORD_BOT_TOKEN as string,
  clientOptions: {
    intents: [
      Intents.FLAGS.GUILDS,
      Intents.FLAGS.GUILD_MEMBERS,
      Intents.FLAGS.GUILD_INTEGRATIONS,
      Intents.FLAGS.GUILD_WEBHOOKS,
      Intents.FLAGS.GUILD_VOICE_STATES,
      Intents.FLAGS.GUILD_PRESENCES,
      Intents.FLAGS.GUILD_MESSAGES,
      Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    ],
  },
});

client.registerBotsIn(path.resolve(__dirname, "bots")).start();

// Auto-shutdown at 4am so Heroku has less daytime restarts
let now: Date = new Date();
let millisTill4: number = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 4, 0, 0, 0).getTime() - now.getTime();
if (millisTill4 < 0) {
    millisTill4 += 86400000; // After 4am, get time to 4am tomorrow
}
setTimeout(function() {
    console.log('Automatic 4am shut down')
    //client.destroy()
    process.exit()
}, millisTill4);

process.on('SIGINT', function() {
    console.log('Shutting down');
    //client.destroy();
    process.exit();
});
process.on('SIGTERM', function() {
    console.log('Shutting down');
    //client.destroy();
    process.exit();
});
