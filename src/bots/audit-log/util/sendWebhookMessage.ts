import { Guild, TextChannel, Webhook, WebhookMessageOptions } from "discord.js";
import { Config } from "../types";

async function sendWebhookMessage(
  guild: Guild,
  config: Config,
  options: WebhookMessageOptions
): Promise<void> {
  const channel = (await guild.channels.fetch(
    config.logChannelId
  )) as TextChannel;
  const webhooks = (await channel.fetchWebhooks()).filter(hook => hook.token != null);
  const webhook = !webhooks.size
    ? await channel.createWebhook(guild.client.user?.username || "📢", { avatar: "https://i.imgur.com/UlO4Xty.png" })
    : (webhooks.first() as Webhook);

  webhook.send(options);
}

export { sendWebhookMessage };
