// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });


var audio = new Audio('../../music/1.mp3');
var playing = false;
//example of using a message handler from the inject scripts
chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
  	// chrome.pageAction.show(sender.tab.id);
  	if (!playing) {
		audio.play();
		playing = true;
	}
    sendResponse({"message":"sup yo"});
  });