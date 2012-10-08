var pnwdsnet = {};

// This is the setting that is used for all network access to the Drupal site.    
pnwdsnet.restPath = 'http://2012.pnwdrupalsummit.org/rest/';
pnwdsnet.sitePath = 'http://2012.pnwdrupalsummit.org';

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
 * Figure out if the app has been updated yet.
 * 
 */
pnwdsnet.isUpToDate = function(navController) {
  // TODO: Would be a great idea to write a view that exports the last updated date of every session, so that if 
  //       this function returns true, then we could look more deeply to see which items were needing update, and
  //       only update those individual items.
  var siteDate = Ti.App.Properties.getString('pnwdsSiteLastUpdated');  
  var appDate = Ti.App.Properties.getString('pnwdsAppLastUpdated');
  if (siteDate == appDate) { 
    // Update the label on the button on the home window to indicate update is needed.
    Ti.API.info("Up to date.");
    navController.windowStack[0].updateLabel.text = "up to date";
    navController.windowStack[0].updateLabel.color = "#ffffff";
    return true;
  }
  else {
    if(Titanium.Network.networkType != Titanium.Network.NETWORK_NONE){
      Ti.API.info("Not up to date. Updating.");
      navController.windowStack[0].updateLabel.text = "updating ...";
      navController.windowStack[0].updateLabel.color = "#ff0000";
      var seeded = pnwdsnet.seedsessions(navController);
    }
    return false;
  } 
}

/**
 * Check the last updated date via a view on the Drupal site to see if
 * anything is new there. If it's been updated, we need to update our data
 * in the db, and then update all the UI tables.
 */
pnwdsnet.checkUpdates = function(navController) {  
  // The json returned will be all of the nodes last updated date without the 'limit=1' here.
  var url = pnwdsnet.restPath + 'views/schedule_mobile_last_updated.json?limit=1';
  var xhr = Ti.Network.createHTTPClient();
  Ti.API.info("Checking for updates");
  
  // What to do with the response from the xhr request
  xhr.onload = function() {
    var statusCode = this.status;
    if(statusCode == 200) {
      var result = JSON.parse(this.responseText);
      Ti.API.info("Got date from server: " + result[0].lastupdated);
      
      // Make sure it's not null before we go doing things. This can happen if connected to a network
      // but not receiving data.
      if (result[0].lastupdated.length > 10) {
        Ti.API.info("Comparing update dates now.");
        // Set that date from the site as a variable in the app:
        Ti.App.Properties.setString('pnwdsSiteLastUpdated', result[0].lastupdated);
        // Compare:
        var upToDate = pnwdsnet.isUpToDate(navController);
      }
    } 
    else {
      navController.windowStack[0].updateLabel.text = "no results";
      navController.windowStack[0].updateLabel.color = "#ff0000";
    }
  }


  if(Titanium.Network.networkType != Titanium.Network.NETWORK_NONE){
    // Open the xhr
    xhr.open("GET",url);   

    // Send the xhr
    xhr.send();
  }
}


/** 
 * Get individual node data by nid from the Drupal site.
 * @param {Object} _cb
 * @param {Object} nid
 */
pnwdsnet.getNodeByNid = function(navController,nid) {
  var url = pnwdsnet.restPath + 'node/' + nid + '.json';
  var xhr = Titanium.Network.createHTTPClient();
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


  if(Titanium.Network.networkType != Titanium.Network.NETWORK_NONE){
    // Open the xhr
    xhr.open("GET",url);   

    // Send the xhr
    xhr.send();
  }
}

pnwdsnet.syncFlags = function(navController) {
  var url = pnwdsnet.restPath + 'views/schedule.json?display_id=page_1';
  var xhr = Titanium.Network.createHTTPClient();

  // When the xhr loads we do:
  xhr.onload = function() {
  var statusCode = xhr.status;
    // Check if we have a xhr
    if(statusCode == 200) {
      var response = xhr.responseText;
      var result = JSON.parse(response);
      
      for(var loopKey in result) {
        // Create the data variable and hold every result
        var data = result[loopKey];
      }
    }
    else {
      alertDialog.show();
    }
  }
  
  if(Titanium.Network.networkType != Titanium.Network.NETWORK_NONE){
    
    // Open the xhr
    xhr.open("GET",url);   

    // Send the xhr
    xhr.send();
  }
}

pnwdsnet.seedsessions = function(navController) {
  var url = pnwdsnet.restPath + 'views/schedule_mobile.json';
  var xhr = Titanium.Network.createHTTPClient();

  // When the xhr loads we do:
  xhr.onload = function() {
    var actInd = Ti.UI.createActivityIndicator();
    var statusCode = xhr.status;
    // Check if we have a xhr
    if(statusCode == 200) {
      actInd.message = 'Please wait...';//message will only shows in android. 
      
      //Ti.UI.currentWindow.add(actInd);
      Ti.API.info("Added indicator");
      //To show it
      actInd.show();
      var siteDate = Ti.App.Properties.getString('pnwdsSiteLastUpdated');  
      var response = xhr.responseText;
      var result = JSON.parse(response);
      Ti.API.info('Recieved a NEW Item!');
      
      // Put the clear in here so we don't clear the db unless we have
      // something to replace it with.
      pnwdsdb.sessionsclear();
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
          data['timeslotname'],
          data['room'],
          data['uid']
        );
      }

      // Update the label on the button on the home window to indicate update is needed.
      pnwdstables.updateTables(navController);
      Ti.App.Properties.setString('pnwdsAppLastUpdated', siteDate);
      Ti.API.info("Updating finished.");
      actInd.hide();
    }
    else {
      alertDialog.show();
    }
  }

  if(Titanium.Network.networkType != Titanium.Network.NETWORK_NONE){
    
    // Open the xhr
    xhr.open("GET",url);   

    // Send the xhr
    xhr.send();
  }
}

pnwdsnet.seedspeakers = function(navController) {
  var url = pnwdsnet.restPath + 'views/mobile_speaker_list_approved_sessions.json';
  var xhr = Titanium.Network.createHTTPClient();
  pnwdsdb.speakersclear();
  
  // When the xhr loads we do:
  xhr.onload = function() {
    var statusCode = xhr.status;
    // Check if we have a xhr
    if(statusCode == 200) {
      var response = xhr.responseText;
      var result = JSON.parse(response);
      Ti.API.info('Recieved a NEW Speaker Set!');
      
      // Put the clear in here so we don't clear the db unless we have
      // something to replace it with.
      pnwdsdb.speakersclear();
      // Start loop
      for(var loopKey in result) {

        // Create the data variable and hold every result
        var data = result[loopKey];
        pnwdsdb.usersadd(
          data['uid'],
          data['username'],
          data['firstname'],
          data['lastname'],
          data['picture'],
          data['company'],
          data['bio'],
          data['twitter'],
          data['linkedin'],
          data['website']
        );
      }

    }
    else {
      alertDialog.show();
    }
  }

  if(Titanium.Network.networkType != Titanium.Network.NETWORK_NONE){
    // Open the xhr
    xhr.open("GET",url);   

    // Send the xhr
    xhr.send();
  }
}
module.exports = pnwdsnet;