var pnwdsdb = {};

/**
 * Make sure the db is instantiated, create tables if they don't already exist.
 *
 */
pnwdsdb.bootstrap = function() {
	// var db = Ti.Database.open('pnwdsbr');
  var db = Ti.Database.install('/includes/pnwdsds.sql', 'pnwdsbr');
	//db.execute('CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY, username TEXT, firstname TEXT, lastname TEXT, photo TEXT, uid INTEGER, company TEXT, bio TEXT, twitter TEXT, linkedin TEXT, website TEXT);');
	//db.execute('CREATE TABLE IF NOT EXISTS sessions(id INTEGER PRIMARY KEY, title TEXT, body TEXT, nid INTEGER, flagged INTEGER, speakers TEXT, timeslot TEXT, timeslotname TEXT, room TEXT, uid TEXT);');
	//db.execute('CREATE TABLE IF NOT EXISTS flag(id INTEGER PRIMARY KEY, nid INTEGER);');
	db.close();
}
/*********** Users functions **************/

/**
 * List all users.
 *
 */
pnwdsdb.userslist = function() {
	var userList = [];
	var db = Ti.Database.open('pnwdsbr');
	var result = db.execute('SELECT * FROM users;');
	while (result.isValidRow()) {
		userList.push({
			//add these attributes for the benefit of a table view
			title : result.fieldByName('lastname'),
			uid : result.fieldByName('uid'), //custom data attribute to pass to detail page
			hasChild : true,
			//add actual db fields
			name : result.fieldByName('username'),
			firstname : result.fieldByName('firstname'),
			lastname : result.fieldByName('lastname'),
			uid : result.fieldByName('uid'),
			photo : result.fieldByName('photo'),
			company : result.fieldByName('company'),
			bio : result.fieldByName('bio'),
			linkedin : result.fieldByName('linkedin'),
			twitter : result.fieldByName('twitter'),
			website : result.fieldByName('website'),
		});
		result.next();
	}
	result.close();
	//make sure to close the result set
	db.close();

	return userList;
};

/**
 * Get individual user record via username.
 *
 */
pnwdsdb.usersget = function(_username) {
	var user = [];
	var db = Ti.Database.open('pnwdsbr');
	var result = db.execute('SELECT * FROM users WHERE username = ?;', _username);
	while (result.isValidRow()) {
		var photoTag = result.fieldByName('photo');
		var photo = '';

		// Return either the local file for display or the url on the site.
		if (photoTag.indexOf("file") == 0) {
			photo = photoTag;
		} else {
			var photoTag = result.fieldByName('photo');
			var imageUrl = photoTag.match('<img[^>]+src=\"([^\"]+)\"')[1];

			photo = imageUrl;
		}

		user.push({
			//add these attributes for the benefit of a table view
			title : result.fieldByName('firstname') + ' ' + result.fieldByName('lastname'),
			uid : result.fieldByName('uid'), //custom data attribute to pass to detail page
			hasChild : true,
			//add actual db fields
			username : result.fieldByName('username'),
			firstname : result.fieldByName('firstname'),
			lastname : result.fieldByName('lastname'),
			uid : result.fieldByName('uid'),
			company : result.fieldByName('company'),
			bio : result.fieldByName('bio'),
			linkedin : result.fieldByName('linkedin'),
			twitter : result.fieldByName('twitter'),
			website : result.fieldByName('website'),
			photo : photo
		});
		result.next();
	}
	result.close();
	//make sure to close the result set
	db.close();

	return user;
};
/**
 * Get individual user record via uid.
 *
 */
pnwdsdb.usersgetbyuid = function(_uid) {
	var user = [];
	var db = Ti.Database.open('pnwdsbr');
	var result = db.execute('SELECT * FROM users WHERE uid = ?;', _uid);
	while (result.isValidRow()) {
		var photoTag = result.fieldByName('photo');
		var imageUrl = photoTag.match('<img[^>]+src=\"([^\"]+)\"')[1];

		//get the name of the image to check if it saved locally
		var imageName = imageUrl.split('/');
		imageName = imageName[imageName.length - 1];

		user.push({
			//add these attributes for the benefit of a table view
			title : result.fieldByName('firstname') + ' ' + result.fieldByName('lastname'),
			uid : result.fieldByName('uid'), //custom data attribute to pass to detail page
			hasChild : true,
			//add actual db fields
			username : result.fieldByName('username'),
			firstname : result.fieldByName('firstname'),
			lastname : result.fieldByName('lastname'),
			uid : result.fieldByName('uid'),
			company : result.fieldByName('company'),
			bio : result.fieldByName('bio'),
			linkedin : result.fieldByName('linkedin'),
			twitter : result.fieldByName('twitter'),
			website : result.fieldByName('website'),
			imageUrl : imageUrl,
			imageName : imageName,
		});
		result.next();
	}
	result.close();
	//make sure to close the result set
	db.close();

	return user;
};
/**
 * Add single user record.
 *
 */
