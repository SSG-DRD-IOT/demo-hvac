//// Gateway Discovery Module \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
//// Finds a gateway (on an Edison) via a fixed hostname (for now).  In future:
//// will seek out a custom daemon that represents the gateway.  \\\\\\\\\\\\\\\

// We use mdns to look at the daemons that are being run over the network
var mdns = require('mdns');

var publisher = require ('intel-comm-pinpublisher');
var subscriber = require ('intel-comm-pinsubscriber');

//We're also going to need the main configuration file on the Edison - this is two folders up.
//(i.e. it is not in intel-comm-gateway-discovery or in node_modules)
var configs = require('../../config.json');

//Now, we can start the process that will search for the gateway.
exports.startGatewaySearch = function gatewaySearcher (gHostname) {

  //First, we're going to create some variables for storing the gateway host in, in addition to
  //the gateway IP.
  var gatewayHost = gHostname;
  var gatewayIP = [];

  // Next we create a browser for xdk-app-daemon services
  var browser = mdns.createBrowser(mdns.tcp('xdk-app-daemon'),58888);

  //We also need to figure out if this is a sensor or an actuator, as it will
  //affect what code is run next.
  var SenseOrAction = configs.type;

  // Log all the services with that daemon running and which are still up
  browser.on('serviceUp', function(service) {
    //console.log("service up: ", service);

     if (service.fullname === gatewayHost + "._xdk-app-daemon._tcp.local.")
     {
       //It's the gateway!  (This is bad practice, will fix later.)
       console.log("We found the gateway!")
       gatewayIP = service.addresses;
       browser.stop();
       if (SenseOrAction === "sensor")
       {
         publisher.publishDataLoop(gatewayIP);
       }
       else if (SenseOrAction === "actuator")
       {
         subscriber.subscribeDataLoop(gatewayIP);
       }
     }
  });

  // On Error Generate an error log and report it.
  browser.on('error', function (error) {
      console.log("error");
      console.log(error);
  });

  // Start the browser
  browser.start();

}
