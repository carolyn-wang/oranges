
const joinContainer_div = document.querySelector(".joinContainer");
const playersContainer_div= document.querySelector(".playersContainer");

const nameIn_p = document.getElementById("nameIn");
const enterButton_p = document.getElementById("enterButton");
const StartGameButton_p = document.getElementById("StartGameButton");

/** 
*after clicking "Enter Game"
*joinContainer moves up
*Players List becomes visible
*Enter button becomes hidden
*/
function showPlayers() {
    playersContainer_div.classList.add("fadeIn"); // players list fades in
    enterButton_p.style.visibility = "hidden"; // hides Submit Name button
    joinContainer_div.classList.add("joinContainerMove"); //moves joinContainer up
}




//showPlayers();
