var pnwdsdb = require( '/includes/db' );
var pnwdsnet = require( '/includes/network' );

pnwdsdb.bootstrap();

// For testing, clear and refill the db. Run one time with these two uncommented,
// then comment and run again.
// var clear = pnwdsdb.sessionsclear();
// var seeded = pnwdsnet.seedsessions();

/**
 * Below is the navigation controller that actually works with both iOS and Android.
 * Everything else is called from home.js, so if you are looking for something, it 
 * probably will be there or something called from there.
 */
var NavigationController = require('NavigationController').NavigationController,
    TestWindow = require('home').TestWindow;

var controller = new NavigationController();

controller.open(new TestWindow(controller));

var updated = pnwdsnet.lastUpdated(controller);