pnwdsdb.usersadd = function(_uid, _username, _firstname, _lastname, _photo, _company, _bio, _twitter, _linkedin, _website) {
	var db = Ti.Database.open('pnwdsbr');
	db.execute("INSERT INTO users(uid,username,firstname,lastname,photo,company,bio,twitter,linkedin,website) VALUES(?,?,?,?,?,?,?,?,?,?)", _uid, _username, _firstname, _lastname, _photo, _company, _bio, _twitter, _linkedin, _website);
	db.close();

	//Dispatch a message to let others know the database has been updated
	Ti.App.fireEvent("userlistUpdated");
};

/*********** Sessions functions **************/

/**
 * List all sessions.
 * returns full session details in array.
 *
 */
pnwdsdb.sessionslist = function() {
	var sessionList = [];
	var db = Ti.Database.open('pnwdsbr');
	var result = db.execute('SELECT * FROM sessions ORDER by timeslot;');
	while (result.isValidRow()) {
		sessionList.push({
			//add these attributes for the benefit of a table view
			title : result.fieldByName('title'),
			nid : result.fieldByName('nid'),
			speakers : result.fieldByName('speakers'),
			timeslot : result.fieldByName('timeslot'),
			timeslotname : result.fieldByName('timeslotname'),
			room : result.fieldByName('room'),
			hasChild : true
		});
		result.next();
	}
	result.close();
	//make sure to close the result set
	db.close();

	return sessionList;
};

/**
 * List all sessions.
 * returns full session details in array.
 *
 */
pnwdsdb.mysessionslist = function() {
	var sessionList = [];
	var db = Ti.Database.open('pnwdsbr');
	var result = db.execute('SELECT * FROM sessions where flagged = 1 ORDER by timeslot;');
	while (result.isValidRow()) {
		sessionList.push({
			//add these attributes for the benefit of a table view
			title : result.fieldByName('title'),
			nid : result.fieldByName('nid'),
			speakers : result.fieldByName('speakers'),
			timeslot : result.fieldByName('timeslot'),
			timeslotname : result.fieldByName('timeslotname'),
			room : result.fieldByName('room'),
			hasChild : true
		});
		result.next();
	}
	result.close();
	//make sure to close the result set
	db.close();

	return sessionList;
};

/**
 * List all sessions.
 * returns full session details in array.
 *
 */
pnwdsdb.upcomingsessionslist = function() {
  var sessionList = [];
  var currentTime = new Date();
  var nowTime = currentTime.getTime();
  var endTime = nowTime + 3600;
  nowTime = nowTime + ' to ' + endTime;
  Ti.API.info("Nowtime is: " + nowTime);
  var db = Ti.Database.open('pnwdsbr');
  var result = db.execute('SELECT * FROM sessions where timeslot > ? ORDER by timeslot;', nowTime);
  while (result.isValidRow()) {
    sessionList.push({
      //add these attributes for the benefit of a table view
      title : result.fieldByName('title'),
      nid : result.fieldByName('nid'),
      speakers : result.fieldByName('speakers'),
      timeslot : result.fieldByName('timeslot'),
      timeslotname : result.fieldByName('timeslotname'),
      room : result.fieldByName('room'),
      hasChild : true
    });
    result.next();
  }
  result.close();
  //make sure to close the result set
  db.close();

  return sessionList;
};


/**
 * Get single session via nid.
 *
 */
pnwdsdb.sessionsget = function(_nid) {
	var session = [];
	var db = Ti.Database.open('pnwdsbr');
	var result = db.execute('SELECT * FROM sessions WHERE nid = ? ORDER BY room ASC;', _nid);
	while (result.isValidRow()) {
		session.push({
			//add these attributes for the benefit of a table view
			title : result.fieldByName('title'),
			nid : result.fieldByName('nid'),
			body : result.fieldByName('body'),
			flagged : result.fieldByName('flagged'),
			speakers : result.fieldByName('speakers'),
			timeslot : result.fieldByName('timeslot'),
			timeslotname : result.fieldByName('timeslotname'),
			room : result.fieldByName('room'),
			hasChild : true
		});
		result.next();
	}
	result.close();
	//make sure to close the result set
	db.close();

	return session;
};

/**
 * Get single session via nid.
 *
 */
