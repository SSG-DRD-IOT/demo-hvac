module.exports = {
    //Retrieve the topic for listening to a device's data given a specific device ID.
    dataTopic: function (id) {
        return "sensors/" + id + "/data";
    },

    //Retrieve the topic for sending control messages to a device given a specific
    //device id.
    controlTopic: function (id) {
        return "actuators/" + id + "/control";
    },

    //Retrieve the topic for sending error messages to a device given a specific
    //device id.
    errorTopic: function (id) {
        return "other/" + id + "/errors";
    },

    //Get a device id from a topic.
    getID: function (topic) {
        return topic.substr(8, 32);
    },

    //Get the type of data being parsed from an announcement.
    getType: function (topic) {
        return topic.substr(42, topic.length);
    },

    isSensorTopic: function(str) {
        return str.match(/sensors\/[A-Za-z0-9]{0,32}\/data/);
    },

    isTriggerTopic: function(str) {
        return str.match(/trigger\/data/);
    },

    isRefreshTopic: function(str) {
        return str.match(/trigger\/refresh/);
    }

};

// { id: 2,
//   name: 'LampON',
//   sensor_id: 1,
//   actuator_id: 2,
//   condition: '<75',
//   triggerFunc: 'on',
//   active: 'true' }
