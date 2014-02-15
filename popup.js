var optionCheck = 'close';
var sections = document.getElementsByClassName('section')

/************ Prepare views ************/
function views () {
	var background = chrome.extension.getBackgroundPage();
	// Set variables
	var date = new Date();
	var today = background.get(background.days[date.getDay()]);
	var week = new Array();
	var biggest = 0;
	week['total'] = 0;
	for (var i = 0; i < background.days.length; i++) {
		var countWords = background.get(background.days[i]);
		week[i] = countWords ? parseInt(countWords) : 0;
		week['total'] += countWords ? parseInt(countWords) : 0;
		biggest = biggest < parseInt(countWords) ? parseInt(countWords) : biggest;
	}

	// Show at popup
	document.getElementById('week').innerText = week['total'];
	document.getElementById('today').innerText = today ? today : 0;

	// Edit scale
	one_sixth = Math.floor(biggest / 6);
	var pre_max = one_sixth + biggest;
	var pre_max_string = pre_max.toString();
	var length = pre_max_string.length;
	var first_two = pre_max_string.substring(0, 2);
	for (var i = 0; i < length - 2; i++) {
		first_two += '0';
	}
	var max = parseInt(first_two);
	var quoter = Math.floor(max / 4);
	document.getElementById('axis').childNodes[1].innerText = max;
	document.getElementById('axis').childNodes[3].innerText = quoter * 3;
	document.getElementById('axis').childNodes[5].innerText = quoter * 2;
	document.getElementById('axis').childNodes[7].innerText = quoter;

	// Decide height of bar
	for (var i = 0; i < background.days.length; i++) {
		document.getElementById(background.days[i]).style.height = Math.floor(240 * week[i] / max) + 'px';
	}

	// Show dates
	document.getElementById('start').innerText = background.getStart();
	document.getElementById('end').innerText = background.getEnd();
	
	// Show language
	var lang_list = {
		'en': 'English (default)',
		'fr': 'French',
		'es': 'Spanish'
	}
	lang = background.get('lang') ? background.get('lang') : 'en';
	document.getElementById('lang').innerText = lang ? lang_list[lang] : lang_list['en'];

	// On Off
	document.getElementById('on_off_box').style.left = (background.get('on_off') == 'on'? '0' : '-150px');
}

/************ Options ************/
function optionClick (elm) {
	if (optionCheck == 'close') {
		elm.target.classList.add('open');
		showOptions();
		optionCheck = 'open';
	} else {
		elm.target.classList.remove('open');
		hideOptions();
		optionCheck = 'close';
	}
}
function showOptions (elm) {
	count = 0;
	var anim = setInterval(function () {
		count += 10
		document.getElementById('options').style.height = 40 + (160 - 40) * (count / 500) + 'px';
		for (var i = 0; i < sections.length; i++) {
			sections[i].style.top = 40 * (i + 1) * (count /500) + 'px';
		}
		if (count == 500)
			clearInterval(anim);
	}, 1);
}
function hideOptions (elm) {
	count = 500;
	var anim = setInterval(function () {
		count -= 10;
		document.getElementById('options').style.height = 40 + (160 - 40) * (count / 500)  + 'px';
		for (var i = 0; i < sections.length; i++) {
			sections[i].style.top = 40 * (i + 1) * (count / 500) + 'px';
		}
		if (count == 0)
			clearInterval(anim);
	}, 1);
}
/************ Lang  ************/
function langMouseOn (elm) {
	document.getElementById('lang_option').classList.remove('hide');
}
function langMouseOut (elm) {
	document.getElementById('lang_option').classList.add('hide');
}
function langChoiceClick (elm) {
	// Save to localstorage
	var lang = elm.target.id;
	var background = chrome.extension.getBackgroundPage();
	background.save('lang', lang);

	// Edit string at lang
	document.getElementById('lang').innerText = elm.target.innerText;
}

/************ Send email ************/
function sendEmail (elm) {
    var mail = 'mailto:tobecomebig@gmail.com?subject=Chrome Extension Contact';
	var newWin = window.open(mail);
}

/************ On Off ************/
function turnOff (elm) {
	// Move element
	var count = 0;
	var anim = setInterval(function () {
		count += 10;
		document.getElementById('on_off_box').style.left = -150 * (count / 500) + 'px'
		if (count == 500)
			clearInterval(anim);
	}, 1);

	// Save to localstorage
	var background = chrome.extension.getBackgroundPage();
	background.save('on_off', 'off')
}
function turnOn (elm) {
	// Move element
	var count = 0;
	var anim = setInterval(function () {
		count += 10;
		document.getElementById('on_off_box').style.left = -150 + 150 * (count / 500) + 'px';
		if (count == 500)
			clearInterval(anim);
	}, 1);

	// Save to localstorage
	var background = chrome.extension.getBackgroundPage();
	background.save('on_off', 'on')
}

/************ Extension is Loaded ************/
document.addEventListener('DOMContentLoaded', function () {
	/*** Add Events ***/
	/*** Options First ***/
	document.getElementById('first').addEventListener('click', optionClick);
	/*** Options Lang ***/
	document.getElementById('lang').addEventListener('mouseover', langMouseOn);
	document.getElementById('lang').addEventListener('mouseout', langMouseOut);
	document.getElementById('lang_option').addEventListener('mouseover', langMouseOn);
	document.getElementById('lang_option').addEventListener('mouseout', langMouseOut);
     var lang_choices = document.querySelectorAll('.lang_choice');
     for (var i = 0; i < lang_choices.length; i++) {
         lang_choices[i].addEventListener('click', langChoiceClick);
     }
	/*** Options On / Off ***/
	document.getElementById('on').addEventListener('click', turnOff);
	document.getElementById('off').addEventListener('click', turnOn);
	 /*** Options Contact ***/
	document.getElementById('contact').addEventListener('click', sendEmail);
	/*** Views ***/
	views();
});

