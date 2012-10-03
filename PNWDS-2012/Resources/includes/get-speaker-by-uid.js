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
	var win = Ti.UI.createWindow({
		backgroundColor : '#fff'
	});

	var data = pnwdsdb.usersgetbyuid(uid);
	data = data[0];
	Ti.API.info(data);

	//get either the local path or the remote path and load the image for next time
	var getRemoteFile = require('/lib/imagecache').imageCache;
	var imageSrc = getRemoteFile(data.imageName, data.imageUrl);

	var picture = Ti.UI.createImageView({
		image : imageSrc,
		preventDefaultImage:true,
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
		text : 'Company: '+data['company'],
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
		left: 140,
	})
	
	
	var speakerView = Ti.UI.createView({
		top : 1,
		left : 0,
		width : Ti.UI.FILL,
		height : Ti.UI.SIZE,
		backgroundColor : '#eee'
	});
	
	
	speakerView.add(picture);
	TextWrapper.add(fullNameLabel);
	TextWrapper.add(userNameLabel);
	if(data['company']){
			TextWrapper.add(companyNameLabel);
		}
	speakerView.add(TextWrapper)
	
	var hr = Ti.UI.createLabel({
		height : 1,
		width : Ti.UI.FILL,
		backgroundColor : '#0062A0'
	});

	// Create the scrollview
	var view = Titanium.UI.createView({
		layout : 'vertical',
		top : 0,
		left: 0,
		width : Ti.UI.SIZE,
	});

	var html = '<html>';
	html += '  <head>';
	html += '    <title>Bio</title>';
	html += '    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">';
	html += '    <style>';
	html += '      a:link { text-decoration: none; color: #000; }';
	html += '    </style>';
	html += '  </head>';
	html += '  <body>';
	html += '    <div style="font: normal normal normal 14px/1.25 Helvetica;">' + data['bio'] + '</div>';
	html += '  </body>';
	html += '</html>';

	// Create a label for the node body
	var nodeBody = Titanium.UI.createWebView({
		// Because D7 uses an object for the body itself including the language
		html : html,
		width : Ti.UI.FILL,
		height : Ti.UI.SIZE,
		top : 0,
		right: 40,
		touchEnabled : false
	});

	// Add both nodeTitle and nodeBody labels to our view
	//view.add(titleLabelView);

	view.add(speakerView);
	view.add(hr);
	view.add(nodeBody);

	win.add(view);

	return win;
}