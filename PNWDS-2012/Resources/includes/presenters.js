/**
 * Create the presenters page, currently just pulling the speakers all view.
 */
exports.newWin = function(navController) {
  
  // Define the variable win to contain the current window
  var win = Ti.UI.createWindow({
    barImage: '/images/iphone-nav.png',
  });
  
  newView = require('/includes/getView').newView;
  speakersView = new newView(navController, 'speakers', '');
  
  // Add our scrollview to the window
  win.add(speakersView);
  return win;
}