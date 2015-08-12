// Setup a logging system in this daemon
var winston = require('winston');

var config = {
    levels: {
        silly: 0,
        verbose: 1,
        info: 2,
        data: 3,
        warn: 4,
        debug: 5,
        error: 6
    },
    colors: {
        silly: 'magenta',
        verbose: 'cyan',
        info: 'green',
        data: 'grey',
        warn: 'yellow',
        debug: 'blue',
        error: 'red'
    }
};

var logger = new (winston.Logger)({
    levels: {
        trace: 0,
        input: 1,
        verbose: 2,
        prompt: 3,
        debug: 4,
        info: 5,
        data: 6,
        help: 7,
        warn: 8,
        error: 9
    },
    colors: {
        trace: 'magenta',
        input: 'grey',
        verbose: 'cyan',
        prompt: 'grey',
        debug: 'blue',
        info: 'green',
        data: 'grey',
        help: 'cyan',
        warn: 'yellow',
        error: 'red'
    },
    transports: [
        new (winston.transports.File)({
            prettyPrint: false,
            level: 'info',
            silent: false,
            colorize: true,
            timestamp: true,
            filename: './cloud-daemon.log',
            maxsize: 400000,
            maxFiles: 10,
            json: false
        }),
        new (winston.transports.Console)(
            {
                level: 'info',
                prettyPrint: true,
                colorize: true,
                silent: false,
                timestamp: false
            })
    ]
});

module.exports = logger;
