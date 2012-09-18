/**
 * This is the home window - displays a grid of images and a scrollable view of sessions
 * 
 */
exports.homeWindow = function(navController) {
  var win = Ti.UI.createWindow({
      backgroundColor: '#fff',
      title: '2012 PNWDS Home'
  });
  Ti.API.info("In home");
  
  var pnwdsnet = require( '/includes/network' );
  var pnwdsdb = require( '/includes/db' );
  var pnwdstables = require( '/includes/tables' );
  
  Ti.App.addEventListener('databaseUpdated', function(e) {
    Ti.API.info("databaseUpdated event fired");
      pnwdstables.updateTables(navController);
  });

  /**
   * Function to determine the pixel density
   * @param {Object} densityPixels
   */
  var P = function (densityPixels) {
    return densityPixels*Ti.Platform.displayCaps.dpi/160;
  };
   
  /**
   * A scrollable grid view that works on both android and ios
   * http://developer.appcelerator.com/question/67631/grid-view-is-possible-or-not#answer-206038
   * @param {Object} params
   */
  var createScrollableGridView = function (params) {
    var _p = function (densityPixels) {
      return densityPixels*Ti.Platform.displayCaps.dpi/160;
    }
 
    var view = Ti.UI.createScrollView({
      contentWidth: 'auto',
      contentHeight: 'auto',
      scrollType: "horizontal",
      cellWidth: (params.cellWidth)?params.cellWidth: _p(95),
      cellHeight: (params.cellHeight)?params.cellHeight: _p(65),
      xSpacer: (params.xSpacer)?params.xSpacer: _p(9),
      ySpacer: (params.ySpacer)?params.ySpacer: _p(9),
      xGrid: (params.xGrid)?params.xGrid:3,
      top: (params.top)?params.top:_p(10),
      left: (params.left)?params.left:0,
      data: params.data
    });
 
    var objSetIndex = 0;
    var yGrid = view.data.length/view.xGrid;
 
    for (var y=0; y<yGrid; y++){
      var row = Ti.UI.createView({
        layout: "horizontal",
        focusable: false,
        top: y*(view.cellHeight+(2*view.ySpacer)),
        height: view.cellHeight+(2*view.ySpacer)
      });        
 
      for (var x=0; x<view.xGrid; x++){
        if(view.data[objSetIndex]){
          var thisView = Ti.UI.createView({
            left: view.ySpacer,
            height: view.cellHeight,
            width: view.cellWidth
          });
          thisView.add(view.data[objSetIndex]);
          row.add(thisView);
          objSetIndex++;
       }
      }
      view.add(row);
    }
 
    return view;
  };

  var dashboardData = [];
  
  // The button and file names for the front window.
  // Keep the file names the same as the label names so the click event
  // listener below knows the right name to look for!
  var itemData = [
    { name: 'sessions' },
    { name: 'login' },
    { name: 'about' },
    { name: 'update' },
    { name: 'speakers' },
    { name: 'sponsors' }
  ];
  
  // Creating the array of "buttons". Buttons don't work well here, but views do!
  for (var i=0, ilen=itemData.length; i<ilen; i++){
    var newView = Ti.UI.createView({
      width:'auto',
      height:'auto',
      backgroundColor: "#0062A0",
      label: itemData[i].name
    });
    if (i == 3) {
      var updateLabel = Ti.UI.createLabel({
        text: itemData[i].name,
        label: itemData[i].name,
        color: "#fff"
      });
      // Set this as a variable on the win so we can update it later.
      win.updateLabel = updateLabel;
      newView.add(updateLabel);
    }
    else {
      newView.add(Ti.UI.createLabel({
        text: itemData[i].name,
        label: itemData[i].name,
        color: "#fff"
      }));  
    }
    

    
    newView.addEventListener('click', function(e) {
      switch(e.source.label) {
        case 'update':
          if(Titanium.Network.networkType != Titanium.Network.NETWORK_NONE){ 
            var updates = require( '/includes/update' );
            navController.open(updates.updateWin(navController));
          }          
          break;
        default: 
          var newWin = require('/includes/' + e.source.label).newWin;
          navController.open(new newWin(navController));
          break;
      }
      
      Ti.API.info(e.source.label);
    });

    dashboardData.push(newView);
  }

  // Create our scrollable grid view.
  var gridView = createScrollableGridView({
    height: 'auto',
    backgroundColor: '#666',
    data: dashboardData
  });
  
  win.gridView = gridView;
  win.add(gridView);
    
  var myScheduleView = Titanium.UI.createScrollView({
    contentWidth:'auto',
    contentHeight:'auto',
    showVerticalScrollIndicator:true,
    showHorizontalScrollIndicator:true,
    top: 0,
  });
  
  var upcomingScheduleView = Titanium.UI.createScrollView({
    contentWidth:'auto',
    contentHeight:'auto',
    showVerticalScrollIndicator:true,
    showHorizontalScrollIndicator:true,
    top: 0,
  });
    
  var myScheduleTable = pnwdstables.myScheduleTable(navController);
  var upcomingScheduleTable = pnwdstables.upcomingScheduleTable(navController);
  var fullScheduleTable = pnwdstables.fullScheduleTable(navController);
  
  myScheduleView.add(myScheduleTable);
  upcomingScheduleView.add(upcomingScheduleTable);
  Ti.API.info("Got the table");
  
  // scheduleViewTwo.add(fullScheduleTable);
  
  var scrollerizer = Ti.UI.createScrollableView({
    height: 'auto',
    top: 170,
    views:[myScheduleView,upcomingScheduleView],
    showPagingControl:true
  });

  win.add(scrollerizer);
  
  // Adding these tables to win as variables so they can have their data updated later.
  win.myScheduleTable = myScheduleTable;
  win.upcomingScheduleTable = upcomingScheduleTable;
  win.fullScheduleTable = fullScheduleTable;
  
  var checkForNet = setInterval(function() {
    if(Titanium.Network.networkType != Titanium.Network.NETWORK_NONE){ 
      if (navController.windowStack[0].updateLabel.text == "no network, can't update") {
        navController.windowStack[0].updateLabel.text = "update";
        navController.windowStack[0].updateLabel.color = "#fff";
      }
    }
    else {
      navController.windowStack[0].updateLabel.text = "no network, can't update";
      navController.windowStack[0].updateLabel.color = "#666";
    }
  }, 500);

  return win;
};
