var mqtt = require('mqtt');
var getmac = require('getmac');
var https = require('https');

// IBM BluxMix MQTT port
var port = 1883;

module.exports = {

    connect: function(json) {

        console.log("Entered the connection function");
        this.config = json;

	getmac.getMac(function(err, macAddress) {
    	    if (err) throw err;

    	    macAddress = macAddress.toString().replace(/:/g, '').toLowerCase();
        });

	if(this.config) {

	    if(this.config['auth-method'] && (this.config['auth-method'] !== "token")){
	        throw "Authentication method not supported. Please make sure to use \"token\".";
	    }

	    if(!this.config['auth-token']) {
	        throw "Auth token not found";
	    }

	    if(!this.config.org){
                throw "Configuration should include an org field that specifies your organization.";
            }

            if(!this.config.type){
                throw "Configuration should include a type field that specifies your device type.";
            }

            if(!this.config.id){
	        this.config.id = macAddress;
                throw "Configuration should include an id field that specifies your device id.";
            }

	    this.organization = this.config.org;
            this.deviceType = this.config.type;
            this.macAddress = this.config.id;
	    this.port = this.config.port;

            this.broker = this.organization + ".messaging.internetofthings.ibmcloud.com";
	}
	else {
	    console.log("No configuration file found.");
	}

	client = mqtt.connect(
            {
                host: this.broker,
                port: this.port,
                username: this.config['username'],
                password : this.config['auth-token'],
                clientId : "d:" + this.organization + ":" + this.deviceType + ":" + this.macAddress
            });
        //      console.log(client);

    },

    // Store the data record with the evt_type equal to the devID
    // This allows us to retrieve the records based on devID

    write: function(data) {
	topic = "iot-2/evt/" + this.devId + "/fmt/json";
	var message = {
            "d" : {
                "value" : data.value,
                "sensorType" : data.sensorType,
                "timestamp" : data.timestamp
            }
        };

        //	console.log(message);
        client.publish(topic, JSON.stringify(message));
    },


    read: function() {

        console.log("here 1");
        var options = {
            hostname: "internetofthings.ibmcloud.com"
            ,port: 443
            ,auth: {
                user: "a-5anfde-xxkarh3mxp"
                ,pass: "pkaXR)SEnVrsuM21BY"
            }
            ,path: '/api/v0001/historian/5anfde/intel-edison?evt_type=temperatureEvent'
            ,method: 'GET'
            ,headers: { 'Content-Type': 'application/json' }
        };
        console.log("here 2");

        var req = https.get(options, function(res) {
            console.log('STATUS: ' + res.statusCode);
            console.log('HEADERS: ' + JSON.stringify(res.headers));

            // Buffer the body entirely for processing as a whole.
            var bodyChunks = [];
            res.on('data', function(chunk) {
                // You can process streamed parts here...
                bodyChunks.push(chunk);
            }).on('end', function() {
                var body = Buffer.concat(bodyChunks);
                console.log('BODY: ' + body);
                // ...and/or process the entire body here.
            });
        });

        req.on('error', function(e) {
            console.log('ERROR: ' + e.message);
        });

        console.log("here 6");
        req.end();
        console.log("here 7");
    },


    disconnect: function() {

    }
};
