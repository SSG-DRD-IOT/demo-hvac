var azure = require('azure');
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var utils = require('./utils.js')
var logger = require('./logger.js');

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
  self.trigger = self.config.trigger;

  if(self.config.debug != "true") {
    logger.remove(winston.transports.logger);
    logger.remove(winston.transports.File);
  }

  azureHub.prototype.createTriggerRules = function() {
    self.rules.forEach(function (entity, index, array) {
      logger.log(entity);

      self.serviceBusService.createSubscription(self.topic, entity.sub,
        function (error){
          if(!error){
            // subscription created
            utils.createRule(self.serviceBusService,
              azure.Constants.ServiceBusConstants.DEFAULT_RULE_NAME, entity);
              logger.log('Subscription '+ entity.sub + ' created');
            } else {
              if(error.statusCode == 409) {
                utils.createRule(
                  self.serviceBusService,
                  azure.Constants.ServiceBusConstants.DEFAULT_RULE_NAME,
                  entity,
                  self.topic);
                  logger.log('Subscription '+ entity.sub + ' created');
                } else {
                  logger.log('Subscription ' + entity.sub + ' failed');
                  logger.log(error);
                }
              }
            });

          });
        },

        azureHub.prototype.handlesForTriggerMessages = function(){
          self.rules.forEach(function (entity, index, array) {
            logger.log(entity.sub);
            setInterval(function(){
              self.getSubscriptionMessages(entity.sub); }, 2000);
          });
        },

        azureHub.prototype.getSubscriptionMessages = function(sub){
          self.serviceBusService.receiveSubscriptionMessage(self.topic, sub,
            { timeoutIntervalInS: 2 }, function(error, receivedMessage){
              if(!error){
                // Message received and deleted
                console.log('****************** ' + sub + ' ********************');
                console.log('Subscription Message received. Content:');
                console.log(receivedMessage);
                self.emit(self.trigger, receivedMessage);
              } else {
                console.log(error);
              }
            });
          }

          self.on('connect', function() {
            logger.log("Entered the connection function");

            self.serviceBusService = azure.createServiceBusService(
              self.accessKey).withFilter(self.retryOperations);

              if(self.serviceBusService)
              logger.log('Service created successfully');
              logger.log('Topic: ' + self.topic);
              logger.log('Subscription: ' + self.sub);
              logger.log('Topic Options: ' + self.topicOptions);

              self.serviceBusService.createTopicIfNotExists(self.topic, self.topicOptions, function(error){
                if(!error){
                  // topic was created or exists
                  logger.log('Topic ' + self.topic + ' created or exists');
                } else {
                  logger.log('Topic ' + self.topic + ' failed');
                  logger.log(error);
                }
              });

              self.serviceBusService.createSubscription(self.topic, self.sub,
                function(error){
                  if(!error){
                    // subscription created
                    logger.log('Subscription for temp created');
                  } else {
                    if(error.statusCode == 409) {
                      logger.log('Subscription for temp already exists');
                    } else {
                      logger.log('Subscription ' + self.sub + ' failed');
                      logger.log(error); }
                    }
                  });

                  logger.log(self.rules);
                  self.createTriggerRules();
                  self.handlesForTriggerMessages();
                });

                self.on('write', function(data) {
                  self.message.customProperties.sensor_id = data.sensor_id;
                  self.message.body = 'Sensor readings: ';
                  self.message.customProperties.value = data.value;
                  self.message.customProperties.timestamp = data.timestamp;

                  self.serviceBusService.sendTopicMessage(self.topic, self.message, function(error) {
                    if (error) {
                      logger.log(error);
                    } else {
                      logger.log('sensor value: ' + self.message.customProperties.value);
                    }
                  });

                });


                self.on('read', function() {

                });

              }

              util.inherits(azureHub, EventEmitter);
              module.exports = azureHub;
