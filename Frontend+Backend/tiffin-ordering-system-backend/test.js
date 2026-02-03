// Only for testing purpose

const mysql = require('mysql2');
const connection = mysql.createConnection({
  host: 'mealmasters-db.cby06s226ug7.ap-south-1.rds.amazonaws.com',
  user: 'admin',
  password: 'Atharv2635',
  database: 'mealmasters-db'
});

connection.connect((err) => {
  if (err) {
    console.error('Connection failed: ' + err.stack);
    return;
  }
  console.log('Connected successfully!');
  connection.end();
});