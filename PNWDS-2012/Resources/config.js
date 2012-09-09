/**
 * To avoid configuring in multiple files the same URI
 * to access the site we set it here and include this file
 * everywhere we need it.
 */

// Set this to the base path of your rest server (add trailing slash)
Titanium.App.Properties.setString("restPath", 'http://pnwds/rest/');
Titanium.App.Properties.setString("sitePath", 'http://pnwds/');