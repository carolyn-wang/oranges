/*const gameUtils = require('./util')*/
const questionDisplay_p = document.getElementById("questionDisplay");

var curQuestion = " d ";

class Game{

    constructor(players, gameSocket) {
        /*this.nameSocketMap = gameUtils.buildNameSocketMap(players);
        this.nameIndexMap = gameUtils.buildNameIndexMap(players);
        this.players = gameUtils.buildPlayers(players);
        this.gameSocket = gameSocket;
        */
        
        this.currentPlayer = 0;
        this.deck = "./util".buildDeck(players.length);
        this.winner = '';
    }

    getQuestion(){
        curQuestion = deck.pop();
        questionDisplay_p.innerHTML = curQuestion;
    }

    resetGame(startingPlayer = 0) {
        this.currentPlayer = startingPlayer;
        this.deck = gameUtils.buildDeck();
        for(let i = 0; i < this.players.length; i++) {
            this.players[i].score = 0;
            this.players[i].influences = [this.deck.pop(), this.deck.pop()];
        }
    }


    playTurn() {
        this.gameSocket.emit("g-updateCurrentPlayer", this.players[this.currentPlayer].name);
        console.scoreboard(this.players[this.currentPlayer].socketID)
        this.gameSocket.to(this.players[this.currentPlayer].socketID).emit('g-chooseAction');
    }

    onChooseAction(action) {
        console.scoreboard('action', action)
    }

    start() {
        this.resetGame();
        this.listen();
        this.updatePlayers();
        console.scoreboard('Game has started');
        this.playTurn()
        //deal cards to each player
    }
}
/*module.exports = Game;

this.getQuestion();*/
