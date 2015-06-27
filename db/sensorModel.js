var sqlite3 = require('sqlite3').verbose();
var _ = require("lodash");

var SensorModel = function(db, data) {

    this.data = data;
    this.db = db;

    this.save = function() {
        this.db.run("BEGIN TRANSACTION");
        this.db.run("INSERT OR IGNORE INTO sensors (id, name, description, maxfrequency, frequency, active, ioType) VALUES (?,?,?,?,?,?,?)", _.values(this.data) );
        this.db.run("END");
    };

    this.find_by_id = function(condition) {
        this.db.each("SELECT * FROM sensors WHERE id = ?", condition, function(err, row) {
            console.log(row);
            console.log("--------------");
        });
    };

    this.find = function(conditions) {
        this.db.all("SELECT * FROM sensors", function(err, results) {
            console.log(results);
            console.log("--------------");
        });
    };

    this.update = function (d) {
        var sql = "UPDATE sensors SET name='"
                + d.name +
                "', description='" + d.description +
                "', maxfrequency='" + d.maxfrequency +
                "', frequency='" + d.frequency+
                "', active='" + d.active +
                "', ioType='"+ d.ioType +
                "' WHERE id ='" + d.id +
                "'";

        console.log(sql);

        this.db.run(sql);
    };

    this.delete_by_id = function(id) {
        this.db.run("BEGIN TRANSACTION");
        this.db.run("DELETE from sensors WHERE id = ?", id);
        this.db.run("END");
    };
};

module.exports = SensorModel;

// var sensor = new SensorModel(
//     {
//         id : "3",
//         name : "Sound Sensor",
//         description : "read the noise",
//         maxfrequency : "200",
//         frequency : "1000",
//         active : "true",
//         ioType : "Analog"
//     });

// //sensor.save();
// //sensor.find();

// //sensor.find_by_id(3);

// sensor.update(
//     {
//         id : "3",
//         name : "Sound Sensor",
//         description : "read the ambient noise har har har",
//         maxfrequency : "200",
//         frequency : "1000",

//         active : "true",
//         ioType : "Analog"
//     }
// );
// //sensor.delete_by_id(3);

// this.db.close();
