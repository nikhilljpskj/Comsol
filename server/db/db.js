const mysql = require('mysql');
const db = mysql.createConnection({
  host: 'localhost',
  user: 'comsol_db',
  password: '8086689923',
  database: 'comsol'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL');
});

module.exports = db;
