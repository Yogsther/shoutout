const Discord = require("discord.js");
const bot = new Discord.Client();


var fs = require("fs");
var path = require('path');

var totalFiles = [];

bot.on('ready', () => {
    bot.user.setUsername("Shoutout Bot");
    bot.user.setGame("Waiting for donations");
  })

setInterval(function(){

  console.log("Checking..." + Date());
  var foundFiles = fs.readdirSync("C:/Users/Server compter/Desktop/Shoutout-Server/requests");
  console.log(foundFiles);

for(var i = 0; i < foundFiles.length; i++){
  var indexOfReq = totalFiles.findIndex(i => i.origin === foundFiles[i].origin);
}

}, 500);




var token = fs.readFileSync("discord_token.txt", "utf8");
bot.login(token);
console.log("Shoutout-bot is turned on.");
