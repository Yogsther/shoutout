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
  
    socket.on("donation_request", function(data){
    
      console.log("Recived request! " + Date());
      // Recived donation request
      var id = Math.floor(Math.random()*10000000000);
    
      data.timeRequested = Date.now();
    
      var exportData = JSON.stringify(data);
    
      fs.writeFileSync("requests/" + id + ".txt", exportData); // Save request
    });
  
  
  socket.on("loadRequests", function(recivedToken){
    
    
    if(recivedToken === token){
      
      console.log("Reviced request, sent it.");
      var foundFiles = fs.readdirSync("requests");
      console.log(foundFiles);
      /*
        var thisFile = fs.readFileSync("requests/" + file, "utf8");
        var parsedFile = JSON.parse(thisFile);  
      
     */
      
      var dataToSend = [];
      for(var i = 0; i < foundFiles.length; i++){
        var data = fs.readFileSync("requests/" + foundFiles[i], "utf8");
        data = JSON.parse(data);
        data.origin = foundFiles[i];
        dataToSend.push(data);
      }
      
      io.sockets.connected[socket.id].emit("requestList", dataToSend);
              
    } else {
      console.log("incorrect token!");
      io.sockets.connected[socket.id].emit("requestList", "failed");
      return;
    }
    
  });
  
  
  
  /* END OF SOCKET */
});
