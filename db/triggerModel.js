var sqlite3 = require('sqlite3').verbose();
var _ = require("lodash");

var TriggerModel = function(db, data) {

    this.data = data;
    this.db = db;

    this.save = function() {
        this.db.run("BEGIN TRANSACTION");
        this.db.run("INSERT OR IGNORE INTO triggers (id, name, sensor_id, actuator_id, condition, triggerFunc, active) VALUES (?,?,?,?,?,?,?)", _.values(this.data) );
        this.db.run("END");
    };

    this.find_by_sensor_id = function(sensor_id, callback) {
        this.db.all("SELECT * FROM triggers WHERE sensor_id = ?", sensor_id, function(err, rows) {
            if (err) {

            } else {
                callback(err, rows);
            }
        });
    };

    this.find = function() {
        this.db.all("SELECT * FROM triggers", function(err, results) {
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
        this.db.run("DELETE from triggers WHERE id = ?", id);
        this.db.run("END");
    };
};

module.exports = TriggerModel;
