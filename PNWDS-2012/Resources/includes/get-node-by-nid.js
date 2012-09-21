exports.newWin = function(navController, nid) {
  
  var pnwdsdb = require('/includes/db');
  // Define the variable win to contain the current window
  
  var win = Ti.UI.createWindow({
    backgroundColor: '#fff'
  });

  var data = pnwdsdb.sessionsget(nid);
  
  data = data[0];

  // var user = {
  	// uid: Titanium.App.Properties.getInt("userUid", 0),
  // }

  // Create the scrollview
  var view = Titanium.UI.createScrollView({
  	contentWidth:'auto',
  	contentHeight:'auto',
  	showVerticalScrollIndicator:true,
  	showHorizontalScrollIndicator:true,
  	top: 0,
  });
  
  // Add our scrollview to the window

  
  // Define the url which contains the full url
  // See how we build the url using the win.nid which is 
  // the nid property we pass to this file when we create the window
  
	// ensure that the window title is set
	win.title = data.title;
	
	// Create a label for the node title
	var nodeTitle = Ti.UI.createLabel({
		// The text of the label will be the node title (data.title)
		text: data.title,
		color:'#000',
		textAlign:'left',
		font:{fontSize:16, fontWeight:'bold'},
		top:10,
		height:18,
		left: 10,
		right: 10
	});
	var html = '<html>'; 
	html += '  <head>';
	html += '    <title>' + data.title + '</title>';
	html += '    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">';
	html += '  </head>';
	html += '  <body>';
	html += '    <div style="font: normal normal normal 14px/1.25 arial;">' + data.body + '</div>';
	html += '  </body>';
	html += '</html>';
	
	// Create a label for the node body
	var nodeBody = Titanium.UI.createWebView({
		// Because D7 uses an object for the body itself including the language
		html: html,
		height: Ti.UI.FILL,
		width: Ti.UI.FILL
	});
  Ti.API.info("This is data:");
  Ti.API.info(nodeBody.html);

	// Add both nodeTitle and nodeBody labels to our view
	view.add(nodeTitle);
	view.add(nodeBody);
	

  win.add(view);
  


  return win;
}