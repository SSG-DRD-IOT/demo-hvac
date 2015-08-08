//Functions for MQTT Transportation of Data
//Requirements
var mqtt = require('mqtt');

exports.connectClient = function initialConnect(ip)
//Connects to an MQTT server @ 'ip'.  Returns the connected client.
{
    var client = mqtt.connect(ip);
    client.on('connect', function ()
              {
                  console.log("Connected to server.");
              });
    return client;
};

//Publishes an announcement string on the string channel
exports.publishAnnouncement = function publishAnnouncement(announceJSON, client)
{
    var channelTitle = "announcements";
    client.publish(channelTitle,announceJSON);
};

//Subscribes to the control channel on the gateway
exports.subscribeToControl = function subControl(channelTitle, client)
{
    //var channelTitle = gatewayDevID+'-control';
    client.subscribe(channelTitle);
};

exports.unsubToControl = function unsubControl (channelTitle, client)
{
    //var channelTitle = gatewayDevID+'-control';
    client.unsubscribe(channelTitle);
};

//Publishes data to the data channel.
exports.publishData = function publishData(devID, client, string)
{
    //Print to the server
    var channelTitle = "sensors/"+devID+"/data";
    client.publish(channelTitle, string);
    console.log("Published "+string+ " to "+devID);
};

//Publishes errors to the error channel.
exports.publishErrors = function publishData(devID, client, string)
{
    //Print to the server
    var topicTitle = "other/"+deviceID+"/errors";
    client.publish('data', string);
};

//Closes the connection
exports.closeConnect = function closeConnection(client)
{
    client.end();
};
