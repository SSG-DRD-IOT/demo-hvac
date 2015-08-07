var azure = require('azure');
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var utils = require('./utils.js')


function azureHub(json){

  var self = this;
  self.config = json;
  self.accessKey = 'Endpoint=sb://iotcloudeventhub.servicebus.windows.net/;SharedAccessKeyName=sa_gateway;SharedAccessKey=ftyKbwYvCuMaXxj9bi0VUr9OGptvqE5hBrht6mR5LfQ=';
  self.retryOperations = new azure.ExponentialRetryPolicyFilter();
  self.topic = self.config.topic;
  self.sub = self.config.subscription;
  self.message = self.config.messageBody;
  self.topicOptions = self.config.topicOptions;
  self.rules = self.config.rules;


  this.on('connect', function() {
    console.log("Entered the connection function");

    self.serviceBusService = azure.createServiceBusService(
      self.accessKey).withFilter(self.retryOperations);

      if(self.serviceBusService)
      console.log('Service created successfully');
      console.log('Topic: ' + self.topic);
      console.log('Subscription: ' + self.sub);
      console.log('Topic Options: ' + self.topicOptions);

      self.serviceBusService.createTopicIfNotExists(self.topic, self.topicOptions, function(error){
        if(!error){
          // topic was created or exists
          console.log('Topic ' + self.topic + ' created or exists');
        } else {
          console.log('Topic ' + self.topic + ' failed');
          console.log(error);
        }
      });

      self.serviceBusService.createSubscription(self.topic, self.sub,
        function(error){
          if(!error){
            // subscription created
            console.log('Subscription for temp created');
          } else {
            if(error.statusCode == 409) {
              console.log('Subscription for temp already exists');
            } else {
              console.log('Subscription ' + self.sub + ' failed');
              console.log(error); }
            }
          });

          console.log(self.rules);
          self.rules.forEach(function (entity, index, array) {
            console.log(entity);

            self.serviceBusService.createSubscription(self.topic, entity.sub,
              function (error){
                if(!error){
                  // subscription created
                  utils.createRule(self.serviceBusService,
                    azure.Constants.ServiceBusConstants.DEFAULT_RULE_NAME, entity);
                    console.log('Subscription '+ entity.sub + ' created');
                  } else {
                    if(error.statusCode == 409) {
                      utils.createRule(
                        self.serviceBusService,
                        azure.Constants.ServiceBusConstants.DEFAULT_RULE_NAME,
                        entity,
                        self.topic);
                        console.log('Subscription '+ entity.sub + ' created');
                      } else {
                        console.log('Subscription ' + entity.sub + ' failed');
                        console.log(error);
                      }
                    }
                  });

                });



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
