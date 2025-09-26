//LOGGER.info("request = {}", request);
var path = request.getPath();
if(path.startsWith("/user/login")) {
  if(request.getMethod().name() == "POST") {
    // handle a login request
    var cred = services.getResourceCredential();
    if(cred != null) {
      // the user has a credential for this site, so replace whatever is in the login request with the value assigned to this user
      var body = request.getBodyText();
      var parts = body.split("&");
      var sawPassword = false;
      for(var i=0; i<parts.length; i++) {
        if(parts[i].startsWith("user_name=")) {
          parts[i] = "user_name=" + encodeURIComponent(cred.getLogin());
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
  } else {
    return response.rewriteResponse(function(body) {
        var result = body.replace(/<\/title>/, ' - protected by Mamori</title>').replace(/<\/html>/, '<script type="text/javascript">(function() { var t=window.setInterval(function() { var e=document.getElementsByName("user_name"); if(e.length == 1) { e[0].value = "' + username + '"; document.getElementsByName("password")[0].value="mamorimanagedpassword"; window.clearInterval(t) }}, 100)})()</script></html>');
      return result;
    });
  }
}
