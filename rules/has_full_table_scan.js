// check if the query has any full table scans
let type = facts.getStatementType();
if(type == 'select' || type == 'insert' || type == 'update' || type == 'delete' || type == 'create table as select' || type == 'create temp table as select') {
  let plan = facts.explain(); // generate the query plan for the current query.
  // The format of the plan is specific to each remote system type.
  // For example Oracle gives a query result with well defined columns, while SQLServer gives an XML document and
  // Postgresql returns a textual description of each operation.
  let found = {};
  if(plan) {
     switch(facts.getSystemType()) {
       case "ORACLE":       
         for(let row of plan) {
           if(row.operation == 'TABLE ACCESS' && row.options == 'FULL') {
             found[row.object_owner + '.' + row.object_name] = true;
           }
         }
         break;

       case "SQLSERVER":
         let scanObjects = xml.xpath(plan, "//TableScan/Object");
         let L = scanObjects.getLength();
         for(let i=0; i<L; i++) {
           let item = scanObjects.item(i);
           found[item.getAttribute('Database') + '.' + item.getAttribute('Schema') + '.' + item.getAttribute('Table')] = true;
         }
         break;

       case "POSTGRESQL":
       case "EDB_POSTGRES":
       case "REDSHIFT":
         for(let line of plan) {
           let m = line.match(/^.*seq scan on ([^\s]+).*/i);
           if(m) {
             found[m[1]] = true;
           }
         }
         break;
     }
  }

  let flag = false;
  for(let tab in found) {
    out.write('Full table scan of ' + tab);
    flag = true;
  }
  return flag;
}

return false;
