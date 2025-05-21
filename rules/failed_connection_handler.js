//LOGGER.info("***** CONNECTION FAILED HANDLER - "+facts.toJSON());
let failReason = facts.get('login_status_description');
if (failReason && failReason.includes('invalid source IP')){
  mamori.alert("default_invalid_service_account_access", facts);  
} else {
    var cID = facts.get('connectionId');
    var username = facts.get("username");
    var SQL = "select event, count(*) count from SYS.CONNECTION_EVENTS where connection_id = "+cID+" and (lower(event) like '%null%' or lower(event) like '%invalid%' or lower(event) like '%password: login failed%' ) group by event";
    var rs = mamori.query(SQL);
    try {
      while(rs.next()) {
         facts.set('error',rs.get('event'));
         facts.set('subject',"Mamori Alert! User "+username+" has a failed login to Target Resource : "+facts.get('system')+" due to "+facts.get('error')+".");
         var msg = "<br>User: "+username+"<br>"+
                   "Client: "+facts.get('ip')+"<br>"+
                   "Target Resource: "+facts.get('system')+"<br>"+
                   "Protocol: "+facts.get('clientProtocol')+"<br>"+
                   "Error: "+facts.get('error');

         facts.set('text',msg);     
         facts.set('format',"html");
         //LOGGER.info("User Failed ConnectionFound: " + facts.toJSON());
         mamori.alert("alert_user", facts);
      }
    } 
    catch (e) {
        LOGGER.info("Exception : connection_failed_handler {}",e);
    } 
    finally {
        rs.close();
    }
}
return false;
