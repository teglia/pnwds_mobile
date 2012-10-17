/**
 * Create a local file out of a remote url, if it doesn't already exist.
 * 
 * @param {Object} imageName
 * @param {Object} imageSrc
 */
exports.imageCache = function(imageName, imageSrc) {
  
  //make a file object
  var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory,imageName);
  if (!file.exists()) {
    Ti.API.info('Does not exist in cache directory');
    file = Ti.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory,'/images/avatars/' + imageName);
    if (!file.exists()) {
      Ti.API.info('Does not exist in images/avatars directory');
      // Get the file from remote and store it.
      var cconnection = Ti.Network.createHTTPClient();
      cconnection.onload = function() {
        //write it to local
        file.write(this.responseData);
        Ti.API.info("Written to local");
      }
      cconnection.open('GET',imageSrc, true);
      cconnection.send(); 
      //since it might take a while to get just return the remote source so we can display that
      return imageSrc; 
    }
  }

  Ti.API.info("Have a file!");
  //otherwise we already got the file, return the local
  return file.nativePath;
}