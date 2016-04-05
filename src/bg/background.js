// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });

var playlist = [
'../../music/1.mp3',
'../../music/2.mp3',
'../../music/3.mp3',
'../../music/4.mp3'
];

function pickRandomSong() {
	var candidates = [];
	for (var i=0; i<playlist.length; i++) {
		if (playlist[i] === audio.currentSrc) {
			continue;
		}
		candidates.push(playlist[i]);
	}
	if (candidates.length === 0 ) {
		candidates = playlist;
	}
	return candidates[Math.floor(Math.random() * candidates.length)];
}

function pickNextSong() {
	return pickRandomSong();
}

function cue(song) {
	audio.src = song;
	audio.load();
}

var audio = new Audio();
var favouriteFirst = playlist[0];
cue(favouriteFirst || pickNextSong());

audio.addEventListener('ended', function() {	
	cue(pickNextSong());
});

function ensurePlaying() {
	if (audio.paused) {
		audio.autoplay = true;
		audio.play();
	}
}

function ensureNotPlaying() {
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
	function callback(tabs) {
		if (tabs.length > 0) {
			ensurePlaying();
		} else {
			ensureNotPlaying();
		}
	}
	var queryInfo = {
		active: true,
		currentWindow: true,
		windowType: 'normal',
		// status: 'complete',
		url: [
		"*://*.amazon.co.uk/*",
	    "*://*.amazon.com/*",
	    "*://*.birchlabs.co.uk/*",
	    "*://birchlabs.co.uk/*"
		]
	};
	chrome.tabs.query(queryInfo, callback);
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