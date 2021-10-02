import { Client, MessageEmbed } from "discord.js";
import configs from "../config.json";
import { getConfig } from "../util/getConfig";
import { sendWebhookMessage } from "../util/sendWebhookMessage";

module.exports = async (client: Client): Promise<void> => {
  console.log(__dirname.split("\\").slice(-2)[0]);
};
