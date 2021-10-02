import { Client, MessageEmbed, TextChannel, Message, Collection, Snowflake, ClientUser } from "discord.js";
import configs from "../config.json";
import { getConfig } from "../util/getConfig";
import { sendWebhookMessage } from "../util/sendWebhookMessage";


let global_client: Client;

module.exports = async (client: Client): Promise<void> => {
  console.log(__dirname.split("\\").slice(-2)[0]);
  if (!global_client){
    global_client = client;
  }

  configs
    .map((config) => client.guilds.resolve(config.guildId))
    .forEach((guild) => {
      if (!guild) {
        return;
      }

      const config = getConfig(guild);
      if (!config) {
        return;
      }

      guild.channels.cache.forEach( async (chan) => {
        if (chan.type != 'GUILD_TEXT'){
          return
        }
        let channel = chan as TextChannel
        const limit = 500
        const sum_messages = [];
        let last_id;

        if (channel.permissionsFor(await guild.members.fetch(client.user as ClientUser)).has(['READ_MESSAGE_HISTORY', 'VIEW_CHANNEL'])){
          while (true){
            let options: any = { limit: 100 };
            if (last_id) {
              options.before = last_id;
            }

            const messages = await channel.messages.fetch(options) as unknown as Collection<Snowflake, Message>
            sum_messages.push(...messages.values());
            let last = messages.last()
            if (!last){
              return
            }
            else{
                last_id = last.id
            }

            if (messages.size != 100 || sum_messages.length >= limit){
              console.log(`Fetched ${sum_messages.length} messages from ${channel.name} of ${guild.name}`)
              break;
            }
          }
        }
        else{
          console.log(`Cannot load messages from ${channel.name} of ${guild.name} due to missing permissions`)
        }
      });
    });
};

// Auto-shutdown at 4am so Heroku has less daytime restarts
let now: Date = new Date();
let millisTill4: number = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 4, 0, 0, 0).getTime() - now.getTime();
if (millisTill4 < 0) {
    millisTill4 += 86400000; // After 4am, get time to 4am tomorrow
}
setTimeout(function() {
    console.log('Automatic 4am shut down')
    global_client.destroy()
    process.exit()
}, millisTill4);

process.on('SIGINT', function() {
    console.log('Shutting down');
    global_client.destroy();
    process.exit();
});
process.on('SIGTERM', function() {
    console.log('Shutting down');
    global_client.destroy();
    process.exit();
});
