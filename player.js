var Player = function(name, score){
    this.name = name;
    this.score = score;
}

/**
 * function increases player's score by number of points
 * @param {*} name 
 * @param {*} points 
 */
function incScore(name, points){
    this.score += points;
}