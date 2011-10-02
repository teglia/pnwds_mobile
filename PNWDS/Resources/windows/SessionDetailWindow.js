/**
 * This file is part of DrupalCon Mobile.
 *
 * DrupalCon Mobile is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * DrupalCon Mobile is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with DrupalCon Mobile.  If not, see <http://www.gnu.org/licenses/>.
 */

(function() {

  DrupalCon.ui.createSessionDetailWindow = function(settings) {
    Drupal.setDefaults(settings, {
      title: 'title here',
      nid: '',
      tabGroup: undefined
    });
    var commonPadding = 15;
    var sessionDetailWindow = Titanium.UI.createWindow({
      id: 'sessionDetailWindow',
      title: settings.title,
      backgroundColor: '#FFF',
      tabGroup: settings.tabGroup
    });

    // Build session data
    var sessionData = Drupal.entity.db('main', 'node').load(settings.nid);
    
    // Build the page:
    var tvData = [];
    var blueBg = '#FFF';

    // Structure
    var tv = Ti.UI.createTableView({
      textAlign: 'left',
      layout:'vertical'
    });
    var headerRow = Ti.UI.createTableViewRow({
      height: 'auto',
      backgroundColor: blueBg,
      left: 0,
      top: -5,
      bottom: 10,
      layout: 'vertical',
      className: 'headerRow',
      backgroundImage:'images/sessionbckgd@2x.png',
      backgroundPosition:'bottom left'
    });

    var bodyRow = Ti.UI.createTableViewRow({
      hasChild: false,
      height: 'auto',
      backgroundColor: blueBg,
      left: 0,
      top: -5,
      bottom: 10,
      layout: 'vertical',
      className: 'bodyRow'
    });

    if (sessionData.title) {
      var titleLabel = Ti.UI.createLabel({
        text: cleanSpecialChars(sessionData.title),
        font: {fontSize: 28, fontWeight: 'bold'},
        textAlign: 'left',
        color: '#000',
        left: commonPadding,
        top: 18,
        bottom: 7,
        right: commonPadding,
        height: 'auto'
      });
      headerRow.add(titleLabel);
    }
    // Some sessions have multiple presenters
    if (sessionData.instructors) {
      var presenterName = Ti.UI.createLabel({
        text: cleanSpecialChars(sessionData.instructors.map(DrupalCon.util.getPresenterName).join(', ')),
        font: {fontSize:18, fontWeight:'normal'},
        color: '#000',
        left: commonPadding,
        top: 'auto',
        bottom: 5,
        right: commonPadding,
        height: 'auto'
      });
      headerRow.add(presenterName);
    }

    if (sessionData.start_date) {
      var startDate = parseISO8601(sessionData.start_date + ':00');
      var datetime = Ti.UI.createLabel({
        text: cleanDate(startDate) + ', ' + cleanTime(sessionData.start_date),
        font: {fontSize: 18, fontWeight: 'normal'},
        textAlign: 'left',
        color: '#000',
        left: commonPadding,
        top: 'auto',
        bottom: 5,
        right: 'auto',
        height: 'auto'
      });
      headerRow.add(datetime);
    }

    // Don't show a room for Lunch and Break, since what's on the web site is
    // actually completely wrong. It's hacked in for the site display, but
    // wrong for the mobile app.  We do want to show rooms for the keynotes,
    // however, which is why we can't jus exclude schedule_items.
    var skipRoom;
    if (sessionData.title === 'Lunch' || sessionData.title === 'Break' || sessionData.title.indexOf('Party') !== -1) {
      skipRoom = true;
    }

    if (sessionData.room && !skipRoom) {
      var room = Ti.UI.createLabel({
        text: sessionData.room.map(cleanSpecialChars).join(', '),
        font: {fontSize: 18, fontWeight: 'normal'},
        textAlign: 'left',
        color: '#000',
        left: commonPadding,
        top: 'auto',
        bottom: 12,
        right: commonPadding,
        height: 'auto'
      });
      headerRow.add(room);
    }

    if (sessionData.body) {
      var body = Ti.UI.createLabel({
        text: cleanSpecialChars(sessionData.body.replace('\n','\n\n')),
        backgroundColor:'#fff',
        textAlign:'left',
        color:'#000',
        left: commonPadding,
        top: 15,
        bottom: 15,
        right: commonPadding,
        height: 'auto'
      });
      bodyRow.add(body);
    }

    if (sessionData.core_problem) {
      var problemTitle = Ti.UI.createLabel({
        text:"Problem:",
        backgroundColor:'#fff',
        textAlign:'left',
        font:{fontSize:18, fontWeight:'bold'},
        color:'#000',
        left: commonPadding,
        top: 10,
        bottom: 'auto',
        right: commonPadding,
        height: 'auto'
      });
      bodyRow.add(problemTitle);

      var coreProblem = Ti.UI.createLabel({
        text: cleanSpecialChars(sessionData.core_problem.replace('\n','\n\n')),
        backgroundColor:'#fff',
        textAlign:'left',
        color:'#000',
        left: commonPadding,
        top: 5,
        bottom: 10,
        right: commonPadding,
        height: 'auto'
      });
      bodyRow.add(coreProblem);
    }

    if (sessionData.core_solution) {
      var solutionTitle = Ti.UI.createLabel({
        text:"Solution:",
        backgroundColor:'#fff',
        textAlign:'left',
        font:{fontSize:18, fontWeight:'bold'},
        color:'#000',
        left: commonPadding,
        top: 10,
        bottom: 'auto',
        right: commonPadding,
        height: 'auto'
      });
      bodyRow.add(solutionTitle);

      var coreSolution = Ti.UI.createLabel({
        text: cleanSpecialChars(sessionData.core_solution.replace('\n','\n\n')),
        backgroundColor:'#fff',
        textAlign:'left',
        color:'#000',
        left: commonPadding,
        top: 5,
        bottom: 10,
        right: commonPadding,
        height: 'auto'
      });
      bodyRow.add(coreSolution);
    }

    tvData.push(headerRow);

    if (sessionData.type === 'session') {
      var feedbackTitle = Ti.UI.createLabel({
        text:"Rate this session",
        backgroundColor:'#3782a8',
        textAlign:'left',
        font:{fontSize:18, fontWeight:'bold'},
        color:'#fff',
        left: commonPadding,
        right: commonPadding,
        height: 50
      });

      var feedbackRow = Ti.UI.createTableViewRow({
        hasChild: true,
        layout:'vertical',
        height: 50,
        className: 'feedbackRow',
        backgroundColor:'#3782A9'
      });
      feedbackRow.add(feedbackTitle);

      feedbackRow.addEventListener('click', function(e) {
        var currentTab = (Ti.Platform.name == 'android') ? currentTab = Titanium.UI.currentTab : sessionDetailWindow.tabGroup.activeTab;
        currentTab.open(DrupalCon.ui.createFeedbackWindow({
          title: settings.title,
          address: 'http://chicago2011.drupal.org/node/add/eval/' + settings.nid,
          //address: 'http://google.com',
          tabGroup: currentTab
        }), {animated:true});
      });

      tvData.push(feedbackRow);
    }

    tvData.push(bodyRow);

    if (sessionData.audience) {
      var audienceRow = Ti.UI.createTableViewRow({height: 'auto', className: 'audienceRow', borderColor: '#fff'});

      var textViewBottom = Ti.UI.createView({
        height: 'auto',
        layout: 'vertical',
        backgroundColor: '#fff',
        textAlign: 'left',
        color: '#000',
        left: commonPadding,
        right: commonPadding
      });

      var audienceTitle = Ti.UI.createLabel({
        text:"Intended Audience",
        backgroundColor:'#fff',
        textAlign:'left',
        font:{fontSize:18, fontWeight:'bold'},
        color:'#000',
        left: 0,
        top: 20,
        bottom: 0,
        right: commonPadding,
        height: 'auto'
      });
      textViewBottom.add(audienceTitle);

      var audience = Ti.UI.createLabel({
        text:sessionData.audience.replace('\n','\n\n'),
        backgroundColor:'#fff',
        textAlign:'left',
        color:'#000',
        height:'auto',
        width:'auto',
        left:0,
        right:0,
        top:10,
        bottom:15
      });

      textViewBottom.add(audience);
      audienceRow.add(textViewBottom);
      tvData.push(audienceRow);
    }


    if (sessionData.instructors && sessionData.instructors.length) {
      // Get the presenter information.
      var presenterData = Drupal.entity.db('main', 'user').loadByField('name', sessionData.instructors);

      for (var j in presenterData) {
        tvData.push(renderPresenter(presenterData[j]));
      }
    }

    tv.addEventListener('click', function(e) {
      if (e.source.presenter != undefined){
        var fullName = e.source.presenter.full_name || '';
        var currentTab = (Ti.Platform.name == 'android') ? Titanium.UI.currentTab : sessionDetailWindow.tabGroup.activeTab;
        currentTab.open(DrupalCon.ui.createPresenterDetailWindow({
          title: fullName,
          uid: e.source.presenter.uid,
          tabGroup: currentTab
        }), {animated:true});
      }
    });    
    tv.setData(tvData);
    sessionDetailWindow.add(tv);

    return sessionDetailWindow;
  };

  function renderPresenter(presenter) {

    var userPict = avatarPath(presenter.uid);

    var av = Ti.UI.createImageView({
      image:userPict,
      left:0,
      top:0,
      height:80,
      width:80,
      defaultImage:'images/userpict-large.png',
      backgroundColor: '#000'
    });

    var presRow = Ti.UI.createTableViewRow({
      presenter: presenter,
      height: 80,
      className: 'presenterRow',
      borderColor: '#fff',
      hasChild: true,
      backgroundColor: '#C4E2EF',
      layout:'vertical'
    });
    presRow.add(av);
    var presenterFullName2 = Ti.UI.createLabel({
      presenter: presenter,
      text: cleanSpecialChars(presenter.full_name),
      font: {fontSize:18, fontWeight:'bold'},
      left: 90,
      top: -70,
      height: 'auto',
      color: '#000'
    });
    dpm(presenter.full_name);
    var presenterName2 = Ti.UI.createLabel({
      presenter: presenter,
      text: presenter.name,
      font:{fontSize:14, fontWeight:'normal'},
      left: 90,
      top: (presenter.full_name != null) ? 5 : 0,
      height: 'auto',
      color: "#04679C"
    });

    presRow.add(presenterFullName2);
    presRow.add(presenterName2);

    return presRow;
  }

})();

