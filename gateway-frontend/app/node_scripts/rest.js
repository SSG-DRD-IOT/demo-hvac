var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('../../../db/iotdemo.sqlite');
var cors = require('cors');
var bodyParse = require('body-parser');
var _ = require('lodash');
 
//db.serialize(function() {
 //   db.run("CREATE TABLE IF NOT EXISTS counts (key TEXT, value INTEGER)");
 //   db.run("INSERT INTO counts (key, value) VALUES (?, ?)", "counter", 0);
//});
 
 
 
var express = require('express');
var restapi = express();
restapi.use(cors());
restapi.use(bodyParse());


// To get list of actuator from angular.js
restapi.get('/listActuator', function(req, res){
    db.all("SELECT * FROM actuators", function(err, rows){
      //  console.log(rows);
        res.json(rows);
    });
});
 
 // To get list of Sensors from angular.js
 restapi.get('/listSensor', function(req, res){
    db.all("SELECT * FROM sensors", function(err, rows){
        res.json(rows);
    });
});
 
 
 // To get list of Triggers from angular.js
 restapi.get('/listTrigger', function(req, res){
    db.all("SELECT * FROM triggers", function(err, rows){
        res.json(rows);
    });
});
 
 
 // To get Number of Sensors which are active
 restapi.get('/noOfSensor', function(req, res){
    db.all("SELECT COUNT(*) FROM sensors WHERE active='true'", function(err, rows){
        res.json(rows[0]["COUNT(*)"]);
    });
});
 
 // To get Number of Actuators which are active
  restapi.get('/noOfActuator', function(req, res){
    db.all("SELECT COUNT(*) FROM actuators WHERE active='true'", function(err, rows){
        res.json(rows[0]["COUNT(*)"]);
    });
});
 
 // To get Number of Triggers which are active
  restapi.get('/noOfTrigger', function(req, res){
    db.all("SELECT COUNT(*) FROM triggers WHERE active='true'", function(err, rows){
        res.json(rows[0]["COUNT(*)"]);
    });
});
  
 // To remove a rigger from database
    restapi.post('/removeTrigger',function(req,res){
       // console.log(req.body);
        db.run("DELETE FROM triggers WHERE id =\'" + req.param('id') +"\'" , function(err, row){
            if (err){
                //console.err(err);
                res.status(500);
            }
            else {
                res.status(202);
            }
            res.end();
        });
 
});
    
    // To add a new trigger to database
    restapi.post('/addTrigger',function(req,res){
       // console.log(req.body);
     //   db.all("SELECT MAX(id) FROM triggers ORDER BY id DESC", function(err, rows){
           // console.log(rows)
        //id = rows[0]["MAX(id)"];
       // id = id.replace(/"/g, "");
      //  new_id = parseInt(id) + 1;
      //  console.log (new_id);
      var sql = "INSERT INTO \"main\".\"triggers\" (\"name\",\"sensor_id\",\"actuator_id\",\"condition\",\"triggerFunc\") VALUES (\""+req.param("triggerName")+"\",\""+req.param("sensor")+"\",\""+req.param("actuator")+"\",\""+req.param("conditions")+"\",\""+req.param("control")+"\");";
        db.all(sql, function(err, row){
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
    
    // To get api according to actuator Id
    restapi.post('/getApi',function(req,res){
     //   console.log(req.body);
        db.all("SELECT api FROM actuators WHERE id =\'" + req.param('id') +"\'" , function(err, row){
            if (err){
                console.err(err);
                res.status(500);
            }
            else {
                res.json(eval(row));
            }
            res.end();
        });
});
    
    // To send sensor data for charts
   restapi.get('/getSensorData',function(req,res){
        console.log(req.sensorId);
        db.all("SELECT data,timestamp FROM data WHERE sensor_id =\'" + req.param('sensorId') +"\'" , function(err, rows){
            if (err){
                console.err(err);
                res.status(500);
            }
            else {
                console.log(JSON.stringify(rows));
                var data = _.pluck(rows,'data');
                var timestamp = _.pluck(rows,'timestamp');
                var dt = {
	    timestamp: ["2015-06-24 23:42:12","2015-06-24 23:42:14","2015-06-24 23:42:15","2015-06-24 23:42:16","2015-06-24 23:42:17","2015-06-24 23:42:18","2015-06-24 23:42:19","2015-06-24 23:42:20","2015-06-24 23:42:21","2015-06-24 23:42:22"],
	    values: [[75.2,74.57,75.04,74.88,74.26,74.57,73.95,74.73,74.1,74.26],
       [75.2,74.57,75.04,74.88,74.26,74.57,73.95,74.73,74.1,74.26]]}
               // var dt = ('{labels:[" + data + "], data:[" +timestamp+ "]}')
                
                res.json(dt);
            }
            res.end();
        });
 
});
    
    
 
 // Sample Post Restful Api
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