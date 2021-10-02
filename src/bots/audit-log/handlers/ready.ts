import { Client, MessageEmbed, TextChannel, Message, Collection, Snowflake, ClientUser } from "discord.js";
import configs from "../config.json";
import { getConfig } from "../util/getConfig";
import { sendWebhookMessage } from "../util/sendWebhookMessage";

module.exports = async (client: Client): Promise<void> => {
  console.log(__dirname.split("\\").slice(-2)[0]);

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
