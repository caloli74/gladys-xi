module.exports = function (sails) {

    var gateway = require('./lib/gateway.js');
    var install = require('./lib/install.js');
    var init = require('./lib/init.js');
    var exec = require('./lib/exec.js');
    var work = require('./lib/work.js');
    var listen = require('./lib/listen.js');

    gladys.on('ready', function(){
        listen();
    });

    return {
        gateway: gateway,
        install: install,
        init: init,
        exec: exec,
        work: work
    };
};
