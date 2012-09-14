var pnwdsnet = {};

// This is the setting that is used for all network access to the Drupal site.    
pnwdsnet.restPath = 'http://dev.cod7.gotpantheon.com/rest/';

// Will require some db work, pull that in here.
var pnwdsdb = require( '/includes/db' );
var pnwdstables = require( '/includes/tables' );

// Basically this is just a default message in case something goes wrong.
var alertDialog = Titanium.UI.createAlertDialog({ 
  title: 'No Connection', 
  message: 'Can not reach the PNWDS site at this time.', 
  buttonNames: ['OK'] 
}); 

/**
 * Check the last updated date via a view on the Drupal site to see if
 * anything is new there. If it's been updated, we need to update our data
 * in the db, and then update all the UI tables.
 */
pnwdsnet.lastUpdated = function(navController) {  
  // The json returned will be all of the nodes last updated date without the 'limit=1' here.
  var url = pnwdsnet.restPath + 'views/schedule_mobile_last_updated.json?limit=1';
  var xhr = Ti.Network.createHTTPClient();
  Ti.API.info("Checking for updates");
  
  // What to do with the response from the xhr request
  xhr.onload = function() {
    var statusCode = this.status;
    if(statusCode == 200) {
      var result = JSON.parse(this.responseText);
      Ti.API.info(result);
      var siteUpdated = result[0].lastupdated;
      var lastUpdated = Ti.App.Properties.getString('pnwdsUpdated');
      if (siteUpdated != lastUpdated) {
        // Update the label on the button on the home window to indicate update is needed.
        navController.windowStack[0].updateLabel.text = "update now";
        navController.windowStack[0].updateLabel.color = "#ff0000"
        Ti.API.info("Not up to date.");
      }
      // Ti.App.Properties.setString('seeded','yes');         
    } 
    else {
      alertDialog.show();
    }
  }

  // Open the xhr
  xhr.open("GET",url);
  // Send the xhr
  xhr.send(); 
}


/** 
 * Get individual node data by nid from the Drupal site.
 * @param {Object} _cb
 * @param {Object} nid
 */
pnwdsnet.getNodeByNid = function(navController,nid) {
  var url = pnwdsnet.restPath + 'node/' + nid + '.json';
  var xhr = Titanium.Network.createHTTPClient();
  Ti.API.info(url);
  // What to do with the response from the xhr request
  xhr.onload = function() {
    var statusCode = this.status;
    if(statusCode == 200) {
      return JSON.parse(this.responseText);        
    } 
    else {
      alertDialog.show();
    }
  }

  // Open the xhr
  xhr.open("GET",url);
  // Send the xhr
  xhr.send(); 
}

pnwdsnet.seedsessions = function(navController) {
  var url = pnwdsnet.restPath + 'views/schedule_mobile.json';
  var xhr = Titanium.Network.createHTTPClient();

  // When the xhr loads we do:
  xhr.onload = function() {
    var statusCode = xhr.status;
    // Check if we have a xhr
    if(statusCode == 200) {
      var response = xhr.responseText;
      var result = JSON.parse(response);
      Ti.API.info(' \n NEW Item: \n');
      Ti.API.info(result);
      Ti.API.info(' \n END Item: \n');
      // Start loop
      for(var loopKey in result) {
        // Create the data variable and hold every result
        var data = result[loopKey];
        pnwdsdb.sessionsadd(
          data['title'],
          data['body'],
          data['nid'],
          data['speakers'],
          data['timeslot'],
          data['room'],
          data['uid']
        );
      }
      
      var fullScheduleData = pnwdstables.fullScheduleData();
      var myScheduleData = pnwdstables.myScheduleData();
      var upcomingScheduleData = pnwdstables.upcomingScheduleData();

      Ti.API.info("Updating finished.");
      
      // Update the label on the button on the home window to indicate update is needed.
      navController.windowStack[0].updateLabel.text = "sessions updated!";
      navController.windowStack[0].updateLabel.color = "#00ff00";
      navController.windowStack[0].fullScheduleTable.setData(fullScheduleData);
      navController.windowStack[0].myScheduleTable.setData(myScheduleData);
      navController.windowStack[0].upcomingScheduleTable.setData(upcomingScheduleData);

    }
    else {
      alertDialog.show();
    }
  }

  // Open the xhr
  xhr.open("GET",url);   

  // Send the xhr
    xhr.send();
  }
    
module.exports = pnwdsnet;