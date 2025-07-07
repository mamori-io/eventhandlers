//
// Reports on all the row limit violation alerts that occured in the last 24 hours
//
let hours = '24';
var alert_name = mamori.getServerProperty("email_admin_alert", "email_admin");
let SQL = "select al.id, json_value(al.facts,'username') username "+
" , json_value(al.facts,'system_name') system_name "+
" , json_value(al.facts,'database_name') database_name "+
" , json_value(al.facts,'schema_name') schema_name "+
" , json_value(al.facts,'table_name') object_name "+
" , json_value(al.facts,'row_limit') row_limit "+
" , json_value(al.facts,'limit_period') limit_period "+
" , json_value(al.facts,'row_count') row_count "+
" , json_value(al.facts,'last_access') last_access "+
" , al.inserted_at alert_dt "+
" from SYS.ALERT_LOG al "+
" join SYS.ALERT_DEFINITIONS ad on al.alert_id = ad.id and ad.name = 'default_row_limit_violation' "+
" where al.inserted_at >= DATEADD(hour,-"+hours+",current_timestamp) "+
" order by id ";
var rs = mamori.query(SQL);
try {
    var rep = rs.toHTML();
    if(rep.getRowCount()>0) {
      var facts = mamori.makeFacts({subject: "Mamori Report: " + rep.getRowCount() + " Row Limit Violations", text: "The following users have exceeded their row limit policies<br/>" + rep.getText(), format: "html"});
      facts.set("alert_key","row_limit_violation_report");
      mamori.alert(alert_name, facts);
  }
} finally {
  rs.close();
}