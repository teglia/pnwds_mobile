var pnwdsdb = {};

/**
 * Make sure the db is instantiated, create tables if they don't already exist.
 * 
 */
pnwdsdb.bootstrap = function() {
  var db = Ti.Database.open('pnwds');
  db.execute('CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY, name TEXT, fullname TEXT, photo TEXT, uid INTEGER);');
  db.execute('CREATE TABLE IF NOT EXISTS sessions(id INTEGER PRIMARY KEY, title TEXT, body TEXT, nid INTEGER, flagged INTEGER, speakers TEXT, timeslot TEXT, room TEXT, uid TEXT);');
  db.execute('CREATE TABLE IF NOT EXISTS flag(id INTEGER PRIMARY KEY, nid INTEGER);');
  db.close();
}

/*********** Users functions **************/

/**
 * List all users.
 * 
 */
pnwdsdb.userslist = function() {
  var userList = [];
  var db = Ti.Database.open('pnwds');
  var result = db.execute('SELECT * FROM users;');
  while (result.isValidRow()) {
    userList.push({
      //add these attributes for the benefit of a table view
      title: result.fieldByName('fullname'),
      uid: result.fieldByName('uid'), //custom data attribute to pass to detail page
      hasChild:true,
      //add actual db fields
      name: result.fieldByName('name'),
      fullname: result.fieldByName('fullname'),
      uid: result.fieldByName('uid'),
      photo: result.fieldByName('photo')
    });
    result.next();
  }
  result.close(); //make sure to close the result set
  db.close();

  return userList;
};

/**
 * Get individual user record via uid.
 * 
 */
pnwdsdb.usersget = function(_uid) {
  var user = [];
  var db = Ti.Database.open('pnwds');
  var result = db.execute('SELECT * FROM users WHERE uid = ?;',_uid);
  while (result.isValidRow()) {
    user.push({
      //add these attributes for the benefit of a table view
      title: result.fieldByName('name'),
      uid: result.fieldByName('uid'), //custom data attribute to pass to detail page
      hasChild:true,
      //add actual db fields
      name: result.fieldByName('name'),
      fullname: result.fieldByName('fullname'),
      uid: result.fieldByName('uid'),
      photo: result.fieldByName('photo')
    });
    result.next();
  }
  result.close(); //make sure to close the result set
  db.close();

  return user;
};

/**
 * Add single user record.
 * 
 */
pnwdsdb.usersadd = function(_uid,_name,_fullname) {
  var db = Ti.Database.open('pnwds');
  db.execute("INSERT INTO users(uid,name,fullname) VALUES(?,?)",_uid,_name,_fullname);
  db.close();

  //Dispatch a message to let others know the database has been updated
  Ti.App.fireEvent("databaseUpdated");
};

/**
 * Delete user record via uid.
 * 
 */
pnwdsdb.usersdel = function(_uid) {
  var db = Ti.Database.open('pnwds');
  db.execute("DELETE FROM users WHERE uid = ?",_uid);
  db.close();
  Ti.App.fireEvent("databaseUpdated");
};

/**
 * Update individual user record.
 * 
 */
pnwdsdb.usersupdate = function(_uid,_name,_fullname,_photo) {
  var db = Ti.Database.open('pnwds');
  db.execute("UPDATE users SET name = ?, fullname = ?, photo = ? WHERE uid = ?",_name,_fullname,_uid,_photo);
  db.close();
  Ti.App.fireEvent("databaseUpdated");
};


/*********** Sessions functions **************/

/**
 * List all sessions.
 * returns full session details in array.
 * 
 */
pnwdsdb.sessionslist = function() {
  var sessionList = [];
  var db = Ti.Database.open('pnwds');
  var result = db.execute('SELECT * FROM sessions;');
  while (result.isValidRow()) {
    sessionList.push({
      //add these attributes for the benefit of a table view
      title: result.fieldByName('title'),
      nid: result.fieldByName('nid'),
      speakers: result.fieldByName('speakers'),
      timeslot: result.fieldByName('timeslot'),
      room: result.fieldByName('room'),
      hasChild:true
    });
    result.next();
  }
  result.close(); //make sure to close the result set
  db.close();

  return sessionList;
};

