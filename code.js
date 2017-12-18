/*
  --- Socket.io ---
*/

// Connect to Livingforit servers
var socket = io.connect("http://213.66.254.63:3074");


var loadedDonations;


socket.on("donations", function(data){
  // Donations sent from the server  
  //TODO
  
  data.sort(function(a, b) {
    return b.addedTime - a.addedTime;
  });
  
  loadedDonations = data;
  var donations = data;
  var totalMoney = 0;
  for(var i = 0; i < donations.length; i++){
    var donation = donations[i];
    totalMoney += Number(donation.amount);
    var date = new Date(donation.addedTime);
    //24:32 Dec 10 2017
    var seconds = date.getSeconds();
    if(seconds.toString().length != 2){
      seconds = "0" + seconds;
    }
    try{
  
    document.getElementById("insert_donations").innerHTML += '<div class="donation_card" style="background-image:url(' + donation.image + ');"> <span class="donation_text">' + date.getHours() + ":" + seconds + " " + date.getDate() + "/" + (date.getMonth()+1) + " " + date.getFullYear() + '</span> <div class="donation_top_cover"> <span class="donation_name">' + donation.name + '</span> <span class="donation_message">' + donation.message + '</span> </div> <a href="' + 'donation.html?' + donation.origin  + '"><img title="Länka den här donationen" alt="Link donation button" class="link_icon" src="img/link-icon.png"></a>  <img title="Spela upp musik" alt="Speaker Button" class="speaker_icon" src="img/speaker-icon.png" onclick="playMusic(' + i + ')"> <div class="donation_amount_flap"> <span class="donation_amount">' + donation.amount + 'kr</span> </div> </div>';
    } catch(e) {
    }
    
    try{
      document.getElementById("total_amount").innerHTML = totalMoney + "kr";
    }catch(e){
      
    }
    
  }
  
  
if(location.href.indexOf("donation") != -1){
  try{
    loadCustomDonation();
  } catch(e){
  }
}
    
if(location.href.indexOf("submitpost") != -1){
  try{
    loadList();
  } catch(e){
  }
}

});


var musicPlaying = false;
var musicPos;
var musicTest = new Audio();

function playMusic(pos){
  
  if(!musicPlaying){
    try{
      // New music if it's not already loaded.
      eval("song_"+pos+".tagName");
    } catch(e){
      try{
        document.getElementsByClassName("speaker_icon")[pos].src = "img/pause-icon.png";
      } catch(e){
        document.getElementsByClassName("speaker_icon")[0].src = "img/pause-icon.png";
      }
      
      eval("window.song_" + pos + " = new Audio()");

      eval("song_" + pos + ".src = '" + loadedDonations[pos].music + "'");
      eval("song_" + pos + ".src");
      eval("song_" + pos + ".volume = 0.2;");
    }
    musicPlaying = true;
    musicPos = pos;
    try{
        document.getElementsByClassName("speaker_icon")[pos].src = "img/pause-icon.png";
      } catch(e){
        document.getElementsByClassName("speaker_icon")[0].src = "img/pause-icon.png";
      }
    eval("song_" + pos + ".play()");
  } else if(musicPlaying && musicPos != pos) {
    // Pressed new donation
    eval("song_" + musicPos + ".pause()");
    try{
        document.getElementsByClassName("speaker_icon")[musicPos].src = "img/speaker-icon.png";
      } catch(e){
        document.getElementsByClassName("speaker_icon")[0].src = "img/speaker-icon.png";
      }
    musicPlaying = false;
    playMusic(pos);
  } else {
    // Paused the same donation
    eval("song_" + musicPos + ".pause()");
    try{
        document.getElementsByClassName("speaker_icon")[musicPos].src = "img/speaker-icon.png";
      } catch(e){
        document.getElementsByClassName("speaker_icon")[0].src = "img/speaker-icon.png";
      }
    musicPlaying = false;
  }
    
}

function link(pos){
  // TODO LINK
}


/*
- Admin page
*/



function submitDonation(){
  
  var name = document.getElementById("name").value;
  var message = document.getElementById("message").value;
  var amount = document.getElementById("amount").value;
  var image = document.getElementById("image").value;
  var music = document.getElementById("music").value;
  var origin = document.getElementById("origin").value;
  var token = document.getElementById("token").value;
  
  
  var package = {
    name: name,
    message: message,
    amount: amount,
    image: image,
    music: music,
    token: token,
    origin: origin
  };
  
  socket.emit("submitDonation", package);
}


socket.on("callback_submit", function(call){
  document.getElementById("callback").innerHTML = call;
})

