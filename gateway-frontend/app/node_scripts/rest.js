var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('data/demodb02.s3db');
var cors = require('cors');
var bodyParse = require('body-parser');
 
//db.serialize(function() {
 //   db.run("CREATE TABLE IF NOT EXISTS counts (key TEXT, value INTEGER)");
 //   db.run("INSERT INTO counts (key, value) VALUES (?, ?)", "counter", 0);
//});
 
 
 
var express = require('express');
var restapi = express();
restapi.use(cors());
restapi.use(bodyParse());

restapi.get('/listActuator', function(req, res){
    db.all("SELECT * FROM actuators", function(err, rows){
        res.json(rows);
    });
});
 
 restapi.get('/listSensor', function(req, res){
    db.all("SELECT * FROM sensors", function(err, rows){
        res.json(rows);
    });
});
 
 
 restapi.get('/listTrigger', function(req, res){
    db.all("SELECT * FROM triggers", function(err, rows){
        res.json(rows);
    });
});
 
 restapi.get('/listTrigger', function(req, res){
    db.all("SELECT * FROM triggers", function(err, rows){
        res.json(rows);
    });ss
});
 
 restapi.get('/noOfSensor', function(req, res){
    db.all("SELECT COUNT(*) FROM sensors WHERE active='true'", function(err, rows){
        res.json(rows[0]["COUNT(*)"]);
    });
});
 
  restapi.get('/noOfActuator', function(req, res){
    db.all("SELECT COUNT(*) FROM actuators WHERE active='true'", function(err, rows){
        res.json(rows[0]["COUNT(*)"]);
    });
});
 
  restapi.get('/noOfTrigger', function(req, res){
    db.all("SELECT COUNT(*) FROM triggers WHERE active='true'", function(err, rows){
        res.json(rows[0]["COUNT(*)"]);
    });
});
  
 
    restapi.post('/removeTrigger',function(req,res){
        console.log(req.body);
        db.run("DELETE FROM triggers WHERE id =\'" + req.param('id') +"\'" , function(err, row){
            if (err){
                console.err(err);
                res.status(500);
            }
            else {
                res.status(202);
            }
            res.end();
        });
 
});
    
    
    restapi.post('/addTrigger',function(req,res){
        console.log(req.body);
        db.all("SELECT MAX(id) FROM triggers", function(err, rows){
        id = rows[0]["MAX(id)"];
        id = id.replace(/"/g, "");
        id = parseInt(id) + 1;
        db.run("INSERT INTO \"main\".\"triggers\" (\"id\",\"name\",\"sensor_id\",\"actuactor_id\",\"condition\",\"triggerFunc\") VALUES (\""+ id+"\",\""+req.param("triggerName")+"\",\""+req.param("sensor")+"\",\""+req.param("actuator")+"\",\""+req.param("conditions")+"\",\""+req.param("control")+"\")" , function(err, row){
            if (err){
                console.err(err);
                res.status(500);
            }
            else {
                res.status(202);
            }
            res.end();
        });
         });
 
});
 
restapi.post('/data', function(req, res){
    db.run("UPDATE counts SET value = value + 1 WHERE key = ?", "counter", function(err, row){
        if (err){
            console.err(err);
            res.status(500);
        }
        else {
            res.status(202);
        }
        res.end();
    });
});

 
 
restapi.listen(3000);

 
console.log("Submit GET or POST Request. e.g http://localhost:3000/listActuator");