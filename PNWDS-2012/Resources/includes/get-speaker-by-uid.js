exports.newWin = function(navController, uid) {

	var pnwdsdb = require('/includes/db');

	var _timeConverter = function(UNIX_timestamp, day1) {
		var a = new Date(UNIX_timestamp * 1000);
		var localDate = a.toLocaleTimeString();
		var date = a.getDate();
		var day = '';

		if (day1) {
			day = 'Day 1 - ';
			if (date == 21) {
				day = 'Day 2 - ';
			}
		}

		var time = day + localDate;
		return time;
	}
	
	function formatSessionRow(_session) {
		var titleLabelView = Ti.UI.createView({
			top : 0,
			left : 0,
			right : 0,
			layout : 'vertical',
			width : Ti.UI.FILL,
			height : Ti.UI.SIZE
		});

		// Create a label for the node title
		var nodeTitle = Ti.UI.createLabel({
			// The text of the label will be the node title (data.title)
			text : _session.title,
			color : '#0062A0',
			textAlign : 'left',
			font : {
				fontSize : 16,
				fontWeight : 'bold'
			},
			top : 6,
			left : 10,
			right : 10,
			bottom : 6,
			height : Ti.UI.SIZE,
			width : Ti.UI.FILL
		});

		var time = _session.timeslot;
		var times = time.split(" to ");
		var startTime = _timeConverter(times[0], true);
		var endTime = _timeConverter(times[1], false);

		var roomTime = Ti.UI.createView({
			layout : 'horizontal',
			top : 0,
			left : 0,
			right : 0,
			width : Ti.UI.FILL,
			height : Ti.UI.SIZE
		})

		// Create a label for the node title
		var roomLabel = Ti.UI.createLabel({
			// The text of the label will be the node title (data.title)
			text : _session.room,
			color : '#333',
			textAlign : 'center',
			font : {
				fontSize : 12,
				fontWeight : 'bold'
			},
			top : 0,
			left : 0,
			right : 0,
			bottom : 0,
			backgroundColor : '#999',
			height : 44,
			width : '50%'
		});

		// Create a label for the node title
		var timeLabel = Ti.UI.createLabel({
			// The text of the label will be the node title (data.title)
			text : startTime + " to " + endTime,
			color : '#333',
			textAlign : 'center',
			font : {
				fontSize : 12,
				fontWeight : 'normal'
			},
			top : 0,
			left : 0,
			right : 0,
			bottom : 0,
			backgroundColor : '#bbb',
			height : 44,
			width : '50%'
		});
		roomTime.add(roomLabel);
		roomTime.add(timeLabel);
		titleLabelView.add(nodeTitle);
		titleLabelView.add(roomTime);
		titleLabelView.add(makeHR());
		titleLabelView.addEventListener('click', function(){
      newWin = require('/includes/get-node-by-nid').newWin;
      navController.open(new newWin(navController, _session.nid));
      // TODO: Add call to speaker page.
    })
		return titleLabelView;
	}
	
	function makeHR(){
			var hr = Ti.UI.createLabel({
		height : 1,
		width : Ti.UI.FILL,
		backgroundColor : '#0062A0'
	});
	return hr
	}
	
	var win = Ti.UI.createWindow({
		backgroundColor : '#fff'
	});

var view = Titanium.UI.createView({
		layout : 'vertical',
		top : 0,
		left : 0,
		width : Ti.UI.SIZE,
	});

	var data = pnwdsdb.usersgetbyuid(uid);
	data = data[0];
	Ti.API.info(data);

	//get either the local path or the remote path and load the image for next time
	var getRemoteFile = require('/lib/imagecache').imageCache;
	var imageSrc = getRemoteFile(data.imageName, data.imageUrl);

	var picture = Ti.UI.createImageView({
		image : imageSrc,
		preventDefaultImage : true,
		height : Ti.UI.SIZE,
		width : Ti.UI.SIZE,
		left : 0,
	})

	//speakerView.add(userButton);
	var fullNameLabel = Ti.UI.createLabel({
		text : data['firstname'] + " " + data['lastname'],
		color : '#0062A0',
		font : {
			fontSize : 18,
			fontWeight : 'bold'
		},
		width : Ti.UI.SIZE,
		top : 0,
		left : 0,
	});

	var userNameLabel = Ti.UI.createLabel({
		text : data['username'],
		color : '#999',
		font : {
			fontSize : 14,
			fontWeight : 'normal'
		},
		width : Ti.UI.SIZE,
		top : 0,
		left : 0,
	});

	var companyNameLabel = Ti.UI.createLabel({
		text : 'Company: ' + data['company'],
		color : '#999',
		font : {
			fontSize : 14,
			fontWeight : 'normal'
		},
		width : Ti.UI.SIZE,
		top : 5,
		left : 0,
	});

	var TextWrapper = Ti.UI.createView({
		layout : 'vertical',
		textAlign : 'left',
		height : Ti.UI.SIZE,
		left : 110,
	})

	var speakerView = Ti.UI.createView({
		top : 1,
		left : 0,
		width : Ti.UI.FILL,
		height : Ti.UI.SIZE,
		backgroundColor : '#eee',
		backgroundImage: '/images/tasky_pattern.png',
		backgroundRepeat: true
	});

	speakerView.add(picture);
	TextWrapper.add(fullNameLabel);
	TextWrapper.add(userNameLabel);
	if (data['company']) {
		TextWrapper.add(companyNameLabel);
	}

	speakerView.add(TextWrapper)

	var html = '<html>';
	html += '  <head>';
	html += '    <title>Bio</title>';
	html += '    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">';
	html += '    <style>';
	html += '      a:link { text-decoration: none; color: #0062A0; font-family: Helvetica, sans-serif; font-weight: bold; }';
	html += '    </style>';
	html += '  </head>';
	html += '  <body>';
	html += '    <div style="font: normal normal normal 14px/1.25 Helvetica;">' + data['bio'] + '</div>';
	if (data['twitter']) {
		html += '    <div">' + data['twitter'] + '</div>';
	}
	if (data['linkedin']) {
		html += '    <div>' + data['linkedin'] + '</div>';
	}
	if (data['website']) {
		html += '    <div>' + data['website'] + '</div>';
	}
	html += '  </body>';
	html += '</html>';

	// Create a label for the node body
	var nodeBody = Titanium.UI.createWebView({
		// Because D7 uses an object for the body itself including the language
		html : html,
		width : Ti.UI.FILL,
		height : Ti.UI.FILL,
	});

	// Add both nodeTitle and nodeBody labels to our view
	//view.add(titleLabelView);

	

	view.add(speakerView);
	view.add(makeHR());
	var sessions = pnwdsdb.sessionsgetbyuser(data['uid']);
	Ti.API.info(sessions);
	// Create the scrollview
	for (var i = sessions.length - 1; i >= 0; i--) {
		view.add(formatSessionRow(sessions[i]));
	};

	view.add(nodeBody);

	win.add(view);

	return win;
}