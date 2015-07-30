//LCD with RGB Backlight\\

//Requirements
var LCD  = require ('jsupm_i2clcd'); // Required to access the LCD panel

//Variables
var myLCD = new LCD.Jhd1313m1(6, 0x3E, 0x62);

exports.writeData = function write (string) {
  //Print to the LCD screen
  myLCD.setCursor(0,1);
  myLCD.write(string);
}
