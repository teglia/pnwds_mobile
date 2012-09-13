  var pnwdsnet = {};
      
  pnwdsnet.restPath = 'http://dev.cod7.gotpantheon.com/rest/';
  
  var pnwdsdb = require( '/includes/db' );
  
	var alertDialog = Titanium.UI.createAlertDialog({ 
    title: 'No Connection', 
    message: 'Can not reach the PNWDS site at this time.', 
    buttonNames: ['OK'] 
  }); 
	
	pnwdsnet.lastUpdated = function(navController) {
	  var url = pnwdsnet.restPath + 'views/schedule_mobile_last_updated.json?limit=1';
	  var xhr = Ti.Network.createHTTPClient();
	  // What to do with the response from the xhr request
    xhr.onload = function() {
      var statusCode = this.status;
      if(statusCode == 200) {
        var result = JSON.parse(this.responseText);
        Ti.API.info(result);
        var siteUpdated = result[0].lastupdated;
        var lastUpdated = Ti.App.Properties.getString('pnwdsUpdated');
        if (siteUpdated != lastUpdated) {
          Ti.API.info("Set a notice?");
          var newDialog = Titanium.UI.createAlertDialog({ 
            title: 'Update Available', 
            message: 'The PNWDS site has updated information. Update the app to get the latest info.', 
            buttonNames: ['OK'] 
          }); 
          // newDialog.show();
          
          var updateButton = Titanium.UI.createButton({
            text: 'Update',
            title: 'Update',
            label: 'Update',
            width: 29,
            height:29,
            title: '',
            style: 0
          });
          updateButton.addEventListener('click',function(e) {
            var clear = pnwdsdb.sessionsclear();
            var seeded = pnwdsnet.seedsessions(navController);
            navController.windowStack[0].leftNavButton = null;  
            Ti.App.Properties.setString('pnwdsUpdated',siteUpdated);           
          });
          navController.windowStack[0].leftNavButton = updateButton;
          
         
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
        
        var scheduleData = pnwdsdb.sessionslist();
        var results = new Array();
        var timeSlot = '';
        var oldTimeSlot = '';
      
        // Start loop
        for(var loopKey in scheduleData) {
          var data = scheduleData[loopKey];
          if (data['timeslot'] != timeSlot) {
            results.push(Ti.UI.createTableViewRow({title: data['timeslot'], hasChild:false }));
          }
          timeSlot = data['timeslot'];
          results[loopKey] = {title: data['title'], hasChild:true, nid:data["nid"]};
        }
        
        var bottomTitleLabel = Ti.UI.createLabel({
          text: 'New Schedule',
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
        Ti.API.info(results);
        navController.windowStack[0].table.setData(results);
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