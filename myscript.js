"use strict";
console.log("SLACKLINE LIVE");

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

// A list of nodes, each of which is conversation with a different person
let messageElements = [];
let observer = new MutationObserver(observeHandler);
let lastMessageIds;

// function getAnubhavMichelleImg(emojiString) {
// 	let xhr = new XMLHttpRequest();
// 	xhr.open("POST", "localhost:", true);
// 	xhr.setRequestHeader('Content-Type', 'application/json');
// 	xhr.send(JSON.stringify({
// 		emojiNames: ["horse", "123"],
// 		userId: 
// 	}));
// }

function resolveMessageNodeList(messageNodeList) {
	// JavaScript regexes are stupid:
	// https://stackoverflow.com/questions/1520800/why-does-a-regexp-with-global-flag-give-wrong-results
	let queryEmojiStrings = []
	const splitRegex = /(:[a-z0-9-]+:)/i;

	for (let messageNode of messageNodeList) {
		let splitMessageText = messageNode.textContent.split(splitRegex);

		if (splitMessageText.length == 1)
			continue;

		for (let messagePart of splitMessageText) {
			if (splitRegex.test(messagePart)) {
				let emojiString = messagePart.substr(1, messagePart.length - 2).toLowerCase();
				if (!baseEmojiMap.has(emojiString)) {
					queryEmojiStrings.push(emojiString);
				}
			}
		}
	}

	// API CALL GOES HERE

	for (let messageNode of messageNodeList) {
		let splitMessageText = messageNode.textContent.split(splitRegex);

		// This doesn't miss messages that only contain a single emoji because if there is a match 
		// it will split into ["", :match:, ""]
		if (splitMessageText.length == 1)
			continue;

		let lastAppended = messageNode;
		for (let messagePart of splitMessageText) {
			if (messagePart == "")
				continue;

			let emojiString = undefined;
			if (splitRegex.test(messagePart)) {
				emojiString = messagePart.substr(1, messagePart.length - 2).toLowerCase();
			}

			let url = undefined;
			if (emojiString != undefined) {
				if (baseEmojiMap.has(emojiString)) {
					url = baseEmojiMap.get(emojiString);
				}
				else if (emojiStringTranslations.has(emojiString)) {
					url = emojiStringTranslations.get(emojiString);
				}
			}

			if (emojiString != undefined && url != undefined) {
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
}


// http://www.javascriptkit.com/dhtmltutors/treewalker2.shtml
// https://stackoverflow.com/a/10730777/1890288
function textNodesUnder(root) {
	function nodeFilter(node) {
		// need span's parent to be a div so that we don't take the hidden name tag
		if (node.parentNode.tagName == "SPAN" &&
			(node.parentNode.parentNode.tagName == "DIV" || node.parentNode.parentNode.tagName == "SPAN") &&
			node.textContent != "")
			return NodeFilter.FILTER_ACCEPT;
		else
			return NodeFilter.FILTER_SKIP;
	}

	let node;
	let nodes = [];
	let walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, nodeFilter, false);
	while (node = walker.nextNode()) {
		nodes.push(node);
	}
	return nodes;
}

function resolveLatestMessage() {
	observer.disconnect();
	console.log("Resolving latest message.");

	// A list of the actual messages
	let messageNodeList = []
	messageNodeList.push(...textNodesUnder[messageElements[messageElements.length - 1]]);
	console.log(messageNodeList);
	resolveMessageNodeList(messageNodeList);

	let container = document.querySelector(getContainerSelector());
	observer.observe(container, observerConfig);
}

// Try to resolve all emoji strings
function resolveAll() {
	observer.disconnect();
	console.log("Resolving all.");

	// A list of the actual messages
	let messageNodeList = [];
	for (let i = 0; i < messageElements.length; ++i) {
		messageNodeList.push(...textNodesUnder(messageElements[i]));
	}

	resolveMessageNodeList(messageNodeList);

	let container = document.querySelector(getContainerSelector());
	observer.observe(container, observerConfig);
}

function observeHandler() {
	console.log(messageElements);
}

function isMessenger() {
	return document.domain == "www.messenger.com" || document.URL.startsWith("https://www.facebook.com/messages");
}

function getContainerSelector() {
	return isMessenger() ? messengerContainerSelector : fbContainerSelector;
}

function getMessagesSelector() {
	return isMessenger() ? messengerMessagesSelector : fbMessagesSelector;
}

function waitForMessagesToLoad(messageSelector, time) {
	messageElements = document.querySelectorAll(messageSelector);
	if (messageElements.length != 0) {
		// alert("The element is displayed, you can put your code instead of this alert.")
		console.log("Messages loaded.");

		observer.disconnect();
		observer.observe(document.querySelector(getContainerSelector()), observerConfig);
		resolveAll();
	}
	else {
		setTimeout(function() {
			console.log("Searching...");
			waitForMessagesToLoad(messageSelector, time);
		}, time);
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
