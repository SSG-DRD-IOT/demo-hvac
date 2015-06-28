var sqlite3 = require('sqlite3').verbose();
var _ = require("lodash");

var DataModel = function(db, data) {

    this.data = data;
    this.db = db;

    // INSERT INTO "main"."data" ("sensor_id","value") VALUES (?1,?2)
    this.save = function() {
        console.log(this.data);
        console.log("Just before DB transaction");
        this.db.run("BEGIN TRANSACTION");
        this.db.run('INSERT INTO "main"."data" ("sensor_id","value", "timestamp") VALUES (?1,?2,?3)', [this.data.sensor_id, this.data.value, this.data.timestamp]  );
        this.db.run("END");
    };

    //this.find_by_id = function(condition) {
    //     this.db.each("SELECT * FROM sensors WHERE id = ?", condition, function(err, row) {
    //         console.log(row);
    //         console.log("--------------");
    //     });
    // };


    //this.find_by_id = function(condition) {
    //     this.db.each("SELECT * FROM sensors WHERE id = ?", condition, function(err, row) {
    //         console.log(row);
    //         console.log("--------------");
    //     });
    // };

    this.find = function(callback) {
        var sql = "SELECT * FROM data";

        this.db.all(sql,  function(err, results) {
            if (err) {
                callback(err, results);
            } else {
                //                delete_by_sensor_id(
                callback(null, results);
            }
        });
    };


    this.find_by_sensor_id = function(sensor_id, callback) {
        var sql = "SELECT * FROM data WHERE sensor_id = '" + sensor_id + "'";

        this.db.all(sql,  function(err, results) {
            if (err) {
                callback(err, results);
            } else {
//                delete_by_sensor_id(
                callback(null, results);
            }
        });
    };

    this.delete_by_sensor_id = function(id) {
        this.db.run("BEGIN TRANSACTION");
        this.db.run("DELETE from sensors WHERE id = ?", id);
        this.db.run("END");
    };

    this.delete_all_data = function(id) {
        this.db.run("DELETE from sensors");
    };
};

module.exports = DataModel;
