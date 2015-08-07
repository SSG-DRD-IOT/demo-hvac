
module.exports = {
    //Retrieve the topic for listening to a device's data given a specific device ID.

      deleteRule: function(svcBus, topic, sub, defaultRule){
        console.log('In Delete Rule');
        svcBus.deleteRule(topic,
        sub,
        defaultRule,
        this.handleError);
      },

      handleError: function(error){
      console.log('In Handle Error');
        if(error){
          console.log(error)
        }
      },

      createRule: function(svcBus, defaultRule, entity, topic) {
            console.log('In Create Rule');
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
