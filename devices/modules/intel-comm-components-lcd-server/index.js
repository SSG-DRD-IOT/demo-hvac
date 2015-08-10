//This module runs as an independent server of sorts, and controls the
//temperature sensor independently.  It will be watching MQTT streams and
//reacting accordingly.

//Requirements
var mqtt = require('mqtt');
var LCD  = require ('jsupm_i2clcd'); //Require the LCD library.
var dataChannel = "sensors/temperature/data";
var errorChannel = "other/temperature/errors";
var lcdMessage = ""; //Blank space for the LCD message.
var myLCD = new LCD.Jhd1313m1(6, 0x3E, 0x62); //"address" for the RGB LCD

var client  = mqtt.connect(config.gateway.hostname);

 //When we connect, we're targeting the temperature sensor for the demo -
 //follow its data and error channels.
client.on('connect', function ()
{
  client.subscribe(dataChannel);
  client.subscribe(errorChannel);
});

client.on('message', function (topic, message) {
  // message is Buffer
  if (topic == dataChannel)
  {
    //Print the new temperature to the LCD screen.
    lcdMessage = message + " celsius";
    myLCD.setCursor(0,1);
    myLCD.write(lcdMessage);
  }
  if (topic == errorChannel)
  {
    //Otherwise, if it's an error topic, we may need to change the color of the
    //RGB LCD.
    if (message === "too hot") //If the temperature sensor is too hot...
    {
      myLCD.setColor(255,0,0);
    }
    if (message === "too cold" ) //If the temperature sensor is too cold...
    {
      myLCD.setColor(0,0,255);
    }
    if (message === "actuator failure" ) //If there's another error condition...
    {
      setInterval (function ()
      {
        myLCD.setColor(0,0,0);
        setTimeout(function()
        {
          myLCD.setColor(255,0,0);
        }, 1000);
      }, 2000);
    }
    if (message === "all clear" ) //If we get the all clear...
    {
      myLCD.setColor(0,0,0);
    }
  }
});
