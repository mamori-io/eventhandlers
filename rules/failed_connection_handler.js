//LOGGER.info("failed_connection_handler facts: {}", facts.toJSON());
let failReason = facts.get('login_status_description');
if (failReason && failReason.includes('invalid source IP')) {
  mamori.alert("default_invalid_service_account_access", facts);  
} 
else {
    const cID = facts.get('connectionId');
    const username = facts.get("username");
    const lockOut = facts.get('lockout_expiry') ;
   
    const conditions = "LOWER(event) LIKE '%null%'" +
                " OR LOWER(event) LIKE '%invalid%'" + 
                " OR LOWER(event) LIKE '%authentication timed out%'" + 
                " OR LOWER(event) LIKE '%denied mfa request%'" + 
                " OR LOWER(event) LIKE '%password: login failed%'"; 
    const SQL = "SELECT event, COUNT(*) count FROM SYS.CONNECTION_EVENTS WHERE connection_id = " + cID + " AND (" + conditions + ") GROUP BY event";
    const rs = mamori.query(SQL);
    try {
         while (rs.next()) {
           facts.set('error', rs.get('event'));
           
           if (!lockOut) {
              facts.set('subject', "Mamori Alert! User " + username + " has a failed login to Target Resource: " + facts.get('system') 
                        + " due to " + facts.get('error') + ".");
           } 
           else {
              facts.set('subject', "Mamori Alert! User " + username + " - Account is locked until: " + lockOut);
           }
           
           var msg = "<br>User: " + username + "<br>" +
                     "Client: " + facts.get('ip') + "<br>" +
                     "Target Resource: " + facts.get('system') + "<br>" +
                     "Protocol: " + facts.get('clientProtocol') + "<br>" +
                     "Error: " + facts.get('error') + 
        			  (!lockOut ? "" : "<br>Locked Out Until: " + lockOut);
           facts.set('text', msg);     
           facts.set('format', "html");
           
           mamori.alert("default_alert_user", facts);
        }     
    } 
    catch (e) {
        LOGGER.info("Exception in failed_connection_handler event handler", e);
    } 
    finally {
        rs.close();
    }
}
return false;
