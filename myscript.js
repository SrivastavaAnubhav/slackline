"use strict";
console.log("SLACKLINE LIVE");

const observerConfig = {childList: true, subtree: true};
const messengerContainerSelector = '[aria-label="Messages"]';
const messengerMessagesSelector = '[aria-label="Messages"]';
const groupIdRegex = RegExp('^[0-9]{16}$');

// TODO: Move these defaults to backend
// All keys must be lowercased
let emojiCache = new Map([
	// Slack
	["party-parrot", "https://ph-files.imgix.net/caf5608a-67ec-4f9f-acb5-db0052c33bed"],

	// Twitch
	["4head", "https://static-cdn.jtvnw.net/emoticons/v1/354/1.0"],
	["anele", "https://static-cdn.jtvnw.net/emoticons/v1/3792/3.0"],
	["babyrage", "https://static-cdn.jtvnw.net/emoticons/v1/22639/1.0"],
	["biblethump", "https://static-cdn.jtvnw.net/emoticons/v1/86/1.0"],
	["cheffrank", "https://static-cdn.jtvnw.net/emoticons/v1/90129/1.0"],
	["cmonbruh", "https://static-cdn.jtvnw.net/emoticons/v1/84608/3.0"],
	["coolstorybob", "https://static-cdn.jtvnw.net/emoticons/v1/123171/3.0"],
	["dendiface", "https://static-cdn.jtvnw.net/emoticons/v1/58135/1.0"],
	["failfish", "https://static-cdn.jtvnw.net/emoticons/v1/360/1.0"],
	["frankerz", "https://static-cdn.jtvnw.net/emoticons/v1/65/1.0"],
	["heyguys", "https://static-cdn.jtvnw.net/emoticons/v1/30259/1.0"],
	["jebaited", "https://static-cdn.jtvnw.net/emoticons/v1/114836/1.0"],
	["kapow", "https://static-cdn.jtvnw.net/emoticons/v1/133537/1.0"],
	["kappa", "https://i.kym-cdn.com/photos/images/original/000/925/494/218.png_large"],
	["kappapride", "https://static-cdn.jtvnw.net/emoticons/v1/55338/3.0"],
	["keepo", "https://static-cdn.jtvnw.net/emoticons/v1/1902/1.0"],
	["kreygasm", "https://static-cdn.jtvnw.net/emoticons/v1/41/1.0"],
	["lul", "https://static-cdn.jtvnw.net/emoticons/v1/425618/3.0"],
	["mrdestructoid", "https://static-cdn.jtvnw.net/emoticons/v1/28/3.0"],
	["notlikethis", "https://static-cdn.jtvnw.net/emoticons/v1/58765/3.0"],
	["osfrog", "https://static-cdn.jtvnw.net/emoticons/v1/81248/3.0"],
	["peopleschamp", "https://static-cdn.jtvnw.net/emoticons/v1/3412/3.0"],
	["pjsalt", "https://static-cdn.jtvnw.net/emoticons/v1/36/1.0"],
	["pogchamp", "https://static-cdn.jtvnw.net/emoticons/v1/88/1.0"],
	["residentsleeper", "https://static-cdn.jtvnw.net/emoticons/v1/245/1.0"],
	["swiftrage", "https://static-cdn.jtvnw.net/emoticons/v1/34/1.0"],
	["ttours", "https://static-cdn.jtvnw.net/emoticons/v1/38436/3.0"],
	["takenrg", "https://static-cdn.jtvnw.net/emoticons/v1/112292/3.0"],
	["theilluminati", "https://static-cdn.jtvnw.net/emoticons/v1/145315/3.0"],
	["trihard", "https://static-cdn.jtvnw.net/emoticons/v1/120232/3.0"],
	["wutface", "https://static-cdn.jtvnw.net/emoticons/v1/28087/3.0"],

	// Other
	["thonk", "https://vignette.wikia.nocookie.net/plantsvszombies/images/9/9b/Thonk.png"],
	["monkas", "https://i.imgur.com/VLjJHmR.png"]
]);

// A list of nodes, each of which is conversation with a different person
let messageElement;
let observer = new MutationObserver(observeHandler);

