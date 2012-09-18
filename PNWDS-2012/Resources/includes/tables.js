var pnwdstables = {};
var pnwdsdb = require( '/includes/db' );

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
  var timeLabel = Ti.UI.createLabel({
    text: rowData['timeslot'],
    color: '#666',
    font:{fontSize: 9, fontWeight:'bold'},
    height: 60,
    width: 50,
    top: 0,
    left: 0
  });
  
  var titleLabel = Ti.UI.createLabel({
    text: rowData['title'],
    color: '#0062A0',
    font:{fontSize: 18, fontWeight:'bold'},
    height: 40,
    width: 'auto',
    top: 0,
    left: 51
  });
  
  var speakersLabel = Ti.UI.createLabel({
    text: rowData['speakers'],
    color: '#999',
    font:{fontSize: 14, fontWeight:'normal'},
    height: 20,
    width: 'auto',
    top: 51,
    left: 51
  });
  
  // TODO: Add a flag check or button to this maybe?
  
  var row = Ti.UI.createTableViewRow({
    hasChild:true,
    textAlign: 'left',
    nid: rowData['nid']
  });

  row.add(timeLabel);
  row.add(titleLabel);
  row.add(speakersLabel);
  
  return row;
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
  for(var loopKey in scheduleData) {
    var data = scheduleData[loopKey];
    if (data['timeslot'] != timeSlot) {
      results.push(Ti.UI.createTableViewRow({title: 'Timeslot: ' + data['timeslot'], hasChild:false }));
    }
    timeSlot = data['timeslot'];
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
  var scheduleData = pnwdsdb.sessionslist();
  var results = new Array();
  var timeSlot = '';
  var oldTimeSlot = '';

  // Loop through and create table rows.
  for(var loopKey in scheduleData) {
    var data = scheduleData[loopKey];
    if (data['timeslot'] != timeSlot) {
      results.push(Ti.UI.createTableViewRow({title: 'Timeslot: ' + data['timeslot'], hasChild:false }));
    }
    timeSlot = data['timeslot'];
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
  var scheduleData = pnwdsdb.sessionslist();
  var results = new Array();
  var timeSlot = '';
  var oldTimeSlot = '';

  // Loop through and create table rows.
  for(var loopKey in scheduleData) {
    var data = scheduleData[loopKey];
    if (data['timeslot'] != timeSlot) {
      results.push(Ti.UI.createTableViewRow({title: 'Timeslot: ' + data['timeslot'], hasChild:false }));
    }
    timeSlot = data['timeslot'];
    results.push(_formatSessionRows(data));
  }

  return results;
}


/**
 * Create a table from the fullScheduleData.
 * 
 */
pnwdstables.fullScheduleTable = function(navController) {
  // Get the full schedule data from above.
  var results = pnwdstables.fullScheduleData(navController);
  
  var bottomTitleLabel = Ti.UI.createLabel({
    text: 'Full Schedule',
    color:'#0062A0',
    textAlign:'left',
    font:{fontSize:24, fontWeight:'bold'},
  });
  var custom_row = Ti.UI.createTableViewRow({
    hasChild:false,
    textAlign: 'left'
  });
  custom_row.add(bottomTitleLabel);
  results.unshift(custom_row);
  
  // Create the table with the results from above.
  var table = Titanium.UI.createTableView({
    data: results
  });
  
  // add a listener for click to the table
  // so every row is clickable 
  table.addEventListener('click',function(e) {
    if (e.rowData.nid){ 
      newWin = require('/includes/get-node-by-nid').newWin;
      navController.open(new newWin(navController,e.rowData.nid));
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
  
  var bottomTitleLabel = Ti.UI.createLabel({
    text: 'My Schedule',
    color:'#0062A0',
    textAlign:'left',
    font:{fontSize:24, fontWeight:'bold'},
  });
  var custom_row = Ti.UI.createTableViewRow({
    hasChild:false,
    textAlign: 'left'
  });
  custom_row.add(bottomTitleLabel);
  results.unshift(custom_row);
  
  // Create the table with the results from above.
  var table = Titanium.UI.createTableView({
    data: results
  });
  
  // add a listener for click to the table
  // so every row is clickable 
  table.addEventListener('click',function(e) {
    if (e.rowData.nid){ 
      newWin = require('/includes/get-node-by-nid').newWin;
      navController.open(new newWin(navController,e.rowData.nid));
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
  
  var bottomTitleLabel = Ti.UI.createLabel({
    text: 'Upcoming Sessions',
    color:'#0062A0',
    textAlign:'left',
    font:{fontSize:24, fontWeight:'bold'},
  });
  var custom_row = Ti.UI.createTableViewRow({
    hasChild:false,
    textAlign: 'left', 
    touchEnabled: false
  });
  custom_row.add(bottomTitleLabel);
  results.unshift(custom_row);
  
  // Create the table with the results from above.
  var table = Titanium.UI.createTableView({
    data: results
  });
  
  // add a listener for click to the table
  // so every row is clickable 
  table.addEventListener('click',function(e) {
    if (e.rowData.nid){ 
      newWin = require('/includes/get-node-by-nid').newWin;
      navController.open(new newWin(navController,e.rowData.nid));
    }
  });

  return table;
}

module.exports = pnwdstables;