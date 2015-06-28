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
    }
};
