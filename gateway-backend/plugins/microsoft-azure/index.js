var azure = require('azure');
var util = require('util');
var EventEmitter = require('events').EventEmitter;


function azureHub(json){

  var self = this;
  self.config = json;
  self.accessKey = self.config.accessKey;
  self.retryOperations = new azure.ExponentialRetryPolicyFilter();
  self.topic = self.config.topic;
  self.message = {
    body: '',
    customProperties: {}
  }

  self.topicOptions = {
    MaxSizeInMegabytes: '5120',
    DefaultMessageTimeToLive: 'PT1H'
  };


  this.on('connect', function() {
    console.log("Entered the connection function");

    self.serviceBusService = azure.createServiceBusService(
      self.accessKey).withFilter(self.retryOperations);

      self.serviceBusService.createTopicIfNotExists('sensor', topicOptions, function(error){
        if(!error){
          // topic was created or exists
          console.log('Topic created or exists');
        }
      });

      self.serviceBusService.createSubscription('sensor', 'temp', function(error){
        if(!error){
          // subscription created
          console.log('Subscription for temp created');
          setInterval(sendMessage, 2000);
        } else{
          if(error.statusCode == 409){
            setInterval(sendMessage, 2000);
          }

          console.log(error);
        }
      });



      self.serviceBusService.createSubscription('sensor', 'threshold', function (error){
        if(!error){
          // subscription created
          rule.create();
          console.log('Subscription with rule created');
        } else {
          console.log(error);
        }
      });

      var rule = {
        deleteDefault: function(){
          self.serviceBusService.deleteRule('sensor',
          'threshold',
          azure.Constants.ServiceBusConstants.DEFAULT_RULE_NAME,
          rule.handleError);
        },
        create: function(){
          var ruleOptions = {
            sqlExpressionFilter: 'sensorvalue >= 100'
          };
          rule.deleteDefault();
          self.serviceBusService.createRule('sensor',
          'threshold',
          'thresholdFilter',
          ruleOptions,
          rule.handleError);
        },
        handleError: function(error){
          if(error){
            console.log(error)
          }
        }
      }



    });

    this.on('write', function(data) {
      self.message.customProperties.sensor_id = data.sensor_id;
      self.message.body = 'Temperature sensor readings: ' + messageCount;
      self.message.customProperties.value = data.value;
      self.message.customProperties.timestamp = data.timestamp;

      self.serviceBusService.sendTopicMessage(self.topic, self.message, function(error) {
        if (error) {
          console.log(error);
        } else {
          console.log('sensor value: ' + message.customProperties.value);
        }
      });

    });


    this.on('read', function() {

    });

  }

  util.inherits(azureHub, EventEmitter);
  module.exports = azureHub;
