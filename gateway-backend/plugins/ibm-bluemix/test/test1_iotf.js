var ibm = require("../index_iotf.js");
var config = require("../config.json");

// ibm.connect(config);
ibm.read();
return;
ibm.write({
    devId : "5678",
    value : 80,
    sensorType : "temp",
    timestamp : Date.now()
});



console.log("Successful write ... I think");
