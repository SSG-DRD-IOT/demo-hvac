var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('data/demodb02.s3db');
var cors = require('cors');

 
//db.serialize(function() {
 //   db.run("CREATE TABLE IF NOT EXISTS counts (key TEXT, value INTEGER)");
 //   db.run("INSERT INTO counts (key, value) VALUES (?, ?)", "counter", 0);
//});
 
 
 
var express = require('express');
var restapi = express();
restapi.use(cors());
 
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