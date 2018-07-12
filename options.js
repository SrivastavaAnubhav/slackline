"use strict";

// Any changes must be duplicated into myscript.js
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

let defaultEmojisTable = document.getElementById("defaultEmojisTable");
for (let keyValuePair of baseEmojiMap) {
	defaultEmojisTable.innerHTML += `<tr><td>${keyValuePair[0]}</td><td><img src="${keyValuePair[1]}"></td></tr>`;
}