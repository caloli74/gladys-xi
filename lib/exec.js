var gateway = require('./gateway.js');

module.exports = function exec(params) {

    return new Promise(function (resolve, reject) {
        var p1 = gladys.device.get({ service: "xi" });
        var p2 = gladys.param.getValue('Xiaomi_password');

        Promise.all([p1, p2])
            .then((results) => {
                if (params.deviceType.type === 'binary') {
                    if (params.state.value === 1)
                        gateway('setColor', [params.deviceType.identifier, results[1], { intensity: 100, r: 0, g: 0, b: 255 }])
                    else
                        gateway('setColor', [params.deviceType.identifier, results[1], { intensity: 0, r: 0, g: 0, b: 0 }])
                }
                return resolve('success');
            })
            .catch((err) => {
                return reject(new Error(err));
            });

        console.log('exec ' + JSON.stringify(params));
    })
}