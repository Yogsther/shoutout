var express = require("express");

var socket = require("socket.io");

var app = express();

var fs = require("fs");

var path = require('path');

var server = app.listen(3074, function(){

  console.log("Listening to requests on port 3074");
});


var token = fs.readFileSync("token.txt", "utf8");


// Static files

app.use(express.static("public"))

// Socket setup

var io = socket(server);


io.on("connection", function(socket){
  //  Socket
  
  
    /* Send donations to connected user. */
    emitDonations(socket.id); 
   
  
    socket.on("donation_request", function(data){
    
      console.log("Recived donation! " + Date());
      // Recived donation request
      
      var id = 0;
      generateID();
      
      function generateID(){
        id = Math.floor(Math.random()*10000000000);
        // ID == ORIGIN
        var foundFiles = fs.readdirSync("requests");
        if(foundFiles.indexOf(id) != -1){
          generateID();
        }
      }
      
    
      data.timeRequested = Date.now();
      data.socket = socket.id;
      data.resolved = false;
    
      var exportData = JSON.stringify(data);
    
      fs.writeFileSync("requests/" + id + ".txt", exportData); // Save request
    });

  
  
  socket.on("loadRequests", function(recivedToken){
    
    
    if(recivedToken === token){

      var foundFiles = fs.readdirSync("requests");
      /*
        var thisFile = fs.readFileSync("requests/" + file, "utf8");
        var parsedFile = JSON.parse(thisFile);  
      
     */
      
      var dataToSend = [];
      for(var i = 0; i < foundFiles.length; i++){
        var data = fs.readFileSync("requests/" + foundFiles[i], "utf8");
        data = JSON.parse(data);
        data.origin = foundFiles[i];
        
        if(io.sockets.sockets[data.socket] != undefined){
          data.active = true;
        }else{
          data.active = false;
        }
        
        dataToSend.push(data);
      }
      
      io.sockets.connected[socket.id].emit("requestList", dataToSend);
              
    } else {
      console.log("incorrect token!");
      io.sockets.connected[socket.id].emit("requestList", "failed");
      return;
    }
    
  });
  
  socket.on("resolve", function(data){
    if(data.token === token){
      var donation = loadDonaitonRequest(data.origin);
      donation.resolved = true;
      var now = Date.now();
      donation.resolvedAt = now;
      donation.resolveTime = now - donation.timeRequested;
      saveDonationRequest(donation, data.origin);
      // Tell donator that the donation is ready.
      try{
        io.sockets.connected[donation.socket].emit("donation_ready_final", true);
      } catch(e){
      }
      
    } else {
      return;
    }
  });

  socket.on("delete", function(data){
    if(data.token === token){
      fs.unlinkSync("requests/" + data.origin);
    } else {
      return;
    }
  });
  
  
  socket.on("submitDonation", function(package){
    
    if(package.token === token){
      if(package.origin == ""){
        io.sockets.connected[socket.id].emit("callback_submit", "<span style='color:red;'>No origin.</span>");
        return;
      }
      if(package.origin.indexOf("txt") != -1){
        io.sockets.connected[socket.id].emit("callback_submit", "<span style='color:red;'>Origin should not include .txt!</span>");
        return;
      }
      
      package.addedTime = Date.now();
      
      var donation = JSON.stringify(package);
      
      fs.writeFileSync("donations/" + package.origin + ".txt", donation);
    
      console.log("Added new donation!");
      io.sockets.connected[socket.id].emit("callback_submit", "<span style='color:lightgreen;'>Sent and added!</span>");
    } else {
      io.sockets.connected[socket.id].emit("callback_submit", "<span style='color:red;'>Invalid token</span>");
      return;
    }
    
  });
  
  
  
  /* END OF SOCKET */
});

function emitDonations(socket){
  var donations = fs.readdirSync("donations");
  var donationPackage = [];
  for(var i = 0; i < donations.length; i++){
    var donation = fs.readFileSync("donations/" + donations[i],"utf8");
    donationPackage.push(JSON.parse(donation));
  }
  io.sockets.connected[socket].emit("donations", donationPackage);
}


function loadDonaitonRequest(id){
  var donation = fs.readFileSync("requests/" + id, "utf8");
  return JSON.parse(donation);
}

function saveDonationRequest(donation, origin){
  var saveDonation = JSON.stringify(donation);
  fs.writeFileSync("requests/" + origin, saveDonation);
}
