var 
	currentYear = 2001, 
	pickedYear = 2001, 
	fl = false,
	clicks = [];

// Browser Check Variables
var 
	isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0,
	isFirefox = typeof InstallTrigger !== 'undefined',
	isSafari = /constructor/i.test(window.HTMLElement) || (function (p) {return p.toString() === "[object SafariRemoteNotification]";})(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification)),
	isIE = /*@cc_on!@*/false || !!document.documentMode,
	isEdge = !isIE && !!window.StyleMedia,
	isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime),
	isBlink = (isChrome || isOpera) && !!window.CSS

var ship = {
	direction: 0,
	path: {
		2001: '175,275',
		2002: '175,275 244,265 290,263 300,264',
		2003: '300,264 342,270 401,278 425,280',
		2004: '425,280  452,275 470,271  485,265 517,245 550,220',
		2005: '550,220 582,196 614,176 654,155 675,150',
		2006: '675,150 705,147 729,145 751,146 764,148 787,153 822,164',
		2007: '822,164 856,173 888,176 900,175 945,165',
		2008: '945,165 959,157 979,145 1006,120 1008,118  1015,111 1039,85 1050,70',
	},

	run: function(el) {
		if (!isFirefox) {
				$('#ship').attr('x', '0').attr('y', '0');
		}
		clicks.push(el.attr('data-year'));
		if (fl == false) this.swim(clicks.shift());
	},
	swim: function(el) {
		var pickedYear = el;
		fl = true;

		var duration = $('#svg animateMotion').attr('dur').replace('s', '') * 1000;

		$('circle').removeClass('current');
		$('circle[data-year="' + el + '"]').addClass('current');

		$('.information.block').removeClass('active');
		$('.information.block[data-year="' + pickedYear + '"]').addClass('active');

		this.direction = (pickedYear < currentYear) ? -1 : 1;

		var i = parseInt(currentYear) + 1;
		if (pickedYear != currentYear) go();

		if (Math.abs(pickedYear - currentYear) > 1) {
			var timer = setInterval(() => {
				go();
			}, duration);
		}

		// счетчик окончания всей анимации одной выборки
		setTimeout(() => {
			fl = false;
			currentYear = pickedYear;
			if (clicks.length > 0) {
				this.swim(clicks.shift());
			}
		}, Math.abs(pickedYear - currentYear) * duration);

		function go() {
			if (ship.direction == -1) {
				var reverse = ship.path[(i - 1)].split(' ').reverse().join(' ');
				var dVal = 'M ' + reverse;
				if (i == (parseInt(pickedYear) + 2)) clearInterval(timer)
				else i--;
			} 
			else {
				var dVal = 'M ' + ship.path[i];
				if (i == parseInt(pickedYear)) clearInterval(timer)
				else i++;
			}

			$('#shipPath').attr('d', dVal);
			document.getElementById("animate").beginElement();
		}
	}
}


$(document).ready(function() {
	if (isSafari || isFirefox || isIE) {
		$('#ship').attr('x','175').attr('y','275');
	}

	$('.year-selector__select').select2({
		minimumResultsForSearch: Infinity,
		dropdownCssClass: 'dropdown',
		containerCssClass: 'my-custom-select',
	});

	$('circle:first-of-type').addClass('current');
	$('.information.block[data-year="2001"]').addClass('active');
})

$('circle').on('click', function() {
	ship.run($(this));
})

$('.year-selector__select').on('change', function() {
	var value = $(this).find(':selected');
	ship.run(value);
})