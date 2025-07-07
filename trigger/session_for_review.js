//
//This handler generates a list of SSH and RDP that have occured in the last 25 hours.
//The list is converted to HTML and emailed.
//The session column is converted into a hyperlink that takes the user to the recording.
//
let hours = '25';
let alert_to_call = 'email_admin';
let host = mamori.getServerProperty('web_url','');
var rs = mamori.query("select ssid as session,login_username,protocol,target_system,start_time,datediff(second,start_time,coalesce(end_time,current_timestamp))/60 duration  from SYS.CONNECTIONS where protocol in ('SSH','Remote Desktop') and login_username is not null and start_time >= DATEADD(hour,-"+hours+",current_timestamp) order by id");
try {
    var rep = rs.toHTML({duration: v=> v.toFixed(2)+' Minutes',
                         start_time:v=> (new Date(v)).toLocaleString(),  
                         session: v => '<a href="'+host+'#/connection_log?ssid='+v+'" target="_blank">View Session</a>' });
    if(rep.getRowCount()>0) {
      var facts = mamori.makeFacts({subject: "Mamori Report: SSH and RDP connections to review:" + rep.getRowCount() + " ", text: "The following SSH and RDP connections in the last "+hours+" hours need to be reviewed <br/><br/>" + rep.getText(), format: "html"});
      facts.set("alert_key","sessions_to_review");
      mamori.alert(alert_to_call, facts);
  }
} finally {
  rs.close();
}