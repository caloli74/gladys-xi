module.exports = function setDeviceState(data) {

    return new Promise(function (resolve, reject) {
        gladys.device.get({ service: "xiaomi-gateway" })
            .then((gatewayDevice) => {
                gladys.deviceType.getByDevice(gatewayDevice[0])
                    .then((results) => {
                        var p1, p2, p3, p4, p5, p6;
                        var DEVICE_INTENSITY, DEVICE_RED, DEVICE_GREEN, DEVICE_BLUE, DEVICE_BINARY, DEVICE_ILLUMINATION;

                        results.forEach(subDevice => {
                            switch (subDevice.type) {
                                case 'intensity':
                                    DEVICE_INTENSITY = subDevice.id;
                                    break;
                                case 'red':
                                    DEVICE_RED = subDevice.id;
                                    break;
                                case 'green':
                                    DEVICE_GREEN = subDevice.id;
                                    break;
                                case 'blue':
                                    DEVICE_BLUE = subDevice.id;
                                    break;
                                case 'binary':
                                    DEVICE_BINARY = subDevice.id;
                                    break;
                                case 'illumination':
                                    DEVICE_ILLUMINATION = subDevice.id;
                                    break;
                            }
                        });

                        p1 = gladys.deviceState.create({ devicetype: DEVICE_ILLUMINATION, value: data.illumination });
                        if (data.rgb === 0) {
                            p2 = gladys.deviceState.create({ devicetype: DEVICE_BINARY, value: 0 });
                            p3 = p4 = p5 = p6 = 1;
                        }
                        else {
                            p2 = gladys.deviceState.create({ devicetype: DEVICE_BINARY, value: 1 });
                            p3 = gladys.deviceState.create({ devicetype: DEVICE_INTENSITY, value: Math.trunc(data.rgb / Math.pow(2, 24)) });
                            p4 = gladys.deviceState.create({ devicetype: DEVICE_RED, value: Math.trunc((data.rgb % Math.pow(2, 24)) / Math.pow(2, 16)) });
                            p5 = gladys.deviceState.create({ devicetype: DEVICE_GREEN, value: Math.trunc((data.rgb % Math.pow(2, 16)) / Math.pow(2, 8)) });
                            p6 = gladys.deviceState.create({ devicetype: DEVICE_BLUE, value: data.rgb % Math.pow(2, 8) });
                        }

                        Promise.all([p1, p2, p3, p4, p5, p6])
                            .then((results) => {
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
    })
}