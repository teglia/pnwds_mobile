var pnwdstables = {};
var pnwdsdb = require('/includes/db');

/**
 * Set the date variables to be same, the result of having updated the app.
 *
 */
pnwdstables.updateTables = function(navController) {
	// Update all the tables
	navController.windowStack[0].fullScheduleTable.setData(pnwdstables.fullScheduleData());
	navController.windowStack[0].myScheduleTable.setData(pnwdstables.myScheduleData());
	navController.windowStack[0].upcomingScheduleTable.setData(pnwdstables.upcomingScheduleData());

	navController.windowStack[0].updateLabel.text = "updated";
	navController.windowStack[0].updateLabel.color = "#00ff00";
}
/**
 * Format the rows, all schedule rows should be similar.
 */
_formatSessionRows = function(rowData) {
	var roomLabel = Ti.UI.createLabel({
		text : rowData['room'],
		color : '#333',
		font : {
			fontSize : 12,
			fontWeight : 'bold'
		},
		width : Ti.UI.SIZE,
		top : 0,
		left : 10
	});

	var titleLabel = Ti.UI.createLabel({
		text : rowData['title'],
		color : '#0062A0',
		font : {
			fontSize : 16,
			fontWeight : 'bold'
		},
		width : 'auto',
		top : 4,
		left : 10,
		right : 0
	});

	var speakersLabel = Ti.UI.createLabel({
		text : rowData['speakers'],
		color : '#333',
		font : {
			fontSize : 12,
			fontWeight : 'normal'
		},
		width : Ti.UI.SIZE,
		top : 0,
		bottom: 4,
		left : 10,
		height : 20
	});

	var row = Ti.UI.createTableViewRow({
		hasChild : true,
		nid : rowData['nid'],

	});
	var rowView = Ti.UI.createView({
    backgroundColor : '#fff',
    backgroundRepeat: true,
    backgroundImage: '/images/subtle_dots.png',
    top: 0,
    left: 0,
    textAlign : 'left',
    layout : 'vertical',
    height : Ti.UI.SIZE,
    width: Ti.UI.FILL
	})

	rowView.add(titleLabel);
	rowView.add(roomLabel);
	rowView.add(speakersLabel);
  row.add(rowView);
	return row;
}

/**
 * Format the rows, all speaker rows should be similar.
 */
_formatSpeakerRows = function(rowData) {
	//strip the src out of the img tag
	var imageUrl = rowData['photo'].match('<img[^>]+src=\"([^\"]+)\"')[1];

	//get the name of the image to check if it saved locally
	var imageName = imageUrl.split('/');
	imageName = imageName[imageName.length-1];

	//get either the local path or the remote path and load the image for next time
	var getRemoteFile = require('/lib/imagecache').imageCache;
	var imageSrc = getRemoteFile(imageName, imageUrl);

	var fullNameLabel = Ti.UI.createLabel({
		text : rowData['firstname'] + " " + rowData['lastname'],
		color : '#0062A0',
		font : {
			fontSize : 18,
			fontWeight : 'bold'
		},
		width : Ti.UI.FILL,
		height: Ti.UI.SIZE,
		left : 10,
		right : 0,
		top: 15
	});

	var userNameLabel = Ti.UI.createLabel({
		text : rowData['name'],
		color : '#999',
		font : {
			fontSize : 14,
			fontWeight : 'normal'
		},
    width : Ti.UI.FILL,
    height: Ti.UI.SIZE,
		left : 10
	});

	var TextWrapper = Ti.UI.createView({
		layout : 'vertical',
		textAlign : 'left',
		height : Ti.UI.FILL,
		width: Ti.UI.FILL,
		left: 80,
		backgroundColor : '#fff',
    backgroundRepeat: true,
    backgroundImage: '/images/subtle_dots.png',
	});
	
	var picWrapView = Ti.UI.createView({
	  height: 70,
	  width: 70,
	  top: 0,
	  left: 0,
	  borderRadius: 0
	});
	
  var picture = Ti.UI.createImageView({
    backgroundImage: imageSrc,
    width : 70,
    height: 70,
    backgroundColor: '#ddd',
    preventDefaultImage:true
  });
  
  picWrapView.add(picture);
  
	var row = Ti.UI.createTableViewRow({
		hasChild : true,
		uid : rowData['uid'],
		backgroundColor : '#fff',
		height: 70
	});

	row.add(picWrapView);
	TextWrapper.add(fullNameLabel);
	TextWrapper.add(userNameLabel);
	row.add(TextWrapper);
	return row;
}
/**
 * Build the full schedule data from the db.
 *
 */
pnwdstables.fullSpeakerData = function(navController) {
	// Get the sessions data from the db.
	var speakerData = pnwdsdb.userslist();
	var results = new Array();

	// Loop through and create table rows.
	for (var loopKey in speakerData) {
		var data = speakerData[loopKey];
		results.push(_formatSpeakerRows(data));
	}

	return results;
}
/**
 * Build the full schedule data from the db.
 *
 */
