// Include commonJS modules for use in bootstrapping and checking for updates.
var pnwdsdb = require( '/includes/db' );
var pnwdsnet = require( '/includes/network' );

// Get the db instantiated if it isn't already.
pnwdsdb.bootstrap();

// For testing.
pnwdsdb.removedb();
pnwdsdb.sessionsclear();
pnwdsnet.seedsessions();
pnwdsnet.seedspeakers();

/**
 * Below is the navigation controller that actually works with both iOS and Android.
 * Everything else is called from home.js, so if you are looking for something, it 
 * probably will be there or something called from there.
 */
var NavigationController = require('NavigationController').NavigationController,
    homeWindow = require('home').homeWindow;

var controller = new NavigationController();
controller.open(new homeWindow(controller));

if (!Ti.App.Properties.getInt('updateInterval')) {
  Ti.App.Properties.setInt('updateInterval', 25000);
}

// Check for updates.
if(Titanium.Network.networkType != Titanium.Network.NETWORK_NONE){ 
  Ti.API.info("Haz netwerkz!");
  pnwdsnet.checkUpdates(controller); 
}
else {
  Ti.API.info("No net, not checking.");
}
var updated = setInterval(function() {
  if(Titanium.Network.networkType != Titanium.Network.NETWORK_NONE){ 
    Ti.API.info("Haz netwerkz!");
    pnwdsnet.checkUpdates(controller); 
  }
  else {
    Ti.API.info("No net, not checking.");
  }
}, Ti.App.Properties.getInt('updateInterval'));

