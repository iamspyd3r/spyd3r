const sql = require('mssql')

var connection = async ()=>{
    var config = {
        user: 'sa',
        password: 'Dashtech@123',
        server: '192.168.0.118', 
        database: 'VadshDB' 
    };
    
    // connect to your database
    sql.connect(config, function (err) {
    
        if (err) console.log(err);
    
        console.log("database connected successfully....");
        
    });
    
}



module.exports =connection;