const { guildChannelMap } = require("../config");

module.exports = class Executable {
  constructor(message, user, command, args) {
    this.message = message;
    this.user = user;
    this.command = command;
    this.args = args;
  }

  log() {
    const timestamp = new Date().toISOString();
    const logMessage = [
      `${timestamp.substring(0, 10)} ${timestamp.substring(11, 19)}`,
      this.message.isFromTextChannel()
        ? `${this.message.guild} #${this.message.channel.name}`
        : "DM",
      `${this.user.tag}: ${this.message.content}`,
    ];

    console.log(logMessage.join(" | "));
  }

  isExecutable() {
    return (
      this.command &&
      (!this.command.ownersOnly || this.user.isOwner()) &&
      (!this.command.guildOnly || this.message.isFromTextChannel()) &&
      (!this.command.requireArgs || this.args.length) &&
      (!this.command.restrictChannel || (this.message.guild.id in guildChannelMap && this.message.channel.id == guildChannelMap[this.message.guild.id]["commandChannelId"])) &&
      !this.command.disabled &&
      !this.user.isOnCooldown(this.message, this.command)
    );
  }

  async execute() {
    await this.command.execute(this.message, this.user, this.args);
    this.user.startCooldown(this.command);
    this.log();
  }

  isDeletable() {
    return this.command.deletable && this.message.deletable;
  }
};
