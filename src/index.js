require("dotenv").config();
const { Client } = require("discord.js");

const client = new Client();

require("./core/loadWidgetListeners")(client);

client.login(process.env.DISCORD_BOT_TOKEN);

// Auto-shutdown at 8am UTC so Heroku has fewer daytime restarts
var now = new Date();
var millisTill4 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 8, 0, 0, 0) - now;
if (millisTill4 < 0) {
    millisTill4 += 86400000; // After 4am, get time to 4am tomorrow
}
setTimeout(function() {
    console.log('Automatic 4am shut down')
    client.destroy()
    process.exit()
}, millisTill4);

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
