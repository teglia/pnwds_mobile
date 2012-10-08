exports.newWin = function(navController, uid) {

	var pnwdsdb = require('/includes/db');

  var data = pnwdsdb.usersgetbyuid(uid);
  data = data[0];

  var win = Ti.UI.createWindow({
    backgroundColor : '#eee',
    title: data['username'],
    barImage: '/images/iphone-nav.png',
  });

  var view = Titanium.UI.createView({
    layout : 'vertical',
    top : 0,
    left : 0,
    width : Ti.UI.FILL,
    contentWidth:Ti.UI.FILL,
    contentHeight:Ti.UI.SIZE,
    showVerticalScrollIndicator:true,
    showHorizontalScrollIndicator:false,
    layout: 'vertical'
  });

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
	
  function makeHR() {
    var hr = Ti.UI.createLabel({
      height : 1,
      width : Ti.UI.FILL,
      backgroundColor : '#0062A0'
    });
    return hr
  }
	
	function formatSessionRow(_session) {
	  var spacerView = Ti.UI.createView({
	    top: 8,
	    bottom: 8,
	    left: 8,
	    right: 8,
	    layout: 'horizontal',
      height: Ti.UI.SIZE,
      width: Ti.UI.FILL,
	  });
		
		var titleLabelView = Ti.UI.createView({
			left : 0,
			right : 0,
			layout : 'horizontal',
			width : Ti.UI.FILL,
			height : Ti.UI.SIZE
		});

    var iconView = Ti.UI.createView({
      backgroundColor: "#005198",
      height: 35,
      width: 37,
      left: 0,
      borderRadius: 3
    });
    
    iconView.setBackgroundGradient({ 
      type: 'linear', 
      colors: [{ color: '#006cca', position: 0.0 }, { color: '#005198', position: 1.0 }] ,
      startPoint: { x: 0, y: 0 },
      endPoint: { x: 0, y: 23 },
      backFillStart: false
    });
    
    var icon = Ti.UI.createImageView({
      left: 8,
      top: 6,
      image: '/images/dashboard/icon-sessions.png'
    });
    
    iconView.add(icon);
    
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
			left : 10,
			height : Ti.UI.SIZE,
			width : Ti.UI.FILL
		});

		spacerView.add(iconView);
		spacerView.add(nodeTitle);
		titleLabelView.add(spacerView);
		//titleLabelView.add(roomTime);
		titleLabelView.add(makeHR());
		titleLabelView.addEventListener('click', function() {
			newWin = require('/includes/get-node-by-nid').newWin;
			navController.open(new newWin(navController, _session.nid));
		})
		return titleLabelView;
	}

	//get either the local path or the remote path and load the image for next time
	var getRemoteFile = require('/lib/imagecache').imageCache;
	var imageSrc = getRemoteFile(data.imageName, data.imageUrl);

	var picture = Ti.UI.createImageView({
		image : imageSrc,
		preventDefaultImage : true,
		height : 88,
		width : 88,
		left : 0,
		top: 0,
		bottom: 0
	})

	//speakerView.add(userButton);
	var fullNameLabel = Ti.UI.createLabel({
		text : data['firstname'] + " " + data['lastname'],
		color : '#0062A0',
		font : {
			fontSize : 18,
			fontWeight : 'bold'
		},
		width : Ti.UI.FILL,
		height: Ti.UI.SIZE,
		left : 0,
	});

	var userNameLabel = Ti.UI.createLabel({
		text : data['username'],
		color : '#999',
		font : {
			fontSize : 14,
			fontWeight : 'normal'
		},
		width : Ti.UI.FILL,
		height: Ti.UI.SIZE,
		left : 0,
	});

	var companyNameLabel = Ti.UI.createLabel({
		text : 'Company: ' + data['company'],
		color : '#999',
		font : {
			fontSize : 14,
			fontWeight : 'normal'
		},
		width : Ti.UI.FILL,
		height: Ti.UI.SIZE,
		top : 8,
		left : 0,
	});

	var TextWrapper = Ti.UI.createView({
		layout : 'vertical',
		textAlign : 'left',
		height : Ti.UI.SIZE,
		width: Ti.UI.FILL,
		left : 10,
	})

	var speakerView = Ti.UI.createView({
		layout :'horizontal',
		top : 0,
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

	var linkView = Ti.UI.createView({
		layout : 'horizontal',
		width : Ti.UI.SIZE,
		height : Ti.UI.SIZE,
		backgroundColor : '#eee',
		right:0,
		bottom: 5,
	})

	if (data['twitter']) {
		var twitterButton = Ti.UI.createButton({
			title : 'Twitter',
			color : '#0062A0',
			font : {
				fontSize : 12,
				fontWeight : 'bold'
			},
			width : 60,
			height : 25,
			top : 5,
			right : 8,

		});
		twitterButton.addEventListener('click', function() {
			newWin = require('/includes/get-webview').newWin;
			navController.open(new newWin(navController, data['twitter']));
		})
		linkView.add(twitterButton);
	}
	if (data['linkedin']) {
		var linkedinButton = Ti.UI.createButton({
			title : 'Linkedin',
			color : '#0062A0',
			font : {
				fontSize : 12,
				fontWeight : 'bold'
			},
			width : 60,
			height : 25,
			top : 5,
			right : 8,
		});
		linkedinButton.addEventListener('click', function() {
			newWin = require('/includes/get-webview').newWin;
			navController.open(new newWin(navController, data['linkedin']));
		})
		linkView.add(linkedinButton);
	}
	if (data['website']) {
		var websiteButton = Ti.UI.createButton({
			title : 'website',
			color : '#0062A0',
			font : {
				fontSize : 12,
				fontWeight : 'bold'
			},
			width : 60,
			height : 25,
			top : 5,
			right : 8,
		});
		websiteButton.addEventListener('click', function() {
			newWin = require('/includes/get-webview').newWin;
			navController.open(new newWin(navController, data['website']));
		})
		linkView.add(websiteButton);
	}

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


	view.add(speakerView);
	
	if (data['twitter'] || data['linkedin'] || data['website']) {
		view.add(linkView);
	}
	view.add(makeHR());
	var sessions = pnwdsdb.sessionsgetbyuser(data['uid']);
	for (var i = sessions.length - 1; i >= 0; i--) {
		view.add(formatSessionRow(sessions[i]));
	};

	view.add(nodeBody);

	win.add(view);

	return win;
}