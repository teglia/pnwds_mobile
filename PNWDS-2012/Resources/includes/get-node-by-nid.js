exports.newWin = function(navController, nid) {
  
  var pnwdsdb = require('/includes/db');

  var _timeConverter = function (UNIX_timestamp, day1){
    var a = new Date(UNIX_timestamp*1000);
    var localDate = a.toLocaleTimeString();
    var date = a.getDate();
    var day = '';

    if (day1) {
      day = 'Day 1 - ';
      if (date == 21) { day = 'Day 2 - '; }
    }
    
    var time = day + localDate;
    return time; 
  }
  
  var _formatSpeakerRow = function(user) {
    var speakerView = Ti.UI.createView({
      top:1,
      left: 0,
      right: 0,
      layout: 'horizontal',
      width: Ti.UI.FILL,
      height: 44,
      backgroundColor: '#eee'
    });
    // TODO: Load images.
    var userPic = Ti.UI.createLabel({
      width: 44,
      height: 44,
      top: 0,
      left: 0,
      backgroundColor: "#ccc"
    });
   
    var userButton = Ti.UI.createLabel({
      text: user.firstname + " " + user.lastname,
      top: 10,
      left: 10,
      height: Ti.UI.SIZE,
      width: Ti.UI.FILL
    });
    
    // TODO: Add event listener to pull up user data screen. 
    speakerView.add(userPic);
    speakerView.add(userButton);
    return speakerView;
  }
  
  var win = Ti.UI.createWindow({
    backgroundColor: '#fff'
  });

  var data = pnwdsdb.sessionsget(nid);
  data = data[0];
  Ti.API.info(data);

  var hr = Ti.UI.createLabel({
    height: 1,
    width: Ti.UI.FILL,
    backgroundColor: '#0062A0'
  });
  
  // Create the scrollview
  var view = Titanium.UI.createScrollView({
  	contentWidth:'auto',
  	contentHeight:'auto',
  	showVerticalScrollIndicator:true,
  	showHorizontalScrollIndicator:false,
  	layout: 'vertical',
  	top: 0,
  });

	var titleLabelView = Ti.UI.createView({
	  top:0,
    left: 0,
    right: 0,
    layout: 'vertical',
    width: Ti.UI.FILL,
    height: Ti.UI.SIZE
	});
	
  // Create a label for the node title
  var nodeTitle = Ti.UI.createLabel({
    // The text of the label will be the node title (data.title)
    text: data.title,
    color:'#0062A0',
    textAlign:'left',
    font:{fontSize:16, fontWeight:'bold'},
    top: 6,
    left: 10,
    right: 10,
    bottom: 6,
    height: Ti.UI.SIZE,
    width: Ti.UI.FILL
  });
  

  var time = data.timeslot;
  var times = time.split(" to ");
  var startTime = _timeConverter(times[0], true);
  var endTime = _timeConverter(times[1], false);
    
  // Create a label for the node title
  var roomTitle = Ti.UI.createLabel({
    // The text of the label will be the node title (data.title)
    text: data.room + " (" + startTime + " to " + endTime + ")",
    color:'#333',
    textAlign:'left',
    font:{fontSize:12, fontWeight:'normal'},
    top: 2,
    left: 10,
    right: 10,
    bottom: 6,
    height: Ti.UI.SIZE,
    width: Ti.UI.FILL
  });
  
	
	titleLabelView.add(nodeTitle);
	titleLabelView.add(hr);
	titleLabelView.add(roomTitle);
  titleLabelView.add(hr);
	
  var speakers = data.speakers;
  if (speakers) {
    titleLabelView.add(hr);
    if(speakers.indexOf(',') !== -1) {
      speakers = speakers.split(', ')
      for(var loopKey in speakers) { 
        var user = pnwdsdb.usersget(speakers[loopKey]);
        user = user[0];
        speakerView = _formatSpeakerRow(user);
        titleLabelView.add(speakerView);
      }
    } 
    else {
      var user = pnwdsdb.usersget(speakers);
      user = user[0];
      speakerView = _formatSpeakerRow(user);
      titleLabelView.add(speakerView);
    }
  }    
  
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
		width: Ti.UI.FILL,
		height: Ti.UI.FILL
	});
	
	

	// Add both nodeTitle and nodeBody labels to our view
	view.add(titleLabelView);
	view.add(hr);
	
	view.add(nodeBody);
	

  win.add(view);
  


  return win;
}