function resolveMessageNodeList(messageNodeList) {
	// JavaScript regexes are stupid:
	// https://stackoverflow.com/questions/1520800/why-does-a-regexp-with-global-flag-give-wrong-results
	const splitRegex = /(:[\w-]+:)/i;
	let needToReplace = false;
	let updateCache = false;
	for (let messageNode of messageNodeList) {
		let splitMessageText = messageNode.textContent.split(splitRegex);

		for (let messagePart of splitMessageText) {
			if (splitRegex.test(messagePart)) {
				needToReplace = true;
				let emojiName = messagePart.substr(1, messagePart.length - 2).toLowerCase();
				if (!emojiCache.has(emojiName)) {
					updateCache = true;
				}
			}
		}
	}

	// NOTE: This is a nested helper function, not a top-level function
	function replaceEmojiStrings() {
		for (let messageNode of messageNodeList) {
			let splitMessageText = messageNode.textContent.split(splitRegex);

			let emojiIsOnlyThingInMessage = splitMessageText.length == 3 &&
											splitMessageText[0] == "" &&
											splitMessageText[2] == "";

			let lastAppended = messageNode;
			for (let messagePart of splitMessageText) {
				let emojiString = undefined;
				if (splitRegex.test(messagePart)) {
					emojiString = messagePart.substr(1, messagePart.length - 2).toLowerCase();
				}

				let url = undefined;
				if (emojiString != undefined) {
					if (emojiCache.has(emojiString)) {
						url = emojiCache.get(emojiString);
					}
				}

				console.log("Emoji string: " + emojiString + ", url: " + url);
				if (emojiString != undefined && url != undefined) {
					console.log("Replacing " + emojiString);
					let newChild = document.createElement("img");
					newChild.src = url;
					newChild.title = messagePart;
					newChild.classList.add(emojiIsOnlyThingInMessage ? "slacklineEmojiBig" : "slacklineEmoji");
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

	if (!needToReplace) {
		return;
	}
	else if (!updateCache) {
		console.info("No custom emojis in message(s).");
		replaceEmojiStrings();
	}
	else {
		let urlParts = window.location.href.split('/');
		// TODO: do this better
		let groupId = urlParts[urlParts.length - 1];
		if (!groupIdRegex.test(groupId))
			return;

		// Call from background script to circumvent facebook's CSP
		chrome.runtime.sendMessage({groupId: groupId}, customEmojiMap => {
			console.info("Custom emoji map:");
			console.info(customEmojiMap);
			for (const [emojiName, emojiUrl] of Object.entries(customEmojiMap)) {
				emojiCache.set(emojiName, emojiUrl);
			}
			replaceEmojiStrings();
		});
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

function getLatestMessage() {
	return messageElement.lastChild.previousSibling.lastChild.firstChild.lastChild.lastChild;
}

function resolveLatestMessage(message) {
	observer.disconnect();

	// A list of the actual messages
	let messageNodeList = textNodesUnder(message);
	resolveMessageNodeList(messageNodeList);

	let container = document.querySelector(messengerContainerSelector);
	observer.observe(container, observerConfig);
}

// Try to resolve all emoji strings
function resolveAll() {
	observer.disconnect();
	console.log("Resolving all messages.");

	// A list of the actual messages
	let messageNodeList = [];
	messageNodeList.push(...textNodesUnder(messageElement));

	resolveMessageNodeList(messageNodeList);

	// Need to set id for latest messasge here so we don't call resolveLatestMessage
	// immediately after resolving all messages
	getLatestMessage().id = "sl_" + Math.random().toString(36).substring(8);

	let container = document.querySelector(messengerContainerSelector);
	observer.observe(container, observerConfig);
}

function observeHandler() {
	// Selecting by nodes that have an id doesn't work for some reason (returns empty)
	try {
		//                                        js_2          lastgrp    onlychild  messages  lastingrp
		let latestMessage = getLatestMessage();
		if (!latestMessage.id) {
			// Generate random id and resolve
			latestMessage.id = "sl_" + Math.random().toString(36).substring(8);
			resolveLatestMessage(latestMessage);
		}
		else {
			console.log("Id " + latestMessage.id + " seen");
		}
	}
	catch (err) {
		console.log(err);
		return;
	}
}

function waitForMessagesToLoad(messageSelector, time) {
	messageElement = document.querySelector(messageSelector);
	if (messageElement != null) {
		console.log("Messages loaded.");
		resolveAll();
	}
	else {
		setTimeout(function() {
			console.log("Waiting for messages to load...");
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
		waitForMessagesToLoad(messengerMessagesSelector, 200);
	}
});

waitForMessagesToLoad(messengerMessagesSelector, 200);
