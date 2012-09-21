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


  var gridView = Ti.UI.createView({
    top: 3,
    left: 0,
    right: 0,
    layout: 'vertical',
    height: 130,
    width: 'auto',
    backgroundColor: '#fff'
  });
  
  if (Titanium.Platform.name == 'android') {
    gridView.height = 140;
  }
  else {
    gridView.height = 140;
  }
  
  var firstRow = Ti.UI.createView({
    width: Ti.UI.FILL,
    height: '49%',
    top: '1%',
    layout: 'horizontal',
    backgroundColor: '#fff'
  });
  var secondRow = Ti.UI.createView({
    width: Ti.UI.FILL,
    height: '49%',
    top: '1%',
    layout: 'horizontal',
    backgroundColor: '#fff'
  });

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
      width:'32%',
      height:Ti.UI.FILL,
      left: '1%',
      backgroundColor: "#0062A0",
      label: itemData[i].name,
      name: itemData[i].name
    });
    if (i == 3) {
      var updateLabel = Ti.UI.createLabel({
        text: itemData[i].name,
        label: itemData[i].name,
        name: itemData[i].name,
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
    Ti.API.info(i);
    if(i<3) {
      firstRow.add(newView);
    }
    else {
      secondRow.add(newView);
    }
    //gridView.add(newView);
    // dashboardData.push(newView);
  }

  gridView.add(firstRow);
  gridView.add(secondRow);


  // // Create our scrollable grid view.
  // var gridView = createScrollableGridView({
    // height: 'auto',
    // backgroundColor: '#666',
    // data: dashboardData
  // });
  
  win.gridView = gridView;
  win.add(gridView);
    
  var myScheduleView = Titanium.UI.createScrollView({
    contentWidth:'auto',
    contentHeight:'auto',
    showVerticalScrollIndicator:true,
    showHorizontalScrollIndicator:false,
    top: 0,
    scrollType: 'vertical'
  });
  
  var upcomingScheduleView = Titanium.UI.createScrollView({
    contentWidth:'auto',
    contentHeight:'auto',
    showVerticalScrollIndicator:true,
    showHorizontalScrollIndicator:false,
    top: 0,
    scrollType: 'vertical'
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
    if(Titanium.Network.networkType != Titanium.Network.NETWORK_NONE && navController.windowStack[0].updateLabel){ 
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
