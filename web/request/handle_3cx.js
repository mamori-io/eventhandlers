var path = request.getPath();

//LOGGER.info("path = {}", path);
if(path == '/') {
  return response.rewriteResponse(function(body) {
      var result = body.replace(/<\/title>/, ' - protected by Mamori</title>').replace(/<\/body>/, '<script type="text/javascript">(function() { var t=window.setInterval(function() { var e=document.getElementById("loginInput"); if(e) { e.value = "' + username + '"; document.getElementById("passwordInput").value="mamorimanagedpassword"; window.clearInterval(t) }}, 100)})()</script></body>');
	return result;
  });
} else if(path == '/webclient/api/Login/GetAccessToken') {
  // look for a credential for the current user
  var cred = services.getResourceCredential();
  if(cred != null) {
    // we have a credential, so rewrite the login request
    var body = JSON.parse(request.getBodyText());
    body.Username = cred.getLogin();
    body.Password = cred.getPassword();
    response.replaceBody(request, JSON.stringify(body));
  }
}
