exports.newWin = function(navController, nid) {
  
  var pnwdsdb = require('/includes/db');
  // Define the variable win to contain the current window
  
  var win = Ti.UI.createWindow({
    backgroundColor: '#fff'
  });
  // var seeded = pnwdsnet.seedsessions(navController);
  // Create a user variable to hold some information about the user
  
  var data = pnwdsdb.sessionsget(nid);
  
  Ti.API.info(data[0]);
  data = data[0];
  
  var user = {
  	uid: Titanium.App.Properties.getInt("userUid", 0),
  }
  
  // Create the scrollview
  var view = Titanium.UI.createScrollView({
  	contentWidth:'auto',
  	contentHeight:'auto',
  	showVerticalScrollIndicator:true,
  	showHorizontalScrollIndicator:true,
  	top: 0,
  });
  
  // Add our scrollview to the window
  win.add(view);
  
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
  		
  		// Create a label for the node body
  		var nodeBody = Titanium.UI.createWebView({
  			// Because D7 uses an object for the body itself including the language
  			html: '<div style="font: normal normal normal 14px/1.25 arial;">' + data.body + '</div>',
  			height: "auto",
  			top: 30,
  			left: 10,
  			right: 10,
  		});
  		
  		// Add both nodeTitle and nodeBody labels to our view
  		view.add(nodeTitle);
  		view.add(nodeBody);
  				
  	
  return win;
}