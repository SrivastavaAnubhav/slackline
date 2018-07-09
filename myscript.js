console.log("SLACKLINE LIVE");

let messageElements;
let observer = new MutationObserver(updateImages);
const observerConfig = {childList: true, subtree: true};
const fbContainerSelector = "#ChatTabsPagelet";
const messengerContainerSelector = '[aria-label="Messages"]';
const fbMessagesSelector = ".conversationContainer";
const messengerMessagesSelector = '[aria-label="Messages"]';

function getImgUrl(emojiString) {
	switch(emojiString) {
		case "party-parrot-gif":
			return "https://ph-files.imgix.net/caf5608a-67ec-4f9f-acb5-db0052c33bed";
		case "kappa":
			return "https://i.kym-cdn.com/photos/images/newsfeed/000/925/494/218.png_large";
		default:
			return "";
	}
}

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

	// JavaScript regexes are stupid:
	// https://stackoverflow.com/questions/1520800/why-does-a-regexp-with-global-flag-give-wrong-results
	const splitRegex = /(:[a-z0-9-]+:)/i;
	for (let messageNode of messageNodeList) {
		let splitMessageText = messageNode.textContent.split(splitRegex);

		// If there is a match it will split into ["", :match:, ""]
		if (splitMessageText.length == 1)
			continue

		let lastAppended = messageNode;
		for (let messagePart of splitMessageText) {
			if (messagePart == "")
				continue;

			let emojiUrl = "";
			if (splitRegex.test(messagePart)) {
				emojiUrl = getImgUrl(messagePart.substr(1, messagePart.length - 2));
				// console.log(messagePart.substr(1, messagePart.length - 2));
			}

			if (emojiUrl != "") {
				console.log("Replacing " + messagePart.substr(1, messagePart.length - 2));
				let newChild = document.createElement("img");
				newChild.src = emojiUrl;
				newChild.classList.add("slacklineEmoji");
				lastAppended.parentNode.classList.add("messageSpan");
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
