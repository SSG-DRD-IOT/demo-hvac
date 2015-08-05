var ibm = require("../index.js");
var config = require("../config.json");
var util = require('util');

var bluemix = new ibm(config);

// function EventListener() {
//   this.listenTo = function( event, emitter ) {
//     emitter.on( event, function(data) {
//       console.log(event);
//       console.log(data);
//     } );
//   };
// }


// var listenerA = new EventListener(bluemix);
// listenerA.listenTo( 'trigger', bluemix );

// bluemix.addListener('trigger', function(){
//   console.log('trigger event added');
// });

// bluemix.on('trigger', function(data){
//   console.log('Trigger : 1');
//   console.log(data);
// });

bluemix.emit('connect');
console.log('After connect');

// console.log(util.inspect(bluemix.listeners('trigger')));


// bluemix.emit('trigger');

// console.log('After connect - 3');

console.log(util.inspect(bluemix.listeners('trigger')));

bluemix.on('trigger', function(data){
  console.log('Trigger : 1');
  console.log(data);
});

// ibm.connect(config);
// ibm.read();
// return;
// ibm.write({
//     devId : "5678",
//     value : 80,
//     sensorType : "temp",
//     timestamp : Date.now()
// });



console.log("Successful write ... I think");
