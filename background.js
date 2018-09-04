"use strict";
chrome.tabs.onUpdated.addListener(function
  (tabId, changeInfo, tab) {
    // read changeInfo data and do something with it (like read the url)
    if (changeInfo.url) {
      // do something here
      chrome.tabs.sendMessage(tabId, {
        message: 'url_change',
      })
    }
  }
);

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	console.log(request);
	fetch('http://localhost:28255/lookup_emojis', {
	    method: 'post',
	    headers: {
            "Content-Type": "application/json"
            // "Content-Type": "application/x-www-form-urlencoded",
        },
    	body: JSON.stringify(request)
    })
    .then(response => {
    	console.log(response.json());
    })
    .catch(err => console.log(err));
	sendResponse({farewell: "goodbye"});
});