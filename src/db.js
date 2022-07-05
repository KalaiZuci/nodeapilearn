const mysql = require('mysql');

const mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Zuci@2022',
    database: 'company',
    multipleStatements: true
  });

mysqlConnection.connect(function(err){
    if(err){
        console.log(err);
    }else{
        console.log('db is connected');
    }
});

module.exports = mysqlConnection;