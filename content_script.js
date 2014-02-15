/************ Make a connection ************/
var port = chrome.runtime.connect({name: "background"});
port.onMessage.addListener(function (request) {
	if (request.step == 1) {
		var num = wordCount();
		if (num > 0) {
			showWordCount(num, request.today_word_count);
			port.postMessage({step: 2, wordCount: num});
		}
	}
});


/************ Count words ************/
function wordCount () {
     var all = $('body').html().replace(/\n/g, '');;
     var texts = all.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/s    cript>/g, '').replace(/<style.*style>/g, '').replace(/<.+?>/g, '');
     var num = texts.match(/\S+/g).length;

	return Math.floor(num * 0.5);
}

/************ Show word count ************/
function showWordCount (now_word_count, today_word_count) {
	var elm = '<div id="now_word_count" style="position: fixed; padding: 5px 0px; bottom: 95px; right: 50px; font-size: 35px; color: red;">' + now_word_count + '</div><div id="today_word_count" style="position: fixed; padding: 5px 0px; bottom: 50px; right: 50px; font-size: 35px; color: red">' + today_word_count + '</div>';

	// Add HTML to body
	$('body').append(elm);
	// Set time out
	setTimeout(function () {
		animateNumber(now_word_count, today_word_count);
	}, 2500);
}

/************ Animation ************/
function animateNumber (now_word_count, today_word_count) {
	var go_to_zero = new countUp('now_word_count', now_word_count, 0, 0, 2.5);
	var increase = new countUp('today_word_count', today_word_count, today_word_count + now_word_count, 0, 2.5)
	
	go_to_zero.start(eraseWordCounter('now_word_count'));
	increase.start(eraseWordCounter('today_word_count'));
}
function eraseWordCounter (elm) {
	setTimeout(function () {
		$('#' + elm).animate({
			opacity: 0
		}, 2500, function () {
			$(this).remove();
		});
	}, 2500);
}
