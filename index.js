module.exports = function (sails) {

    var command = require('./lib/command.js');
    var install = require('./lib/install.js');
    var exec = require('./lib/exec.js');
    var work = require('./lib/work.js');

    return {
        command: command,
        install: install,
        exec: exec,
        work: work
    };
};
