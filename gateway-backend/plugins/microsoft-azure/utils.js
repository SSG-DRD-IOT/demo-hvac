
module.exports = {
    //Retrieve the topic for listening to a device's data given a specific device ID.

      deleteRule: function(svcBus, topic, sub, defaultRule){
        svcBus.deleteRule(topic,
        sub,
        defaultRule,
        this.handleError);
      },

      handleError: function(error){
        if(error){
          if(error.statusCode != 409)
          console.log(error)
        }
      },

      createRule: function(svcBus, defaultRule, entity, topic) {
            this.deleteRule(svcBus, topic, entity.sub, defaultRule);
            svcBus.createRule(topic,
            entity.sub,
            entity.sub+'Filter',
            entity.options,
            this.handleError);
      }

};

// { id: 2,
//   name: 'LampON',
//   sensor_id: 1,
//   actuator_id: 2,
//   condition: '<75',
//   triggerFunc: 'on',
//   active: 'true' }
