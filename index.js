module.exports = function (sails) {

    var gateway = require('./lib/gateway.js');
    var listen = require('./lib/listen.js');
    var install = require('./lib/install.js');
    var exec = require('./lib/exec.js');
    var init = require('./lib/init.js');
    var work = require('./lib/work.js');
    var gateway2 = require('./lib/gateway2.js');

    gladys.on('ready', function(){
        listen();
    });

    return {
        gateway: gateway,
        install: install,
        exec: exec,
        init: init,
        work: work,
        gateway2: gateway2
    };
};
