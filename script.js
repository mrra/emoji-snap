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
};

var snap = function (pcCalledSnap) {
	// compare bewteen the 2 emojis
	// if it's a joker then snap is true!
	// if snap is true then the user/pc get's +1 to roundsWon
	// if user gets it wrong then pc gets +1 to roundsWon
	// notify of what just happened – console/ui/html
	
	var snap = pc.currentEmoji == user.currentEmoji;
	
	if (pc.currentEmoji == joker || user.currentEmoji == joker) {
		snap = true;
	}
	
	console.group('Snap Called by: '+ (pcCalledSnap ? 'PC' : 'User'));
	
	// pc called
	if (pcCalledSnap) {
		if (snap) {
			pc.roundsWon ++;
			console.log('pc won the round')
		} else {
			user.roundsWon ++;
			console.log('pc lost the round')
		}
	
	// user called
	} else {
		if (snap) {
			user.roundsWon ++;
			console.log('user won the round')
		} else {
			pc.roundsWon ++;
			console.log('user lost the round')
		}
	}
	
	console.groupEnd();
};