pnwdstables.fullScheduleData = function(navController) {
	// Get the sessions data from the db.
	var scheduleData = pnwdsdb.sessionslist();
	var results = new Array();
	var timeSlot = '';
	var oldTimeSlot = '';

	// Loop through and create table rows.
	for (var loopKey in scheduleData) {
		var data = scheduleData[loopKey];
		if (data['timeslotname'] != timeSlot) {
			results.push(Ti.UI.createTableViewRow({
				title : data['timeslotname'],
				hasChild : false,
				font : {
					fontSize : 12,
					fontWeight : 'bold'
				},
				color : '#fff',
				backgroundGradient:{
          type:'linear',
          colors:['#333','#666'],
          startPoint:{x:0,y:0},
          endPoint:{x:0,y:45},
          backFillStart:false
        } 
			}));
		}
		timeSlot = data['timeslotname'];
		results.push(_formatSessionRows(data));
	}

	return results;
}
/**
 * Build the personalized schedule data from the db.
 * TODO: Make this return only personally flagged events.
 */
pnwdstables.myScheduleData = function(navController) {
	// Get the sessions data from the db.
	var scheduleData = pnwdsdb.mysessionslist();
	var results = new Array();
	var timeSlot = '';
	var oldTimeSlot = '';

	// Loop through and create table rows.
	for (var loopKey in scheduleData) {
		var data = scheduleData[loopKey];
		if (data['timeslotname'] != timeSlot) {
			results.push(Ti.UI.createTableViewRow({
				title : data['timeslotname'],
				hasChild : false,
				font : {
					fontSize : 12,
					fontWeight : 'bold'
				},
				color : '#fff',
				height : 22,
				backgroundColor : '#0062A0',
				backgroundGradient:{
          type:'linear',
          colors:['#333','#666'],
          startPoint:{x:0,y:0},
          endPoint:{x:0,y:22},
          backFillStart:false
        }
			}));
		}
		timeSlot = data['timeslotname'];
		results.push(_formatSessionRows(data));
	}

	return results;
}
/**
 * Build the upcoming schedule data from the db.
 * TODO: Make this actually return only upcoming events
 */
pnwdstables.upcomingScheduleData = function(navController) {
	// Get the sessions data from the db.
	var scheduleData = pnwdsdb.upcomingsessionslist();
	var results = new Array();
	var timeSlot = '';
	var oldTimeSlot = '';

	// Loop through and create table rows.
	for (var loopKey in scheduleData) {
		var data = scheduleData[loopKey];
		if (data['timeslotname'] != timeSlot) {
			results.push(Ti.UI.createTableViewRow({
				title : data['timeslotname'],
				hasChild : false,
				font : {
					fontSize : 12,
					fontWeight : 'bold'
				},
				color : '#fff',
				height : 22,
				backgroundColor : '#0062A0',
        backgroundGradient:{
          type:'linear',
          colors:['#333','#666'],
          startPoint:{x:0,y:0},
          endPoint:{x:0,y:22},
          backFillStart:false
        } 
			}));
		}
		timeSlot = data['timeslotname'];
		results.push(_formatSessionRows(data));
	}

	return results;
}
/**
 * Create a table from the fullScheduleData.
 *
 */
pnwdstables.fullSpeakerTable = function(navController) {
	// Get the full schedule data from above.
	var results = pnwdstables.fullSpeakerData(navController);

	// Create the table with the results from above.
	var table = Titanium.UI.createTableView({
		data : results
	});

	// add a listener for click to the table
	// so every row is clickable
	table.addEventListener('click', function(e) {
		if (e.rowData.uid) {
			newWin = require('/includes/get-speaker-by-uid').newWin;
			navController.open(new newWin(navController, e.rowData.uid));
		}
	});

	return table;
}
/**
 * Create a table from the fullScheduleData.
 *
 */
pnwdstables.fullScheduleTable = function(navController) {
	// Get the full schedule data from above.
	var results = pnwdstables.fullScheduleData(navController);
	
	// Create the table with the results from above.
	var table = Titanium.UI.createTableView({
		data : results
	});

	// add a listener for click to the table
	// so every row is clickable
	table.addEventListener('click', function(e) {
		if (e.rowData.nid) {
			newWin = require('/includes/get-node-by-nid').newWin;
			navController.open(new newWin(navController, e.rowData.nid));
		}
	});

	return table;
}
/**
 * Build the schedule of only items that are flagged in the db.
 * @param {Object} navController
 */
pnwdstables.myScheduleTable = function(navController) {
	// Get the full schedule data from above.
	var results = pnwdstables.myScheduleData(navController);

	// Create the table with the results from above.
	var table = Titanium.UI.createTableView({
	  top: 28,
		data : results
	});

	// add a listener for click to the table
	// so every row is clickable
	table.addEventListener('click', function(e) {
		if (e.rowData.nid) {
			newWin = require('/includes/get-node-by-nid').newWin;
			navController.open(new newWin(navController, e.rowData.nid));
		}
	});

	return table;
}
/**
 * Build the schedule of things from this moment forward.
 * @param {Object} navController
 */
pnwdstables.upcomingScheduleTable = function(navController) {
	// Get the full schedule data from above.
	var results = pnwdstables.upcomingScheduleData(navController);

	// Create the table with the results from above.
	var table = Titanium.UI.createTableView({
	  top: 28,
		data : results
	});

	// add a listener for click to the table
	// so every row is clickable
	table.addEventListener('click', function(e) {
		if (e.rowData.nid) {
			newWin = require('/includes/get-node-by-nid').newWin;
			navController.open(new newWin(navController, e.rowData.nid));
		}
	});

	return table;
}

module.exports = pnwdstables;
