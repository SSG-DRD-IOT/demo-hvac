The code in these repositories should be loaded onto the Intel Edison devices.  It's seperated into three parts:
* **Scripts** - Examples of start-up scripts that run on the Edison to pick out which modules should be loaded first.  Allows for automatic configuration.
* **Modules** - The individual nodeJS modules developed for the demonstration.
* **Certificates** - The code for setting up a secure mosquitto server.

To load an edge device, one needs to do the following:

###Known Sensor (Temperature, Sound, Light)

The code already exists for these sensors, so they are the easiest sensors to configure.

1. Make sure you have NPM installed on your system.
2. Run "npm install intel-iot-commercial-edge-devices".
3. Configure the config.json file **according to the sensor you are using**.  You can copy the appropriate configuration JSON file from the scripts-and-config folder in this github repository and replace the config.json file that come installed with the module by defalut, if you wish.  Note that each sensor should have a different description.  If you would like to build your own configuration file, please look at the config.json sample and edit it accordingly.
5. Check the gateway.config JSON file from the scripts-and-config folder, and change the gateway hostname if needed.  This is critical for proper connection.
7. Run 'npm install'.  This will install the dependencies required of the different modules for the edison.
8. Run "node main.js from the main folder".  The sensor should find the gateway, announce its presence, and begin sending data.

You're all set!

###New Sensor

A new sensor requires that a few actions be taken before it will be recognized by the system.  Notably, the component manager needs to be edited.

1. **Find the appropriate upm module for the sensor.**  [Here](http://iotdk.intel.com/docs/master/upm/node/) is a good place to search.  Please note you're looking for NodeJS code for the UPM sensors.
2. **Make note of any libraries you may need to import.**  We currently import jsupm_grove, but other libraries will need to be imported into the component manager.
3. **Open intel-comm-components-manager and add any new libraries you might need as var upm2 = require('###'); and the like.**  You can change the name of the variable to whatever you please.  
4. **Add a new condition to the string compare statement.**  Obtain the component from your library that you need to access the value of for your sensor.  Then, add a statement like the one below to your component manager.  Note that you do not need to specify a pin, as it is dynamically set from the config.json file for the device.
  else if (name == "###")
  {
    returnedComponent = new upm2.###(+pin);
  }
5. **Create a new config.json file for the sensor.**  Follow the examples.  Make sure the name you set in the string compare statement is the name of the sensor in the config.json file, or it might not be associated with the appropriate component!
6. **Follow the instructions for adding a preexisting sensor.** The rest of the instructions should be the same!  

We welcome pull requests for new sensors!
