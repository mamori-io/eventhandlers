var path = request.getPath();

// LOGGER.info("path = " + path);
if(path == '/') {
  return response.rewriteResponse(function(body) {
    var result = body.replace(/<\/title>/, ' - protected by Mamori</title>').replace(/<\/html>/, '<script type="text/javascript">(function() { var t=window.setInterval(function() { var e=document.getElementsByName("username"); if(e.length == 1) { e[0].value = "' + username + '"; document.getElementsByName("password")[0].value="mamorimanagedpassword"; window.clearInterval(t) }})})()</script></html>');
	return result;
  });
} else if(path == '/api2/extjs/access/ticket') {
  var cred = services.getResourceCredential();
  if(cred != null) {
    var body = 'username=' + encodeURIComponent(cred.getLogin()) + '&password=' + encodeURIComponent(cred.getPassword()) + '&realm=pam&new-format=1';
    response.replaceBody(request, body);
  }
}
