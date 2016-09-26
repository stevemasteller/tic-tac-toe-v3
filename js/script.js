/* globals $ */			// define $ as a global for jsHint

(function(){
"use strict";

/*****************************************
* Hover over game board
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
			$('.screen-win').addClass('.screen-win-one');
			$('.screen-win').css('background-color', '#FFA000');
			$('.screen-win').css('background-image', 'url(../img/win_o.svg)');
		} else {
			$('.screen-win').addClass('.screen-win-two');
			$('.screen-win').css('background-color', '#3688C3');
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
	$(document).find('li.box').removeClass(isO.box);
	$(document).find('li.box').removeClass(isX.box);
	$(document).find('li.box').css('background-image', 'none');
	gameState.isPlayer1 = isO;
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
const isO = {
	box: 'box-filled-1',
	bool: true
};

const isX = {
	box: 'box-filled-2',
	bool: false
};

var gameState = {
	isPlayer1: isO,
	gameTurn: 0,
	
	togglePlayer: function() {
		
		if (checkVictory()) {
			displayWin(true);
		} else if (++this.gameTurn === 9) {
			displayWin(false);
		} 
		
		if (this.isPlayer1.bool) {
			this.isPlayer1 = isX;
		} else {
			this.isPlayer1 = isO;
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

var shiftIntoLSB = function (booleanValue, bit) {
	
	booleanValue = booleanValue << 1;
	booleanValue = booleanValue | bit;
	return booleanValue;
};

var getCurrentBoard = function() {
	var currentBoard = 0;
	
	$(document).find('li.box').each( function() {
		
		if ($(this).hasClass(gameState.isPlayer1.box)) {
			currentBoard = shiftIntoLSB(currentBoard, 0);
		} else {
			currentBoard = shiftIntoLSB(currentBoard, 1);
		}
	});
	
  return currentBoard;
};

const VICTORY_CONDITIONS = [0x007, 	// 0 0000 0111
							0x038,  // 0 0011 1000
							0x1c0,  // 1 1100 0000
							0x124,  // 1 0010 0100
							0x092,  // 0 1001 0010
							0x049,  // 0 0100 1001
							0x111,  // 1 0001 0001
							0x054]; // 0 0101 0100
var checkVictory = function() {
	var andVictoryCondition;
	
    for (var i = 0; i < VICTORY_CONDITIONS.length; i++) {
		andVictoryCondition = VICTORY_CONDITIONS[i] & getCurrentBoard();

		if ( andVictoryCondition === 0) {
			return true;
		}
	}
	return false;
};
	
// Event handler for clicking on the board.
$(document).find('li.box').on('click', function() {
	
	if ($(this).hasClass(isO.box) || $(this).hasClass(isX.box)) {
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
