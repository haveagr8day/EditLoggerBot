require("dotenv").config();
const { Client } = require("discord.js");

const client = new Client();

require("./core/loadWidgetListeners")(client);

client.login(process.env.DISCORD_BOT_TOKEN);

process.on('SIGINT', function() {
    console.log('Shutting down');
    client.destroy();
    process.exit();
});
process.on('SIGTERM', function() {
    console.log('Shutting down');
    client.destroy();
    process.exit();
});
