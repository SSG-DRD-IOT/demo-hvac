//// Gateway Discovery Module \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
//// Finds a gateway (on an Edison) via a fixed hostname (for now).  In future:
//// will seek out a custom daemon that represents the gateway.  \\\\\\\\\\\\\\\

// We use mdns to look at the daemons that are being run over the network
var mdns = require('mdns');

//We use child processes to run the code for starting the edison.
var exec = require('child_process').exec;

//We're going to need the main configuration file on the Edison - this is two folders up.
//(i.e. it is not in intel-comm-gateway-discovery or in node_modules)
var configs = require('../../config.json');

// Creates a browser for xdk-app-daemon services
var browser = mdns.createBrowser(mdns.tcp('xdk-app-daemon'),58888);

//We're also going to create some variables for storing the gateway host in, in addition to 
//the gateway IP.
var gatewayHost = 'gateway';
var gatewayIP = [];

function run_script(ip){
  var cmd  = 'node /node_app_slot/main.js '+ip;
  console.log(cmd);
  exec(cmd, function(error, stdout, stderr) {
    if (stderr)
    {
      console.log("There's been an error: " + stderr);
    }
  });
}

// Log all the services with that daemon running and which are still up
browser.on('serviceUp', function(service) {
  //console.log("service up: ", service);

   if (service.fullname === gatewayHost + "._xdk-app-daemon._tcp.local.")
   {
     //It's the gateway!  (This is bad practice, will fix later.)
     console.log("We found the gateway!")
     gatewayIP = service.addresses;
     browser.stop();
     run_script(gatewayIP);
   }
});

// On Error Generate an error log and report it.
browser.on('error', function (error) {
    console.log("error");
    console.log(error);
});


// Start the browser
browser.start();
