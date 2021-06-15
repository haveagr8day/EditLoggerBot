const {
  colors: { base },
  guildChannelMap,
} = require("../config");
const AuditLogEmbedBuilder = require("../classes/AuditLogEmbedBuilder");
const send = require("../util/send");

module.exports = async (client) => {
  console.log("auditLog: ready");

  Object.keys(guildChannelMap)
    .map((guildId) => client.guilds.resolve(guildId))
    .filter(Boolean)
    .forEach( async (guild) => { 
        guild.channels.cache.forEach( async (channel) => {
            if (channel.type != 'text') {
                return
            }
            limit = 500
            const sum_messages = [];
            let last_id;
            
            while (true) {
                const options = { limit: 100 };
                if (last_id) {
                    options.before = last_id;
                }

                const messages = await channel.messages.fetch(options);
                sum_messages.push(...messages.array());
                if (!messages.last()){
                    return
                }
                last_id = messages.last().id;

                if (messages.size != 100 || sum_messages.length >= limit) {
                    console.log(`Fetched ${sum_messages.length} messages from ${channel.name} of ${guild.name}`)
                    break;
                }
            }
        });
    });
};
