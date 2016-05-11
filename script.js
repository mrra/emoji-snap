// settings
var roundsToWin = 3;
var countdownFrom = 3;
var newRoundStartsIn = 4000;
var newRoundStartsInFromSnap = 4000;
var pcCallsIn = 2000;
var countdownSpeed = 500;
var noticeShowTime = 1200;
var noticeDelay = 1000;

var emojis = ['😎','🐰','🔫','🃏','😜','💩'];
var startingEmoji = '❔';
var joker = '🃏';

// notices
var userSnapNotice = '👱⚡️';
var userRoundWinNotice = '👱 +1 🎉';
var userRoundLostNotice = '🤖 +1 😫';
var userWinNotice = '👱🏆 = 👊👑😃🎉';

var pcSnapNotice = '🤖⚡️';
var pcRoundWinNotice = '🤖 +1 😦';
var pcRoundLostNotice = '👱 +1';
var pcWinNotice = '🤖🏆 = 😖😫';

// timers
var newRoundTimer = undefined;
var pcCallSnapTimer = undefined;
var countdownTimer = undefined;

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

// define state
var currentRound = 0;
var count = countdownFrom;
var gameStarted = false;

// HTML stuff
var instructions = document.getElementById('instructions');
var countdownNode = document.getElementById('countdown');
var startBtn = document.getElementById('start-btn');
var snapBtn = document.getElementById('snap-btn');
var resetBtn = document.getElementById('reset-btn');
var userEmojiNode = document.getElementById('user-emoji');
var pcEmojiNode = document.getElementById('pc-emoji');
var currentRoundNode = document.getElementById('current-round');
var noticeNode = document.getElementById('notice');
var roundsToWinNode = document.getElementById('rounds-to-win');
var jokerNode = document.getElementById('joker');
var userScoreNode = document.getElementById('user-score');
var pcScoreNode = document.getElementById('pc-score');

// events listeners
startBtn.addEventListener('click', function () {
	start();
});

snapBtn.addEventListener('click', function () {
	snap();
});

resetBtn.addEventListener('click', function () {
	init();
	start();
});

var init = function () {
	pc.roundsWon = 0;
	user.roundsWon = 0;
	userEmojiNode.innerText = startingEmoji;
	pcEmojiNode.innerText = startingEmoji;
	roundsToWinNode.innerText = roundsToWin;
	jokerNode.innerText = joker;
	currentRound = 0;
	
	currentRoundNode.innerText = currentRound;
	noticeNode.innerText = '';
	userScoreNode.innerText = 0;
	pcScoreNode.innerText = 0;
}

init();

var start = function () {
	countdown();
	
	// change the interface
	startBtn.classList.add('hide');
	resetBtn.classList.add('hide');
	snapBtn.classList.remove('hide');
	snapBtn.classList.remove('none');
	instructions.classList.add('hide');
	
	if (!gameStarted) {
		gameStarted = true;
		setTimeout(function () {
			instructions.parentNode.removeChild(instructions);
			gameStarted = true;
		}, 510)
		setTimeout(function () {
			startBtn.parentNode.removeChild(startBtn);
		}, 510)
	}
	
	setTimeout(function () {
		resetBtn.classList.add('none');
	}, 510)
}

var countdown = function () {
	
	if (count != 0) {
		console.log('count', count);
		countdownNode.innerText = count;
		countdownNode.classList.remove('hide');
	}
	
	if (count <= 0) {
		count = countdownFrom;
		countdownNode.classList.add('hide');
		startNextRound();
		return;
	} else {
		countdownTimer = setTimeout(countdown, countdownSpeed);
	}
	
	count --;
};

