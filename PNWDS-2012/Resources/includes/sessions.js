/**
 * Create the schedule page, currently just pulling the schedule all view.
 */
exports.newWin = function(navController) {
  
  // Define the variable win to contain the current window
  var win = Ti.UI.createWindow();
  
  newView = require('/includes/getView').newView;
  scheduleView = new newView(navController, 'schedule', '');
  
  // Add our scrollview to the window
  win.add(scheduleView);
  return win;
}