// jooExportSVGScaffold.jsx
#target photoshop

main();

function ppos(point) {
	return "" + point[0] + " " + point[1]
}


function handlePath(path) {
	var out = "";
	var pnts = path.pathPoints;

	var ipos = pnts[0].anchor;

	var pos = pnts[0].leftDirection;
	var pos2, pos3;
	out = "M" + ppos(ipos);
	for (var p = 1; p < pnts.length; p++) {
		pos2 = pnts[p].rightDirection;
		pos3 = pnts[p].anchor;
		out += "C" + ppos(pos) + " " + ppos(pos2) + " " + ppos(pos3);
		pos = pnts[p].leftDirection;
	}
	if (path.closed) {
		pos2 = pnts[0].rightDirection;
		pos3 = pnts[0].anchor;
		out += "C" + ppos(pos) + " " + ppos(pos2) + " " + ppos(pos3) + "Z";
	}
	return out;
}

function main() {
	var sel = app.activeDocument.selection;
	var file = File.saveDialog('save svg path', 'SVGPath:*.svg');

	file.open('w');

	file.writeln('<?xml version="1.0" encoding="utf-8"?>');
	file.writeln('<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">');
	file.writeln('<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"');
	file.writeln('width="595.28px" height="841.89px" viewBox="0 0 595.28 841.89" enable-background="new 0 0 595.28 841.89" xml:space="preserve">');


	var doc = app.activeDocument;
	var paths = doc.pathItems;

	for (var i = 0; i < paths.length; i++) {
		var subpaths = paths[i].subPathItems;

		for (var j = 0; j < subpaths.length; j++) {
			data = handlePath(subpaths[j]);
			file.writeln('<path fill="none" stroke="black" d="' + data + '"/>');
		}
	}
	file.writeln('</svg>');
	file.close();
}