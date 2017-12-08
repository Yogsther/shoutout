/*
  --- Socket.io ---
*/

// Connect to Livingforit servers
var socket = io.connect("http://213.66.254.63:3074");

socket.on("donations", function(data){
  // Donations sent from the server
  
  
  
});



var donationAmount = document.getElementById("donation_req");

/*
- Donation form checker
*/

if(location.href.indexOf("donate") != -1){
  donationAmount.value = 20;
}

function donationCheck(){
  // Run this function when the amount is changed or the donation form is loaded.
  
  if(donationAmount.value < 20){
    donationAmount.value = 20;
  }
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
    }, 200);
  
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
