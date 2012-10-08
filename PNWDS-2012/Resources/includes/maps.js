/**
 * Create the maps page.
 */
exports.newWin = function(navController) {
  
  // Define the variable win to contain the current window
  var win = Ti.UI.createWindow({
    barImage: '/images/iphone-nav.png',
  });
  // If we want a webview using U of W's excellent mobile map, we do this:
  // var webview = Titanium.UI.createWebView({url:'http://uw.edu/maps/?mgh'});
  
  // However that's not available offline, so let's do this instead:
  var annotation = Titanium.Map.createAnnotation({
    latitude:47.654975,
    longitude:-122.308264,
    title:"U of W",
    subtitle:'Mary Gates Hall, Seattle, WA',
    animate:true,
    leftButton:'../images/dashboard/111-user.png',
    image:"../images/dashboard/78-stopwatch.png"
  });

  var mapview = Titanium.Map.createView({
    mapType: Titanium.Map.STANDARD_TYPE,
    region:{latitude: "47.654975", longitude: "-122.308264", latitudeDelta: 0.001, longitudeDelta: 0.001},
    animate:true,
    regionFit:true,
    userLocation:false,
  	touchEnabled: true,
  	annotations:[annotation]
  });
  
  //Add our mapview to the window
  win.add(mapview);

  return win;
}