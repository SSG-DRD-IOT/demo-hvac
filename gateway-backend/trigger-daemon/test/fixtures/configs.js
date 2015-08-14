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
    test_config : {
        "mqtt" : {
            "uri" : "mqtt://localhost"
        },

        "mongodb" : {
            "uri" : "mongodb://localhost/iotdemo-test"
        },

        "debug" : {
            "level" : {
                "console" : "error",
                "file" : "error"
            }
        },

        "threshold" : {
            "temp_high" : 27,
            "temp_low" : 20,
            "sound" : 40,
            "light" : 700
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
