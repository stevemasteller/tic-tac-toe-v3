/* globals $ */			// define $ as a global for jsHint

(function(){
"use strict";


/*****************************************
* Hover over game board and highlight 
* potential move
******************************************/

// set a background image showing potential move on a mouseover.
$(document).on("mouseover",".box", function() {
	
	// don't add a mouseover background image if box already filled
	if ( !( $(this).hasClass("box-filled-1") || $(this).hasClass("box-filled-2")) ) {
		
		// determine which image to use
		if (gameState.isPlayerO.bool) {
			$(this).css('background-image', 'url(img/o.svg)');
		} else {
			$(this).css('background-image', 'url(img/x.svg)');
		}
	}
});

// clear any mouseover background image on a mouseout
$(document).on("mouseout",".box", function() {
	
	// don't remove box-filled background images
	if ( !( $(this).hasClass("box-filled-1") || $(this).hasClass("box-filled-2")) ) {
		
		// clear mouseover background image
		$(this).css('background-image', 'none');
	}
});


/*****************************************
* Handle Start/Win/Tie displays and reset 
* game.
******************************************/

// Win Screen HTML markup
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

// Start Screen HTML markup
var addStartScreenMarkup = function() {
	var startScreen  = '<div class="screen screen-start" id="start">';
		startScreen +=    '<header>';
		startScreen +=       '<h1>Tic Tac Toe</h1>';
		startScreen +=       '<a href="#" class="button">Start game</a>';
		startScreen +=    '</header>';
		startScreen += '</div>';
	
		$(startScreen).insertAfter('.board');
};

// Display the Start Screen
var displayStart = function() {
	addStartScreenMarkup();		// add Start Screen Markup on initial start
	addWinScreenMarkup();		// add Win Screen Markup on initial start
	$('.board').hide();			// hide the board
	$('.screen-win').hide();	// hide the Win Screen
};

// Display the Win Screen
var displayWin = function(isWin) {
	$('.board').hide();			// hide the board
	$('.screen-win').show();	// show the Win Screen
	
	// If its a Win not a tie.
	if (isWin) {
		$('.message').text("Winner");	// set the Win message
		
		// Determine which player won
		if (gameState.isPlayerO.bool) {
			$('.screen-win').addClass('screen-win-one');						// player O won
			
		} else {
			$('.screen-win').addClass('screen-win-two');						// player X won
		}
		
		// center and size the background image
		$('.screen-win').css('background-repeat', 'no-repeat');
		$('.screen-win').css('background-position', 'center');
		$('.screen-win').css('background-size', '200px 200px');

	// If its a Tie
	} else {
		$('.screen-win').addClass('screen-win-tie');	// set the tie class
		$('.message').text("It's a Tie");				// set the tie message
	}
};

// Reset the game, this includes the gameState and the Win and Board Screens
var resetGame = function() {
	
	// Set Win Screen to initial conditions
	$('.screen-win').removeClass('screen-win-one');
	$('.screen-win').removeClass('screen-win-two');
	$('.screen-win').removeClass('screen-win-tie');

	// Set Board Screen to initial conditions
	$(document).find('li.box').removeClass(IS_O.box);
	$(document).find('li.box').removeClass(IS_X.box);
	// Since player changes on clicking the board, the mouseover background images aren't 
	// removed on a mouseout. They don't effect the game but need to be removed for a new game.
	$(document).find('li.box').css('background-image', 'none');  
	
	// Set gameState to initial conditions
	gameState.isPlayerO = IS_O;
	gameState.gameTurn = 0;
	gameState.highlightPlayer();	// highlight player O for a new game.
};

// Event handler for start/win button
$(document).on('click', '.button', function() {
	$('.screen-start').hide();		// When start button pushed, hide the Start Screen
	$('.screen-win').hide();		// When win button pushed, hide the Win Screen
	resetGame();					// Reset the game
	$('.board').show();				// Show the Board Screen
});


/*****************************************
* Play the game
******************************************/
// Value indicating isPlayerO is O
const IS_O = {
	box: 'box-filled-1',	// box of player O
	bool: true				// isPlayerO = true
};

// Value indicating isPlayerO is X
const IS_X = {
	box: 'box-filled-2',	// box of player X
	bool: false				// isPlayerO = false
};

// Object containing the current state of the game as well as various functions to operate on that state.
var gameState = {
	
	// variables
	isPlayerO: IS_O,		// indicates current player
	gameTurn: 0,			// counts the game turn
	board: [],				// one dimensional array indicating current players marks on board
		
	// Toggles the current player and performs various housekeeping functions 
	togglePlayer: function() {
		
		// Update the state of the board
		this.getCurrentBoard();					
		
		// Determine if the game is over
		if (this.checkVictory()) {				// Check for a victory
			displayWin(true);					// If victory display it.
		} else if (++this.gameTurn === 9) {		// Check for a tie
			displayWin(false);					// If tie display it.
		} 
		
		// Change the player
		if (this.isPlayerO.bool) {
			this.isPlayerO = IS_X;
		} else {
			this.isPlayerO = IS_O;
		}
		
		// Highlight the new player
		this.highlightPlayer();
	},
		
	// Highlights the current player
	highlightPlayer: function() {
		
		if (this.isPlayerO.bool) {					// player O
			$('#player1').addClass('active');
			$('#player2').removeClass('active');
		} else {									// player X
			$('#player1').removeClass('active');
			$('#player2').addClass('active');
		}
	},
	
	// Returns the class used in the box of the current player
	setBox: function(box) {
		$(box).addClass(this.isPlayerO.box);
	},	
	
	// Use HTML to store the state of the board.
	//   This function returns the current players marks
	//   as true in a one dimmensional array. Oppossing 
	//	 player marks and empty squares return false.
	getCurrentBoard: function() {
		var currentBoard = [];
		
		// Each li.box corresponds to a position on the game board
		$(document).find('li.box').each( function() {
			
			// set position to true if current player marked
			if ($(this).hasClass(gameState.isPlayerO.box)) {
				currentBoard.push(true);		// store the position in a one dimensional array
				
			// not current player so must be other player or empty
			} else {
				currentBoard.push(false);
			}
		});
		
		// Update board
	    this.board = currentBoard;
	},	
	
	// Checks the one dimensional array stored in this.board for winning conditions
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
			
		// Not a winner
		} else {
			return false;
		}	
	}
};

// Event handler for clicking on the board and setting marks.
$(document).find('li.box').on('click', function() {
	
	// If the box already has a mark, clicking on it does nothing.
	if ($(this).hasClass(IS_O.box) || $(this).hasClass(IS_X.box)) {
		return;
		
	// If the box has no mark, then clicking on it sets a mark and toggles the player.
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