function loadRequests(){
  
  var token = document.getElementById("token").value;
  socket.emit("loadRequests", token);
  document.getElementById("active_requests").innerHTML = "Loading...";

  
}

var fullRequestList;

socket.on("requestList", function(data){
  
  
  document.getElementById("active_requests").innerHTML = "";
  document.getElementById("dead_requests").innerHTML = "";
  
  if(data === "failed"){
    document.getElementById("active_requests").innerHTML = "<span style='color:red;'>Wrong token.</span>";
    return;
  }

  if(data.length == 0){
    document.getElementById("active_requests").innerHTML = "No requests at the moment.";
    return;
  }
  
  data.sort(function(a, b) {
    return b.timeRequested - a.timeRequested;
  });
  
  fullRequestList = data;
  
  
  
  
  
  document.getElementById("active_requests").innerHTML = "";
  document.getElementById("dead_requests").innerHTML = "";
  
  for(var i = 0; i < data.length; i++){
    var solved = "";
    if(data[i].resolved){
      solved = " [RESOLVED]"
    }
    if(data[i].active){
      document.getElementById("active_requests").innerHTML += "<a style='color:green;' href='javascript:openReq(" + '"' + data[i].origin + '"' + ")'>" + shorten(data[i].origin) + " [ACTIVE]" + solved + "</a><br>";
    } else {
      document.getElementById("dead_requests").innerHTML += "<a style='color:red;' href='javascript:openReq(" + '"' + data[i].origin + '"' + ")'>" + shorten(data[i].origin) + solved + "</a><br>";
    }
    
  }
  if(data.length != 0){
    openReq(data[0].origin);
  }
  
  
  
});


// Millis to d-h-m-s
function millisToTime(millis){
    
    var days = Math.floor(millis / 1000 / 3600 / 24);
    var hours = Math.floor(millis / 1000 / 3600) - days * 24;
    var minutes = Math.floor((millis / 1000 / 60) - hours * 60 - days * 24 * 60);
    var seconds = Math.floor(millis / 1000) - (hours * 3600 + minutes * 60 + 24 * days * 3600);
    
    return {
        seconds: seconds,
        minutes: minutes,
        hours: hours,
        days: days
    };
}



function shorten(id){
  // Shorten an ID.txt id
  return id.substr(0,id.length-4);
}

function openReq(id){
  
  var obj = getObjFromId(id);
  var color = "green";
  if(obj.resolve) color = "grey";
  var resolvedTime = millisToTime(obj.resolveTime); 
  document.getElementById("this_request").innerHTML = '<span class="pre_admin">Phone #:</span> ' + obj.phone + '<button onclick="copyToClipboard(' + "'" + obj.phone + "'" + ')">Copy Phone #</button><br><span class="pre_admin">Amount:</span> ' + obj.amount + '<br> <span class="pre_admin">Name:</span> ' + obj.name + '<br> <span class="pre_admin">Message:</span> ' + obj.message + '<br><span class="pre_admin">Image:</span> ' + obj.image + '<br> <span class="pre_admin">Music:</span> ' + obj.music + '<br> <span class="pre_admin">Origin:</span> ' + obj.origin + '<br> <span class="pre_admin">IP:</span> ???<br><span style="color:'+color+'">Resolved: ' + obj.resolved + '</span><br><span class="pre_admin">Resolved time: </span>' + resolvedTime.minutes + 'm ' + resolvedTime.seconds + 's  <br><br> <a href="javascript:resolve(' + "'"  + obj.origin + "'"+ ')" style="color:' + color + ';">Resolve</a> <br><br><a href="javascript:deleteObj(' + "'"  + obj.origin + "'"+ ')" style="color:red;">Delete</a>';
}

function resolve(id){
  
  if(confirm("Are you sure you want to resolve this donation? This will promt the user to confirm with Swish!")){
    socket.emit("resolve", {
    token: document.getElementById("token").value,
    origin: id
  });
    location.reload();
    
  } else {
    return;
  }
  
}

function deleteObj(id){
  if(confirm("Are you sure you want to delete this donation? This will remove this donation forever.")){
    socket.emit("delete", {
    token: document.getElementById("token").value,
    origin: id
  });
    location.reload();
  } else {
    return;
  }
}


function getObjFromId(id){
  var found = -1;
  for(var i = 0; i < fullRequestList.length; i++){
    if(fullRequestList[i].origin == id){
      found = i;
      break;
    }
  }
  // Found
  
  return fullRequestList[found];
}

function saveToken(){
  // Save token to cookie
  var token = document.getElementById("token").value;
  createCookie("token", token, 1000);
}

