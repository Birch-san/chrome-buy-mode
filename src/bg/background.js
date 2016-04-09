var alive = false;

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

function pickNonRandomSong(rule) {
	// assumes no duplicates
	// indexOf returns -1 if `rule.audio.currentSrc` is not found in the array
	var currentIx = rule.playlist.indexOf(rule.audio.currentSrc);
	return rule.playlist[(currentIx+1) % rule.playlist.length];
}

function pickNextSong(rule) {
	switch(rule.playlistMode) {
		case "favouriteFirst":
		case "shuffle":
			return pickRandomSong(rule);
		case "noShuffle":
		default:
			return pickNonRandomSong(rule);
	}
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

function ensureMusicPlayingIffRequired() {
	if (!alive) {
		return;
	}

	function callback(rule, tabs) {
		if (!alive) {
			return;
		}
		if (tabs.length > 0) {
			ensurePlaying(rule.audio);
		} else {
			ensureNotPlaying(rule.audio);
		}
	}

	for (var i=0; i<state.rules.length; i++) {
		var rule = state.rules[i];

		var queryInfo = {
			active: true,
			currentWindow: true,
			windowType: 'normal',
			// status: 'complete',
			url: rule.match
		};
		chrome.tabs.query(queryInfo, callback.bind(callback, rule));
	}
}

function start() {
	chrome.storage.sync.get("state", function(items) {
		try {
			state = JSON.parse(items.state);
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
				],
				playlistMode: "noShuffle"
			}
			];
		}

		function cueNextSong(audio, rule) {
			cue(audio, pickNextSong(rule));
		}

		(function initRules(rules) {
			for (var i=0; i<rules.length; i++) {
				var rule = rules[i];
				rule.audio = new Audio();
				var audio = rule.audio;
				var nextSongPath;
				cue(audio, (rule.playlistMode === "favouriteFirst" && rule.playlist[0]) || pickNextSong(rule));

				audio.addEventListener('ended', cueNextSong.bind(cueNextSong, audio, rule));
			}
		})(state.rules);

		alive = true;
	})
}

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

chrome.webNavigation.onCompleted.addListener(function(details) {
	ensureMusicPlayingIffRequired();
});

start();

function tearDown() {
	alive = false;
	for(var i=0; i<state.rules.length; i++) {
		var rule = state.rules[i];
		ensureNotPlaying(rule.audio);
	}
}

chrome.storage.onChanged.addListener(function () {
	tearDown();
	start();
});