exports.newView = function(navController, viewType, viewTitle) {
  var pnwdsnet = require( '/includes/network' );
  // Create the scrollview
  var view = Titanium.UI.createScrollView({
    contentWidth:Ti.UI.FILL,
    contentHeight:Ti.UI.SIZE,
    layout: 'vertical',
    showVerticalScrollIndicator:true,
    showHorizontalScrollIndicator:true,
    backgroundColor: '#fff',
    top: 0,
  });
  
  // Define the name of the view (view as in Drupal's view)
  var drupal_view = viewType;

  var url = pnwdsnet.restPath + 'views/' + drupal_view + '.json';

  // Create a connection inside the variable xhr
  var xhr = Titanium.Network.createHTTPClient();
  
  // Open the xhr
  xhr.open("GET",url);
  
  // Send the xhr
  xhr.send();
  
  // When the xhr loads we do:
  xhr.onload = function() {
    var statusCode = xhr.status;
    
    // Check if we have a xhr
    if(statusCode == 200) {
      
      // Save the responseText from the xhr in the response variable
      var response = xhr.responseText;
      
      // Parse (build data structure) the JSON response into an object (data)
      var result = JSON.parse(response);

      var results = new Array();
      
      // Start loop
      for(var loopKey in result) {
        // Create the data variable and hold every result
        var data = result[loopKey];
        var title = '';

        if (data['title']) {
          title = data['title'];
        }
        else if (data['session details']) {
          title = data['session details'];
        }
        else if (data['node_title']) {
          title = data['node_title'];
        }
        else {
          title = '';
        }
        title = title.substr(title.indexOf('>', 0) + 1, title.length);
        title = title.substr(0, title.length - 4);
        
        if (viewType == 'sponsors') { 
          var urlIndex = data['nid'].indexOf('src="') + 5;
          var urllength = data['nid'].indexOf('" width=');
          var url = data['nid'].substring(urlIndex, urllength);
          
          //get the name of the image to check if it saved locally
          var imageName = url.split('/');
          imageName = imageName[imageName.length-1];
        
          //get either the local path or the remote path and load the image for next time
          var getRemoteFile = require('/lib/imagecache').imageCache;
          var imageSrc = getRemoteFile(imageName, url);
        
          var picture = Ti.UI.createImageView({
            image : imageSrc,
            preventDefaultImage:true,
            height : Ti.UI.SIZE,
            width : Ti.UI.FILL,
            left : 0
          })
          var spacerLabel = Ti.UI.createLabel({
            text: '',
            height : 20,
            width : Ti.UI.FILL,
            left : 0
          });
          var spacerLabelTwo = Ti.UI.createLabel({
            text: '',
            height : 20,
            width : Ti.UI.FILL,
            left : 0
          });
          var label = Ti.UI.createLabel({
            text: '',
            backgroundColor:'#ddd',
            height : 1,
            width : Ti.UI.FILL,
            left : 0
          });
          view.add(spacerLabel);
          view.add(picture);
          view.add(spacerLabelTwo);
          view.add(label);
          results = '';
        }
        else {
          results[loopKey] = {title: title, hasChild:true, nid:data["nid"]};
        }
      }

      if (viewTitle.length > 0) {
        var label = Ti.UI.createLabel({
          text: viewTitle,
          color:'#0062A0',
          textAlign:'left',
          font:{fontSize:24, fontWeight:'bold'},
        });
        var custom_row = Ti.UI.createTableViewRow({
          hasChild:false,
          textAlign: 'left'
        });
        
        if (viewType == "sponsors") {
          
        }
        else {
          custom_row.add(label);
          results.unshift(custom_row);
        }
      }

      var table = Titanium.UI.createTableView({data:results});
      
      // add a listener for click to the table
      // so every row is clickable 
      table.addEventListener('click',function(e) {
        newWin = require('/includes/get-node-by-nid').newWin;
        navController.open(new newWin(navController,e.rowData.nid));
      });
      
      // add our table to the view
      view.add(table);
      
    }
    else {
      // Create a label for the node title
      var errorMessage = Ti.UI.createLabel({
        // The text of the label will be the node title (data.title)
        text: "Please check your internet xhr.",
        color:'#000',
        textAlign:'left',
        font:{fontSize:24, fontWeight:'bold'},
        top:25,
        left:15,
        height:18
      });
      
      view.add(errorMessage);
    }
  }
  return view;
}