/*
 * browserFlags.js
 *
 *	Processes parameters and flags that control the display
 *
 */
var counterShader = 0;
var urlSearch = window.location.search.substring(1,window.location.search.length);
var nvPairs = urlSearch.split('&');
var tf = {'1':true, 'true':true, 'TRUE':true, '0':false, 'false':false, 'FALSE':false};
var flags = {
			DEBUG :		0,
			DESKTOP :	0,
			VIEW :		'Viewer',
			X3D :		1
			};
for (ii=0; ii<nvPairs.length; ii++) {
	nv = nvPairs[ii].split('=');
	flags[nv[0].toUpperCase()] = nv[1];
}
flags.showStats	= tf[flags.DEBUG];
flags.showLog	= tf[flags.DEBUG];
flags.DESKTOP	= tf[flags.DESKTOP];
flags.X3D		= tf[flags.X3D];

if (flags.DESKTOP) {
	//alert ('Loading jQuery-ui');
	document.writeln ('<scri' + 'pt src="lib/jquery-ui-1.11.4/jquery-ui.js"></scr' + 'ipt>');
	document.writeln ('<link rel="stylesheet" type="text/css" href="lib/jquery-ui-1.11.4/jquery-ui.css">');
}
