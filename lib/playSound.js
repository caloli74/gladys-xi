var gateway = require('./gateway.js');

module.exports = function playSound(sound) {

    return new Promise(function (resolve, reject) {
        var p1 = gladys.device.get({ service: "xiaomi-gateway" });
        var p2 = gladys.param.getValue('Xiaomi_password');

        Promise.all([p1, p2])
            .then((results) => {
                gateway('playSound', [results[0].identifier, results[1], sound])
                    .then((results) => {
                        return resolve('success');
                    })
                    .catch((err) => {
                        return reject(new Error(err));
                    })
            })
            .catch((err) => {
                return reject(new Error(err));
            });
    })
}