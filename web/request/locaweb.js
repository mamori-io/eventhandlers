//LOGGER.info("request = {}", request);
var path = request.getPath();
if(path == "/login") {
  return response.rewriteResponse(function(body) {
      var result = body.replace(/<\/title>/, ' - protected by Mamori</title>').replace(/<\/body>/, '<script type="text/javascript">(function() { var t=window.setInterval(function() { var e=document.getElementsByName("username"); if(e.length == 1) { e[0].value = "' + username + '"; document.getElementsByName("password")[0].value="mamorimanagedpassword"; window.clearInterval(t) }}, 100)})()</script></body>');
    return result;
  });
} else if(path == "/login") {
    // handle a login request
    var cred = services.getResourceCredential();
    if(cred != null) {
      // the user has a credential for this site, so replace whatever is in the login request with the value assigned to this user
      var body = request.getBodyText();
      var parts = body.split("&");
      var sawPassword = false;
      for(var i; i<parts.length; i++) {
        if(parts[i].startsWith("username=")) {
          parts[i] = "username=" + encodeURIComponent(cred.getLogin());
        } else if(parts[i].startsWith("password=")) {
          parts[i] = "password=" + encodeURIComponent(cred.getPassword());
          sawPassword = true;
        }
      }

      if(!sawPassword) {
        // just in case we did not see a password, add it in
        parts.push("password=" + encodeURIComponent(cred.getPassword()));
      }

      // now rewrite the request body with the updated credential
      response.replaceBody(request, parts.join("&"));
    }
}
