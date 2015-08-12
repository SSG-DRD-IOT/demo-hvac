//This module runs as an independent server of sorts, and controls the
//temperature sensor independently.  It will be watching MQTT streams and
//reacting accordingly.

//Requirements
var mqtt = require('mqtt');
var LCD  = require ('jsupm_i2clcd'); //Require the LCD library.
var dataChannel = "sensors/temperature/data";
var errorChannel = "sensors/temperature/errors";
var alertChannel = "sensors/temperature/alerts";
var lcdMessage = ""; //Blank space for the LCD message.
var myLCD = new LCD.Jhd1313m1(6, 0x3E, 0x62); //"address" for the RGB LCD

var client  = mqtt.connect('mqtt://192.168.1.1');

 //When we connect, we're targeting the temperature sensor for the demo -
 //follow its data and error channels.
client.on('connect', function ()
{
  client.subscribe(dataChannel);
  client.subscribe(errorChannel);
  client.subscribe(alertChannel);
  myLCD.setColor(0,0,0);
});

client.on('message', function (topic, message)
{
  // message is Buffer
  if (topic == dataChannel)
  {
    //Print the new temperature to the LCD screen.
    myLCD.write("");
    lcdMessage = JSON.parse(message).value + " celsius";
    myLCD.setCursor(0,1);
    myLCD.write(lcdMessage);
  }
  if (topic == alertChannel)
  {

    //If it's too hot...
    if (JSON.parse(message).alert === "Hot") //If the temperature sensor is too hot...
    {
      //Set the screen color to red.
      myLCD.setColor(255,0,0);
    }
    //If it's too cold...
    if (JSON.parse(message).alert === "Cold" ) //If the temperature sensor is too cold...
    {
      //Set the screen color to blue
      myLCD.setColor(0,0,255);
   }
   //If it's too cold...
   if (JSON.parse(message).alert === "Ok" ) //If the temperature sensor is too cold...
   {
     //Set the screen color to blue
     myLCD.setColor(0,0,0);
   }
  }
  else if (topic == errorChannel)
  {
    if (message === "HotError" )   //If there's another error condition...
    {
      for (i = 0; i < 10; i++)
      {
        myLCD.setColor(0,0,0);
        setTimeout(function()
        {
          myLCD.setColor(255,0,0);
        }, 1000);
        delay(1000);
      }
    }
    if (message === "ColdError" )   //If there's another error condition...
    {
      for (i = 0; i < 10; i++)
      {
        myLCD.setColor(0,0,0);
        setTimeout(function()
        {
          myLCD.setColor(255,0,0);
        }, 1000);
        delay(1000);
      }
    }
});
