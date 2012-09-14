exports.newWin = function(navController) {
var pnwdsdb = require( '/includes/db' );
var pnwdsnet = require( '/includes/network' );

var clear = pnwdsdb.sessionsclear();
var seeded = pnwdsnet.seedsessions(navController);

// Define the variable win to contain the current window
var win = Ti.UI.createWindow({
  child: true,
  backgroundColor: '#fff'
});

var label = Ti.UI.createLabel({
  text: "Updating the tables."
})

// Add the view to the window
win.add(label);


return win;
}