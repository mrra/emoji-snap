// define players
var user = {
	name: 'user',
	roundsWon: 0,
	currentEmoji: undefined
};
var pc = {
	name: 'pc',
	roundsWon: 0,
	currentEmoji: undefined
};

// define our emojis
var emojis = ['😎','🐰','🔫','🃏','😜','💩'];
var joker = '🃏';

// define state
var currentRound = 0;

var startNextRound = function () {
	currentRound ++;
	
	// set players emojis
	pc.currentEmoji = getRandomEmoji();
	user.currentEmoji = getRandomEmoji();
	
	console.log('emojis', pc.currentEmoji, 'vs', user.currentEmoji)
};

var getRandomEmoji = function () {
	var randomNumber = Math.round(Math.random() * (emojis.length-1));
	var randomEmoji = emojis[randomNumber];
	
	return randomEmoji;
}















