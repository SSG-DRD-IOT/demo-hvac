var triggerd_config_fixture = {
    default_config : {
        "mqtt" : {
            "uri" : "mqtt://localhost"
        },

        "mongodb" : {
            "uri" : "mongodb://localhost/iotdemo"
        },

        "debug" : {
            "level" : "error"
        }
    },
    config_1 : {
        "mqtt" : {
            "uri" : "mqtt://config_1"
        },

        "mongodb" : {
            "uri" : "mongodb://localhost/config_1"
        },

        "debug" : {
            "level" : "config_1"
        }
    }
};

module.exports = triggerd_config_fixture;
