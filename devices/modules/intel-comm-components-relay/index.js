// Required Modules
var relay = require("./relay.json");
var mraa = require('mraa');

// Function which can be exported from main javascrpit file
module.exports = {

    //Initialization of Pin
    initializePin: function(pinNo){
        var myDigitalPin = new mraa.Gpio(parseInt(pinNo)); //setup digital read on pin
        myDigitalPin.dir(mraa.DIR_OUT); //set the gpio direction to output
    },

    // Exporting JSON file containing API, description etc.
    getApi: function(){
        return(relay);
    },

    // Function to perform action based on trigger
    action: function(pinNo,status){
        var myDigitalPin = new mraa.Gpio(parseInt(pinNo)); //setup digital read on pin
        var myDigitalValue =  myDigitalPin.read();
        if (myDigitalValue != status){
            if (status == 'on'){
                myDigitalPin.write(1); //set the digital pin to high (1)
            }
            if (status == 'off'){
                myDigitalPin.write(0); //set the digital pin to high (1)
            }
        }
    },

    // Function to read current status of Pin
    readPin: function(pinNo){
        var myDigitalPin = new mraa.Gpio(parseInt(pinNo)); //setup digital read on pin
        var myDigitalValue =  myDigitalPin.read(); //read the digital value of the pin
        return(myDigitalValue)
    },


    returnType : function() {
        var configs = require('./relay.json');
        return configs.type;
    }
};
