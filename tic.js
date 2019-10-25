var origBoard;
const huPlayer = 'O';
const aiPlayer = 'X';
const winCombos = [
	[0,1,2],
	[3,4,5],
	[6,7,8],

	[0,3,6],
	[1,4,7],
	[2,5,8],

	[6,4,2],
	[0,4,8]

]

var hu_score = 0;
var ai_score = 0;
const huScore_board = document.getElementById("huscore");
const aiScore_board = document.getElementById("aiscore");

const cells = document.querySelectorAll('.cell');
startGame();

function startGame(){
	/*to clear the result popup when restarting*/
	document.querySelector(".endgame").style.display = "none";
	/*make every array from 0 to 9*/
	origBoard = Array.from(Array(9).keys());

	/*remove existing marks on board*/
	for(var i=0; i<cells.length ;i++){
		cells[i].innerText = '';
	/*remove the highlighted winning combo*/	
		cells[i].style.removeProperty('background-color');

		cells[i].addEventListener('click', turnClick, false);

	}
}

function turnClick(square){
	/*board array is numbers until the players click replacing them
	with x or os, this check prevents sametile clicks*/
	if(typeof origBoard[square.target.id] == 'number'){
		turn(square.target.id, huPlayer);

		if(!checkWin(origBoard, huPlayer) && !checkTie()) turn(bestSpot(), aiPlayer);
	}
	
}

function turn(squareId, player){
	origBoard[squareId] = player;
	document.getElementById(squareId).innerText = player;
	let gameWon = checkWin(origBoard, player)
	if(gameWon) gameOver(gameWon)
}

function checkWin(board, player){
	/*find places on board thats taken*/

	let plays = board.reduce((a, e, i) =>
	(e === player) ? a.concat(i) : a,[]);
	
	let gameWon = null;
	/*loop through win combos*/
	for(let [index, win] of winCombos.entries()){
		if(win.every(elem => plays.indexOf(elem) > -1)){
			/*which combo they won with and who won*/
			gameWon = {index: index, player: player};
		}
	}
	return gameWon;
}

function gameOver(gameWon, huscore, aiscore){
	/*highlight the winning tile*/
	for(let index of winCombos[gameWon.index]){
		document.getElementById(index).style.backgroundColor =
		gameWon.player == huPlayer ? "rgba(168,227,138,0.6)": "rgba(227,138,153,0.6)";
	}
	/*stops clicking after win*/
	for(var i = 0; i<cells.length; i++){
		cells[i].removeEventListener('click', turnClick, false);
	}
	declareWinner(gameWon.player == huPlayer ? "You Win!" : "You Lose!");

	/*increments the score*/
	if(gameWon.player == huPlayer){
		hu_score++;
		console.log(huscore);
		console.log("human win");
		huScore_board.innerHTML = hu_score;
	} 
	else{
		hu_score = hu_score + 0;
		console.log(hu_score);
		console.log("human lose");
		huScore_board.innerHTML = hu_score;
	}

	if(gameWon.player == aiPlayer){
		ai_score++; 
		console.log(ai_score);
		console.log("ai win");
		aiScore_board.innerHTML = ai_score;
	} 
	else{
		ai_score = aiscore + 0; 
		console.log(ai_score);
		console.log("ai lose");
		aiScore_board.innerHTML = ai_score;
	}


}

function emptySquares(){
	/*board array is numbers until the players click replacing them
	with x or os, this checks if the tile has been player occupied*/
	return origBoard.filter(s => typeof s=='number');
}


function bestSpot(){
	/*result of minimax is an object and .index will
	be the spot the computer chooses*/
	return minimax(origBoard, aiPlayer).index;
}

function checkTie(){

	if(emptySquares().length == 0){
		for(var i=0; i< cells.length; i++){
			cells[i].style.backgroundColor ="rgba(227, 224, 79,0.6)";
			cells[i].removeEventListener('click', turnClick, false);
		}
		declareWinner("Tie Game!")
		return true;
	}
	return false;
}

function declareWinner(who){
	document.querySelector(".endgame").style.display = "block";
	document.querySelector(".endgame .text").innerText = who;

}

/*minimax algo - for automated decision making
- return a value if terminal state is found
- run through board spaces
= call minimax on each open space
- evaluate returned values 
- return best value */

function minimax(newBoard, player){
	var availSpots = emptySquares(newBoard);

	if(checkWin(newBoard, huPlayer)){

		return {score:-10};
	} 
	else if(checkWin(newBoard, aiPlayer)){
		return {score: 10};
	}
	else if(availSpots.length === 0){
		return {score: 0};
	}
	/*collect all score from empty spaces to evaluate*/
	var moves = [];
	for(var i = 0; i<availSpots.length;i++){
		var move = {};
		move.index = newBoard[availSpots[i]];
		newBoard[availSpots[i]] = player;
		/*recur happens till it finds a higher terminal state*/
		if(player == aiPlayer){
			var result = minimax(newBoard, huPlayer);
			move.score = result.score;
		}
		else{
			var result = minimax(newBoard, aiPlayer);
			move.score = result.score;
		}
		newBoard[availSpots[i]] = move.index;

		moves.push(move);
	}
	/*chooses highest score when ai is playing
	lowest when human is playing*/
	var bestMove;
		if(player === aiPlayer){
			var bestScore = -10000;
			for(var i = 0; i<moves.length; i++){
				if(moves[i].score > bestScore){
					bestScore = moves[i].score;
					bestMove = i;
				}
			}
		}
		else{
			var bestScore = 10000;
			for(var i = 0; i<moves.length; i++){
				if(moves[i].score < bestScore){
					bestScore = moves[i].score;
					bestMove = i;
				}
			}
		}

		return moves[bestMove];
	



}

/*scoreboard*/
