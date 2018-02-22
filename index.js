module.exports = function (sails) {

    var install = require('./lib/install.js');
    var config = require('./lib/config.js');

    return {
        install: install,
        config: config
    };
};
