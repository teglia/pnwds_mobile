exports.newWin = function(navController) {
var pnwdsnet = require( '/includes/network' );

// Define the variable win to contain the current window
var win = Ti.UI.createWindow({
  child: true,
  backgroundColor: '#fff',
  barImage: '/images/iphone-nav.png',
});

// Create a new scroll view
var view = Ti.UI.createScrollView({
	contentWidth:'auto',
	contentHeight:'auto',
	showVerticalScrollIndicator:true,
	showHorizontalScrollIndicator:true,
	top: 0,
});

// Add the view to the window
win.add(view);

// Create the labelfor the username
var usernameLabel = Ti.UI.createLabel({
	text:'Username',
	font:{fontSize:14, fontWeight: "bold"},
	left:10,
	top:10,
	width:300,
	height:'auto'
});

var comingsoonLabel = Ti.UI.createLabel({
  text:'Coming Soon: Soon, there will be a sync function to syncronize your flags here with those on the site. Stay tuned for updates!',
  font:{fontSize:14, fontWeight: "bold"},
  left:10,
  top:10,
  width:300,
  height:'auto'
});
view.add(comingsoonLabel);

// Add the label to the view
//view.add(usernameLabel);

// Create the username textfield
var usernameTextfield = Ti.UI.createTextField({
	height:35,
	top:30,
	left:10,
	width:300,
	font:{fontSize:16},
	borderWidth:2,
	borderColor:'#bbb',
	borderRadius:5,
	autocapitalization:Ti.UI.TEXT_AUTOCAPITALIZATION_NONE,
});

// Add the textfield to the view
//view.add(usernameTextfield);

// Create the label for the password
var passwordLabel = Ti.UI.createLabel({
	text:'Password',
	font:{fontSize:14, fontWeight: "bold"},
	left:10,
	top:75,
	width:300,
	height:'auto'
});

// Add the label to the view
//view.add(passwordLabel);

// Create the password textfield
var passwordTextfield = Ti.UI.createTextField({
	height:35,
	top:100,
	left:10,
	width:300,
	font:{fontSize:16},
	borderWidth:2,
	borderColor:'#bbb',
	borderRadius:5,
	// This is very important. Don't auto capitalize the first letter of the password
	autocapitalization:Ti.UI.TEXT_AUTOCAPITALIZATION_NONE,
	// Mask the password so nobody sees it
	passwordMask:true,
});

// Add the textarea to the view
//view.add(passwordTextfield);

// Create the login button
var loginButton = Ti.UI.createButton({
	title:'Login',
	height:40,
	width:200,
	top:170
});

// Create the update button
var updateButton = Ti.UI.createButton({
  title:'Manually Update',
  height:40,
  width:200,
  top:220
});

// Create the reset button
var resetButton = Ti.UI.createButton({
  title:'Reset the App',
  height:40,
  width:200,
  top:270
});

// Add the button to the view
//view.add(loginButton);
view.add(updateButton);
// view.add(resetButton);


// Add the event listener for when the button is created
loginButton.addEventListener('click', function() {
	
	// alert("Clicked button loginButton");
	
	// Create an object to hold the data entered in the form
	var user = {
		username: usernameTextfield.value,
		password: passwordTextfield.value,
	}
	
	// Define the url which contains the full url
	// in this case, we'll connecting to http://example.com/api/rest/user/login
	var url = pnwdsnet.restPath + 'user/login';

	// Create a connection
	var xhr = Ti.Network.createHTTPClient();
		
	// Open the connection using POST
	xhr.open("POST",url);

	xhr.setRequestHeader('Content-Type','application/json; charset=utf-8');

	// Send the connection and the user object as argument
	xhr.send(user);
	
	// When the connection loads we do:
	xhr.onload = function() {
		// Save the status of the connection in a variable
		// this will be used to see if we have a connection (200) or not
		var statusCode = xhr.status;

		// Check if we have a valid status
		if(statusCode == 200) {
			
			// Create a variable response to hold the response
			var response = xhr.responseText;
			
			// Parse (build data structure) the JSON response into an object (data)
			var data = JSON.parse(response);
			
			// Set a global variable
			Ti.App.Properties.setInt("userUid", data.user.uid);
			Ti.App.Properties.setInt("userSessionId", data.sessid);
			Ti.App.Properties.setInt("userSessionName", data.sesion_name);
			
			// Create another connection to get the user
			var xhr2 = Ti.Network.createHTTPClient();
			
			var getUser = pnwdsnet.restPath + 'user/' + data.user.uid + '.json';
			
			xhr2.open("GET", getUser);
			xhr2.send();
			
			xhr2.onload = function() {
				var userStatusCode = xhr2.status;
								
				if(userStatusCode == 200) {
					var userResponse = xhr2.responseText;
					var user = JSON.parse(userResponse);
					
					alert("Welcome " + user.name);
					// Set the user.userName to the logged in user name
					Ti.App.Properties.setString("userName", user.name);
					//Ti.API.fireEvent('syncFlags');
					
					// Close the window
					win.close();
				}
			}
		}
		else {
			alert("There was an error");
		}
	}
});

updateButton.addEventListener('click', function(e){
  pnwdsnet.checkUpdates(navController);
});

resetButton.addEventListener('click', function(e){
  Ti.App.Properties.removeProperty('pnwdsSiteLastUpdated');  
  Ti.App.Properties.removeProperty('pnwdsAppLastUpdated');
  pnwdsdb.removedb();
  pnwdsnet.checkUpdates(navController);
  pnwdsnet.seedspeakers();
});

// Add the logout button
var logoutButton = Titanium.UI.createButton({
  title:'Logout',
  height:40,
  width:200,
  top:320
});

// Add the button to the window
//win.add(logoutButton);

// Add the event listener for when the button is created
logoutButton.addEventListener('click', function() {
  
  // Define the url which contains the full url
  // in this case, we'll connecting to http://example.com/api/rest/user/logout
  var logoutUrl = Titanium.App.Properties.getString("restPath") + 'user/logout';

  // Create a connection
  var xhr3 = Titanium.Network.createHTTPClient();
  
  xhr3.setRequestHeader('Content-Type','application/json; charset=utf-8');
  
  // Open the connection
  xhr3.open("POST",logoutUrl);

  // Send the connection
  xhr3.send();
  
  // When the connection loads we do:
  xhr3.onload = function() {
    // Save the status of the connection in a variable
    // this will be used to see if we have a connection (200) or not
    var statusCodeLogout = xhr3.status;
    // Check if we have a connection
    if(statusCodeLogout == 200) {
      Titanium.App.Properties.removeProperty("userUid");
      Titanium.App.Properties.removeProperty("userSessionId");
      Titanium.App.Properties.removeProperty("userSessionName");
      Titanium.App.Properties.removeProperty("userName");
            
      alert("Goodbye");
    }
    else {
      alert("You're not currently logged in");
      // We remvoe all the properties since the user is requesting to logout
      // is probably not logged in but the properties are set
      Titanium.App.Properties.removeProperty("userUid");
      Titanium.App.Properties.removeProperty("userSessionId");
      Titanium.App.Properties.removeProperty("userSessionName");
      Titanium.App.Properties.removeProperty("userName");
    }
  }
});


return win;
}