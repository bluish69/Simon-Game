var buttonColours = ["green", "red", "yellow", "blue"];
var gamePattern = [];
var userClickedPattern = [];
var gameState = 1;  //3 gameStates- 1= didn't start, 2= game started, 3=showing a sequence.
var n;
$(document).keyup(function (event) {  //This covers any key press that can happen, divided into the three game states.
  if (gameState === 1) {
    gameState = 3;
    nextSequence();
  } else if (gameState === 2) {
    if (
      event.key === "1" ||
      event.key === "2" ||
      event.key === "3" ||
      event.key === "4"
    ) {
      buttonPress(buttonColours[event.key - 1]); 
    } else {
      notice("Game already started!");
    }
  } else {
    notice("Be patient for sequence to end!");
  }
});
$(document).click(function (event) {  //This covers any click that can happen, divided into the three game states.
  switch (event.target.tagName) { //This code also checks where exactly was the button press.
    case "BODY":
      if (gameState === 1) {
        gameState = 3;
        nextSequence();
      } else {
        notice("game already started!");
      }
      break;
    case "DIV":
      if (gameState === 1) {
        gameState = 3;
        nextSequence();
      } else if (gameState === 2) {
        var firstClass = event.target.className.split(" ");
        if (firstClass[0] === "btn" || firstClass[0] === "text") {
          buttonPress(firstClass[1]);
        } else {
          notice("game already started!");
        }
      } else {
        notice("be patient for sequence to end!");
      }
      break;
    default:
      console.log(event.target.tagName);
      break;
  }
});

function buttonPress(color) { //This function triggers whenever a user press one of the buttons or the "1-4" keys(in gameState 2).
  playSound(color); //Basically checks if the userClickedPattern match the gamePattern.
  animatePress(color);
  userClickedPattern.push(color);
  if (checkPattern() === true) {  //A checkPattern call happens there, which compare both patterns.
    console.log("Nice");
  } else {
    playSound("wrong");
    $("body").addClass("red");
    setTimeout(function () {
      $("body").removeClass("red");
    }, 100);
    $("#level-title").text("Game Over, Press Any Key to Restart");
    gamePattern = [];
    userClickedPattern = [];
    gameState = 1;  //Reset everything after game over.
  }
  if (userClickedPattern.length === gamePattern.length && gameState === 2) {  //Runs if the whole of userClickedPattern matches gamePattern.
    setTimeout(function () {  //Resets the userClickedPattern for the next round and start the next sequence.
      userClickedPattern = [];
      gameState = 3;
      nextSequence();
    }, 300);
  }
}

function nextSequence() { //Generate a random colour and push it into the array, then plays the whole new sequence using sequenceLoop().
  var randomNumber = Math.floor(Math.random() * 4);
  var randomChosenColour = buttonColours[randomNumber];
  gamePattern.push(randomChosenColour);
  setTimeout(function () {
    gameState = 2;
  }, gamePattern.length * 400);
  sequenceLoop(gamePattern.length);
  n = 0;
  $("#level-title").text("Level " + gamePattern.length);
}

function sequenceLoop(times) {  //Runs a loop in a seperated function that shows the whole sequence one colour at a time.
  setTimeout(function () {
    $("." + gamePattern[n])
      .fadeOut(100)
      .fadeIn(100);
    playSound(gamePattern[n]);
    n++;
    if (n < times) {
      sequenceLoop(times);
    }
  }, 400);
}

function checkPattern() { //The comparison function that was called back in buttonPress.
  var i;
  var patternGood = true;
  for (i = 0; i < userClickedPattern.length; ) {
    if (gamePattern[i] === userClickedPattern[i] && patternGood === true) {
      patternGood = true;
    } else {
      patternGood = false;  //Done it a bit weird cause the normal way I thought should work didn't, probably there is a better way.
    }
    i++;
  }
  return patternGood;
}

function notice(text) { //Basically a cosmetic console.log function, also kinda nice to help the user understand why some things won't work.
  $(".invisble-box").text(text);
  $(".invisble-box").fadeIn(800).fadeOut(800);
}

function playSound(soundName) { //An adaptive play sound function.
  var soundName = new Audio("sounds/" + soundName + ".mp3");
  soundName.play();
}

function animatePress(colour) { //An adaptive play animation function.
  $("#" + colour).addClass("pressed");
  setTimeout(function () {
    $("#" + colour).removeClass("pressed");
  }, 100);
}
