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
	console.log("Request:");
	console.log(request);

	fetch('http://ec2-13-52-130-221.us-west-1.compute.amazonaws.com:28255/emoji?groupId=' + request.groupId, {method: 'get'})
	.then(response => {
		console.log("Received response for request with groupId " + request.groupId);
		return response.json();
	})
	.then(response => {
		console.log(response);
		sendResponse(response.emojis);
	})
	.catch(err => {
		console.error(err);
		sendResponse({});
	});
	return true;
});
