var mysql      = require('mysql');
var db = mysql.createConnection({
  host     : 'localhost',
  user     : 'dreamnation',
  password : 'qkrtmxj0o)O',
  database : 'trackingpkg'
});

db.connect();
//db.end();

module.exports = db;
