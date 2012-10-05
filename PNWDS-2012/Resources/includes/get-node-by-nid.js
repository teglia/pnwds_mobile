exports.newWin = function(navController, nid) {
  
  var pnwdsdb = require('/includes/db');
  
  var data = pnwdsdb.sessionsget(nid);
  data = data[0];
  
  var win = Ti.UI.createWindow({
    backgroundColor: '#fff'
  });

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
    
    var imageUrl = user.photo;

    //get the name of the image to check if it saved locally
    var imageName = imageUrl.split('/');
    imageName = imageName[imageName.length-1];

    //get either the local path or the remote path and load the image for next time
    var getRemoteFile = require('/lib/imagecache').imageCache;
    var imageSrc = getRemoteFile(imageName, imageUrl);
    Ti.API.info("ImageName: " + imageName + " and imageUrl: " + imageUrl);
    var userPic = Ti.UI.createImageView({
      backgroundImage : imageSrc,
      preventDefaultImage:true,
      backgroundColor: '#ddd',
      height : 44,
      width : 44,
      borderRadius: 0,
      left : 0,
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
    userPic.addEventListener('click', function(){
      newWin = require('/includes/get-speaker-by-uid').newWin;
      navController.open(new newWin(navController, user.uid));
      // TODO: Add call to speaker page.
    })
    userButton.addEventListener('click',function(){
      // TODO: Add call to speaker page.
      newWin = require('/includes/get-speaker-by-uid').newWin;
      navController.open(new newWin(navController, user.uid));
    });
    
    speakerView.add(userPic);
    speakerView.add(userButton);
    return speakerView;
  }

	var titleLabelView = Ti.UI.createView({
	  top:0,
    left: 0,
    right: 0,
    layout: 'vertical',
    width: Ti.UI.FILL,
    height: Ti.UI.SIZE,
    backgroundColor : '#eee',
    backgroundImage: '/images/tasky_pattern.png',
    backgroundRepeat: true
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
    layout: 'vertical',
    left: 0,
    width: Ti.UI.FILL,
    height: Ti.UI.SIZE
  })
    
  // Create a label for the node title
  var roomLabel = Ti.UI.createLabel({
    // The text of the label will be the node title (data.title)
    text: data.room,
    color:'#bbb',
    textAlign:'left',
    left: 10,
    width: Ti.UI.FILL,
    font:{fontSize:12, fontWeight:'bold'},
  });
  
  // Create a label for the node title
  var timeLabel = Ti.UI.createLabel({
    // The text of the label will be the node title (data.title)
    text: startTime + " to " + endTime,
    color:'#aaa',
    textAlign:'left',
    width: Ti.UI.FILL,
    left: 10,
    bottom: 10,
    font:{fontSize:12, fontWeight:'normal'}
  });
  
  var flagged = data.flagged;
  if (!flagged) {
    flagged = false;
  }
  
  var flagView = Ti.UI.createView({
    layout : 'horizontal',
    width : Ti.UI.FILL,
    height : 44,
    top: 0,
    left: 0,
    backgroundColor : '#eee',
    backgroundImage: '/images/subtle_dots.png',
    backgroundRepeat: true
  });
    
  var flagLabel = Ti.UI.createLabel({
    text: "In My Sessions:",
    height: 44,
    textAlign: 'center',
    width: '50%'
  });
  
  var flag = Ti.UI.createSwitch({
    height: 44,
    width: '50%',
    textAlign: 'center',
    value: flagged
  });
  
  flagView.add(flagLabel);
  flagView.add(flag);
  
  flag.addEventListener('change',function(e){
    pnwdsdb.sessionsflag(flag.value, data.nid);
    Ti.API.info('Switch value: ' + flag.value);
  });
  
	titleLabelView.add(nodeTitle);
  titleLabelView.add(hr);
	  
  titleLabelView.add(roomLabel);
  titleLabelView.add(timeLabel);
  
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
  titleLabelView.add(hr);
  titleLabelView.add(flagView);
  titleLabelView.add(hr);
  
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