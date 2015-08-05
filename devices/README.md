The code in these repositories should be loaded onto the Intel Edison devices.  It's seperated into three parts:
* **Scripts** - The start-up scripts that run on the Edison to pick out which modules should be loaded first.  Allows for automatic configuration.
* **Modules** - The individual nodeJS modules developed for the demonstration.
* **Edge-Devices** - The code, pre-packaged, that needs to be dropped into place on each of the Edison devices. [DEPRECATED]

To load an edge device, one needs to do the following:

###Preexisting Sensor (Temperature, Sound, Light)

The code already exists for these sensors, so they are the easiest sensors to configure.

1. **Create a directory called node_app_slot on the root directory of the Edison.** Theoretically the sensors should support the code being run from any folder, but this is the one that has been tested and confirmed.
2. **Create a node_modules folder in this node_app_slot folder.**  This is where we copy the created modules for the edge device code.
3. **Copy the modules under "modules" to the "node_modules" folder.**  For sensors, you can leave out the relay module - all other modules need to be copied.
4. **Copy the appropriate configuration JSON file from the scripts-and-config folder to the node_app_slot folder, and change the description to be appropriate for your use.**  Each sensor should have a different description.  Preexisting configuration files for the demo sensors exist, but they should be renamed to config.json when in use.  If you would like to build your own configuration file, please look at the config.json sample and edit it accordingly.
5. **Copy the appropriate gateway configuration JSON file from the scripts-and-config folder to the node_app_slot folder, and change the gateway hostname if needed.**  This is critical for proper connection.
6. **Copy the main.js and package.json files from the scripts-and-config folder to the node_app_slot folder.**  They should not have to be changed.  
7. **Run 'npm install'.**  This will install the dependencies required of the different modules for the edison.
8. **Run "node /node_app_slot/main.js".**  The sensor should find the gateway, announce its presence, and begin sending data.

You're all set!

***New Sensor
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
6. **Follow the instructions for adding a preexisting sensor.** The rest of the instructionsshould be the same!  

***Preexisting Actuator
Coming Soon!

***New Actuator
Coming Soon!
