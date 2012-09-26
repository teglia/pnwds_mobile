exports.newWin = function(navController) {
var pnwdsnet = require( '/includes/network' );

// Define the variable win to contain the current window
var win = Ti.UI.createWindow({
  child: true,
  backgroundColor: '#fff'
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

// Add the label to the view
view.add(usernameLabel);

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
view.add(usernameTextfield);

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
view.add(passwordLabel);

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
view.add(passwordTextfield);

// Create the login button
var loginButton = Ti.UI.createButton({
	title:'Login',
	height:40,
	width:200,
	top:170
});

// Add the button to the view
view.add(loginButton);

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
  Ti.API.info(url);
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
			
			var getUser = Ti.App.Properties.getString("restPath") + 'user/' + data.user.uid + '.json';
			
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



return win;
}