// Load token
if(location.href.indexOf("admin") != -1){
  try{
    document.getElementById("token").value = readCookie("token");
    loadRequests();
  } catch(e){
  }
}



function loadCustomDonation(){
  
  var url = location.href;
  var donationOriginStart = url.indexOf("?");
  var donationOrigin = url.substr((donationOriginStart+1), url.length);
  
  try{
    var donation = null;
    for(var i = 0; i < loadedDonations.length; i++){
      if(loadedDonations[i].origin == donationOrigin){
        donation = loadedDonations[i];
        break;
      } 
      
    }
  } catch(e){
  }
  
  if(donation != null){

    var date = new Date(donation.addedTime);
    //24:32 Dec 10 2017
    var seconds = date.getSeconds();
    if(seconds.toString().length != 2){
      seconds = "0" + seconds;
    }

    document.getElementById("insert_donation_special").innerHTML += '<div class="donation_card" style="background-image:url(' + donation.image + ');"> <span class="donation_text">' + date.getHours() + ":" + seconds + " " + date.getDate() + "/" + (date.getMonth()+1) + " " + date.getFullYear() + '</span> <div class="donation_top_cover"> <span class="donation_name">' + donation.name + '</span> <span class="donation_message">' + donation.message + '</span> </div> <!-- <img title="Länka den här donationen" alt="Link donation button" class="link_icon" src="img/link-icon.png" onclick="link(' + i + ')"> --> <img title="Spela upp musik" alt="Speaker Button" class="speaker_icon" src="img/speaker-icon.png" onclick="playMusic(' + i + ')"> <div class="donation_amount_flap"> <span class="donation_amount">' + donation.amount + 'kr</span> </div> </div>';
  }
}


/*
- Donation form checker
*/


var name = document.getElementById("name");
var message = document.getElementById("message");
var image = document.getElementById("image_req");
var music = document.getElementById("song_req");
var phonenumber = document.getElementById("phone_numb");
var donationAmount = document.getElementById("donation_req");


function tempRedir(){
  location.href = "over.html"
}

if(location.href.indexOf("donate") != -1){
  try{
    tempRedir();
    donationAmount.value = 20;
    //getOpeningHours();
    eventListener();
  } catch(e){
    
  }
}

function eventListener(){
  window.addEventListener("keypress", function(e){
    if(e.keyCode === 13){
      // Enter key pressed.
      donationCheck();
    }
  });
}

function getOpeningHours(){
  var time = new Date();
  if(time.getDate() < 11){
    // Event has not started.
    document.getElementById("donation_status").innerHTML = "DONATIONER ÄR STÄNGDA! - Vi öppnar 11 December, och kör genom hela musikhjälpenvekan.";
    return;
  }
  if(time.getHours() < 7){
    // Closed due to hours.
    document.getElementById("donation_status").innerHTML = "DONATIONER ÄR STÄNGDA! - Vi öppnar kl 7";
    return;
  }
  
  
  
}

function donationCheck(){
  var error = "";
  // Run this function when the amount is changed or the donation form is loaded.
  if(donationAmount.value < 20) error = "Minsta donations mängd är 20kr";
  if(message.value == "") error = "Du måste ha ett meddelande!";
  if(phonenumber.value == "") error = "Du måste bidra ett nummer som är kopplat till swish!";
  
  if(error != ""){
    document.getElementById("error_div").innerHTML = "Något gick fel:<br>" + error; 
    document.getElementById("error_div").scrollIntoView();
    return;
  } else {
    document.getElementById("error_div").innerHTML = ""; 
  }
  
  var dataToSend = {
    name: document.getElementById("name").value,
    message: message.value,
    image: image.value,
    music: music.value,
    phone: phonenumber.value,
    amount: donationAmount.value
  }
  
  socket.emit("donation_request", dataToSend); // Send request to server.
  
  
  
  document.getElementById("insert_donation_form").innerHTML = '<div id="donation_after_wrap"> <span style="color: #59e56e" id="donation_status">Din donation behandlas.</span><br> <span id="under_message">Vänligen vänta - Det här kan en minut.</span><br> <img src="img/load_circle.png" id="circle_loader"><br> <span id="delete">När din donation har behandlats, öppna<br> Swish-appen för att slutföra donationen.</span> </div>';
  
  console.log(dataToSend);
  
  loadAndWait();
}

var circle;
var donationFinal = false;
var rotation = 0;


socket.on("donation_ready_final", function(boolean){
  if(boolean) donationFinal = true;
})

//loadAndWait();

