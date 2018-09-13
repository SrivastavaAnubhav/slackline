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
	// console.log("Request:");
	// console.log(request);

	fetch('http://localhost:28255/lookup_emojis', {
		method: 'post',
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(request.params)
	})
	.then(response => response.json())
	.then(response => {
		sendResponse(response);
	})
	.catch(err => sendResponse({}));
	return true;
});