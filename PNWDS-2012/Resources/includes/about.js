exports.newWin = function(navController) {
  // Define the variable win to contain the current window
  var win = Ti.UI.createWindow({
    child: true,
    backgroundColor: '#fff',
    barImage: '/images/iphone-nav.png',
    title: "About PNWDS"
  });

  var nodeBody = Titanium.UI.createWebView({
    url: '/includes/about.html',
    height: "auto",
    top: 10,
    left: 10,
    right: 10,
  });
  
  win.add(nodeBody);
  
  return win;
}
