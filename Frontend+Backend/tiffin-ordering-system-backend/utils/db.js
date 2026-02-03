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
// This tells dotenv exactly where the file is relative to this script
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

console.log("Connecting to host:", process.env.DB_HOST);

const mysql = require('mysql');
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306
});

module.exports = pool;