// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });

var state;

function pickRandomSong(rule) {
	var candidates = [];
	var playlist = rule.playlist;
	for (var i=0; i<playlist.length; i++) {
		if (playlist[i] === rule.audio.currentSrc) {
			continue;
		}
		candidates.push(playlist[i]);
	}
	if (candidates.length === 0 ) {
		candidates = playlist;
	}
	return candidates[Math.floor(Math.random() * candidates.length)];
}

function pickNextSong(rule) {
	return pickRandomSong(rule);
}

function cue(audio, song) {
	audio.src = song;
	audio.load();
}

function ensurePlaying(audio) {
	if (audio.paused) {
		audio.autoplay = true;
		audio.play();
	}
}

function ensureNotPlaying(audio) {
	if (!audio.paused) {
		audio.autoplay = false;
		audio.pause();
	}
}

//example of using a message handler from the inject scripts
chrome.webNavigation.onCompleted.addListener(
  function(details) {
  	ensureMusicPlayingIffRequired();
  });

function ensureMusicPlayingIffRequired() {
	for (var i=0; i<state.rules.length; i++) {
		var rule = state.rules[i];
		function callback(tabs) {
			if (tabs.length > 0) {
				ensurePlaying(rule.audio);
			} else {
				ensureNotPlaying(rule.audio);
			}
		}

		var queryInfo = {
			active: true,
			currentWindow: true,
			windowType: 'normal',
			// status: 'complete',
			url: rule.match
		};
		chrome.tabs.query(queryInfo, callback);
	}
}

chrome.storage.sync.get("state", function(result) {
	try {
		state = JSON.parse(result);
	} catch(err) {
	}
	if (!state) {
		state = {};
	}
	if (!state.rules || !state.rules.length) {
		state.rules = 
		[
		{
			"match": [
		    "*://*.birchlabs.co.uk/*",
		    "*://birchlabs.co.uk/*"
			],
			"playlist":
			[
			'../../music/elevator.mp3'
			]
		}
		];
		// {
		// 	"match": [
		// 	"*://*.amazon.co.uk/*",
		//     "*://*.amazon.com/*",
		//     "*://*.birchlabs.co.uk/*",
		//     "*://birchlabs.co.uk/*"
		// 	],
		// 	"playlist":
		// 	[
		// 	'file:///Users/birch/git/chrome-buy-mode/music/1.mp3',
		// 	'file:///Users/birch/git/chrome-buy-mode/music/2.mp3',
		// 	'file:///Users/birch/git/chrome-buy-mode/music/3.mp3',
		// 	'file:///Users/birch/git/chrome-buy-mode/music/4.mp3'
		// 	],
		// 	"audio": undefined,
		// 	"favouriteFirst": true
		// }
	}

	(function initRules(rules) {
	for (var i=0; i<rules.length; i++) {
		var rule = rules[i];
		rule.audio = new Audio();
		var audio = rule.audio;
		cue(audio, (rule.favouriteFirst && rule.playlist[0]) || pickNextSong(rule));

		audio.addEventListener('ended', function() {	
			cue(pickNextSong());
		});
	}
	})(state.rules);

	chrome.tabs.onRemoved.addListener(function(tabId, attachInfo) {
		ensureMusicPlayingIffRequired();
	});

	chrome.windows.onFocusChanged.addListener(function(tabId, attachInfo) {
		ensureMusicPlayingIffRequired();
	});

	chrome.tabs.onActivated.addListener(function(activeInfo) {
		//activeInfo
		// int tabId The ID of the tab that has become active
		// int windowId The ID of the window the active tab changed inside of.

		ensureMusicPlayingIffRequired();
	});
})