/**
 * Get single session via nid.
 * 
 */
pnwdsdb.sessionsget = function(_nid) {
  var session = [];
  var db = Ti.Database.open('pnwds');
  var result = db.execute('SELECT * FROM sessions WHERE nid = ? ORDER BY room ASC;',_nid);
  while (result.isValidRow()) {
    session.push({
      //add these attributes for the benefit of a table view
      title: result.fieldByName('title'),
      nid: result.fieldByName('nid'),
      body: result.fieldByName('body'),
      speakers: result.fieldByName('speakers'), 
      timeslot: result.fieldByName('timeslot'),
      room: result.fieldByName('room'),
      hasChild:true
    });
    result.next();
  }
  result.close(); //make sure to close the result set
  db.close();

  return session;
};

/**
 * Add a single session.
 * 
 */
pnwdsdb.sessionsadd = function(_title,_body,_nid,_speakers,_timeslot,_room,_uid) {
  var db = Ti.Database.open('pnwds');
  Ti.API.info("Adding: \n " 
    + _nid + "\n" 
    + _speakers + "\n"
    + _timeslot + "\n"
    + _room + "\n"
    + _uid + "\n"
    + _title + "\n"
    + _body 
  );

  db.execute("INSERT INTO sessions(title,body,nid,speakers,timeslot,room,uid) VALUES(?,?,?,?,?,?,?)",_title,_body,_nid,_speakers,_timeslot,_room,_uid);
  db.close();
  Ti.API.info("Added " + _nid + _speakers + _timeslot+ _room+_uid+ _title + _body );
  Ti.App.fireEvent("databaseUpdated");
};

/**
 * Delete a single session via nid.
 * 
 */
pnwdsdb.sessionsdel = function(_nid) {
  var db = Ti.Database.open('pnwds');
  db.execute("DELETE FROM sessions WHERE nid = ?",_nid);
  db.close();
  Ti.App.fireEvent("databaseUpdated");
};

/**
 * Update a session.
 * 
 */
pnwdsdb.sessionsupdate = function(_title,_body,_nid,_speakers,_timeslot,_room) {
  var db = Ti.Database.open('pnwds');
  db.execute("UPDATE sessions SET title = ?, body = ?, nid = ?, speakers = ?, timeslot = ?, room = ? WHERE nid = ?",_title,_body,_nid,_speakers,_timeslot,_room);
  db.close();

  //Dispatch a message to let others know the database has been updated
  Ti.App.fireEvent("databaseUpdated");
};

/**
 * Flag a session. 
 * TODO - should call network flag event.
 *
 */
pnwdsdb.sessionsflag = function(_flag,_nid) {
  var db = Ti.Database.open('pnwds');
  db.execute("UPDATE sessions SET flag = ? WHERE nid = ?",_flag,_nid);
  db.close();

  //Dispatch a message to let others know the database has been updated
  Ti.App.fireEvent("databaseUpdated");
};

/**
 * Clear all sessions and users data from the db.
 * 
 */
pnwdsdb.sessionsclear = function() {
  var db = Ti.Database.open('pnwds');
  // db.remove();
  db.execute('DELETE FROM sessions;');
  db.execute('DELETE FROM users');
  // db.execute('DELETE FROM flag');
  db.execute('CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY, name TEXT, fullname TEXT, photo TEXT, uid INTEGER);');
  db.execute('CREATE TABLE IF NOT EXISTS sessions(id INTEGER PRIMARY KEY, title TEXT, body TEXT, nid INTEGER, flagged INTEGER, speakers TEXT, timeslot TEXT, room TEXT, uid TEXT);');
  // db.execute('CREATE TABLE IF NOT EXISTS flag(id INTEGER PRIMARY KEY, nid INTEGER);');
  db.close();
}

  // //determine if the database needs to be seeded
  // Ti.App.Properties.removeProperty('seeded');
  // if (!Ti.App.Properties.hasProperty('seeded')) {
    // Ti.App.Properties.setString('seeded','yes');
  // }
//   

// Export the functions.
module.exports = pnwdsdb;