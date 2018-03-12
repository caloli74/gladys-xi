module.exports = function (sails) {

    var install = require('./lib/install.js');
    var work = require('./lib/work.js');

    return {
        install: install,
        work: work
    };
};
