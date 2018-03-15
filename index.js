module.exports = function (sails) {

    var install = require('./lib/install.js');
    var exec = require('./lib/exec.js');
    var work = require('./lib/work.js');
    var work2 = require('./lib/work2.js');

    return {
        install: install,
        exec: exec,
        work: work,
        work2: work2
    };
};
