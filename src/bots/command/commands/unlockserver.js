const CommandBuilder = require("../classes/CommandBuilder");
const { guildChannelMap } = require("../config.json");
module.exports = new CommandBuilder()
  .setAliases(["unlockserver"])
  .setOwnersOnly(false)
  .setGuildOnly(true)
  .setRequireArgs(false)
  .setCooldown(0)
  .setDeletable(false)
  .setRestrictChannel(true)
  .setDisabled(false)
  // eslint-disable-next-line
  .setExecute(async (message, user, args) => {
    const roleId = guildChannelMap[message.guild.id]["roleId"];
    const role = message.guild.roles.resolve(roleId);
    var permissions = role.permissions;
    
    await role.setPermissions(permissions.add(['SEND_MESSAGES','USE_PUBLIC_THREADS','CONNECT']).add(1n << 38n), "Unlocking server")
    
    await message.channel.send('Unlocked');
  });
