// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });


var audio = new Audio('../../music/1.mp3');
audio.loop = true;

function ensurePlaying() {
	if (audio.paused) {
		audio.play();
	}
}

function ensureNotPlaying() {
	if (!audio.paused) {
		audio.pause();
	}
}

// function stop() {
// 	if (!playing) {
// 		audio.play();
// 		playing = true;
// 	}
// }

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

// chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
// 	ensureMusicPlayingIffRequired();
// });

chrome.tabs.onActivated.addListener(function(activeInfo) {
	//activeInfo
	// int tabId The ID of the tab that has become active
	// int windowId The ID of the window the active tab changed inside of.

	ensureMusicPlayingIffRequired();
});