
exports.imageCache = function(f, r) {
	//make a file object
         var file = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory,f);
         //no local file go get the remote source
         if (!file.exists()) {
            var cconnection = Titanium.Network.createHTTPClient();
            cconnection.onload = function() {
            	//write it to local
                file.write(this.responseData);
            }
            cconnection.open('GET',r, true);
            cconnection.send(); 
            //since it might take a while to get just return the remote source so we can display that
            return r;        
         }
         //otherwise we already got hte file, return the local
         return file.nativePath;
     }