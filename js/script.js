/* globals $ */			// define $ as a global for jsHint

(function(){
"use strict";

/*****************************************
* Hover over game board and highlight 
* potential move
******************************************/

// 
$(document).on("mouseover",".box", function() {
	if ( !( $(this).hasClass("box-filled-1") || $(this).hasClass("box-filled-2")) ) {
		if (gameState.isPlayerO.bool) {
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
		if (gameState.isPlayerO.bool) {
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
	gameState.isPlayerO = IS_O;
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
	isPlayerO: IS_O,
	gameTurn: 0,
	board: [],
	
	togglePlayer: function() {
		
		this.getCurrentBoard();
		
		if (this.checkVictory()) {
			displayWin(true);
		} else if (++this.gameTurn === 9) {
			displayWin(false);
		} 
		
		if (this.isPlayerO.bool) {
			this.isPlayerO = IS_X;
		} else {
			this.isPlayerO = IS_O;
		}
		this.highlightPlayer();
	},
	
	highlightPlayer: function() {
		if (this.isPlayerO.bool) {
			$('#player1').addClass('active');
			$('#player2').removeClass('active');
		} else {
			$('#player1').removeClass('active');
			$('#player2').addClass('active');
		}
	},

	setBox: function(box) {
		$(box).addClass(this.isPlayerO.box);
	},
	
	// Use HTML to store the state of the board.
	//   This function returns the current players marks
	//   as true in a one dimmensional array. Oppossing 
	//	 player marks and empty squares return false.
	getCurrentBoard: function() {
		var currentBoard = [];
		
		$(document).find('li.box').each( function() {
			
			// set position to true if current player marked
			if ($(this).hasClass(gameState.isPlayerO.box)) {
				currentBoard.push(true);
				
			// not current player or empty so must be other player
			} else {
				currentBoard.push(false);
			}
		});
		
	    this.board = currentBoard;
	},
	
	checkVictory: function() {
 
		// check rows
		for (var i = 0; i <= 6; i += 3) {
			if (this.board[i] && this.board[i + 1] && this.board[i + 2]) {
				return true;
			}
		}
		
		// check columns
		for (var i = 0; i <= 2; i++) {
			if (this.board[i] && this.board[i + 3] && this.board[i + 6]) {
				return true;
			}
		}
		
		// check diagonals
		if ((this.board[0] && this.board[4] && this.board[8]) || 
			(this.board[2] && this.board[4] && this.board[6])) {
			return true;
		} else {
			return false;
		}	
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
