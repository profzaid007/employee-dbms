const {Pool} = require('pg');

const pool = new Pool({
    connectionString: 'postgres://mndupcim:UlyJw6cAYjuF3po-vLjb03pWgW1-1JqC@satao.db.elephantsql.com/mndupcim',
  });

module.exports = pool;

pool.connect(()=>{
    console.log("DB cybered!!");
})