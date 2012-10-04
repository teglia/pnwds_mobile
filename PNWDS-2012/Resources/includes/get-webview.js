exports.newWin = function(navController, _url) {
var win = Ti.UI.createWindow({
		backgroundColor : '#fff'
	});
	var view = Titanium.UI.createWebView({
		// Because D7 uses an object for the body itself including the language
		url : _url,
		width : Ti.UI.FILL,
		height : Ti.UI.FILL,
	});
	
	win.add(view);

	return win;
}