module.exports = function (sails) {

    var install = require('./lib/install.js');
    var exec = require('./lib/exec.js');
    var work = require('./lib/work.js');

    return {
        install: install,
        exec: exec,
        work: work
    };
};