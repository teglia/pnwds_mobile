/**
 * Create the schedule page, currently just pulling the schedule all view from the web.
 */
exports.newWin = function(navController) {
  var pnwdstables = require( '/includes/tables' );
  
  // Define the variable win to contain the current window
  var win = Ti.UI.createWindow();
  
  var fullScheduleTable = pnwdstables.fullScheduleTable(navController);

  
  // Add our scrollview to the window
  win.add(fullScheduleTable);
  return win;
}