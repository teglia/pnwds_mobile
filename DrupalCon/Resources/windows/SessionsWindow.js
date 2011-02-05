/*
 * This is the page of session listings.
 */
(function() {

  DrupalCon.ui.createSessionsWindow = function(settings) {
    Drupal.setDefaults(settings, {
      title: 'title here',
      start_date: '',
      end_date: '',
      tabGroup: undefined
    });
  
    var sessionsWindow = Titanium.UI.createWindow({
      id: 'sessionsWindow',
      title: 'Sessions',
      backgroundColor: '#FFF',
      tabGroup: settings.tabGroup
    });

    var lastTime = '';
    var data = [];

    var conn = Drupal.db.getConnection('main');
    var rows = conn.query("SELECT nid, title, changed, start_date, end_date FROM node WHERE start_date >= ? AND end_date <= ? ORDER BY start_date, nid", [settings.start_date, settings.end_date]);

    var nids = [];
    while(rows.isValidRow()) {
      Ti.API.info('Nid is: ' + rows.fieldByName('nid'));
      nids.push(rows.fieldByName('nid'));
      rows.next();
    }
    rows.close();

    var sessions = Drupal.entity.db('main', 'node').loadMultiple(nids, ['start_date', 'nid']);

    var session;
    Ti.API.info('Num sessions: ' + sessions.length);
    for (var sessionNum = 0, numSessions = sessions.length; sessionNum < numSessions; sessionNum++) {
      session = sessions[sessionNum];
      var sessionRow = Ti.UI.createTableViewRow({
        hasChild: true,
        selectedColor: '#fff',
        backgroundColor: '#fff',
        color: '#000',
        className: 'session-row',
        start_date: session.start_date,
        end_date: session.end_date,
        nid: session.nid,
        sessionTitle: cleanSpecialChars(session.title),
        height: 'auto',
        layout: 'vertical'
      });

      // If there is a new session time, insert a header in the table.
      if (lastTime == '' || session.start_date != lastTime) {
        lastTime = session.start_date;
        sessionRow.header = cleanTime(lastTime) + " - " + cleanTime(session.end_date);
      }

      var sessionTitle = Ti.UI.createLabel({
        text: cleanSpecialChars(session.title),
        font: {fontSize:18, fontWeight:'bold'},
        left: 10,
        top: 10,
        right: 10,
        height: 'auto'
      })
      sessionRow.add(sessionTitle);

      var sessionTrack = Ti.UI.createLabel({
        text: session.track + " track",
        font: {fontSize:12, fontWeight:'bold'},
        left: 10,
        right: 10,
        height: 'auto'
      })
      sessionRow.add(sessionTrack);

      // Some sessions have multiple presenters
      var names = getPresenterData(session.instructors);

      var nameList = '';
      for(var i in names) {
        if (names[i].fullName) {
          nameList += names[i].fullName + ', ';
        }
        else {
          nameList += names[i].data.name + ', ';
        }
      }
      nameList = nameList.slice(0, nameList.length-2)
      var instructors = Ti.UI.createLabel({
        text: nameList,
        font: {fontSize:10, fontWeight:'normal'},
        left: 10,
        top: 'auto',
        bottom: 10,
        right: 10,
        height: 'auto'
      })
      sessionRow.add(instructors);

      // Some things, like keynote, have multiple rooms
      var room = [];
      if (typeof session.room === 'string') {
        room.push(session.room);
      }
      else {
        room = session.room;
      }
      var roomNames = '';
      for(var i in room) {
        roomNames += cleanSpecialChars(room[i]) + ', ';
      }
      roomNames = roomNames.slice(0, roomNames.length-2)
      var sessionRoom = Ti.UI.createLabel({
        text:roomNames,
        font:{fontSize:12, fontWeight:'bold'},
        left: 10,
        top: 'auto',
        bottom: 10,
        right: 10,
        height: 'auto'
      })
      sessionRow.add(sessionRoom);

      data.push(sessionRow);
    }

    // create table view
    var tableview = Titanium.UI.createTableView({
      data: data,
      backgroundColor: '#fff'
    });

    // create table view event listener
    tableview.addEventListener('click', function(e) {
      if (Ti.Platform.name == 'android') {
        var currentTab = Titanium.UI.currentTab;
      }
      else {
        var currentTab = sessionsWindow.tabGroup.activeTab;
      }
      currentTab.open(DrupalCon.ui.createSessionDetailWindow({
        title: e.rowData.sessionTitle,
        nid: e.rowData.nid,
        tabGroup: Titanium.UI.currentTab
      }), {animated:true});
    });

    // add table view to the window
    sessionsWindow.add(tableview);


    return sessionsWindow;
  };

})();

