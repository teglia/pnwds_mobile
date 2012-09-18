var update = {};

update.updateWin = function(navController) {
  var pnwdsdb = require( '/includes/db' );
  var pnwdsnet = require( '/includes/network' );
  navController.windowStack[0].updateLabel.text = "Changing some text";
  Ti.API.info(typeof controller);
  var seeded = pnwdsnet.seedsessions(navController);
  navController.windowStack[0].updateLabel.text = "updating ...";
  navController.windowStack[0].updateLabel.color = "#ff0000";
  
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
    navController.windowStack[0].updateLabel.text = "Changed some text";

  return win;
}

module.exports = update;
