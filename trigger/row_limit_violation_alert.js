//
// Checks for any new row limit violations that have not been alerted in the past 2 hour(s).
// If any are found, then the row limit violation alert is triggered
// 
// To report on row limit violations see row_limit_violation_report handler.
//
let hours = '2';
let queryTimeout = 180;
var alert_name = mamori.getServerProperty("row_limit_alert", "default_row_limit_violation");
let SQL = "select a.* from (select "+
          " username||':'||system_name||'.'||database_name||'.'||schema_name||'.'||table_name||':'||row_limit key "+
          " ,username, system_name, database_name, schema_name, table_name, row_limit, row_count, limit_period,description,last_access "+
          " from sys.row_access_limit_violations a "+
          " join sys.row_access_limits b on a.row_limit_id=b.id) a  "+
          " where not exists (select 'x' from SYS.ALERT_LOG al "+
          " join SYS.ALERT_DEFINITIONS ad on al.alert_id = ad.id and ad.name = 'default_row_limit_violation' "+
          " where al.inserted_at >= DATEADD(hour,-"+hours+",current_timestamp) and al.alert_key = a.key)";
var rs = mamori.query(SQL,queryTimeout);
try {
   while(rs.next()) {
     var facts = mamori.makeFacts(rs, ["username", "system_name", "database_name", "schema_name", "table_name","last_access"]);
     facts.setAlertKey(rs.get("key"));    
     LOGGER.info("Row limit violation found: " + facts.toJSON());
     mamori.alert(alert_name, facts);    
  }
} finally {
  rs.close();
}