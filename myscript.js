console.log("SLACKLINE LIVE");

let messageElements;
let observer = new MutationObserver(updateImages);
const observerConfig = {childList: true, subtree: true};
const fbContainerSelector = "#ChatTabsPagelet";
const messengerContainerSelector = '[aria-label="Messages"]';
const fbMessagesSelector = ".conversationContainer";
const messengerMessagesSelector = '[aria-label="Messages"]';

function updateImages() {
	// http://www.javascriptkit.com/dhtmltutors/treewalker2.shtml
	function nodeFilter(node) {
		// need span's parent to be a div so that we don't take the hidden name tag
		if (node.parentNode.tagName == "SPAN" &&
			(node.parentNode.parentNode.tagName == "DIV" || node.parentNode.parentNode.tagName == "SPAN") &&
			node.textContent != "")
			return NodeFilter.FILTER_ACCEPT;
		else
			return NodeFilter.FILTER_SKIP;
	}

	// https://stackoverflow.com/a/10730777/1890288
	function textNodesUnder(root) {
		let node;
		let a = [];
		let walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, nodeFilter, false);
		while (node = walker.nextNode()) {
			a.push(node);
		}
		return a;
	}

	observer.disconnect();
	console.log("Observed event.");

	let messageNodeList = [];
	for (let i = 0; i < messageElements.length; ++i) {
		messageNodeList.push(...textNodesUnder(messageElements[i]));
	}
	// console.log(messageNodeList);

	const splitRegex = /(:[a-z0-9\-]+:)/gim;
	for (let messageNode of messageNodeList) {
		let splitMessageText = messageNode.textContent.split(splitRegex);
		// console.log(splitMessageText);

		let lastAppended = messageNode;
		for (let messagePart of splitMessageText) {
			if (messagePart == "")
				continue;

			if (splitRegex.test(messagePart)) {
				let emojiString = messagePart.substr(1, messagePart.length - 2);
				console.log("Replacing " + emojiString);
				let newChild = document.createElement("img");
				newChild.src = "https://ph-files.imgix.net/caf5608a-67ec-4f9f-acb5-db0052c33bed";
				newChild.width="16";
				newChild.height="16";
				lastAppended.parentNode.insertBefore(newChild, lastAppended.nextSibling);
				lastAppended = newChild;
			}
			else {
				let newChild = document.createTextNode(messagePart);
				lastAppended.parentNode.insertBefore(newChild, lastAppended.nextSibling);
				lastAppended = newChild;
			}
		}

		messageNode.remove();
	}

	let container = document.querySelector(getContainerSelector());
	// console.log(container);
	observer.observe(container, observerConfig);
}

function waitForMessagesToLoad(messageSelector, time) {
	messageElements = document.querySelectorAll(messageSelector);
	if (messageElements.length != 0) {
		// alert("The element is displayed, you can put your code instead of this alert.")
		console.log("Messages loaded.");

		observer.disconnect();
		observer.observe(document.querySelector(getContainerSelector()), observerConfig);
		updateImages();
	}
	else {
		setTimeout(function() {
			waitForMessagesToLoad(messageSelector, time);
		}, time);
	}
}

function getContainerSelector() {
	if (document.domain == "facebook.com") {
		return fbContainerSelector;
	}
	else if (document.domain == "www.messenger.com") {
		return messengerContainerSelector;
	}
	else {
		throw Error("Domain invalid");
	}
}

function getMessagesSelector() {
	if (document.domain == "facebook.com") {
		return fbMessagesSelector;
	}
	else if (document.domain == "www.messenger.com") {
		return messengerMessagesSelector;
	}
	else {
		throw Error("Domain invalid");
	}
}


// https://stackoverflow.com/a/50548409/1890288
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
	// listen for messages sent from background.js
	if (request.message == "url_change") {
		console.log("URL changed.");
		waitForMessagesToLoad(getMessagesSelector(), 200);
	}
});

waitForMessagesToLoad(getMessagesSelector(), 200);
