"use strict";
console.log("SLACKLINE LIVE");

let messageElements;
let observer = new MutationObserver(updateImages);
const observerConfig = {childList: true, subtree: true};
const fbContainerSelector = "#ChatTabsPagelet";
const messengerContainerSelector = '[aria-label="Messages"]';
const fbMessagesSelector = ".conversationContainer";
const messengerMessagesSelector = '[aria-label="Messages"]';


// Any changes must be duplicated into options.js
// All keys must be lowercased
const baseEmojiMap = new Map([
	// Slack
	["party-parrot", "https://ph-files.imgix.net/caf5608a-67ec-4f9f-acb5-db0052c33bed"],

	// Twitch
	["4head", "https://static-cdn.jtvnw.net/emoticons/v1/354/1.0"],
	["anele", "https://static-cdn.jtvnw.net/emoticons/v1/3792/3.0"],
	["babyrage", "https://static-cdn.jtvnw.net/emoticons/v1/22639/1.0"],
	["biblethump", "https://static-cdn.jtvnw.net/emoticons/v1/86/1.0"],
	["cheffrank", "https://static-cdn.jtvnw.net/emoticons/v1/90129/1.0"],
	["coolstorybob", "https://static-cdn.jtvnw.net/emoticons/v1/123171/1.0"],
	["dendiface", "https://static-cdn.jtvnw.net/emoticons/v1/58135/1.0"],
	["failfish", "https://static-cdn.jtvnw.net/emoticons/v1/360/1.0"],
	["frankerz", "https://static-cdn.jtvnw.net/emoticons/v1/65/1.0"],
	["heyguys", "https://static-cdn.jtvnw.net/emoticons/v1/30259/1.0"],
	["jebaited", "https://static-cdn.jtvnw.net/emoticons/v1/114836/1.0"],
	["kapow", "https://static-cdn.jtvnw.net/emoticons/v1/133537/1.0"],
	["kappa", "https://static-cdn.jtvnw.net/emoticons/v1/25/1.0"],
	["kappapride", "https://static-cdn.jtvnw.net/emoticons/v1/55338/1.0"],
	["keepo", "https://static-cdn.jtvnw.net/emoticons/v1/1902/1.0"],
	["kreygasm", "https://static-cdn.jtvnw.net/emoticons/v1/41/1.0"],
	["lul", "https://static-cdn.jtvnw.net/emoticons/v1/425618/1.0"],
	["mrdestructoid", "https://static-cdn.jtvnw.net/emoticons/v1/28/1.0"],
	["notlikethis", "https://static-cdn.jtvnw.net/emoticons/v1/58765/1.0"],
	["osfrog", "https://static-cdn.jtvnw.net/emoticons/v1/81248/1.0"],
	["pjsalt", "https://static-cdn.jtvnw.net/emoticons/v1/36/1.0"],
	["peopleschamp", "https://static-cdn.jtvnw.net/emoticons/v1/3412/1.0"],
	["pogchamp", "https://static-cdn.jtvnw.net/emoticons/v1/88/1.0"],
	["residentsleeper", "https://static-cdn.jtvnw.net/emoticons/v1/245/1.0"],
	["swiftrage", "https://static-cdn.jtvnw.net/emoticons/v1/34/1.0"],
	["ttours", "https://static-cdn.jtvnw.net/emoticons/v1/38436/1.0"],
	["takenrg", "https://static-cdn.jtvnw.net/emoticons/v1/112292/1.0"],
	["theilluminati", "https://static-cdn.jtvnw.net/emoticons/v1/145315/1.0"],
	["trihard", "https://static-cdn.jtvnw.net/emoticons/v1/120232/1.0"],
	["wutface", "https://static-cdn.jtvnw.net/emoticons/v1/28087/1.0"],

	// Other
	["thonk", "https://vignette.wikia.nocookie.net/plantsvszombies/images/9/9b/Thonk.png"],
	["monkas", "https://i.imgur.com/VLjJHmR.png"]
]);

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

		// This doesn't miss messages that only contain a single emoji because if there is a match 
		// it will split into ["", :match:, ""]
		if (splitMessageText.length == 1)
			continue

		let lastAppended = messageNode;
		for (let messagePart of splitMessageText) {
			if (messagePart == "")
				continue;

			let emojiString = "";
			if (splitRegex.test(messagePart)) {
				emojiString = messagePart.substr(1, messagePart.length - 2).toLowerCase();
			}

			if (emojiString != "" && baseEmojiMap.has(emojiString)) {
				console.log("Replacing " + emojiString);
				let newChild = document.createElement("img");
				newChild.src = baseEmojiMap.get(emojiString);
				newChild.title = messagePart;
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
