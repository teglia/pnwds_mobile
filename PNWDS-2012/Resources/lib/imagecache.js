/**
 * Create a local file out of a remote url, if it doesn't already exist.
 * 
 * @param {Object} imageName
 * @param {Object} imageSrc
 */
exports.imageCache = function(imageName, imageSrc) {
  
  //make a file object
  var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory,imageName);
  //no local file go get the remote source
  if (!file.exists()) {
    Ti.API.info("Doesn't exist");
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
  Ti.API.info("Have a file!");
  //otherwise we already got the file, return the local
  return file.nativePath;
}