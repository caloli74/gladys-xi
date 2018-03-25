var playSound = require('./playSound.js');
var setColor = require('./setColor.js');

module.exports = function exec(params) {

    return new Promise(function (resolve, reject) {
        if (params.deviceType.type === 'red' ||
            params.deviceType.type === 'green' ||
            params.deviceType.type === 'blue') {
            return resolve('success');
        }

        if (params.deviceType.type === 'sound') {
            playSound(params.state.value)
                .then(() => {
                    return resolve('success');
                })
                .catch((err) => {
                    return reject(new Error(err));
                });
        }

        if (params.deviceType.type === 'intensity'
            || params.deviceType.type === 'binary') {
            gladys.device.get({ service: "xiaomi-gateway" })
                .then((gatewayDevice) => {
                    gladys.deviceType.getByDevice(gatewayDevice[0])
                        .then((results) => {
                            // load current colors & state
                            var color = { intensity: 0, r: 0, g: 0, b: 0 };
                            var onoff = 0;
                            results.forEach(subDevice => {
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

                            switch (params.deviceType.type) {
                                case 'intensity':
                                    color.intensity = params.state.value;
                                    break;
                                case 'binary':
                                    onoff = params.state.value;
                                    break;
                            }

                            if (onoff === 0)
                                color = { intensity: 0, r: 0, g: 0, b: 0 };

                            setColor(color)
                                .then(() => {
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
                .catch((err) => {
                    return reject(new Error(err));
                });
        }
    })
}