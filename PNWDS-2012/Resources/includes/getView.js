/**
 * Remember that in the debug process we can always use:
 * Ti.API.info(foo);
 * to log something to the console
 */
exports.newView = function(navController, viewType, viewTitle) {
  
  // Create the scrollview
  var view = Titanium.UI.createScrollView({
    contentWidth:'auto',
    contentHeight:'auto',
    showVerticalScrollIndicator:true,
    showHorizontalScrollIndicator:true,
    top: 0,
  });
  
  // Define the name of the view (view as in Drupal's view)
  var drupal_view = viewType;
  
  // Define the url which contains the full url
  // in this case, we'll connecting to http://example.com/api/rest/node/1.json
  var url = Titanium.App.Properties.getString("restPath") + 'views/' + drupal_view + '.json';
  Ti.API.info(url);
  // Create a connection inside the variable xhr
  var xhr = Titanium.Network.createHTTPClient();
  
  // Open the xhr
  xhr.open("GET",url);
  
  // Send the xhr
  xhr.send();
  
  // When the xhr loads we do:
  xhr.onload = function() {
    // Save the status of the xhr in a variable
    // this will be used to see if we have a xhr (200) or not
    var statusCode = xhr.status;
    
    // Check if we have a xhr
    if(statusCode == 200) {
      
      // Save the responseText from the xhr in the response variable
      var response = xhr.responseText;
      
      // Parse (build data structure) the JSON response into an object (data)
      var result = JSON.parse(response);
      
      /**
       * Create a new array "results"
       * This is necessary because we need to create an object
       * to send to the Table we're creating with the results
       * the table will have the title and the nid of every result
       * and we'll use the nid to move to another window when we click
       * on it. 
       */
      var results = new Array();
      
      // Start loop
      for(var loopKey in result) {
        // Create the data variable and hold every result
        var data = result[loopKey];
        
        /**
         * To see how the array is built by Services in Drupal
         * go to drupanium debug and use the views debug page
         * you'll see that the array is something like:
         * 
         * 0 => array(
         *  title => some title
         *  date => some date
         *  user => the user uid
         *  type => the node type
         *  nid => the node nid
         *  vid => the node vid
         * )
         */

        /**
         * We start adding the results one by one to our array "results"
         * it consists of title, nid and the property hasChild 
         * in title we get the node title with data.title
         * in nid we save the node nid with data.nid (we walk the array)
         */
        var title = data['node_title'];
        title = title.substr(title.indexOf('>', 0) + 1, title.length);
        title = title.substr(0, title.length - 4);
        results[loopKey] = {title: title, hasChild:true, nid:data["nid"]};
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
        custom_row.add(label);
        results.unshift(custom_row);
      }
      
      // Create a new table to hold our results
      // We tell Titanium to use our array results as the Property "data"
      // See http://developer.appcelerator.com/apidoc/mobile/latest/Titanium.UI.TableView-object
      // Specially the properties
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