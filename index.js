module.exports = function (sails) {

    var gateway = require('./lib/gateway.js');
    var listen = require('./lib/listen.js');
    var install = require('./lib/install.js');
    var exec = require('./lib/exec.js');

    gladys.on('ready', function(){
        listen();
    });

    return {
        gateway: gateway,
        install: install,
        exec: exec
    };
};