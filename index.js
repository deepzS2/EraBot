// Bot Plugins
const {
  Client
} = require("discord.js");
const bot = new Client({
  disableEveryone: true
});

// Other plugins
require("dotenv").config();

// Util
const {
  getFirstDemo
} = require('./util/getFirstDemo');

const {
  getSecondDemo
} = require('./util/getSecondDemo');

// When it's online
bot.once("ready", async () => {
  console.log(`Online!`);
  bot.user.setActivity("We are the new Era.");

  // Guild (or group)
  const guild = bot.guilds.get("672604845806452778");

  // setInterval executes after 5min and because of that we use the function first here
  // First FTP
  getFirstDemo(guild);

  // Second FTP
  // Time until next FTP
  setTimeout(() => {
    getSecondDemo(guild);
  }, 10000);


  setInterval(() => {
    getFirstDemo(guild);

    setTimeout(() => {
      getSecondDemo(guild);
    }, 10000);
  }, 1000 * 60 * 5 /* Time in miliseconds */);
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