var sqlite3 = require('sqlite3').verbose();
var _ = require("lodash");

var TriggerModel = function(db, data) {

    this.data = data;
    this.db = db;

    this.save = function() {
        this.db.run("INSERT OR IGNORE INTO triggers (id, name, sensor_id, actuator_id, condition, triggerFunc, active) VALUES (?,?,?,?,?,?,?)", _.values(this.data) );
    };

    this.find_by_sensor_id = function(sensor_id, callback) {
        this.db.all("SELECT * FROM triggers WHERE sensor_id = ?", sensor_id, function(err, rows) {
            return callback(err, rows);
        });
    };

    this.find = function(callback) {
        this.db.all("SELECT * FROM triggers",
                    function(err, results) {
                        callback(err, results);
                    });
    };

    this.delete_by_id = function(id) {
        this.db.run("DELETE from triggers WHERE id = ?", id);
    };
};

module.exports = TriggerModel;