var startNextRound = function () {
	currentRound ++;
	
	console.log('Round', currentRound);
	currentRoundNode.innerText = currentRound;
	
	// set players emojis
	pc.currentEmoji = getRandomEmoji();
	user.currentEmoji = getRandomEmoji();
	userEmojiNode.innerText = user.currentEmoji;
	pcEmojiNode.innerText = pc.currentEmoji;
	
	// pc calls snap
	if (isAMatch()) {
		pcCallSnapTimer = setTimeout(function () {
			snap(true);
		}, pcCallsIn);
	}
	
	newRoundTimer = setTimeout(countdown, newRoundStartsIn);
	
	console.log('emojis', pc.currentEmoji, 'vs', user.currentEmoji)
};

var isAMatch = function () {
	if (pc.currentEmoji == joker || user.currentEmoji == joker) {
		return true;
	}
	return pc.currentEmoji == user.currentEmoji;
}

var getRandomEmoji = function () {
	var randomNumber = Math.round(Math.random() * (emojis.length-1));
	var randomEmoji = emojis[randomNumber];
	
	return randomEmoji;
};

var createNewNotice = function (noticeText, persist, delay) {
	var newNotice = document.createElement('div');
	newNotice.innerHTML = '<span>' + noticeText + '</span>';
	newNotice.classList.add('hide');
	
	if (!delay) delay = 0;
	
	noticeNode.appendChild(newNotice);
	setTimeout(function () {
		newNotice.classList.remove('hide');
	}, 10+delay);
	
	if (!persist) {
		setTimeout(function () {
			newNotice.classList.add('hide');
			setTimeout(function () {
				noticeNode.removeChild(newNotice);
			}, 260);
		}, noticeShowTime+delay);
	}
}

var snap = function (pcCalledSnap) {
	// compare bewteen the 2 emojis
	// if it's a joker then snap is true!
	// if snap is true then the user/pc get's +1 to roundsWon
	// if user gets it wrong then pc gets +1 to roundsWon
	// notify of what just happened – console/ui/html
	// 
	
	// check for undefined emojis
	if (pc.currentEmoji == undefined || user.currentEmoji == undefined) {
		return false;
	}
	
	clearTimeout(newRoundTimer);
	
	var isMatched = isAMatch();
	
	createNewNotice((pcCalledSnap ? pcSnapNotice : userSnapNotice));
	console.group('Snap Called by: '+ (pcCalledSnap ? 'PC' : 'User'));
	
	// pc called
	if (pcCalledSnap) {
		if (isMatched) {
			pc.roundsWon ++;
			pcScoreNode.innerText = pc.roundsWon;
			console.log('pc won the round')
			createNewNotice(pcRoundWinNotice, false, noticeDelay);
		} else {
			user.roundsWon ++;
			userScoreNode.innerText = user.roundsWon;
			console.log('pc lost the round')
			createNewNotice(pcRoundLostNotice, false, noticeDelay);
		}
	
	// user called
	} else {
		if (isMatched) {
			user.roundsWon ++;
			userScoreNode.innerText = user.roundsWon;
			console.log('user won the round')
			createNewNotice(userRoundWinNotice, false, noticeDelay);
		} else {
			pc.roundsWon ++;
			pcScoreNode.innerText = pc.roundsWon;
			console.log('user lost the round')
			createNewNotice(userRoundLostNotice, false, noticeDelay);
		}
	}
	
	console.log('User: ', user.roundsWon, 'PC: ', pc.roundsWon);
	
	pc.currentEmoji = undefined;
	user.currentEmoji = undefined;
	
	var whenWon = function () {
		resetBtn.classList.remove('none');
		resetBtn.classList.remove('hide');
		snapBtn.classList.add('hide');
		setTimeout(function() {
			snapBtn.classList.add('none');
		}, 250);
	}
	
	if (user.roundsWon == roundsToWin) {
		console.log('user won the game!!')
		console.log('game over')
		createNewNotice(userWinNotice, true, noticeDelay*2);
		whenWon();
	} else if (pc.roundsWon == roundsToWin) {
		console.log('pc won the game!!')
		console.log('game over')
		createNewNotice(pcWinNotice, true, noticeDelay*2);
		whenWon();
	} else {
		newRoundTimer = setTimeout(countdown, newRoundStartsInFromSnap);
	}
	
	console.groupEnd();
};