pnwdsdb.sessionsgetbyuser = function(_uid) {
	var sessions = [];
	var db = Ti.Database.open('pnwdsbr');
	var userResult = db.execute('SELECT * FROM users WHERE uid = ?;', _uid);

	while (userResult.isValidRow()) {
		var user = userResult.fieldByName('username')
		userResult.next();
	}
	userResult.close();
	var query = "SELECT * FROM sessions WHERE sessions.speakers LIKE \'%"+user+"%\' ORDER BY room ASC;"
	var result = db.execute(query);
	while (result.isValidRow()) {
		sessions.push({
			//add these attributes for the benefit of a table view
			title : result.fieldByName('title'),
			nid : result.fieldByName('nid'),
			body : result.fieldByName('body'),
			flagged : result.fieldByName('flagged'),
			speakers : result.fieldByName('speakers'),
			timeslot : result.fieldByName('timeslot'),
			timeslotname : result.fieldByName('timeslotname'),
			room : result.fieldByName('room'),
			hasChild : true
		});
		result.next();
	}
	result.close();
	//make sure to close the result set
	db.close();

	return sessions;
};

/**
 * Add a single session.
 *
 */
pnwdsdb.sessionsadd = function(_title, _body, _nid, _speakers, _timeslot, _timeslotname, _room, _uid) {
	var db = Ti.Database.open('pnwdsbr');

	db.execute("INSERT INTO sessions(title,body,nid,speakers,timeslot,timeslotname,room,uid) VALUES(?,?,?,?,?,?,?,?)", _title, _body, _nid, _speakers, _timeslot, _timeslotname, _room, _uid);
	db.close();
	Ti.App.fireEvent("databaseUpdated");
};

/**
 * Delete a single session via nid.
 *
 */
pnwdsdb.sessionsdel = function(_nid) {
	var db = Ti.Database.open('pnwdsbr');
	db.execute("DELETE FROM sessions WHERE nid = ?", _nid);
	db.close();
	Ti.App.fireEvent("databaseUpdated");
};

/**
 * Update a session.
 *
 */
pnwdsdb.sessionsupdate = function(_title, _body, _nid, _speakers, _timeslot, _timeslotname, _room) {
	var db = Ti.Database.open('pnwdsbr');
	db.execute("UPDATE sessions SET title = ?, body = ?, nid = ?, speakers = ?, timeslot = ?, timeslotname = ?, room = ? WHERE nid = ?", _title, _body, _nid, _speakers, _timeslot, _timeslotname, _room);
	db.close();

	//Dispatch a message to let others know the database has been updated
	Ti.App.fireEvent("databaseUpdated");
};

/**
 * Flag a session.
 * TODO - should call network flag event.
 *
 */
pnwdsdb.sessionsflag = function(_flag, _nid) {
	var db = Ti.Database.open('pnwdsbr');
	db.execute("UPDATE sessions SET flagged = ? WHERE nid = ?", _flag, _nid);
	db.close();

	//Dispatch a message to let others know the database has been updated
	Ti.App.fireEvent("databaseUpdated");
};

/**
 * Clear all sessions and users data from the db.
 *
 */
pnwdsdb.sessionsclear = function() {
	var db = Ti.Database.open('pnwdsbr');
	db.execute('DELETE FROM sessions;');
	// db.execute('DELETE FROM flag');
	db.execute('CREATE TABLE IF NOT EXISTS sessions(id INTEGER PRIMARY KEY, title TEXT, body TEXT, nid INTEGER, flagged INTEGER, speakers TEXT, timeslot TEXT, timeslotname TEXT, room TEXT, uid TEXT);');
	//db.execute('CREATE TABLE IF NOT EXISTS flag(id INTEGER PRIMARY KEY, nid INTEGER);');
	db.close();
}

pnwdsdb.speakersclear = function() {
	var db = Ti.Database.open('pnwdsbr');
	db.execute('DELETE FROM users');
	// db.execute('DELETE FROM flag');
	db.execute('CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY, username TEXT, firstname TEXT, lastname TEXT, photo TEXT, uid INTEGER, company TEXT, bio TEXT, twitter TEXT, linkedin TEXT, website TEXT);');
	db.close();
}

pnwdsdb.flagsclear = function() {
	var db = Ti.Database.open('pnwdsbr');
	db.execute('DELETE FROM flag');
	db.execute('CREATE TABLE IF NOT EXISTS flag(id INTEGER PRIMARY KEY, nid INTEGER);');
	db.close();
}

pnwdsdb.removedb = function() {
	var db = Ti.Database.open('pnwdsbr');
	db.remove();
	pnwdsdb.bootstrap();
}
// Export the functions.
module.exports = pnwdsdb;
