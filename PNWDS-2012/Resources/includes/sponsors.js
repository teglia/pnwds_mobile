/**
 * Create the sponsors page, currently just pulling the sponsors all view.
 */
exports.newWin = function(navController) {
  
  // Define the variable win to contain the current window
  var win = Ti.UI.createWindow();
  
  newView = require('/includes/getView').newView;
  sponsorsView = new newView(navController, 'sponsors', 'all');
  
  // Add our scrollview to the window
  win.add(sponsorsView);
  return win;
}