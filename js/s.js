var shipPaths = {
	2001: '175,275',
	2002: '175,275 244,265 290,263 300,264',
	2003: '300,264 342,270 401,278 425,280',
	2004: '425,280 452,275 470,271 485,265 517,245 550,220',
	2005: '550,220 582,196 614,176 654,155 675,150',
	2006: '675,150 705,147 729,145 751,146 764,148 787,153 822,164',
	2007: '822,164 856,173 888,176 900,175 945,165',
	2008: '945,165 959,157 979,145 1006,120 1008,118 1015,111 1039,85 1050,65',
}

var circles = [
	{x: 175, y: 265, year: '2001'},
	{x: 300, y: 264, year: '2002'},
	{x: 425, y: 275, year: '2003'},
	{x: 550, y: 210, year: '2004'},
	{x: 675, y: 145, year: '2005'},
	{x: 822, y: 164, year: '2006'},
	{x: 945, y: 155, year: '2007'},
	{x: 1050, y: 55, year: '2008'},
]

var 
	stageWidth = $(document).width() - 19,
	stageHeight = stageWidth / 3.51,
	wK = stageWidth / 1305,
	hK = stageHeight / 372,
	currentYear = 2001,
	pickedYear = 2001,
	clicks = [],
	data = [],
	fl = false,
	shipPath,
	layer,
	lastPt;


$(document).ready(function() {
	$('.year-selector__select').select2({
		minimumResultsForSearch: Infinity,
		dropdownCssClass: 'dropdown',
		containerCssClass: 'my-custom-select',
	});

	$('.information.block[data-year="2001"]').addClass('active');

	go(2002,2001);

	var circle = stage.find('Circle');
	circle.on('click', function (e) {
		var pickedYear = parseInt(e.target.name().replace('circle', ''));
		if (currentYear != pickedYear) {
			circle.fill('#49a2c7');
			e.target.fill('#eb4f47');
			clicks.push(pickedYear);
			if (!anim.isRunning()) go(currentYear, clicks.shift());
			$('.information.block').removeClass('active');
			$('.information.block[data-year="' + pickedYear + '"]').addClass('active');
		}
	});

	$('.year-selector__select').on('change', function () {
		var value = $(this).find(':selected').val();
		stage.find('.circle' + value).fire('click');
	})
})


function go(first, second) {
	createShipPath(first, second);
	if (!fl) initCanvas();
	calcPathPoints();
	animate();
	currentYear = second;
	fl = true;

	stage.find('Rect').hide();
	stage.find('Text').fill('black');
	stage.find('.rect' + second).show().fill('#eb4f47');
	stage.find('.text' + second).fill('white');
	layer.draw();
}

function calcPathPoints() {
	path = new Konva.Path({
		x: -10,
		y: -10,
	});
	var p = "M" + data[0].x + " " + data[0].y;
	for (var i = 1; i < data.length; i = i + 1) {
		p = p + " L" + data[i].x + " " + data[i].y;
	}
	path.setData(p);
}

function initCanvas() {
	stage = new Konva.Stage({
		container: 'canvas',
		width: stageWidth,
		height: stageHeight
	});

	layer = new Konva.Layer({
		draggable: false
	});
	stage.add(layer);

	var pathImage = new Image();
	pathImage.src = './assets/path.svg';

	var pathBg = new Konva.Image({
		x: 0,
		y: -15,
		image: pathImage,
		width: stage.width(),
		height: stage.width() / 3.51
	});

	layer.add(pathBg);

	for (i = 0; i < circles.length; i++) {
		var theCircle = new Konva.Circle({
			x: Math.floor(circles[i].x * wK) + 10 * wK,
			y: Math.floor(circles[i].y * hK) - 5 * hK,
			radius: 10,
			fill: '#49a2c7',
			name: 'circle' + circles[i].year
		});
		layer.add(theCircle);
		
		var rect = new Konva.Rect({
			x: Math.floor(circles[i].x * wK) - 10 * wK,
			y: Math.floor(circles[i].y * hK) + 10 * hK,
			width: 50,
			height: 20,
			fill: '#eb4f47',
			strokeWidth: 4,
			cornerRadius: 4,
			name: 'rect' + circles[i].year
		});
		
		var simpleText = new Konva.Text({
			x: Math.floor(circles[i].x * wK) - 2 * wK,
			y: Math.floor(circles[i].y * hK) + 12 * hK,
			text: circles[i].year,
			fontSize: 16,
			fontFamily: 'Calibri',
			fill: 'black',
			name: 'text' + circles[i].year
		});

		if (currentYear == circles[i].year) {
			simpleText.fill('white');
		}
		layer.add(rect);
		layer.add(simpleText);
		rect.hide();
	}

	var imageObj = new Image();
	imageObj.src = './assets/ship.png';

	ship = new Konva.Image({
		x: data[0].x,
		y: data[0].y - 50,
		image: imageObj,
		width: 75,
		height: 50
	});

	layer.add(ship);
}

function createShipPath(a, b) {
	shipPath = [];
	data = [];

	if (a == b || b == undefined) {
		var arr = shipPaths[a].split(' ');
		arr = [arr[arr.length-1]];
	} else {
		if (a <= b) {
			var direction = 1;
			var less = a,
				more = b;
		} else {
			direction = -1;
			var less = b,
				more = a;
		}

		for (var i = less + 1; i <= more; i++) {
			if (direction == -1) {
				shipPath.push(shipPaths[i].split(' ').reverse().join(' '));
			} else shipPath.push(shipPaths[i]);
		}
		if (direction == -1) {
			shipPath = shipPath.reverse().join(' ');
		} else shipPath = shipPath.join(' ');

		var arr = shipPath.split(' ');
	}
	for (var i = 0; i < arr.length; i++) {
		var el = arr[i].split(',');
		data.push({
			x: Math.floor(el[0] * wK) + 10 * wK,
			y: Math.floor(el[1] * hK) - 5 * hK,
		})
	}
}

function animate() {
	var steps = data.length * 5;
	var pathLen = path.getLength();
	var step = pathLen / steps;
	var frameCnt = 0,
			pos = 0,
			pt;

	anim = new Konva.Animation(function (frame) {
		pos = pos + 1;
		pt = path.getPointAtLength(pos * step);
		ship.position({
			x: pt.x - 35,
			y: pt.y - 55
		});
		if (pos!=1 &&  pt.x == lastPt.x) { 
			anim.stop();
			if (clicks.length) {
				go(currentYear, clicks.shift());
			}
		}
		lastPt = pt;
	}, layer);

	anim.start();
}