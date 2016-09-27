/* globals $ */			// define $ as a global for jsHint

(function(){
"use strict";

/*****************************************
* Hover over game board and highlight 
* potential move
******************************************/

$(document).on("mouseover",".box", function() {
	if ( !( $(this).hasClass("box-filled-1") || $(this).hasClass("box-filled-2")) ) {
		if (gameState.isPlayer1.bool) {
			$(this).css('background-image', 'url(img/o.svg)');
		} else {
			$(this).css('background-image', 'url(img/x.svg)');
		}
	}
});

// clear background image on a mouseout
$(document).on("mouseout",".box", function() {
	if ( !( $(this).hasClass("box-filled-1") || $(this).hasClass("box-filled-2")) ) {
		$(this).css('background-image', 'none');
	}
});


/*****************************************
* Display Start/Win/Tie
******************************************/
var addWinScreenMarkup = function() {
    var endScreen  = '<div class="screen screen-win" id="finish">';
	    endScreen += 	'<header>';
        endScreen += 		'<h1>Tic Tac Toe</h1>';
        endScreen += 		'<p class="message"></p>';
        endScreen += 		'<a href="#" class="button">New game</a>';
        endScreen += 	'</header>';
		endScreen += '</div>';
		
		$(endScreen).insertAfter('.screen-start');
};

var addStartScreenMarkup = function() {
	var startScreen  = '<div class="screen screen-start" id="start">';
		startScreen +=    '<header>';
		startScreen +=       '<h1>Tic Tac Toe</h1>';
		startScreen +=       '<a href="#" class="button">Start game</a>';
		startScreen +=    '</header>';
		startScreen += '</div>';
	
		$(startScreen).insertAfter('.board');
};

var displayStart = function() {
	addStartScreenMarkup();
	addWinScreenMarkup();
	$('.board').hide();
	$('.screen-win').hide();
};

var displayWin = function(isWin) {
	$('.board').hide();
	$('.screen-win').show();
	
	if (isWin) {
		$('.message').text("Winner");
		if (gameState.isPlayer1.bool) {
			$('.screen-win').addClass('screen-win-one');
			$('.screen-win').css('background-image', 'url(../img/win_o.svg)');
		} else {
			$('.screen-win').addClass('screen-win-two');
			$('.screen-win').css('background-image', 'url(../img/win_x.svg)');			
		}
		$('.screen-win').css('background-repeat', 'no-repeat');
		$('.screen-win').css('background-position', 'center');
		$('.screen-win').css('background-size', '200px 200px');

	} else {
		$('.screen-win').addClass('screen-win-tie');
		$('.message').text("It's a Tie");
	}
};

var resetGame = function() {
	$('.screen-win').removeClass('screen-win-one');
	$('.screen-win').removeClass('screen-win-two');
	$('.screen-win').removeClass('screen-win-tie');
	$('.screen-win').css('background-image', 'none');	
	$(document).find('li.box').removeClass(IS_O.box);
	$(document).find('li.box').removeClass(IS_X.box);
	$(document).find('li.box').css('background-image', 'none');
	gameState.isPlayer1 = IS_O;
	gameState.gameTurn = 0;
};

// Event handler for start/win button
$(document).on('click', '.button', function() {
	$('.screen-start').hide();
	$('.screen-win').hide();
	resetGame();
	gameState.highlightPlayer();
	$('.board').show();
});


/*****************************************
* 
******************************************/
const IS_O = {
	box: 'box-filled-1',
	bool: true
};

const IS_X = {
	box: 'box-filled-2',
	bool: false
};

var gameState = {
	isPlayer1: IS_O,
	gameTurn: 0,
	
	togglePlayer: function() {
		
		var board = getCurrentBoard(this.isPlayer1);
		
		if (checkVictory(this.isPlayer1, board)) {
			displayWin(true);
		} else if (++this.gameTurn === 9) {
			displayWin(false);
		} 
		
		if (this.isPlayer1.bool) {
			this.isPlayer1 = IS_X;
		} else {
			this.isPlayer1 = IS_O;
		}
		this.highlightPlayer();
	},
	
	highlightPlayer: function() {
		if (this.isPlayer1.bool) {
			$('#player1').addClass('active');
			$('#player2').removeClass('active');
		} else {
			$('#player1').removeClass('active');
			$('#player2').addClass('active');
		}
	},

	setBox: function(box) {
		$(box).addClass(this.isPlayer1.box);
	}
};

// Use HTML to store the state of the board.
//   This function returns the current players marks
//   as true in a one dimmensional array. Oppossing 
//	 player marks and empty squares return false.
var getCurrentBoard = function(isPlayer1) {
	var currentBoard = [];
	
	$(document).find('li.box').each( function() {
		
		// set position to true if current player marked
		if ($(this).hasClass(isPlayer1.box)) {
			currentBoard.push(true);
			
		// not current player or empty so must be other player
		} else {
			currentBoard.push(false);
		}
	});
	
  return currentBoard;
};

var checkVictory = function(isPlayer1, board) {
 
	// check rows
	for (var i = 0; i <= 6; i += 3) {
		if (board[i] && board[i + 1] && board[i + 2]) {
			return true;
		}
	}
	
	// check columns
	for (var i = 0; i <= 2; i++) {
		if (board[i] && board[i + 3] && board[i + 6]) {
			return true;
		}
	}
	
	// check diagonals
	if ((board[0] && board[4] && board[8]) || 
	    (board[2] && board[4] && board[6])) {
		return true;
	} else {
		return false;
	}
};
	
// Event handler for clicking on the board.
$(document).find('li.box').on('click', function() {
	
	if ($(this).hasClass(IS_O.box) || $(this).hasClass(IS_X.box)) {
		return;
	} else {
		gameState.setBox(this);
		gameState.togglePlayer();
	}
});


/*****************************************
* On load
******************************************/
displayStart();
gameState.highlightPlayer();

})();
