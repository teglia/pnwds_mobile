/**
 * This is the home window - displays a grid of images and a scrollable view of sessions
 * 
 */
exports.homeWindow = function(navController) {
  var win = Ti.UI.createWindow({
      backgroundColor: '#c5a571',
      barImage: '/images/navbar.png',
      title: '2012 PNWDS'
  });
  Ti.API.info("In home");
  
  var pnwdsnet = require( '/includes/network' );
  var pnwdsdb = require( '/includes/db' );
  var pnwdstables = require( '/includes/tables' );
  
  Ti.App.addEventListener('databaseUpdated', function(e) {
    Ti.API.info("databaseUpdated event fired");
    pnwdstables.updateTables(navController);
  });

  // TODO: Need to finish the flag sync function.
  Ti.App.addEventListener('syncFlags', function(e) {
    Ti.API.info("syncing flags");
    pnwdstables.updateTables(navController);
  });


  var gridView = Ti.UI.createView({
    top: 2,
    left: 0,
    right: 0,
    bottom: 0,
    layout: 'vertical',
    height: 92,
    width: 'auto',
    backgroundColor: "#c5a571"
  });
  
  // if (Titanium.Platform.name == 'android') {
    // gridView.height = 140;
  // }
  // else {
    // gridView.height = 140;
  // }
  
  var firstRow = Ti.UI.createView({
    width: Ti.UI.FILL,
    height: 44,
    top: 2,
    left: 0,
    right: 0,
    layout: 'horizontal',
  });
  var secondRow = Ti.UI.createView({
    width: Ti.UI.FILL,
    height: 44,
    top: 3,
    bottom: 2,
    left: 0,
    right: 0,
    layout: 'horizontal',
  });

  // The button and file names for the front window.
  // Keep the file names the same as the label names so the click event
  // listener below knows the right name to look for!
  var itemData = [
    { name: 'sessions' },
    { name: 'login' },
    { name: 'maps' },
    { name: 'about' },
    { name: 'speakers' },
    { name: 'sponsors' }
  ];
    
  // Creating the array of "buttons". Buttons don't work well here, but views do!
  for (var i=0, ilen=itemData.length; i<ilen; i++){
    var newView = Ti.UI.createView({
      width:'32%',
      height:44,
      left: '1%',
      borderRadius: 3,
      backgroundColor: "#005198",
      label: itemData[i].name,
      name: itemData[i].name,
      layout: 'horizontal'
    });
    
    newView.setBackgroundGradient({ 
      type: 'linear', 
      colors: [{ color: '#006cca', position: 0.0 }, { color: '#005198', position: 1.0 }] ,
      startPoint: { x: 0, y: 0 },
      endPoint: { x: 0, y: 23 },
      backFillStart: false
    });
    
    newView.add(Ti.UI.createImageView({
      width: Ti.UI.SIZE,
      height: Ti.UI.SIZE,
      backgroundColor: "#005198",
      label: itemData[i].name,
      top: 10,
      left: 10,
      right: 10,
      image: '/images/dashboard/icon-' + itemData[i].name + '.png'
    }));
    
    newView.add(Ti.UI.createLabel({
      text: itemData[i].name,
      label: itemData[i].name,
      color: "#fff",
      top: 12,
      font:{fontSize:13, fontWeight:'normal'},
    }));  
    

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

  win.gridView = gridView;
  
  win.add(gridView);
  
  var updateOuterLabel = Ti.UI.createLabel({
    width: Ti.UI.FILL,
    height: 24,
    top:98,
    bottom: 4,
    left: '1%',
    right: '1%',
    layout: 'horizontal',
    backgroundColor: "#005198"
  });
  
  var updateLabelPre = Ti.UI.createLabel({
    text: 'Update status:',
    textAlign: 'left',
    left: 10,
    top: 3,
    font:{fontSize:12, fontWeight:'bold'},
    color: "#fff"
  })
  var updateLabel = Ti.UI.createLabel({
    text: 'update',
    label: 'update',
    name: 'update',
    textAlign: 'left',
    left: 10,
    top: 3,
    font:{fontSize:12, fontWeight:'normal'},
    color: "#fff"
  });
  
  updateOuterLabel.add(updateLabelPre);
  updateOuterLabel.add(updateLabel);
  
  // Set this as a variable on the win so we can update it later.
  win.updateLabel = updateLabel;
  win.add(updateOuterLabel);
  
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
    top: 126,
    views:[upcomingScheduleView,myScheduleView],
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
