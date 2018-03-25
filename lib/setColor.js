var gateway = require('./gateway.js');

module.exports = function setColor(color) {

    return new Promise(function (resolve, reject) {
        var p1 = gladys.device.get({ service: "xiaomi-gateway" });
        var p2 = gladys.param.getValue('Xiaomi_password');

        Promise.all([p1, p2])
            .then((results) => {
                console.log(JSON.stringify(results[0]));
//                gateway('setColor', [results[0], results[1], color]);
                return resolve('success');
            })
            .catch((err) => {
                return reject(new Error(err));
            });
    })
}