const Pool = require('pg').Pool;

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    databse: "students",
    password: "root",
    port: 5432,
});

pool.connect((err)=>{
    if(err){
        console.error('connection error', err.stack)
    }else{
        console.log('connected')
    }
});

module.exports = pool;