var update = {};

update.updateWin = function(navController) {
  var pnwdsdb = require( '/includes/db' );
  var pnwdsnet = require( '/includes/network' );
  var seeded = pnwdsnet.seedsessions(navController);
  navController.windowStack[0].updateLabel.text = "status: updating ...";
  navController.windowStack[0].updateLabel.color = "#ff0000";
  
  // Define the variable win to contain the current window
  var win = Ti.UI.createWindow({
    child: true,
    backgroundColor: '#fff'
  });
  
  var label = Ti.UI.createLabel({
    text: "Updating the App."
  })
  
  // Add the view to the window
  win.add(label);

  return win;
}

module.exports = update;
