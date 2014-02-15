var days = ["Sun", "Mon", "Tue", "Wed", "Thr", "Fri", "Sat"];
var supporting_language = {
	"English": "en",
	"French": "fr",
	"Spanish": "es",
}

/************ Receive a connection ************/
chrome.runtime.onConnect.addListener(function (port) {

	chrome.tabs.detectLanguage(function (lang) {
		// console.log(lang);
		var savedLang = get('lang');
		var pre_word_count = get(todaysDay());
		var today_word_count = pre_word_count ? parseInt(pre_word_count) : 0;
		if (savedLang) {
			if (savedLang == lang && get('on_off') == 'on') {
				port.postMessage({step: 1, today_word_count: today_word_count});
			}
		} else {
			if (lang == 'en' && get('on_off') == 'on') {
				port.postMessage({step: 1, today_word_count: today_word_count});
			}
		}
	})

	// Receive a message
	port.onMessage.addListener(function (response) {
		if (response.step == 2) {
			var day = todaysDay();
			var wordCount = response.wordCount;
			if (day == get('last_access_day')) {
				wordCount = (get(day) ? parseInt(get(day)) + response.wordCount : response.wordCount);
			} else if (day == 'Sun') {
				for (var i = 0; i < days.length; i++) {
					save(days[i], 0);
				}
			}
			save(day, wordCount);
			save('last_access_day', day);
		}
	});
});

/************ Local Storage ************/
function save (key, val) {
	localStorage.setItem(key, val);
}
function get (key) {
	return localStorage.getItem(key);
}

/************ Date ************/
function todaysDay () {
	var date = new Date();
	return days[date.getDay()];
}
function getStart () {
	var date = new Date();
	var ago = date.getDay();
	var day = new Date(date.valueOf() - (60*60*24*ago*1000));
	console.log(day);
	console.log(day.getFullYear() + '/' + day.getUTCMonth() + '/' + day.getDate());
	return day.getFullYear() + '/' + (day.getUTCMonth() + 1) + '/' + day.getDate()
}
function getEnd () {
	var date = new Date();
	var ahead = 6 - date.getDay();
	var day = new Date(date.valueOf() + (60*60*24*ahead*1000));
	console.log(day);
	console.log(day.getFullYear() + '/' + day.getUTCMonth() + '/' + day.getDate());
	return day.getFullYear() + '/' + (day.getUTCMonth() + 1) + '/' + day.getDate();
}
