// Bot Plugins
const {
  Client
} = require("discord.js");
const bot = new Client({
  disableEveryone: true
});

// Other plugins
require("dotenv/config");

// Util
const {
  getDemo
} = require('./util/getDemo');

// When it's online
bot.once("ready", () => {
  console.log(
    `Online!`
  );
  bot.user.setActivity("Era server");

  // Guild (or group)
  const guild = bot.guilds.get("672604845806452778");

  // setInterval executes after 1 hour and because of that we use the function first here
  getDemo(guild);
  setInterval(() => {
    getDemo(guild);
  }, 1000 * 60 * 60 /* Time in miliseconds */);
});

// Reconnect
bot.once("reconnecting", () => {
  console.log("Reconnecting...");
});

// Disconnect
bot.once("disconnect", () => {
  console.log("Disconnect!");
});

// Login
bot.login(process.env.TOKEN);