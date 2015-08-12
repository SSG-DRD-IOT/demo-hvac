var azure = require('azure');
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var utils = require('./utils.js')
var logger = require('./logger.js');
var winston = require('winston');

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
    logger.remove(winston.transports.Console);
    logger.remove(winston.transports.File);
  }

  azureHub.prototype.createTriggerRules = function() {
    self.rules.forEach(function (entity, index, array) {
      logger.info(entity);

      self.svcBus.createSubscription(self.topic, entity.sub,
        function (error){
          if(!error){
            // subscription created
            utils.createRule(self.svcBus,
              azure.Constants.ServiceBusConstants.DEFAULT_RULE_NAME, entity);
              logger.info('Subscription '+ entity.sub + ' created');
            } else {
              if(error.statusCode == 409) {
                utils.createRule(
                  self.svcBus,
                  azure.Constants.ServiceBusConstants.DEFAULT_RULE_NAME,
                  entity,
                  self.topic);
                  logger.info('Subscription '+ entity.sub + ' created');
                } else {
                  logger.info('Subscription ' + entity.sub + ' failed');
                  logger.info(error);
                }
              }
            });

          });
        },

        azureHub.prototype.handlesForTriggerMessages = function(){
          self.rules.forEach(function (entity, index, array) {
            logger.info(entity.sub);
            setInterval(function(){
              self.getSubscriptionMessages(entity.sub); }, 2000);
          });
        },

        azureHub.prototype.getSubscriptionMessages = function(sub){
          self.svcBus.receiveSubscriptionMessage(self.topic, sub,
            { timeoutIntervalInS: 2 }, function(error, receivedMessage){
              if(!error){
                // Message received and deleted
                logger.info('Subscription Message received. Content:');
                logger.info(receivedMessage);
                self.emit(self.trigger, sub);
              } else {
                logger.info(error);
              }
            });
          }

          self.on('connect', function() {
            logger.info("Entered the connection function");

            self.svcBus = azure.createsvcBus(
              self.accessKey).withFilter(self.retryOperations);

              if(self.svcBus)
              logger.info('Service created successfully');
              logger.info('Topic: ' + self.topic);
              logger.info('Subscription: ' + self.sub);
              logger.info('Topic Options: ' + self.topicOptions);

              self.svcBus.createTopicIfNotExists(self.topic, self.topicOptions, function(error){
                if(!error){
                  // topic was created or exists
                  logger.info('Topic ' + self.topic + ' created or exists');
                } else {
                  logger.info('Topic ' + self.topic + ' failed');
                  logger.info(error);
                }
              });

              self.svcBus.createSubscription(self.topic, self.sub,
                function(error){
                  if(!error){
                    // subscription created
                    logger.info('Subscription for temp created');
                  } else {
                    if(error.statusCode == 409) {
                      logger.info('Subscription for temp already exists');
                    } else {
                      logger.info('Subscription ' + self.sub + ' failed');
                      logger.info(error); }
                    }
                  });

                  logger.info(self.rules);
                  self.createTriggerRules();
                  self.handlesForTriggerMessages();
                });

                self.on('write', function(data) {
                  self.message.customProperties.sensor_id = data.sensor_id;
                  self.message.body = 'Sensor readings: ';
                  self.message.customProperties.value = data.value;
                  self.message.customProperties.timestamp = data.timestamp;

                  self.svcBus.sendTopicMessage(self.topic, self.message, function(error) {
                    if (error) {
                      logger.info(error);
                    } else {
                      logger.info('sensor value: ' + self.message.customProperties.value);
                    }
                  });

                });


                self.on('read', function() {

                });

              }

              util.inherits(azureHub, EventEmitter);
              module.exports = azureHub;
