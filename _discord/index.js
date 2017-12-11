const Discord = require("discord.js");
const bot = new Discord.Client();


var fs = require("fs");
var path = require('path');

var totalFiles = [];

bot.on('ready', () => {
    bot.user.setUsername("Shoutout Bot");
    //bot.user.setStreaming('Looking for donations', 'https://www.twitch.tv/yogsther', 1);

    var status = {
                name: 'Looking for donations',
                url: 'https://www.twitch.tv/yogsther',
                type: 1
        };
    bot.user.setStatus(null, status);
  });

// Load exisiting files on startup
loadExisitingFiles();
function loadExisitingFiles(){
  var foundFiles = fs.readdirSync("C:/Users/Server compter/Desktop/Shoutout-Server/requests");
  for(var i = 0; i < foundFiles.length; i++){
    totalFiles.push(foundFiles[i]);
  }
  console.log("Loaded " + foundFiles.length + " existing requests.");
}



setInterval(function(){

  var time = new Date();
  console.log("Checking..." + time.getSeconds());
  var foundFiles = fs.readdirSync("C:/Users/Server compter/Desktop/Shoutout-Server/requests");
  for(var i = 0; i < foundFiles.length; i++){
    var indexOfReq = totalFiles.indexOf(foundFiles[i]);
    if(indexOfReq == -1){
      // ADD TO LIST
      totalFiles.push(foundFiles[i]);
      // NEW REQUEST!
      var donation = loadDonationReq(foundFiles[i]);
      donation.origin = shorten(foundFiles[i]);
      shoutout(donation);

  }
}

}, 500);

bot.on("message", (message) => {
    if(message.author.bot == true){
        message.react("load_check:389403247724462080");
    }
});


function shoutout(donation){
  bot.channels.get("389085709606191106").send({embed: {
      color: 0xf14354,
      author: {
        name: "Ny donation!",
        icon_url: "http://shoutout.ntiu.se/img/megaphone.png",
      },
      title: "INFO",
      description: "Name: " + donation.name + "\nPhone #: " + donation.phone + "\nMessage:" + donation.message + "\nAmount: " + donation.amount + "kr\nOrigin: " + donation.origin ,

      fields: [
        {
          name: "Länkar",
          value: "[Admin Page](http://shoutout.ntiu.se/admin)\n[Bössan](http://bossan.musikhjalpen.se/insamling/nti-gymnasiet-umea)"
        }
      ],

    }
  });
}

function shorten(id){
  // Shorten an ID.txt id
  return id.substr(0,id.length-4);
}

function loadDonationReq(origin){
  var donation = fs.readFileSync("C:/Users/Server compter/Desktop/Shoutout-Server/requests/" + origin, "utf8");
  return JSON.parse(donation);
}




var token = fs.readFileSync("discord_token.txt", "utf8");
bot.login(token);
console.log("Shoutout-bot is turned on.");