function loadAndWait(){

  circle = document.getElementById("circle_loader");
  
  rotation -= 6;
  if(rotation < -360){
    rotation = 1;
  }

  circle.style.transform = "rotate(" + rotation + "deg)";
  
  if(!donationFinal){
    requestAnimationFrame(loadAndWait);
    return;
  } else {
    
    var success = new Audio();
    success.src = "sound/success.mp3";
    circle.style.transition = "opacity 1s, transform 1s";
    circle.classList.toggle("circle_loader_hidden");
    setTimeout(function(){
      circle.style.transform = "rotate(0deg), scale(0)";
   
      circle.classList.toggle("circle_loader_display");
      document.getElementById("donation_status").innerHTML = "Din donation är redo!";
      document.getElementById("under_message").innerHTML = "Öppna Swish-appen för att slutföra donationen.";
      document.getElementById("delete").innerHTML = "";
    }, 1000);
    
    
    setTimeout(function() {
      circle.style.transition = "opacity 1s, transform 1s";
      circle.src = "img/load_check.png";
      circle.style.transform = "rotate(0deg)";
      
    }, 1000);
    
    //
    success.play();
  }
  
}


function gotoDonate(){
  location.href = "donate.html";
}




/*
 --- Spawn hearts on hover (donation button) ---
*/



var heartObject = new Image();
heartObject.src = "img/heart.png";

var activeHearts = []; // To prevent duplicated IDs

var heartsRunning = false;

function spawnHearts(){
  // Spawn heart from Donate button
  setTimeout(function(){
    heart();
    if(heartsRunning){
      spawnHearts();
      }
    }, 400);
  
}



function heart(){
  
  var thisHeart = heartObject;
  var thisID = Math.floor(Math.random()*100000);
  var thisTop = -14;
  var thisRot = 0; // Rotation in degree (from 20 > -20)
  var thisRotFlip = false; // Angle to roate
  thisHeart.id = thisID;
  thisHeart.style.opacity = 1;
  thisHeart.style.top = "-14em";

  thisHeart.style.right = Math.floor(Math.random()*13)+1 + "em";
  thisHeart.classList.add("heart");
  document.getElementById("header_wrap").innerHTML += thisHeart.outerHTML;
  document.getElementById(thisID).style.fill = "red";
  
  heartLoop();
  
  function heartLoop(){
    setTimeout(function (){
    
    document.getElementById(thisID).style.transform = "rotate(" + thisRot + "deg)";
    document.getElementById(thisID).style.opacity -= 0.005
    document.getElementById(thisID).style.top = thisTop + "em";
      
    thisTop -= 0.05;
    
    var rotationSpeed = 2;
    if(!thisRotFlip) thisRot += rotationSpeed;
    if(thisRotFlip) thisRot -= rotationSpeed;
      
      
    if(thisRot == 20){
      thisRotFlip = true;
    }
    if(thisRot == -20){
      thisRotFlip = false;
    }
    
    
    if(document.getElementById(thisID).style.opacity < 0){
      return;
    } else {
      heartLoop();
      }
    }, 10);
  }
  
  
}

function loadList(){
  for(var i = 0; i < loadedDonations.length; i++){
    document.getElementById("load_existing_donation").innerHTML += "<option value='" + loadedDonations[i].origin + "'>" + loadedDonations[i].name + "</option>"
  }
}

function loadFromOrigin(){
  var origin = document.getElementById("load_existing_donation").value;
  var donation;
  for(var i = 0; i < loadedDonations.length; i++){
    if(loadedDonations[i].origin === origin) donation = loadedDonations[i];
  }
  
  document.getElementById("name").value = donation.name;
  document.getElementById("message").value = donation.message;
  document.getElementById("amount").value = donation.amount;
  document.getElementById("image").value = donation.image;
  document.getElementById("music").value = donation.music;
  document.getElementById("origin").value = donation.origin;
  
  
  
  
}




/* Extra functions (prob stolen from overstacked) */

function copyToClipboard(text) {
    if (window.clipboardData && window.clipboardData.setData) {
        // IE specific code path to prevent textarea being shown while dialog is visible.
        return clipboardData.setData("Text", text);

    } else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
        var textarea = document.createElement("textarea");
        textarea.textContent = text;
        textarea.style.position = "fixed";  // Prevent scrolling to bottom of page in MS Edge.
        document.body.appendChild(textarea);
        textarea.select();
        try {
            return document.execCommand("copy");  // Security exception may be thrown by some browsers.
        } catch (ex) {
            console.warn("Copy to clipboard failed.", ex);
            return false;
        } finally {
            document.body.removeChild(textarea);
        }
    }
}


function createCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
