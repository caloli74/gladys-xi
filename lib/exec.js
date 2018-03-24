var gateway = require('./gateway.js');

module.exports = function exec(params) {

    return new Promise(function (resolve, reject) {
        gladys.device.get({ service: "xiaomi-gateway" })
            .then((gatewayDevice) => {
                var p1 = gladys.deviceType.getByDevice(gatewayDevice[0]);
                var p2 = gladys.param.getValue('Xiaomi_password');

                Promise.all([p1, p2])
                    .then((results) => {
                        var color = { intensity: 0, r: 0, g: 0, b: 0 };
                        var onoff = 0;
                        results[0].forEach(subDevice => {
                            if (subDevice.lastValue) {
                                switch (subDevice.type) {
                                    case 'intensity':
                                        color.intensity = subDevice.lastValue;
                                        break;
                                    case 'red':
                                        color.r = subDevice.lastValue;
                                        break;
                                    case 'green':
                                        color.g = subDevice.lastValue;
                                        break;
                                    case 'blue':
                                        color.b = subDevice.lastValue;
                                        break;
                                    case 'binary':
                                        onoff = subDevice.lastValue;
                                        break;
                                }
                            }
                        });
                        if (params.deviceType.type === 'intensity' && onoff === 1) {
                            color.intensity = params.state.value;
                            gateway('setColor', [params.deviceType.identifier, results[1], color]);
                        }

                        if (params.deviceType.type === 'binary' && params.state.value === 1)
                            gateway('setColor', [params.deviceType.identifier, results[1], color]);

                        if (params.deviceType.type === 'binary' && params.state.value === 0)
                            gateway('setColor', [params.deviceType.identifier, results[1], { intensity: 0, r: 0, g: 0, b: 0 }]);

                        return resolve('success');
                    })
                    .catch((err) => {
                        return reject(new Error(err));
                    });
            })
            .catch((err) => {
                return reject(new Error(err));
            });
    })
}