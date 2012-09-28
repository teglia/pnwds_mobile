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

    /******** Event listeners with calls to Speaker Info window. **********/
    // TODO: Add event listener to pull up user data screen. 
    userPic.addEventListener('click', function(e){
      // TODO: Add call to speaker page.
    })
    userButton.addEventListener('click',function(e){
      // TODO: Add call to speaker page.
    });
    
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
  	contentWidth:Ti.UI.FILL,
  	contentHeight:Ti.UI.SIZE,
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
  
  var roomTime = Ti.UI.createView({
    layout: 'horizontal',
    top:0,
    left: 0,
    right: 0,
    width: Ti.UI.FILL,
    height: Ti.UI.SIZE
  })
    
  // Create a label for the node title
  var roomLabel = Ti.UI.createLabel({
    // The text of the label will be the node title (data.title)
    text: data.room,
    color:'#333',
    textAlign:'center',
    font:{fontSize:12, fontWeight:'bold'},
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#999',
    height: 44,
    width: '50%'
  });
  
  // Create a label for the node title
  var timeLabel = Ti.UI.createLabel({
    // The text of the label will be the node title (data.title)
    text: startTime + " to " + endTime,
    color:'#333',
    textAlign:'center',
    font:{fontSize:12, fontWeight:'normal'},
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#bbb',
    height: 44,
    width: '50%'
  });
  
  var flagged = data.flagged;
  if (!flagged) {
    flagged = false;
  }
  
  var flagLabel = Ti.UI.createLabel({
    text: "In My Sessions:",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: 44,
    textAlign: 'center',
    width: '50%'
  });
  
  var flag = Ti.UI.createSwitch({
    top: 10,
    left: '10%',
    right: 0,
    bottom: 0,
    height: 44,
    width: '40%',
    textAlign: 'center',
    value: flagged
  })
  
  flag.addEventListener('change',function(e){
    pnwdsdb.sessionsflag(flag.value, data.nid);
    Ti.API.info('Switch value: ' + flag.value);
  });
  
  
	roomTime.add(roomLabel);
	roomTime.add(timeLabel);
	roomTime.add(flagLabel);
	roomTime.add(flag);
	titleLabelView.add(nodeTitle);
	titleLabelView.add(hr);
	titleLabelView.add(roomTime);
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
	html += '    <style>';
	html += '      a:link { text-decoration: none; color: #000; }';
	html += '    </style>';
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
		height: Ti.UI.SIZE,
		top: 0,
		touchEnabled: false
	});

	// Add both nodeTitle and nodeBody labels to our view
	view.add(titleLabelView);
	view.add(hr);
	view.add(nodeBody);
	

  win.add(view);
  


  return win;
}