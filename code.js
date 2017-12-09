/*
  --- Socket.io ---
*/

// Connect to Livingforit servers
var socket = io.connect("http://213.66.254.63:3074");

socket.on("donations", function(data){
  // Donations sent from the server
  
  
  
});






/*
- Donation form checker
*/


var name = document.getElementById("name");
var message = document.getElementById("message");
var image = document.getElementById("image_req");
var music = document.getElementById("song_req");
var phonenumber = document.getElementById("phone_numb");
var donationAmount = document.getElementById("donation_req");



if(location.href.indexOf("donate") != -1){
  try{
    donationAmount.value = 20;
  } catch(e){
    
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
  
  console.log(dataToSend);
  
  
  
}

var circle = document.getElementById("circle_loader");
var donationFinal = false;
var roation = 0;

loadAndWait();

function loadAndWait(){

  roation -= 6;
  circle.style.transform = "rotate(" + roation + "deg)";
  
  if(!donationFinal){
    requestAnimationFrame(loadAndWait);
    return;
  } else {
    circle.classList.toggle("circle_loader_hidden");
    
    document.getElementById("donation_status").innerHTML = "Din donation är redo!";
    document.getElementById("under_message").innerHTML = "Öppna Swish-appen för att slutföra donationen.";
    document.getElementById("delete").innerHTML = "";
    
    setTimeout(function() {
      circle.src = "img/load_check.png";
      circle.style.transform = "rotate(0deg)";
      circle.classList.toggle("circle_loader_display")
    }, 1000);
    
    //
  }
  
}


function gotoDonate(){
  console.log("click");
  location.href = "donate.html";
}




/*
 --- Spawn hearts on hover (donation button) ---
*/


// Mouse status
function mouseStatus(state){
  mouseOver = state;
  
  if(mouseOver && !heartsRunning){
    heartsRunning = true;
    spawnHearts();
  }
  if(!mouseOver){
    heartsRunning = false;
  }
}



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
