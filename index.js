module.exports = function (sails) {

    var shared = require('./lib/shared.js');
    var listen = require('./lib/listen.js');
    var install = require('./lib/install.js');
    var exec = require('./lib/exec.js');
    var setColor = require('./lib/setColor.js');
    var playSound = require('./lib/playSound.js');

    gladys.on('ready', function(){
        //listen();
    });

    return {
        shared: shared,
        install: install,
        exec: exec,
        setColor: setColor,
        playSound: playSound
    };
};