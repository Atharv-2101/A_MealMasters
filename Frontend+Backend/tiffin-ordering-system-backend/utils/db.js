const mysql2 = require('mysql2')

const pool=mysql2.createPool({
    host : 'localhost',
    user : 'W2_92912_Atharv',
    password : 'manager',
    database : 'onlinetiffinsystem_db'
})

module.exports=pool