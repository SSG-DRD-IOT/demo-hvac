//// Gateway Discovery Module \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
//// Finds a gateway (on an Edison) via a fixed hostname (for now).  In future:
//// will seek out a custom daemon that represents the gateway.  \\\\\\\\\\\\\\\

// We use mdns to look at the daemons that are being run over the network
var mdns = require('mdns');
//We use child processes to run the code for starting the edison.
var exec = require('child_process').exec;
//We're going to start the main.js file on the Edison.
var configs = require('./config.json');
var gateway = require('./gateway.json');
// Creates a browser for xdk-app-daemon services
var browser = mdns.createBrowser(mdns.tcp('xdk-app-daemon'),58888);

//We're also going to create some variables for storing the gateway host in, in
//addition to
var gatewayHost = gateway.name;
var gatewayIP = [];

function run_script(ip){
  var cmd  = 'node /node_app_slot/main.js '+ip;
  console.log(cmd);
  exec(cmd, function(error, stdout, stderr) {
    if (stderr)
    {
      console.log("There's been an error: " + stderr);
      run_script(ip);
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
