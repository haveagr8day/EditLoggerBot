const CommandBuilder = require("../classes/CommandBuilder");
const { guildChannelMap } = require("../config.json");
module.exports = new CommandBuilder()
  .setAliases(["lockserver"])
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
    
    await role.setPermissions(permissions.remove(['SEND_MESSAGES','USE_PUBLIC_THREADS','CONNECT']).remove(1n << 38n), "Locking server")
    
    await message.channel.send('Locked');
  });
