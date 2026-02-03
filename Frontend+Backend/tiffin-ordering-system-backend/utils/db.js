// const mysql2 = require('mysql2')



// const pool = mysql2.createPool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   port: process.env.DB_PORT || 3306
// });

// module.exports=pool


const path = require('path');
// This forces Node to look in the exact folder where server.js and .env live
// require('dotenv').config({ path: path.join(__dirname, '../.env') });
require('dotenv').config();

console.log("--- DB DEBUG ---");
console.log("Target Host:", process.env.DB_HOST); 
console.log("----------------");

const mysql = require('mysql');
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306
});

module.exports = pool;

// module.exports = pool;