//LOGGER.info("request = {}", request);
var path = request.getPath();
if(path.match(/^\/sip\/login\.php\?.*/)) {
  if(request.getMethod().name() == "POST") {
    // handle a login request
    var cred = services.getResourceCredential();
    if(cred != null) {
      // the user has a credential for this site, so replace whatever is in the login request with the value assigned to this user
      var body = request.getBodyText();
      var parts = body.split("&");
      var sawPassword = false;
      for(var i; i<parts.length; i++) {
        if(parts[i].startsWith("txtUsuario=")) {
          parts[i] = "txtUsuario=" + encodeURIComponent(cred.getLogin());
        } else if(parts[i].startsWith("pwdSenha=")) {
          parts[i] = "pwdSenha=" + encodeURIComponent(cred.getPassword());
          sawPassword = true;
        }
      }

      if(!sawPassword) {
        // just in case we did not see a password, add it in
        parts.push("pwdSenha=" + encodeURIComponent(cred.getPassword()));
      }

      // now rewrite the request body with the updated credential
      response.replaceBody(request, parts.join("&"));
    }
  } else {
    return response.rewriteResponse(function(body) {
      var result = body.replace(/<\/title>/, ' - protected by Mamori</title>').replace(/<\/html>/, '<script type="text/javascript">(function() { var t=window.setInterval(function() { var e=document.getElementsByName("txtUsuario"); if(e.length == 1) { e[0].value = "' + username + '"; document.getElementsByName("pwdSenha")[0].value="mamorimanagedpassword"; window.clearInterval(t) }})})()</script></html>');
	  return result;
    });
  }
}
