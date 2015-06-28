var sqlite3 = require('sqlite3').verbose();
var _ = require("lodash");

var SensorCloudModel = function(db, data) {

    this.data = data;
    this.db = db;

    this.save = function() {
        this.db.run("BEGIN TRANSACTION");
        this.db.run("INSERT OR IGNORE INTO sensors (sensor_id, cloudprovider_id) VALUES (?,?,?,?,?,?,?)", _.values(this.data) );
        this.db.run("END");
    };

    this.find_by_sensor_id = function(sensor_id, callback) {
        this.db.all("SELECT * FROM sensors_clouds WHERE sensor_id = ?", sensor_id, function(err, rows) {
            if (err) {

            } else {
                callback(err, rows);
            }
        });
    };

    this.find_sensor_cloud_data_relations = function(callback) {
    console.log("hello1");
        this.db.all("select sc.sensor_id, sc.cloudprovider_id, d.value from sensors_clouds AS sc, data as d WHERE sc.sensor_id=d.sensor_id", function(err, rows) {
            console.log("hello2");
            if (err) {
                console.log("hello3");
                console.log(err);
            } else {
                console.log("hello4");
                callback(err, rows);
            }
        });
    };



    this.find = function(callback) {
        this.db.all("SELECT * FROM sensors_clouds", function(err, results) {
            callback(err, results);
        });
    };

    // this.update = function (d) {
    //     var sql = "UPDATE sensors SET name='"
    //             + d.name +
    //             "', description='" + d.description +
    //             "', maxfrequency='" + d.maxfrequency +
    //             "', frequency='" + d.frequency+
    //             "', active='" + d.active +
    //             "', ioType='"+ d.ioType +
    //             "' WHERE id ='" + d.id +
    //             "'";

    //     console.log(sql);

    //     this.db.run(sql);
    // };

    this.delete_by_id = function(id) {
        this.db.run("BEGIN TRANSACTION");
        this.db.run("DELETE from sensors_clouds WHERE sensor_id = ?", id);
        this.db.run("END");
    };
};

module.exports = SensorCloudModel;