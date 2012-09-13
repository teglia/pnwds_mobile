/**
 * This is the home window - displays a grid of images and a scrollable view of sessions
 * 
 */
exports.TestWindow = function(navController) {
  var win = Ti.UI.createWindow({
      backgroundColor: '#fff',
      title: '2012 PNWDS Home'
  });
  
  var pnwdsnet = require( '/includes/network' );
  var pnwdsdb = require( '/includes/db' );
  Ti.API.info(pnwdsdb);
  Ti.API.info(pnwdsnet);
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
    newView.add(Ti.UI.createLabel({
      text: itemData[i].name,
      label: itemData[i].name,
      color: "#fff"
    }));
    
    newView.addEventListener('click', function(e) {
      Ti.API.info(e.source.label);
      newWin = require('/includes/' + e.source.label).newWin;
      navController.open(new newWin(navController));
    });

    dashboardData.push(newView);
  }

  // Create our scrollable grid view.
  var gridView = createScrollableGridView({
    height: 'auto',
    data: dashboardData, //An array of views
  });

  win.add(gridView);
    
  var scheduleView = Titanium.UI.createScrollView({
    contentWidth:'auto',
    contentHeight:'auto',
    showVerticalScrollIndicator:true,
    showHorizontalScrollIndicator:true,
    top: 0,
  });
  
  var scheduleData = pnwdsdb.sessionslist();
  var results = new Array();
  var timeSlot = '';
  var oldTimeSlot = '';

  // Start loop
  for(var loopKey in scheduleData) {
    var data = scheduleData[loopKey];
    if (data['timeslot'] != timeSlot) {
      results.push(Ti.UI.createTableViewRow({title: data['timeslot'], hasChild:false }));
    }
    timeSlot = data['timeslot'];
    results[loopKey] = {title: data['title'], hasChild:true, nid:data["nid"]};
  }
  
  var bottomTitleLabel = Ti.UI.createLabel({
    text: 'Full Schedule',
    color:'#0062A0',
    textAlign:'left',
    font:{fontSize:24, fontWeight:'bold'},
  });
  var custom_row = Ti.UI.createTableViewRow({
    hasChild:false,
    textAlign: 'left'
  });
  custom_row.add(bottomTitleLabel);
  results.unshift(custom_row);

  var table = Titanium.UI.createTableView({
    data:results,
    borderWidth:2,
    borderColor:'#bbb',
    borderRadius:5,
    width: '95%'
  });
  
  // add a listener for click to the table
  // so every row is clickable 
  table.addEventListener('click',function(e) {
    newWin = require('/includes/get-node-by-nid').newWin;
    navController.open(new newWin(navController,e.rowData.nid));
  });
  
  scheduleView.add(table);
  
  var scrollerizer = Ti.UI.createScrollableView({
    height: 'auto',
    top: 180,
    views:[scheduleView,scheduleView],
    showPagingControl:true
  });

  win.add(scrollerizer);
  win.table = table;
  return win;
};
