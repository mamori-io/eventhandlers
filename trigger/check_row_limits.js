var alert_name = mamori.getServerProperty("row_limit_alert", "default_row_limit_violation");
var rs = mamori.query("select username, system_name, database_name, schema_name, table_name, row_limit, row_count, limit_period, description from sys.row_access_limit_violations a join sys.row_access_limits b on a.row_limit_id=b.id");
try {
  while(rs.next()) {
    var facts = mamori.makeFacts(rs, ["username", "system_name", "database_name", "schema_name", "table_name"]);
    LOGGER.info("Row limit violation found: " + facts.toJSON());
    mamori.alert(alert_name, facts);    
  }
} finally {
  rs.close();
}
