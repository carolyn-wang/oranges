

    /**
     * Draws as many cards as people in game from total prompts deck
     * @param {number of cards to draw from deck} numCards 
     */

buildDeck= (numPlayers) => {
    deck = []
    for (i=0; i<numPlayers;i++){
        deck.push(prompts.pop());
    }
return deck;
}


buildNameSocketMap = (players) => {
    let map = {}
    players.map((x) => {
        map[x.name] = x.socketID;
    })
    return map
}

buildNameIndexMap = (players) => {
    let map = {}
    players.map((x, index) => {
        map[x.name] = index;
    })
    return map
}

buildPlayers = (players) => {
    players.forEach(x => {
        x.score = 0;
    });
    console.log(players);
    return players;
}

exportPlayers = (players) => {
    players.forEach(x => {
        delete x.socketID;
    });
    return players;
}

module.exports = {
    buildDeck: buildDeck,
    buildPlayers: buildPlayers,
    exportPlayers: exportPlayers,
    shuffleDeck: shuffleDeck,
    buildNameSocketMap: buildNameSocketMap,
    buildNameIndexMap: buildNameIndexMap
}
